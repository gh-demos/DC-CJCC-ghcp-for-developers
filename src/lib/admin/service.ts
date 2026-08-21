import { PhotoStatus } from "@prisma/client";
import { requireRole } from "@/lib/auth/authorization";
import { db } from "@/lib/db";

export async function getAdminDashboard() {
  await requireRole("ADMIN");

  const [totalPhotos, activeGalleries, clientProjects, recentGalleries] = await Promise.all([
    db.photo.count({ where: { status: PhotoStatus.READY, deletedAt: null } }),
    db.gallery.count(),
    db.gallery.count({ where: { visibility: "CLIENT_REVIEW" } }),
    db.gallery.findMany({
      take: 10,
      orderBy: { updatedAt: "desc" },
      include: {
        _count: { select: { photos: true } },
      },
    }),
  ]);

  return {
    stats: {
      totalPhotos,
      activeGalleries,
      clientProjects,
    },
    recentGalleries: recentGalleries.map((gallery) => ({
      id: gallery.id,
      name: gallery.name,
      visibility: gallery.visibility.toLowerCase().replace("_", "-"),
      photoCount: gallery._count.photos,
      updatedAt: gallery.updatedAt,
    })),
  };
}