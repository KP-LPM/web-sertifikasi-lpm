import {
  suratRepository,
  SuratRepository,
} from "@/repositories/surat.repository";
import {
  CreateSuratInput,
  UpdateSuratInput,
  SuratFilterInput,
} from "@/schemas/surat.schema";
import { NotFoundError, InvariantError } from "@/error/index";

export class SuratService {
  constructor(private repo: SuratRepository = suratRepository) {}

  async getAll(filters?: SuratFilterInput) {
    return await this.repo.getAll(filters);
  }

  async getById(id: number) {
    const surat = await this.repo.getById(id);
    if (!surat) {
      throw new NotFoundError("Surat tidak ditemukan.");
    }
    return surat;
  }

  async create(data: CreateSuratInput) {
    const existingSurat = await this.repo.getByNomorSurat(data.nomor_surat);
    if (existingSurat) {
      throw new InvariantError("Nomor surat sudah terdaftar.");
    }

    const suratBaru = await this.repo.create(data);
    if (!suratBaru) {
      throw new InvariantError("Gagal membuat surat.");
    }
    return suratBaru;
  }

  async update(id: number, data: UpdateSuratInput) {
    await this.getById(id);

    const suratUpdated = await this.repo.update(id, data);
    if (!suratUpdated) {
      throw new InvariantError("Gagal memperbarui surat.");
    }
    return suratUpdated;
  }

  async archive(id: number) {
    await this.getById(id);

    const archived = await this.repo.archive(id);
    if (!archived) {
      throw new InvariantError("Gagal mengarsipkan surat.");
    }
    return archived;
  }
}

export const suratService = new SuratService();
