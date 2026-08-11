"use client";
import React, { useState } from "react";
import { Send, CheckCircle, PenTool } from "lucide-react";
import { useAppContext } from "@/context/context";

export default function AssessmentFinalization() {
  const { setCurrentView } = useAppContext();
  const [signed, setSigned] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = () => {
    if (!signed) return alert("Harap konfirmasi pernyataan sertifikasi");
    setSubmitting(true);
    setTimeout(() => {
      alert("Hasil Difinalisasi!");
      setCurrentView("dashboard");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] p-4 md:p-8 space-y-6 pb-24 text-sm text-gray-700">
      <div className="mb-6 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
          Finalisasi Asesmen
        </h2>
        <p className="text-gray-500 font-medium mt-1 text-sm">
          Tinjau ringkasan data evaluasi dan berikan tanda tangan digital Anda.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <section className="bg-white rounded-lg shadow-xs p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-sky-50 flex items-center justify-center font-black text-2xl text-[#008BE3] border border-sky-100">
                  AR
                </div>
                <div className="min-w-0">
                  <h3 className="text-xl font-black text-slate-900">
                    Anisa Rahmawati
                  </h3>
                  <p className="text-sm font-medium text-gray-500">
                    Jenjang 5 Bidang Kewirausahaan Industri
                  </p>
                </div>
              </div>
              <div className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5">
                <CheckCircle size={14} /> Terverifikasi
              </div>
            </div>
          </section>

          <section className="bg-white rounded-lg shadow-xs p-6 border border-gray-100 space-y-4">
            <h3 className="text-base font-black text-slate-900 mb-2">
              Hasil Penilaian
            </h3>
            <div className="p-5 rounded-lg bg-emerald-50 border border-emerald-200 flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                <CheckCircle size={24} />
              </div>
              <div className="min-w-0">
                <h4 className="font-black text-emerald-800 text-base">
                  Kompeten (K)
                </h4>
                <p className="text-sm text-emerald-700 mt-1 font-medium leading-relaxed">
                  Kandidat telah memenuhi semua persyaratan unit kompetensi dan
                  menunjukkan penguasaan materi sesuai standar skema
                  sertifikasi.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Catatan dari Asesor
              </label>
              <textarea
                rows={3}
                placeholder="Tuliskan catatan dari asesor..."
                className="w-full p-3 border border-slate-200 rounded-lg text-sm focus:ring-1 focus:ring-[#008BE3] focus:outline-none bg-slate-50 focus:bg-white transition-colors"
              />
            </div>
          </section>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <section className="bg-white rounded-lg shadow-xs p-6 border border-gray-100 h-full flex flex-col">
            <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-4">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <PenTool size={18} className="text-[#008BE3]" />
                Tanda Tangan Digital
              </h3>
              <button className="text-xs font-bold text-gray-400 hover:text-red-500 transition-colors">
                Hapus
              </button>
            </div>

            <div className="flex-1 flex flex-col">
              <div className="w-full aspect-3/2 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50 flex items-center justify-center cursor-crosshair mb-6 relative overflow-hidden group">
                <span className="text-gray-400 text-xs font-bold uppercase tracking-widest pointer-events-none absolute group-hover:opacity-50 transition-opacity">
                  Tanda Tangan Disini
                </span>
                {/* Canvas would go here */}
              </div>

              <div className="space-y-4 mt-auto">
                <label className="flex items-start gap-3 cursor-pointer bg-[#F9FAFC] p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                  <input
                    type="checkbox"
                    className="mt-0.5 w-4 h-4 text-[#008BE3] border-gray-300 rounded-lg focus:ring-[#008BE3]"
                    checked={signed}
                    onChange={(e) => setSigned(e.target.checked)}
                  />
                  <span className="text-[11px] md:text-xs text-gray-600 font-medium leading-relaxed">
                    Saya menyatakan bahwa saya telah melakukan asesmen ini
                    sesuai dengan standar LSP dan evaluasi ini bersifat final
                    serta dapat dipertanggungjawabkan.
                  </span>
                </label>

                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="w-full bg-[#008BE3] text-white py-3.5 rounded-lg font-black shadow-xs hover:bg-[#0076C2] transition-all flex items-center justify-center gap-2 disabled:opacity-50 uppercase tracking-wide text-xs mt-2"
                >
                  <Send size={18} />
                  {submitting ? "Memproses..." : "Kirim Hasil Akhir"}
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
