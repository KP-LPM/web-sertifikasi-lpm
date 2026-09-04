import { NextRequest } from "next/server";
import { z } from "zod";
import { forgotPasswordSchema } from "@/schemas/auth.schema"; // ganti dari verifyOtpSchema
import { authService } from "@/services/auth.service";
import { sendResponse } from "@/lib/response";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = forgotPasswordSchema.parse(body); // hapus "as string", ganti schema

    const result = await authService.forgotPassword(data); // panggil forgotPassword, bukan verifyOtp
    return sendResponse(200, result.message);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return sendResponse(400, "Email tidak valid");
    }
    console.error("Forgot password error:", error);
    return sendResponse(500, "Terjadi kesalahan, coba lagi nanti.");
  }
}
