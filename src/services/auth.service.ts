import bcrypt from "bcryptjs";
import { JenisKelamin, Role } from "@prisma/client";
import {
  profileRepository,
  ProfileRepository,
} from "@/repositories/profile.repositories";
import type { RegisterPayload } from "@/types/types";

export class ValidationError extends Error {
  statusCode = 400;
}
export class ConflictError extends Error {
  statusCode = 409;
}

export class AuthService {
  constructor(private repo: ProfileRepository = profileRepository) {}

  async register(payload: RegisterPayload) {
    const {
      username,
      email,
      password,
      role,
      nik,
      nama_lengkap,
      tempat_lahir,
      tanggal_lahir,
      jenis_kelamin,
      no_hp,
      pekerjaan,
      kewarganegaraan,
      nomor_registrasi_met,
      pendidikan_terakhir,
      alamat_wilayah,
      tanda_tangan,
    } = payload;

    if (!username || !email || !password || !role || !nik || !nama_lengkap) {
      throw new ValidationError("Data wajib belum lengkap!");
    }

    if (role === "asesor") {
      if (!nomor_registrasi_met || !pendidikan_terakhir || !alamat_wilayah) {
        throw new ValidationError("Data khusus Asesor wajib diisi!");
      }
    } else if (role === "asesi") {
      if (!kewarganegaraan) {
        throw new ValidationError("Data khusus Asesi wajib diisi!");
      }
    }

    const existing = await this.repo.findUserByUsernameOrEmail(username, email);
    if (existing) {
      throw new ConflictError("Username/Email sudah terdaftar.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const mappedJenisKelamin = (
      jenis_kelamin === "Laki-laki" ? "Laki_laki" : "Perempuan"
    ) as JenisKelamin;

    return await this.repo.registerWithProfile(
      {
        username,
        email,
        password: hashedPassword,
        role: role as Role,
      },
      {
        nik,
        namaLengkap: nama_lengkap,
        tempatLahir: tempat_lahir || "-",
        tanggalLahir: tanggal_lahir ? new Date(tanggal_lahir) : new Date(),
        jenisKelamin: mappedJenisKelamin,
        noHp: no_hp || "-",
        pekerjaan: pekerjaan || "-",
        kewarganegaraan: role === "asesi" ? kewarganegaraan : null,
        nomorRegistrasiMet: role === "asesor" ? nomor_registrasi_met : null,
        pendidikanTerakhir: role === "asesor" ? pendidikan_terakhir : null,
        alamat: role === "asesor" ? alamat_wilayah : null,
        tandaTangan: tanda_tangan || null,
      },
    );
  }
}

export const authService = new AuthService();
