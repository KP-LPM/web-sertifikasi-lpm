import { db } from "@/lib/db";
import {
  BaseUserInput,
  ProfilAsesiUpdateInput,
  ProfilAsesorUpdateInput,
  ProfilAdminUpdateInput,
} from "@/schema/user.schema";

export class UserRepository {
  // Kelola Users Admin
  async getUser() {
    const user = await db.user.findMany({
      select: {
        id: true,
        username: true,
        password: true,
        role: true,
      },
    });
    return user;
  }

  async getUserByEmail(email: string) {
    return await db.user.findUnique({
      where: { email },
      select: {
        isActive: true,
      },
    });
  }

  async createUser(data: BaseUserInput) {
    return await db.user.create({
      data,
    });
  }

  async updateUserStatus(
    id: number,
    data: {
      isActive: boolean;
    },
  ) {
    return await db.user.update({
      where: {
        id: Number(id),
      },
      data: {
        isActive: data.isActive,
      },
    });
  }

  async deleteUser(id: number) {
    const user = await db.user.delete({
      where: { id: id },
    });
    return user;
  }

  // Profile

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

  async getProfileAsesi(id: number) {
    return await db.profilPengguna.findUnique({
      where: { id },
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
  async getProfileAsesor(id: number) {
    return await db.profilPengguna.findUnique({
      where: { id },
      select: {
        ...this.baseProfilSelect,
        nomorRegistrasiMet: true,
      },
    });
  }
  async getProfileAdmin(id: number) {
    return await db.profilPengguna.findUnique({
      where: { id },
      select: this.baseProfilSelect,
    });
  }

  async updateProfileAsesi(id: number, data: ProfilAsesiUpdateInput) {
    return await db.profilPengguna.update({ where: { id }, data });
  }
  async updateProfileAsesor(id: number, data: ProfilAsesorUpdateInput) {
    return await db.profilPengguna.update({ where: { id }, data });
  }
  async updateProfileAdmin(id: number, data: ProfilAdminUpdateInput) {
    return await db.profilPengguna.update({ where: { id }, data });
  }
}
