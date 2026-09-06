// app/api/auth/reset-password/route.ts
import { NextRequest } from "next/server";
import { z } from "zod";
import { resetPasswordSchema } from "@/schemas/auth.schema";
import { authService } from "@/services/auth.service";
import { ClientError } from "@/error/index";
import { sendResponse } from "@/lib/response";
import { rateLimitApi, RateLimitError } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    rateLimitApi(request, {
      limit: 5,
      windowMs: 60 * 1000,
      key: "post-auth-reset-password",
    });

    const body = await request.json();
    const data = resetPasswordSchema.parse(body);

    const result = await authService.resetPassword(data);
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
    console.error("Reset password error:", error);
    return sendResponse(500, "Terjadi kesalahan, coba lagi nanti.");
  }
}
