import { db } from "@/lib/db";
import { PenilaianApl02DTO } from "@/schema/apl02.schema";

export const upsertPenilaianApl02 = async (
  pengajuanId: number,
  data: PenilaianApl02DTO,
  statusBaru: string
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

    // 2. Hapus data penyusun/validator lama 
    await tx.apl02_penyusun_validator.deleteMany({
      where: { apl02_id: apl02.id },
    });

    // 3. Kumpulkan data penyusun & validator baru
    const penyusunValidatorData: Array<{
      apl02_id: number;
      peran: string;
      nama: string;
      no_met?: string | null;
      ttd_tanggal?: Date | null;
    }> = [];
    
    if (data.penyusun && data.penyusun.length > 0) {
      data.penyusun.forEach((p) => {
        penyusunValidatorData.push({
          apl02_id: apl02.id,
          peran: "Penyusun",
          nama: p.nama,
          no_met: p.noReg,
          ttd_tanggal: p.tanggal ? new Date(p.tanggal) : null,
        });
      });
    }

    if (data.validator && data.validator.length > 0) {
      data.validator.forEach((v) => {
        penyusunValidatorData.push({
          apl02_id: apl02.id,
          peran: "Validator",
          nama: v.nama,
          no_met: v.noReg,
          ttd_tanggal: v.tanggal ? new Date(v.tanggal) : null,
        });
      });
    }

    // 4. Masukkan data penyusun/validator ke database
    if (penyusunValidatorData.length > 0) {
      await tx.apl02_penyusun_validator.createMany({
        data: penyusunValidatorData,
      });
    }

    await tx.pengajuanSkema.update({
        where: { id: pengajuanId },
        data: { status: statusBaru },
      });

    return apl02;
  });
};