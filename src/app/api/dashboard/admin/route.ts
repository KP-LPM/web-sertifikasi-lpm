import { NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { sendResponse } from "@/lib/response";
import { authOptions } from "@/lib/auth-options";
import { rateLimitApi, RateLimitError } from "@/lib/rate-limit";
import { ClientError } from "@/error/index";
import { dashboardService } from "@/services/dashboard.service";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export async function GET(request: NextRequest) {
  try {
    rateLimitApi(request, {
      limit: 60,
      windowMs: 60 * 1000,
      key: "get-dashboard-admin",
    });
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
      return sendResponse(
        403,
        "Akses ditolak. Hanya admin yang dapat melihat dashboard admin.",
      );
    }

    const data = await dashboardService.getAdminDashboard();

    return sendResponse(
      200,
      "Berhasil mengambil data dashboard admin",
      data,
    );
  } catch (error) {
    if (error instanceof RateLimitError) {
      return sendResponse(error.status, "Terlalu banyak permintaan.");
    }
    if (error instanceof ClientError) {
      return sendResponse(error.statusCode, error.message);
    }
    console.error("[GET /api/dashboard/admin]", error);
    return sendResponse(
      500,
      "Terjadi kesalahan saat mengambil data dashboard admin",
    );
  }
}
