import { db } from "@/lib/db";
import { CreateJadwalInput, UpdateJadwalInput } from "@/schemas/jadwal.schema";

export class JadwalRepository {
  async getList(filters?: {
    asesorId?: number;
    skemaId?: number;
    tanggal?: Date;
    status?: string;
  }) {
    return await db.jadwal_asesmen.findMany({
      where: {
        ...(filters?.asesorId && { asesor_id: filters.asesorId }),
        ...(filters?.skemaId && { skema_id: filters.skemaId }),
        ...(filters?.tanggal && { tanggal: filters.tanggal }),
        ...(filters?.status && { status: filters.status }),
      },
      include: {
        master_skema: { select: { namaSkema: true, kodeSkema: true } },
        users: { select: { username: true, email: true } },
      },
      orderBy: { tanggal: "desc" },
    });
  }

  async getById(id: number) {
    return await db.jadwal_asesmen.findUnique({
      where: { id },
      include: {
        master_skema: true,
        users: { select: { username: true, email: true } },
        master_tuk: true,
        jadwal_asesmen_peserta: {
          include: {
            pengajuan_skema: true,
          },
        },
      },
    });
  }

  async create(data: CreateJadwalInput) {
    return await db.jadwal_asesmen.create({ data });
  }

  async update(id: number, data: UpdateJadwalInput) {
    return await db.jadwal_asesmen.update({
      where: { id },
      data,
    });
  }

  async delete(id: number) {
    return await db.jadwal_asesmen.delete({
      where: { id },
    });
  }

  // --- MANAJEMEN PESERTA BATCH ---

  async addPesertaBulk(jadwalId: number, pengajuanIds: number[]) {
    // Memasukkan banyak data sekaligus ke tabel junction
    const dataToInsert = pengajuanIds.map((pengajuanId) => ({
      jadwal_id: jadwalId,
      pengajuan_id: pengajuanId,
    }));

    return await db.jadwal_asesmen_peserta.createMany({
      data: dataToInsert,
      skipDuplicates: true,
    });
  }

  async removePeserta(jadwalId: number, pengajuanId: number) {
    return await db.jadwal_asesmen_peserta.delete({
      where: {
        jadwal_id_pengajuan_id: {
          jadwal_id: jadwalId,
          pengajuan_id: pengajuanId,
        },
      },
    });
  }
}

export const jadwalRepository = new JadwalRepository();
