import { db } from "@/lib/db";
import {
  CreateTukInput,
  UpdateTukInput,
  CreateTukInventarisInput,
  UpdateTukInventarisInput,
} from "@/schemas/tuk.schema";

export class TukRepository {
  async getAll(status?: string) {
    const where = status === "all" ? {} : { status: status || "Aktif" };

    return await db.master_tuk.findMany({
      where,
      include: {
        master_tuk_inventaris: true,
      },
      orderBy: { id: "asc" },
    });
  }

  async getById(id: number) {
    return await db.master_tuk.findUnique({
      where: { id },
      include: {
        master_tuk_inventaris: true,
      },
    });
  }

  async create(data: CreateTukInput) {
    return await db.master_tuk.create({
      data: {
        nama: data.nama,
        keterangan: data.keterangan ?? null,
        tipe: data.tipe ?? null,
        alamat: data.alamat ?? null,
        kapasitas: data.kapasitas ?? null,
        penanggung_jawab: data.penanggung_jawab ?? null,
        status: data.status || "Aktif",
      },
    });
  }

  async update(id: number, data: UpdateTukInput) {
    return await db.master_tuk.update({
      where: { id },
      data: {
        ...(data.nama !== undefined && { nama: data.nama }),
        ...(data.keterangan !== undefined && { keterangan: data.keterangan }),
        ...(data.tipe !== undefined && { tipe: data.tipe }),
        ...(data.alamat !== undefined && { alamat: data.alamat }),
        ...(data.kapasitas !== undefined && { kapasitas: data.kapasitas }),
        ...(data.penanggung_jawab !== undefined && {
          penanggung_jawab: data.penanggung_jawab,
        }),
        ...(data.status !== undefined && { status: data.status }),
      },
    });
  }

  async softDelete(id: number) {
    return await db.master_tuk.update({
      where: { id },
      data: { status: "Nonaktif" },
    });
  }

  // --- INVENTARIS ---

  async getInventarisById(tukId: number, itemId: number) {
    return await db.master_tuk_inventaris.findFirst({
      where: { id: itemId, tuk_id: tukId },
    });
  }

  async createInventaris(tukId: number, data: CreateTukInventarisInput) {
    return await db.master_tuk_inventaris.create({
      data: {
        tuk_id: tukId,
        nama: data.nama,
        jumlah: data.jumlah ?? 0,
      },
    });
  }

  async updateInventaris(itemId: number, data: UpdateTukInventarisInput) {
    return await db.master_tuk_inventaris.update({
      where: { id: itemId },
      data: {
        ...(data.nama !== undefined && { nama: data.nama }),
        ...(data.jumlah !== undefined && { jumlah: data.jumlah }),
      },
    });
  }

  async deleteInventaris(itemId: number) {
    return await db.master_tuk_inventaris.delete({
      where: { id: itemId },
    });
  }
}

export const tukRepository = new TukRepository();
