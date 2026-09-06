import { z } from "zod";

// ==========================================
// 1. SKEMA ANAK (CHILD RELATIONS)
// ==========================================

export const PersyaratanDasarSchema = z.object({
  namaDokumen: z.string().trim().min(1, "Nama persyaratan wajib diisi"),
  deskripsi: z.string().trim().min(1, "Deskripsi persyaratan wajib diisi"),
});

export const BuktiAdministratifSchema = z.object({
  namaBukti: z.string().trim().min(1, "Nama bukti administratif wajib diisi"),
});

export const ElemenKompetensiSchema = z.object({
  namaElemen: z.string().trim().min(1, "Nama elemen kompetensi wajib diisi"),
  kriteriaUnjukKerja: z
    .string()
    .trim()
    .min(1, "Kriteria unjuk kerja wajib diisi"),
  // Tambahkan field lain jika ada, misal Kriteria Unjuk Kerja (KUK):
  // kriteriaUnjukKerja: z.string().optional(),
});

export const UnitKompetensiSchema = z.object({
  kodeUnit: z.string().trim().min(1, "Kode unit wajib diisi"),
  judulUnit: z.string().trim().min(1, "Judul unit wajib diisi"),
  jenisStandar: z.string().optional(), // SKKNI, SKK Khusus, atau Standar Internasional
  // Array dari elemen kompetensi yang berada di dalam unit ini
  elemen: z.array(ElemenKompetensiSchema).optional().default([]),
});

// ==========================================
// 2. SKEMA UTAMA (MASTER SKEMA)
// ==========================================

export const BaseSkemaItemSchema = z.object({
  kodeSkema: z.string().trim().min(1, "Kode skema wajib diisi"),
  namaSkema: z.string().trim().min(1, "Nama skema wajib diisi"),
  kategori: z.string().trim().min(1, "Kategori wajib diisi").optional(),

  // Di schema.prisma, statusAktif adalah Boolean.
  // Jika frontend mengirim string, Anda bisa gunakan coerce.
  statusAktif: z.boolean().default(true),

  // Field opsional sesuai database (String?)
  nomorSertifikat: z.string().trim().optional(),
  nomorRegistrasi: z.string().trim().optional(),
  deskripsi: z.string().trim().optional(),
  konfigurasiSoalId: z.number().int().positive().optional(),
});

// ==========================================
// 3. PAYLOAD UNTUK CREATE & UPDATE (HIERARKIS)
// ==========================================

/**
 * Validasi untuk POST /skema
 * Menerima data skema sekaligus array persyaratan, bukti, dan unit kompetensi
 */
export const CreateSkemaSchema = BaseSkemaItemSchema.extend({
  persyaratanDasar: z.array(PersyaratanDasarSchema).optional().default([]),
  buktiAdministratif: z.array(BuktiAdministratifSchema).optional().default([]),
  unitKompetensi: z.array(UnitKompetensiSchema).optional().default([]),
});

/**
 * Validasi untuk PATCH /skema/:id
 * Semua field menjadi opsional (partial) karena ini adalah proses update
 */
export const UpdateSkemaSchema = BaseSkemaItemSchema.partial().extend({
  // Tergantung bagaimana Anda menghandle update nested di frontend,
  // biasanya update relasi array dikirim secara terpisah ke endpoint anaknya,
  // tapi jika dikirim bersamaan, Anda bisa biarkan seperti ini:
  persyaratanDasar: z.array(PersyaratanDasarSchema).optional(),
  buktiAdministratif: z.array(BuktiAdministratifSchema).optional(),
  unitKompetensi: z.array(UnitKompetensiSchema).optional(),
});

// ==========================================
// 4. EKSTRAKSI TIPE DATA (TYPESCRIPT)
// ==========================================

export type BaseSkemaInput = z.infer<typeof BaseSkemaItemSchema>;
export type CreateSkemaInput = z.infer<typeof CreateSkemaSchema>;
export type UpdateSkemaInput = z.infer<typeof UpdateSkemaSchema>;
export type UnitKompetensiInput = z.infer<typeof UnitKompetensiSchema>;
export type ElemenKompetensiInput = z.infer<typeof ElemenKompetensiSchema>;
export type PersyaratanDasarInput = z.infer<typeof PersyaratanDasarSchema>;
export type BuktiAdministratifInput = z.infer<typeof BuktiAdministratifSchema>;
