"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import React from "react";
import { useAppContext } from "@/context/context";

const ROLE_HOME: Record<string, string> = {
  admin: "/admin/overview",
  asesor: "/assessor/overview",
  asesi: "/asesi/overview",
  direktur: "/direktur/dashboard",
  manajer: "/direktur/dashboard",
};

export default function Page() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { user } = useAppContext();

  useEffect(() => {
    if (status === "loading") return;

    const currentUser = session?.user || user;

    if (status === "unauthenticated" || !currentUser || !currentUser.role) {
      router.replace("/login");
      return;
    }

    const target = ROLE_HOME[currentUser.role] ?? "/login";
    router.replace(target);
  }, [status, session, user, router]);
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F9FC]">
      <p className="text-sm text-slate-500">Mengalihkan...</p>
    </div>
  );
}
