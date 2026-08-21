import { z } from "zod";

export const userRoleSchema = z.enum(["photographer", "admin"]);
export type UserRole = z.infer<typeof userRoleSchema>;

export const galleryVisibilitySchema = z.enum([
  "public",
  "private",
  "client-review",
]);
export type GalleryVisibility = z.infer<typeof galleryVisibilitySchema>;

export const photoStatusSchema = z.enum([
  "pending",
  "uploading",
  "verifying",
  "ready",
  "failed",
  "deleted",
]);
export type PhotoStatus = z.infer<typeof photoStatusSchema>;

export const cursorSchema = z.string().min(1).max(128);

export const pageSizeSchema = z.coerce.number().int().min(1).max(50).default(24);

export const apiErrorSchema = z.object({
  code: z.string(),
  message: z.string(),
  requestId: z.string().optional(),
});

export type ApiError = z.infer<typeof apiErrorSchema>;

export type ApiResponse<T> =
  | { data: T; error?: never }
  | { data?: never; error: ApiError };