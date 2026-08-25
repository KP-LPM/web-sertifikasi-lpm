import React from "react";
import {
  Users,
  FileText,
  Clock,
  TrendingUp,
  AlertCircle,
  LayoutDashboard,
} from "lucide-react";
import { Breadcrumb } from "@/components/Breadcrumb";

export function AdminOverview() {
  return (
    <div className="min-h-screen bg-[#F8F9FC] p-4 md:p-8 space-y-6 pb-24 text-sm text-gray-700">
      {/* Page Title Section matching Appeals and History pages */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-lg bg-[#008BE3]/10 flex items-center justify-center text-[#008BE3] border border-[#008BE3]/20 shadow-xs shrink-0">
          <LayoutDashboard size={20} className="stroke-[2.5]" />
        </div>
        <div className="min-w-0">
          <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-none mb-1">
            Dashboard Admin
          </h2>
          <p className="text-xs text-gray-400 font-bold tracking-wider uppercase leading-[16px] max-w-sm">
            Sistem Administrasi dan Pengelolaan Sertifikasi Kompetensi
          </p>
        </div>
      </div>
      {/* Dynamic Greeting Banner matching Asesi/Asesor Overview */}
      <div className="bg-[#E6F4FF] rounded-lg border border-sky-200 p-4 md:py-4 md:px-6 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 overflow-hidden relative shadow-2xs">
        <div className="space-y-1 z-10 w-full max-w-none">
          <span className="text-[#008BE3] font-bold text-[10px] uppercase tracking-wider bg-white/60 px-2.5 py-0.5 rounded-full border border-sky-100 inline-block shadow-2xs">
            DASHBOARD ADMIN
          </span>
          <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight leading-none mt-1">
            Selamat Datang, Administrator LSP
          </h2>
          <p className="text-gray-600 font-medium text-xs max-w-md">
            Kelola pengguna, skema sertifikasi, jadwal uji kompetensi, dan
            verifikasi banding dalam satu panel terpusat.
          </p>

          <div className="pt-0.5">
            <span className="inline-flex items-center gap-1.5 bg-[#008BE3] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg shadow-xs">
              ID Admin: ADMIN-001
            </span>
          </div>
        </div>
        {/* Decorative circle graphic similar to Asesi overview */}
        <div className="absolute right-0 top-0 w-64 h-64 bg-gradient-to-bl from-sky-200/50 to-transparent rounded-full -translate-y-1/2 translate-x-1/3 opacity-70"></div>
      </div>

      {/* 3 Solid, Compact Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Total Berkas"
          value="142"
          icon={Users}
          theme="sky"
          subtext="yang perlu diverifikasi"
        />
        <MetricCard
          title="Total Berkas"
          value="845"
          icon={FileText}
          theme="emerald"
          subtext="yang telah diverifikasi"
        />
        <MetricCard
          title="Total Sidang Pleno"
          value="5"
          icon={Clock}
          theme="slate"
          subtext="terjadwal"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-4">
        <div className="bg-white rounded-lg shadow-xs border border-gray-100 overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-[#F9FAFC]">
            <h3 className="text-xs md:text-sm font-black text-slate-900 flex items-center gap-2">
              <FileText className="text-[#008BE3]" size={16} />
              Aktivitas Terbaru
            </h3>
            <button
              onClick={() => alert("Menampilkan semua aktivitas...")}
              className="text-[11px] font-bold text-[#008BE3] hover:underline"
            >
              Lihat Semua
            </button>
          </div>

          <div className="divide-y divide-gray-100 flex-1 p-2 space-y-1">
            <ActivityItem
              icon={Users}
              title={
                <span>
                  <strong>Ahmad Fauzi</strong> mendaftar untuk skema{" "}
                  <strong>Software Quality Assurance</strong>.
                </span>
              }
              time="2 menit yang lalu"
              badge="Baru"
            />
            <ActivityItem
              icon={FileText}
              title={
                <span>
                  Asesmen <strong>Siti Aminah</strong> untuk skema{" "}
                  <strong>Data Science Professional</strong> telah diselesaikan
                  oleh Asesor Budi.
                </span>
              }
              time="45 menit yang lalu"
              badge="Ulasan"
            />
            <ActivityItem
              icon={AlertCircle}
              title={
                <span>
                  <strong>Peringatan Sistem</strong>: 12 jadwal asesmen
                  mendekati batas waktu akhir.
                </span>
              }
              time="5 jam yang lalu"
              badge="Mendesak"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon: Icon, theme, subtext }: any) {
  let containerClass = "";
  let titleClass = "";
  let subtextClass = "";
  let iconClass = "";

  if (theme === "amber") {
    containerClass = "bg-[#FFFBEB] border border-[#FDE68A]";
    titleClass = "text-amber-800";
    subtextClass = "text-amber-600";
    iconClass = "text-amber-500";
  } else if (theme === "emerald") {
    containerClass = "bg-[#ECFDF5] border border-[#A7F3D0]";
    titleClass = "text-emerald-800";
    subtextClass = "text-emerald-600";
    iconClass = "text-emerald-500";
  } else if (theme === "sky") {
    containerClass = "bg-[#F0F9FF] border border-[#BAE6FD]";
    titleClass = "text-[#0369A1]";
    subtextClass = "text-sky-600";
    iconClass = "text-[#0EA5E9]";
  } else {
    containerClass = "bg-[#F8FAFC] border border-slate-200";
    titleClass = "text-slate-800";
    subtextClass = "text-slate-500";
    iconClass = "text-slate-400";
  }

  return (
    <div className={`p-4 rounded-lg flex items-start gap-4 ${containerClass}`}>
      <div
        className={`p-3 bg-white rounded-lg shadow-xs border border-white/50 ${iconClass}`}
      >
        <Icon size={22} className="stroke-[2.5]" />
      </div>
      <div>
        <p
          className={`text-[10px] font-bold uppercase tracking-wider ${titleClass} mb-0.5 opacity-80`}
        >
          {title}
        </p>
        <p
          className={`text-2xl font-black ${titleClass} leading-none tracking-tight`}
        >
          {value}
        </p>
        {subtext && (
          <div className="flex items-center gap-1 mt-1.5">
            {theme === "sky" && (
              <TrendingUp size={10} className={subtextClass} />
            )}
            <span className={`text-[10px] font-medium ${subtextClass}`}>
              {subtext}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function ActivityItem({ icon: Icon, title, time, badge }: any) {
  return (
    <div className="flex gap-3 p-2 hover:bg-slate-50 rounded-lg transition-colors items-start">
      <div className="w-8 h-8 rounded-full bg-[#E6F4FF] text-[#008BE3] flex items-center justify-center shrink-0 mt-0.5 border border-[#BCE0FD]">
        <Icon size={14} className="stroke-[2.5]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-slate-700 font-medium leading-relaxed">
          {title}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <p className="text-[10px] text-gray-400 font-medium flex items-center gap-1">
            <Clock size={10} /> {time}
          </p>
          {badge && (
            <span
              className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                badge === "Mendesak"
                  ? "bg-red-50 text-red-600 border border-red-100"
                  : badge === "Baru"
                    ? "bg-green-50 text-green-600 border border-green-100"
                    : "bg-sky-50 text-[#008BE3] border border-sky-100"
              }`}
            >
              {badge}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
