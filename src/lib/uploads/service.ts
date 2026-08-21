import { del, head } from "@vercel/blob";
import { generateClientTokenFromReadWriteToken } from "@vercel/blob/client";
import { AuditAction, PhotoStatus } from "@prisma/client";
import sharp from "sharp";
import {
  allowedImageMimeTypes,
  type UploadCompletion,
  type UploadIntent,
  uploadMetadataSchema,
} from "@/lib/contracts";
import { AuthorizationError, requireOwnedGallery } from "@/lib/auth/authorization";
import { db } from "@/lib/db";
import { uploadConfig } from "@/lib/uploads/config";

export class UploadValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UploadValidationError";
  }
}

function getExtension(mimeType: (typeof allowedImageMimeTypes)[number]) {
  return mimeType === "image/jpeg"
    ? "jpg"
    : mimeType === "image/png"
      ? "png"
      : "webp";
}

function createStorageKey(ownerId: string, mimeType: (typeof allowedImageMimeTypes)[number]) {
  return `photos/${ownerId}/${crypto.randomUUID()}.${getExtension(mimeType)}`;
}

export async function initializeUpload(input: UploadIntent) {
  if (input.bytes > uploadConfig.maximumFileBytes) {
    throw new UploadValidationError("The selected file exceeds the maximum upload size.");
  }

  const { user, gallery } = await requireOwnedGallery(input.galleryId);

  const existingUpload = await db.upload.findUnique({
    where: { idempotencyKey: input.idempotencyKey },
  });

  if (existingUpload && existingUpload.ownerId !== user.id) {
    throw new AuthorizationError();
  }

  if (existingUpload && existingUpload.status === PhotoStatus.READY) {
    return {
      uploadId: existingUpload.id,
      storageKey: existingUpload.storageKey,
      token: "",
      expiresAt: existingUpload.expiresAt,
    };
  }

  const expiresAt = new Date(Date.now() + uploadConfig.tokenLifetimeMs);
  const upload = existingUpload ?? await db.upload.create({
    data: {
      ownerId: user.id,
      galleryId: gallery.id,
      idempotencyKey: input.idempotencyKey,
      storageKey: createStorageKey(user.id, input.mimeType),
      originalName: input.fileName,
      mimeType: input.mimeType,
      expectedBytes: input.bytes,
      metadata: {
        title: input.title,
        description: input.description,
        visibility: input.visibility,
        tags: input.tags,
      },
      expiresAt,
      status: PhotoStatus.UPLOADING,
    },
  });

  const token = await generateClientTokenFromReadWriteToken({
    pathname: upload.storageKey,
    token: process.env.BLOB_READ_WRITE_TOKEN,
    allowedContentTypes: [...allowedImageMimeTypes],
    maximumSizeInBytes: uploadConfig.maximumFileBytes,
    validUntil: expiresAt.getTime(),
    allowOverwrite: false,
    addRandomSuffix: false,
  });

  await db.auditLog.create({
    data: {
      actorId: user.id,
      action: AuditAction.UPLOAD_INITIALIZED,
      entityId: upload.id,
    },
  });

  return {
    uploadId: upload.id,
    storageKey: upload.storageKey,
    token,
    expiresAt,
  };
}

export async function completeUpload(input: UploadCompletion) {
  const upload = await db.upload.findUnique({ where: { id: input.uploadId } });

  if (!upload || upload.idempotencyKey !== input.idempotencyKey) {
    throw new AuthorizationError();
  }

  const { user } = await requireOwnedGallery(upload.galleryId);

  if (upload.status === PhotoStatus.READY && upload.photoId) {
    return { photoId: upload.photoId, status: "ready" as const };
  }

  if (upload.expiresAt < new Date()) {
    throw new UploadValidationError("This upload authorization has expired.");
  }

  let blob: Awaited<ReturnType<typeof head>> | undefined;

  try {
    const verifiedBlob = await head(input.blobUrl, {
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    blob = verifiedBlob;

    if (
      verifiedBlob.pathname !== upload.storageKey ||
      verifiedBlob.size !== upload.expectedBytes ||
      verifiedBlob.contentType !== upload.mimeType
    ) {
      throw new UploadValidationError("The uploaded file does not match its authorization.");
    }

    const imageResponse = await fetch(verifiedBlob.url);
    const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());
    const metadata = await sharp(imageBuffer, { failOn: "error" }).metadata();

    if (!metadata.width || !metadata.height || !metadata.format) {
      throw new UploadValidationError("The uploaded file is not a valid image.");
    }

    const metadataInput = uploadMetadataSchema.parse(upload.metadata);
    const photo = await db.$transaction(async (transaction) => {
      const createdPhoto = await transaction.photo.create({
        data: {
          ownerId: user.id,
          storageKey: upload.storageKey,
          storageUrl: verifiedBlob.url,
          originalName: upload.originalName,
          mimeType: upload.mimeType,
          bytes: verifiedBlob.size,
          width: metadata.width,
          height: metadata.height,
          title: metadataInput.title,
          description: metadataInput.description ?? null,
          visibility: metadataInput.visibility.toUpperCase().replace("-", "_") as "PUBLIC" | "PRIVATE" | "CLIENT_REVIEW",
          status: PhotoStatus.READY,
          galleries: { create: { galleryId: upload.galleryId } },
          tags: {
            create: metadataInput.tags.map((name) => ({
              tag: { connectOrCreate: { where: { name }, create: { name } } },
            })),
          },
        },
      });

      await transaction.upload.update({
        where: { id: upload.id },
        data: {
          photoId: createdPhoto.id,
          status: PhotoStatus.READY,
          completedAt: new Date(),
        },
      });

      await transaction.auditLog.create({
        data: {
          actorId: user.id,
          action: AuditAction.UPLOAD_COMPLETED,
          entityId: createdPhoto.id,
        },
      });

      return createdPhoto;
    });

    return { photoId: photo.id, status: "ready" as const };
  } catch (error) {
    if (blob?.pathname === upload.storageKey) {
      await del(blob.url, { token: process.env.BLOB_READ_WRITE_TOKEN }).catch(() => undefined);
    }

    await db.upload.update({
      where: { id: upload.id },
      data: { status: PhotoStatus.FAILED },
    });
    await db.auditLog.create({
      data: {
        actorId: user.id,
        action: AuditAction.UPLOAD_REJECTED,
        entityId: upload.id,
      },
    });

    throw error;
  }
}