import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { getToken } from "next-auth/jwt";
import z from "zod";
import { riwayatAsesmenService } from "@/services/riwayat-asesmen.service";
import { UpdateRiwayatAsesmenSchema } from "@/schemas/riwayat-asesmen.schema";
import { sendResponse } from "@/lib/response";
import { ClientError } from "@/error/index";
import { rateLimitApi, RateLimitError } from "@/lib/rate-limit";

type Context = { params: Promise<{ id: string; riwayatId: string }> };

export const dynamic = "force-dynamic";

export async function PATCH(request: NextRequest, context: Context) {
  try {
    rateLimitApi(request, {
      limit: 30,
      windowMs: 60 * 1000,
      key: "patch-riwayat-asesmen",
    });

    const token = await getToken({ req: request });
    if (!token) {
      return sendResponse(401, "Anda harus login terlebih dahulu");
    }

    if (token.role !== "admin" && token.role !== "asesor") {
      return sendResponse(403, "Akses ditolak");
    }

    const { id, riwayatId } = await context.params;
    const pengajuanId = Number(id);
    const riwayatIdNum = Number(riwayatId);
    
    if (isNaN(pengajuanId) || isNaN(riwayatIdNum)) {
      return sendResponse(400, "ID tidak valid");
    }

    const body = await request.json();
    const validatedData = UpdateRiwayatAsesmenSchema.parse(body);

    const result = await riwayatAsesmenService.update(
      riwayatIdNum,
      validatedData,
    );

    revalidatePath("/api/pengajuanskema");
    revalidatePath(`/api/pengajuanskema/${pengajuanId}`);

    return sendResponse(200, "Riwayat asesmen berhasil diperbarui", result);
  } catch (error) {
    if (error instanceof RateLimitError) {
      return sendResponse(error.status, "Terlalu banyak permintaan.");
    }
    if (error instanceof z.ZodError) {
      const errorMsg =
        "Validasi gagal: " + JSON.stringify(error.flatten().fieldErrors);
      return sendResponse(400, errorMsg, error.flatten());
    }
    if (error instanceof ClientError) {
      return sendResponse(error.statusCode, error.message);
    }
    console.error("[PATCH /api/pengajuanskema/:id/riwayat-asesmen/:riwayatId]:", error);
    return sendResponse(500, "Internal server error");
  }
}

export async function DELETE(request: NextRequest, context: Context) {
  try {
    rateLimitApi(request, {
      limit: 20,
      windowMs: 60 * 1000,
      key: "delete-riwayat-asesmen",
    });

    const token = await getToken({ req: request });
    if (!token) {
      return sendResponse(401, "Anda harus login terlebih dahulu");
    }

    if (token.role !== "admin") {
      return sendResponse(403, "Hanya admin yang dapat menghapus data ini");
    }

    const { id, riwayatId } = await context.params;
    const pengajuanId = Number(id);
    const riwayatIdNum = Number(riwayatId);

    if (isNaN(pengajuanId) || isNaN(riwayatIdNum)) {
      return sendResponse(400, "ID tidak valid");
    }

    await riwayatAsesmenService.delete(riwayatIdNum);

    revalidatePath("/api/pengajuanskema");
    revalidatePath(`/api/pengajuanskema/${pengajuanId}`);

    return sendResponse(200, "Riwayat asesmen berhasil dihapus");
  } catch (error) {
    if (error instanceof RateLimitError) {
      return sendResponse(error.status, "Terlalu banyak permintaan.");
    }
    if (error instanceof ClientError) {
      return sendResponse(error.statusCode, error.message);
    }
    console.error("[DELETE /api/pengajuanskema/:id/riwayat-asesmen/:riwayatId]:", error);
    return sendResponse(500, "Internal server error");
  }
}
