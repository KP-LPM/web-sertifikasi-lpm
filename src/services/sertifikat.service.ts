import {
  sertifikatRepository,
  SertifikatRepository,
} from "@/repositories/sertifikat.repository";
import { UpdateSertifikatInput } from "@/schemas/sertifikat.schema";
import { NotFoundError, InvariantError } from "@/error/index";

export class SertifikatService {
  constructor(private repo: SertifikatRepository = sertifikatRepository) {}

  async getByPengajuanId(pengajuanId: number, userId: number, role: string) {
    const sertifikat = await this.repo.getByPengajuanId(pengajuanId);

    if (!sertifikat) {
      throw new NotFoundError(
        "Data sertifikat tidak ditemukan untuk pengajuan ini.",
      );
    }

    if (role === "asesi" && sertifikat.pengajuan_skema?.asesi_id !== userId) {
      throw new InvariantError(
        "Akses ditolak. Anda tidak berhak mengakses sertifikat ini.",
      );
    }

    return sertifikat;
  }

  async upsert(pengajuanId: number, data: UpdateSertifikatInput) {
    const result = await this.repo.upsert(pengajuanId, data);
    if (!result) {
      throw new InvariantError(
        "Gagal memperbarui atau menyimpan data sertifikat.",
      );
    }
    return result;
  }
  async terbitkan(pengajuanId: number) {
    // 1. Ambil data pengajuan beserta MasterSkema-nya (Join Relasi)
    const pengajuan = await this.repo.getPengajuanWithSkema(pengajuanId);

    // Pastikan data MasterSkema tersedia
    if (!pengajuan || !pengajuan.master_skema) {
      throw new InvariantError(
        "Data pengajuan atau skema referensi tidak valid.",
      );
    }

    let sertifikat = await this.repo.getByPengajuanId(pengajuanId);
    if (sertifikat?.status === "Terbit") {
      throw new InvariantError("Sertifikat ini sudah diterbitkan sebelumnya.");
    }

    // 2. Tentukan Tanggal Terbit dan Tahun (misal: "2025")
    const tanggalTerbit = sertifikat?.tanggal_terbit || new Date();
    const tahun = tanggalTerbit.getFullYear().toString();

    // 3. Cari Sertifikat terakhir yang diterbitkan PADA TAHUN TERSEBUT
    // Jika ganti tahun (misal 2026), fungsi ini akan me-return null (tidak ketemu)
    const lastCert = await this.repo.getLastSertifikatByYear(tahun);

    // Set urutan awal ke 1 jika belum ada sertifikat di tahun tersebut
    let nextSeq = 1;

    // 4. Logika Ekstraksi Auto-Increment
    if (lastCert && lastCert.no_sertifikat) {
      // Memecah string berdasarkan spasi. Contoh: "74110 1321 5 0000001 2025"
      // Angka increment selalu ada di urutan KEDUA DARI BELAKANG
      const parts = lastCert.no_sertifikat.trim().split(/\s+/);

      if (parts.length >= 2) {
        const lastSeqStr = parts[parts.length - 2]; // Mengambil "0000001"
        const parsedSeq = parseInt(lastSeqStr, 10); // Menjadi angka 1

        if (!isNaN(parsedSeq)) {
          nextSeq = parsedSeq + 1; // Ditambah 1 menjadi 2 dst.
        }
      }
    }

    // 5. Pembentukan String (Padding digit)
    // Mengambil base dari MasterSkema. Contoh: "74110 1321 5" atau "IND 2603"
    const baseSertifikat =
      pengajuan.master_skema.nomor_sertifikat?.trim() || "00000 0000 0";
    const baseRegistrasi =
      pengajuan.master_skema.nomor_registrasi?.trim() || "XXX 0000";

    // Ubah angka menjadi format 7 digit dan 5 digit
    const seq7 = nextSeq.toString().padStart(7, "0"); // Hasil: "0000001"
    const seq5 = nextSeq.toString().padStart(5, "0"); // Hasil: "00001"

    // Rangkai menjadi string utuh sesuai format dari Excel Anda
    const newNoSertifikat = `${baseSertifikat} ${seq7} ${tahun}`;
    const newNoRegistrasi = `${baseRegistrasi} ${seq5} ${tahun}`;

    // 6. Buat draft kosong jika asesi belum pernah upload data sama sekali
    if (!sertifikat) {
      await this.repo.upsert(pengajuanId, {});
    }

    // 7. Simpan nomor yang sudah digenerate dan set status ke Terbit
    const result = await this.repo.updateTerbit(
      pengajuanId,
      newNoSertifikat,
      newNoRegistrasi,
      tanggalTerbit,
    );

    if (!result) {
      throw new InvariantError("Gagal menerbitkan sertifikat.");
    }

    return result;
  }

  async getAll(filters?: {
    status?: string;
    skemaId?: number;
    tanggal?: Date;
  }) {
    return await this.repo.getAll(filters);
  }

  async getRiwayatByAsesi(asesiId: number, tokenUserId: number, role: string) {
    if (role !== "admin" && asesiId !== tokenUserId) {
      throw new InvariantError(
        "Akses ditolak. Hanya dapat melihat riwayat milik sendiri.",
      );
    }
    return await this.repo.getRiwayatByAsesi(asesiId);
  }
}

export const sertifikatService = new SertifikatService();
