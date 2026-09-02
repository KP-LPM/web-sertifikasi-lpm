import { NextRequest } from "next/server";
import { UserService } from "@/services/user.service";
import { ClientError } from "@/error/index";
import { sendResponse } from "@/lib/response";

const userService = new UserService();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: number }> },
) {
  try {
    const { id } = await params;
    const user = await userService.getUserById(id);
    return sendResponse(200, "User retrieved successfully", user);
  } catch (error) {
    if (error instanceof ClientError) {
      return sendResponse(error.statusCode, error.message);
    }
    console.log(error);
    return sendResponse(500, "Internal server error");
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: number }> },
) {
  try {
    const { id } = await params;

    if (!id) {
      return sendResponse(400, "ID parameter is required");
    }

    const body = await request.json();

    const updatedUser = await userService.updateUserStatus(id, body);

    return sendResponse(200, "Status berhasil diperbarui", {
      isActive: updatedUser.isActive,
    });
  } catch (error) {
    if (error instanceof ClientError) {
      return sendResponse(error.statusCode, error.message);
    }
    console.error("PATCH_USER_ERROR:", error);
    return sendResponse(500, "Internal server error");
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: number }> },
) {
  try {
    const { id } = await params;
    if (!id) {
      return sendResponse(400, "ID parameter is required");
    }

    const deletedUser = await userService.deleteUser(id);

    return sendResponse(200, "User berhasil dihapus", deletedUser);
  } catch (error) {
    if (error instanceof ClientError) {
      return sendResponse(error.statusCode, error.message);
    }
    console.log(error);
    return sendResponse(500, "Terjadi kesalahan pada server");
  }
}
