import { UserRepository } from "../repositories/user.repositories";
import { InvariantError, NotFoundError } from "../error/index";
import bcrypt from "bcrypt";

export class UserService {
  private userRepository = new UserRepository();
  async getUser() {
    const user = await this.userRepository.getUser();
    if (!user) {
      throw new NotFoundError("User not found");
    }
    return user;
  }
  async createUser(data: { username: string; password: string; role: string }) {
    if (!data.username || !data.password) {
      throw new InvariantError("Username dan password wajib diisi");
    }

    const existingUser = await this.userRepository.getUserByUsername(
      data.username,
    );
    if (existingUser) {
      throw new InvariantError(
        "Username sudah digunakan, silakan pakai username lain",
      );
    }

    const newUser = await this.userRepository.createUser({
      username: data.username,
      password: data.password,
      role: data.role || "PETUGAS",
    });

    if (!newUser) {
      throw new InvariantError("Gagal membuat pengguna baru");
    }

    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }
  async deleteUser(id: string) {
    const user = await this.userRepository.deleteUser(id);
    if (!user) {
      throw new NotFoundError("User not found");
    }
    return user;
  }

  async updatePassword(id: string, newPassword: string) {
    if (!newPassword || newPassword.length < 6) {
      throw new InvariantError("Password minimal 6 karakter");
    }

    const updatedUser = await this.userRepository.updatePassword(
      id,
      newPassword,
    );

    if (!updatedUser) {
      throw new NotFoundError("Petugas tidak ditemukan");
    }

    return updatedUser;
  }
}
