import { User } from "@prisma/client";
import type { RegisterPayload } from "@/types/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

export const getAuthHeaders = () => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") || "" : "";
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export async function getUsersProfile(id: number): Promise<User[]> {
  const res = await fetch(`/api/users/${id}/profile`, {
    credentials: "include",
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

// ============================================================
// PENGAJUAN SKEMA API FUNCTIONS
// ============================================================

import type {
  CreatePengajuanDTO,
  UpdatePengajuanDTO,
  UploadDokumenDTO,
  SubmitAsesmenMandiriDTO,
  PenilaianAsesorMandiriDTO,
} from "@/schemas/pengajuanskema.schema";
import type { PengajuanPayload } from "@/types/types";

export async function getPengajuanList(filters?: {
  skemaId?: number;
  status?: string;
  search?: string;
  userId?: number;
}) {
  const params = new URLSearchParams();
  if (filters?.skemaId) params.append("skema_id", String(filters.skemaId));
  if (filters?.status && filters.status !== "Semua")
    params.append("status", filters.status);
  if (filters?.search) params.append("search", filters.search);
  if (filters?.userId) params.append("user_id", String(filters.userId));

  const url = `${BASE_URL}/pengajuanskema${
    params.toString() ? `?${params.toString()}` : ""
  }`;
  const res = await fetch(url, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || "Gagal mengambil daftar pengajuan skema");
  }
  return json.data;
}

export async function getPengajuanDetail(id: number) {
  const res = await fetch(`${BASE_URL}/pengajuanskema/${id}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || "Gagal mengambil detail pengajuan skema");
  }
  return json.data;
}

export async function createPengajuan(
  data: PengajuanPayload | CreatePengajuanDTO | Record<string, unknown>,
) {
  const res = await fetch(`${BASE_URL}/pengajuanskema`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || "Gagal mengajukan skema sertifikasi");
  }
  return json.data;
}

export async function updatePengajuan(id: number, data: UpdatePengajuanDTO) {
  const res = await fetch(`${BASE_URL}/pengajuanskema/${id}`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || "Gagal memperbarui pengajuan skema");
  }
  return json.data;
}

export async function deletePengajuan(id: number) {
  const res = await fetch(`${BASE_URL}/pengajuanskema/${id}`, {
    method: "DELETE",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || "Gagal membatalkan pengajuan skema");
  }
  return json.data;
}

export async function updatePengajuanStatus(id: number, status: string) {
  const res = await fetch(`${BASE_URL}/pengajuanskema/${id}/status`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || "Gagal memperbarui status pengajuan");
  }
  return json.data;
}

export async function uploadDokumenPengajuan(
  id: number,
  dokumen: UploadDokumenDTO,
) {
  const res = await fetch(`${BASE_URL}/pengajuanskema/${id}/dokumen`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dokumen),
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || "Gagal mengunggah dokumen pengajuan");
  }
  return json.data;
}

export async function deleteDokumenPengajuan(id: number, dokId: number) {
  const res = await fetch(
    `${BASE_URL}/pengajuanskema/${id}/dokumen/${dokId}`,
    {
      method: "DELETE",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    },
  );

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || "Gagal menghapus dokumen pengajuan");
  }
  return json.data;
}

export async function submitAsesmenMandiri(
  id: number,
  data: SubmitAsesmenMandiriDTO,
) {
  const res = await fetch(`${BASE_URL}/pengajuanskema/${id}/asesmen-mandiri`, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(
      json.message || "Gagal menyimpan checklist asesmen mandiri",
    );
  }
  return json.data;
}

export async function updatePenilaianAsesorUnit(
  id: number,
  unitId: number,
  data: PenilaianAsesorMandiriDTO,
) {
  const res = await fetch(
    `${BASE_URL}/pengajuanskema/${id}/asesmen-mandiri/${unitId}`,
    {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    },
  );

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || "Gagal menyimpan penilaian asesor");
  }
  return json.data;
}
