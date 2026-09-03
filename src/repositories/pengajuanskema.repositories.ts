import {db} from "@/lib/db";
import { CreatePengajuanDTO } from "@/schema/pengajuanskema.schema";

export const insertPengajuanBaru = async (
  nomorPengajuan: string,
  data: CreatePengajuanDTO
) => {
  return await db.$transaction(async (tx) => {
    const pengajuan = await tx.pengajuanSkema.create({
      data: {
        nomorPengajuan,
        userId: data.userId,
        skemaId: data.skemaId,
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
            tandaTangan: data.dataPribadi.tandaTangan,
            memerlukanPenyesuaianWajar: data.dataPribadi.memerlukanPenyesuaianWajar,
            isBerpengalaman: data.dataPribadi.isBerpengalaman,
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
      // Include untuk mengembalikan data lengkap setelah dibuat
      include: {
        dataPribadi: true,
        dokumen: true,
        asesmenMandiri: true,
        skema: {
          select: { namaSkema: true, kodeSkema: true },
        },
      },
    });

    return pengajuan;
  });
};