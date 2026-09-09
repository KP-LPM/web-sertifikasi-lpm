import { z } from "zod";

export const CreatePlenoSchema = z.object({
  batch_code: z.string().optional().nullable(),
  title: z.string().optional().nullable(),
  no_sk: z.string().optional().nullable(),
  tanggal: z.coerce.date().optional().nullable(),
  waktu: z.coerce.date().optional().nullable(),
  alamat: z.string().optional().nullable(),
  detail_alamat: z.string().optional().nullable(),
  deskripsi: z.string().optional().nullable(),
  status: z.string().default("Belum"),
  // Array ID Skema untuk relasi pleno_batch_skema
  skema_ids: z.array(z.number().int()).default([]),
});

export const UpdatePlenoSchema = CreatePlenoSchema.partial().extend({
  surat_pleno_name: z.string().optional().nullable(),
  surat_pleno_url: z.string().optional().nullable(),
  link_surat_hasil: z.string().optional().nullable(),
  link_surat_berita_pleno: z.string().optional().nullable(),
  link_surat_keputusan_direktur: z.string().optional().nullable(),
  link_surat_blanko_bnsp: z.string().optional().nullable(),
});

export const AddAsesiPlenoSchema = z.object({
  pengajuan_ids: z
    .array(z.number().int())
    .min(1, "Pilih minimal satu asesi")
    .optional(),
});

export const UpdateAsesiPlenoSchema = z.object({
  status_pleno: z.string().trim().min(1, "Status pleno (K/BK) wajib diisi"),
  catatan: z.string().optional().nullable(),
});

export const AddAttendeeSchema = z.object({
  user_id: z.number().int().optional().nullable(),
  role: z.string().trim().min(1, "Role wajib diisi"),
  nama: z.string().trim().min(1, "Nama peserta rapat wajib diisi"),
});

export type CreatePlenoInput = z.infer<typeof CreatePlenoSchema>;
export type UpdatePlenoInput = z.infer<typeof UpdatePlenoSchema>;
export type AddAsesiPlenoInput = z.infer<typeof AddAsesiPlenoSchema>;
export type UpdateAsesiPlenoInput = z.infer<typeof UpdateAsesiPlenoSchema>;
export type AddAttendeeInput = z.infer<typeof AddAttendeeSchema>;
