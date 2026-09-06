import { db } from "@/lib/db";
import { UpdateSertifikatInput } from "@/schemas/sertifikat.schema";

export class SertifikatRepository {
  async getByPengajuanId(pengajuanId: number) {
    return await db.sertifikat.findUnique({
      where: { pengajuan_id: pengajuanId },
      include: {
        pengajuan_skema: {
          select: {
            id: true,
            asesi_id: true,
            master_skema: { select: { namaSkema: true, kodeSkema: true } },
          },
        },
      },
    });
  }

  // Tambahan: Ambil data pengajuan dan master skema untuk base nomor
  // Mengambil data Pengajuan beserta Skema induknya
  async getPengajuanWithSkema(pengajuanId: number) {
    return await db.pengajuanSkema.findUnique({
      where: { id: pengajuanId },
      include: { skema: true }, // Menarik data master_skema
    });
  }

  // Mencari sertifikat berakhiran tahun berjalan (contoh mencari akhiran " 2025")
  async getLastSertifikatByYear(year: string) {
    return await db.sertifikat.findFirst({
      where: {
        no_sertifikat: {
          endsWith: ` ${year}`,
        },
      },
      orderBy: { id: "desc" },
    });
  }

  async upsert(pengajuanId: number, data: UpdateSertifikatInput) {
    return await db.sertifikat.upsert({
      where: { pengajuan_id: pengajuanId },
      update: {
        ...(data.no_sertifikat && { no_sertifikat: data.no_sertifikat }),
        ...(data.no_registrasi && { no_registrasi: data.no_registrasi }),
        ...(data.tanggal_terbit && { tanggal_terbit: data.tanggal_terbit }),
        ...(data.tanggal_berlaku && { tanggal_berlaku: data.tanggal_berlaku }),
        ...(data.gdrive_url && { gdrive_url: data.gdrive_url }),
      },
      create: {
        pengajuan_id: pengajuanId,
        no_sertifikat: data.no_sertifikat,
        no_registrasi: data.no_registrasi,
        tanggal_terbit: data.tanggal_terbit,
        tanggal_berlaku: data.tanggal_berlaku,
        gdrive_url: data.gdrive_url,
      },
    });
  }

  // Diperbarui: Menerima argumen nomor hasil generate
  async updateTerbit(
    pengajuanId: number,
    noSertifikat: string,
    noRegistrasi: string,
    tanggalTerbit: Date,
  ) {
    return await db.sertifikat.update({
      where: { pengajuan_id: pengajuanId },
      data: {
        status: "Terbit",
        no_sertifikat: noSertifikat,
        no_registrasi: noRegistrasi,
        tanggal_terbit: tanggalTerbit,
      },
    });
  }

  async getAll(filters?: {
    status?: string;
    skemaId?: number;
    tanggal?: Date;
  }) {
    return await db.sertifikat.findMany({
      where: {
        ...(filters?.status && { status: filters.status }),
        ...(filters?.tanggal && { tanggal_terbit: filters.tanggal }),
        ...(filters?.skemaId && {
          pengajuan_skema: { skema_id: filters.skemaId },
        }),
      },
      include: {
        pengajuan_skema: {
          include: {
            user: { select: { namaLengkap: true, email: true } },
            master_skema: { select: { namaSkema: true } },
          },
        },
      },
      orderBy: { created_at: "desc" },
    });
  }

  async getRiwayatByAsesi(asesiId: number) {
    return await db.sertifikat.findMany({
      where: {
        pengajuan_skema: { userId: asesiId },
        status: "Terbit",
      },
      include: {
        pengajuan_skema: {
          include: {
            skema: { select: { namaSkema: true, kodeSkema: true } },
          },
        },
      },
      orderBy: { tanggal_terbit: "desc" },
    });
  }
}

export const sertifikatRepository = new SertifikatRepository();
