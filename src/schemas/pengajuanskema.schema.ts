import { z } from "zod";

// Helper normalisasi jenis kelamin
const jenisKelaminSchema = z
  .string()
  .transform((val) => {
    if (val === "Laki-laki" || val === "Laki_laki" || val === "Pria") return "Laki_laki";
    return "Perempuan";
  })
  .pipe(z.enum(["Perempuan", "Laki_laki"]));

// 1. Skema Data Pribadi
export const dataPribadiSchema = z.object({
  nik: z.string().min(16, "NIK harus 16 digit").max(16, "NIK harus 16 digit"),
  namaLengkap: z.string().min(1, "Nama lengkap wajib diisi"),
  tempatLahir: z.string().min(1, "Tempat lahir wajib diisi"),
  tanggalLahir: z.string().min(1, "Tanggal lahir wajib diisi"),
  jenisKelamin: jenisKelaminSchema,
  kewarganegaraan: z.string().default("Indonesia"),
  alamat: z.string().min(1, "Alamat wajib diisi"),
  kodeProvinsi: z.string().default(""),
  kodeKota: z.string().default(""),
  kodePosAsesi: z.string().default(""),
  noHp: z.string().min(1, "Nomor HP wajib diisi"),
  pendidikanTerakhir: z.string().default(""),
  pekerjaan: z.string().default(""),
  tandaTangan: z.string().optional().nullable(),
  memerlukanPenyesuaianWajar: z.boolean().default(false),
  isBerpengalaman: z.boolean().default(false),
  namaInstitusi: z.string().optional().nullable(),
  jabatan: z.string().optional().nullable(),
  alamatInstitusi: z.string().optional().nullable(),
  kodePosInstitusi: z.string().optional().nullable(),
  emailInstitusi: z.string().optional().nullable(),
  telpInstitusi: z.string().optional().nullable(),
  faxInstitusi: z.string().optional().nullable(),
});

// 2. Skema Dokumen & Asesmen Mandiri
export const itemDokumenSchema = z.object({
  namaDokumen: z.string().min(1, "Nama dokumen wajib diisi"),
  fileUrl: z.string().min(1, "URL file wajib diisi"),
});

export const itemAsesmenMandiriSchema = z.object({
  unitId: z.number().int(),
  penilaianAsesi: z.string().min(1).default("K"),
});

