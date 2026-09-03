import { db } from "@/lib/db";
import { BaseUserInput } from "@/schema/user.schema";

export class UserRepository {
  // Kelola Users Admin
  async getUser() {
    const user = await db.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
      },
    });
    return user;
  }

  async getUserById(id: number) {
    return await db.user.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        role: true,
        isActive: true,
      },
    });
  }

  async getUserByEmail(email: string) {
    return await db.user.findUnique({
      where: { email },
      select: {
        email: true,
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
      where: { id: Number(id) },
    });
    return user;
  }
}
