// app/api/auth/verify-otp/route.ts
import { NextRequest } from "next/server";
import { z } from "zod";
import { verifyOtpSchema } from "@/schemas/auth.schema";
import { authService } from "@/services/auth.service";
import { ClientError } from "@/error/index";
import { sendResponse } from "@/lib/response";
import { rateLimitApi, RateLimitError } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    rateLimitApi(request, {
      limit: 5,
      windowMs: 60 * 1000,
      key: "post-auth-verify-otp",
    });

    const body = await request.json();
    const data = verifyOtpSchema.parse(body);

    const result = await authService.verifyOtp(data);
    return sendResponse(200, result.message, { resetToken: result.resetToken });
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
    console.error("Verify OTP error:", error);
    return sendResponse(500, "Terjadi kesalahan, coba lagi nanti.");
  }
}
