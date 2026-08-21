import { NextResponse } from "next/server";
import type { ApiError, ApiResponse } from "@/lib/contracts";

export function jsonData<T>(data: T, init?: ResponseInit) {
  return NextResponse.json<ApiResponse<T>>({ data }, init);
}

export function jsonError(
  status: number,
  code: string,
  message: string,
  requestId?: string,
) {
  const error: ApiError = { code, message, requestId };
  return NextResponse.json<ApiResponse<never>>({ error }, { status });
}