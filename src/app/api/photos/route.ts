import { NextRequest } from "next/server";
import { ZodError } from "zod";
import { photoQuerySchema } from "@/lib/contracts";
import { jsonData, jsonError } from "@/lib/http";
import { listPublicPhotos } from "@/lib/photos/service";

export async function GET(request: NextRequest) {
  try {
    const input = photoQuerySchema.parse({
      q: request.nextUrl.searchParams.get("q") ?? undefined,
      tag: request.nextUrl.searchParams.get("tag") ?? undefined,
      cursor: request.nextUrl.searchParams.get("cursor") ?? undefined,
      pageSize: request.nextUrl.searchParams.get("pageSize") ?? undefined,
    });

    return jsonData(await listPublicPhotos(input));
  } catch (error) {
    if (error instanceof ZodError) {
      return jsonError(400, "INVALID_PHOTO_QUERY", "The photo query is invalid.");
    }

    console.error("Failed to list public photos", error);
    return jsonError(500, "PHOTO_QUERY_FAILED", "Unable to load photos.");
  }
}