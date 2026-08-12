"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import React from "react";
import { useAppContext } from "@/context/context";

// Peta role -> halaman dashboard tujuan.
// Sesuaikan path ini dengan struktur folder route kamu yang sebenarnya.
const ROLE_HOME: Record<string, string> = {
  admin: "/admin/overview",
  asesor: "/assessor/overview",
  asesi: "/asesi/overview",
  direktur: "/direktur/dashboard",
  manajer: "/direktur/dashboard",
};

export default function Page() {
  const router = useRouter();
  const { status } = useSession();
  const { user } = useAppContext();

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated" || !user || !user.role) {
      router.replace("/login");
      return;
    }

    const target = ROLE_HOME[user.role] ?? "/login";
    router.replace(target);
  }, [status, user, router]);
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F9FC]">
      <p className="text-sm text-slate-500">Mengalihkan...</p>
    </div>
  );
}
