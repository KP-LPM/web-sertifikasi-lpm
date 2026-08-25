import React from "react";
import {
  CheckCircle,
  Clock,
  TrendingUp,
  LayoutDashboard,
  FileCheck,
  ChevronRight,
  Eye,
} from "lucide-react";
import { useAppContext } from "@/context/context";
import { MetricCardProps } from "@/types/types";

export function AdminOverview() {
  const { setCurrentView } = useAppContext();

  const pendingVerificationList = [
    {
      id: "1",
      asesiName: "Ahmad Hidayat",
      email: "ahmad.h@student.uin.ac.id",
      skema: "Software Quality Assurance",
      berkas: [
        "FR.APL.01 Permohonan",
        "FR.APL.02 Asesmen Mandiri",
        "Pasfoto 3x4",
        "KTP / KTM",
        "Transkrip Nilai",
      ],
      waktu: "5 menit yang lalu",
      status: "Menunggu Verifikasi",
      pembayaran: "Belum Bayar",
    },
    {
      id: "2",
      asesiName: "Budi Pratama",
      email: "budi.p@student.uin.ac.id",
      skema: "Data Science Professional",
      berkas: [
        "FR.APL.01 Permohonan",
        "FR.APL.02 Asesmen Mandiri",
        "Bukti Pembayaran APBN",
        "Ijazah Terakhir",
      ],
      waktu: "25 menit yang lalu",
      status: "Menunggu Verifikasi",
      pembayaran: "Sudah Bayar",
    },
    {
      id: "3",
      asesiName: "Siti Nurhaliza",
      email: "siti.n@student.uin.ac.id",
      skema: "Network Administrator",
      berkas: [
        "FR.APL.01 Permohonan",
        "Sertifikat Pelatihan Jaringan",
        "KTP",
        "Pasfoto",
      ],
      waktu: "1 jam yang lalu",
      status: "Menunggu Verifikasi",
      pembayaran: "Belum Bayar",
    },
    {
      id: "4",
      asesiName: "Rizky Ramadhan",
      email: "rizky.r@student.uin.ac.id",
      skema: "Web Developer Utama",
      berkas: [
        "FR.APL.01 Permohonan",
        "FR.APL.02 Asesmen Mandiri",
        "Portofolio Project Website",
      ],
      waktu: "3 jam yang lalu",
      status: "Menunggu Verifikasi",
      pembayaran: "Sudah Bayar",
    },
    {
      id: "5",
      asesiName: "Dian Kusuma",
      email: "dian.k@student.uin.ac.id",
      skema: "Cybersecurity Analyst",
      berkas: [
        "FR.APL.01 Permohonan",
        "Bukti Pengalaman Kerja / Magang",
        "KTP",
      ],
      waktu: "5 jam yang lalu",
      status: "Menunggu Verifikasi",
      pembayaran: "Belum Bayar",
    },
  ];

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
            Kelola pengguna, skema sertifikasi, verifikasi berkas asesi, jadwal
            uji kompetensi, dan sidang pleno dalam satu panel terpusat.
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
          title="Berkas Perlu Diverifikasi"
          value="5"
          icon={FileCheck}
          theme="sky"
          subtext="menunggu tindakan admin"
        />
        <MetricCard
          title="Total Berkas Disetujui"
          value="845"
          icon={CheckCircle}
          theme="emerald"
          subtext="telah diverifikasi sah"
        />
        <MetricCard
          title="Total Sidang Pleno"
          value="5"
          icon={Clock}
          theme="slate"
          subtext="terjadwal"
        />
      </div>

      {/* Aktivitas Terbaru - Berkas Perlu Diverifikasi */}
      <div className="bg-white rounded-xl shadow-xs border border-gray-200 overflow-hidden flex flex-col">
        <div className="px-5 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#F9FAFC]">
          <div>
            <h3 className="text-sm md:text-base font-black text-slate-900 flex items-center gap-2">
              <FileCheck className="text-[#008BE3]" size={18} />
              Aktivitas Terbaru: Berkas Perlu Diverifikasi
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Daftar dokumen berkas pendaftaran APL.01 & APL.02 asesi terbaru
              yang memerlukan tinjauan verifikasi admin.
            </p>
          </div>
          <button
            onClick={() => setCurrentView("users")}
            className="px-3.5 py-2 bg-[#008BE3] hover:bg-[#0076C2] text-white rounded-lg text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95 self-start sm:self-auto"
          >
            <span>Lihat Semua Berkas</span>
            <ChevronRight size={14} />
          </button>
        </div>

        <div className="divide-y divide-gray-100">
          {pendingVerificationList.slice(0, 3).map((item) => (
            <div
              key={item.id}
              className="p-3.5 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 items-center">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Nama Asesi
                  </p>
                  <p className="font-bold text-slate-900 text-sm truncate">
                    {item.asesiName}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Skema Sertifikasi
                  </p>
                  <p className="text-xs font-semibold text-[#008BE3] truncate">
                    {item.skema}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-2.5 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 shrink-0">
                <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider shrink-0">
                  <Clock size={10} />
                  {item.status}
                </span>

                <button
                  onClick={() => setCurrentView("users")}
                  className="px-2.5 py-1 bg-sky-50 hover:bg-[#008BE3] text-[#008BE3] hover:text-white border border-sky-200 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <Eye size={12} />
                  <span>Tinjau</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  title,
  value,
  icon: Icon,
  theme,
  subtext,
}: MetricCardProps) {
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
