import { upsertPenilaianApl02 } from "@/repositories/apl02.repository";
import { PenilaianApl02DTO } from "@/schema/apl02.schema";

export const prosesPenilaianApl02 = async (
  pengajuanId: number,
  data: PenilaianApl02DTO
) => {

  let statusBaru = "Terverifikasi";

  if (data.rekomendasiApl02 === "Dapat dilanjutkan") {

    statusBaru = "Menunggu Asesmen"; 
  } else if (data.rekomendasiApl02 === "Tidak dapat dilanjutkan") {

    statusBaru = "Ditolak / Revisi";
  }

  const apl02Tersimpan = await upsertPenilaianApl02(pengajuanId, data, statusBaru);
  
  return apl02Tersimpan;
};