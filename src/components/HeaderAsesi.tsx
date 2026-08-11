"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useAppContext } from "@/context/context";
import {
  Menu,
  Bell,
  ChevronDown,
  User as UserIcon,
  Languages,
  LogOut,
} from "lucide-react";
import Image from "next/image";

export default function HeaderAsesi() {
  const { user, sidebarCollapsed, setSidebarCollapsed, logout } =
    useAppContext();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      )
        setIsDropdownOpen(false);
      if (notifRef.current && !notifRef.current.contains(event.target as Node))
        setIsNotifOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return null;

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

  return (
    <header className="sticky top-0 z-40 h-20 bg-[#F8F9FC]/95 backdrop-blur-md border-b border-slate-200 px-4 md:px-6 flex justify-between items-center w-full transition-all duration-300">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="md:hidden text-slate-500 hover:text-slate-900 p-1.5 hover:bg-slate-200/50 rounded-lg"
        >
          <Menu size={20} />
        </button>
      </div>

      <div className="flex items-center gap-4 sm:gap-6">
        {/* Notifikasi */}
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
              <div className="max-h-75 overflow-y-auto p-4 text-center text-sm text-slate-500">
                Belum ada notifikasi baru.
              </div>
            </div>
          )}
        </div>

        {/* Dropdown User */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2.5 pl-2 border-l border-slate-200 cursor-pointer hover:bg-slate-100 rounded-lg p-1 pr-2 transition-colors"
          >
            {user.avatar ? (
              <Image
                src={user.avatar}
                alt="Avatar"
                className="w-8 h-8 rounded-lg object-cover shadow-xs"
              />
            ) : (
              <div className="w-8 h-8 rounded-lg bg-[#E6F4FF] text-[#008BE3] flex items-center justify-center font-extrabold text-xs shadow-xs">
                {getInitials(user.name || "Oya")}
              </div>
            )}
            <div className="hidden md:flex flex-col items-start">
              <span className="text-xs font-black text-slate-900 leading-none">
                {user.name || "Oya"}
              </span>
              <span className="text-[9px] text-slate-500 font-bold tracking-wider uppercase mt-0.5">
                {user.role}
              </span>
            </div>
            <ChevronDown
              size={14}
              className={`text-slate-400 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
            />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50">
              <Link
                href="/asesi/profile"
                onClick={() => setIsDropdownOpen(false)}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#008BE3] flex items-center gap-3 transition-colors"
              >
                <UserIcon size={16} /> Profile
              </Link>
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
