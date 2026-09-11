import {
  dashboardRepository,
  DashboardRepository,
} from "@/repositories/dashboard.repository";
import {
  DashboardAdminData,
  DashboardAsesiData,
  DashboardAsesorData,
} from "@/schemas/dashboard.schema";

export class DashboardService {
  constructor(private repo: DashboardRepository = dashboardRepository) {}

  async getAdminDashboard(): Promise<DashboardAdminData> {
    const [
      pengajuanGrup,
      verifikasiPending,
      jadwalMendatang,
      bandingMasuk,
    ] = await Promise.all([
      this.repo.getPengajuanGroupedByStatus(),
      this.repo.countVerifikasiPending(),
      this.repo.countJadwalMendatangAdmin(),
      this.repo.countBandingMasukAdmin(),
    ]);

    const pengajuan = {
      total: 0,
      draf: 0,
      diajukan: 0,
      diverifikasi: 0,
      ditolak: 0,
      selesai: 0,
    };

    pengajuanGrup.forEach((g) => {
      pengajuan.total += g._count.id;
      const statusLower = g.status.toLowerCase();
      if (statusLower === "draf") pengajuan.draf += g._count.id;
      else if (statusLower === "diajukan") pengajuan.diajukan += g._count.id;
      else if (statusLower === "diverifikasi")
        pengajuan.diverifikasi += g._count.id;
      else if (statusLower === "ditolak") pengajuan.ditolak += g._count.id;
      else if (statusLower === "selesai") pengajuan.selesai += g._count.id;
    });

    return {
      pengajuan,
      verifikasiPending,
      jadwalMendatang,
      bandingMasuk,
    };
  }

  async getAsesiDashboard(asesiId: number): Promise<DashboardAsesiData> {
    const [pengajuanAktif, riwayatAsesmen, sertifikat] = await Promise.all([
      this.repo.getPengajuanAktifByAsesiId(asesiId),
      this.repo.getRiwayatAsesmenByAsesiId(asesiId, 5),
      this.repo.getSertifikatByAsesiId(asesiId),
    ]);

    return {
      pengajuanAktif,
      riwayatAsesmen,
      sertifikat,
    };
  }

  async getAsesorDashboard(asesorId: number): Promise<DashboardAsesorData> {
    const [
      jadwalMendatang,
      kandidatSiapDinilai,
      bandingMasuk,
    ] = await Promise.all([
      this.repo.countJadwalMendatangByAsesorId(asesorId),
      this.repo.countKandidatSiapDinilaiByAsesorId(asesorId),
      this.repo.countBandingMasukByAsesorId(asesorId),
    ]);

    return {
      jadwalMendatang,
      kandidatSiapDinilai,
      bandingMasuk,
    };
  }
}

export const dashboardService = new DashboardService();
