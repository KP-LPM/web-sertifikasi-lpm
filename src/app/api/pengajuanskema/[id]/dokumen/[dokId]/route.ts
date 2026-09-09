import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { getToken } from "next-auth/jwt";
import { pengajuanService } from "@/services/pengajuanskema.service";
import { sendResponse } from "@/lib/response";
import { ClientError } from "@/error/index";
import { rateLimitApi, RateLimitError } from "@/lib/rate-limit";

type Context = { params: Promise<{ id: string; dokId: string }> };

export const dynamic = "force-dynamic";

// DELETE /api/pengajuanskema/:id/dokumen/:dokId [asesi]
// Hapus dokumen
export async function DELETE(request: NextRequest, context: Context) {
  try {
    rateLimitApi(request, {
      limit: 20,
      windowMs: 60 * 1000,
      key: "delete-pengajuan-dokumen",
    });

    const token = await getToken({ req: request });
    if (!token) {
      return sendResponse(401, "Anda harus login terlebih dahulu");
    }

    const user = {
      id: Number(token.id),
      role: token.role as string,
    };

    const { id, dokId } = await context.params;
    const pengajuanId = Number(id);
    const dokumenId = Number(dokId);

    if (isNaN(pengajuanId) || isNaN(dokumenId)) {
      return sendResponse(400, "ID pengajuan atau ID dokumen tidak valid");
    }

    const result = await pengajuanService.deleteDokumen(
      pengajuanId,
      dokumenId,
      user
    );

    revalidatePath("/api/pengajuanskema");

    return sendResponse(200, "Dokumen berhasil dihapus", result);
  } catch (error) {
    if (error instanceof RateLimitError) {
      return sendResponse(error.status, "Terlalu banyak permintaan.");
    }
    if (error instanceof ClientError) {
      return sendResponse(error.statusCode, error.message);
    }
    console.error("[DELETE /api/pengajuanskema/:id/dokumen/:dokId]:", error);
    return sendResponse(500, "Terjadi kesalahan internal pada server");
  }
}
