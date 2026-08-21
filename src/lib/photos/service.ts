import { GalleryVisibility, PhotoStatus, Prisma } from "@prisma/client";
import type { PhotoPage, PhotoQuery } from "@/lib/contracts";
import { db } from "@/lib/db";

export async function listPublicPhotos(query: PhotoQuery): Promise<PhotoPage> {
  const where: Prisma.PhotoWhereInput = {
    visibility: GalleryVisibility.PUBLIC,
    status: PhotoStatus.READY,
    deletedAt: null,
    ...(query.q
      ? {
          OR: [
            { title: { contains: query.q, mode: "insensitive" } },
            { description: { contains: query.q, mode: "insensitive" } },
            { tags: { some: { tag: { name: { contains: query.q, mode: "insensitive" } } } } },
          ],
        }
      : {}),
    ...(query.tag ? { tags: { some: { tag: { name: query.tag } } } } : {}),
  };

  const photos = await db.photo.findMany({
    where,
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    take: query.pageSize + 1,
    ...(query.cursor ? { cursor: { id: query.cursor }, skip: 1 } : {}),
    include: { tags: { include: { tag: true } } },
  });

  const hasMore = photos.length > query.pageSize;
  const items = hasMore ? photos.slice(0, -1) : photos;

  return {
    items: items.map((photo) => ({
      id: photo.id,
      title: photo.title,
      description: photo.description,
      storageUrl: photo.storageUrl,
      mimeType: photo.mimeType,
      bytes: photo.bytes,
      width: photo.width,
      height: photo.height,
      status: photo.status.toLowerCase() as "ready",
      visibility: photo.visibility.toLowerCase().replace("_", "-") as "public",
      tags: photo.tags.map(({ tag }) => tag.name),
      createdAt: photo.createdAt,
    })),
    nextCursor: hasMore ? items.at(-1)?.id ?? null : null,
  };
}