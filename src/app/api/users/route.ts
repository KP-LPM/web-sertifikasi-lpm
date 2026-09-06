import { UserService } from "@/services/user.service";
import { ClientError } from "@/error/index";
import { sendResponse } from "@/lib/response";
import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { BaseUserSchema } from "@/schemas/user.schema";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { rateLimitApi, RateLimitError } from "@/lib/rate-limit";

const userService = new UserService();

export const revalidate = 3600;

export async function GET(request: NextRequest) {
  try {
    rateLimitApi(request, {
      limit: 60,
      windowMs: 60 * 1000,
      key: "get-all-users",
    });

    const user = await userService.getUser();
    return sendResponse(200, "User retrieved successfully", user);
  } catch (error) {
    if (error instanceof RateLimitError) {
      return sendResponse(error.status, "Terlalu banyak permintaan.");
    }
    if (error instanceof ClientError) {
      return sendResponse(error.statusCode, error.message);
    }
    console.log(error);
    return sendResponse(500, "Internal server error");
  }
}

export async function POST(request: NextRequest) {
  try {
    rateLimitApi(request, {
      limit: 20,
      windowMs: 60 * 1000,
      key: "post-users",
    });

    const body = await request.json();

    const { username, email, password, role, isActive } =
      BaseUserSchema.parse(body);
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userService.createUser({
      username,
      email,
      password: hashedPassword,
      role,
      isActive,
    });

    revalidatePath("/api/users");

    return sendResponse(201, "User created successfully", user);
  } catch (error) {
    if (error instanceof RateLimitError) {
      return sendResponse(error.status, "Terlalu banyak permintaan.");
    }
    if (error instanceof ClientError) {
      return sendResponse(error.statusCode, error.message);
    }
    if (error instanceof z.ZodError) {
      return sendResponse(400, "Validasi gagal", error.flatten().fieldErrors);
    }
    console.log(error);
    return sendResponse(500, "Internal server error");
  }
}
