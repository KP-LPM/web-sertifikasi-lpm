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

  async getUserById(id: number) {
    return await db.user.findUnique({
      where: { id },
      select: {
        isActive: true,
      },
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
}
