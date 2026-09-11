import { z } from "zod";

export const CreateTukSchema = z.object({
  nama: z.string().trim().min(1, "Field 'nama' wajib diisi."),
  keterangan: z.string().trim().optional().nullable(),
  tipe: z.string().trim().optional().nullable(),
  alamat: z.string().trim().optional().nullable(),
  kapasitas: z.coerce.number().int().min(0).optional().nullable(),
  penanggung_jawab: z.string().trim().optional().nullable(),
  status: z.string().default("Aktif"),
});

export const UpdateTukSchema = z.object({
  nama: z.string().trim().min(1, "Field 'nama' tidak boleh kosong.").optional(),
  keterangan: z.string().trim().optional().nullable(),
  tipe: z.string().trim().optional().nullable(),
  alamat: z.string().trim().optional().nullable(),
  kapasitas: z.coerce.number().int().min(0).optional().nullable(),
  penanggung_jawab: z.string().trim().optional().nullable(),
  status: z.string().optional(),
});

export const CreateTukInventarisSchema = z.object({
  nama: z.string().trim().min(1, "Field 'nama' wajib diisi."),
  jumlah: z.coerce.number().int().min(0).default(0),
});

export const UpdateTukInventarisSchema = z.object({
  nama: z.string().trim().min(1, "Field 'nama' tidak boleh kosong.").optional(),
  jumlah: z.coerce.number().int().min(0).optional(),
});

export type CreateTukInput = z.infer<typeof CreateTukSchema>;
export type UpdateTukInput = z.infer<typeof UpdateTukSchema>;
export type CreateTukInventarisInput = z.infer<typeof CreateTukInventarisSchema>;
export type UpdateTukInventarisInput = z.infer<typeof UpdateTukInventarisSchema>;
