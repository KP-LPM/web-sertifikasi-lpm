import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { getToken } from "next-auth/jwt";
import z from "zod";
import { pengajuanService } from "@/services/pengajuanskema.service";
import { penilaianAsesorMandiriSchema } from "@/schemas/pengajuanskema.schema";
import { sendResponse } from "@/lib/response";
import { ClientError } from "@/error/index";
import { rateLimitApi, RateLimitError } from "@/lib/rate-limit";

type Context = { params: Promise<{ id: string; unitId: string }> };

export const dynamic = "force-dynamic";

// PATCH /api/pengajuanskema/:id/asesmen-mandiri/:unitId [asesor]
// Asesor isi penilaianAsesor + catatan per unit
export async function PATCH(request: NextRequest, context: Context) {
  try {
    rateLimitApi(request, {
      limit: 30,
      windowMs: 60 * 1000,
      key: "patch-penilaian-asesor-unit",
    });

    const token = await getToken({ req: request });
    if (!token || (token.role !== "asesor" && token.role !== "admin")) {
      return sendResponse(403, "Akses ditolak. Hanya asesor atau admin yang dapat menilai.");
    }

    const user = {
      id: Number(token.id),
      role: token.role as string,
    };

    const { id, unitId } = await context.params;
    const pengajuanId = Number(id);
    const masterUnitId = Number(unitId);

    if (isNaN(pengajuanId) || isNaN(masterUnitId)) {
      return sendResponse(400, "ID pengajuan atau ID unit kompetensi tidak valid");
    }

    const body = await request.json();
    const validatedData = penilaianAsesorMandiriSchema.parse(body);

    const result = await pengajuanService.updatePenilaianAsesorMandiri(
      pengajuanId,
      masterUnitId,
      validatedData,
      user
    );

    revalidatePath("/api/pengajuanskema");

    return sendResponse(
      200,
      "Penilaian asesor untuk unit kompetensi berhasil disimpan",
      result
    );
  } catch (error) {
    if (error instanceof RateLimitError) {
      return sendResponse(error.status, "Terlalu banyak permintaan.");
    }
    if (error instanceof z.ZodError) {
      return sendResponse(400, "Validasi penilaian asesor gagal", error.flatten());
    }
    if (error instanceof ClientError) {
      return sendResponse(error.statusCode, error.message);
    }
    console.error("[PATCH /api/pengajuanskema/:id/asesmen-mandiri/:unitId]:", error);
    return sendResponse(500, "Terjadi kesalahan internal pada server");
  }
}
