import { NextRequest } from "next/server";
import { ZodError } from "zod";
import { uploadCompletionSchema } from "@/lib/contracts";
import { AuthorizationError } from "@/lib/auth/authorization";
import { jsonData, jsonError } from "@/lib/http";
import { completeUpload, UploadValidationError } from "@/lib/uploads/service";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const input = uploadCompletionSchema.parse(await request.json());
    return jsonData(await completeUpload(input));
  } catch (error) {
    if (error instanceof ZodError) {
      return jsonError(400, "INVALID_UPLOAD_COMPLETION", "The upload completion request is invalid.");
    }

    if (error instanceof AuthorizationError) {
      return jsonError(403, "FORBIDDEN", error.message);
    }

    if (error instanceof UploadValidationError) {
      return jsonError(422, "UPLOAD_REJECTED", error.message);
    }

    console.error("Failed to complete upload", error);
    return jsonError(500, "UPLOAD_COMPLETION_FAILED", "Unable to complete the upload.");
  }
}