import {
  plenoRepository,
  PlenoRepository,
} from "@/repositories/pleno.repository";
import {
  CreatePlenoInput,
  UpdatePlenoInput,
  AddAttendeeInput,
  UpdateAsesiPlenoInput,
} from "@/schemas/pleno.schema";
import { NotFoundError, InvariantError } from "@/error/index";
import { suratService } from "@/services/surat.service";

export class PlenoService {
  constructor(private repo: PlenoRepository = plenoRepository) { }

  async getList() {
    return await this.repo.getList();
  }

  async getById(id: number) {
    const pleno = await this.repo.getById(id);
    if (!pleno) throw new NotFoundError("Jadwal Pleno tidak ditemukan");
    return pleno;
  }

  async create(data: CreatePlenoInput) {
    try {
      const pleno = await this.repo.create(data);
      // if (!pleno) throw new InvariantError("Gagal membuat jadwal pleno baru");
      return pleno;
    } catch (error) {
      console.log(error)
      throw error;
    }
  }

  async update(id: number, data: UpdatePlenoInput) {
    await this.getById(id);
    // Wrap di dalam transaction agar atomik
    const { db } = await import("@/lib/db");
    const result = await db.$transaction(async (tx) => {
      const pleno = await this.repo.update(id, data, tx);
      if (!pleno) throw new InvariantError("Gagal memperbarui jadwal pleno");
      
      // Jika status sidang pleno diubah menjadi "Selesai"
      if (data.status === "Selesai") {
        const asesiList = await this.repo.getAsesiByPlenoBatchId(id);
        const pengajuanIds = asesiList.map(a => a.pengajuan_id);
        
        if (pengajuanIds.length > 0) {
          // Update status pengajuan skema menjadi "Selesai"
          await tx.pengajuanSkema.updateMany({
            where: { id: { in: pengajuanIds } },
            data: { status: "Selesai" }
          });

          // Update status_pleno berdasarkan rekomendasi_asesor
          await tx.pleno_asesi.updateMany({
            where: { pleno_batch_id: id, rekomendasi_asesor: "K" },
            data: { status_pleno: "K" }
          });
          await tx.pleno_asesi.updateMany({
            where: { pleno_batch_id: id, rekomendasi_asesor: "BK" },
            data: { status_pleno: "BK" }
          });
        }
      }
      return pleno;
    });

    if (data.status === "Selesai") {
      try {
        const d = new Date();
        const baseNomor = `PLENO-${id}-${d.getFullYear()}`;
        
        if (data.link_surat_berita_pleno) {
          await suratService.create({
            nomor_surat: `BAP-${baseNomor}`,
            judul: "Surat Berita Acara Pleno",
            kategori: "surat_masuk",
            jenis_surat: "berita_acara_pleno",
            nama_jenis_surat: "Surat Berita Acara Pleno",
            tanggal_terbit: d,
            status: "Terbit",
            url_gdrive: data.link_surat_berita_pleno,
            url_dokumen: data.link_surat_berita_pleno,
          });
        }
        if (data.link_surat_keputusan_direktur) {
          await suratService.create({
            nomor_surat: `SK-${baseNomor}`,
            judul: "Surat Keputusan Direktur",
            kategori: "surat_keluar",
            jenis_surat: "keputusan_pleno",
            nama_jenis_surat: "Surat Hasil Keputusan Pleno",
            tanggal_terbit: d,
            status: "Terbit",
            url_gdrive: data.link_surat_keputusan_direktur,
            url_dokumen: data.link_surat_keputusan_direktur,
          });
        }
        if (data.link_surat_blanko_bnsp) {
          await suratService.create({
            nomor_surat: `BLNK-${baseNomor}`,
            judul: "Surat Blanko BNSP",
            kategori: "surat_keluar",
            jenis_surat: "blanko_bnsp",
            nama_jenis_surat: "Surat Blanko BNSP",
            tanggal_terbit: d,
            status: "Terbit",
            url_gdrive: data.link_surat_blanko_bnsp,
            url_dokumen: data.link_surat_blanko_bnsp,
          });
        }
      } catch (err) {
        console.error("Gagal menyimpan surat-surat pleno secara otomatis:", err);
      }
    }

    return result;
  }

