import { db } from "@/lib/db";
import {
  CreatePlenoInput,
  UpdatePlenoInput,
  AddAttendeeInput,
  UpdateAsesiPlenoInput,
} from "@/schemas/pleno.schema";

export class PlenoRepository {
  async getList() {
    return await db.pleno_batch.findMany({
      orderBy: { created_at: "desc" },
      include: {
        pleno_batch_skema: {
          include: { master_skema: { select: { namaSkema: true } } },
        },
        pleno_asesi: {
          include: {
            pengajuan_skema: {
              include: {
                skema: { select: { namaSkema: true } },
                dataPribadi: { select: { namaLengkap: true, nik: true } },
                user: { select: { username: true, profil: { select: { namaLengkap: true } } } }
              }
            },
            users: {
              select: {
                username: true,
                profil: { select: { namaLengkap: true } }
              }
            }
          }
        },
      },
    });
  }

  async getById(id: number) {
    return await db.pleno_batch.findUnique({
      where: { id },
      include: {
        pleno_batch_skema: { include: { master_skema: true } },
        pleno_attendee: true,
        pleno_asesi: {
          include: {
            pengajuan_skema: {
              include: {
                dataPribadi: { select: { namaLengkap: true, nik: true } },
                skema: { select: { namaSkema: true } },
                user: { select: { username: true, profil: { select: { namaLengkap: true } } } }
              }
            },
            users: {
              select: {
                username: true,
                email: true,
                profil: { select: { namaLengkap: true } },
              }
            },
          },
        },
      },
    });
  }

  async create(data: CreatePlenoInput) {
    const { skema_ids, ...restData } = data;

    return await db.pleno_batch.create({
      data: {
        ...restData,
        pleno_batch_skema: skema_ids?.length
          ? { create: skema_ids.map((skemaId) => ({ skema_id: skemaId })) }
          : undefined,
      },
      include: { pleno_batch_skema: true },
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async update(id: number, data: UpdatePlenoInput, tx: any = db) {
    const { skema_ids, ...restData } = data;

    return await tx.pleno_batch.update({
      where: { id },
      data: {
        ...restData,
        // Jika skema_ids dikirim, timpa yang lama dengan yang baru
        ...(skema_ids && {
          pleno_batch_skema: {
            deleteMany: {},
            create: skema_ids.map((skemaId) => ({ skema_id: skemaId })),
          },
        }),
      },
      include: { pleno_batch_skema: true },
    });
  }

  async delete(id: number) {
    return await db.pleno_batch.delete({ where: { id } });
  }

  // --- ASESI ---

  async getPengajuanMenunggu(skemaIds?: number[], pengajuanIds?: number[]) {
    return await db.pengajuanSkema.findMany({
      where: {
        status: { equals: "Menunggu Pleno", mode: "insensitive" },
        ...(skemaIds && skemaIds.length > 0
          ? { skemaId: { in: skemaIds } }
          : {}),
        ...(pengajuanIds && pengajuanIds.length > 0
          ? { id: { in: pengajuanIds } }
          : {}),
      },
      include: {
        user: { select: { username: true, email: true } },
        dataPribadi: {
          select: {
            namaLengkap: true,
            nik: true,
            noHp: true,
          },
        },
        skema: { select: { namaSkema: true, kodeSkema: true } },
        hasil_asesmen: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async getAsesiByPlenoBatchId(plenoBatchId: number) {
    return await db.pleno_asesi.findMany({
      where: { pleno_batch_id: plenoBatchId },
      include: {
        pengajuan_skema: {
          include: {
            user: { select: { username: true, email: true } },
            dataPribadi: {
              select: {
                namaLengkap: true,
                nik: true,
                noHp: true,
              },
            },
            skema: { select: { namaSkema: true, kodeSkema: true } },
            hasil_asesmen: true,
          },
        },
        users: { select: { username: true, email: true } },
      },
    });
  }

  async addAsesiBulk(plenoBatchId: number, pengajuanIds: number[]) {
    const pengajuans = await db.pengajuanSkema.findMany({
      where: { id: { in: pengajuanIds } },
      include: {
        jadwal_asesmen_peserta: {
          include: { jadwal_asesmen: true },
        },
        hasil_asesmen: true,
        verifikasi_pengajuan: true,
      },
    });

    const dataToInsert = pengajuans.map((p) => {
      const asesorId =
        p.jadwal_asesmen_peserta?.[0]?.jadwal_asesmen?.asesor_id ||
        p.verifikasi_pengajuan?.assigned_asesor_id;

      // Default mapping for "Kompeten" (K) or "Belum Kompeten" (BK) based on text.
      let rekomendasi = null;
      if (p.hasil_asesmen?.hasil) {
        if (p.hasil_asesmen.hasil.toLowerCase() === "kompeten") {
          rekomendasi = "K";
        } else if (p.hasil_asesmen.hasil.toLowerCase() === "belum kompeten") {
          rekomendasi = "BK";
        } else {
          rekomendasi = p.hasil_asesmen.hasil;
        }
      }

      return {
        pleno_batch_id: plenoBatchId,
        pengajuan_id: p.id,
        asesor_id: asesorId || null,
        rekomendasi_asesor: rekomendasi,
        catatan: p.hasil_asesmen?.catatan || null,
      };
    });

    return await db.pleno_asesi.createMany({
      data: dataToInsert,
      skipDuplicates: true,
    });
  }

  async updateAsesi(asesiId: number, data: UpdateAsesiPlenoInput) {
    return await db.pleno_asesi.update({
      where: { id: asesiId },
      data: {
        status_pleno: data.status_pleno,
        catatan: data.catatan,
      },
    });
  }

  // --- ATTENDEE ---

  async addAttendee(plenoBatchId: number, data: AddAttendeeInput) {
    return await db.pleno_attendee.create({
      data: {
        pleno_batch_id: plenoBatchId,
        user_id: data.user_id,
        role: data.role,
        nama: data.nama,
      },
    });
  }

  async removeAttendee(attendeeId: number) {
    return await db.pleno_attendee.delete({ where: { id: attendeeId } });
  }
}

export const plenoRepository = new PlenoRepository();
