import { z } from "zod";

export const createPengajuanSchema = z.object({
  userId: z.number(),
  skemaId: z.number(),
  tuk: z.string(),
  jenisAsesmen: z.string(),
  dataPribadi: z.object({
    nik: z.string().min(16, "NIK harus 16 digit").max(16, "NIK harus 16 digit"),
    namaLengkap: z.string().min(1, "Nama lengkap wajib diisi"),
    tempatLahir: z.string().min(1, "Tempat lahir wajib diisi"),
    tanggalLahir: z.string().refine((val) => /^\d{4}-\d{2}-\d{2}$/.test(val), {
      message: "Format tanggal harus YYYY-MM-DD",
    }),
    jenisKelamin: z.enum(["Perempuan", "Laki_laki"]),
    kewarganegaraan: z.string(),
    alamat: z.string(),
    kodeProvinsi: z.string(),
    kodeKota: z.string(),
    kodePosAsesi: z.string(),
    noHp: z.string(),
    pendidikanTerakhir: z.string(),
    pekerjaan: z.string(),
    tandaTangan: z.string().min(1, "Tanda tangan wajib diisi"),
    memerlukanPenyesuaianWajar: z.boolean().default(false),
    isBerpengalaman: z.boolean().default(false),
    // Field institusi opsional
    namaInstitusi: z.string().optional().nullable(),
    jabatan: z.string().optional().nullable(),
    alamatInstitusi: z.string().optional().nullable(),
    kodePosInstitusi: z.string().optional().nullable(),
    emailInstitusi: z.string().optional().nullable(),
    telpInstitusi: z.string().optional().nullable(),
    faxInstitusi: z.string().optional().nullable(),
  }),
  dokumen: z.array(
    z.object({
      namaDokumen: z.string(),
      fileUrl: z.string().url("URL dokumen tidak valid"),
    })
  ).optional(),
  asesmenMandiri: z.array(
    z.object({
      unitId: z.number(),
      penilaianAsesi: z.string(),
    })
  ).optional(),
});

export type CreatePengajuanDTO = z.infer<typeof createPengajuanSchema>;