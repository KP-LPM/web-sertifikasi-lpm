import { User } from "@prisma/client";
import type { RegisterPayload } from "@/types/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

const getAuthHeaders = () => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") || "" : "";
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export async function getUsersProfile(id: number): Promise<User[]> {
  const res = await fetch(`${BASE_URL}/users/${id}/profile`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Gagal mengambil data profile");
  const json = await res.json();
  return json.data || json;
}

export async function registerUsers(
  data: RegisterPayload,
): Promise<{ message: string; user?: User }> {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || "Gagal melakukan regi strasi");
  }

  return json;
}

export async function forgotPassword(
  email: string,
): Promise<{ message: string }> {
  const res = await fetch(`${BASE_URL}/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || "Gagal mengirim instruksi reset password");
  }

  return json;
}

export async function verifyOtp(
  email: string,
  otp: string,
): Promise<{ message: string; resetToken: string }> {
  const res = await fetch(`${BASE_URL}/auth/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp }),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || "Kode OTP tidak valid");
  }

  // Sesuaikan bagian ini dengan bentuk asli response sendResponse() kamu —
  // kalau dibungkus { message, data: { resetToken } }, ambil dari json.data.resetToken
  return {
    message: json.message,
    resetToken: json.data?.resetToken || json.resetToken,
  };
}

export async function resetPassword(
  token: string,
  newPassword: string,
): Promise<{ message: string }> {
  const res = await fetch(`${BASE_URL}/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, newPassword }),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || "Gagal mereset password");
  }

  return json;
}
