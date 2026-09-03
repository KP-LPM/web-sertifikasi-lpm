import { db } from "@/lib/db";
import { Prisma, Role } from "@prisma/client";
import {
  ProfilAsesiUpdateInput,
  ProfilAsesorUpdateInput,
  ProfilAdminUpdateInput,
} from "@/schema/profile.schema";

export class ProfileRepository {
  baseProfilSelect = {
    nik: true,
    namaLengkap: true,
    tempatLahir: true,
    tanggalLahir: true,
    jenisKelamin: true,
    kewarganegaraan: true,
    noHp: true,
    pendidikanTerakhir: true,
    pekerjaan: true,
    alamat: true,
    kodePos: true,
    kodeKota: true,
    kodeProvinsi: true,
    tandaTangan: true,
    avatar: true,
  } as const;

  // Cek duplikasi user sebelum registrasi
  async findUserByUsernameOrEmail(username: string, email: string) {
    return await db.user.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
    });
  }

  // Pembuatan Akun User + Profil via Transaksi Database
  async registerWithProfile(
    userData: {
      username: string;
      email: string;
      password: string;
      role: Role;
    },
    profileData: Prisma.ProfilPenggunaCreateWithoutUserInput,
  ) {
    return await db.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: userData,
      });

      const newProfile = await tx.profilPengguna.create({
        data: {
          ...profileData,
          user: {
            connect: { id: newUser.id },
          },
        },
      });

      return { user: newUser, profile: newProfile };
    });
  }

  async getProfileAsesi(userId: number) {
    return await db.profilPengguna.findUnique({
      where: { userId },
      select: {
        ...this.baseProfilSelect,
        namaInstitusi: true,
        jabatan: true,
        emailInstitusi: true,
        kodePosInstitusi: true,
        noHpInstitusi: true,
        alamatInstitusi: true,
        noFaxInstitusi: true,
      },
    });
  }

  async getProfileAsesor(userId: number) {
    return await db.profilPengguna.findUnique({
      where: { userId },
      select: {
        ...this.baseProfilSelect,
        nomorRegistrasiMet: true,
      },
    });
  }

  async getProfileAdmin(userId: number) {
    return await db.profilPengguna.findUnique({
      where: { userId },
      select: this.baseProfilSelect,
    });
  }

  async updateProfileAsesi(userId: number, data: ProfilAsesiUpdateInput) {
    return await db.profilPengguna.update({ where: { userId }, data });
  }

  async updateProfileAsesor(userId: number, data: ProfilAsesorUpdateInput) {
    return await db.profilPengguna.update({ where: { userId }, data });
  }

  async updateProfileAdmin(userId: number, data: ProfilAdminUpdateInput) {
    return await db.profilPengguna.update({ where: { userId }, data });
  }
}

export const profileRepository = new ProfileRepository();
