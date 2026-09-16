import { db } from "@/lib/db";
import { HasilAsesmenDTO } from "@/schemas/hasil.schema";

export const upsertHasilAsesmen = async (
  pengajuanId: number,
  data: HasilAsesmenDTO,
) => {
  return await db.$transaction(async (tx) => {
    // 1. Simpan/Update Hasil Asesmen
    const newHasil = data.hasil === "Perlu Perbaikan" ? "Belum Kompeten" : data.hasil;

    const hasil = await tx.hasil_asesmen.upsert({
      where: { pengajuan_id: pengajuanId },
      update: {
        hasil: newHasil,
        catatan: data.catatan,
        link_video: data.linkVideo,
      },
      create: {
        pengajuan_id: pengajuanId,
        hasil: newHasil,
        catatan: data.catatan,
        link_video: data.linkVideo,
      },
    });

    // 2. Update status pengajuan
    const newStatus = data.hasil === "Perlu Perbaikan" ? "Perlu Perbaikan" : "Menunggu Pleno";
    await tx.pengajuanSkema.update({
      where: { id: pengajuanId },
      data: { status: newStatus },
    });

    return hasil;
  });
};
