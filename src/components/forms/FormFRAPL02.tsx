import React, { useState } from 'react';
import { Eye, CheckCircle, PenTool } from 'lucide-react';
import { FormHeader } from './FormHeader';
import { SignatureModal } from './SignatureModal';
import { AVAILABLE_SCHEMES } from '../../data/schemes';

export const DEFAULT_APL02_UNITS = [
  {
    code: 'UK.01',
    title: 'Melaksanakan Pemeriksaan Dokumen dan Persyaratan Asesmen',
    elemen: [
      {
        title: 'Menyiapkan pemeriksaan dokumen',
        kuk: [
          'Dokumen permohonan asesmen diverifikasi kelengkapannya.',
          'Alat dan perangkat pendukung asesmen disiapkan sesuai prosedur.'
        ]
      },
      {
        title: 'Melakukan pemeriksaan kesesuaian bukti',
        kuk: [
          'Pemeriksaan bukti relevan dilakukan sesuai standar skema.',
          'Hasil evaluasi dicatat dalam format laporan.'
        ]
      }
    ]
  },
  {
    code: 'UK.02',
    title: 'Membuat Laporan Hasil Evaluasi Portofolio dan Asesmen Mandiri',
    elemen: [
      {
        title: 'Menyusun ringkasan bukti',
        kuk: [
          'Ringkasan bukti disusun berdasarkan kriteria keabsahan.',
          'Laporan direviu oleh asesor sebelum dikirimkan.'
        ]
      }
    ]
  }
];

export interface FormFRAPL02Props {
  asesmenData?: any;
  units?: Array<{
    code: string;
    title: string;
    elemen: Array<{
      title: string;
      kuk: string[];
    }>;
  }>;
  answers?: Record<string, 'K' | 'BK'>;
  onAnswerChange?: (key: string, value: 'K' | 'BK') => void;
  evidenceFiles?: Record<string, any>;
  rekomendasi?: 'Dapat dilanjutkan' | 'Tidak dapat dilanjutkan' | '';
  onRekomendasiChange?: (val: 'Dapat dilanjutkan' | 'Tidak dapat dilanjutkan' | '') => void;
  asesiName?: string;
  onAsesiNameChange?: (val: string) => void;
  asesiSignature?: string;
  onAsesiSignatureChange?: (val: string) => void;
  asesiDate?: string;
  onAsesiDateChange?: (val: string) => void;
  asesorName?: string;
  onAsesorNameChange?: (val: string) => void;
  asesorReg?: string;
  onAsesorRegChange?: (val: string) => void;
  asesorSignature?: string;
  onAsesorSignatureChange?: (val: string) => void;
  asesorDate?: string;
  onAsesorDateChange?: (val: string) => void;
  penyusun?: Array<{ nama: string; noMet: string; ttdTanggal: string }>;
  onPenyusunChange?: (penyusun: Array<{ nama: string; noMet: string; ttdTanggal: string }>) => void;
  validator?: Array<{ nama: string; noMet: string; ttdTanggal: string }>;
  onValidatorChange?: (validator: Array<{ nama: string; noMet: string; ttdTanggal: string }>) => void;
  readOnly?: boolean;
  showHeader?: boolean;
  onNext?: () => void;
  onPrev?: () => void;
  isNextDisabled?: boolean;
  isAsesi?: boolean;
}

