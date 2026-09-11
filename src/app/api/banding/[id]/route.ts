import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { db } from "@/lib/db";
import { sendResponse } from "@/lib/response";
import { rateLimitApi, RateLimitError } from "@/lib/rate-limit";
import { ClientError } from "@/error/index";

type Context = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: NextRequest, context: Context) {
  try {
    rateLimitApi(request, {
      limit: 30,
      windowMs: 60 * 1000,
      key: "patch-banding",
    });

    const token = await getToken({ req: request });
    if (!token || (token.role !== "asesor" && token.role !== "admin")) {
      return sendResponse(403, "Akses ditolak. Hanya asesor atau admin yang dapat memverifikasi banding.");
    }

    const { id } = await context.params;
    const bandingId = parseInt(id, 10);
    if (isNaN(bandingId)) {
      return sendResponse(400, "ID banding tidak valid.");
    }

    const body = await request.json();
    const { status, keputusanAdmin } = body;

    if (!status) {
      return sendResponse(400, "Status verifikasi wajib diisi.");
    }

    const existingBanding = await db.pengajuan_banding.findUnique({
      where: { id: bandingId },
      include: {
        hasil_asesmen: {
          include: {
            pengajuan_skema: true,
          },
        },
      },
    });

    if (!existingBanding) {
      return sendResponse(404, "Data pengajuan banding tidak ditemukan.");
    }

    // Jalankan dalam transaksi agar status banding, hasil asesmen, dan pengajuan skema selalu konsisten
    const updated = await db.$transaction(async (tx) => {
      const banding = await tx.pengajuan_banding.update({
        where: { id: bandingId },
        data: {
          status: String(status),
          keputusan_admin: keputusanAdmin ? String(keputusanAdmin) : null,
        },
      });

      // Jika banding disetujui, ubah hasil asesmen menjadi Kompeten dan status pengajuan menjadi Menunggu Pleno
      const isApproved =
        status.toLowerCase() === "disetujui" ||
        status.toLowerCase() === "diterima" ||
        status.toLowerCase() === "kompeten";

      if (isApproved && existingBanding.hasil_asesmen_id) {
        await tx.hasil_asesmen.update({
          where: { id: existingBanding.hasil_asesmen_id },
          data: {
            hasil: "Kompeten",
            status: "Selesai",
          },
        });

        if (existingBanding.hasil_asesmen?.pengajuan_id) {
          await tx.pengajuanSkema.update({
            where: { id: existingBanding.hasil_asesmen.pengajuan_id },
            data: {
              status: "Menunggu Pleno",
            },
          });
        }
      }

      return banding;
    });

    return sendResponse(200, "Verifikasi banding berhasil disimpan.", updated);
  } catch (error) {
    if (error instanceof RateLimitError) {
      return sendResponse(error.status, "Terlalu banyak permintaan.");
    }
    if (error instanceof ClientError) {
      return sendResponse(error.statusCode, error.message);
    }
    console.error("[PATCH /api/banding/[id]]:", error);
    return sendResponse(500, "Terjadi kesalahan saat memverifikasi pengajuan banding");
  }
}
