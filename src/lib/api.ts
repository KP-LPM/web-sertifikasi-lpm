// const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

// const getAuthHeaders = () => {
//   const token =
//     typeof window !== "undefined" ? localStorage.getItem("token") || "" : "";
//   return {
//     "Content-Type": "application/json",
//     Authorization: `Bearer ${token}`,
//   };
// };

// export async function getRuanganList(): Promise<Ruangan[]> {
//   const res = await fetch(`${BASE_URL}/ruangan`, {
//     method: "GET",
//     headers: getAuthHeaders(),
//   });

//   if (!res.ok) {
//     throw new Error("Gagal mengambil daftar ruangan");
//   }

//   const responseData = await res.json();
//   return responseData.data || responseData;
// }

// export async function getIndikatorList(): Promise<Indikator[]> {
//   const res = await fetch(`${BASE_URL}/indikator`, {
//     method: "GET",
//     headers: getAuthHeaders(),
//   });
//   if (!res.ok) throw new Error("Gagal mengambil data indikator");
//   const json = await res.json();
//   return json.data || json;
// }

// export async function createCeklis(payload: CeklisPayload): Promise<void> {
//   const res = await fetch(`${BASE_URL}/ceklis`, {
//     method: "POST",
//     headers: getAuthHeaders(),
//     body: JSON.stringify(payload),
//   });
//   if (!res.ok) {
//     const json = await res.json();
//     throw new Error(
//       json.message || "Gagal menyimpan data kebersihan dan limbah",
//     );
//   }
// }

// export async function createKualitasUdara(
//   payload: UdaraPayload,
// ): Promise<void> {
//   const res = await fetch(`${BASE_URL}/udara`, {
//     method: "POST",
//     headers: getAuthHeaders(),
//     body: JSON.stringify({
//       ...payload,
//       tanggal: payload.tanggal || new Date().toISOString(),
//     }),
//   });
//   if (!res.ok) {
//     const json = await res.json();
//     throw new Error(json.message || "Gagal menyimpan data kualitas udara");
//   }
// }

// export async function loginUser(payload: LoginPayload): Promise<LoginResponse> {
//   // 🟢 Fixed Path: BASE_URL + "/auth/login" (sehingga menjadi /api/auth/login)
//   const res = await fetch(`${BASE_URL}/auth/login`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(payload),
//   });

//   const responseData = await res.json();

//   if (!res.ok) {
//     throw new Error(responseData.message || "Gagal masuk ke sistem");
//   }

//   // 🟢 Standardisasi Key LocalStorage ("token" dan "user")
//   const accessToken =
//     responseData.data?.accessToken || responseData.data?.token;
//   if (accessToken) {
//     localStorage.setItem("token", accessToken);
//     localStorage.setItem("user", JSON.stringify(responseData.data.user));
//   }

//   return responseData.data;
// }

// export async function logoutUser(): Promise<void> {
//   try {
//     await fetch(`${BASE_URL}/auth/logout`, {
//       method: "POST",
//       headers: getAuthHeaders(),
//     });
//   } catch (err) {
//     console.error("Gagal melakukan logout di backend:", err);
//   } finally {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//   }
// }

// export async function getDashboardLimbahSummary(params?: {
//   startDate?: string;
//   endDate?: string;
//   ruanganId?: string;
// }) {
//   const query = new URLSearchParams();
//   if (params?.startDate) query.append("startDate", params.startDate);
//   if (params?.endDate) query.append("endDate", params.endDate);
//   if (params?.ruanganId && params.ruanganId !== "all") {
//     query.append("ruanganId", params.ruanganId);
//   }

//   const [limbahRes, ruanganRes] = await Promise.all([
//     fetch(`${BASE_URL}/limbah?${query.toString()}`, {
//       headers: getAuthHeaders(),
//     }),
//     fetch(`${BASE_URL}/ruangan`, { headers: getAuthHeaders() }),
//   ]);

//   if (!limbahRes.ok || !ruanganRes.ok) {
//     throw new Error("Gagal mengambil data summary dashboard");
//   }

//   const limbahJson = await limbahRes.json();
//   const ruanganJson = await ruanganRes.json();

//   return {
//     summary: (limbahJson.data || limbahJson) as DashboardLimbahResponse,
//     rooms: (ruanganJson.data || ruanganJson) as Ruangan[],
//   };
// }

// export async function getPeringatanDini(filter?: {
//   startDate?: string;
//   endDate?: string;
// }): Promise<PeringatanDiniItem[]> {
//   const query = new URLSearchParams();
//   if (filter?.startDate) query.append("startDate", filter.startDate);
//   if (filter?.endDate) query.append("endDate", filter.endDate);

//   const res = await fetch(`${BASE_URL}/ceklis?${query.toString()}`, {
//     headers: getAuthHeaders(),
//   });

//   if (!res.ok) {
//     throw new Error("Gagal mengambil data peringatan dini");
//   }

//   const responseData = await res.json();
//   return responseData.data || responseData;
// }

// export async function getKualitasUdaraData(params?: {
//   ruanganId?: string;
//   startDate?: string;
//   endDate?: string;
// }): Promise<KualitasUdaraItem[]> {
//   const query = new URLSearchParams();
//   if (params?.ruanganId && params.ruanganId !== "all") {
//     query.append("ruanganId", params.ruanganId);
//   }
//   if (params?.startDate) query.append("startDate", params.startDate);
//   if (params?.endDate) query.append("endDate", params.endDate);

//   const res = await fetch(`${BASE_URL}/udara?${query.toString()}`, {
//     headers: getAuthHeaders(),
//   });

//   if (!res.ok) {
//     throw new Error("Gagal mengambil data kualitas udara");
//   }

//   const responseData = await res.json();
//   return responseData.data || responseData;
// }

// export async function getUsers(): Promise<User[]> {
//   const res = await fetch(`${BASE_URL}/users`, {
//     headers: getAuthHeaders(),
//   });
//   if (!res.ok) throw new Error("Gagal mengambil data pengguna");
//   const json = await res.json();
//   return json.data || json;
// }

// export async function createUser(data: {
//   username: string;
//   password: string;
//   role?: string;
// }): Promise<User> {
//   const res = await fetch(`${BASE_URL}/users`, {
//     method: "POST",
//     headers: getAuthHeaders(),
//     body: JSON.stringify({
//       username: data.username,
//       password: data.password,
//       role: data.role || "PETUGAS",
//     }),
//   });
//   const json = await res.json();
//   if (!res.ok) throw new Error(json.message || "Gagal menambah pengguna");
//   return json.data;
// }

// export async function updateUserPassword(
//   id: string,
//   newPassword: string,
// ): Promise<void> {
//   const res = await fetch(`${BASE_URL}/users/${id}`, {
//     method: "PATCH",
//     headers: getAuthHeaders(),
//     body: JSON.stringify({ newPassword }),
//   });
//   if (!res.ok) {
//     const json = await res.json();
//     throw new Error(json.message || "Gagal memperbarui password");
//   }
// }

// export async function deleteUser(id: string): Promise<void> {
//   const res = await fetch(`${BASE_URL}/users/${id}`, {
//     method: "DELETE",
//     headers: getAuthHeaders(),
//   });
//   if (!res.ok) {
//     const json = await res.json();
//     throw new Error(json.message || "Gagal menghapus pengguna");
//   }
// }