// 3. Skema Buat Pengajuan (Mendukung format terstruktur maupun format datar PengajuanPayload)
export const createPengajuanSchema = z
  .object({
    userId: z.number().int().optional(),
    skemaId: z.number().int().optional(),
    kodeSkema: z.string().optional(),
    code: z.string().optional(),
    name: z.string().optional(),
    tuk: z.string().default("TUK Mandiri"),
    jenisAsesmen: z.string().default("Uji Kompetensi"),

    // Format terstruktur
    dataPribadi: dataPribadiSchema.optional(),

    // Format datar (PengajuanPayload)
    nik: z.string().optional(),
    namaLengkap: z.string().optional(),
    tempatLahir: z.string().optional(),
    tanggalLahir: z.string().optional(),
    jenisKelamin: z.string().optional(),
    alamat: z.string().optional(),
    provinsi: z.string().optional(),
    kota: z.string().optional(),
    kodePos: z.string().optional(),
    kebangsaan: z.string().optional(),
    noTelp: z.string().optional(),
    pendidikanTerakhir: z.string().optional(),
    pekerjaan: z.string().optional(),
    tandaTangan: z.string().optional(),
    institusiPerusahaan: z.string().optional(),
    jabatan: z.string().optional(),
    emailInstitusi: z.string().optional(),
    kodePosInstitusi: z.string().optional(),
    telpInstitusi: z.string().optional(),
    alamatInstitusi: z.string().optional(),
    faxInstitusi: z.string().optional(),
    penyesuaianWajar: z.boolean().optional(),
    berpengalaman: z.boolean().optional(),

    dokumen: z.array(itemDokumenSchema).optional(),
    asesmenMandiri: z.array(itemAsesmenMandiriSchema).optional(),
    dataAsesmen: z.array(itemAsesmenMandiriSchema).optional(),
  })
  .transform((data) => {
    // Normalisasi: jika dataPribadi belum ada, bentuk dari properti datar
    const dataPribadi =
      data.dataPribadi ||
      ({
        nik: data.nik || "",
        namaLengkap: data.namaLengkap || "",
        tempatLahir: data.tempatLahir || "",
        tanggalLahir: data.tanggalLahir || new Date().toISOString().slice(0, 10),
        jenisKelamin:
          data.jenisKelamin === "Laki-laki" || data.jenisKelamin === "Laki_laki"
            ? "Laki_laki"
            : "Perempuan",
        kewarganegaraan: data.kebangsaan || "Indonesia",
        alamat: data.alamat || "",
        kodeProvinsi: data.provinsi || "",
        kodeKota: data.kota || "",
        kodePosAsesi: data.kodePos || "",
        noHp: data.noTelp || "",
        pendidikanTerakhir: data.pendidikanTerakhir || "",
        pekerjaan: data.pekerjaan || "",
        tandaTangan: data.tandaTangan || null,
        memerlukanPenyesuaianWajar: Boolean(data.penyesuaianWajar),
        isBerpengalaman: Boolean(data.berpengalaman),
        namaInstitusi: data.institusiPerusahaan || null,
        jabatan: data.jabatan || null,
        alamatInstitusi: data.alamatInstitusi || null,
        kodePosInstitusi: data.kodePosInstitusi || null,
        emailInstitusi: data.emailInstitusi || null,
        telpInstitusi: data.telpInstitusi || null,
        faxInstitusi: data.faxInstitusi || null,
      } as z.infer<typeof dataPribadiSchema>);

    const dokumen = data.dokumen || [];
    const asesmenMandiri = data.asesmenMandiri || data.dataAsesmen || [];

    return {
      userId: data.userId,
      skemaId: data.skemaId,
      kodeSkema: data.kodeSkema || data.code,
      tuk: data.tuk || "TUK Mandiri",
      jenisAsesmen: data.jenisAsesmen || "Uji Kompetensi",
      dataPribadi,
      dokumen,
      asesmenMandiri,
    };
  });

// 4. Skema Edit Pengajuan (selama belum diverifikasi)
export const updatePengajuanSchema = z.object({
  tuk: z.string().optional(),
  jenisAsesmen: z.string().optional(),
  dataPribadi: dataPribadiSchema.partial().optional(),
});

// 5. Skema Update Status Pengajuan (Admin)
export const updateStatusPengajuanSchema = z.object({
  status: z.string().min(1, "Status wajib diisi"),
});

// 6. Skema Upload Dokumen Tambahan
export const uploadDokumenSchema = z.union([
  itemDokumenSchema,
  z.array(itemDokumenSchema).min(1, "Minimal satu dokumen"),
]);

// 7. Skema Submit/Update Checklist APL02 (Asesmen Mandiri)
export const submitAsesmenMandiriSchema = z.union([
  z.object({
    asesmenMandiri: z.array(itemAsesmenMandiriSchema).min(1, "Minimal satu unit"),
  }),
  z.array(itemAsesmenMandiriSchema).min(1, "Minimal satu unit"),
]);

// 8. Skema Penilaian Asesor per Unit APL02
export const penilaianAsesorMandiriSchema = z.object({
  penilaianAsesor: z.string().min(1, "Penilaian asesor wajib diisi"),
  catatanAsesor: z.string().optional().nullable(),
});

// Tipe DTO
export type CreatePengajuanDTO = z.infer<typeof createPengajuanSchema>;
export type UpdatePengajuanDTO = z.infer<typeof updatePengajuanSchema>;
export type UpdateStatusPengajuanDTO = z.infer<typeof updateStatusPengajuanSchema>;
export type UploadDokumenDTO = z.infer<typeof uploadDokumenSchema>;
export type SubmitAsesmenMandiriDTO = z.infer<typeof submitAsesmenMandiriSchema>;
export type PenilaianAsesorMandiriDTO = z.infer<typeof penilaianAsesorMandiriSchema>;