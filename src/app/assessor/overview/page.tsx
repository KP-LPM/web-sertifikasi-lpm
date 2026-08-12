"use client";
import React from "react";
import {
  Clock,
  CheckCircle,
  ChevronRight,
  FileText,
  LayoutDashboard,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/context/context";
import { Assessment, QueueItemProps, StatCardProps } from "@/types/types";

export default function AssessorOverview() {
  const router = useRouter();
  const { assessments } = useAppContext();

  // Get active assessments from assessments list (take top 3)
  const queueItems = (assessments || [])
    .filter((item: Assessment) => item.status !== "Selesai")
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-[#F8F9FC] p-4 md:p-8 space-y-6 pb-24 text-sm text-gray-700">
      {/* Page Title Section matching Appeals and History pages */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-lg bg-[#008BE3]/10 flex items-center justify-center text-[#008BE3] border border-[#008BE3]/20 shadow-xs shrink-0">
          <LayoutDashboard size={20} className="stroke-[2.5]" />
        </div>
        <div className="min-w-0">
          <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-none mb-1">
            Dashboard Asesor
          </h2>
          <p className="text-xs text-gray-400 font-bold tracking-wider uppercase leading-4">
            Sistem Manajemen dan Penilaian Sertifikasi Kompetensi
          </p>
        </div>
      </div>

      <div className="bg-[#E6F4FF] rounded-lg border border-sky-200 p-4 md:p-6 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-6 overflow-hidden relative shadow-2xs">
        <div className="space-y-2 z-10 max-w-xl">
          <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-none">
            Selamat Datang, Dr. Aris Thorne
          </h2>
          <p className="text-slate-700 text-xs md:text-sm font-medium leading-relaxed">
            Sudah siap untuk memvalidasi kelayakan asesi secara objektif dan
            akurat? Kelola antrean asesmen Anda di bawah ini.
          </p>
          <div className="pt-0.5">
            <span className="inline-flex items-center gap-1.5 bg-[#008BE3] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg shadow-xs">
              ID Asesor: ASESOR-10824
            </span>
          </div>
        </div>

        {/* Decorative circle graphic similar to Asesi overview */}
        <div className="absolute right-0 top-0 w-64 h-64 bg-linear-to-bl from-sky-200/50 to-transparent rounded-full -translate-y-1/2 translate-x-1/3 opacity-70"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-4 flex flex-col gap-4">
          <StatCard
            title="Tinjauan Menunggu"
            value="12"
            icon={Clock}
            theme="amber"
            subtext="Butuh Verifikasi Segera"
          />
          <StatCard
            title="Selesai Hari Ini"
            value="08"
            icon={CheckCircle}
            theme="emerald"
            subtext="Asesmen Rampung"
          />
        </div>

        <div className="md:col-span-8 bg-white rounded-lg shadow-xs border border-gray-100 overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-[#F9FAFC]">
            <h3 className="text-xs md:text-sm font-black text-slate-900 flex items-center gap-2">
              <CheckCircle className="text-[#008BE3]" size={16} />
              Antrean Asesmen
            </h3>
            <button
              onClick={() => router.push("/assessor/candidates")}
              className="text-[11px] font-bold text-[#008BE3] hover:underline cursor-pointer"
            >
              Lihat Semua
            </button>
          </div>
          <div className="divide-y divide-gray-100 flex-1 p-1">
            {queueItems.map((item: Assessment) => (
              <QueueItem
                key={item.id}
                title={item.skema || "Skema Asesmen"}
                candidate={item.nama || "Kandidat"}
                time={item.tglAsesmen || "-"}
                badge={item.jenis_asesmen}
                onClick={() => router.push("/assessor/candidates")}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, theme, subtext }: StatCardProps) {
  let containerClass = "";
  let titleClass = "";
  let subtextClass = "";
  let iconClass = "";

  if (theme === "amber") {
    containerClass = "bg-[#FFFBEB] border border-[#FDE68A]";
    titleClass = "text-amber-800";
    subtextClass = "text-amber-600";
    iconClass = "bg-amber-500 text-white";
  } else if (theme === "emerald") {
    containerClass = "bg-[#F4FBF7] border border-[#A7F3D0]";
    titleClass = "text-emerald-800";
    subtextClass = "text-emerald-600";
    iconClass = "bg-[#84CC16] text-white";
  } else {
    // sky
    containerClass = "bg-[#E6F4FF] border border-[#BCE0FD]";
    titleClass = "text-sky-800";
    subtextClass = "text-sky-600";
    iconClass = "bg-[#008BE3] text-white";
  }

  return (
    <div
      className={`p-4 rounded-lg flex items-center justify-between shadow-2xs group hover:scale-[1.01] transition-transform duration-200 ${containerClass}`}
    >
      <div className="space-y-0.5">
        <span
          className={`text-[10px] font-black uppercase tracking-wider block ${titleClass}`}
        >
          {title}
        </span>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-black text-slate-900 tracking-tight">
            {value}
          </span>
        </div>
        <p className={`text-[11px] font-bold ${subtextClass}`}>{subtext}</p>
      </div>
      <div
        className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 shadow-xs ${iconClass}`}
      >
        <Icon size={18} />
      </div>
    </div>
  );
}

function QueueItem({ title, candidate, time, badge, onClick }: QueueItemProps) {
  return (
    <div
      onClick={onClick}
      className="p-3 hover:bg-[#F9FAFC] transition-colors flex items-center gap-3.5 group cursor-pointer rounded-lg"
    >
      <div className="w-9 h-9 rounded-lg bg-sky-50 text-[#008BE3] flex items-center justify-center shrink-0 border border-sky-100">
        <FileText size={18} />
      </div>
      <div className="grow">
        <div className="flex justify-between items-start gap-2">
          <h4 className="font-bold text-slate-900 text-sm leading-tight">
            {title}
          </h4>
          <span
            className={`text-[9px] px-2 py-0.5 rounded-lg border font-bold uppercase shrink-0 ${
              badge === "Online"
                ? "bg-sky-50 text-sky-600 border-sky-200"
                : badge === "Mendesak"
                  ? "bg-red-50 text-red-600 border-red-200"
                  : "bg-emerald-50 text-emerald-600 border-emerald-200"
            }`}
          >
            {badge}
          </span>
        </div>
        <p className="text-[11px] text-gray-500 font-medium mt-0.5">
          Asesi: {candidate} • Tanggal: {time}
        </p>
      </div>
      <ChevronRight
        className="text-gray-300 group-hover:text-[#008BE3] transition-colors shrink-0"
        size={16}
      />
    </div>
  );
}
