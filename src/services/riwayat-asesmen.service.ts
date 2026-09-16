import {
  riwayatAsesmenRepository,
  RiwayatAsesmenRepository,
} from "@/repositories/riwayat-asesmen.repository";
import {
  CreateRiwayatAsesmenInput,
  UpdateRiwayatAsesmenInput,
} from "@/schemas/riwayat-asesmen.schema";
import { NotFoundError, InvariantError } from "@/error/index";

export class RiwayatAsesmenService {
  constructor(
    private repo: RiwayatAsesmenRepository = riwayatAsesmenRepository,
  ) {}

  async getByPengajuanId(pengajuanId: number) {
    return await this.repo.getByPengajuanId(pengajuanId);
  }

  async getByPengajuanIdAndFormType(pengajuanId: number, formType: string) {
    return await this.repo.getByPengajuanIdAndFormType(pengajuanId, formType);
  }

  async upsert(pengajuanId: number, data: CreateRiwayatAsesmenInput) {
    const existing = await this.getByPengajuanIdAndFormType(
      pengajuanId,
      data.form_type,
    );

    if (existing) {
      return await this.repo.update(existing.id, {
        form_data: data.form_data,
        penilaian: data.penilaian,
        catatan: data.catatan,
      });
    } else {
      return await this.repo.create(pengajuanId, data);
    }
  }

  async getById(id: number) {
    const data = await this.repo.getById(id);
    if (!data) throw new NotFoundError("Riwayat asesmen detail tidak ditemukan");
    return data;
  }

  async create(pengajuanId: number, data: CreateRiwayatAsesmenInput) {
    const riwayat = await this.repo.create(pengajuanId, data);
    if (!riwayat) throw new InvariantError("Gagal membuat riwayat asesmen");
    return riwayat;
  }

  async update(id: number, data: UpdateRiwayatAsesmenInput) {
    await this.getById(id);
    const riwayat = await this.repo.update(id, data);
    if (!riwayat) throw new InvariantError("Gagal memperbarui riwayat asesmen");
    return riwayat;
  }

  async delete(id: number) {
    await this.getById(id);
    const riwayat = await this.repo.delete(id);
    if (!riwayat) throw new InvariantError("Gagal menghapus riwayat asesmen");
    return riwayat;
  }
}

export const riwayatAsesmenService = new RiwayatAsesmenService();
