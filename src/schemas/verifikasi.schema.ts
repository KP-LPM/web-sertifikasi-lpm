import { z } from "zod";

export const verifikasiApl01Schema = z.object({
  rekomendasi: z.enum(["Diterima", "Ditolak"], {
    message: "Rekomendasi wajib dipilih",
  }),
  catatan: z.string().optional().nullable(),
  statusPembayaran: z.string().optional().nullable(),
  sumberAnggaran: z.string().optional().nullable(),
  adminSignatureUrl: z.string().optional().nullable(),
  lspSignatureUrl: z.string().optional().nullable(),
  assignedAsesorId: z.number().optional().nullable(),
});

export type VerifikasiApl01DTO = z.infer<typeof verifikasiApl01Schema>;