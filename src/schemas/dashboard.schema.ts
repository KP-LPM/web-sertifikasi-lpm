import { z } from "zod";

export const DashboardAdminPengajuanSchema = z.object({
  total: z.number(),
  draf: z.number(),
  diajukan: z.number(),
  diverifikasi: z.number(),
  ditolak: z.number(),
  selesai: z.number(),
});

export const DashboardAdminResponseSchema = z.object({
  pengajuan: DashboardAdminPengajuanSchema,
  verifikasiPending: z.number(),
  jadwalMendatang: z.number(),
  bandingMasuk: z.number(),
});

export const DashboardAsesiResponseSchema = z.object({
  pengajuanAktif: z.any().nullable(),
  riwayatAsesmen: z.array(z.any()),
  sertifikat: z.array(z.any()),
});

export const DashboardAsesorResponseSchema = z.object({
  jadwalMendatang: z.number(),
  kandidatSiapDinilai: z.number(),
  bandingMasuk: z.number(),
});

export type DashboardAdminData = z.infer<typeof DashboardAdminResponseSchema>;
export type DashboardAsesiData = z.infer<typeof DashboardAsesiResponseSchema>;
export type DashboardAsesorData = z.infer<typeof DashboardAsesorResponseSchema>;
