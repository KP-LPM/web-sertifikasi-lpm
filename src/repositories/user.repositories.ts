import { db } from "@/lib/db";
import { BaseUserInput } from "@/schemas/user.schema";
import { Prisma } from "@prisma/client";

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
        id: true,
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

  async isEmailTakenByOther(email: string, excludeUserId: number) {
    const existing = await db.user.findUnique({
      where: { email },
      select: { id: true },
    });
    return !!existing && existing.id !== excludeUserId;
  }

  async setResetToken(userId: number, hashedToken: string, expiry: Date) {
    return await db.user.update({
      where: { id: userId },
      data: {
        resetToken: hashedToken,
        resetTokenExpiry: expiry,
      },
    });
  }

  async findByValidResetToken(hashedToken: string) {
    return await db.user.findFirst({
      where: {
        resetToken: hashedToken,
        resetTokenExpiry: { gt: new Date() },
      },
      select: { id: true },
    });
  }

  async findByValidResetTokenForUser(userId: number, hashedToken: string) {
    return await db.user.findFirst({
      where: {
        id: userId,
        resetToken: hashedToken,
        resetTokenExpiry: { gt: new Date() },
      },
      select: { id: true, email: true },
    });
  }

  async updateEmail(
    userId: number,
    email: string,
    tx: Prisma.TransactionClient | typeof db = db,
  ) {
    return await tx.user.update({
      where: { id: userId },
      data: { email },
    });
  }

  async updatePasswordAndClearToken(userId: number, hashedPassword: string) {
    return await db.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });
  }
}

export const userRepository = new UserRepository();
