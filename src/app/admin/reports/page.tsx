"use client"
import React, { useState, useMemo } from "react";
import {
  BarChart2,
  Users,
  Award,
  XCircle,
  TrendingUp,
  FileText,
  Filter,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { CustomTooltipProps, TooltipPayloadEntry } from "@/types/types";

const dummyReportData = [
  // 2026 Data
  {
    skema: "Jenjang 5 Bidang Kewirausahaan Industri",
    tahun: "2026",
    bulan: "Januari",
    kompeten: 15,
    belumKompeten: 2,
  },
  {
    skema: "Jenjang 5 Bidang Kewirausahaan Industri",
    tahun: "2026",
    bulan: "Februari",
    kompeten: 18,
    belumKompeten: 1,
  },
  {
    skema: "Jenjang 5 Bidang Kewirausahaan Industri",
    tahun: "2026",
    bulan: "Maret",
    kompeten: 20,
    belumKompeten: 3,
  },
  {
    skema: "Jenjang 5 Bidang Kewirausahaan Industri",
    tahun: "2026",
    bulan: "April",
    kompeten: 22,
    belumKompeten: 2,
  },
  {
    skema: "Jenjang 5 Bidang Kewirausahaan Industri",
    tahun: "2026",
    bulan: "Mei",
    kompeten: 19,
    belumKompeten: 1,
  },
  {
    skema: "Jenjang 5 Bidang Kewirausahaan Industri",
    tahun: "2026",
    bulan: "Juni",
    kompeten: 25,
    belumKompeten: 4,
  },
  {
    skema: "Jenjang 5 Bidang Kewirausahaan Industri",
    tahun: "2026",
    bulan: "Juli",
    kompeten: 21,
    belumKompeten: 2,
  },
  {
    skema: "Jenjang 5 Bidang Kewirausahaan Industri",
    tahun: "2026",
    bulan: "Agustus",
    kompeten: 24,
    belumKompeten: 3,
  },
  {
    skema: "Jenjang 5 Bidang Kewirausahaan Industri",
    tahun: "2026",
    bulan: "September",
    kompeten: 20,
    belumKompeten: 1,
  },
  {
    skema: "Jenjang 5 Bidang Kewirausahaan Industri",
    tahun: "2026",
    bulan: "Oktober",
    kompeten: 17,
    belumKompeten: 2,
  },
  {
    skema: "Jenjang 5 Bidang Kewirausahaan Industri",
    tahun: "2026",
    bulan: "November",
    kompeten: 19,
    belumKompeten: 2,
  },
  {
    skema: "Jenjang 5 Bidang Kewirausahaan Industri",
    tahun: "2026",
    bulan: "Desember",
    kompeten: 23,
    belumKompeten: 1,
  },

  {
    skema: "Melaksanakan Komunikasi dengan Pemangku Kepentingan",
    tahun: "2026",
    bulan: "Januari",
    kompeten: 12,
    belumKompeten: 1,
  },
  {
    skema: "Melaksanakan Komunikasi dengan Pemangku Kepentingan",
    tahun: "2026",
    bulan: "Februari",
    kompeten: 14,
    belumKompeten: 2,
  },
  {
    skema: "Melaksanakan Komunikasi dengan Pemangku Kepentingan",
    tahun: "2026",
    bulan: "Maret",
    kompeten: 16,
    belumKompeten: 1,
  },
  {
    skema: "Melaksanakan Komunikasi dengan Pemangku Kepentingan",
    tahun: "2026",
    bulan: "April",
    kompeten: 15,
    belumKompeten: 3,
  },
  {
    skema: "Melaksanakan Komunikasi dengan Pemangku Kepentingan",
    tahun: "2026",
    bulan: "Mei",
    kompeten: 18,
    belumKompeten: 2,
  },
  {
    skema: "Melaksanakan Komunikasi dengan Pemangku Kepentingan",
    tahun: "2026",
    bulan: "Juni",
    kompeten: 20,
    belumKompeten: 1,
  },
  {
    skema: "Melaksanakan Komunikasi dengan Pemangku Kepentingan",
    tahun: "2026",
    bulan: "Juli",
    kompeten: 17,
    belumKompeten: 2,
  },
  {
    skema: "Melaksanakan Komunikasi dengan Pemangku Kepentingan",
    tahun: "2026",
    bulan: "Agustus",
    kompeten: 19,
    belumKompeten: 1,
  },
  {
    skema: "Melaksanakan Komunikasi dengan Pemangku Kepentingan",
    tahun: "2026",
    bulan: "September",
    kompeten: 15,
    belumKompeten: 2,
  },
  {
    skema: "Melaksanakan Komunikasi dengan Pemangku Kepentingan",
    tahun: "2026",
    bulan: "Oktober",
    kompeten: 14,
    belumKompeten: 1,
  },
  {
    skema: "Melaksanakan Komunikasi dengan Pemangku Kepentingan",
    tahun: "2026",
    bulan: "November",
    kompeten: 16,
    belumKompeten: 3,
  },
  {
    skema: "Melaksanakan Komunikasi dengan Pemangku Kepentingan",
    tahun: "2026",
    bulan: "Desember",
    kompeten: 18,
    belumKompeten: 2,
  },

  {
    skema: "Penerjemah Teks Umum",
    tahun: "2026",
    bulan: "Januari",
    kompeten: 10,
    belumKompeten: 2,
  },
  {
    skema: "Penerjemah Teks Umum",
    tahun: "2026",
    bulan: "Februari",
    kompeten: 12,
    belumKompeten: 1,
  },
  {
    skema: "Penerjemah Teks Umum",
    tahun: "2026",
    bulan: "Maret",
    kompeten: 14,
    belumKompeten: 3,
  },
  {
    skema: "Penerjemah Teks Umum",
    tahun: "2026",
    bulan: "April",
    kompeten: 11,
    belumKompeten: 1,
  },
  {
    skema: "Penerjemah Teks Umum",
    tahun: "2026",
    bulan: "Mei",
    kompeten: 15,
    belumKompeten: 2,
  },
  {
    skema: "Penerjemah Teks Umum",
    tahun: "2026",
    bulan: "Juni",
    kompeten: 16,
    belumKompeten: 2,
  },
  {
    skema: "Penerjemah Teks Umum",
    tahun: "2026",
    bulan: "Juli",
    kompeten: 13,
    belumKompeten: 1,
  },
  {
    skema: "Penerjemah Teks Umum",
    tahun: "2026",
    bulan: "Agustus",
    kompeten: 15,
    belumKompeten: 2,
  },
  {
    skema: "Penerjemah Teks Umum",
    tahun: "2026",
    bulan: "September",
    kompeten: 12,
    belumKompeten: 1,
  },
  {
    skema: "Penerjemah Teks Umum",
    tahun: "2026",
    bulan: "Oktober",
    kompeten: 14,
    belumKompeten: 2,
  },
  {
    skema: "Penerjemah Teks Umum",
    tahun: "2026",
    bulan: "November",
    kompeten: 11,
    belumKompeten: 1,
  },
  {
    skema: "Penerjemah Teks Umum",
    tahun: "2026",
    bulan: "Desember",
    kompeten: 16,
    belumKompeten: 3,
  },

  {
    skema: "Auditor Halal",
    tahun: "2026",
    bulan: "Januari",
    kompeten: 25,
    belumKompeten: 2,
  },
  {
    skema: "Auditor Halal",
    tahun: "2026",
    bulan: "Februari",
    kompeten: 28,
    belumKompeten: 3,
  },
  {
    skema: "Auditor Halal",
    tahun: "2026",
    bulan: "Maret",
    kompeten: 30,
    belumKompeten: 1,
  },
  {
    skema: "Auditor Halal",
    tahun: "2026",
    bulan: "April",
    kompeten: 27,
    belumKompeten: 4,
  },
  {
    skema: "Auditor Halal",
    tahun: "2026",
    bulan: "Mei",
    kompeten: 32,
    belumKompeten: 2,
  },
  {
    skema: "Auditor Halal",
    tahun: "2026",
    bulan: "Juni",
    kompeten: 35,
    belumKompeten: 3,
  },
  {
    skema: "Auditor Halal",
    tahun: "2026",
    bulan: "Juli",
    kompeten: 29,
    belumKompeten: 2,
  },
  {
    skema: "Auditor Halal",
    tahun: "2026",
    bulan: "Agustus",
    kompeten: 31,
    belumKompeten: 1,
  },
  {
    skema: "Auditor Halal",
    tahun: "2026",
    bulan: "September",
    kompeten: 28,
    belumKompeten: 3,
  },
  {
    skema: "Auditor Halal",
    tahun: "2026",
    bulan: "Oktober",
    kompeten: 26,
    belumKompeten: 2,
  },
  {
    skema: "Auditor Halal",
    tahun: "2026",
    bulan: "November",
    kompeten: 30,
    belumKompeten: 2,
  },
  {
    skema: "Auditor Halal",
    tahun: "2026",
    bulan: "Desember",
    kompeten: 34,
    belumKompeten: 1,
  },

  {
    skema: "Penyelia Halal",
    tahun: "2026",
    bulan: "Januari",
    kompeten: 20,
    belumKompeten: 1,
  },
  {
    skema: "Penyelia Halal",
    tahun: "2026",
    bulan: "Februari",
    kompeten: 22,
    belumKompeten: 2,
  },
  {
    skema: "Penyelia Halal",
    tahun: "2026",
    bulan: "Maret",
    kompeten: 24,
    belumKompeten: 2,
  },
  {
    skema: "Penyelia Halal",
    tahun: "2026",
    bulan: "April",
    kompeten: 21,
    belumKompeten: 3,
  },
  {
    skema: "Penyelia Halal",
    tahun: "2026",
    bulan: "Mei",
    kompeten: 25,
    belumKompeten: 1,
  },
  {
    skema: "Penyelia Halal",
    tahun: "2026",
    bulan: "Juni",
    kompeten: 28,
    belumKompeten: 2,
  },
  {
    skema: "Penyelia Halal",
    tahun: "2026",
    bulan: "Juli",
    kompeten: 23,
    belumKompeten: 1,
  },
  {
    skema: "Penyelia Halal",
    tahun: "2026",
    bulan: "Agustus",
    kompeten: 26,
    belumKompeten: 2,
  },
  {
    skema: "Penyelia Halal",
    tahun: "2026",
    bulan: "September",
    kompeten: 22,
    belumKompeten: 2,
  },
  {
    skema: "Penyelia Halal",
    tahun: "2026",
    bulan: "Oktober",
    kompeten: 20,
    belumKompeten: 1,
  },
  {
    skema: "Penyelia Halal",
    tahun: "2026",
    bulan: "November",
    kompeten: 24,
    belumKompeten: 3,
  },
  {
    skema: "Penyelia Halal",
    tahun: "2026",
    bulan: "Desember",
    kompeten: 27,
    belumKompeten: 2,
  },

  // 2025 Data
  {
    skema: "Jenjang 5 Bidang Kewirausahaan Industri",
    tahun: "2025",
    bulan: "Januari",
    kompeten: 12,
    belumKompeten: 3,
  },
  {
    skema: "Jenjang 5 Bidang Kewirausahaan Industri",
    tahun: "2025",
    bulan: "Juli",
    kompeten: 16,
    belumKompeten: 2,
  },
  {
    skema: "Melaksanakan Komunikasi dengan Pemangku Kepentingan",
    tahun: "2025",
    bulan: "Februari",
    kompeten: 10,
    belumKompeten: 2,
  },
  {
    skema: "Melaksanakan Komunikasi dengan Pemangku Kepentingan",
    tahun: "2025",
    bulan: "Agustus",
    kompeten: 13,
    belumKompeten: 1,
  },
  {
    skema: "Penerjemah Teks Umum",
    tahun: "2025",
    bulan: "Maret",
    kompeten: 8,
    belumKompeten: 2,
  },
  {
    skema: "Penerjemah Teks Umum",
    tahun: "2025",
    bulan: "September",
    kompeten: 11,
    belumKompeten: 1,
  },
  {
    skema: "Auditor Halal",
    tahun: "2025",
    bulan: "April",
    kompeten: 20,
    belumKompeten: 3,
  },
  {
    skema: "Auditor Halal",
    tahun: "2025",
    bulan: "Oktober",
    kompeten: 22,
    belumKompeten: 2,
  },
  {
    skema: "Penyelia Halal",
    tahun: "2025",
    bulan: "Mei",
    kompeten: 17,
    belumKompeten: 2,
  },
  {
    skema: "Penyelia Halal",
    tahun: "2025",
    bulan: "November",
    kompeten: 19,
    belumKompeten: 2,
  },
];

const COLORS = ["#10B981", "#EF4444"]; // Emerald for Kompeten, Red for Belum Kompeten

export default function Reports() {
  const [selectedSkema, setSelectedSkema] = useState("ALL");
  const [selectedTahun, setSelectedTahun] = useState("ALL");
  const [selectedPeriode, setSelectedPeriode] = useState("ALL");

  const filteredData = useMemo(() => {
    return dummyReportData.filter((item) => {
      if (selectedSkema !== "ALL" && item.skema !== selectedSkema) return false;
      if (selectedTahun !== "ALL" && item.tahun !== selectedTahun) return false;
      if (selectedPeriode !== "ALL") {
        if (selectedPeriode === "Januari - Juni") {
          const semester1 = [
            "Januari",
            "Februari",
            "Maret",
            "April",
            "Mei",
            "Juni",
          ];
          if (!semester1.includes(item.bulan)) return false;
        } else if (selectedPeriode === "Juli - Desember") {
          const semester2 = [
            "Juli",
            "Agustus",
            "September",
            "Oktober",
            "November",
            "Desember",
          ];
          if (!semester2.includes(item.bulan)) return false;
        } else {
          if (item.bulan !== selectedPeriode) return false;
        }
      }
      return true;
    });
  }, [selectedSkema, selectedTahun, selectedPeriode]);

  // Overall Statistics & Data Tables
  const statsSummary = useMemo(() => {
    let totalKompeten = 0;
    let totalBelumKompeten = 0;

    filteredData.forEach((d) => {
      totalKompeten += d.kompeten;
      totalBelumKompeten += d.belumKompeten;
    });

    const totalAsesi = totalKompeten + totalBelumKompeten;
    const tingkatKelulusan =
      totalAsesi > 0 ? ((totalKompeten / totalAsesi) * 100).toFixed(1) : "0";

    // Rincian Per Skema (Bentuk Angka)
    const schemeMap: Record<
      string,
      { skema: string; total: number; kompeten: number; belumKompeten: number }
    > = {};

    filteredData.forEach((d) => {
      if (!schemeMap[d.skema]) {
        schemeMap[d.skema] = {
          skema: d.skema,
          total: 0,
          kompeten: 0,
          belumKompeten: 0,
        };
      }
      schemeMap[d.skema].kompeten += d.kompeten;
      schemeMap[d.skema].belumKompeten += d.belumKompeten;
      schemeMap[d.skema].total += d.kompeten + d.belumKompeten;
    });

    const schemeList = Object.values(schemeMap).map((s) => ({
      ...s,
      rate: s.total > 0 ? ((s.kompeten / s.total) * 100).toFixed(1) : "0",
    }));

    return {
      totalAsesi,
      totalKompeten,
      totalBelumKompeten,
      tingkatKelulusan,
      totalSkemaCount: schemeList.length,
      schemeList,
    };
  }, [filteredData]);

  const pieData = useMemo(() => {
    return [
      { name: "Kompeten (Lulus)", value: statsSummary.totalKompeten },
      { name: "Belum Kompeten", value: statsSummary.totalBelumKompeten },
    ];
  }, [statsSummary]);

  const barData = useMemo(() => {
    return statsSummary.schemeList.map((s) => ({
      name: s.skema,
      kompeten: s.kompeten,
      belumKompeten: s.belumKompeten,
      total: s.total,
    }));
  }, [statsSummary]);

  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white p-3.5 shadow-xl rounded-xl text-xs space-y-1.5 border border-slate-700">
          <p className="font-extrabold text-white border-b border-slate-700 pb-1">
            {label}
          </p>
          {payload.map((entry: TooltipPayloadEntry, index: number) => (
            <div
              key={`item-${index}`}
              className="flex items-center justify-between gap-4 font-semibold"
            >
              <div className="flex items-center gap-1.5">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-slate-300">{entry.name}:</span>
              </div>
              <span className="text-white font-extrabold">
                {entry.value} asesi
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] p-4 md:p-8 space-y-8 pb-28 text-sm text-gray-700">
      {/* Header Page */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#008BE3]/10 flex items-center justify-center text-[#008BE3] border border-[#008BE3]/20 shadow-xs shrink-0">
            <BarChart2 size={24} className="stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-none mb-1">
              Laporan & Statistik Sistem
            </h2>
            <p className="text-xs text-gray-500 font-medium">
              Data rekapitulasi kelulusan asesi, hasil asesmen, dan performa
              skema sertifikasi LSP.
            </p>
          </div>
        </div>
      </div>

      {/* Filter Row */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-xs border border-slate-200/80 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
          <Filter size={15} className="text-[#008BE3]" />
          <span>Filter Laporan Data</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <select
            value={selectedSkema}
            onChange={(e) => setSelectedSkema(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-xs font-bold text-slate-800 outline-none focus:border-[#008BE3] focus:ring-2 focus:ring-[#008BE3]/20 cursor-pointer transition-all"
          >
            <option value="ALL">-- Semua Skema Sertifikasi --</option>
            <option value="Jenjang 5 Bidang Kewirausahaan Industri">
              Jenjang 5 Bidang Kewirausahaan Industri
            </option>
            <option value="Melaksanakan Komunikasi dengan Pemangku Kepentingan">
              Melaksanakan Komunikasi dengan Pemangku Kepentingan
            </option>
            <option value="Penerjemah Teks Umum">Penerjemah Teks Umum</option>
            <option value="Auditor Halal">Auditor Halal</option>
            <option value="Penyelia Halal">Penyelia Halal</option>
          </select>

          <select
            value={selectedTahun}
            onChange={(e) => setSelectedTahun(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-xs font-bold text-slate-800 outline-none focus:border-[#008BE3] focus:ring-2 focus:ring-[#008BE3]/20 cursor-pointer transition-all"
          >
            <option value="ALL">-- Semua Tahun --</option>
            <option value="2026">Tahun 2026</option>
            <option value="2025">Tahun 2025</option>
          </select>

          <select
            value={selectedPeriode}
            onChange={(e) => setSelectedPeriode(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-xs font-bold text-slate-800 outline-none focus:border-[#008BE3] focus:ring-2 focus:ring-[#008BE3]/20 cursor-pointer transition-all"
          >
            <option value="ALL">-- Semua Periode Bulan --</option>
            <option value="Januari - Juni">Semester 1 (Januari - Juni)</option>
            <option value="Juli - Desember">
              Semester 2 (Juli - Desember)
            </option>
            <option value="Januari">Januari</option>
            <option value="Februari">Februari</option>
            <option value="Maret">Maret</option>
            <option value="April">April</option>
            <option value="Mei">Mei</option>
            <option value="Juni">Juni</option>
            <option value="Juli">Juli</option>
            <option value="Agustus">Agustus</option>
            <option value="September">September</option>
            <option value="Oktober">Oktober</option>
            <option value="November">November</option>
            <option value="Desember">Desember</option>
          </select>
        </div>
      </div>

      {/* STATS CARDS (ANGKA KUNCI LAPORAN) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {/* Total Asesi */}
        <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200/80 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Asesi Teruji
            </span>
            <div className="text-2xl md:text-3xl font-black text-slate-900">
              {statsSummary.totalAsesi}
            </div>
            <span className="text-[11px] text-slate-400 font-medium">
              Peserta terdaftar
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#008BE3] border border-blue-100 flex items-center justify-center shrink-0">
            <Users size={22} />
          </div>
        </div>

        {/* Asesi Kompeten (Lulus) */}
        <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200/80 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Asesi Lulus (Kompeten)
            </span>
            <div className="text-2xl md:text-3xl font-black text-emerald-600">
              {statsSummary.totalKompeten}
            </div>
            <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md inline-block">
              Direkomendasikan Lulus
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0">
            <Award size={22} />
          </div>
        </div>

        {/* Asesi Belum Kompeten */}
        <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200/80 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Belum Kompeten
            </span>
            <div className="text-2xl md:text-3xl font-black text-rose-600">
              {statsSummary.totalBelumKompeten}
            </div>
            <span className="text-[11px] text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded-md inline-block">
              Perlu Asesmen Ulang
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center shrink-0">
            <XCircle size={22} />
          </div>
        </div>

        {/* Tingkat Kelulusan */}
        <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200/80 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Tingkat Kelulusan
            </span>
            <div className="text-2xl md:text-3xl font-black text-slate-900">
              {statsSummary.tingkatKelulusan}%
            </div>
            <span className="text-[11px] text-slate-500 font-medium">
              Dari total {statsSummary.totalAsesi} asesi
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center shrink-0">
            <TrendingUp size={22} />
          </div>
        </div>
      </div>

      {/* LARGER CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Pie Chart (Larger View) */}
        <div className="lg:col-span-4 bg-white p-6 sm:p-7 rounded-2xl shadow-xs border border-slate-200/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-[#008BE3]"></span>
              <h3 className="text-base font-black text-slate-900">
                Persentase Kelulusan Keseluruhan
              </h3>
            </div>
            <p className="text-xs font-medium text-slate-500">
              Distribusi perbandingan Asesi Kompeten vs Belum Kompeten.
            </p>
          </div>

          <div className="my-4 h-[380px] w-full flex items-center justify-center relative">
            {statsSummary.totalAsesi > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={125}
                    paddingAngle={3}
                    dataKey="value"
                    labelLine={false}
                    label={({
                      cx = 0,
                      cy = 0,
                      midAngle = 0,
                      innerRadius = 0,
                      outerRadius = 0,
                      percent = 0,
                    }) => {
                      const numCx = Number(cx);
                      const numCy = Number(cy);
                      const numInner = Number(innerRadius);
                      const numOuter = Number(outerRadius);

                      const radius = numInner + (numOuter - numInner) * 0.5;
                      const x =
                        numCx + radius * Math.cos((-midAngle * Math.PI) / 180);
                      const y =
                        numCy + radius * Math.sin((-midAngle * Math.PI) / 180);

                      return percent > 0 ? (
                        <text
                          x={x}
                          y={y}
                          fill="white"
                          textAnchor="middle"
                          dominantBaseline="central"
                          fontSize={13}
                          fontWeight={800}
                        >
                          {`${(percent * 100).toFixed(0)}%`}
                        </text>
                      ) : null;
                    }}
                  >
                    {pieData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    iconType="circle"
                    verticalAlign="bottom"
                    align="center"
                    wrapperStyle={{
                      paddingTop: "20px",
                      fontSize: "12px",
                      fontWeight: 700,
                      color: "#334155",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center text-slate-400 font-bold text-xs">
                Tidak ada data pada filter yang dipilih
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-center">
            <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-100">
              <span className="text-[10px] font-bold text-emerald-800 uppercase block">
                Total Lulus
              </span>
              <span className="text-base font-black text-emerald-700">
                {statsSummary.totalKompeten} Asesi
              </span>
            </div>
            <div className="p-2.5 bg-rose-50 rounded-xl border border-rose-100">
              <span className="text-[10px] font-bold text-rose-800 uppercase block">
                Belum Lulus
              </span>
              <span className="text-base font-black text-rose-700">
                {statsSummary.totalBelumKompeten} Asesi
              </span>
            </div>
          </div>
        </div>

        {/* Bar Chart (Larger View) */}
        <div className="lg:col-span-8 bg-white p-6 sm:p-7 rounded-2xl shadow-xs border border-slate-200/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#008BE3]"></span>
                <h3 className="text-base font-black text-slate-900">
                  Perbandingan Kelulusan per Skema Sertifikasi
                </h3>
              </div>
              <span className="text-xs font-bold text-slate-400">
                Tampilan Grafik Luas
              </span>
            </div>
            <p className="text-xs font-medium text-slate-500">
              Jumlah Asesi Kompeten (Hijau) dan Belum Kompeten (Merah) disajikan
              secara komparatif per skema.
            </p>
          </div>

          <div className="my-4 h-[420px] w-full">
            {barData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={barData}
                  margin={{ top: 25, right: 30, left: 0, bottom: 45 }}
                  barGap={6}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#F1F5F9"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#475569", fontSize: 11, fontWeight: 700 }}
                    interval={0}
                    angle={-15}
                    textAnchor="end"
                    tickFormatter={(value) =>
                      value.length > 22 ? `${value.substring(0, 22)}...` : value
                    }
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#64748B", fontSize: 11, fontWeight: 700 }}
                  />
                  <Tooltip
                    cursor={{ fill: "#F8FAFC" }}
                    content={<CustomTooltip />}
                  />
                  <Legend
                    iconType="circle"
                    verticalAlign="top"
                    align="right"
                    wrapperStyle={{
                      paddingBottom: "15px",
                      fontSize: "12px",
                      fontWeight: 700,
                      color: "#334155",
                    }}
                  />
                  <Bar
                    dataKey="kompeten"
                    name="Kompeten (Lulus)"
                    fill="#10B981"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={45}
                  />
                  <Bar
                    dataKey="belumKompeten"
                    name="Belum Kompeten"
                    fill="#EF4444"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={45}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-slate-400 font-bold text-xs">
                Tidak ada data pada filter yang dipilih
              </div>
            )}
          </div>
        </div>
      </div>

      {/* NUMERICAL DATA TABLE PER SCHEME (ANGKA) */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden space-y-0">
        <div className="p-5 sm:p-6 bg-white border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0">
              <FileText size={18} />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">
                Rincian Data Kelulusan Asesi Per Skema (Bentuk Angka)
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Tabel rekapitulasi numerik kelulusan asesi berdasarkan skema
                sertifikasi yang dipilih.
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-[#008BE3] bg-sky-50 border border-sky-100 px-3 py-1.5 rounded-lg self-start sm:self-auto">
            Total {statsSummary.schemeList.length} Skema Terdaftar
          </span>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-black tracking-wider text-[11px]">
                <th className="py-3.5 px-4 w-12 text-center">No</th>
                <th className="py-3.5 px-4">Nama Skema Sertifikasi</th>
                <th className="py-3.5 px-4 text-center">Total Asesi</th>
                <th className="py-3.5 px-4 text-center">
                  Jumlah Lulus (Kompeten)
                </th>
                <th className="py-3.5 px-4 text-center">
                  Jumlah Belum Kompeten
                </th>
                <th className="py-3.5 px-4 text-center">Tingkat Kelulusan</th>
                <th className="py-3.5 px-4 text-center">Status Performansi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/80 font-medium text-slate-800">
              {statsSummary.schemeList.length > 0 ? (
                statsSummary.schemeList.map((scheme, idx) => {
                  const rateNum = parseFloat(scheme.rate);
                  return (
                    <tr
                      key={idx}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="py-3.5 px-4 text-center font-bold text-slate-400">
                        {idx + 1}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {scheme.skema}
                      </td>
                      <td className="py-3.5 px-4 text-center font-extrabold text-slate-800">
                        {scheme.total} Asesi
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-md text-xs font-black bg-emerald-100 text-emerald-800">
                          {scheme.kompeten} Asesi
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-md text-xs font-black bg-rose-100 text-rose-800">
                          {scheme.belumKompeten} Asesi
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center font-black text-slate-900 text-sm">
                        {scheme.rate}%
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {rateNum >= 90 ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Sangat Baik
                          </span>
                        ) : rateNum >= 75 ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-sky-50 text-sky-700 border border-sky-200">
                            Baik
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-amber-50 text-amber-700 border border-amber-200">
                            Evaluasi
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="py-8 text-center text-slate-400 font-bold"
                  >
                    Tidak ada data skema yang sesuai dengan filter.
                  </td>
                </tr>
              )}
            </tbody>
            {/* Table Summary Footer */}
            {statsSummary.schemeList.length > 0 && (
              <tfoot>
                <tr className="bg-slate-900 text-white font-bold text-xs">
                  <td
                    colSpan={2}
                    className="py-4 px-4 font-black uppercase tracking-wider text-right"
                  >
                    Total Keseluruhan Laporan:
                  </td>
                  <td className="py-4 px-4 text-center font-black text-sm">
                    {statsSummary.totalAsesi} Asesi
                  </td>
                  <td className="py-4 px-4 text-center font-black text-emerald-400 text-sm">
                    {statsSummary.totalKompeten} Lulus
                  </td>
                  <td className="py-4 px-4 text-center font-black text-rose-400 text-sm">
                    {statsSummary.totalBelumKompeten} Belum Lulus
                  </td>
                  <td className="py-4 px-4 text-center font-black text-amber-300 text-sm">
                    {statsSummary.tingkatKelulusan}%
                  </td>
                  <td className="py-4 px-4 text-center text-slate-400 font-normal">
                    Rata-rata LSP
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}
