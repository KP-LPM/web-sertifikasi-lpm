import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { getToken } from "next-auth/jwt";
import { sertifikatService } from "@/services/sertifikat.service";
import { sendResponse } from "@/lib/response";
import { rateLimitApi, RateLimitError } from "@/lib/rate-limit";
import { ClientError } from "@/error/index";

type Context = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, context: Context) {
  try {
    rateLimitApi(request, {
      limit: 20,
      windowMs: 60 * 1000,
      key: "post-terbitkan-sertifikat",
    });
    const { id } = await context.params;
    const token = await getToken({ req: request });
    if (!token || token.role !== "admin")
      return sendResponse(403, "Akses ditolak");

    await sertifikatService.terbitkan(Number(id));

    revalidatePath("/api/sertifikat");
    revalidatePath("/api/pengajuanskema");

    return sendResponse(200, "Sertifikat berhasil diterbitkan");
  } catch (error) {
    if (error instanceof RateLimitError) {
      return sendResponse(
        error.status,
        "Terlalu banyak permintaan. Silakan coba lagi nanti.",
      );
    }
    if (error instanceof ClientError)
      return sendResponse(error.statusCode, error.message);
    return sendResponse(500, "Internal server error");
  }
}
