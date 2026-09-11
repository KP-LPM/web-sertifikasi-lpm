import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import {
  CreateSuratInput,
  UpdateSuratInput,
  SuratFilterInput,
} from "@/schemas/surat.schema";

export class SuratRepository {
  async getAll(filters?: SuratFilterInput) {
    const where: Prisma.suratWhereInput = {
      ...(filters?.kategori && { kategori: filters.kategori }),
      ...(filters?.jenis_surat && { jenis_surat: filters.jenis_surat }),
      ...(filters?.status && { status: filters.status }),
      ...(filters?.skema_id && { skema_id: filters.skema_id }),
    };

    return await db.surat.findMany({
      where,
      include: {
        master_skema: {
          select: { namaSkema: true, kodeSkema: true },
        },
      },
      orderBy: { created_at: "desc" },
    });
  }

  async getById(id: number) {
    return await db.surat.findUnique({
      where: { id },
      include: {
        master_skema: {
          select: { namaSkema: true, kodeSkema: true },
        },
      },
    });
  }

  async getByNomorSurat(nomorSurat: string) {
    return await db.surat.findUnique({
      where: { nomor_surat: nomorSurat },
    });
  }

  async create(data: CreateSuratInput) {
    return await db.surat.create({
      data: {
        nomor_surat: data.nomor_surat,
        judul: data.judul,
        kategori: data.kategori,
        jenis_surat: data.jenis_surat,
        nama_jenis_surat: data.nama_jenis_surat ?? null,
        tanggal_terbit: data.tanggal_terbit
          ? new Date(data.tanggal_terbit)
          : null,
        penerbit: data.penerbit ?? null,
        penerima: data.penerima ?? null,
        skema_id: data.skema_id ? Number(data.skema_id) : null,
        jumlah_asesi: data.jumlah_asesi ? Number(data.jumlah_asesi) : null,
        status: data.status ?? "Draft",
        url_dokumen: data.url_dokumen ?? null,
        url_gdrive: data.url_gdrive ?? null,
        catatan: data.catatan ?? null,
        no_sk: data.no_sk ?? null,
        pimpinan_sidang: data.pimpinan_sidang ?? null,
        notulis: data.notulis ?? null,
        nama_asesor: data.nama_asesor ?? null,
        no_met_asesor: data.no_met_asesor ?? null,
        lokasi: data.lokasi ?? null,
        detail_payload: data.detail_payload ?? null,
      },
    });
  }

  async update(id: number, data: UpdateSuratInput) {
    return await db.surat.update({
      where: { id },
      data: {
        ...(data.status !== undefined && { status: data.status }),
        ...(data.tanggal_terbit !== undefined && {
          tanggal_terbit: data.tanggal_terbit
            ? new Date(data.tanggal_terbit)
            : null,
        }),
        ...(data.url_dokumen !== undefined && {
          url_dokumen: data.url_dokumen,
        }),
        ...(data.url_gdrive !== undefined && { url_gdrive: data.url_gdrive }),
        ...(data.catatan !== undefined && { catatan: data.catatan }),
      },
    });
  }

  async archive(id: number) {
    return await db.surat.update({
      where: { id },
      data: { status: "Arsip" },
    });
  }
}

export const suratRepository = new SuratRepository();
