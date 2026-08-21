import { z } from "zod";
import {
  cursorSchema,
  galleryVisibilitySchema,
  pageSizeSchema,
  photoStatusSchema,
} from "./common";

export const tagSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(1)
  .max(48)
  .regex(/^[a-z0-9-]+$/, "Tags may use lowercase letters, numbers, and hyphens.");

export const photoSchema = z.object({
  id: z.string().cuid(),
  title: z.string().trim().min(1).max(160),
  description: z.string().trim().max(2_000).nullable(),
  storageUrl: z.string().url(),
  mimeType: z.string(),
  bytes: z.number().int().nonnegative(),
  width: z.number().int().positive().nullable(),
  height: z.number().int().positive().nullable(),
  status: photoStatusSchema,
  visibility: galleryVisibilitySchema,
  tags: z.array(tagSchema),
  createdAt: z.coerce.date(),
});

export type Photo = z.infer<typeof photoSchema>;

export const photoQuerySchema = z.object({
  q: z.string().trim().max(120).optional(),
  tag: tagSchema.optional(),
  cursor: cursorSchema.optional(),
  pageSize: pageSizeSchema,
});

export type PhotoQuery = z.infer<typeof photoQuerySchema>;

export const photoPageSchema = z.object({
  items: z.array(photoSchema),
  nextCursor: cursorSchema.nullable(),
});

export type PhotoPage = z.infer<typeof photoPageSchema>;