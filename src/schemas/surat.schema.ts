import { z } from "zod";

export const CreateSuratSchema = z.object({
  nomor_surat: z.string().trim().min(1, "Field 'nomor_surat', 'judul', 'kategori', dan 'jenis_surat' wajib diisi."),
  judul: z.string().trim().min(1, "Field 'nomor_surat', 'judul', 'kategori', dan 'jenis_surat' wajib diisi."),
  kategori: z.string().trim().min(1, "Field 'nomor_surat', 'judul', 'kategori', dan 'jenis_surat' wajib diisi."),
  jenis_surat: z.string().trim().min(1, "Field 'nomor_surat', 'judul', 'kategori', dan 'jenis_surat' wajib diisi."),
  nama_jenis_surat: z.string().trim().optional().nullable(),
  tanggal_terbit: z.coerce.date().optional().nullable(),
  penerbit: z.string().trim().optional().nullable(),
  penerima: z.string().trim().optional().nullable(),
  skema_id: z.coerce.number().int().optional().nullable(),
  jumlah_asesi: z.coerce.number().int().optional().nullable(),
  status: z.string().default("Draft"),
  url_dokumen: z.string().trim().optional().nullable(),
  url_gdrive: z.string().trim().optional().nullable(),
  catatan: z.string().trim().optional().nullable(),
  no_sk: z.string().trim().optional().nullable(),
  pimpinan_sidang: z.string().trim().optional().nullable(),
  notulis: z.string().trim().optional().nullable(),
  nama_asesor: z.string().trim().optional().nullable(),
  no_met_asesor: z.string().trim().optional().nullable(),
  lokasi: z.string().trim().optional().nullable(),
  detail_payload: z.any().optional().nullable(),
});

export const UpdateSuratSchema = z.object({
  status: z.string().optional(),
  tanggal_terbit: z.coerce.date().optional().nullable(),
  url_dokumen: z.string().trim().optional().nullable(),
  url_gdrive: z.string().trim().optional().nullable(),
  catatan: z.string().trim().optional().nullable(),
});

export type CreateSuratInput = z.infer<typeof CreateSuratSchema>;
export type UpdateSuratInput = z.infer<typeof UpdateSuratSchema>;

export interface SuratFilterInput {
  kategori?: string;
  jenis_surat?: string;
  status?: string;
  skema_id?: number;
}
