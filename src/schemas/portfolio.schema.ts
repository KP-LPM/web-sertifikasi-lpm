import { z } from "zod";

export const CreatePortfolioSchema = z.object({
  skema_id: z.coerce.number().int().optional().nullable(),
  nama_dokumen: z.string().trim().min(1, "Field 'nama_dokumen' wajib diisi."),
  status_asesor: z.string().trim().optional().nullable(),
  alamat_lsp: z.string().trim().optional().nullable(),
  tanggal: z.coerce.date().optional().nullable(),
  link_portfolio: z.string().trim().optional().nullable(),
  link_surat_peminjaman: z.string().trim().optional().nullable(),
  link_surat_jawaban: z.string().trim().optional().nullable(),
  status: z.string().default("Menunggu Verifikasi"),
});

export const UpdatePortfolioSchema = z.object({
  skema_id: z.coerce.number().int().optional().nullable(),
  nama_dokumen: z.string().trim().min(1, "Field 'nama_dokumen' wajib diisi.").optional(),
  status_asesor: z.string().trim().optional().nullable(),
  alamat_lsp: z.string().trim().optional().nullable(),
  tanggal: z.coerce.date().optional().nullable(),
  link_portfolio: z.string().trim().optional().nullable(),
  link_surat_peminjaman: z.string().trim().optional().nullable(),
  link_surat_jawaban: z.string().trim().optional().nullable(),
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