export function FormFRAPL02(props: FormFRAPL02Props) {
  React.useEffect(() => {
    const handleScroll = (e: Event) => {
      const customEvent = e as CustomEvent;
      const fieldKey = customEvent.detail;
      const el = document.getElementById(`row-${fieldKey}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('bg-red-50');
        setTimeout(() => el.classList.remove('bg-red-50'), 2000);
      }
    };
    window.addEventListener('scroll-to-unfilled', handleScroll);
    return () => window.removeEventListener('scroll-to-unfilled', handleScroll);
  }, []);
  
  const matchedScheme = AVAILABLE_SCHEMES.find(
    s => s.name === props.asesmenData?.skema || s.code === props.asesmenData?.noSkema
  );
  const units = props.units || props.asesmenData?.schemeDetail?.units || matchedScheme?.units || DEFAULT_APL02_UNITS;

  const [localAnswers, setLocalAnswers] = useState<Record<string, 'K' | 'BK'>>({
    u0e0: 'K',
    u0e1: 'K',
    u1e0: 'K'
  });
  const [localRekomendasi, setLocalRekomendasi] = useState<'Dapat dilanjutkan' | 'Tidak dapat dilanjutkan' | ''>('Dapat dilanjutkan');
  const [localAsesiName, setLocalAsesiName] = useState(props.asesmenData?.nama || 'AHMAD FAUZI');
  const [localAsesiSig, setLocalAsesiSig] = useState('');
  const [localAsesiDate, setLocalAsesiDate] = useState(props.asesmenData?.tanggal || new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }));
  
  const [localAsesorName, setLocalAsesorName] = useState(props.asesmenData?.asesor || '');
  const [localAsesorReg, setLocalAsesorReg] = useState(props.asesmenData?.asesorReg || '');
  const [localAsesorSig, setLocalAsesorSig] = useState('');
  const [localAsesorDate, setLocalAsesorDate] = useState(props.asesmenData?.tanggal || new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }));

  const defaultPenyusun = [
    { nama: props.asesmenData?.asesor || '', noMet: props.asesmenData?.asesorReg || '', ttdTanggal: props.asesmenData?.tanggal || '' },
    { nama: '', noMet: '', ttdTanggal: '' }
  ];
  const defaultValidator = [
    { nama: '', noMet: '', ttdTanggal: '' },
    { nama: '', noMet: '', ttdTanggal: '' }
  ];

  const [localPenyusun, setLocalPenyusun] = useState(defaultPenyusun);
  const [localValidator, setLocalValidator] = useState(defaultValidator);

  const [isAsesiSigModalOpen, setIsAsesiSigModalOpen] = useState(false);
  const [isAsesorSigModalOpen, setIsAsesorSigModalOpen] = useState(false);

  const answers = props.answers || localAnswers;
  const rekomendasi = props.rekomendasi !== undefined ? props.rekomendasi : localRekomendasi;
  const asesiName = props.asesiName !== undefined ? props.asesiName : localAsesiName;
  const asesiSignature = props.asesiSignature !== undefined ? props.asesiSignature : localAsesiSig;
  const asesiDate = props.asesiDate !== undefined ? props.asesiDate : localAsesiDate;
  const asesorName = props.asesorName !== undefined ? props.asesorName : localAsesorName;
  const asesorReg = props.asesorReg !== undefined ? props.asesorReg : localAsesorReg;
  const asesorSignature = props.asesorSignature !== undefined ? props.asesorSignature : localAsesorSig;
  const asesorDate = props.asesorDate !== undefined ? props.asesorDate : localAsesorDate;
  const penyusun = props.penyusun || localPenyusun;
  const validator = props.validator || localValidator;

  const handleAnswerChangeInternal = (key: string, val: 'K' | 'BK') => {
    if (props.onAnswerChange) {
      props.onAnswerChange(key, val);
    } else {
      setLocalAnswers(prev => ({ ...prev, [key]: val }));
    }
  };

  const handleRekomendasiChangeInternal = (val: 'Dapat dilanjutkan' | 'Tidak dapat dilanjutkan' | '') => {
    if (props.onRekomendasiChange) {
      props.onRekomendasiChange(val);
    } else {
      setLocalRekomendasi(val);
    }
  };

  return (
    <div className="animate-in fade-in duration-300">
      {props.showHeader !== false && (
        <FormHeader 
          title="FR.APL.02 ASESMEN MANDIRI" 
          formCode="FR.APL.02" 
          asesmenData={props.asesmenData}
        />
      )}

      {/* Skema Info Box */}
      <table className="w-full border-collapse border border-slate-300 text-xs sm:text-sm mb-6 bg-white">
        <tbody>
          <tr>
            <td className="border border-slate-300 p-3 font-semibold w-[180px] bg-slate-50 text-center align-middle">Skema Sertifikasi</td>
            <td className="border border-slate-300 p-0">
              <table className="w-full h-full border-collapse">
                <tbody>
                  <tr>
                    <td className="border-b border-r border-slate-300 p-2.5 font-semibold w-1/6 bg-slate-50/50">Judul :</td>
                    <td className="border-b border-slate-300 p-2.5 font-bold text-slate-900">{props.asesmenData?.skema || 'Pengelolaan Pinjaman / Pembiayaan'}</td>
                  </tr>
                  <tr>
                    <td className="border-r border-slate-300 p-2.5 font-semibold w-1/6 bg-slate-50/50">Nomor :</td>
                    <td className="p-2.5 font-medium text-slate-700">{props.asesmenData?.noSkema || '006/SKM/LSP-KJN/II/2023'}</td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Guide Box */}
      <div className="border border-slate-300 mb-6 bg-white">
        <div className="border-b border-slate-300 p-3 bg-slate-50 font-bold text-xs sm:text-sm uppercase text-slate-800">
          Panduan Asesmen Mandiri
        </div>
        <div className="p-4 text-xs sm:text-sm space-y-2 text-slate-700">
          <p className="font-bold">Instruksi:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Baca setiap pertanyaan di kolom sebelah kiri.</li>
            <li>Beri tanda centang pada kotak K (Kompeten) jika Anda yakin dapat melakukan tugas yang dijelaskan, atau BK (Belum Kompeten) jika tidak.</li>
            <li>Isi kolom di sebelah kanan dengan mendaftar bukti yang Anda miliki.</li>
          </ul>
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto border border-slate-300 mb-6 bg-white">
      <table className="w-full border-collapse text-xs sm:text-sm min-w-[700px]">
        <thead>
          <tr className="bg-slate-100 border-b border-slate-300 text-slate-900">
            <th className="border border-slate-300 p-3 font-bold text-left w-1/2">Unit Kompetensi</th>
            <th className="border border-slate-300 p-3 font-bold text-center w-14">K</th>
            <th className="border border-slate-300 p-3 font-bold text-center w-14">BK</th>
            <th className="border border-slate-300 p-3 font-bold text-center w-1/3">Bukti Yang Relevan</th>
          </tr>
        </thead>
        <tbody>
          {units.map((unit, idx) => (
            <React.Fragment key={idx}>
              <tr className="bg-slate-50 border-t-2 border-slate-300">
                <td className="border border-slate-300 p-3 font-bold text-slate-900" colSpan={4}>
                  Unit Kompetensi {idx + 1} : Kode : <span className="text-[#008BE3]">{unit.code}</span><br/>
                  Judul : {unit.title}
                </td>
              </tr>
              <tr className="bg-white">
                <td className="border border-slate-300 p-2.5 font-semibold text-slate-700">Dapatkah Saya ? {!props.readOnly && <span className="text-red-500">*</span>}</td>
                <td className="border border-slate-300 p-2 text-center font-bold bg-slate-50/50">K</td>
                <td className="border border-slate-300 p-2 text-center font-bold bg-slate-50/50">BK</td>
                <td className="border border-slate-300 p-2"></td>
              </tr>
              {(unit.elemen || []).map((el, eIdx) => {
                const fieldKey = `u${idx}e${eIdx}`;
                const fileKey = unit.code + " - " + el.title;
                const fileObj = props.evidenceFiles?.[fileKey];
                return (
                  <tr key={eIdx} id={`row-${fieldKey}`} className="align-top hover:bg-slate-50/60 transition-colors scroll-m-20">
                    <td className="border border-slate-300 p-4">
                      <div className="font-bold text-slate-900 mb-2">{eIdx + 1}. Elemen: {el.title}</div>
                      <div className="pl-2">
                        <div className="font-semibold text-xs text-slate-500 mb-1">Kriteria Unjuk Kerja:</div>
                        <ul className="space-y-1">
                          {(el.kuk || []).map((k, kIdx) => (
                            <li key={kIdx} className="text-slate-700 text-xs flex items-start gap-1.5">
                              <span className="text-slate-400">•</span>
                              <span>{k}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </td>
                    <td className="border border-slate-300 p-2 text-center align-middle">
                      <input 
                        type="radio" 
                        disabled={props.readOnly} 
                        name={fieldKey} 
                        checked={answers[fieldKey] === 'K'} 
                        onChange={() => handleAnswerChangeInternal(fieldKey, 'K')} 
                        className="w-4 h-4 text-[#008BE3] focus:ring-[#008BE3] cursor-pointer" 
                      />
                    </td>
                    <td className="border border-slate-300 p-2 text-center align-middle">
                      <input 
                        type="radio" 
                        disabled={props.readOnly} 
                        name={fieldKey} 
                        checked={answers[fieldKey] === 'BK'} 
                        onChange={() => handleAnswerChangeInternal(fieldKey, 'BK')} 
                        className="w-4 h-4 text-[#008BE3] focus:ring-[#008BE3] cursor-pointer" 
                      />
                    </td>
                    <td className="border border-slate-300 p-3 align-middle text-center">
                      <div className="flex flex-col items-center justify-center gap-1.5">
                        {fileObj ? (
                          <>
                            <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                              <CheckCircle className="w-3.5 h-3.5" />
                              Telah Dilampirkan
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                const files = Array.isArray(fileObj) ? fileObj : [fileObj];
                                if (files.length > 0) {
                                  const f = files[0];
                                  if (f instanceof File) {
                                    window.open(URL.createObjectURL(f), '_blank');
                                  } else if (f.url) {
                                    window.open(f.url, '_blank');
                                  } else {
                                    alert('Pratinjau dokumen: ' + (f.name || 'File Bukti'));
                                  }
                                }
                              }}
                              className="text-[#008BE3] hover:text-[#0076C2] text-xs font-bold flex items-center gap-1 hover:underline transition-all mt-0.5 cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" /> Lihat Bukti
                            </button>
                          </>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </React.Fragment>
          ))}
        </tbody>
      </table>
      </div>

      {/* Recommendation and Signatures Section */}
      <table className="w-full border-collapse border border-slate-300 text-xs sm:text-sm mb-6 bg-white table-fixed">
        <tbody>
          <tr>
            <td className="border border-slate-300 p-4 w-1/2 align-top bg-white">
              <p className="font-bold mb-3 text-slate-900">Rekomendasi Untuk Asesi:</p>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer text-slate-800">
                  <input 
                    type="radio" 
                    name="rekomendasi_apl02"
                    disabled={props.readOnly || props.isAsesi}
                    checked={rekomendasi === 'Dapat dilanjutkan'}
                    onChange={() => handleRekomendasiChangeInternal('Dapat dilanjutkan')}
                    className="w-4 h-4 text-[#008BE3] focus:ring-[#008BE3]"
                  />
                  <span>Asesmen dapat dilanjutkan</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-slate-800">
                  <input 
                    type="radio" 
                    name="rekomendasi_apl02"
                    disabled={props.readOnly || props.isAsesi}
                    checked={rekomendasi === 'Tidak dapat dilanjutkan'}
                    onChange={() => handleRekomendasiChangeInternal('Tidak dapat dilanjutkan')}
                    className="w-4 h-4 text-[#008BE3] focus:ring-[#008BE3]"
                  />
                  <span>Asesmen tidak dapat dilanjutkan</span>
                </label>
              </div>
            </td>
            <td className="border border-slate-300 p-4 w-1/2 align-top bg-white">
              {/* Asesi Section */}
              <div className="mb-6">
                <p className="font-bold mb-2 text-slate-900">Asesi :</p>
                <div className="mb-3">
                  <span className="font-semibold inline-block w-20 text-slate-600">Nama:</span>
                  <span className="font-bold text-slate-900">{asesiName}</span>
                </div>
                <div>
                  <span className="font-semibold inline-block mb-1 text-slate-600">Tanda Tangan & Tanggal:</span>
                  <div 
                    onClick={() => !props.readOnly && setIsAsesiSigModalOpen(true)}
                    className={`border border-slate-300 rounded-lg p-3 min-h-[70px] bg-slate-50/50 flex flex-col justify-center items-center relative ${!props.readOnly ? 'cursor-pointer hover:bg-slate-100/80 transition-colors' : ''}`}
                  >
                    {asesiSignature ? (
                      <div className="flex flex-col items-center">
                        {asesiSignature.startsWith('data:image') ? (
                          <img src={asesiSignature} alt="Tanda Tangan Asesi" className="max-h-16 object-contain" />
                        ) : (
                          <span className="font-script text-lg text-slate-800">{asesiSignature}</span>
                        )}
                        <span className="text-[10px] text-slate-400 mt-1">{asesiDate}</span>
                      </div>
                    ) : (
                      <div className="text-slate-400 text-xs flex items-center gap-1.5 font-medium">
                        <PenTool size={14} />
                        <span>{props.readOnly ? '(Tanda tangan terlampir)' : 'Klik untuk tanda tangan Asesi'}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Asesor Section */}
              <div className="border-t border-slate-200 pt-4">
                <p className="font-bold mb-2 text-slate-900">Ditinjau Oleh Asesor :</p>
                <div className="mb-2">
                  <span className="font-semibold inline-block w-20 text-slate-600">Nama:</span>
                  <span className="font-bold text-slate-900">{asesorName || (props.isAsesi ? <span className="text-gray-400 font-medium italic">(Belum ditugaskan)</span> : '')}</span>
                </div>
                <div className="mb-3">
                  <span className="font-semibold inline-block w-20 text-slate-600">No Reg:</span>
                  <span className="font-mono text-slate-800">{asesorReg || (props.isAsesi ? <span className="text-gray-400 font-medium font-sans italic">(Belum ditugaskan)</span> : '')}</span>
                </div>
                <div>
                  <span className="font-semibold inline-block mb-1 text-slate-600">Tanda Tangan & Tanggal:</span>
                  <div 
                    onClick={() => !props.readOnly && !props.isAsesi && setIsAsesorSigModalOpen(true)}
                    className={`border border-slate-300 rounded-lg p-3 min-h-[70px] bg-slate-50/50 flex flex-col justify-center items-center relative ${(!props.readOnly && !props.isAsesi) ? 'cursor-pointer hover:bg-slate-100/80 transition-colors' : ''}`}
                  >
                    {asesorSignature ? (
                      <div className="flex flex-col items-center">
                        {asesorSignature.startsWith('data:image') ? (
                          <img src={asesorSignature} alt="Tanda Tangan Asesor" className="max-h-16 object-contain" />
                        ) : (
                          <span className="font-script text-lg text-slate-800">{asesorSignature}</span>
                        )}
                        <span className="text-[10px] text-slate-400 mt-1">{asesorDate}</span>
                      </div>
                    ) : (
                      <div className="text-slate-400 text-xs flex items-center gap-1.5 font-medium">
                        <PenTool size={14} />
                        <span>{(props.readOnly || props.isAsesi) ? '(Belum ditandatangani)' : 'Klik untuk tanda tangan Asesor'}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Penyusun & Validator Table */}
      <div className="border border-slate-300 bg-white p-4 mb-6 text-xs sm:text-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-bold text-slate-900 mb-2 border-b border-slate-200 pb-1">Penyusun Tim Asesor</h4>
            <div className="space-y-2">
              {penyusun.map((p, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-slate-400 w-4 font-bold">{i + 1}.</span>
                  <input 
                    type="text" 
                    placeholder="Nama Penyusun" 
                    value={p.nama}
                    disabled={props.readOnly}
                    onChange={(e) => {
                      const updated = [...penyusun];
                      updated[i] = { ...updated[i], nama: e.target.value };
                      if (props.onPenyusunChange) props.onPenyusunChange(updated);
                      else setLocalPenyusun(updated);
                    }}
                    className="flex-1 p-1.5 border border-slate-200 rounded text-xs bg-slate-50/50 focus:bg-white"
                  />
                  <input 
                    type="text" 
                    placeholder="No. MET" 
                    value={p.noMet}
                    disabled={props.readOnly}
                    onChange={(e) => {
                      const updated = [...penyusun];
                      updated[i] = { ...updated[i], noMet: e.target.value };
                      if (props.onPenyusunChange) props.onPenyusunChange(updated);
                      else setLocalPenyusun(updated);
                    }}
                    className="w-28 p-1.5 border border-slate-200 rounded text-xs bg-slate-50/50 focus:bg-white"
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-2 border-b border-slate-200 pb-1">Validator / Lead Asesor</h4>
            <div className="space-y-2">
              {validator.map((v, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-slate-400 w-4 font-bold">{i + 1}.</span>
                  <input 
                    type="text" 
                    placeholder="Nama Validator" 
                    value={v.nama}
                    disabled={props.readOnly}
                    onChange={(e) => {
                      const updated = [...validator];
                      updated[i] = { ...updated[i], nama: e.target.value };
                      if (props.onValidatorChange) props.onValidatorChange(updated);
                      else setLocalValidator(updated);
                    }}
                    className="flex-1 p-1.5 border border-slate-200 rounded text-xs bg-slate-50/50 focus:bg-white"
                  />
                  <input 
                    type="text" 
                    placeholder="No. MET" 
                    value={v.noMet}
                    disabled={props.readOnly}
                    onChange={(e) => {
                      const updated = [...validator];
                      updated[i] = { ...updated[i], noMet: e.target.value };
                      if (props.onValidatorChange) props.onValidatorChange(updated);
                      else setLocalValidator(updated);
                    }}
                    className="w-28 p-1.5 border border-slate-200 rounded text-xs bg-slate-50/50 focus:bg-white"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Navigation Buttons */}
      {(props.onPrev || props.onNext) && (
        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          {props.onPrev ? (
            <button
              onClick={props.onPrev}
              className="px-5 py-2.5 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-bold transition-colors cursor-pointer"
            >
              Kembali
            </button>
          ) : <div />}
          
          {props.onNext && (
            <button
              onClick={props.onNext}
              disabled={props.isNextDisabled}
              className="px-6 py-2.5 bg-[#008BE3] hover:bg-[#0076C2] text-white rounded-lg text-xs font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Selanjutnya
            </button>
          )}
        </div>
      )}

      {/* Signature Modals */}
      <SignatureModal
        isOpen={isAsesiSigModalOpen}
        onClose={() => setIsAsesiSigModalOpen(false)}
        title="Tanda Tangan Asesi"
        initialSignature={asesiSignature}
        onSave={(sigData) => {
          if (props.onAsesiSignatureChange) props.onAsesiSignatureChange(sigData);
          else setLocalAsesiSig(sigData);
        }}
      />

      <SignatureModal
        isOpen={isAsesorSigModalOpen}
        onClose={() => setIsAsesorSigModalOpen(false)}
        title="Tanda Tangan Asesor"
        initialSignature={asesorSignature}
        onSave={(sigData) => {
          if (props.onAsesorSignatureChange) props.onAsesorSignatureChange(sigData);
          else setLocalAsesorSig(sigData);
        }}
      />
    </div>
  );
}
