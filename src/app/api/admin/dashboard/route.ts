import { AuthorizationError } from "@/lib/auth/authorization";
import { getAdminDashboard } from "@/lib/admin/service";
import { jsonData, jsonError } from "@/lib/http";

export async function GET() {
  try {
    return jsonData(await getAdminDashboard());
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return jsonError(403, "FORBIDDEN", error.message);
    }

    console.error("Failed to load admin dashboard", error);
    return jsonError(500, "ADMIN_DASHBOARD_FAILED", "Unable to load the dashboard.");
  }
}