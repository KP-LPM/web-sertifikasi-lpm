import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { userService } from "@/services/user.service";
import { ClientError } from "@/error/index";
import { sendResponse } from "@/lib/response";
import { rateLimitApi, RateLimitError } from "@/lib/rate-limit";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    rateLimitApi(request, {
      limit: 20,
      windowMs: 60 * 1000,
      key: "patch-user-verifikasi",
    });

    const { id } = await params;
    const userId = Number(id);

    if (!id || isNaN(userId)) {
      return sendResponse(400, "ID parameter is required");
    }

    const body = await request.json();
    const isVerified =
      typeof body.isVerified === "boolean"
        ? body.isVerified
        : body.action === "tolak"
          ? false
          : true;

    const updatedUser = await userService.updateUserVerifyStatus(userId, {
      isVerified,
    });

    revalidatePath("/api/users");

    return sendResponse(200, "Status berhasil diperbarui", {
      isVerified: updatedUser.isVerified,
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

export const POST = PATCH;

