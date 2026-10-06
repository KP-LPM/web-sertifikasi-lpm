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
    const list = await db.konfigurasi_pertanyaan.findMany({
      where: {
        ...(skemaId && { skema_id: skemaId }),
        ...(status && { status }),
      },
      include: {
        master_skema_konfigurasi_pertanyaan_skema_idTomaster_skema: {
          select: { namaSkema: true },
        },
        form_asesor: {
          include: {
            users: {
              select: {
                id: true,
                profil: {
                  select: {
                    namaLengkap: true,
                    nomorRegistrasiMet: true,
                    tandaTangan: true,
                  }
                }
              }
            }
          }
        }
      },
      orderBy: { created_at: "desc" },
    });

    return list.map((item) => ({
      ...item,
      skema: {
        namaSkema: item.master_skema_konfigurasi_pertanyaan_skema_idTomaster_skema?.namaSkema,
      },
      penyusun: item.form_asesor,
    }));
  }

  async getById(id: number) {
    return await db.konfigurasi_pertanyaan.findUnique({
      where: { id },
      include: {
        form_asesor: {
          orderBy: { urutan: "asc" },
          include: {
            users: {
              select: {
                id: true,
                email: true,
                role: true,
                profil: {
                  select: {
                    namaLengkap: true,
                    nomorRegistrasiMet: true,
                    tandaTangan: true,
                  }
                }
              }
            }
          }
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
        konfigurasi_step1_pertanyaan: {
          create: step1.map((p, i) => ({ ...p, urutan: i + 1 })),
        },
        form_asesor: {
          create: penyusun.map((p, i) => ({ ...p, urutan: i + 1, form_type: p.form_type || 'step2', ttd_tanggal: new Date() })),
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

  async updateAll(id: number, data: CreateKonfigurasiInput) {
    const { step1, step2, step3, step4, penyusun, ...mainData } = data;
    return await db.konfigurasi_pertanyaan.update({
      where: { id },
      data: {
        ...mainData,
        konfigurasi_step1_pertanyaan: {
          deleteMany: {},
          create: step1.map((p, i) => ({ ...p, urutan: i + 1 })),
        },
        form_asesor: {
          deleteMany: {},
          create: penyusun.map((p, i) => ({ ...p, urutan: i + 1, form_type: p.form_type || 'step2', ttd_tanggal: new Date() })),
        },
        konfigurasi_step2_skenario: step2 ? {
          upsert: {
            create: step2,
            update: step2
          }
        } : undefined,
        konfigurasi_step3_lingkup: {
          deleteMany: {},
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
          deleteMany: {},
          create: step4.map((p, i) => ({ ...p, urutan: i + 1 })),
        },
      },
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
          })),
        },
      },
    });
  }

  async updateStep2(id: number, data: Step2Input, penyusun?: { peran: string; user_id: number; form_type?: string | null }[]) {
    // Upsert digunakan karena relasinya 1-to-1
    const skenario = await db.konfigurasi_step2_skenario.upsert({
      where: { konfigurasi_id: id },
      update: data,
      create: { konfigurasi_id: id, ...data },
    });

    if (penyusun !== undefined) {
      await db.form_Asesor.deleteMany({
        where: { konfigurasi_id: id, form_type: "step2" },
      });
      if (penyusun.length > 0) {
        await db.form_Asesor.createMany({
          data: penyusun.map((p, i) => ({
            konfigurasi_id: id,
            peran: p.peran,
            user_id: p.user_id,
            form_type: p.form_type || "step2",
            urutan: i + 1,
            ttd_tanggal: new Date(),
          })),
        });
      }
    }

    return skenario;
  }

  async updateStep3(id: number, data: Step3Input[], penyusun?: { peran: string; user_id: number; form_type?: string | null }[]) {
    const updated = await db.konfigurasi_pertanyaan.update({
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

    if (penyusun !== undefined) {
      await db.form_Asesor.deleteMany({
        where: { konfigurasi_id: id, form_type: "step3" },
      });
      if (penyusun.length > 0) {
        await db.form_Asesor.createMany({
          data: penyusun.map((p, i) => ({
            konfigurasi_id: id,
            peran: p.peran,
            user_id: p.user_id,
            form_type: p.form_type || "step3",
            urutan: i + 1,
            ttd_tanggal: new Date(),
          })),
        });
      }
    }

    return updated;
  }

  async updateStep4(id: number, data: Step4Input[], penyusun?: { peran: string; user_id: number; form_type?: string | null }[]) {
    const updated = await db.konfigurasi_pertanyaan.update({
      where: { id },
      data: {
        konfigurasi_step4_pertanyaan: {
          deleteMany: {},
          create: data.map((p, i) => ({ ...p, urutan: i + 1 })),
        },
      },
    });

    if (penyusun !== undefined) {
      await db.form_Asesor.deleteMany({
        where: { konfigurasi_id: id, form_type: "step4" },
      });
      if (penyusun.length > 0) {
        await db.form_Asesor.createMany({
          data: penyusun.map((p, i) => ({
            konfigurasi_id: id,
            peran: p.peran,
            user_id: p.user_id,
            form_type: p.form_type || "step4",
            urutan: i + 1,
            ttd_tanggal: new Date(),
          })),
        });
      }
    }

    return updated;
  }
}

export const konfigurasiRepository = new KonfigurasiRepository();
