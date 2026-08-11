'use client';

import React from 'react';
import { useState } from 'react';
import { FileEdit, CheckCircle, Video, Eye, AlertCircle, ArrowLeft, Calendar, User } from 'lucide-react';
import { useAppContext } from '@/context/context';

import { FormFRIA04A } from '@/components/forms/FormFRIA04A';
import { FormFRAK07 } from '@/components/forms/FormFRAK07';
import { FormFRAPL02 } from '@/components/forms/FormFRAPL02';

export default function UjianAsesi() {
  const { setCurrentView } = useAppContext();
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [showConfirmFinish, setShowConfirmFinish] = useState(false);

  const examItems = [
    {
      id: 'apl02',
      name: 'Asesmen Mandiri',
      actionType: 'form_apl02',
      canPreview: true,
    },
    {
      id: 'penyesuaian',
      name: 'Penyesuaian Wajar dan Beralasan',
      actionType: 'form_penyesuaian',
      canPreview: false,
    },
    {
      id: 'proyek_a',
      name: 'Penilaian Proyek Singkat',
      actionType: 'form_proyek_a',
      canPreview: true,
    },
    {
      id: 'lisan',
      name: 'Pertanyaan lisan',
      actionType: 'form_lisan',
      canPreview: false,
    }
  ];

  const handleCloseRequest = () => {
    setActiveModal(null);
  };

  const confirmFinishExam = () => {
    setShowConfirmFinish(false);
    setCurrentView('history');
  };

  const activeExam = examItems.find(item => item.actionType === activeModal);
  const activeExamName = activeExam?.name || 'Pratinjau Dokumen';

  function requestNavigation(destination: string): void {
    setActiveModal(null);
    setShowConfirmFinish(false);
    setCurrentView(destination);
  }

  return (
    <>
      {!activeModal ? (
        <div className="space-y-6 pb-24 text-sm text-gray-700">
          <div className="flex flex-wrap items-center justify-between gap-4">
             <div className="flex items-center gap-3 min-w-0">
                <button
                  type="button"
                  onClick={() => requestNavigation('dashboard')}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-[#008BE3] bg-[#008BE3]/10 hover:bg-[#008BE3]/20 transition-colors cursor-pointer shrink-0 mt-0.5"
                  title="Kembali ke Dashboard"
                >
                  <ArrowLeft size={18} />
                </button>
                <div className="w-10 h-10 rounded-lg bg-[#008BE3]/10 flex items-center justify-center text-[#008BE3] border border-[#008BE3]/20 shadow-xs shrink-0">
                  <FileEdit size={20} className="stroke-[2.5]" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-none mb-1 md:whitespace-nowrap">
                    Ujian & Dokumen Asesmen
                  </h2>
                  <p className="text-xs text-gray-400 font-bold tracking-wider uppercase leading-4 md:whitespace-nowrap">
                    Skema: Penerjemah Teks Umum
                  </p>
                </div>
              </div>
            </div>

          <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-[#008BE3]/10 text-[#008BE3] rounded-full flex items-center justify-center shrink-0">
                <Video size={24} />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-lg text-slate-900">Virtual Meeting Ujian Asesmen</h3>
                <p className="text-sm text-slate-600">Silakan bergabung ke virtual meeting pada jadwal yang telah ditentukan.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="border border-slate-200 rounded-lg p-3 bg-slate-50 flex items-center gap-3">
                <Calendar className="text-slate-400" size={20} />
                <div className="min-w-0">
                  <p className="text-xs text-slate-500 font-semibold mb-1 uppercase">Jadwal Ujian</p>
                  <p className="text-sm font-bold text-slate-900">14 Oktober 2026, 08:00 WIB</p>
                </div>
              </div>
              <div className="border border-slate-200 rounded-lg p-3 bg-slate-50 flex items-center gap-3">
                <User className="text-slate-400" size={20} />
                <div className="min-w-0">
                  <p className="text-xs text-slate-500 font-semibold mb-1 uppercase">Nama Asesor</p>
                  <p className="text-sm font-bold text-slate-900">Budi Santoso</p>
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <a href="https://meet.google.com/abc-defg-xyz" target="_blank" rel="noopener noreferrer" className="px-6 py-2.5 bg-[#008BE3] text-white rounded-lg font-bold text-sm hover:bg-[#0076C2] transition-colors flex items-center gap-2">
                <Video size={16} /> Bergabung ke Meeting
              </a>
            </div>
          </div>

          <div className="bg-[#FFFBE6] border border-[#FFE58F] rounded-lg p-3 flex items-center gap-3 text-amber-900 shadow-3xs">
            <AlertCircle size={20} className="text-amber-500 shrink-0" />
            <p className="text-sm leading-relaxed font-semibold">Sebelum mengikuti ujian, pastikan Anda telah membaca dokumen yang wajib dibaca.</p>
          </div>

          <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-200 space-y-3">
               <h3 className="font-bold text-lg text-slate-900">Daftar Ujian</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-150">
                <thead>
                  <tr className="bg-[#0F172A] border-b border-[#0F172A]">
                    <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider text-left w-16">No</th>
                    <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider">Nama Ujian</th>
                    <th className="px-6 py-4 text-xs font-bold text-white/90 uppercase tracking-wider text-right whitespace-nowrap sticky right-0 bg-[#0F172A] z-10 border-l border-white/10 shadow-[-6px_0_15px_-4px_rgba(0,0,0,0.06)]">Dokumen Wajib Dibaca</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {examItems.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4 text-xs md:text-sm text-center font-semibold text-slate-700">
                        {idx + 1}
                      </td>
                      <td className="px-6 py-4 text-xs md:text-sm font-bold text-slate-900">{item.name}</td>
                      <td className="px-6 py-4 text-right sticky right-0 bg-white group-hover:bg-slate-50 z-10 border-l border-gray-100 shadow-[-6px_0_15px_-4px_rgba(0,0,0,0.02)] transition-colors">
                        {item.canPreview ? (
                          <button
                            onClick={() => setActiveModal(item.actionType)}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 transition-colors bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 shadow-sm"
                          >
                            <Eye size={14} /> Lihat Dokumen
                          </button>
                        ) : (
                          <span></span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowConfirmFinish(true)}
                className="w-full sm:w-auto px-8 py-3 bg-[#008BE3] text-white rounded-xl font-bold hover:bg-[#0076C2] transition-colors shadow-sm"
              >
                Selesaikan Ujian
              </button>
          </div>
        </div>
      ) : (
        <div className="min-h-screen bg-slate-100 p-4 md:p-8 flex flex-col gap-6">
          <div className="max-w-5xl mx-auto w-full bg-white rounded-xl shadow-sm border border-slate-200 px-6 py-4 flex items-center gap-4 sticky top-4 z-20 animate-in fade-in slide-in-from-top-4 duration-300">
            <button
              onClick={handleCloseRequest}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-[#008BE3] bg-[#008BE3]/10 hover:bg-[#008BE3]/20 transition-colors cursor-pointer shrink-0 mt-0.5"
              title="Kembali"
            >
              <ArrowLeft size={18} />
            </button>
            <h3 className="font-bold text-slate-800 text-lg">{activeExamName}</h3>
          </div>
          
          <div className="max-w-5xl mx-auto w-full bg-[#FFFBE6] border border-[#FFE58F] rounded-lg p-3 flex items-center gap-3 text-amber-900 shadow-3xs">
            <AlertCircle size={20} className="text-amber-500 shrink-0" />
            <p className="text-sm leading-relaxed font-semibold">
              {activeModal === 'form_apl02' ? 'Dokumen ini akan diperiksa oleh asesor pada saat meeting' : 'Baca dokumen ini sebelum melakukan presentasi proyek'}
            </p>
          </div>
          
          <div className="max-w-5xl mx-auto w-full bg-white rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="p-6 md:p-10">
                <>
                {activeModal === 'form_apl02' && (
                  <FormFRAPL02 
                    asesmenData={{
                      id: 1,
                      nama: 'Ahmad Supriyadi',
                      skema: 'Penerjemah Teks Umum',
                      noSkema: 'CERT-03',
                      tuk: 'Mandiri',
                      tanggal: '14/10/2026',
                      metode: 'Mandiri',
                      status: 'Preview',
                    }}
                    readOnly={true}
                    asesiSignature={"Telah Ditandatangani"}
                    asesorSignature={"Telah Ditandatangani"}
                    asesiDate={"14/10/2026"}
                    asesorDate={"14/10/2026"}
                  />
                )}
                {activeModal === 'form_penyesuaian' && (
                  <FormFRAK07 
                    asesmenData={{
                      id: 2,
                      nama: 'Ahmad Supriyadi',
                      skema: 'Penerjemah Teks Umum',
                      noSkema: 'CERT-03',
                      tuk: 'Mandiri',
                      tanggal: '14/10/2026',
                      metode: 'Mandiri',
                      status: 'Preview',
                    }}
                    readOnly={true}
                    asesiSignature={"Telah Ditandatangani"}
                    asesorSignature={"Telah Ditandatangani"}
                    asesorName="Budi Santoso"
                    asesiDate={"14/10/2026"}
                    asesorDate={"14/10/2026"}
                  />
                )}
                {activeModal === 'form_proyek_a' && (
                  <FormFRIA04A 
                    asesmenData={{
                      id: 3,
                      nama: 'Ahmad Supriyadi',
                      skema: 'Penerjemah Teks Umum',
                      noSkema: 'CERT-03',
                      tuk: 'Mandiri',
                      tanggal: '14/10/2026',
                      metode: 'Mandiri',
                      status: 'Preview',
                    }}
                    readOnly={true}
                    asesiSignature={"Telah Ditandatangani"}
                    asesorSignature={"Telah Ditandatangani"}
                  />
                )}
                <div className="mt-8 pt-6 border-t border-slate-200 flex justify-end gap-3">
                  <button
                    onClick={handleCloseRequest}
                    className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-bold transition-colors cursor-pointer"
                  >
                    Tutup Pratinjau
                  </button>
                </div>
                </>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Finish All Modal */}
      {showConfirmFinish && (
        <div className="fixed inset-0 z-200 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-150">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shrink-0 mx-auto mb-4">
                <CheckCircle size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Selesaikan Ujian?</h3>
              <p className="text-slate-600 text-sm">
                Apakah Anda yakin telah mengikuti seluruh tahapan ujian dengan asesor? Setelah ini Anda akan diarahkan ke halaman Riwayat Asesmen dan tidak dapat kembali ke halaman ini.
              </p>
            </div>
            <div className="p-4 bg-slate-50 flex gap-3 justify-end border-t border-slate-100">
              <button
                onClick={() => setShowConfirmFinish(false)}
                className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={confirmFinishExam}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold hover:bg-emerald-700 transition-colors cursor-pointer"
              >
                Ya, Selesaikan
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
