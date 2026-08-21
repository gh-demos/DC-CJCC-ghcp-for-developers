import { auth, currentUser } from "@clerk/nextjs/server";
import { UserRole } from "@prisma/client";
import { db } from "@/lib/db";

export class AuthorizationError extends Error {
  constructor(message = "You are not authorized to perform this action.") {
    super(message);
    this.name = "AuthorizationError";
  }
}

export async function requireAuthenticatedUser() {
  const { userId } = await auth();

  if (!userId) {
    throw new AuthorizationError("Authentication is required.");
  }

  const user = await db.user.findUnique({ where: { clerkId: userId } });

  if (!user) {
    throw new AuthorizationError("Your account has not been provisioned yet.");
  }

  return user;
}

export async function provisionCurrentUser() {
  const { userId } = await auth();

  if (!userId) {
    throw new AuthorizationError("Authentication is required.");
  }

  const clerkUser = await currentUser();
  const email = clerkUser?.primaryEmailAddress?.emailAddress;

  if (!email) {
    throw new AuthorizationError("A primary email address is required.");
  }

  return db.user.upsert({
    where: { clerkId: userId },
    create: { clerkId: userId, email },
    update: { email },
  });
}

export async function requireRole(role: UserRole) {
  const user = await requireAuthenticatedUser();

  if (user.role !== role) {
    throw new AuthorizationError();
  }

  return user;
}

export async function requireOwnedGallery(galleryId: string) {
  const user = await requireAuthenticatedUser();
  const gallery = await db.gallery.findUnique({ where: { id: galleryId } });

  if (!gallery || (user.role !== UserRole.ADMIN && gallery.ownerId !== user.id)) {
    throw new AuthorizationError();
  }

  return { user, gallery };
}

export async function requireOwnedPhoto(photoId: string) {
  const user = await requireAuthenticatedUser();
  const photo = await db.photo.findUnique({ where: { id: photoId } });

  if (!photo || (user.role !== UserRole.ADMIN && photo.ownerId !== user.id)) {
    throw new AuthorizationError();
  }

  return { user, photo };
}