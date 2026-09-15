import { z } from "zod";

export const CreateJadwalSchema = z.object({
  nama_batch: z.string().optional().nullable(),
  nomor_surat: z.string().optional().nullable(),
  skema_id: z.number().int().optional().nullable(),
  metode: z.string().optional().nullable(),
  tanggal: z.coerce.date(),
  waktu_mulai: z.coerce.date().optional().nullable(),
  tipe_tuk: z.string().optional().nullable(),
  tuk_id: z.number().int().optional().nullable(),
  alamat: z.string().optional().nullable(),
  link_video: z.string().optional().nullable(),
  asesor_id: z.number().int().optional().nullable(),
  surat_tugas_url: z.string().optional().nullable(),
  status: z.string().default("Terjadwal"),
  noRegMet: z.string().optional().nullable(),
  jumlahSkema: z.number().int().optional().nullable(),
  kotaSurat: z.string().optional().nullable(),
  namaDirektur: z.string().optional().nullable(),
});

export const UpdateJadwalSchema = CreateJadwalSchema.partial();

export const AddPesertaBulkSchema = z.object({
  pengajuan_ids: z.array(z.number().int()).min(1, "Pilih minimal satu peserta"),
});

export type CreateJadwalInput = z.infer<typeof CreateJadwalSchema>;
export type UpdateJadwalInput = z.infer<typeof UpdateJadwalSchema>;
export type AddPesertaBulkInput = z.infer<typeof AddPesertaBulkSchema>;
