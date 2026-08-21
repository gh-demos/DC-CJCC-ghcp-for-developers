import { NextRequest } from "next/server";
import { ZodError } from "zod";
import { uploadIntentSchema } from "@/lib/contracts";
import { AuthorizationError } from "@/lib/auth/authorization";
import { jsonData, jsonError } from "@/lib/http";
import { initializeUpload, UploadValidationError } from "@/lib/uploads/service";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const input = uploadIntentSchema.parse(await request.json());
    return jsonData(await initializeUpload(input), { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return jsonError(400, "INVALID_UPLOAD_INTENT", "The upload request is invalid.");
    }

    if (error instanceof AuthorizationError) {
      return jsonError(403, "FORBIDDEN", error.message);
    }

    if (error instanceof UploadValidationError) {
      return jsonError(422, "UPLOAD_REJECTED", error.message);
    }

    console.error("Failed to initialize upload", error);
    return jsonError(500, "UPLOAD_INITIALIZATION_FAILED", "Unable to initialize the upload.");
  }
}