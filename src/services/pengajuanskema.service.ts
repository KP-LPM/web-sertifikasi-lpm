import {
  pengajuanRepository,
  PengajuanRepository,
} from "@/repositories/pengajuanskema.repository";
import {
  CreatePengajuanDTO,
  UpdatePengajuanDTO,
  UploadDokumenDTO,
  SubmitAsesmenMandiriDTO,
  PenilaianAsesorMandiriDTO,
} from "@/schemas/pengajuanskema.schema";
import {
  NotFoundError,
  InvariantError,
  AuthorizationError,
} from "@/error/index";
import { db } from "@/lib/db";

export class PengajuanService {
  constructor(private repo: PengajuanRepository = pengajuanRepository) {}

  // 1. Buat Pengajuan Skema Baru
  async create(data: CreatePengajuanDTO, user?: { id: number; role: string }) {
    // Tetapkan userId dari session jika belum ada
    if (!data.userId && user?.id) {
      data.userId = user.id;
    }

    if (!data.userId) {
      throw new InvariantError("User ID wajib disertakan untuk mengajukan skema");
    }

    // Jika skemaId belum ada, cari berdasarkan kodeSkema
    if (!data.skemaId && data.kodeSkema) {
      const skema = await db.masterSkema.findUnique({
        where: { kodeSkema: data.kodeSkema },
      });
      if (skema) {
        data.skemaId = skema.id;
      }
    }

    if (!data.skemaId) {
      throw new InvariantError("Skema sertifikasi tidak valid atau tidak ditemukan");
    }

    const timestamp = Date.now();
    const random = Math.floor(1000 + Math.random() * 9000);
    const nomorPengajuan = `APL-${timestamp}-${random}`;

    return await this.repo.insertPengajuanBaru(nomorPengajuan, data);
  }

  // 2. Ambil Daftar Pengajuan (Asesi: miliknya; Admin/Asesor: semua dengan filter)
  async getList(
    user: { id: number; role: string },
    filters?: {
      skemaId?: number;
      status?: string;
      search?: string;
      userId?: number;
    }
  ) {
    const isAsesi = user.role === "asesi";
    const targetUserId = isAsesi ? user.id : filters?.userId;

    return await this.repo.getList({
      userId: targetUserId,
      skemaId: filters?.skemaId,
      status: filters?.status,
      search: filters?.search,
    });
  }

  // 3. Ambil Detail Pengajuan Lengkap
  async getById(id: number, user?: { id: number; role: string }) {
    const pengajuan = await this.repo.getById(id);
    if (!pengajuan) {
      throw new NotFoundError("Pengajuan skema tidak ditemukan");
    }

    // Jika asesi, hanya boleh melihat pengajuan miliknya sendiri
    if (user && user.role === "asesi" && pengajuan.userId !== user.id) {
      throw new AuthorizationError(
        "Akses ditolak. Anda tidak memiliki izin untuk melihat pengajuan ini"
      );
    }

    return pengajuan;
  }

  // 4. Edit Pengajuan (selama belum diverifikasi)
  async update(
    id: number,
    data: UpdatePengajuanDTO,
    user: { id: number; role: string }
  ) {
    const pengajuan = await this.getById(id, user);

    // Cek apakah status masih bisa diedit
    const editableStatuses = ["Menunggu Verifikasi", "Draf", "Ditolak / Revisi"];
    if (!editableStatuses.includes(pengajuan.status)) {
      throw new InvariantError(
        `Pengajuan tidak dapat diedit karena status saat ini adalah '${pengajuan.status}'`
      );
    }

    const updated = await this.repo.update(id, data);
    if (!updated) {
      throw new InvariantError("Gagal memperbarui data pengajuan");
    }

    return updated;
  }

  // 5. Batalkan / Hapus Pengajuan (Asesi / Admin)
  async delete(id: number, user: { id: number; role: string }) {
    const pengajuan = await this.getById(id, user);

    if (user.role === "asesi" && pengajuan.status === "Selesai") {
      throw new InvariantError(
        "Pengajuan yang sudah selesai tidak dapat dibatalkan oleh asesi"
      );
    }

    await this.repo.delete(id);
    return { id, message: "Pengajuan berhasil dibatalkan" };
  }

  // 6. Update Status Alur Pengajuan (Admin)
  async updateStatus(
    id: number,
    status: string,
    user: { id: number; role: string }
  ) {
    if (user.role !== "admin") {
      throw new AuthorizationError(
        "Akses ditolak. Hanya admin yang dapat memperbarui status alur pengajuan"
      );
    }

    await this.getById(id, user);
    return await this.repo.updateStatus(id, status);
  }

  // 7. Upload Dokumen Tambahan
  async addDokumen(
    id: number,
    rawData: UploadDokumenDTO,
    user: { id: number; role: string }
  ) {
    await this.getById(id, user);

    const dokumenList = Array.isArray(rawData) ? rawData : [rawData];
    const result = await this.repo.addDokumen(id, dokumenList);

    return {
      count: result.count,
      dokumen: dokumenList,
    };
  }

  // 8. Hapus Dokumen
  async deleteDokumen(
    id: number,
    dokId: number,
    user: { id: number; role: string }
  ) {
    await this.getById(id, user);
    await this.repo.deleteDokumen(id, dokId);
    return { dokId, message: "Dokumen berhasil dihapus" };
  }

  // 9. Submit/Update Checklist APL02 (Asesmen Mandiri Asesi)
  async submitAsesmenMandiri(
    id: number,
    rawData: SubmitAsesmenMandiriDTO,
    user: { id: number; role: string }
  ) {
    await this.getById(id, user);

    const items = Array.isArray(rawData) ? rawData : rawData.asesmenMandiri;
    if (!items || items.length === 0) {
      throw new InvariantError("Data asesmen mandiri tidak boleh kosong");
    }

    return await this.repo.upsertAsesmenMandiri(id, items);
  }

  // 10. Asesor Isi Penilaian + Catatan per Unit
  async updatePenilaianAsesorMandiri(
    id: number,
    unitId: number,
    data: PenilaianAsesorMandiriDTO,
    user: { id: number; role: string }
  ) {
    if (user.role !== "asesor" && user.role !== "admin") {
      throw new AuthorizationError(
        "Akses ditolak. Hanya asesor atau admin yang dapat mengisi penilaian asesor"
      );
    }

    await this.getById(id, user);
    return await this.repo.updatePenilaianAsesorMandiri(id, unitId, data);
  }
}

export const pengajuanService = new PengajuanService();

// Backwards compatibility
export const prosesPengajuanBaru = (data: CreatePengajuanDTO) =>
  pengajuanService.create(data);
