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

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Password saat ini wajib diisi"),
    confirmCurrentPassword: z.string().min(1, "Konfirmasi password saat ini wajib diisi"),
    newPassword: z.string().min(8, "Password baru minimal 8 karakter"),
  })
  .refine((data) => data.currentPassword === data.confirmCurrentPassword, {
    message: "Konfirmasi password saat ini tidak cocok",
    path: ["confirmCurrentPassword"],
  });

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
