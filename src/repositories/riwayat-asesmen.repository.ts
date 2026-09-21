import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import {
  CreateRiwayatAsesmenInput,
  UpdateRiwayatAsesmenInput,
} from "@/schemas/riwayat-asesmen.schema";

export class RiwayatAsesmenRepository {
  async getByPengajuanId(pengajuanId: number) {
    return await db.riwayat_asesmen_detail.findMany({
      where: { pengajuan_id: pengajuanId },
      include: {
        user: { select: { username: true, email: true, profil: true } },
      },
      orderBy: { created_at: "desc" },
    });
  }

  async getByPengajuanIdAndFormType(pengajuanId: number, formType: string) {
    return await db.riwayat_asesmen_detail.findFirst({
      where: { pengajuan_id: pengajuanId, form_type: formType },
      orderBy: { created_at: "desc" },
    });
  }

  async getById(id: number) {
    return await db.riwayat_asesmen_detail.findUnique({
      where: { id },
      include: {
        user: { select: { username: true, email: true, profil: true } },
      },
    });
  }

  async create(pengajuanId: number, data: CreateRiwayatAsesmenInput) {
    return await db.riwayat_asesmen_detail.create({
      data: {
        pengajuan_id: pengajuanId,
        asesor_id: data.asesor_id,
        form_type: data.form_type,
        form_data: data.form_data as Prisma.InputJsonValue,
        penilaian: data.penilaian as Prisma.InputJsonValue,
        catatan: data.catatan,
        ttd_asesor: data.ttd_asesor,
        ttd_asesi: data.ttd_asesi,
        tanggal_ttd_asesor: data.tanggal_ttd_asesor ? new Date(data.tanggal_ttd_asesor) : null,
        tanggal_ttd_asesi: data.tanggal_ttd_asesi ? new Date(data.tanggal_ttd_asesi) : null,
      },
    });
  }

  async update(id: number, data: UpdateRiwayatAsesmenInput) {
    return await db.riwayat_asesmen_detail.update({
      where: { id },
      data: {
        ...(data.form_data !== undefined && {
          form_data: data.form_data as Prisma.InputJsonValue,
        }),
        ...(data.penilaian !== undefined && {
          penilaian: data.penilaian as Prisma.InputJsonValue,
        }),
        ...(data.catatan !== undefined && { catatan: data.catatan }),
        ...(data.ttd_asesor !== undefined && { ttd_asesor: data.ttd_asesor }),
        ...(data.ttd_asesi !== undefined && { ttd_asesi: data.ttd_asesi }),
        ...(data.tanggal_ttd_asesor !== undefined && {
          tanggal_ttd_asesor: data.tanggal_ttd_asesor ? new Date(data.tanggal_ttd_asesor) : null,
        }),
        ...(data.tanggal_ttd_asesi !== undefined && {
          tanggal_ttd_asesi: data.tanggal_ttd_asesi ? new Date(data.tanggal_ttd_asesi) : null,
        }),
      },
    });
  }

  async delete(id: number) {
    return await db.riwayat_asesmen_detail.delete({ where: { id } });
  }
}

export const riwayatAsesmenRepository = new RiwayatAsesmenRepository();
