import { upsertHasilAsesmen } from "@/repositories/hasil.repository";
import { HasilAsesmenDTO } from "@/schema/hasil.schema";

export const prosesHasilAsesmen = async (
  pengajuanId: number,
  data: HasilAsesmenDTO
) => {
  const hasilTersimpan = await upsertHasilAsesmen(pengajuanId, data);
  return hasilTersimpan;
};