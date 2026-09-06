import { z } from "zod";

export const UpdateSertifikatSchema = z.object({
  no_sertifikat: z.string().trim().optional().nullable(),
  no_registrasi: z.string().trim().optional().nullable(),
  tanggal_terbit: z.coerce.date().optional().nullable(),
  tanggal_berlaku: z.coerce.date().optional().nullable(),
  gdrive_url: z.string().url("Format URL tidak valid").optional().nullable(),
});

export type UpdateSertifikatInput = z.infer<typeof UpdateSertifikatSchema>;
