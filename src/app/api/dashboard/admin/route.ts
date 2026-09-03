import { NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { db } from "@/lib/db";
import { sendResponse } from "@/lib/response";
import { authOptions } from "@/lib/auth-options";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
      return sendResponse(403, "Akses ditolak. Hanya admin yang dapat melihat dashboard admin.");
    }

    // 1. Total pengajuan per status
    const pengajuanGrup = await db.pengajuanSkema.groupBy({
      by: ["status"],
      _count: { id: true },
    });
    
    const pengajuan = {
      total: 0,
      draf: 0,
      diajukan: 0,
      diverifikasi: 0,
      ditolak: 0,
      selesai: 0,
    };

    pengajuanGrup.forEach((g: any) => {
      pengajuan.total += g._count.id;
      const statusLower = g.status.toLowerCase();
      if (statusLower === "draf") pengajuan.draf += g._count.id;
      else if (statusLower === "diajukan") pengajuan.diajukan += g._count.id;
      else if (statusLower === "diverifikasi") pengajuan.diverifikasi += g._count.id;
      else if (statusLower === "ditolak") pengajuan.ditolak += g._count.id;
      else if (statusLower === "selesai") pengajuan.selesai += g._count.id;
    });

    // 2. Verifikasi pending (pengajuan dengan status "Diajukan")
    const verifikasiPending = await db.pengajuanSkema.count({
      where: { status: "Diajukan" },
    });

    // 3. Jadwal mendatang (jadwal_asesmen dengan tanggal > hari ini dan status = "Terjadwal")
    const jadwalMendatang = await db.jadwal_asesmen.count({
      where: {
        tanggal: { gte: new Date() },
        status: "Terjadwal",
      },
    });

    // 4. Banding masuk (pengajuan_banding status "Menunggu Verifikasi")
    const bandingMasuk = await db.pengajuan_banding.count({
      where: { status: "Menunggu Verifikasi" },
    });

    return sendResponse(200, "Berhasil mengambil data dashboard admin", {
      pengajuan,
      verifikasiPending,
      jadwalMendatang,
      bandingMasuk,
    });
  } catch (error) {
    console.error("[GET /api/dashboard/admin]", error);
    return sendResponse(500, "Terjadi kesalahan saat mengambil data dashboard admin");
  }
}
