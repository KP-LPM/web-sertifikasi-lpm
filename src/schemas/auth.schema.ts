import { z } from "zod";

export const forgotPasswordSchema = z.object({
  email: z.string().trim().min(1).email(),
});

export const verifyOtpSchema = z.object({
  email: z.string().trim().min(1).email(),
  otp: z.string().length(6, "Kode OTP harus 6 digit"),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1), // resetToken hasil dari verifyOtp, BUKAN OTP itu sendiri
  newPassword: z.string().min(8, "Password minimal 8 karakter"),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
