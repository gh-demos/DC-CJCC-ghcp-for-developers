import { z } from "zod";
import { galleryVisibilitySchema } from "./common";

export const gallerySchema = z.object({
  id: z.string().cuid(),
  ownerId: z.string().cuid(),
  name: z.string().trim().min(1).max(120),
  slug: z.string().trim().min(1).max(140),
  description: z.string().trim().max(2_000).nullable(),
  visibility: galleryVisibilitySchema,
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type Gallery = z.infer<typeof gallerySchema>;

export const createGallerySchema = gallerySchema
  .pick({ name: true, description: true, visibility: true })
  .extend({
    description: z.string().trim().max(2_000).optional(),
  });

export type CreateGalleryInput = z.infer<typeof createGallerySchema>;