import { UserService } from "@/services/user.service";
import { ClientError } from "@/error/index";
import { sendResponse } from "@/lib/response";
import { NextRequest } from "next/server";
import { BaseUserSchema } from "@/schema/user.schema";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import bcrypt from "bcryptjs";

const userService = new UserService();

export async function GET() {
  try {
    const user = await userService.getUser();
    return sendResponse(200, "User retrieved successfully", user);
  } catch (error) {
    if (error instanceof ClientError) {
      return sendResponse(error.statusCode, error.message);
    }
    console.log(error);
    return sendResponse(500, "Internal server error");
  }
}

export async function POST(request: NextRequest) {
  try {
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
    return sendResponse(201, "User created successfully", user);
  } catch (error) {
    if (error instanceof ClientError) {
      return sendResponse(error.statusCode, error.message);
    }
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          message: "Validasi data gagal",
          errors: error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }
    console.log(error);
    return sendResponse(500, "Internal server error");
  }
}