  async delete(id: number) {
    await this.getById(id);
    const pleno = await this.repo.delete(id);
    if (!pleno) throw new InvariantError("Gagal membatalkan jadwal pleno");
    return pleno;
  }

  async addAsesiBulk(plenoBatchId: number, pengajuanIds?: number[]) {
    const pleno = await this.getById(plenoBatchId);

    // Ambil daftar skema_id terkait pleno batch ini (jika ada skema)
    const skemaIds = pleno.pleno_batch_skema?.map((s) => s.skema_id) || [];

    // Ambil pengajuan yang berstatus 'Selesai' (dan sesuai skema pleno jika pleno memiliki batasan skema)
    const pengajuanSelesai = await this.repo.getPengajuanMenunggu(
      skemaIds.length > 0 ? skemaIds : undefined,
      pengajuanIds,
    );

    if (pengajuanSelesai.length === 0) {
      throw new InvariantError(
        "Tidak ada pengajuan dengan status 'Selesai' yang valid untuk ditambahkan ke sidang pleno ini",
      );
    }

    // Jika daftar pengajuan_ids spesifik dikirim, validasi apakah semua ID yang diminta berstatus selesai
    if (pengajuanIds && pengajuanIds.length > 0) {
      const validIdsSet = new Set(pengajuanSelesai.map((p) => p.id));
      const invalidIds = pengajuanIds.filter((id) => !validIdsSet.has(id));
      if (invalidIds.length > 0) {
        throw new InvariantError(
          `Pengajuan berikut tidak dapat ditambahkan karena belum berstatus 'Selesai' atau skema tidak sesuai: ID [${invalidIds.join(", ")}]`,
        );
      }
    }

    const idsToInsert = pengajuanSelesai.map((p) => p.id);
    const result = await this.repo.addAsesiBulk(plenoBatchId, idsToInsert);
    if (!result) {
      throw new InvariantError("Gagal menambahkan asesi ke batch pleno");
    }

    return {
      ...result,
      asesiCount: idsToInsert.length,
      pengajuanIds: idsToInsert,
    };
  }

  async getAvailablePengajuan(plenoBatchId: number) {
    const pleno = await this.getById(plenoBatchId);

    // Ambil asesi yang sudah ada di batch pleno ini
    const existingAsesi = await this.repo.getAsesiByPlenoBatchId(plenoBatchId);
    const existingPengajuanIds = new Set(
      existingAsesi.map((a) => a.pengajuan_id),
    );

    const skemaIds = pleno.pleno_batch_skema?.map((s) => s.skema_id) || [];

    // Ambil seluruh pengajuan berstatus 'Selesai' sesuai skema
    const pengajuanSelesai = await this.repo.getPengajuanMenunggu(
      skemaIds.length > 0 ? skemaIds : undefined,
    );

    // Filter yang belum didaftarkan di batch pleno ini
    return pengajuanSelesai.filter((p) => !existingPengajuanIds.has(p.id));
  }

  async getAsesiByPlenoBatchId(plenoBatchId: number) {
    await this.getById(plenoBatchId);
    return await this.repo.getAsesiByPlenoBatchId(plenoBatchId);
  }

  async updateAsesi(asesiId: number, data: UpdateAsesiPlenoInput) {
    const result = await this.repo.updateAsesi(asesiId, data);
    if (!result)
      throw new InvariantError("Gagal memperbarui status pleno asesi");
    return result;
  }

  async addAttendee(plenoBatchId: number, data: AddAttendeeInput) {
    await this.getById(plenoBatchId);
    const result = await this.repo.addAttendee(plenoBatchId, data);
    if (!result) throw new InvariantError("Gagal menambahkan peserta rapat");
    return result;
  }

  async removeAttendee(attendeeId: number) {
    const result = await this.repo.removeAttendee(attendeeId);
    if (!result) throw new InvariantError("Gagal menghapus peserta rapat");
    return result;
  }
}

export const plenoService = new PlenoService();
