import { db } from "@/lib/db";
import { PenilaianApl02DTO } from "@/schemas/apl02.schema";

export const upsertPenilaianApl02 = async (
  pengajuanId: number,
  data: PenilaianApl02DTO,
  statusBaru: string,
) => {
  return await db.$transaction(async (tx) => {
    // 1. Simpan/Update header penilaian APL02
    const apl02 = await tx.apl02_penilaian.upsert({
      where: { pengajuan_id: pengajuanId },
      update: {
        rekomendasi_apl02: data.rekomendasiApl02,
        ttd_asesor: data.ttdAsesor,
        nama_asesor: data.namaAsesor,
        asesor_reg: data.asesorReg,
        tanggal: data.tanggal ? new Date(data.tanggal) : null,
      },
      create: {
        pengajuan_id: pengajuanId,
        rekomendasi_apl02: data.rekomendasiApl02,
        ttd_asesor: data.ttdAsesor,
        nama_asesor: data.namaAsesor,
        asesor_reg: data.asesorReg,
        tanggal: data.tanggal ? new Date(data.tanggal) : null,
      },
    });



    await tx.pengajuanSkema.update({
      where: { id: pengajuanId },
      data: { status: statusBaru },
    });

    return apl02;
  });
};
