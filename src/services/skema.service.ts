import { SkemaRepository } from "@/repositories/skema.repository";
import { InvariantError, NotFoundError } from "../error/index";
import {
  BuktiAdministratifInput,
  CreateSkemaInput,
  ElemenKompetensiInput,
  PersyaratanDasarInput,
  UnitKompetensiInput,
  UpdateSkemaInput,
} from "@/schemas/skema.schema";
import { MasterPersyaratanDasar, MasterUnitKompetensi } from "@prisma/client";

export class SkemaService {
  private skemaRepository = new SkemaRepository();

  async getSkema() {
    return await this.skemaRepository.getSkemaList();
  }

  async getSkemaById(id: number) {
    const skema = await this.skemaRepository.getSkemaById(id);
    if (!skema) {
      throw new NotFoundError("skema tidak ditemukan");
    }
    return skema;
  }

  async createSkema(data: CreateSkemaInput) {
    const newSkema = await this.skemaRepository.createSkema(data);
    if (!newSkema) {
      throw new InvariantError("Gagal membuat pengguna baru");
    }
    return newSkema;
  }

  async updateSkema(id: number, data: UpdateSkemaInput) {
    const existingSkema = await this.skemaRepository.isSkemaExist(id);
    if (!existingSkema) {
      throw new NotFoundError("Skema tidak ditemukan");
    }
    const skema = await this.skemaRepository.updateSkema(id, data);
    if (!skema) {
      throw new InvariantError("Gagal mengupdate status skema");
    }
    return skema;
  }

  async deleteSkema(id: number) {
    const existingSkema = await this.skemaRepository.isSkemaExist(id);
    if (!existingSkema) {
      throw new NotFoundError("Skema tidak ditemukan");
    }
    const Skema = await this.skemaRepository.deleteSkema(id);
    if (!Skema) {
      throw new InvariantError("Gagal menghapus Skema");
    }
    return Skema;
  }

  async addPersyaratanDasar(
    skemaId: number,
    data: PersyaratanDasarInput,
  ): Promise<MasterPersyaratanDasar> {
    const skema = await this.getSkemaById(skemaId);
    if (!skema) throw new NotFoundError("Skema tidak ditemukan.");

    // PERBAIKAN: Gunakan repository, bukan memanggil fungsi ini lagi
    return await this.skemaRepository.addPersyaratanDasar(skemaId, data);
  }

  async updatePersyaratanDasar(
    itemId: number,
    data: Partial<PersyaratanDasarInput>,
  ): Promise<MasterPersyaratanDasar> {
    const persyaratanDasar = await this.skemaRepository.updatePersyaratanDasar(
      itemId,
      data,
    );
    if (!persyaratanDasar) {
      throw new InvariantError("Gagal mengupdate persyaratan dasar");
    }
    return persyaratanDasar;
  }

  async deletePersyaratanDasar(itemId: number) {
    const persyaratanDasar =
      await this.skemaRepository.deletePersyaratanDasar(itemId);
    if (!persyaratanDasar) {
      throw new InvariantError("Gagal menghapus persyaratan dasar");
    }
    return persyaratanDasar;
  }

  async addBuktiAdministratif(skemaId: number, data: BuktiAdministratifInput) {
    const buktiAdministratif = await this.skemaRepository.addBuktiAdministratif(
      skemaId,
      data,
    );
    if (!buktiAdministratif) {
      throw new InvariantError("Gagal menambahkan bukti administratif");
    }
    return buktiAdministratif;
  }

  async updateBuktiAdministratif(
    itemId: number,
    data: BuktiAdministratifInput,
  ) {
    const buktiAdministratif =
      await this.skemaRepository.updateBuktiAdministratif(itemId, data);
    if (!buktiAdministratif) {
      throw new InvariantError("Gagal mengupdate bukti administratif");
    }
    return buktiAdministratif;
  }

  async deleteBuktiAdministratif(itemId: number) {
    const buktiAdministratif =
      await this.skemaRepository.deleteBuktiAdministratif(itemId);
    if (!buktiAdministratif) {
      throw new InvariantError("Gagal menghapus bukti administratif");
    }
    return buktiAdministratif;
  }

  async addUnitKompetensi(
    skemaId: number,
    data: UnitKompetensiInput,
  ): Promise<MasterUnitKompetensi> {
    const skema = await this.getSkemaById(skemaId);
    if (!skema) {
      throw new NotFoundError("Skema tidak ditemukan.");
    }
    const unitKompetensi = await this.skemaRepository.addUnitKompetensi(
      skemaId,
      data,
    );
    if (!unitKompetensi) {
      throw new InvariantError("Gagal menambahkan unit kompetensi");
    }
    return unitKompetensi;
  }

  async updateUnitKompetensi(
    id: number,
    data: Partial<Omit<UnitKompetensiInput, "elemen">>,
  ): Promise<MasterUnitKompetensi> {
    const unitKompetensi = await this.skemaRepository.updateUnitKompetensi(
      id,
      data,
    );
    if (!unitKompetensi) {
      throw new InvariantError("Gagal menambahkan unit kompetensi");
    }
    return unitKompetensi;
  }

  async deleteUnitKompetensi(id: number) {
    const unitKompetensi = await this.skemaRepository.deleteUnitKompetensi(id);
    if (!unitKompetensi) {
      throw new InvariantError("Gagal menambahkan unit kompetensi");
    }
    return unitKompetensi;
  }

  async addElemenKompetensi(unitId: number, data: ElemenKompetensiInput) {
    const elemenKompetensi = await this.skemaRepository.addElemenKompetensi(
      unitId,
      data,
    );
    if (!elemenKompetensi) {
      throw new InvariantError("Gagal menambahkan elemen kompetensi");
    }
    return elemenKompetensi;
  }

  async updateElemenKompetensi(
    id: number,
    data: Partial<ElemenKompetensiInput>,
  ) {
    const elemenKompetensi = await this.skemaRepository.updateElemenKompetensi(
      id,
      data,
    );
    if (!elemenKompetensi) {
      throw new InvariantError("Gagal mengupdate elemen kompetensi");
    }
    return elemenKompetensi;
  }

  async deleteElemenKompetensi(id: number) {
    const elemenKompetensi =
      await this.skemaRepository.deleteElemenKompetensi(id);
    if (!elemenKompetensi) {
      throw new InvariantError("Gagal menambahkan elemen kompetensi");
    }
    return elemenKompetensi;
  }
}

export const skemaService = new SkemaService();
