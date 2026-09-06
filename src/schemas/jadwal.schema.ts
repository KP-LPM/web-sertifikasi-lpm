import { z } from "zod";

export const CreateJadwalSchema = z.object({
  kode_batch: z.string().optional().nullable(),
  nama_batch: z.string().optional().nullable(),
  nomor_surat: z.string().optional().nullable(),
  skema_id: z.number().int().optional().nullable(),
  metode: z.string().optional().nullable(),
  // Menggunakan coerce untuk mengubah string tanggal dari frontend menjadi objek Date
  tanggal: z.coerce.date(),
  waktu_mulai: z.coerce.date().optional().nullable(),
  tipe_tuk: z.string().optional().nullable(),
  tuk_id: z.number().int().optional().nullable(),
  alamat: z.string().optional().nullable(),
  link_video: z.string().optional().nullable(),
  asesor_id: z.number().int().optional().nullable(),
  surat_tugas_name: z.string().optional().nullable(),
  surat_tugas_url: z.string().optional().nullable(),
  status: z.string().default("Terjadwal"),
});

export const UpdateJadwalSchema = CreateJadwalSchema.partial();

export const AddPesertaBulkSchema = z.object({
  pengajuan_ids: z.array(z.number().int()).min(1, "Pilih minimal satu peserta"),
});

export type CreateJadwalInput = z.infer<typeof CreateJadwalSchema>;
export type UpdateJadwalInput = z.infer<typeof UpdateJadwalSchema>;
export type AddPesertaBulkInput = z.infer<typeof AddPesertaBulkSchema>;
