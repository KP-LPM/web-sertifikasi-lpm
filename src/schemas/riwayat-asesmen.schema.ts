import { z } from "zod";

export const CreateRiwayatAsesmenSchema = z.object({
  asesor_id: z.number().int().optional().nullable(),
  form_type: z.string().trim().min(1, "Tipe form wajib diisi"),
  form_data: z.record(z.string(), z.unknown()).default({}),
  penilaian: z.record(z.string(), z.unknown()).default({}),
  catatan: z.string().optional().nullable(),
  ttd_asesor: z.string().optional().nullable(),
  ttd_asesi: z.string().optional().nullable(),
  tanggal_ttd_asesor: z.string().or(z.date()).optional().nullable(),
  tanggal_ttd_asesi: z.string().or(z.date()).optional().nullable(),
});

export const UpdateRiwayatAsesmenSchema = z.object({
  form_data: z.record(z.string(), z.unknown()).optional(),
  penilaian: z.record(z.string(), z.unknown()).optional(),
  catatan: z.string().optional().nullable(),
  ttd_asesor: z.string().optional().nullable(),
  ttd_asesi: z.string().optional().nullable(),
  tanggal_ttd_asesor: z.string().or(z.date()).optional().nullable(),
  tanggal_ttd_asesi: z.string().or(z.date()).optional().nullable(),
});

export type CreateRiwayatAsesmenInput = z.infer<
  typeof CreateRiwayatAsesmenSchema
>;
export type UpdateRiwayatAsesmenInput = z.infer<
  typeof UpdateRiwayatAsesmenSchema
>;
