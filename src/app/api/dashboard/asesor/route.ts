import { NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { db } from "@/lib/db";
import { sendResponse } from "@/lib/response";
import { authOptions } from "@/lib/auth-options";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "asesor") {
      return sendResponse(403, "Akses ditolak. Hanya asesor yang dapat melihat dashboard ini.");
    }

    const asesorId = parseInt(session.user.id, 10);
    if (isNaN(asesorId)) return sendResponse(400, "ID asesor tidak valid.");

    // 1. Jadwal Asesor Mendatang
    const jadwalMendatang = await db.jadwal_asesmen.count({
      where: {
        asesor_id: asesorId,
        tanggal: { gte: new Date() },
        status: "Terjadwal",
      },
    });

    // 2. Kandidat siap dinilai (peserta dari jadwal milik asesor yang hasil asesmen-nya "Belum Dinilai")
    const kandidatSiapDinilai = await db.jadwal_asesmen_peserta.count({
      where: {
        jadwal_asesmen: {
          asesor_id: asesorId,
          status: "Terjadwal",
        },
        pengajuan_skema: {
          hasil_asesmen: {
            hasil: "Belum Dinilai",
          },
        },
      },
    });

    // 3. Banding masuk untuk asesor ini
    const bandingMasuk = await db.pengajuan_banding.count({
      where: {
        status: "Menunggu Verifikasi",
        hasil_asesmen: {
          jadwal_asesmen: {
            asesor_id: asesorId,
          },
        },
      },
    });

    return sendResponse(200, "Berhasil mengambil data dashboard asesor", {
      jadwalMendatang,
      kandidatSiapDinilai,
      bandingMasuk,
    });
  } catch (error) {
    console.error("[GET /api/dashboard/asesor]", error);
    return sendResponse(500, "Terjadi kesalahan saat mengambil data dashboard asesor");
  }
}
