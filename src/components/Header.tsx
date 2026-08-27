"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/context/context";
import {
  Menu,
  Bell,
  ChevronDown,
  User as UserIcon,
  Languages,
  LogOut,
} from "lucide-react";

function getProfilePath() {
  return "/profile";
}

type ProfileDataType = {
  nama?: string;
  nama_lengkap?: string;
  avatar?: string;
  [key: string]: unknown;
};

export function Header() {
  const { user, sidebarCollapsed, setSidebarCollapsed, logout, requestNavigation, registeredProfile } = useAppContext();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const [dbProfile, setDbProfile] = useState<{name?: string; avatar?: string} | null>(null);

useEffect(() => {
    const fetchHeaderProfile = async () => {
      try {
        const res = await fetch('/api/profil');
        if (res.ok) {
          const data = (await res.json()) as ProfileDataType;
          setDbProfile({
            name: (data.namaLengkap || data.nama_lengkap || data.nama) as string | undefined,
            avatar: data.avatar as string | undefined
          });
        }
      } catch (error) {
        console.error("Gagal ambil data header:", error);
      }
    };
    fetchHeaderProfile();
  }, [registeredProfile]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
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
    user.name || 
    "Pengguna";

  const displayAvatar = 
    typedRegisteredProfile?.avatar || 
    dbProfile?.avatar || 
    user.avatar;

  return (
    <header className={`sticky top-0 z-40 h-20 bg-[#F8F9FC]/95 backdrop-blur-md border-b border-slate-200 px-6 flex justify-between items-center w-full transition-all duration-300 md:pl-24 ${sidebarCollapsed ? "lg:pl-24" : "lg:pl-76"}`}>
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
            className="text-slate-500 hover:text-slate-900 p-2 hover:bg-slate-200/50 rounded-full transition-all relative"
          >
            <Bell size={19} className="stroke-2" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#84CC16] rounded-full border border-slate-200"></span>
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden z-50">
              <div className="p-3 border-b border-gray-100 flex justify-between items-center bg-slate-50">
                <h3 className="font-bold text-sm text-slate-900">Notifikasi</h3>
                <button className="text-xs text-[#008BE3] hover:underline font-medium">
                  Tandai dibaca
                </button>
              </div>
              <div className="max-h-75 overflow-y-auto">
                <div className="p-4 text-center text-sm text-slate-500">
                  Belum ada notifikasi baru.
                </div>
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
                width={32}
                height={32}
                className="w-8 h-8 rounded-lg object-cover shadow-xs"
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
            <div className={`text-slate-400 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}>
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
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#008BE3] flex items-center gap-3 transition-colors">
                <Languages size={16} /> Indonesia
              </button>
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