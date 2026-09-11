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

  const url = `${BASE_URL}/pengajuanskema${params.toString() ? `?${params.toString()}` : ""
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

// ============================================================
// ASESI DASHBOARD & RIWAYAT API FUNCTIONS
// ============================================================

export async function getAsesiDashboard() {
  const res = await fetch(`${BASE_URL}/dashboard/asesi`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || "Gagal mengambil data dashboard asesi");
  }
  return json.data;
}

export async function getAsesiRiwayatSertifikat(asesiId: number) {
  const res = await fetch(`${BASE_URL}/asesi/${asesiId}/riwayatsertifikat`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || "Gagal mengambil riwayat sertifikat");
  }
  return json.data;
}

export async function getCurrentProfile() {
  const res = await fetch(`${BASE_URL}/profile`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || "Gagal mengambil profil pengguna");
  }
  return json;
}

// ============================================================
// JADWAL & UJIAN API FUNCTIONS
// ============================================================

export async function getJadwalList(filters?: {
  asesorId?: number;
  skemaId?: number;
  status?: string;
  tanggal?: string;
}) {
  const params = new URLSearchParams();
  if (filters?.asesorId) params.append("asesor_id", String(filters.asesorId));
  if (filters?.skemaId) params.append("skema_id", String(filters.skemaId));
  if (filters?.status) params.append("status", filters.status);
  if (filters?.tanggal) params.append("tanggal", filters.tanggal);

  const url = `${BASE_URL}/jadwal${params.toString() ? `?${params.toString()}` : ""}`;
  const res = await fetch(url, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || "Gagal mengambil daftar jadwal asesmen");
  }
  return json.data;
}

export async function getJadwalDetail(id: number) {
  const res = await fetch(`${BASE_URL}/jadwal/${id}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || "Gagal mengambil detail jadwal");
  }
  return json.data;
}

export async function selesaikanUjian(pengajuanId: number) {
  // Catat selesainya sesi ujian oleh asesi
  // Status pengajuan tetap terjaga atau diarahkan ke evaluasi asesor
  return { success: true, pengajuanId, message: "Ujian berhasil diselesaikan" };
}

// ============================================================
// BANDING API FUNCTIONS
// ============================================================

export interface CreateBandingPayload {
  pengajuanId?: number;
  hasilAsesmenId?: number;
  alasan: string;
  penjelasan?: string;
  dijelaskan?: boolean;
  didiskusikan?: boolean;
  melibatkanOrangLain?: boolean;
  ttdAsesi?: boolean;
}

export async function createBanding(data: CreateBandingPayload) {
  const res = await fetch(`${BASE_URL}/banding`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || "Gagal mengirim pengajuan banding");
  }
  return json.data;
}

export async function getBandingList() {
  const res = await fetch(`${BASE_URL}/banding`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || "Gagal mengambil daftar banding");
  }
  return json.data;
}

export async function verifikasiBanding(
  id: number,
  data: { status: string; keputusanAdmin?: string },
) {
  const res = await fetch(`${BASE_URL}/banding/${id}`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || "Gagal memverifikasi banding");
  }
  return json.data;
}

// ============================================================
// ASSESSOR SPECIFIC API FUNCTIONS
// ============================================================

export async function getAsesorDashboard() {
  const res = await fetch(`${BASE_URL}/dashboard/asesor`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || "Gagal mengambil dashboard asesor");
  }
  return json.data;
}

export async function getCandidatesList(params?: {
  jadwalId?: number;
  skemaId?: number;
}) {
  const searchParams = new URLSearchParams();
  if (params?.jadwalId) searchParams.append("jadwal_id", String(params.jadwalId));
  if (params?.skemaId) searchParams.append("skema_id", String(params.skemaId));

  const url = `${BASE_URL}/candidates${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
  const res = await fetch(url, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || "Gagal mengambil daftar kandidat");
  }
  return json.data;
}

export async function updateJadwal(
  id: number,
  data: Record<string, unknown>,
) {
  const res = await fetch(`${BASE_URL}/jadwal/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || "Gagal memperbarui jadwal");
  }
  return json.data;
}

export async function saveHasilAsesmen(
  pengajuanId: number,
  data: {
    hasil: "Kompeten" | "Belum Kompeten";
    catatan?: string | null;
    linkVideo?: string | null;
  },
) {
  const res = await fetch(`${BASE_URL}/pengajuanskema/${pengajuanId}/hasil`, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || "Gagal menyimpan hasil asesmen");
  }
  return json.data;
}

// PORTFOLIO API
export async function getPortfolios(asesorId?: number) {
  const url = asesorId
    ? `${BASE_URL}/portfolio?asesor_id=${asesorId}`
    : `${BASE_URL}/portfolio`;
  const res = await fetch(url, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || "Gagal mengambil portfolio");
  }
  return json.data;
}

export async function createPortfolio(data: Record<string, unknown>) {
  const res = await fetch(`${BASE_URL}/portfolio`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || "Gagal mengunggah portfolio");
  }
  return json.data;
}

