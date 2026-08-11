"use client";

import React from "react";
import Link from "next/link";
import { Headset } from "lucide-react";

// Context & Shared Components
import { AppProvider, useAppContext } from "../context/context";
// import { Header } from "../components/Header";
// import { Sidebar } from "../components/Sidebar";
// import { Breadcrumb } from "../components/Breadcrumb";

// Base Pages
import Login from "./login/page"; // Atau import Login dari "@/components/Login" jika komponen murni
import { Profile } from "./profile/page";

// Admin Pages
// import Overview from "./admin/Overview";
// import Schemes from "./admin/Schemes";
// import Schedule from "./admin/Schedule";
// import Users from "./admin/Users";
// import Tuk from "./admin/Tuk";
// import Reports from "./admin/Reports";

// Assessor Pages
import { AssessorOverview } from "../app/assessor/overview/page";
import { AsesiList } from "../app/assessor/candidates/page";
import { AssessmentForm } from "../app/assessor/asessmentform/page";
import { AssessmentFinalization } from "../app/assessor/finalization/page";
import { VerifikasiAPL02 } from "../app/assessor/verifikasiapl02/page";
import { VerifikasiBanding } from "../app/assessor/verifikasibanding/page";
import { VerifikasiPortofolio } from "../app/assessor/verifikasiportofolio/page";
import { RiwayatAsesmen } from "../app/assessor/riwayatasesmen/page";
import { DetailRiwayatAsesmen } from "../app/assessor/detailriwayatasesmen/page";
import { KonfigurasiPertanyaan } from "../app/assessor/konfigurasipertanyaan/page";
import { TambahKonfigurasiPertanyaan } from "../app/assessor/tambahkonfigurasipertanyaan/page";
import { DetailKonfigurasiPertanyaan } from "../app/assessor/detailkonfigurasipertanyaan/page";
import { JadwalkanOnline } from "../app/assessor/jadwalkanonline/page";
import { PenilaianOnline } from "../app/assessor/penilaianonline/page";

// Asesi Pages
// import AsesiOverview from "./asesi/Overview";
// import EForm from "./asesi/EForm";
// import AsesiHistory from "./asesi/History";
// import AsesiAppeals from "./asesi/Appeals";
// import UjianAsesi from "./asesi/Ujian";

// Direktur & Manajer Pages
// import DirekturDashboard from "./direktur/Dashboard";
// import SidangPleno from "./direktur/Pleno";

function AppContent() {
  const { user, currentView, sidebarCollapsed } = useAppContext();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentView]);

  if (!user) {
    return <Login />;
  }

  const renderView = () => {
    if (currentView === "profile") {
      return <Profile />;
    }

    // Role: Admin
    // if (user.role === "admin") {
    //   switch (currentView) {
    //     case "dashboard":
    //       return <Overview />;
    //     case "schemes":
    //       return <Schemes />;
    //     case "schedules":
    //       return <Schedule />;
    //     case "users":
    //       return <Users />;
    //     case "tuk":
    //       return <Tuk />;
    //     case "reports":
    //       return <Reports />;
    //     default:
    //       return <Overview />;
    //   }
    // }

    // Role: Asesor
    if (user.role === "asesor") {
      switch (currentView) {
        case "dashboard":
          return <AssessorOverview />;
        case "candidates":
          return <AsesiList />;
        case "history-asesmen":
          return <RiwayatAsesmen />;
        case "detail-riwayat-asesmen":
          return <DetailRiwayatAsesmen />;
        case "konfigurasi-pertanyaan":
          return <KonfigurasiPertanyaan />;
        case "tambah-konfigurasi-pertanyaan":
          return <TambahKonfigurasiPertanyaan />;
        case "ubah-konfigurasi-pertanyaan":
          return <TambahKonfigurasiPertanyaan />;
        case "detail-konfigurasi-pertanyaan":
          return <DetailKonfigurasiPertanyaan />;
        case "assessment-form":
          return <AssessmentForm />;
        case "jadwalkan-online":
          return <JadwalkanOnline />;
        case "penilaian-online":
          return <PenilaianOnline />;
        case "finalization":
          return <AssessmentFinalization />;
        case "verifikasi-banding":
          return <VerifikasiBanding />;
        case "verifikasi-apl02":
          return <VerifikasiAPL02 />;
        case "verifikasi-portofolio":
          return <VerifikasiPortofolio />;
        default:
          return <AssessorOverview />;
      }
    }

    // Role: Direktur & Manajer
    // if (user.role === "direktur" || user.role === "manajer") {
    //   switch (currentView) {
    //     case "dashboard":
    //       return <DirekturDashboard />;
    //     case "pleno":
    //       return <SidangPleno />;
    //     default:
    //       return <DirekturDashboard />;
    //   }
    // }

    // Role: Asesi
    // if (user.role === "asesi") {
    //   switch (currentView) {
    //     case "dashboard":
    //       return <AsesiOverview />;
    //     case "apply":
    //       return <EForm />;
    //     case "history":
    //       return <AsesiHistory />;
    //     case "ujian":
    //       return <UjianAsesi />;
    //     case "appeals":
    //       return <AsesiAppeals />;
    //     default:
    //       return <AsesiOverview />;
    //   }
    // }

    return null;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FC]">
      {/* <Header />
      <Sidebar /> */}
      <main
        className={`flex-1 md:ml-20 ${
          sidebarCollapsed ? "lg:ml-20" : "lg:ml-72"
        } transition-all flex flex-col`}
      >
        {currentView !== "dashboard" && currentView !== "ujian" && (
          <div className="px-4 md:px-6 pt-4 pb-1">{/* <Breadcrumb /> */}</div>
        )}
        <div className="flex-1">{renderView()}</div>
      </main>

      {/* Help Button */}
      <a
        href="https://wa.me/628123456789"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-25 flex items-center justify-center w-14 h-14 bg-[#007A55] hover:bg-[#006044] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
      >
        <Headset size={24} />
        <span className="absolute right-16 px-3 py-2 bg-gray-900 text-white text-xs font-bold rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md">
          Butuh bantuan?
        </span>
        <span className="absolute right-15 top-1/2 -translate-y-1/2 border-8 border-transparent border-l-gray-900 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity"></span>
      </a>
    </div>
  );
}

export default function Page() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
