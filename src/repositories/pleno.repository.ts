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
            pengajuan_skema: true, // Ambil detail pengajuan
            users: { select: { username: true, email: true } }, // Info asesor
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

  async update(id: number, data: UpdatePlenoInput) {
    const { skema_ids, ...restData } = data;

    return await db.pleno_batch.update({
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

  async addAsesiBulk(plenoBatchId: number, pengajuanIds: number[]) {
    const dataToInsert = pengajuanIds.map((pengajuanId) => ({
      pleno_batch_id: plenoBatchId,
      pengajuan_id: pengajuanId,
    }));

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