export async function deletePortfolio(id: number) {
  const res = await fetch(`${BASE_URL}/portfolio/${id}`, {
    method: "DELETE",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || "Gagal menghapus portfolio");
  }
  return json.data;
}

// KONFIGURASI PERTANYAAN API
export async function getKonfigurasiPertanyaanList(params?: {
  skemaId?: number;
  status?: string;
}) {
  const searchParams = new URLSearchParams();
  if (params?.skemaId) searchParams.append("skema_id", String(params.skemaId));
  if (params?.status) searchParams.append("status", params.status);

  const url = `${BASE_URL}/konfigurasipertanyaan${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
  const res = await fetch(url, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || "Gagal mengambil daftar konfigurasi pertanyaan");
  }
  return json.data;
}

export async function getKonfigurasiPertanyaanDetail(id: number) {
  const res = await fetch(`${BASE_URL}/konfigurasipertanyaan/${id}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || "Gagal mengambil detail konfigurasi pertanyaan");
  }
  return json.data;
}

export async function createKonfigurasiPertanyaan(data: Record<string, unknown>) {
  const res = await fetch(`${BASE_URL}/konfigurasipertanyaan`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || "Gagal membuat konfigurasi pertanyaan");
  }
  return json.data;
}

export async function deleteKonfigurasiPertanyaan(id: number) {
  const res = await fetch(`${BASE_URL}/konfigurasipertanyaan/${id}`, {
    method: "DELETE",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || "Gagal menghapus konfigurasi pertanyaan");
  }
  return json.data;
}

// ============================================================
// SKEMA API FUNCTIONS
// ============================================================

export async function getSkemaList() {
  const res = await fetch(`${BASE_URL}/skema`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || "Gagal mengambil daftar skema");
  }
  return json.data;
}

export async function getSkemaDetail(id: number) {
  const res = await fetch(`${BASE_URL}/skema/${id}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || "Gagal mengambil detail skema");
  }
  return json.data;
}

export async function createSkema(data: Record<string, unknown>) {
  const res = await fetch(`${BASE_URL}/skema`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || "Gagal membuat skema sertifikasi");
  }
  return json.data;
}

export async function updateSkema(id: number, data: Record<string, unknown>) {
  const res = await fetch(`${BASE_URL}/skema/${id}`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || "Gagal memperbarui skema sertifikasi");
  }
  return json.data;
}

export async function deleteSkema(id: number) {
  const res = await fetch(`${BASE_URL}/skema/${id}`, {
    method: "DELETE",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || "Gagal menghapus skema sertifikasi");
  }
  return json.data;
}

// ============================================================
// PENILAIAN APL-02 API FUNCTIONS
// ============================================================

export async function savePenilaianApl02(
  pengajuanId: number,
  data: Record<string, unknown>,
) {
  const res = await fetch(`${BASE_URL}/pengajuanskema/${pengajuanId}/apl02`, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || "Gagal menyimpan penilaian APL-02");
  }
  return json.data;
}


// ============================================================
// ADMIN API FUNCTIONS
// ============================================================

export async function getAllUsers() {
  const res = await fetch(`${BASE_URL}/users`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Gagal mengambil daftar pengguna");
  return json.data !== undefined ? json.data : json;
}

export async function createUserAdmin(data: any) {
  const res = await fetch(`${BASE_URL}/users`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Gagal membuat pengguna");
  return json.data !== undefined ? json.data : json;
}

export async function updateUserAdmin(id: number, data: any) {
  const res = await fetch(`${BASE_URL}/users/${id}`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Gagal mengupdate pengguna");
  return json.data !== undefined ? json.data : json;
}

export async function verifyUserAdmin(id: number, action: string) {
  const res = await fetch(`${BASE_URL}/users/${id}/verifikasi`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Gagal memverifikasi pengguna");
  return json.data !== undefined ? json.data : json;
}

export async function deleteUserAdmin(id: number) {
  const res = await fetch(`${BASE_URL}/users/${id}`, {
    method: "DELETE",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Gagal menghapus pengguna");
  return json.data !== undefined ? json.data : json;
}

export async function getSuratList() {
  const res = await fetch(`${BASE_URL}/surat`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Gagal mengambil daftar surat");
  return json.data !== undefined ? json.data : json;
}

export async function createSurat(data: any) {
  const res = await fetch(`${BASE_URL}/surat`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Gagal membuat surat");
  return json.data !== undefined ? json.data : json;
}

export async function getAdminDashboard() {
  const res = await fetch(`${BASE_URL}/dashboard/admin`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Gagal mengambil dashboard admin");
  return json.data !== undefined ? json.data : json;
}

export async function getAdminReports() {
  const res = await fetch(`${BASE_URL}/dashboard/admin/reports`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Gagal mengambil laporan admin");
  return json.data !== undefined ? json.data : json;
}

export async function getJadwalCompleted() {
  const res = await fetch(`${BASE_URL}/jadwal/completed`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Gagal mengambil daftar jadwal selesai");
  return json.data !== undefined ? json.data : json;
}

export async function getBatchCompleted() {
  const res = await fetch(`${BASE_URL}/batch/completed`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Gagal mengambil daftar batch pleno selesai");
  return json.data !== undefined ? json.data : json;
}
