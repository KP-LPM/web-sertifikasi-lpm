import { db } from "@/lib/db";
import {
  CreatePengajuanDTO,
  UpdatePengajuanDTO,
} from "@/schemas/pengajuanskema.schema";

export class PengajuanRepository {
  // 1. Buat Pengajuan Baru
  async insertPengajuanBaru(nomorPengajuan: string, data: CreatePengajuanDTO) {
    if (!data.userId || !data.skemaId) {
      throw new Error("userId dan skemaId wajib tersedia saat membuat pengajuan");
    }

    return await db.$transaction(async (tx) => {
      const pengajuan = await tx.pengajuanSkema.create({
        data: {
          nomorPengajuan,
          userId: data.userId!,
          skemaId: data.skemaId!,
          tuk: data.tuk,
          jenisAsesmen: data.jenisAsesmen,
          status: "Menunggu Verifikasi",
          dataPribadi: {
            create: {
              nik: data.dataPribadi.nik,
              namaLengkap: data.dataPribadi.namaLengkap,
              tempatLahir: data.dataPribadi.tempatLahir,
              tanggalLahir: new Date(data.dataPribadi.tanggalLahir),
              jenisKelamin: data.dataPribadi.jenisKelamin,
              kewarganegaraan: data.dataPribadi.kewarganegaraan,
              alamat: data.dataPribadi.alamat,
              kodeProvinsi: data.dataPribadi.kodeProvinsi,
              kodeKota: data.dataPribadi.kodeKota,
              kodePosAsesi: data.dataPribadi.kodePosAsesi,
              noHp: data.dataPribadi.noHp,
              pendidikanTerakhir: data.dataPribadi.pendidikanTerakhir,
              pekerjaan: data.dataPribadi.pekerjaan,
              tandaTangan: data.dataPribadi.tandaTangan || "",
              memerlukanPenyesuaianWajar:
                data.dataPribadi.memerlukanPenyesuaianWajar ?? false,
              isBerpengalaman: data.dataPribadi.isBerpengalaman ?? false,
              namaInstitusi: data.dataPribadi.namaInstitusi,
              jabatan: data.dataPribadi.jabatan,
              alamatInstitusi: data.dataPribadi.alamatInstitusi,
              kodePosInstitusi: data.dataPribadi.kodePosInstitusi,
              emailInstitusi: data.dataPribadi.emailInstitusi,
              telpInstitusi: data.dataPribadi.telpInstitusi,
              faxInstitusi: data.dataPribadi.faxInstitusi,
            },
          },
          dokumen:
            data.dokumen && data.dokumen.length > 0
              ? {
                  create: data.dokumen,
                }
              : undefined,
          asesmenMandiri:
            data.asesmenMandiri && data.asesmenMandiri.length > 0
              ? {
                  create: data.asesmenMandiri,
                }
              : undefined,
        },
        include: {
          dataPribadi: true,
          dokumen: true,
          asesmenMandiri: true,
          skema: {
            select: { id: true, namaSkema: true, kodeSkema: true },
          },
        },
      });

      return pengajuan;
    });
  }

