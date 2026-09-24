import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { getToken } from "next-auth/jwt";
import z from "zod";
import { sendResponse } from "@/lib/response";
import { ClientError } from "@/error/index";
import { rateLimitApi, RateLimitError } from "@/lib/rate-limit";
import { db } from "@/lib/db";

type Context = { params: Promise<{ id: string }> };

export const dynamic = "force-dynamic";

export async function PATCH(request: NextRequest, context: Context) {
  try {
    rateLimitApi(request, {
      limit: 20,
      windowMs: 60 * 1000,
      key: "patch-pengajuan-pembayaran",
    });

    const token = await getToken({ req: request });
    if (!token || token.role !== "admin") {
      return sendResponse(403, "Akses ditolak. Hanya admin yang dapat mengubah pembayaran pengajuan.");
    }

    const { id } = await context.params;
    const pengajuanId = Number(id);
    if (isNaN(pengajuanId)) {
      return sendResponse(400, "ID pengajuan tidak valid");
    }

    const body = await request.json();
    const schema = z.object({
      statusPembayaran: z.string(),
      sumberAnggaran: z.string(),
    });
    
    const validatedData = schema.parse(body);

    const updated = await db.$transaction(async (tx) => {
      // 1. Simpan/Update data verifikasi
      await tx.verifikasi_pengajuan.upsert({
        where: { pengajuan_id: pengajuanId },
        update: {
          status_pembayaran: validatedData.statusPembayaran,
          sumber_anggaran: validatedData.sumberAnggaran,
        },
        create: {
          pengajuan_id: pengajuanId,
          status_pembayaran: validatedData.statusPembayaran,
          sumber_anggaran: validatedData.sumberAnggaran,
          rekomendasi: "Diterima"
        },
      });
  
      // 2. Update status pengajuan di tabel induk
      const updatedPengajuan = await tx.pengajuanSkema.update({
        where: { id: pengajuanId },
        data: {
          statusPembayaran: validatedData.statusPembayaran,
          sumberAnggaran: validatedData.sumberAnggaran
        },
      });

      return updatedPengajuan;
    });

    revalidatePath("/api/pengajuanskema");
    revalidatePath("/admin/verifikasiberkas");

    return sendResponse(200, "Status pembayaran berhasil diperbarui", updated);
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
    console.error("[PATCH /api/pengajuanskema/:id/pembayaran]:", error);
    return sendResponse(500, "Terjadi kesalahan internal pada server");
  }
}
