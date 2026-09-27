import crypto from "crypto";
import bcrypt from "bcryptjs";
import { JenisKelamin, Role } from "@prisma/client";
import {
  profileRepository,
  ProfileRepository,
} from "@/repositories/profile.repository";

import type { RegisterPayload } from "@/types/types";
import type {
  ForgotPasswordInput,
  ResetPasswordInput,
  VerifyOtpInput,
} from "@/schemas/auth.schema";
import { userRepository } from "@/repositories/user.repository";
import { transporter } from "@/lib/nodemailer";
import { render } from "@react-email/components";
import { InvariantError } from "@/error";
import OtpEmail from "@/components/emails/OtpEmail";
import { supabase } from "@/lib/supabase";

export class ValidationError extends Error {
  statusCode = 400;
}
export class ConflictError extends Error {
  statusCode = 409;
}

export class AuthService {
  constructor(private repo: ProfileRepository = profileRepository) {}

  async register(payload: RegisterPayload) {
    const {
      username,
      email,
      password,
      role,
      nik,
      nama_lengkap,
      tempat_lahir,
      tanggal_lahir,
      jenis_kelamin,
      no_hp,
      pekerjaan,
      kewarganegaraan,
      nomor_registrasi_met,
      pendidikan_terakhir,
      alamat_wilayah,
      tanda_tangan,
    } = payload;

    if (!username || !email || !password || !role || !nik || !nama_lengkap) {
      throw new ValidationError("Data wajib belum lengkap!");
    }

    if (role === "asesor") {
      if (!nomor_registrasi_met || !pendidikan_terakhir) {
        throw new ValidationError("Data khusus Asesor wajib diisi!");
      }
    } else if (role === "asesi") {
      if (!kewarganegaraan) {
        throw new ValidationError("Data khusus Asesi wajib diisi!");
      }
    }

    const existing = await this.repo.findUserByUsernameOrEmail(username, email);
    if (existing) {
      throw new ConflictError("Username/Email sudah terdaftar.");
    }

    const existingNik = await this.repo.findProfileByNik(nik);
    if (existingNik) {
      throw new ConflictError("NIK sudah terdaftar di sistem.");
    }

    let finalSignatureUrl = tanda_tangan || null;

    if (tanda_tangan && tanda_tangan.startsWith("data:image")) {
      try {
        const fetchResponse = await fetch(tanda_tangan);
        const blob = await fetchResponse.blob();
        const signatureFileName = `signature-${Date.now()}-${crypto.randomBytes(4).toString("hex")}.png`;

        const { error: signatureUploadError } = await supabase.storage
          .from("signatures")
          .upload(signatureFileName, blob);

        if (signatureUploadError) {
          throw new Error("Gagal upload tanda tangan: " + signatureUploadError.message);
        }

        const { data: signatureUrlData } = supabase.storage
          .from("signatures")
          .getPublicUrl(signatureFileName);

        finalSignatureUrl = signatureUrlData.publicUrl;
      } catch (err) {
        throw new Error("Terjadi kesalahan saat memproses tanda tangan: " + (err instanceof Error ? err.message : String(err)));
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const mappedJenisKelamin = (
      jenis_kelamin === "Laki-laki" ? "Laki_laki" : "Perempuan"
    ) as JenisKelamin;

    return await this.repo.registerWithProfile(
      {
        username,
        email,
        password: hashedPassword,
        role: role as Role,
      },
      {
        nik,
        namaLengkap: nama_lengkap,
        tempatLahir: tempat_lahir || "-",
        tanggalLahir: tanggal_lahir ? new Date(tanggal_lahir) : new Date(),
        jenisKelamin: mappedJenisKelamin,
        noHp: no_hp || "-",
        pekerjaan: pekerjaan || "-",
        kewarganegaraan: role === "asesi" ? kewarganegaraan : null,
        nomorRegistrasiMet: role === "asesor" ? nomor_registrasi_met : null,
        pendidikanTerakhir: role === "asesor" ? pendidikan_terakhir : null,
        alamat: role === "asesor" ? (alamat_wilayah || "-") : null,
        tandaTangan: finalSignatureUrl,
      },
    );
  }

  async forgotPassword(data: ForgotPasswordInput) {
    const user = await userRepository.getUserByEmail(data.email);

    if (!user) {
      return { message: "Kode OTP terkirim." };
    }

    // OTP 6 digit, cryptographically secure (bukan Math.random)
    const otp = crypto.randomInt(100000, 999999).toString();
    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");
    const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 menit — lebih pendek dari link, karena OTP lebih gampang ditebak

    await userRepository.setResetToken(user.id, hashedOtp, expiry);

    const html = await render(OtpEmail({ otp, expiryMinutes: 10 }));

    await transporter.sendMail({
      from: `"LSP UIN SGD" <${process.env.SMTP_USER}>`,
      to: user.email,
      subject: "Kode OTP Reset Password - LSP UIN SGD",
      html: html,
    });

    return { message: "Kode OTP terkirim." };
  }

  async verifyOtp(data: VerifyOtpInput) {
    const user = await userRepository.getUserByEmail(data.email);
    if (!user) {
      throw new InvariantError("Kode OTP tidak valid atau sudah kedaluwarsa.");
    }

    const hashedOtp = crypto
      .createHash("sha256")
      .update(data.otp)
      .digest("hex");
    const validUser = await userRepository.findByValidResetTokenForUser(
      user.id,
      hashedOtp,
    );

    if (!validUser) {
      throw new InvariantError("Kode OTP tidak valid atau sudah kedaluwarsa.");
    }

    // OTP valid — "tukar" jadi token sesi sementara buat langkah ganti
    // password. OTP langsung tidak berlaku lagi setelah ini (di-overwrite).
    const resetSessionToken = crypto.randomBytes(32).toString("hex");
    const hashedSessionToken = crypto
      .createHash("sha256")
      .update(resetSessionToken)
      .digest("hex");
    const sessionExpiry = new Date(Date.now() + 10 * 60 * 1000);

    await userRepository.setResetToken(
      user.id,
      hashedSessionToken,
      sessionExpiry,
    );

    return { resetToken: resetSessionToken, message: "Kode OTP valid." };
  }

  async resetPassword(data: ResetPasswordInput) {
    const hashedToken = crypto
      .createHash("sha256")
      .update(data.token)
      .digest("hex");

    const user = await userRepository.findByValidResetToken(hashedToken);
    if (!user) {
      throw new InvariantError(
        "Sesi reset password tidak valid, ulangi dari awal.",
      );
    }

    const hashedPassword = await bcrypt.hash(data.newPassword, 10);
    await userRepository.updatePasswordAndClearToken(user.id, hashedPassword);

    return { message: "Password berhasil direset. Silakan login." };
  }
}

export const authService = new AuthService();
