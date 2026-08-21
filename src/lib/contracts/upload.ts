import { z } from "zod";
import { galleryVisibilitySchema, photoStatusSchema } from "./common";
import { tagSchema } from "./photo";

export const allowedImageMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const uploadIntentSchema = z.object({
  galleryId: z.string().cuid(),
  fileName: z.string().trim().min(1).max(255),
  mimeType: z.enum(allowedImageMimeTypes),
  bytes: z.number().int().positive(),
  title: z.string().trim().min(1).max(160),
  description: z.string().trim().max(2_000).optional(),
  visibility: galleryVisibilitySchema,
  tags: z.array(tagSchema).max(12).default([]),
  idempotencyKey: z.string().uuid(),
});

export type UploadIntent = z.infer<typeof uploadIntentSchema>;

export const uploadMetadataSchema = uploadIntentSchema.pick({
  title: true,
  description: true,
  visibility: true,
  tags: true,
});

export type UploadMetadata = z.infer<typeof uploadMetadataSchema>;

export const uploadInstructionSchema = z.object({
  uploadId: z.string().cuid(),
  storageKey: z.string().min(1),
  token: z.string().min(1),
  expiresAt: z.coerce.date(),
});

export type UploadInstruction = z.infer<typeof uploadInstructionSchema>;

export const uploadCompletionSchema = z.object({
  uploadId: z.string().cuid(),
  blobUrl: z.string().url(),
  idempotencyKey: z.string().uuid(),
});

export type UploadCompletion = z.infer<typeof uploadCompletionSchema>;

export const uploadSchema = z.object({
  id: z.string().cuid(),
  status: photoStatusSchema,
  expiresAt: z.coerce.date(),
  completedAt: z.coerce.date().nullable(),
});

export type Upload = z.infer<typeof uploadSchema>;