import {
  portfolioRepository,
  PortfolioRepository,
} from "@/repositories/portfolio.repository";
import {
  CreatePortfolioInput,
  UpdatePortfolioInput,
  VerifikasiPortfolioInput,
} from "@/schemas/portfolio.schema";
import {
  NotFoundError,
  InvariantError,
  AuthorizationError,
} from "@/error/index";

export class PortfolioService {
  constructor(private repo: PortfolioRepository = portfolioRepository) {}

  async getByAsesorId(asesorId: number) {
    return await this.repo.getByAsesorId(asesorId);
  }

  async getById(id: number) {
    const portfolio = await this.repo.getById(id);
    if (!portfolio) {
      throw new NotFoundError("Portfolio tidak ditemukan.");
    }
    return portfolio;
  }

  async create(asesorId: number, data: CreatePortfolioInput) {
    const portfolioBaru = await this.repo.create(asesorId, data);
    if (!portfolioBaru) {
      throw new InvariantError("Gagal mengunggah portfolio.");
    }
    return portfolioBaru;
  }

  async update(id: number, asesorId: number, data: UpdatePortfolioInput) {
    const existing = await this.getById(id);

    if (existing.asesor_id !== asesorId) {
      throw new AuthorizationError("Anda tidak berhak mengubah portfolio ini.");
    }

    if (existing.status !== "Menunggu Verifikasi") {
      throw new InvariantError(
        "Portfolio sudah diproses dan tidak dapat diubah.",
      );
    }

    const updated = await this.repo.update(id, data);
    if (!updated) {
      throw new InvariantError("Gagal memperbarui portfolio.");
    }
    return updated;
  }

  async delete(id: number, userId: number, role: string) {
    const existing = await this.getById(id);

    if (role === "asesor") {
      if (existing.asesor_id !== userId) {
        throw new AuthorizationError(
          "Anda tidak berhak menghapus portfolio ini.",
        );
      }
      if (existing.status !== "Menunggu Verifikasi") {
        throw new InvariantError(
          "Portfolio sudah diproses dan tidak dapat dihapus.",
        );
      }
    }

    return await this.repo.delete(id);
  }

  async verify(id: number, data: VerifikasiPortfolioInput) {
    await this.getById(id);

    const updated = await this.repo.updateVerifikasi(id, data);
    if (!updated) {
      throw new InvariantError("Gagal memverifikasi portfolio.");
    }
    return updated;
  }
}

export const portfolioService = new PortfolioService();
