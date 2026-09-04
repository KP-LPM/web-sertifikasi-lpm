import { z } from "zod";

const rekomendasiEnum = ["Dapat dilanjutkan", "Tidak dapat dilanjutkan"] as const;

// Schema untuk setiap orang (Penyusun atau Validator)
const personSchema = z.object({
  nama: z.string().min(1, "Nama wajib diisi"),
  noReg: z.string().optional().nullable(),
  tanggal: z.string().date("Format tanggal tidak valid").optional().nullable(),
});

export const penilaianApl02Schema = z.object({
  rekomendasiApl02: z.enum(rekomendasiEnum, {
    message: "Rekomendasi wajib dipilih",
  }),
  ttdAsesor: z.string().url("URL Tanda tangan asesor tidak valid").optional().nullable(),
  namaAsesor: z.string().optional().nullable(),
  asesorReg: z.string().optional().nullable(),
  tanggal: z.string().date("Format tanggal tidak valid").optional().nullable(),
  
  // Array untuk penyusun dan validator 
  penyusun: z.array(personSchema).optional().default([]),
  validator: z.array(personSchema).optional().default([]),
});

export type PenilaianApl02DTO = z.infer<typeof penilaianApl02Schema>;