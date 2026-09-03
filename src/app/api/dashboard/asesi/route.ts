import { NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { db } from "@/lib/db";
import { sendResponse } from "@/lib/response";
import { authOptions } from "@/lib/auth-options";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "asesi") {
      return sendResponse(403, "Akses ditolak. Hanya asesi yang dapat melihat dashboard ini.");
    }

    const asesiId = parseInt(session.user.id, 10);
    if (isNaN(asesiId)) return sendResponse(400, "ID asesi tidak valid.");

    // 1. Status pengajuan aktif
    const pengajuanAktif = await db.pengajuanSkema.findFirst({
      where: { 
        userId: asesiId,
        status: { not: "Selesai" },
      },
      orderBy: { created_at: "desc" },
      include: {
        skema: { select: { namaSkema: true } },
      },
    });

    // 2. Riwayat asesmen (pengajuan yang sudah selesai atau dijadwalkan)
    const riwayatAsesmen = await db.pengajuanSkema.findMany({
      where: { userId: asesiId },
      orderBy: { created_at: "desc" },
      include: {
        skema: { select: { namaSkema: true } },
        hasil_asesmen: true,
      },
      take: 5,
    });

    // 3. Sertifikat
    const sertifikat = await db.sertifikat.findMany({
      where: {
        pengajuan_skema: { userId: asesiId },
        status: "Terbit",
      },
      include: {
        pengajuan_skema: {
          include: { skema: { select: { namaSkema: true } } },
        },
      },
    });

    return sendResponse(200, "Berhasil mengambil data dashboard asesi", {
      pengajuanAktif,
      riwayatAsesmen,
      sertifikat,
    });
  } catch (error) {
    console.error("[GET /api/dashboard/asesi]", error);
    return sendResponse(500, "Terjadi kesalahan saat mengambil data dashboard asesi");
  }
}
