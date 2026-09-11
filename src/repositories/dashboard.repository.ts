import { db } from "@/lib/db";

export class DashboardRepository {
  // --- ADMIN ---
  async getPengajuanGroupedByStatus() {
    return await db.pengajuanSkema.groupBy({
      by: ["status"],
      _count: { id: true },
    });
  }

  async countVerifikasiPending() {
    return await db.pengajuanSkema.count({
      where: { status: "Diajukan" },
    });
  }

  async countJadwalMendatangAdmin() {
    return await db.jadwal_asesmen.count({
      where: {
        tanggal: { gte: new Date() },
        status: "Terjadwal",
      },
    });
  }

  async countBandingMasukAdmin() {
    return await db.pengajuan_banding.count({
      where: { status: "Menunggu Verifikasi" },
    });
  }

  // --- ASESI ---
  async getPengajuanAktifByAsesiId(asesiId: number) {
    return await db.pengajuanSkema.findFirst({
      where: {
        userId: asesiId,
        status: { not: "Selesai" },
      },
      orderBy: { createdAt: "desc" },
      include: {
        skema: { select: { namaSkema: true } },
      },
    });
  }

  async getRiwayatAsesmenByAsesiId(asesiId: number, take: number = 5) {
    return await db.pengajuanSkema.findMany({
      where: { userId: asesiId },
      orderBy: { createdAt: "desc" },
      include: {
        skema: { select: { namaSkema: true } },
        hasil_asesmen: true,
      },
      take,
    });
  }

  async getSertifikatByAsesiId(asesiId: number) {
    return await db.sertifikat.findMany({
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
  }

  // --- ASESOR ---
  async countJadwalMendatangByAsesorId(asesorId: number) {
    return await db.jadwal_asesmen.count({
      where: {
        asesor_id: asesorId,
        tanggal: { gte: new Date() },
        status: "Terjadwal",
      },
    });
  }

  async countKandidatSiapDinilaiByAsesorId(asesorId: number) {
    return await db.jadwal_asesmen_peserta.count({
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
  }

  async countBandingMasukByAsesorId(asesorId: number) {
    return await db.pengajuan_banding.count({
      where: {
        status: "Menunggu Verifikasi",
        hasil_asesmen: {
          jadwal_asesmen: {
            asesor_id: asesorId,
          },
        },
      },
    });
  }
}

export const dashboardRepository = new DashboardRepository();
