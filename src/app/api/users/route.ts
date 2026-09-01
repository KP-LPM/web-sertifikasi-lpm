import { NextRequest } from "next/server";
import { UserService } from "@/src/services/user.service";
import { ClientError } from "@/src/error/index";
import { sendResponse } from "@/src/lib/response";

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
    const { username, password, role } = body;
    const user = await userService.createUser({ username, password, role });
    return sendResponse(201, "User created successfully", user);
  } catch (error) {
    if (error instanceof ClientError) {
      return sendResponse(error.statusCode, error.message);
    }
    return sendResponse(500, "Internal server error");
  }
}
