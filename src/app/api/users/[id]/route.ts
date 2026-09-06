import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { UserService } from "@/services/user.service";
import { ClientError } from "@/error/index";
import { sendResponse } from "@/lib/response";
import { rateLimitApi, RateLimitError } from "@/lib/rate-limit";

const userService = new UserService();

export const revalidate = 3600;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    rateLimitApi(request, {
      limit: 60,
      windowMs: 60 * 1000,
      key: "get-user-detail",
    });

    const { id } = await params;
    const userId = Number(id);
    if (isNaN(userId)) {
      return sendResponse(400, "ID tidak valid");
    }

    const user = await userService.getUserById(userId);
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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    rateLimitApi(request, {
      limit: 20,
      windowMs: 60 * 1000,
      key: "patch-user",
    });

    const { id } = await params;
    const userId = Number(id);
    if (!id || isNaN(userId)) {
      return sendResponse(400, "ID parameter is required");
    }

    const body = await request.json();

    const updatedUser = await userService.updateUserStatus(userId, body);

    revalidatePath("/api/users");

    return sendResponse(200, "Status berhasil diperbarui", {
      isActive: updatedUser.isActive,
    });
  } catch (error) {
    if (error instanceof RateLimitError) {
      return sendResponse(error.status, "Terlalu banyak permintaan.");
    }
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
    rateLimitApi(request, {
      limit: 20,
      windowMs: 60 * 1000,
      key: "delete-user",
    });

    const { id } = await params;
    const userId = Number(id);
    if (!id || isNaN(userId)) {
      return sendResponse(400, "ID parameter is required");
    }

    const deletedUser = await userService.deleteUser(userId);

    revalidatePath("/api/users");

    return sendResponse(200, "User berhasil dihapus", deletedUser);
  } catch (error) {
    if (error instanceof RateLimitError) {
      return sendResponse(error.status, "Terlalu banyak permintaan.");
    }
    if (error instanceof ClientError) {
      return sendResponse(error.statusCode, error.message);
    }
    console.log(error);
    return sendResponse(500, "Terjadi kesalahan pada server");
  }
}
