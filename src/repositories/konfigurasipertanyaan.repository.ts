import { db } from "@/lib/db";
import {
  CreateKonfigurasiInput,
  UpdateKonfigurasiMainInput,
  Step1Input,
  Step2Input,
  Step3Input,
  Step4Input,
} from "@/schemas/konfigurasipertanyaan.schema";

export class KonfigurasiRepository {
  async getList(skemaId?: number, status?: string) {
    return await db.konfigurasi_pertanyaan.findMany({
      where: {
        ...(skemaId && { skema_id: skemaId }),
        ...(status && { status }),
      },
      orderBy: { created_at: "desc" },
    });
  }

  async getById(id: number) {
    return await db.konfigurasi_pertanyaan.findUnique({
      where: { id },
      include: {
        konfigurasi_pertanyaan_penyusun: { orderBy: { urutan: "asc" } },
        konfigurasi_step1_pertanyaan: {
          orderBy: { urutan: "asc" },
          include: { konfigurasi_step1_opsi: { orderBy: { urutan: "asc" } } },
        },
        konfigurasi_step2_skenario: true,
        konfigurasi_step3_lingkup: {
          orderBy: { urutan: "asc" },
          include: {
            konfigurasi_step3_sub_pertanyaan: { orderBy: { urutan: "asc" } },
          },
        },
        konfigurasi_step4_pertanyaan: { orderBy: { urutan: "asc" } },
      },
    });
  }

  async create(data: CreateKonfigurasiInput) {
    const { step1, step2, step3, step4, penyusun, ...mainData } = data;

    return await db.konfigurasi_pertanyaan.create({
      data: {
        ...mainData,
        konfigurasi_pertanyaan_penyusun: {
          create: penyusun.map((p, i) => ({ ...p, urutan: i + 1 })),
        },
        konfigurasi_step1_pertanyaan: {
          create: step1.map((p, i) => ({
            pertanyaan_text: p.pertanyaan_text,
            urutan: i + 1,
            konfigurasi_step1_opsi: {
              create: p.opsi.map((o, j) => ({ ...o, urutan: j + 1 })),
            },
          })),
        },
        konfigurasi_step2_skenario: step2 ? { create: step2 } : undefined,
        konfigurasi_step3_lingkup: {
          create: step3.map((l, i) => ({
            nama_lingkup: l.nama_lingkup,
            urutan: i + 1,
            konfigurasi_step3_sub_pertanyaan: {
              create: l.sub_pertanyaan.map((sub, j) => ({
                ...sub,
                urutan: j + 1,
              })),
            },
          })),
        },
        konfigurasi_step4_pertanyaan: {
          create: step4.map((p, i) => ({ ...p, urutan: i + 1 })),
        },
      },
    });
  }

  async updateMain(id: number, data: UpdateKonfigurasiMainInput) {
    return await db.konfigurasi_pertanyaan.update({
      where: { id },
      data,
    });
  }

  async updateStatus(id: number, status: string) {
    return await db.konfigurasi_pertanyaan.update({
      where: { id },
      data: { status },
    });
  }

  async delete(id: number) {
    return await db.konfigurasi_pertanyaan.delete({ where: { id } });
  }

  async updateStep1(id: number, data: Step1Input[]) {
    return await db.konfigurasi_pertanyaan.update({
      where: { id },
      data: {
        konfigurasi_step1_pertanyaan: {
          deleteMany: {}, // Hapus array lama
          create: data.map((p, i) => ({
            pertanyaan_text: p.pertanyaan_text,
            urutan: i + 1,
            konfigurasi_step1_opsi: {
              create: p.opsi.map((o, j) => ({ ...o, urutan: j + 1 })),
            },
          })),
        },
      },
    });
  }

  async updateStep2(id: number, data: Step2Input) {
    // Upsert digunakan karena relasinya 1-to-1
    return await db.konfigurasi_step2_skenario.upsert({
      where: { konfigurasi_id: id },
      update: data,
      create: { konfigurasi_id: id, ...data },
    });
  }

  async updateStep3(id: number, data: Step3Input[]) {
    return await db.konfigurasi_pertanyaan.update({
      where: { id },
      data: {
        konfigurasi_step3_lingkup: {
          deleteMany: {},
          create: data.map((l, i) => ({
            nama_lingkup: l.nama_lingkup,
            urutan: i + 1,
            konfigurasi_step3_sub_pertanyaan: {
              create: l.sub_pertanyaan.map((sub, j) => ({
                ...sub,
                urutan: j + 1,
              })),
            },
          })),
        },
      },
    });
  }

  async updateStep4(id: number, data: Step4Input[]) {
    return await db.konfigurasi_pertanyaan.update({
      where: { id },
      data: {
        konfigurasi_step4_pertanyaan: {
          deleteMany: {},
          create: data.map((p, i) => ({ ...p, urutan: i + 1 })),
        },
      },
    });
  }
}

export const konfigurasiRepository = new KonfigurasiRepository();
