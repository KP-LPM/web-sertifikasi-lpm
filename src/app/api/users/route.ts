import { UserService } from "@/services/user.service";
import { ClientError } from "@/error/index";
import { sendResponse } from "@/lib/response";

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
