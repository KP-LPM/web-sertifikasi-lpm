"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/context/context";
import {
  Menu,
  Bell,
  ChevronDown,
  User as UserIcon,
  LogOut,
} from "lucide-react";
import { getUsersProfile, getPengajuanList, getJadwalList } from "@/lib/api";

function getProfilePath() {
  return "/profile";
}

type ProfileDataType = {
  nama?: string;
  nama_lengkap?: string;
  avatar?: string;
  [key: string]: unknown;
};

interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  unread: boolean;
  link?: string;
}

export function Header() {
  const {
    user,
    sidebarCollapsed,
    setSidebarCollapsed,
    logout,
    requestNavigation,
    registeredProfile,
  } = useAppContext();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const [dbProfile, setDbProfile] = useState<{
    name?: string;
    avatar?: string;
  } | null>(null);

  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchHeaderProfile = async () => {
      const userId = Number(user?.id);
      if (!userId) return;
      try {
        const response = await getUsersProfile(userId);

        // Antisipasi jika kembalian berupa array atau single object
        const data = (Array.isArray(response) ? response[0] : response) as
          Record<string, unknown> | undefined;

        if (!data) return;

        setDbProfile({
          name: (data.nama || data.nama_lengkap) as string,
          avatar: data.avatar as string,
        });
      } catch (error) {
        console.error("Gagal ambil data header:", error);
      }
    };
    fetchHeaderProfile();
  }, [user?.id]);

  useEffect(() => {
    let isMounted = true;
    async function loadNotifications() {
      if (!user) return;
      try {
        const notifs: AppNotification[] = [];
        if (user.role === "asesi") {
          const pengajuan = await getPengajuanList({ userId: Number(user.id) });
          if (Array.isArray(pengajuan)) {
            pengajuan.slice(0, 5).forEach((p: Record<string, unknown>) => {
              const skema = p.skema as Record<string, unknown> | undefined;
              const skemaName =
                (skema?.nama as string) ||
                (skema?.namaSkema as string) ||
                "Skema Sertifikasi";
              const statusStr = (p.status as string) || "Menunggu Verifikasi";
              notifs.push({
                id: `pengajuan-${p.id}`,
                title: "Pengajuan Skema",
                message: `${skemaName} berstatus: ${statusStr}`,
                time: p.updatedAt
                  ? new Date(p.updatedAt as string).toLocaleDateString("id-ID")
                  : "Baru saja",
                unread: statusStr !== "Ditolak",
                link: "/asesi/riwayatasesmen",
              });
            });
          }
        } else if (user.role === "asesor") {
          const jadwal = await getJadwalList();
          if (Array.isArray(jadwal)) {
            jadwal.slice(0, 5).forEach((j: Record<string, unknown>) => {
              notifs.push({
                id: `jadwal-${j.id}`,
                title: "Jadwal Asesmen",
                message: `${(j.namaBatch as string) || (j.kodeBatch as string) || "Batch Asesmen"} (${(j.skema as string) || "Skema"})`,
                time: j.tanggal
                  ? new Date(j.tanggal as string).toLocaleDateString("id-ID")
                  : "Mendatang",
                unread: true,
                link: "/assessor/daftarasesmen",
              });
            });
          }
        }
        if (isMounted) {
          setNotifications(notifs);
          setUnreadCount(notifs.filter((n) => n.unread).length);
        }
      } catch (err) {
        console.warn("Gagal memuat notifikasi:", err);
      }
    }
    loadNotifications();
    return () => {
      isMounted = false;
    };
  }, [user?.id, user?.role]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
      if (
        notifRef.current &&
        !notifRef.current.contains(event.target as Node)
      ) {
        setIsNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return null;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const typedRegisteredProfile = registeredProfile as ProfileDataType | null;

  const displayName =
    typedRegisteredProfile?.nama ||
    typedRegisteredProfile?.nama_lengkap ||
    dbProfile?.name ||
    user.username ||
    "Pengguna";

  const displayAvatar =
    typedRegisteredProfile?.avatar || dbProfile?.avatar || user.avatar;

  const handleMarkAllAsRead = () => {
    setUnreadCount(0);
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  return (
    <header
      className={`sticky top-0 z-40 h-20 bg-[#F8F9FC]/95 backdrop-blur-md border-b border-slate-200 px-6 flex justify-between items-center w-full transition-all duration-300 md:pl-24 ${sidebarCollapsed ? "lg:pl-24" : "lg:pl-76"}`}
    >
      {/* Left: Hamburger menu for mobile */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="md:hidden text-slate-500 hover:text-slate-900 p-1.5 hover:bg-slate-200/50 rounded-lg"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Right: Notification Bell, Initial-based Avatar Card */}
      <div className="flex items-center gap-4 sm:gap-6">
        {/* Bell Icon */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="text-slate-500 hover:text-slate-900 p-2 hover:bg-slate-200/50 rounded-full transition-all relative cursor-pointer"
          >
            <Bell size={19} className="stroke-2" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#84CC16] rounded-full border border-slate-200 animate-pulse"></span>
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="p-3 border-b border-gray-100 flex justify-between items-center bg-slate-50">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-slate-900">Notifikasi</h3>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-xs text-[#008BE3] hover:underline font-medium cursor-pointer"
                  >
                    Tandai dibaca
                  </button>
                )}
              </div>
              <div className="max-h-75 overflow-y-auto divide-y divide-gray-50">
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        if (n.link) {
                          setIsNotifOpen(false);
                          router.push(n.link);
                        }
                      }}
                      className={`p-3 text-xs hover:bg-slate-50 transition-colors cursor-pointer ${n.unread ? "bg-blue-50/40" : ""}`}
                    >
                      <div className="flex items-center justify-between font-semibold text-slate-800 mb-1">
                        <span>{n.title}</span>
                        <span className="text-[10px] text-slate-400 font-normal">
                          {n.time}
                        </span>
                      </div>
                      <p className="text-slate-600 line-clamp-2 leading-relaxed">
                        {n.message}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="p-5 text-center text-xs text-slate-500">
                    Belum ada notifikasi baru.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Card */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2.5 pl-2 border-l border-slate-200 cursor-pointer hover:bg-slate-100 rounded-lg p-1 pr-2 transition-colors"
          >
            {displayAvatar ? (
              <img
                src={displayAvatar}
                alt="Avatar"
                width={30}
                height={30}
                className="w-8 h-8 rounded-xl object-cover shadow-xs"
              />
            ) : (
              <div className="w-8 h-8 rounded-lg bg-[#E6F4FF] text-[#008BE3] flex items-center justify-center font-extrabold text-xs shadow-xs">
                {getInitials(displayName)}
              </div>
            )}
            <div className="hidden md:flex flex-col items-start">
              <span className="text-xs font-black text-slate-900 leading-none">
                {displayName}
              </span>
              <span className="text-[9px] text-slate-500 font-bold tracking-wider uppercase mt-0.5">
                {user.role}
              </span>
            </div>
            <div
              className={`text-slate-400 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
            >
              <ChevronDown size={14} />
            </div>
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50">
              <button
                onClick={() => {
                  setIsDropdownOpen(false);
                  requestNavigation(() => router.push(getProfilePath()));
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#008BE3] flex items-center gap-3 transition-colors"
              >
                <UserIcon size={16} /> Profile
              </button>
              {/* <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#008BE3] flex items-center gap-3 transition-colors">
                <Languages size={16} /> Indonesia
              </button> */}
              <div className="h-px bg-gray-100 my-1 mx-2"></div>
              <button
                onClick={logout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors font-medium"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
