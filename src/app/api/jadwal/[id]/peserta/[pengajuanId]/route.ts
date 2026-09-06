import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { getToken } from "next-auth/jwt";
import { jadwalService } from "@/services/jadwal.service";
import { sendResponse } from "@/lib/response";
import { ClientError } from "@/error/index";
import { rateLimitApi, RateLimitError } from "@/lib/rate-limit";

type Context = { params: Promise<{ id: string; pengajuanId: string }> };

export async function DELETE(request: NextRequest, context: Context) {
  try {
    rateLimitApi(request, {
      limit: 20,
      windowMs: 60 * 1000,
      key: "delete-jadwal-peserta",
    });

    const token = await getToken({ req: request });
    if (!token || (token.role !== "admin" && token.role !== "asesor")) {
      return sendResponse(403, "Akses ditolak");
    }

    const { id, pengajuanId } = await context.params;

    await jadwalService.removePeserta(
      Number(id),
      Number(pengajuanId),
    );

    revalidatePath("/api/jadwal");

    return sendResponse(200, "Peserta berhasil dikeluarkan dari jadwal");
  } catch (error) {
    if (error instanceof RateLimitError) {
      return sendResponse(error.status, "Terlalu banyak permintaan.");
    }
    if (error instanceof ClientError)
      return sendResponse(error.statusCode, error.message);
    console.error(error);
    return sendResponse(500, "Internal server error");
  }
}
