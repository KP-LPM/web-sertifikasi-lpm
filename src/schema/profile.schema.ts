import { z } from "zod";

export const baseProfilUpdateSchema = z.object({
  namaLengkap: z.string().min(1).optional(),
  tempatLahir: z.string().optional(),
  tanggalLahir: z.coerce.date().optional(),
  jenisKelamin: z.enum(["Perempuan", "Laki_laki"]).optional(),
  kewarganegaraan: z.string().optional(),
  noHp: z.string().optional(),
  pendidikanTerakhir: z.string().optional(),
  pekerjaan: z.string().optional(),
  alamat: z.string().optional(),
  kodePos: z.string().optional(),
  kodeKota: z.string().optional(),
  kodeProvinsi: z.string().optional(),
  tandaTangan: z.string().optional(),
  avatar: z.string().optional(),
});

export const profilAsesiUpdateSchema = baseProfilUpdateSchema.extend({
  namaInstitusi: z.string().optional(),
  jabatan: z.string().optional(),
  emailInstitusi: z.string().email().optional(),
  kodePosInstitusi: z.string().optional(),
  noHpInstitusi: z.string().optional(),
  alamatInstitusi: z.string().optional(),
  noFaxInstitusi: z.string().optional(),
});

export const profilAsesorUpdateSchema = baseProfilUpdateSchema.extend({
  nomorRegistrasiMet: z.string().optional(),
});

export const profilAdminUpdateSchema = baseProfilUpdateSchema;

export type ProfilAsesiUpdateInput = z.infer<typeof profilAsesiUpdateSchema>;
export type ProfilAsesorUpdateInput = z.infer<typeof profilAsesorUpdateSchema>;
export type ProfilAdminUpdateInput = z.infer<typeof profilAdminUpdateSchema>;
