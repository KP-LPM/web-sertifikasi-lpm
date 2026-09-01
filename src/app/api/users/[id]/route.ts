import { NextRequest } from "next/server";
import { UserService } from "@/src/services/user.service";
import { ClientError } from "@/src/error/index";
import { sendResponse } from "@/src/lib/response";

const userService = new UserService();

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!id) {
      return sendResponse(400, "ID parameter is required");
    }

    const body = await request.json();

    const newPassword = body?.newPassword || body?.password;
    await userService.updatePassword(id, newPassword);

    return sendResponse(200, "Password petugas berhasil diperbarui");
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
  { params }: { params: Promise<{ id: string }> },
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

    return sendResponse(500, "Terjadi kesalahan pada server");
  }
}
