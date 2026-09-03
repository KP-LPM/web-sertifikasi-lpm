import { ProfileRepository } from "@/repositories/profile.repositories";
import { UserRepository } from "@/repositories/user.repositories";
import { NotFoundError } from "../error/index";
import {
  ProfilAsesiUpdateInput,
  ProfilAsesorUpdateInput,
  ProfilAdminUpdateInput,
} from "@/schema/profile.schema";

export type UpdateProfileInput =
  | ProfilAsesiUpdateInput
  | ProfilAsesorUpdateInput
  | ProfilAdminUpdateInput;

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

    if (checkUser.role === "asesi") {
      return await this.profileRepository.updateProfileAsesi(
        id,
        data as ProfilAsesiUpdateInput,
      );
    }

    if (checkUser.role === "asesor") {
      return await this.profileRepository.updateProfileAsesor(
        id,
        data as ProfilAsesorUpdateInput,
      );
    }

    return await this.profileRepository.updateProfileAdmin(
      id,
      data as ProfilAdminUpdateInput,
    );
  }
}
