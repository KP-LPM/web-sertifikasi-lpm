import { Role } from "@prisma/client";
import { db } from "@/lib/db";

export class UserRepository {
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
  async getUserByUsername(username: string) {
    return await db.user.findUnique({
      where: { username },
    });
  }
  async createUser(data: {
    username: string;
    email: string;
    password: string;
    role: Role;
    isActive: boolean;
  }) {
    return await db.user.create({
      data: {
        username: data.username,
        password: data.password,
        role: data.role,
        email: data.email,
        isActive: data.isActive,
      },
    });
  }
  async updateUser(
    id: number,
    data: {
      username: string;
      email: string;
      password: string;
      role: Role;
      isActive: boolean;
    },
  ) {
    return await db.user.update({
      where: {
        id: Number(id),
      },
      data: {
        username: data.username,
        password: data.password,
        role: data.role,
        email: data.email,
        isActive: data.isActive,
      },
    });
  }
  async updatePassword(id: number, password: string) {
    return await db.user.update({
      where: { id },
      data: { password },
    });
  }
  async deleteUser(id: number) {
    const user = await db.user.delete({
      where: { id: id },
    });
    return user;
  }
}
