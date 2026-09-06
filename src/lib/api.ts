import { User } from "@prisma/client";

export async function getUsersProfile(id: number): Promise<User[]> {
  const res = await fetch(`/api/users/${id}/profile`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Gagal mengambil data profile");
  const json = await res.json();
  return json.data || json;
}
