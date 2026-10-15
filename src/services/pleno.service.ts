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
      console.error("[PlenoService.create]:", error);
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

          // Jika ada asesi yang belum diset status_pleno-nya, gunakan rekomendasi_asesor sebagai default
          await tx.pleno_asesi.updateMany({
            where: {
              pleno_batch_id: id,
              OR: [{ status_pleno: null }, { status_pleno: "" }],
              rekomendasi_asesor: "K",
            },
            data: { status_pleno: "K" },
          });
          await tx.pleno_asesi.updateMany({
            where: {
              pleno_batch_id: id,
              OR: [{ status_pleno: null }, { status_pleno: "" }],
              NOT: { rekomendasi_asesor: "K" },
            },
            data: { status_pleno: "BK" },
          });

          // Update hasil akhir asesmen (hasil_asesmen.hasil) berdasarkan status sidang pleno (aksi)
          const currentAsesis = await tx.pleno_asesi.findMany({
            where: { pleno_batch_id: id },
            select: { pengajuan_id: true, status_pleno: true, rekomendasi_asesor: true },
          });

          for (const a of currentAsesis) {
            const hasPleno = !!(a.status_pleno && a.status_pleno.trim() !== "");
            const effectiveStatus: string = (hasPleno ? a.status_pleno! : a.rekomendasi_asesor) || "BK";
            const finalHasil =
              effectiveStatus === "K" || effectiveStatus.toLowerCase() === "kompeten"
                ? "Kompeten"
                : "Belum Kompeten";

            await tx.hasil_asesmen.upsert({
              where: { pengajuan_id: a.pengajuan_id },
              update: { hasil: finalHasil, status: "Selesai" },
              create: {
                pengajuan_id: a.pengajuan_id,
                hasil: finalHasil,
                status: "Selesai",
              },
            });
          }
        }
      }
      return pleno;
    });

    if (data.status === "Selesai" || result?.status === "Selesai") {
      try {
        await this.syncSuratPleno(id);
      } catch (err) {
        console.error("Gagal sinkronisasi surat pleno secara otomatis:", err);
      }
    }

    return result;
  }

  async syncSuratPleno(id: number) {
    const pleno = await this.repo.getById(id);
    if (!pleno) return;

    const { db } = await import("@/lib/db");
    
    // Parse tanggal secara aman agar tidak pernah menghasilkan Invalid Date
    let d = new Date();
    if (pleno.tanggal) {
      const parsed = new Date(pleno.tanggal);
      if (!isNaN(parsed.getTime())) {
        d = parsed;
      } else if (pleno.created_at) {
        const parsedCreated = new Date(pleno.created_at);
        if (!isNaN(parsedCreated.getTime())) {
          d = parsedCreated;
        }
      }
    } else if (pleno.created_at) {
      const parsedCreated = new Date(pleno.created_at);
      if (!isNaN(parsedCreated.getTime())) {
        d = parsedCreated;
      }
    }
    if (isNaN(d.getTime())) {
      d = new Date();
    }
    const year = d.getFullYear() || new Date().getFullYear();

    const primarySkema = pleno.pleno_batch_skema?.[0]?.master_skema;
    const rawSkemaId = pleno.pleno_batch_skema?.[0]?.skema_id;
    let skemaId: number | null = null;
    if (rawSkemaId) {
      const skemaExists = await db.masterSkema.findUnique({ where: { id: rawSkemaId } });
      if (skemaExists) skemaId = rawSkemaId;
    }
    const skemaNama = primarySkema?.namaSkema || "";

    const totalAsesi = pleno.pleno_asesi?.length || 0;
    const totalKompeten = pleno.pleno_asesi?.filter((a) => a.status_pleno === "K").length || 0;
    const totalBelumKompeten = totalAsesi - totalKompeten;

    const pimpinanSidang =
      pleno.pleno_attendee?.find((a) =>
        a.role?.toLowerCase().includes("direktur") || a.role?.toLowerCase().includes("ketua")
      )?.nama ||
      pleno.pleno_attendee?.[0]?.nama ||
      "Direktur LSP";

    const notulis =
      pleno.pleno_attendee?.find((a) =>
        a.role?.toLowerCase().includes("notulis") || a.role?.toLowerCase().includes("sekretaris")
      )?.nama || "Notulis Pleno";

    // 1. Surat Berita Acara Pleno
    const nomorBAP = pleno.no_sk ? `BA/${pleno.no_sk}` : `BA/PLENO/${pleno.id}/${year}`;
    const judulBAP = skemaNama
      ? `Surat Berita Acara Sidang Pleno - ${skemaNama}`
      : `Surat Berita Acara Sidang Pleno ${pleno.title || ""}`.trim();

    const existingBAP = await db.surat.findFirst({
      where: {
        OR: [
          { nomor_surat: nomorBAP },
          { nomor_surat: `BAP-PLENO-${pleno.id}-${year}` },
          ...(pleno.no_sk ? [{ no_sk: pleno.no_sk, jenis_surat: "berita_acara_pleno" }] : []),
        ],
      },
    });

    const dataBAP = {
      nomor_surat: nomorBAP,
      judul: judulBAP,
      kategori: "surat_masuk",
      jenis_surat: "berita_acara_pleno",
      nama_jenis_surat: "Surat Berita Acara Pleno",
      tanggal_terbit: d,
      penerbit: "LSP UIN Sunan Gunung Djati Bandung",
      penerima: "Komite Teknis / LPM",
      skema_id: skemaId,
      jumlah_asesi: totalAsesi,
      status: "Terbit",
      no_sk: pleno.no_sk || null,
      pimpinan_sidang: pimpinanSidang,
      notulis: notulis,
      lokasi: pleno.alamat || "Bandung",
      url_gdrive: pleno.link_surat_berita_pleno || existingBAP?.url_gdrive || null,
      url_dokumen: pleno.link_surat_berita_pleno || existingBAP?.url_dokumen || null,
      catatan: `Sidang pleno: ${totalAsesi} asesi (${totalKompeten} Kompeten, ${totalBelumKompeten} Belum Kompeten)`,
    };

    if (existingBAP) {
      await db.surat.update({ where: { id: existingBAP.id }, data: dataBAP });
    } else {
      await db.surat.create({ data: dataBAP });
    }

    // 2. Surat Hasil Keputusan Pleno (SK Direktur)
    const nomorSK = pleno.no_sk || `SK/PLENO/${pleno.id}/${year}`;
    const judulSK = skemaNama
      ? `Surat Keputusan Hasil Sidang Pleno - ${skemaNama}`
      : `Surat Keputusan Hasil Sidang Pleno ${pleno.title || ""}`.trim();

    const existingSK = await db.surat.findFirst({
      where: {
        OR: [
          { nomor_surat: nomorSK },
          { nomor_surat: `SK-PLENO-${pleno.id}-${year}` },
          ...(pleno.no_sk ? [{ no_sk: pleno.no_sk, jenis_surat: "keputusan_pleno" }] : []),
        ],
      },
    });

    const dataSK = {
      nomor_surat: nomorSK,
      judul: judulSK,
      kategori: "surat_masuk",
      jenis_surat: "keputusan_pleno",
      nama_jenis_surat: "Surat Hasil Keputusan Pleno",
      tanggal_terbit: d,
      penerbit: "Direktur LSP UIN Sunan Gunung Djati Bandung",
      penerima: "Asesi & Manajemen LSP",
      skema_id: skemaId,
      jumlah_asesi: totalAsesi,
      status: "Terbit",
      no_sk: pleno.no_sk || null,
      pimpinan_sidang: pimpinanSidang,
      notulis: notulis,
      lokasi: pleno.alamat || "Bandung",
      url_gdrive: pleno.link_surat_keputusan_direktur || existingSK?.url_gdrive || null,
      url_dokumen: pleno.link_surat_keputusan_direktur || existingSK?.url_dokumen || null,
      catatan: `Penetapan hasil uji kompetensi: ${totalKompeten} Kompeten, ${totalBelumKompeten} Belum Kompeten`,
    };

    if (existingSK) {
      await db.surat.update({ where: { id: existingSK.id }, data: dataSK });
    } else {
      await db.surat.create({ data: dataSK });
    }

    // 3. Surat Permohonan Blanko BNSP
    const nomorBlanko = pleno.no_sk ? `BLNK/${pleno.no_sk}` : `BLNK/PLENO/${pleno.id}/${year}`;
    const judulBlanko = skemaNama
      ? `Surat Permohonan Blanko Sertifikat BNSP - ${skemaNama}`
      : `Surat Permohonan Blanko Sertifikat BNSP ${pleno.title || ""}`.trim();

    const existingBlanko = await db.surat.findFirst({
      where: {
        OR: [
          { nomor_surat: nomorBlanko },
          { nomor_surat: `BLNK-PLENO-${pleno.id}-${year}` },
          ...(pleno.no_sk ? [{ no_sk: pleno.no_sk, jenis_surat: "blanko_bnsp" }] : []),
        ],
      },
    });

    const dataBlanko = {
      nomor_surat: nomorBlanko,
      judul: judulBlanko,
      kategori: "surat_keluar",
      jenis_surat: "blanko_bnsp",
      nama_jenis_surat: "Surat Blanko BNSP",
      tanggal_terbit: d,
      penerbit: "LSP UIN Sunan Gunung Djati Bandung",
      penerima: "Ketua Badan Nasional Sertifikasi Profesi (BNSP)",
      skema_id: skemaId,
      jumlah_asesi: totalKompeten,
      status: "Terbit",
      no_sk: pleno.no_sk || null,
      pimpinan_sidang: pimpinanSidang,
      lokasi: pleno.alamat || "Bandung",
      url_gdrive: pleno.link_surat_blanko_bnsp || existingBlanko?.url_gdrive || null,
      url_dokumen: pleno.link_surat_blanko_bnsp || existingBlanko?.url_dokumen || null,
      catatan: `Permohonan blanko sertifikat untuk ${totalKompeten} asesi kompeten`,
    };

    if (existingBlanko) {
      await db.surat.update({ where: { id: existingBlanko.id }, data: dataBlanko });
    } else {
      await db.surat.create({ data: dataBlanko });
    }
  }

  async syncAllCompletedPlenoSurat() {
    try {
      const { db } = await import("@/lib/db");
      const completedPlenos = await db.pleno_batch.findMany({
        where: { status: "Selesai" },
        select: { id: true },
      });
      for (const p of completedPlenos) {
        await this.syncSuratPleno(p.id);
      }
    } catch (err) {
      console.error("Gagal sinkronisasi seluruh surat pleno:", err);
    }
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

    if (data.status_pleno) {
      const { db } = await import("@/lib/db");
      const finalHasil =
        data.status_pleno === "K" || data.status_pleno.toLowerCase() === "kompeten"
          ? "Kompeten"
          : "Belum Kompeten";

      await db.hasil_asesmen.upsert({
        where: { pengajuan_id: result.pengajuan_id },
        update: { hasil: finalHasil },
        create: {
          pengajuan_id: result.pengajuan_id,
          hasil: finalHasil,
        },
      });
    }

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
