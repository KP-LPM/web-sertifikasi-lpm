import { z } from "zod";

const JsonArray = z.array(z.any()).default([]);

// --- SCHEMAS CHILD (STEPS & PENYUSUN) ---

export const PenyusunSchema = z.object({
  peran: z.string().trim().min(1, "Peran wajib diisi"),
  nama: z.string().trim().min(1, "Nama penyusun wajib diisi"),
  user_id: z.number().int().optional().nullable(),
});

export const Step1OpsiSchema = z.object({
  opsi_text: z.string().trim().min(1),
  is_valid: z.boolean().default(false),
});

export const Step1PertanyaanSchema = z.object({
  pertanyaan_text: z.string().trim().min(1, "Pertanyaan wajib diisi"),
  opsi: z.array(Step1OpsiSchema).default([]),
});

export const Step2SkenarioSchema = z.object({
  skenario_studi_kasus: z.string().optional().nullable(),
  informasi_yang_diberikan: JsonArray,
  lingkup_bahasan_studi_kasus: JsonArray,
  perlengkapan_dan_bahan: z.string().optional().nullable(),
  fokus_presentasi: JsonArray,
  ketentuan_alokasi_waktu: z.string().optional().nullable(),
  kriteria_evaluasi_asesor: JsonArray,
});

export const Step3SubPertanyaanSchema = z.object({
  skenario_pertanyaan: z.string().trim().min(1),
  kode_kuk: JsonArray,
  ekspektasi_tanggapan: z.string().optional().nullable(),
});

export const Step3LingkupSchema = z.object({
  nama_lingkup: z.string().trim().min(1),
  sub_pertanyaan: z.array(Step3SubPertanyaanSchema).default([]),
});

export const Step4PertanyaanSchema = z.object({
  kode_kuk_ref: z.string().optional().nullable(),
  pertanyaan_lisan: z.string().trim().min(1),
  kunci_jawaban: z.string().optional().nullable(),
});

// --- SCHEMAS MAIN & PAYLOADS ---

export const CreateKonfigurasiSchema = z.object({
  nama: z.string().trim().min(1, "Nama konfigurasi wajib diisi"),
  skema_id: z.number().int().optional().nullable(),
  tipe_form: z.string().optional().nullable(),
  versi: z.string().default("1.0"),
  is_default: z.boolean().default(false),
  status: z.string().default("Draft"),

  penyusun: z.array(PenyusunSchema).default([]),
  step1: z.array(Step1PertanyaanSchema).default([]),
  step2: Step2SkenarioSchema.optional().nullable(),
  step3: z.array(Step3LingkupSchema).default([]),
  step4: z.array(Step4PertanyaanSchema).default([]),
});

// Update main config (hanya kolom utamanya saja, tanpa steps)
export const UpdateKonfigurasiMainSchema =
  CreateKonfigurasiSchema.partial().omit({
    penyusun: true,
    step1: true,
    step2: true,
    step3: true,
    step4: true,
  });

// Types
export type CreateKonfigurasiInput = z.infer<typeof CreateKonfigurasiSchema>;
export type UpdateKonfigurasiMainInput = z.infer<
  typeof UpdateKonfigurasiMainSchema
>;
export type Step1Input = z.infer<typeof Step1PertanyaanSchema>;
export type Step2Input = z.infer<typeof Step2SkenarioSchema>;
export type Step3Input = z.infer<typeof Step3LingkupSchema>;
export type Step4Input = z.infer<typeof Step4PertanyaanSchema>;
