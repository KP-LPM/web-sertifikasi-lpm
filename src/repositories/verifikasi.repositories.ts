import { db } from "@/lib/db";
import { VerifikasiApl01DTO } from "@/schema/verifikasi.schema";

export const upsertVerifikasiPengajuan = async (
  pengajuanId: number,
  data: VerifikasiApl01DTO,
  statusPengajuanBaru: string
) => {
  return await db.$transaction(async (tx) => {
    // 1. Simpan/Update data verifikasi
    const verifikasi = await tx.verifikasi_pengajuan.upsert({
      where: { pengajuan_id: pengajuanId },
      update: {
        rekomendasi: data.rekomendasi,
        catatan: data.catatan,
        status_pembayaran: data.statusPembayaran,
        sumber_anggaran: data.sumberAnggaran,
        admin_signature_url: data.adminSignatureUrl,
        lsp_signature_url: data.lspSignatureUrl,
        assigned_asesor_id: data.assignedAsesorId,
      },
      create: {
        pengajuan_id: pengajuanId,
        rekomendasi: data.rekomendasi,
        catatan: data.catatan,
        status_pembayaran: data.statusPembayaran,
        sumber_anggaran: data.sumberAnggaran,
        admin_signature_url: data.adminSignatureUrl,
        lsp_signature_url: data.lspSignatureUrl,
        assigned_asesor_id: data.assignedAsesorId,
      },
    });

    // 2. Update status pengajuan di tabel induk
    await tx.pengajuanSkema.update({
      where: { id: pengajuanId },
      data: { status: statusPengajuanBaru },
    });

    return verifikasi;
  });
};