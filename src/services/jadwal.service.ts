import {
  jadwalRepository,
  JadwalRepository,
} from "@/repositories/jadwal.repository";
import { CreateJadwalInput, UpdateJadwalInput } from "@/schemas/jadwal.schema";
import { NotFoundError, InvariantError } from "@/error/index";

export class JadwalService {
  constructor(private repo: JadwalRepository = jadwalRepository) {}

  async getList(filters?: {
    asesorId?: number;
    skemaId?: number;
    tanggal?: Date;
    status?: string;
  }) {
    return await this.repo.getList(filters);
  }

  async getById(id: number) {
    const jadwal = await this.repo.getById(id);
    if (!jadwal) {
      throw new NotFoundError("Jadwal asesmen tidak ditemukan");
    }
    return jadwal;
  }

  async create(data: CreateJadwalInput) {
    const jadwal = await this.repo.create(data);
    if (!jadwal) {
      throw new InvariantError("Gagal membuat jadwal asesmen baru");
    }
    return jadwal;
  }

  async update(id: number, data: UpdateJadwalInput) {
    await this.getById(id); // Validasi eksistensi

    const jadwal = await this.repo.update(id, data);
    if (!jadwal) {
      throw new InvariantError("Gagal memperbarui jadwal asesmen");
    }
    return jadwal;
  }

  async delete(id: number) {
    await this.getById(id);

    const jadwal = await this.repo.delete(id);
    if (!jadwal) {
      throw new InvariantError("Gagal membatalkan jadwal asesmen");
    }
    return jadwal;
  }

  async addPesertaBulk(jadwalId: number, pengajuanIds: number[]) {
    await this.getById(jadwalId);

    const result = await this.repo.addPesertaBulk(jadwalId, pengajuanIds);
    if (!result) {
      throw new InvariantError("Gagal menambahkan peserta ke jadwal ini");
    }
    return result;
  }

  async removePeserta(jadwalId: number, pengajuanId: number) {
    await this.getById(jadwalId);

    const result = await this.repo.removePeserta(jadwalId, pengajuanId);
    if (!result) {
      throw new InvariantError("Gagal mengeluarkan peserta dari jadwal");
    }
    return result;
  }
}

export const jadwalService = new JadwalService();
