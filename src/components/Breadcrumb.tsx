import React from "react";
import { useAppContext } from "@/context/context";

interface Crumb {
  label: string;
  view?: string;
  onClick?: () => void;
}

interface ViewConfig {
  code?: string;
  crumbs: Crumb[];
}

export function Breadcrumb({ className = "" }: { className?: string }) {
  const { user, currentView, requestNavigation, setCurrentView, extraCrumbs } =
    useAppContext();

  if (!user || currentView === "login") return null;

  const homeCrumb: Crumb = { label: "Dashboard", view: "dashboard" };

  const getViewConfig = (): ViewConfig => {
    // Admin Views
    if (user.role === "admin") {
      switch (currentView) {
        case "schemes":
          return {
            crumbs: [homeCrumb, { label: "Kelola Skema", view: "schemes" }],
          };
        case "schedules":
          return {
            crumbs: [homeCrumb, { label: "Jadwal Asesmen", view: "schedules" }],
          };
        case "users":
          return {
            crumbs: [homeCrumb, { label: "Kelola Pengguna", view: "users" }],
          };
        case "tuk":
          return {
            crumbs: [homeCrumb, { label: "Manajemen TUK", view: "tuk" }],
          };
        case "reports":
          return {
            crumbs: [homeCrumb, { label: "Laporan", view: "reports" }],
          };
        case "profile":
          return {
            crumbs: [homeCrumb, { label: "Profil Saya", view: "profile" }],
          };
        default:
          return {
            crumbs: [homeCrumb],
          };
      }
    }

    // Assessor Views
    if (user.role === "asesor") {
      const candidatesCrumb: Crumb = {
        label: "Daftar Asesmen",
        view: "candidates",
      };
      const historyCrumb: Crumb = {
        label: "Riwayat Asesmen",
        view: "history-asesmen",
      };
      const configCrumb: Crumb = {
        label: "Konfigurasi Pertanyaan",
        view: "konfigurasi-pertanyaan",
      };

      switch (currentView) {
        case "candidates":
          return {
            crumbs: [homeCrumb, candidatesCrumb],
          };
        case "assessment-form":
          return {
            crumbs: [
              homeCrumb,
              candidatesCrumb,
              { label: "Form Asesmen", view: "assessment-form" },
            ],
          };
        case "jadwalkan-online":
          return {
            crumbs: [
              homeCrumb,
              candidatesCrumb,
              { label: "Jadwalkan Online", view: "jadwalkan-online" },
            ],
          };
        case "penilaian-online":
          return {
            crumbs: [
              homeCrumb,
              candidatesCrumb,
              { label: "Penilaian Online", view: "penilaian-online" },
            ],
          };
        case "finalization":
          return {
            crumbs: [
              homeCrumb,
              candidatesCrumb,
              { label: "Finalisasi", view: "finalization" },
            ],
          };
        case "history-asesmen":
          return {
            crumbs: [homeCrumb, historyCrumb],
          };
        case "detail-riwayat-asesmen":
          return {
            crumbs: [
              homeCrumb,
              historyCrumb,
              { label: "Detail Riwayat", view: "detail-riwayat-asesmen" },
            ],
          };
        case "verifikasi-apl02":
          return {
            crumbs: [
              homeCrumb,
              { label: "Verifikasi Berkas", view: "verifikasi-apl02" },
            ],
          };
        case "verifikasi-portofolio":
          return {
            crumbs: [
              homeCrumb,
              { label: "Verifikasi Portofolio", view: "verifikasi-portofolio" },
            ],
          };
        case "verifikasi-banding":
          return {
            crumbs: [
              homeCrumb,
              { label: "Verifikasi Banding", view: "verifikasi-banding" },
            ],
          };
        case "konfigurasi-pertanyaan":
          return {
            crumbs: [homeCrumb, configCrumb],
          };
        case "tambah-konfigurasi-pertanyaan":
          return {
            crumbs: [
              homeCrumb,
              configCrumb,
              {
                label: "Buat Paket Soal",
                view: "tambah-konfigurasi-pertanyaan",
              },
            ],
          };
        case "ubah-konfigurasi-pertanyaan":
          return {
            crumbs: [
              homeCrumb,
              configCrumb,
              { label: "Ubah Paket Soal", view: "ubah-konfigurasi-pertanyaan" },
            ],
          };
        case "detail-konfigurasi-pertanyaan":
          return {
            crumbs: [
              homeCrumb,
              configCrumb,
              {
                label: "Detail Paket Soal",
                view: "detail-konfigurasi-pertanyaan",
              },
            ],
          };
        case "profile":
          return {
            crumbs: [homeCrumb, { label: "Profil Saya", view: "profile" }],
          };
        default:
          return {
            crumbs: [homeCrumb],
          };
      }
    }

    // Asesi Views
    if (user.role === "asesi") {
      switch (currentView) {
        case "apply":
          return {
            crumbs: [
              homeCrumb,
              {
                label: "Pengajuan Skema",
                view: "apply",
                onClick: () => {
                  requestNavigation(() => {
                    setCurrentView("apply");
                    window.dispatchEvent(new CustomEvent("reset-eform"));
                  });
                },
              },
            ],
          };
        case "history":
          return {
            crumbs: [
              homeCrumb,
              {
                label: "Riwayat & Sertifikat",
                view: "history",
                onClick: () => {
                  requestNavigation(() => {
                    setCurrentView("history");
                    window.dispatchEvent(new CustomEvent("reset-history"));
                  });
                },
              },
            ],
          };
        case "ujian":
          return {
            crumbs: [homeCrumb, { label: "Ujian Online", view: "ujian" }],
          };
        case "appeals":
          return {
            crumbs: [homeCrumb, { label: "Banding Asesmen", view: "appeals" }],
          };
        case "profile":
          return {
            crumbs: [homeCrumb, { label: "Profil Saya", view: "profile" }],
          };
        default:
          return {
            crumbs: [homeCrumb],
          };
      }
    }

    // Direktur / Manajer Views
    if (user.role === "direktur" || user.role === "manajer") {
      switch (currentView) {
        case "schemes":
          return {
            crumbs: [
              homeCrumb,
              { label: "Skema Sertifikasi", view: "schemes" },
            ],
          };
        case "schedules":
          return {
            crumbs: [
              homeCrumb,
              { label: "Jadwal & Penugasan", view: "schedules" },
            ],
          };
        case "users":
          return {
            crumbs: [homeCrumb, { label: "Daftar Pengguna", view: "users" }],
          };
        case "tuk":
          return {
            crumbs: [homeCrumb, { label: "Manajemen TUK", view: "tuk" }],
          };
        case "reports":
          return {
            crumbs: [homeCrumb, { label: "Laporan", view: "reports" }],
          };
        case "profile":
          return {
            crumbs: [homeCrumb, { label: "Profil Saya", view: "profile" }],
          };
        default:
          return {
            crumbs: [homeCrumb],
          };
      }
    }

    return {
      crumbs: [homeCrumb],
    };
  };

  const { crumbs: baseCrumbs } = getViewConfig();

  const crumbs = [...baseCrumbs, ...(extraCrumbs || [])];

  // "halaman pertama tidak perlu ditulis, jika sudah klik tombol lain baru ditulis 2 judul halaman"
  if (crumbs.length <= 1) {
    return null;
  }

  return (
    <div
      className={`flex items-center gap-2 flex-wrap text-[13px] font-bold text-slate-500 uppercase tracking-wide ${className}`}
    >
      {crumbs.map((crumb, idx) => {
        const isLast = idx === crumbs.length - 1;
        return (
          <React.Fragment key={idx}>
            {idx > 0 && <span className="text-slate-400 mx-1">/</span>}
            {isLast ? (
              <span className="text-[#008BE3] font-black">{crumb.label}</span>
            ) : (
              <button
                type="button"
                onClick={() => {
                  if (crumb.onClick) crumb.onClick();
                  else if (crumb.view) requestNavigation(crumb.view);
                }}
                className="text-slate-500 hover:text-[#008BE3] transition-colors cursor-pointer uppercase"
              >
                {crumb.label}
              </button>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
