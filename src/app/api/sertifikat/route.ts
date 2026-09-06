import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { sertifikatService } from "@/services/sertifikat.service";
import { sendResponse } from "@/lib/response";
import { ClientError } from "@/error/index";
import { rateLimitApi, RateLimitError } from "@/lib/rate-limit";

export const revalidate = 3600;

export async function GET(request: NextRequest) {
  try {
    rateLimitApi(request, {
      limit: 60,
      windowMs: 60 * 1000,
      key: "get-all-sertifikat",
    });

    const token = await getToken({ req: request });
    if (!token || token.role !== "admin")
      return sendResponse(403, "Akses ditolak");

    const { searchParams } = new URL(request.url);
    const filters = {
      status: searchParams.get("status") || undefined,
      skemaId: searchParams.get("skema_id")
        ? Number(searchParams.get("skema_id"))
        : undefined,
      tanggal: searchParams.get("tanggal")
        ? new Date(searchParams.get("tanggal") as string)
        : undefined,
    };

    const list = await sertifikatService.getAll(filters);
    return sendResponse(200, "Berhasil mengambil daftar sertifikat", list);
  } catch (error) {
    if (error instanceof RateLimitError) {
      return sendResponse(error.status, "Terlalu banyak permintaan.");
    }
    if (error instanceof ClientError)
      return sendResponse(error.statusCode, error.message);
    return sendResponse(500, "Internal server error");
  }
}
