import { UserRepository } from "../repositories/user.repositories";
import { BaseUserInput } from "@/schema/user.schema";
import { InvariantError, NotFoundError } from "../error/index";

export class UserService {
  private userRepository = new UserRepository();

  async getUser() {
    const user = await this.userRepository.getUser();
    if (!user) {
      throw new NotFoundError("User tidak ditemukan");
    }
    return user;
  }

  async getUserById(id: number) {
    const user = await this.userRepository.getUserById(id);
    if (!user) {
      throw new NotFoundError("User tidak ditemukan");
    }
    return user;
  }

  async getUserByEmail(email: string) {
    const user = await this.userRepository.getUserByEmail(email);
    if (!user) {
      throw new NotFoundError("User tidak ditemukan");
    }
    return user;
  }

  async createUser(data: BaseUserInput) {
    const existingUser = await this.userRepository.getUserByEmail(data.email);
    if (existingUser) {
      throw new InvariantError(
        "Username sudah digunakan, silakan pakai username lain",
      );
    }
    const newUser = await this.userRepository.createUser(data);

    if (!newUser) {
      throw new InvariantError("Gagal membuat pengguna baru");
    }

    return newUser;
  }

  async updateUserStatus(id: number, data: BaseUserInput) {
    const existingUser = await this.userRepository.getUserById(id);
    if (!existingUser) {
      throw new NotFoundError("User tidak ditemukan");
    }
    const user = await this.userRepository.updateUserStatus(id, data);
    if (!user) {
      throw new InvariantError("Gagal Mengupdate User");
    }
    return user;
  }

  async deleteUser(id: number) {
    const existingUser = await this.userRepository.getUserById(id);
    if (!existingUser) {
      throw new NotFoundError("User tidak ditemukan");
    }
    const user = await this.userRepository.deleteUser(id);
    if (!user) {
      throw new InvariantError("Gagal menghapus user");
    }
    return user;
  }
}
