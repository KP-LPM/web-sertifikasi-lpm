import { z } from "zod";

export const BaseUserSchema = z.object({
  username: z.string().trim().min(1),
  email: z.string().trim().min(1).email(), // sekalian tambah .email() biar tervalidasi format
  password: z.string().trim().min(1),
  role: z.enum(["admin", "asesor", "asesi"]), // ganti dari z.string()
  isActive: z.boolean(),
});

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

// Tipe TypeScript otomatis diturunkan dari schema — dipakai di repository
// & handler supaya tidak perlu tulis interface manual terpisah lagi.
export type ProfilAsesiUpdateInput = z.infer<typeof profilAsesiUpdateSchema>;
export type ProfilAsesorUpdateInput = z.infer<typeof profilAsesorUpdateSchema>;
export type ProfilAdminUpdateInput = z.infer<typeof profilAdminUpdateSchema>;
export type BaseUserInput = z.infer<typeof BaseUserSchema>;
