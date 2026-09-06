import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { jadwalService } from "@/services/jadwal.service";
import { rateLimitApi, RateLimitError } from "@/lib/rate-limit";
import { sendResponse } from "@/lib/response";
import { ClientError } from "@/error/index";

type Context = { params: Promise<{ id: string }> };

export const revalidate = 3600;

export async function GET(request: NextRequest, context: Context) {
  try {
    rateLimitApi(request, {
      limit: 60,
      windowMs: 60 * 1000,
      key: "get-jadwal-asesor",
    });

    const token = await getToken({ req: request });
    const { id } = await context.params;
    if (!token || (token.role !== "admin" && Number(token.id) !== Number(id))) {
      return sendResponse(403, "Akses ditolak");
    }

    const jadwalList = await jadwalService.getList({
      asesorId: Number(id),
    });
    return sendResponse(200, "Berhasil mengambil jadwal asesor", jadwalList);
  } catch (error) {
    if (error instanceof RateLimitError) {
      return sendResponse(
        error.status,
        "Terlalu banyak permintaan. Silakan coba lagi nanti.",
      );
    }
    if (error instanceof ClientError)
      return sendResponse(error.statusCode, error.message);
    console.error(error);
    return sendResponse(500, "Internal server error");
  }
}
