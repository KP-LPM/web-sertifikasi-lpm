import { db } from "@/lib/db";
import { HasilAsesmenDTO } from "@/schema/hasil.schema";

export const upsertHasilAsesmen = async (
  pengajuanId: number,
  data: HasilAsesmenDTO
) => {
  return await db.$transaction(async (tx) => {
    // 1. Simpan/Update Hasil Asesmen
    const hasil = await tx.hasil_asesmen.upsert({
      where: { pengajuan_id: pengajuanId },
      update: {
        hasil: data.hasil,
        catatan: data.catatan,
        link_video: data.linkVideo,
      },
      create: {
        pengajuan_id: pengajuanId,
        hasil: data.hasil,
        catatan: data.catatan,
        link_video: data.linkVideo,
      },
    });

    // 2. Update status pengajuan
    await tx.pengajuanSkema.update({
      where: { id: pengajuanId },
      data: { status: "Menunggu Pleno" },
    });

    return hasil;
  });
};