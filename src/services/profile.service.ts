import { db } from "@/lib/db";
import { ProfileRepository } from "@/repositories/profile.repository";
import { UserRepository } from "@/repositories/user.repository";
import { NotFoundError, InvariantError } from "../error/index";
import {
  ProfilAsesiUpdateInput,
  ProfilAsesorUpdateInput,
  ProfilAdminUpdateInput,
} from "@/schemas/profile.schema";

export type UpdateProfileInput =
  ProfilAsesiUpdateInput | ProfilAsesorUpdateInput | ProfilAdminUpdateInput;

export class ProfileService {
  private userRepository = new UserRepository();
  private profileRepository = new ProfileRepository();

  async getProfileUsers(id: number) {
    const checkUser = await this.userRepository.getUserById(id);
    if (!checkUser) {
      throw new NotFoundError("User tidak ditemukan");
    }

    if (checkUser.role === "asesi") {
      return await this.profileRepository.getProfileAsesi(id);
    }
    if (checkUser.role === "asesor") {
      return await this.profileRepository.getProfileAsesor(id);
    }
    return await this.profileRepository.getProfileAdmin(id);
  }

  async updateProfileUsers(id: number, data: UpdateProfileInput) {
    const checkUser = await this.userRepository.getUserById(id);
    if (!checkUser) {
      throw new NotFoundError("User tidak ditemukan");
    }

    const { email, ...profilData } = data as UpdateProfileInput & {
      email?: string;
    };

    if (email) {
      const isTaken = await this.userRepository.isEmailTakenByOther(email, id);
      if (isTaken) {
        throw new InvariantError("Email sudah digunakan oleh akun lain.");
      }
    }

    return await db.$transaction(async (tx) => {
      if (email) {
        await this.userRepository.updateEmail(id, email, tx);
      }

      let profil;
      if (checkUser.role === "asesi") {
        profil = await this.profileRepository.updateProfileAsesi(
          id,
          profilData as ProfilAsesiUpdateInput,
          tx,
        );
      } else if (checkUser.role === "asesor") {
        profil = await this.profileRepository.updateProfileAsesor(
          id,
          profilData as ProfilAsesorUpdateInput,
          tx,
        );
      } else {
        profil = await this.profileRepository.updateProfileAdmin(
          id,
          profilData as ProfilAdminUpdateInput,
          tx,
        );
      }

      const user = await tx.user.findUnique({
        where: { id },
        select: { id: true, email: true, username: true, role: true },
      });

      return { user, profil };
    });
  }
}

export const profileService = new ProfileService();
