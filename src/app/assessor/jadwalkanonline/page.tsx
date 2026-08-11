"use client";
import React, { useState } from "react";
import {
  Video,
  Clock,
  Link as LinkIcon,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";
import { useAppContext } from "@/context/context";

export default function JadwalkanOnline() {
  const { setCurrentView, selectedAsesmen, updateAssessment } = useAppContext();
  const [tanggal, setTanggal] = useState("");
  const [waktu, setWaktu] = useState("");
  const [linkMeet, setLinkMeet] = useState("");

  const handleSimpan = () => {
    if (selectedAsesmen) {
      let formattedTime = waktu;
      if (waktu) {
        const [hours, minutes] = waktu.split(":");
        const h = parseInt(hours, 10);
        const ampm = h >= 12 ? "PM" : "AM";
        const h12 = h % 12 || 12;
        formattedTime = `${h12}:${minutes} ${ampm}`;
      }

      let formattedDate = tanggal;
      if (tanggal) {
        const dateObj = new Date(tanggal);
        const months = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "Mei",
          "Jun",
          "Jul",
          "Agt",
          "Sep",
          "Okt",
          "Nov",
          "Des",
        ];
        formattedDate = `${dateObj.getDate()} ${months[dateObj.getMonth()]} ${dateObj.getFullYear()}`;
      }

      updateAssessment(selectedAsesmen.id, {
        waktu: formattedTime,
        linkVideo: linkMeet,
        tglAsesmen: formattedDate,
      });
    }
    alert(
      `Jadwal presentasi online berhasil disimpan untuk ${selectedAsesmen?.nama}\nTanggal: ${tanggal}\nWaktu: ${waktu}\nLink: ${linkMeet}`,
    );
    setCurrentView("candidates");
  };

  return (
    <div className="w-full min-h-[calc(100vh-80px)] bg-[#F8F9FC] p-4 flex flex-col items-center justify-center text-sm text-gray-700">
      <div className="w-full max-w-2xl space-y-6 mt-0 md:-mt-20">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setCurrentView("candidates")}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-[#008BE3] bg-[#008BE3]/10 hover:bg-[#008BE3]/20 transition-colors cursor-pointer shrink-0"
              title="Kembali"
            >
              <ArrowLeft size={18} />
            </button>
            <div className="min-w-0">
              <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-none mb-1">
                Jadwalkan Presentasi Online
              </h2>
              <p className="text-xs text-gray-400 font-bold tracking-wider uppercase leading-4">
                Asesi: {selectedAsesmen?.nama} | {selectedAsesmen?.skema}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden w-full">
          <div className="p-6 border-b border-gray-100 bg-[#F9FAFC] flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
              <Video size={20} />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-slate-900 text-base">
                Atur Jadwal Wawancara
              </h3>
              <p className="text-xs text-slate-500">
                Tentukan waktu dan link meeting untuk sesi penilaian akhir.
              </p>
            </div>
          </div>

          <div className="p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-2 uppercase tracking-wider">
                  Tanggal Asesmen
                </label>
                <input
                  type="date"
                  value={tanggal}
                  onChange={(e) => setTanggal(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-2 uppercase tracking-wider">
                  <Clock size={14} /> Waktu Asesmen
                </label>
                <input
                  type="time"
                  value={waktu}
                  onChange={(e) => setWaktu(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-2 uppercase tracking-wider">
                <LinkIcon size={14} /> Link Virtual Meeting (Google Meet/Zoom)
              </label>
              <input
                type="url"
                placeholder="https://meet.google.com/..."
                value={linkMeet}
                onChange={(e) => setLinkMeet(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
              />
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
            <button
              onClick={handleSimpan}
              disabled={!tanggal || !waktu || !linkMeet}
              className="bg-[#008BE3] hover:bg-[#0076C2] disabled:opacity-50 text-white px-6 py-2.5 rounded-lg text-sm font-bold uppercase tracking-wider transition-colors inline-flex items-center gap-2 shadow-sm"
            >
              <CheckCircle size={18} /> Simpan Jadwal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
