import { db } from "@/lib/db";
import { Prisma, Role } from "@prisma/client";
import {
  ProfilAsesiUpdateInput,
  ProfilAsesorUpdateInput,
  ProfilAdminUpdateInput,
} from "@/schemas/profile.schema";

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

  async findUserByUsernameOrEmail(username: string, email: string) {
    return await db.user.findFirst({
      where: { OR: [{ username }, { email }] },
    });
  }

  async registerWithProfile(
    userData: { username: string; email: string; password: string; role: Role },
    profileData: Prisma.ProfilPenggunaCreateWithoutUserInput,
  ) {
    return await db.$transaction(async (tx) => {
      const newUser = await tx.user.create({ data: userData });
      const newProfile = await tx.profilPengguna.create({
        data: { ...profileData, user: { connect: { id: newUser.id } } },
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
      select: { ...this.baseProfilSelect, nomorRegistrasiMet: true },
    });
  }

  async getProfileAdmin(userId: number) {
    return await db.profilPengguna.findUnique({
      where: { userId },
      select: this.baseProfilSelect,
    });
  }

  // Ketiga method di bawah ini ditambahkan parameter `tx` opsional —
  // dipakai ProfileService supaya update profil ikut dalam transaksi
  // yang sama dengan update email (lihat profile.service.ts).
  async updateProfileAsesi(
    userId: number,
    data: ProfilAsesiUpdateInput,
    tx: Prisma.TransactionClient | typeof db = db,
  ) {
    return await tx.profilPengguna.update({ where: { userId }, data });
  }

  async updateProfileAsesor(
    userId: number,
    data: ProfilAsesorUpdateInput,
    tx: Prisma.TransactionClient | typeof db = db,
  ) {
    return await tx.profilPengguna.update({ where: { userId }, data });
  }

  async updateProfileAdmin(
    userId: number,
    data: ProfilAdminUpdateInput,
    tx: Prisma.TransactionClient | typeof db = db,
  ) {
    return await tx.profilPengguna.update({ where: { userId }, data });
  }
}

export const profileRepository = new ProfileRepository();
