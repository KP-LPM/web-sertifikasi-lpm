import { upsertVerifikasiPengajuan } from "@/repositories/verifikasi.repositories";
import { VerifikasiApl01DTO } from "@/schema/verifikasi.schema";

export const prosesVerifikasiApl01 = async (
  pengajuanId: number,
  data: VerifikasiApl01DTO
) => {
  // Tentukan status pengajuan baru berdasarkan rekomendasi admin
  let statusPengajuanBaru = "Terverifikasi";
  
  if (data.rekomendasi === "Ditolak") {
    statusPengajuanBaru = "Ditolak / Revisi";
  }

  // Panggil repository untuk simpan ke database
  const verifikasiTersimpan = await upsertVerifikasiPengajuan(
    pengajuanId,
    data,
    statusPengajuanBaru
  );

  return verifikasiTersimpan;
};