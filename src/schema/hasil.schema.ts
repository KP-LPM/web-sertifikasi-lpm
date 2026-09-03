import { z } from "zod";

const hasilEnum = ["Kompeten", "Belum Kompeten"] as const;

export const hasilAsesmenSchema = z.object({
  hasil: z.enum(hasilEnum, {
    required_error: "Hasil asesmen wajib dipilih",
  }),
  catatan: z.string().optional().nullable(),
  linkVideo: z.string().url("Format URL video tidak valid").optional().nullable(),
});

export type HasilAsesmenDTO = z.infer<typeof hasilAsesmenSchema>;