import {
  jadwalRepository,
  JadwalRepository,
} from "@/repositories/jadwal.repository";
import { CreateJadwalInput, UpdateJadwalInput } from "@/schemas/jadwal.schema";
import { NotFoundError, InvariantError } from "@/error/index";
import { suratService } from "@/services/surat.service";

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

    // Automatis masukkan surat penugasan asesor ke tabel surat
    if (data.surat_tugas_url) {
      try {
        await suratService.create({
          nomor_surat: data.nomor_surat || `ST-${jadwal.id}`,
          judul: "Surat Penugasan Asesor",
          kategori: "surat_keluar",
          jenis_surat: "penugasan_asesor",
          nama_jenis_surat: "Surat Penugasan Asesor",
          tanggal_terbit: new Date(),
          status: "Terbit",
          url_gdrive: data.surat_tugas_url,
          url_dokumen: data.surat_tugas_url,
          skema_id: data.skema_id || undefined,
        });
      } catch (err) {
        console.error("Gagal menambahkan surat penugasan asesor secara otomatis:", err);
      }
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
