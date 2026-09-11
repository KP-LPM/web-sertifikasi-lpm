import { tukRepository, TukRepository } from "@/repositories/tuk.repository";
import {
  CreateTukInput,
  UpdateTukInput,
  CreateTukInventarisInput,
  UpdateTukInventarisInput,
} from "@/schemas/tuk.schema";
import { NotFoundError, InvariantError } from "@/error/index";

export class TukService {
  constructor(private repo: TukRepository = tukRepository) {}

  async getAll(status?: string) {
    return await this.repo.getAll(status);
  }

  async getById(id: number) {
    const tuk = await this.repo.getById(id);
    if (!tuk) {
      throw new NotFoundError("TUK tidak ditemukan.");
    }
    return tuk;
  }

  async create(data: CreateTukInput) {
    const tukBaru = await this.repo.create(data);
    if (!tukBaru) {
      throw new InvariantError("Gagal menambahkan data TUK baru.");
    }
    return tukBaru;
  }

  async update(id: number, data: UpdateTukInput) {
    await this.getById(id);

    const tukUpdated = await this.repo.update(id, data);
    if (!tukUpdated) {
      throw new InvariantError("Gagal memperbarui data TUK.");
    }
    return tukUpdated;
  }

  async softDelete(id: number) {
    await this.getById(id);

    const deleted = await this.repo.softDelete(id);
    if (!deleted) {
      throw new InvariantError("Gagal menonaktifkan TUK.");
    }
    return deleted;
  }

  // --- INVENTARIS ---

  async createInventaris(tukId: number, data: CreateTukInventarisInput) {
    await this.getById(tukId);

    const inventarisBaru = await this.repo.createInventaris(tukId, data);
    if (!inventarisBaru) {
      throw new InvariantError("Gagal menambahkan item inventaris.");
    }
    return inventarisBaru;
  }

  async updateInventaris(
    tukId: number,
    itemId: number,
    data: UpdateTukInventarisInput,
  ) {
    const existing = await this.repo.getInventarisById(tukId, itemId);
    if (!existing) {
      throw new NotFoundError("Item inventaris tidak ditemukan.");
    }

    const updated = await this.repo.updateInventaris(itemId, data);
    if (!updated) {
      throw new InvariantError("Gagal memperbarui item inventaris.");
    }
    return updated;
  }

  async deleteInventaris(tukId: number, itemId: number) {
    const existing = await this.repo.getInventarisById(tukId, itemId);
    if (!existing) {
      throw new NotFoundError("Item inventaris tidak ditemukan.");
    }

    return await this.repo.deleteInventaris(itemId);
  }
}

export const tukService = new TukService();
