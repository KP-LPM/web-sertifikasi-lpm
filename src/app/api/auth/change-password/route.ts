// app/api/auth/change-password/route.ts
import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { z } from "zod";
import { changePasswordSchema } from "@/schemas/auth.schema";
import { authService } from "@/services/auth.service";
import { ClientError } from "@/error/index";
import { sendResponse } from "@/lib/response";
import { rateLimitApi, RateLimitError } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    rateLimitApi(request, {
      limit: 10,
      windowMs: 60 * 1000,
      key: "post-auth-change-password",
    });

    const token = await getToken({ req: request });
    if (!token) {
      return sendResponse(401, "Akses ditolak, silakan login terlebih dahulu.");
    }

    const userId = Number(token.id || token.sub);
    if (!userId) {
      return sendResponse(401, "Sesi tidak valid.");
    }

    const body = await request.json();
    const data = changePasswordSchema.parse(body);

    const result = await authService.changePassword(userId, data);
    return sendResponse(200, result.message);
  } catch (error) {
    if (error instanceof RateLimitError) {
      return sendResponse(error.status, "Terlalu banyak permintaan.");
    }
    if (error instanceof z.ZodError) {
      return sendResponse(400, "Data tidak valid: " + error.message);
    }
    if (error instanceof ClientError) {
      return sendResponse(error.statusCode, error.message);
    }
    console.error("Change password error:", error);
    return sendResponse(500, "Terjadi kesalahan, coba lagi nanti.");
  }
}
