import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { sertifikatService } from "@/services/sertifikat.service";
import { sendResponse } from "@/lib/response";
import { rateLimitApi, RateLimitError } from "@/lib/rate-limit";
import { ClientError } from "@/error/index";

type Context = { params: Promise<{ id: string }> };

export const revalidate = 3600;

export async function GET(request: NextRequest, context: Context) {
  try {
    rateLimitApi(request, {
      limit: 60,
      windowMs: 60 * 1000,
      key: "get-riwayat-sertifikat",
    });

    const token = await getToken({ req: request });
    if (!token) return sendResponse(401, "Silakan login terlebih dahulu");

    const { id } = await context.params;

    const list = await sertifikatService.getRiwayatByAsesi(
      Number(id),
      Number(token.id),
      token.role as string,
    );

    return sendResponse(200, "Berhasil mengambil riwayat sertifikat", list);
  } catch (error) {
    if (error instanceof RateLimitError) {
      return sendResponse(
        error.status,
        "Terlalu banyak permintaan. Silakan coba lagi nanti.",
      );
    }
    if (error instanceof ClientError) {
      return sendResponse(error.statusCode, error.message);
    }

    console.error(error);
    return sendResponse(500, "Internal server error");
  }
}
