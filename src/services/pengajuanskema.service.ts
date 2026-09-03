import { insertPengajuanBaru } from "@/repositories/pengajuanskema.repositories";
import { CreatePengajuanDTO } from "@/schema/pengajuanskema.schema";

export const prosesPengajuanBaru = async (data: CreatePengajuanDTO) => {
  // Logic 1: Generate Nomor Pengajuan (Contoh: APL-1712345678)
  const timestamp = Date.now();
  const nomorPengajuan = `APL-${timestamp}`;

  // Logic 2: Panggil repository untuk simpan ke database
  const pengajuanTersimpan = await insertPengajuanBaru(nomorPengajuan, data);

  return pengajuanTersimpan;
};