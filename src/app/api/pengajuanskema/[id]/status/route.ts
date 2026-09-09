import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { getToken } from "next-auth/jwt";
import z from "zod";
import { pengajuanService } from "@/services/pengajuanskema.service";
import { updateStatusPengajuanSchema } from "@/schemas/pengajuanskema.schema";
import { sendResponse } from "@/lib/response";
import { ClientError } from "@/error/index";
import { rateLimitApi, RateLimitError } from "@/lib/rate-limit";

type Context = { params: Promise<{ id: string }> };

export const dynamic = "force-dynamic";

// PATCH /api/pengajuanskema/:id/status [admin]
// Update status alur (admin)
export async function PATCH(request: NextRequest, context: Context) {
  try {
    rateLimitApi(request, {
      limit: 20,
      windowMs: 60 * 1000,
      key: "patch-pengajuan-status",
    });

    const token = await getToken({ req: request });
    if (!token || token.role !== "admin") {
      return sendResponse(403, "Akses ditolak. Hanya admin yang dapat mengubah status pengajuan.");
    }

    const user = {
      id: Number(token.id),
      role: token.role as string,
    };

    const { id } = await context.params;
    const pengajuanId = Number(id);
    if (isNaN(pengajuanId)) {
      return sendResponse(400, "ID pengajuan tidak valid");
    }

    const body = await request.json();
    const validatedData = updateStatusPengajuanSchema.parse(body);

    const updated = await pengajuanService.updateStatus(
      pengajuanId,
      validatedData.status,
      user
    );

    revalidatePath("/api/pengajuanskema");

    return sendResponse(200, "Status pengajuan berhasil diperbarui", updated);
  } catch (error) {
    if (error instanceof RateLimitError) {
      return sendResponse(error.status, "Terlalu banyak permintaan.");
    }
    if (error instanceof z.ZodError) {
      return sendResponse(400, "Validasi status gagal", error.flatten());
    }
    if (error instanceof ClientError) {
      return sendResponse(error.statusCode, error.message);
    }
    console.error("[PATCH /api/pengajuanskema/:id/status]:", error);
    return sendResponse(500, "Terjadi kesalahan internal pada server");
  }
}
