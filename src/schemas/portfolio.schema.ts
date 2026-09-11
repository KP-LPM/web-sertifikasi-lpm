import { z } from "zod";

export const CreatePortfolioSchema = z.object({
  skema_id: z.coerce.number().int().optional().nullable(),
  nama_dokumen: z.string().trim().min(1, "Field 'nama_dokumen' wajib diisi."),
  deskripsi: z.string().trim().optional().nullable(),
  tanggal: z.coerce.date().optional().nullable(),
  file_name: z.string().trim().optional().nullable(),
  file_size: z.string().trim().optional().nullable(),
  file_type: z.string().trim().optional().nullable(),
  status: z.string().default("Menunggu Verifikasi"),
});

export const UpdatePortfolioSchema = z.object({
  skema_id: z.coerce.number().int().optional().nullable(),
  nama_dokumen: z.string().trim().min(1, "Field 'nama_dokumen' wajib diisi.").optional(),
  deskripsi: z.string().trim().optional().nullable(),
  tanggal: z.coerce.date().optional().nullable(),
  file_name: z.string().trim().optional().nullable(),
  file_size: z.string().trim().optional().nullable(),
  file_type: z.string().trim().optional().nullable(),
});

export const VerifikasiPortfolioSchema = z.object({
  status: z.enum(["Terverifikasi", "Ditolak", "Menunggu Verifikasi"], {
    message: "Status tidak valid. Gunakan 'Terverifikasi' atau 'Ditolak'.",
  }),
  catatan_admin: z.string().trim().optional().nullable(),
});

export type CreatePortfolioInput = z.infer<typeof CreatePortfolioSchema>;
export type UpdatePortfolioInput = z.infer<typeof UpdatePortfolioSchema>;
export type VerifikasiPortfolioInput = z.infer<typeof VerifikasiPortfolioSchema>;