  // 2. Ambil Daftar Pengajuan (dengan filter)
  async getList(filters?: {
    userId?: number;
    skemaId?: number;
    status?: string;
    search?: string;
  }) {
    return await db.pengajuanSkema.findMany({
      where: {
        ...(filters?.userId && { userId: filters.userId }),
        ...(filters?.skemaId && { skemaId: filters.skemaId }),
        ...(filters?.status && {
          status: { equals: filters.status, mode: "insensitive" },
        }),
        ...(filters?.search && {
          OR: [
            { nomorPengajuan: { contains: filters.search, mode: "insensitive" } },
            {
              dataPribadi: {
                namaLengkap: { contains: filters.search, mode: "insensitive" },
              },
            },
            {
              skema: {
                namaSkema: { contains: filters.search, mode: "insensitive" },
              },
            },
          ],
        }),
      },
      include: {
        user: { select: { id: true, username: true, email: true } },
        dataPribadi: true,
        skema: { select: { id: true, namaSkema: true, kodeSkema: true } },
        _count: {
          select: {
            dokumen: true,
            asesmenMandiri: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  // 3. Ambil Detail Pengajuan Lengkap
  async getById(id: number) {
    return await db.pengajuanSkema.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, username: true, email: true } },
        dataPribadi: true,
        dokumen: {
          orderBy: { createdAt: "asc" },
        },
        asesmenMandiri: {
          include: {
            unitKompetensi: {
              select: {
                id: true,
                kodeUnit: true,
                judulUnit: true,
                urutan: true,
              },
            },
          },
          orderBy: { unitId: "asc" },
        },
        skema: {
          select: {
            id: true,
            namaSkema: true,
            kodeSkema: true,
            kategori: true,
            deskripsi: true,
          },
        },
        verifikasi_pengajuan: true,
        apl02_penilaian: true,
        hasil_asesmen: true,
      },
    });
  }

  // 4. Update Pengajuan (selama belum diverifikasi)
  async update(id: number, data: UpdatePengajuanDTO) {
    return await db.$transaction(async (tx) => {
      // Update data induk jika ada
      if (data.tuk || data.jenisAsesmen) {
        await tx.pengajuanSkema.update({
          where: { id },
          data: {
            ...(data.tuk && { tuk: data.tuk }),
            ...(data.jenisAsesmen && { jenisAsesmen: data.jenisAsesmen }),
          },
        });
      }

      // Update data pribadi jika ada
      if (data.dataPribadi) {
        const dp = data.dataPribadi;
        await tx.pendaftaranDataPribadi.upsert({
          where: { pengajuanId: id },
          update: {
            ...(dp.nik && { nik: dp.nik }),
            ...(dp.namaLengkap && { namaLengkap: dp.namaLengkap }),
            ...(dp.tempatLahir && { tempatLahir: dp.tempatLahir }),
            ...(dp.tanggalLahir && { tanggalLahir: new Date(dp.tanggalLahir) }),
            ...(dp.jenisKelamin && { jenisKelamin: dp.jenisKelamin }),
            ...(dp.kewarganegaraan && { kewarganegaraan: dp.kewarganegaraan }),
            ...(dp.alamat && { alamat: dp.alamat }),
            ...(dp.kodeProvinsi !== undefined && { kodeProvinsi: dp.kodeProvinsi }),
            ...(dp.kodeKota !== undefined && { kodeKota: dp.kodeKota }),
            ...(dp.kodePosAsesi !== undefined && { kodePosAsesi: dp.kodePosAsesi }),
            ...(dp.noHp && { noHp: dp.noHp }),
            ...(dp.pendidikanTerakhir !== undefined && {
              pendidikanTerakhir: dp.pendidikanTerakhir,
            }),
            ...(dp.pekerjaan !== undefined && { pekerjaan: dp.pekerjaan }),
            ...(dp.tandaTangan !== undefined && { tandaTangan: dp.tandaTangan || "" }),
            ...(dp.memerlukanPenyesuaianWajar !== undefined && {
              memerlukanPenyesuaianWajar: dp.memerlukanPenyesuaianWajar,
            }),
            ...(dp.isBerpengalaman !== undefined && {
              isBerpengalaman: dp.isBerpengalaman,
            }),
            ...(dp.namaInstitusi !== undefined && { namaInstitusi: dp.namaInstitusi }),
            ...(dp.jabatan !== undefined && { jabatan: dp.jabatan }),
            ...(dp.alamatInstitusi !== undefined && {
              alamatInstitusi: dp.alamatInstitusi,
            }),
            ...(dp.kodePosInstitusi !== undefined && {
              kodePosInstitusi: dp.kodePosInstitusi,
            }),
            ...(dp.emailInstitusi !== undefined && {
              emailInstitusi: dp.emailInstitusi,
            }),
            ...(dp.telpInstitusi !== undefined && { telpInstitusi: dp.telpInstitusi }),
            ...(dp.faxInstitusi !== undefined && { faxInstitusi: dp.faxInstitusi }),
          },
          create: {
            pengajuanId: id,
            nik: dp.nik || "",
            namaLengkap: dp.namaLengkap || "",
            tempatLahir: dp.tempatLahir || "",
            tanggalLahir: dp.tanggalLahir ? new Date(dp.tanggalLahir) : new Date(),
            jenisKelamin: dp.jenisKelamin || "Perempuan",
            kewarganegaraan: dp.kewarganegaraan || "Indonesia",
            alamat: dp.alamat || "",
            kodeProvinsi: dp.kodeProvinsi || "",
            kodeKota: dp.kodeKota || "",
            kodePosAsesi: dp.kodePosAsesi || "",
            noHp: dp.noHp || "",
            pendidikanTerakhir: dp.pendidikanTerakhir || "",
            pekerjaan: dp.pekerjaan || "",
            tandaTangan: dp.tandaTangan || "",
            memerlukanPenyesuaianWajar: dp.memerlukanPenyesuaianWajar ?? false,
            isBerpengalaman: dp.isBerpengalaman ?? false,
            namaInstitusi: dp.namaInstitusi,
            jabatan: dp.jabatan,
            alamatInstitusi: dp.alamatInstitusi,
            kodePosInstitusi: dp.kodePosInstitusi,
            emailInstitusi: dp.emailInstitusi,
            telpInstitusi: dp.telpInstitusi,
            faxInstitusi: dp.faxInstitusi,
          },
        });
      }

      return await tx.pengajuanSkema.findUnique({
        where: { id },
        include: { dataPribadi: true, dokumen: true, asesmenMandiri: true },
      });
    });
  }

  // 5. Batalkan / Hapus Pengajuan
  async delete(id: number) {
    return await db.pengajuanSkema.delete({
      where: { id },
    });
  }

  // 6. Update Status Alur Pengajuan (Admin)
  async updateStatus(id: number, status: string) {
    return await db.pengajuanSkema.update({
      where: { id },
      data: { status },
    });
  }

  // 7. Upload Dokumen Tambahan
  async addDokumen(
    pengajuanId: number,
    dokumen: Array<{ namaDokumen: string; fileUrl: string }>
  ) {
    return await db.dokumenPengajuan.createMany({
      data: dokumen.map((d) => ({
        pengajuanId,
        namaDokumen: d.namaDokumen,
        fileUrl: d.fileUrl,
      })),
    });
  }

  // 8. Hapus Dokumen
  async deleteDokumen(pengajuanId: number, dokId: number) {
    return await db.dokumenPengajuan.delete({
      where: {
        id: dokId,
        pengajuanId,
      },
    });
  }

  // 9. Submit/Update Checklist APL02 (Asesmen Mandiri Asesi)
  async upsertAsesmenMandiri(
    pengajuanId: number,
    items: Array<{ unitId: number; penilaianAsesi: string }>
  ) {
    return await db.$transaction(async (tx) => {
      const results = [];
      for (const item of items) {
        const existing = await tx.asesmenMandiri.findFirst({
          where: {
            pengajuanId,
            unitId: item.unitId,
          },
        });

        if (existing) {
          const updated = await tx.asesmenMandiri.update({
            where: { id: existing.id },
            data: { penilaianAsesi: item.penilaianAsesi },
          });
          results.push(updated);
        } else {
          const created = await tx.asesmenMandiri.create({
            data: {
              pengajuanId,
              unitId: item.unitId,
              penilaianAsesi: item.penilaianAsesi,
            },
          });
          results.push(created);
        }
      }
      return results;
    });
  }

  // 10. Asesor Isi Penilaian + Catatan per Unit
  async updatePenilaianAsesorMandiri(
    pengajuanId: number,
    unitId: number,
    data: { penilaianAsesor: string; catatanAsesor?: string | null }
  ) {
    const existing = await db.asesmenMandiri.findFirst({
      where: {
        pengajuanId,
        unitId,
      },
    });

    if (existing) {
      return await db.asesmenMandiri.update({
        where: { id: existing.id },
        data: {
          penilaianAsesor: data.penilaianAsesor,
          catatanAsesor: data.catatanAsesor,
        },
      });
    }

    return await db.asesmenMandiri.create({
      data: {
        pengajuanId,
        unitId,
        penilaianAsesi: "K",
        penilaianAsesor: data.penilaianAsesor,
        catatanAsesor: data.catatanAsesor,
      },
    });
  }
}

export const pengajuanRepository = new PengajuanRepository();

// Backwards compatibility
export const insertPengajuanBaru = (nomorPengajuan: string, data: CreatePengajuanDTO) =>
  pengajuanRepository.insertPengajuanBaru(nomorPengajuan, data);
