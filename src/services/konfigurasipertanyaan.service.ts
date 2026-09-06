import {
  konfigurasiRepository,
  KonfigurasiRepository,
} from "@/repositories/konfigurasipertanyaan.repository";
import {
  CreateKonfigurasiInput,
  UpdateKonfigurasiMainInput,
  Step1Input,
  Step2Input,
  Step3Input,
  Step4Input,
} from "@/schemas/konfigurasipertanyaan.schema";
import { NotFoundError, InvariantError } from "@/error/index";

export class KonfigurasiService {
  constructor(private repo: KonfigurasiRepository = konfigurasiRepository) {}

  async getList(skemaId?: number, status?: string) {
    return await this.repo.getList(skemaId, status);
  }

  async getById(id: number) {
    const config = await this.repo.getById(id);
    if (!config) {
      throw new NotFoundError("Konfigurasi soal tidak ditemukan");
    }
    return config;
  }

  async create(data: CreateKonfigurasiInput) {
    const config = await this.repo.create(data);
    if (!config) {
      throw new InvariantError("Gagal membuat konfigurasi soal baru");
    }
    return config;
  }

  async updateMain(id: number, data: UpdateKonfigurasiMainInput) {
    await this.getById(id);

    const config = await this.repo.updateMain(id, data);
    if (!config) {
      throw new InvariantError("Gagal memperbarui data utama konfigurasi");
    }
    return config;
  }

  async delete(id: number) {
    await this.getById(id);

    const config = await this.repo.delete(id);
    if (!config) {
      throw new InvariantError("Gagal menghapus konfigurasi soal");
    }
    return config;
  }

  async publish(id: number) {
    await this.getById(id);

    const config = await this.repo.updateStatus(id, "published");
    if (!config) {
      throw new InvariantError("Gagal mempublikasikan konfigurasi soal");
    }
    return config;
  }

  async updateStep1(id: number, data: Step1Input[]) {
    await this.getById(id);

    const config = await this.repo.updateStep1(id, data);
    if (!config) {
      throw new InvariantError("Gagal memperbarui konfigurasi Step 1");
    }
    return config;
  }

  async updateStep2(id: number, data: Step2Input) {
    await this.getById(id);

    const config = await this.repo.updateStep2(id, data);
    if (!config) {
      throw new InvariantError("Gagal memperbarui konfigurasi Step 2");
    }
    return config;
  }

  async updateStep3(id: number, data: Step3Input[]) {
    await this.getById(id);

    const config = await this.repo.updateStep3(id, data);
    if (!config) {
      throw new InvariantError("Gagal memperbarui konfigurasi Step 3");
    }
    return config;
  }

  async updateStep4(id: number, data: Step4Input[]) {
    await this.getById(id);

    const config = await this.repo.updateStep4(id, data);
    if (!config) {
      throw new InvariantError("Gagal memperbarui konfigurasi Step 4");
    }
    return config;
  }
}

export const konfigurasiService = new KonfigurasiService();
