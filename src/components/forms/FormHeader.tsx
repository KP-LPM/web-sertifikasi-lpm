import React from "react";

export interface FormHeaderProps {
  title: string;
  formCode: string;
  asesmenData?: {
    nama?: string;
    skema?: string;
    noSkema?: string;
    tuk?: string;
    tanggal?: string;
    asesor?: string;
  };
  compact?: boolean;
}

export function FormHeader({
  title,
  formCode,
  asesmenData,
  compact = false,
}: FormHeaderProps) {
  const data = {
    nama: asesmenData?.nama || "Ahmad Supriyadi",
    skema: asesmenData?.skema || "Teknisi Muda Jaringan Komputer",
    noSkema: asesmenData?.noSkema || "04/SKM/LSP P1 UIN SGD/V/2022",
    tuk: asesmenData?.tuk || "TUK Sewaktu LSP",
    tanggal: asesmenData?.tanggal || "11 Oktober 2024",
    asesor: asesmenData?.asesor || "Ichsan Taufik",
  };

  if (compact) {
    return (
      <div className="mb-6 border-b-2 border-slate-800 pb-3">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h1 className="font-serif text-lg font-bold text-slate-900">
              {formCode}
            </h1>
            <h2 className="font-serif text-base font-bold text-slate-800 uppercase">
              {title}
            </h2>
          </div>
          <div className="text-right">
            <div className="font-serif text-xl font-bold tracking-tighter text-slate-900">
              LSP
            </div>
            <div className="text-[10px] text-slate-500 font-sans">
              Lembaga Sertifikasi Profesi
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8 border-b-2 border-slate-800 pb-4">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="font-serif text-xl font-bold text-slate-900">
            {formCode}
          </h1>
          <h2 className="font-serif text-lg font-bold text-slate-800 uppercase">
            {title}
          </h2>
        </div>
        <div className="text-right">
          <div className="font-serif text-2xl font-bold tracking-tighter text-slate-900">
            LSP
          </div>
          <div className="text-xs text-slate-500 font-sans">
            Lembaga Sertifikasi Profesi
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-fixed text-xs sm:text-sm border-collapse border border-slate-300">
          <tbody>
            <tr>
              <td className="border border-slate-300 p-2 bg-white w-35 sm:w-45 font-semibold text-center align-middle">
                Skema Sertifikasi
              </td>
              <td className="border border-slate-300 p-2 font-bold wrap-break-word break-all sm:break-normal">
                {data.skema}
              </td>
            </tr>
            <tr>
              <td className="border border-slate-300 p-2 bg-white font-semibold text-center align-middle">
                Nomor Skema
              </td>
              <td className="border border-slate-300 p-2 wrap-break-word break-all sm:break-normal">
                {data.noSkema}
              </td>
            </tr>
            <tr>
              <td className="border border-slate-300 p-2 bg-white font-semibold text-center align-middle">
                TUK
              </td>
              <td className="border border-slate-300 p-2">{data.tuk}</td>
            </tr>
            <tr>
              <td className="border border-slate-300 p-2 bg-white font-semibold text-center align-middle">
                Nama Asesor
              </td>
              <td className="border border-slate-300 p-2">{data.asesor}</td>
            </tr>
            <tr>
              <td className="border border-slate-300 p-2 bg-white font-semibold text-center align-middle">
                Nama Asesi
              </td>
              <td className="border border-slate-300 p-2">{data.nama}</td>
            </tr>
            <tr>
              <td className="border border-slate-300 p-2 bg-white font-semibold text-center align-middle">
                Tanggal
              </td>
              <td className="border border-slate-300 p-2">{data.tanggal}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
