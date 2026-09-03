import { User } from "@prisma/client";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const getAuthHeaders = () => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") || "" : "";
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
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
