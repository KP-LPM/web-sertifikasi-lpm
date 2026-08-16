import { SignatureField } from '@/components/forms/asesi/SignatureField';
import React from 'react';
import { Eye } from 'lucide-react';

export interface FormDataType {
  readOnly?: boolean;
  isAdmin?: boolean;
  tujuan?: string;
  checklist?: Record<string, 'memenuhi' | 'tidak_memenuhi'>;
  nik?: string;
  tempatLahir?: string;
  tanggalLahir?: string;
  institusiPerusahaan?: string;
  schemeDetail?: {
    persyaratanDasar?: (string | { name: string })[];
    buktiAdministratif?: string[];
    buktiKompetensi?: string[];
    [key: string]: unknown;
  };
  onPreview?: (req: string) => void;
  [key: string]: unknown;
}

type SignatureValue = {
  type: 'auto' | 'upload' | 'draw';
  data?: string;
};

export function EFormApl01({ formData, onChange }: { formData: FormDataType, onChange: (val: FormDataType) => void }) {
  const getSignatureValue = (value: unknown): SignatureValue | undefined => {
    if (typeof value === 'object' && value !== null) {
      const candidate = value as Partial<SignatureValue>;
      if (candidate.type === 'auto' || candidate.type === 'upload' || candidate.type === 'draw') {
        return {
          type: candidate.type,
          data: typeof candidate.data === 'string' ? candidate.data : undefined,
        };
      }
    }

    return value ? { type: 'auto' } : undefined;
  };

  const Input = ({ field, fallback }: { field: string, fallback?: string }) => {
    const value = formData[field] as string | undefined;
    if (formData?.readOnly) return <span>{value || fallback || ''}</span>;
    return <input type="text" className="w-full border border-slate-300 rounded p-1 text-xs outline-none focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3]" value={value || ''} onChange={(e) => onChange({...formData, [field]: e.target.value})} placeholder={fallback || ''} />;
  };

  // Menggunakan React.useState agar tidak error
  const [highlightTujuan, setHighlightTujuan] = React.useState(false);

  // Menggunakan React.useEffect
  React.useEffect(() => {
    const handleScroll = () => {
      setHighlightTujuan(true);
      setTimeout(() => {
        document.getElementById('tujuan-asesmen-row')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    };
    window.addEventListener('scroll-to-apl01-error', handleScroll);
    return () => window.removeEventListener('scroll-to-apl01-error', handleScroll);
  }, []);

  const handleChangeTujuan = (val: string) => {
    setHighlightTujuan(false);
    onChange({...formData, tujuan: val});
  };

  const handleCheck = (key: string, value: 'memenuhi' | 'tidak_memenuhi') => {
    if (formData?.readOnly || !formData?.isAdmin) return;
    const newChecklist = { ...(formData.checklist || {}) };
    newChecklist[key] = value;
    onChange({ ...formData, checklist: newChecklist });
  };

  return (
    <div className="bg-white border border-slate-300 shadow-sm p-8 w-full mx-auto font-sans text-xs sm:text-sm text-slate-800 space-y-6">
      <div className="flex items-center gap-4 border-b-2 border-slate-800 pb-4">
        <div className="w-16 h-16 rounded-full border border-slate-400 flex items-center justify-center shrink-0 font-bold text-[10px] text-center p-1">
          LSP KJN
        </div>
        <div className="min-w-0">
          <h2 className="font-black text-lg">FR.APL.01 PERMOHONAN SERTIFIKASI KOMPETENSI</h2>
        </div>
      </div>

      <div>
        <h3 className="font-bold text-sm mb-1">Bagian 1 : Rincian Data Pemohon Sertifikasi</h3>
        <p className="text-xs text-slate-600 mb-4">Pada bagian ini, cantumkan data pribadi, data pendidikan formal serta data pekerjaan anda pada saat ini.</p>
        
        <h4 className="font-bold mb-2 text-xs">A. Data Pribadi</h4>
        <div className="overflow-x-auto mb-4 ">
        <table className="w-full border-collapse border border-slate-300 min-w-[500px] text-xs">
          <tbody>
            <tr>
              <td className="border border-slate-300 p-2 font-semibold w-1/3 bg-white">Nama Lengkap :</td>
              <td className="border border-slate-300 p-2" colSpan={3}><Input field="namaLengkap" fallback="AHMAD FAUZI" /></td>
            </tr>
            <tr>
              <td className="border border-slate-300 p-2 font-semibold bg-white">No. KTP/NIK/Paspor :</td>
              <td className="border border-slate-300 p-2" colSpan={3}>{formData?.nik || '3273253011090045'}</td>
            </tr>
            <tr>
              <td className="border border-slate-300 p-2 font-semibold bg-white">Tempat / Tgl. Lahir :</td>
              <td className="border border-slate-300 p-2" colSpan={3}>{formData?.tempatLahir || 'Bandung'} / {formData?.tanggalLahir || '13-07-1996'}</td>
            </tr>
            <tr>
              <td className="border border-slate-300 p-2 font-semibold bg-white">Jenis Kelamin :</td>
              <td className="border border-slate-300 p-2" colSpan={3}><Input field="jenisKelamin" fallback="Laki-laki" /></td>
            </tr>
            <tr>
              <td className="border border-slate-300 p-2 font-semibold bg-white">Alamat Rumah :</td>
              <td className="border border-slate-300 p-2" colSpan={3}><Input field="alamat" fallback="Jl Cipadung" /></td>
            </tr>
          </tbody>
        </table>
        </div>

        <h4 className="font-bold mb-2 text-xs mt-4">B. Data Pekerjaan Sekarang</h4>
        <div className="overflow-x-auto mb-6 ">
        <table className="w-full border-collapse border border-slate-300 min-w-[500px] text-xs">
          <tbody>
            <tr>
              <td className="border border-slate-300 p-2 font-semibold w-1/3 bg-white">Nama Institusi / Perusahaan :</td>
              <td className="border border-slate-300 p-2">{formData?.institusiPerusahaan || 'PNS'}</td>
            </tr>
            <tr>
              <td className="border border-slate-300 p-2 font-semibold bg-white">Jabatan :</td>
              <td className="border border-slate-300 p-2"><Input field="jabatan" fallback="PNS" /></td>
            </tr>
          </tbody>
        </table>
        </div>

        <h3 className="font-bold text-sm mb-1 mt-6">Bagian 2 : Data Sertifikasi</h3>
        <p className="text-xs text-slate-600 mb-2">Tuliskan Judul dan Nomor Skema Sertifikasi yang anda ajukan berikut Daftar Unit Kompetensi.</p>
        
        <div className="overflow-x-auto mb-6 ">
        <table className="w-full border-collapse border border-slate-300 min-w-[600px] text-xs">
          <tbody>
            <tr>
              <td className="border border-slate-300 p-2 font-semibold w-1/3 bg-white whitespace-nowrap" rowSpan={2}>Skema Sertifikasi</td>
              <td className="border border-slate-300 p-2 font-semibold bg-white w-1/6 whitespace-nowrap">Judul :</td>
              <td className="border border-slate-300 p-2 whitespace-nowrap font-medium text-slate-800">Pengelolaan Pinjaman / Pembiayaan</td>
            </tr>
            <tr>
              <td className="border border-slate-300 p-2 font-semibold bg-white">Nomor :</td>
              <td className="border border-slate-300 p-2">006/SKM/LSP-KJN/II/2023</td>
            </tr>
            
            {/* Bagian Tujuan Asesmen yang sudah disempurnakan */}
            <tr 
              id="tujuan-asesmen-row" 
              className={highlightTujuan && !formData.tujuan ? "bg-red-50 transition-colors shadow-inner" : ""}
            >
              <td className={`border border-slate-300 p-2 font-semibold bg-white ${highlightTujuan && !formData.tujuan ? "text-red-600 border-l-4 border-l-red-500" : ""}`} rowSpan={4}>
                Tujuan Asesmen {formData?.readOnly ? '' : <span className="text-red-500">*</span>} :
              </td>
              <td className="border border-slate-300 p-2 text-center">
                <input type="radio" disabled={formData?.readOnly || formData?.isAdmin} name="tujuan" checked={formData.tujuan === 'Sertifikasi'} onChange={() => handleChangeTujuan('Sertifikasi')} />
              </td>
              <td className="border border-slate-300 p-2">Sertifikasi</td>
            </tr>
            <tr className={highlightTujuan && !formData.tujuan ? "bg-red-50" : ""}>
              <td className="border border-slate-300 p-2 text-center">
                <input type="radio" disabled={formData?.readOnly || formData?.isAdmin} name="tujuan" checked={formData.tujuan === 'PKT'} onChange={() => handleChangeTujuan('PKT')} />
              </td>
              <td className="border border-slate-300 p-2">Pengakuan Kompetensi Terkini (PKT)</td>
            </tr>
            <tr className={highlightTujuan && !formData.tujuan ? "bg-red-50" : ""}>
              <td className="border border-slate-300 p-2 text-center">
                <input type="radio" disabled={formData?.readOnly || formData?.isAdmin} name="tujuan" checked={formData.tujuan === 'RPL'} onChange={() => handleChangeTujuan('RPL')} />
              </td>
              <td className="border border-slate-300 p-2">Rekognisi Pembelajaran Lampau (RPL)</td>
            </tr>
            <tr className={highlightTujuan && !formData.tujuan ? "bg-red-50" : ""}>
              <td className="border border-slate-300 p-2 text-center">
                <input type="radio" disabled={formData?.readOnly || formData?.isAdmin} name="tujuan" checked={formData.tujuan === 'Lainnya'} onChange={() => handleChangeTujuan('Lainnya')} />
              </td>
              <td className="border border-slate-300 p-2">Lainnya</td>
            </tr>

          </tbody>
        </table>
        </div>

        <h3 className="font-bold text-sm mb-1 mt-6">Bagian 3 : Bukti Kelengkapan Pemohon</h3>
        <p className="text-xs text-slate-600 mb-2">Diisi oleh LSP/Asesor.</p>
        
        <div className="overflow-x-auto mb-6 ">
        <table className="w-full border-collapse border border-slate-300 min-w-[500px] text-xs">
          <thead>
            <tr className="bg-[#ebf0fa] border-b border-slate-300 text-slate-800">
              <th className="border border-slate-300 px-4 py-3 font-bold uppercase tracking-wider sticky top-0 z-20 bg-[#ebf0fa]">Bukti Persyaratan Dasar</th>
              <th className="border border-slate-300 px-4 py-3 font-bold uppercase tracking-wider text-center w-1/5 sticky top-0 z-20 bg-[#ebf0fa]">Memenuhi Syarat</th>
              <th className="border border-slate-300 px-4 py-3 font-bold uppercase tracking-wider text-center w-1/5 sticky top-0 z-20 bg-[#ebf0fa]">Tidak Memenuhi Syarat</th>
            </tr>
          </thead>
          <tbody>
            {(formData.schemeDetail?.persyaratanDasar || []).map((req: string | { name: string }, idx: number) => (
              <tr key={`dasar-${idx}`}>
                <td className="border border-slate-300 p-2 whitespace-nowrap">
                  <div className="flex items-center justify-between gap-4">
                    <span className="whitespace-nowrap">{typeof req === 'string' ? req : req.name}</span>
                    {formData.onPreview && (
                      <button type="button" onClick={() => formData.onPreview?.(typeof req === 'string' ? req : req.name)} className="text-[#008BE3] hover:text-[#0076C2] shrink-0">
                         <Eye size={14} />
                      </button>
                    )}
                  </div>
                </td>
                <td className="border border-slate-300 p-2 text-center bg-white whitespace-nowrap">
                  <input type="checkbox" checked={formData?.checklist?.[typeof req === 'string' ? req : req.name] === 'memenuhi'} onChange={() => handleCheck(typeof req === 'string' ? req : req.name, 'memenuhi')} disabled={formData?.readOnly || !formData?.isAdmin} className="text-[#008BE3] focus:ring-[#008BE3] rounded border-gray-300"/>
                </td>
                <td className="border border-slate-300 p-2 text-center bg-white whitespace-nowrap">
                  <input type="checkbox" checked={formData?.checklist?.[typeof req === 'string' ? req : req.name] === 'tidak_memenuhi'} onChange={() => handleCheck(typeof req === 'string' ? req : req.name, 'tidak_memenuhi')} disabled={formData?.readOnly || !formData?.isAdmin} className="text-red-500 focus:ring-red-500 rounded border-gray-300"/>
                </td>
              </tr>
            ))}
            {(formData.schemeDetail?.buktiAdministratif || []).map((req: string, idx: number) => (
              <tr key={`admin-${idx}`}>
                <td className="border border-slate-300 p-2 whitespace-nowrap">
                  <div className="flex items-center justify-between gap-4">
                    <span className="whitespace-nowrap">{req}</span>
                    {formData.onPreview && (
                      <button type="button" onClick={() => formData.onPreview?.(req)} className="text-[#008BE3] hover:text-[#0076C2] shrink-0">
                         <Eye size={14} />
                      </button>
                    )}
                  </div>
                </td>
                <td className="border border-slate-300 p-2 text-center bg-white whitespace-nowrap">
                  <input type="checkbox" checked={formData?.checklist?.[req] === 'memenuhi'} onChange={() => handleCheck(req, 'memenuhi')} disabled={formData?.readOnly || !formData?.isAdmin} className="text-[#008BE3] focus:ring-[#008BE3] rounded border-gray-300"/>
                </td>
                <td className="border border-slate-300 p-2 text-center bg-white whitespace-nowrap">
                  <input type="checkbox" checked={formData?.checklist?.[req] === 'tidak_memenuhi'} onChange={() => handleCheck(req, 'tidak_memenuhi')} disabled={formData?.readOnly || !formData?.isAdmin} className="text-red-500 focus:ring-red-500 rounded border-gray-300"/>
                </td>
              </tr>
            ))}
            {(formData.schemeDetail?.buktiKompetensi || []).map((req: string, idx: number) => (
              <tr key={`kompetensi-${idx}`}>
                <td className="border border-slate-300 p-2 whitespace-nowrap">
                  <div className="flex items-center justify-between gap-4">
                    <span className="whitespace-nowrap">{req}</span>
                    {formData.onPreview && (
                      <button type="button" onClick={() => formData.onPreview?.(req)} className="text-[#008BE3] hover:text-[#0076C2] shrink-0">
                         <Eye size={14} />
                      </button>
                    )}
                  </div>
                </td>
                <td className="border border-slate-300 p-2 text-center bg-white whitespace-nowrap">
                  <input type="checkbox" checked={formData?.checklist?.[req] === 'memenuhi'} onChange={() => handleCheck(req, 'memenuhi')} disabled={formData?.readOnly || !formData?.isAdmin} className="text-[#008BE3] focus:ring-[#008BE3] rounded border-gray-300"/>
                </td>
                <td className="border border-slate-300 p-2 text-center bg-white whitespace-nowrap">
                  <input type="checkbox" checked={formData?.checklist?.[req] === 'tidak_memenuhi'} onChange={() => handleCheck(req, 'tidak_memenuhi')} disabled={formData?.readOnly || !formData?.isAdmin} className="text-red-500 focus:ring-red-500 rounded border-gray-300"/>
                </td>
              </tr>
            ))}
            {(!formData.schemeDetail?.persyaratanDasar?.length && !formData.schemeDetail?.buktiAdministratif?.length && !formData.schemeDetail?.buktiKompetensi?.length) && (
              <tr>
                <td className="border border-slate-300 p-2">Belum ada persyaratan diatur.</td>
                <td className="border border-slate-300 p-2 text-center bg-white"><input type="checkbox" disabled={formData?.readOnly || !formData?.isAdmin}/></td>
                <td className="border border-slate-300 p-2 text-center bg-white"><input type="checkbox" disabled={formData?.readOnly || !formData?.isAdmin}/></td>
              </tr>
            )}
          </tbody>
        </table>
        </div>

        <div className="overflow-x-auto ">
        <table className="w-full border-collapse border border-slate-300 min-w-[500px] text-xs table-fixed">
          <tbody>
            <tr>
              <td className="border border-slate-300 p-4 w-1/2 align-top bg-white">
                <p className="font-bold mb-2">Rekomendasi (diisi oleh LSP):</p>
                <p>Berdasarkan ketentuan persyaratan dasar, maka pemohon:</p>
                <div className="flex gap-2 items-center mt-2">
                  <input type="radio" checked={formData?.rekomendasi === 'Diterima'} onChange={() => formData?.isAdmin && onChange({...formData, rekomendasi: 'Diterima'})} disabled={!formData?.isAdmin}/> Diterima
                </div>
                <div className="flex gap-2 items-center">
                  <input type="radio" checked={formData?.rekomendasi === 'Tidak Diterima'} onChange={() => formData?.isAdmin && onChange({...formData, rekomendasi: 'Tidak Diterima'})} disabled={!formData?.isAdmin}/> Tidak Diterima
                </div>
                <p className="mt-2">sebagai peserta sertifikasi</p>
                <div className="mt-4">
                  <p className="font-bold">Catatan:</p>
                  <textarea value={(formData?.catatan as string) || ''} onChange={(e) => formData?.isAdmin && onChange({...formData, catatan: e.target.value})} disabled={!formData?.isAdmin} className="w-full h-16 border border-slate-300 bg-white p-1"></textarea>
                </div>
              </td>
              <td className="border border-slate-300 p-4 w-1/2 align-top">
                <p className="font-bold mb-2">Pemohon / Kandidat :</p>
                <div className="mb-4">
                  <span className="font-semibold inline-block w-20">Nama:</span>
                  <span><Input field="namaLengkap" fallback="AHMAD FAUZI" /></span>
                </div>
                <div className="mb-4">
                  <span className="font-semibold inline-block mb-1">Tanda Tangan dan Tanggal: {(!formData.readOnly && !formData.isAdmin) ? <span className="text-red-500">*</span> : ''}</span>
                  <SignatureField value={getSignatureValue(formData.ttdAsesi)} onChange={(val) => onChange({...formData, ttdAsesi: val})} readOnly={formData.readOnly || formData.isAdmin} fallbackName={(formData.signature as string) || (formData.namaLengkap as string)} />
                </div>
                <div className="border-t border-slate-300 pt-4 mt-6">
                  <p className="font-bold mb-2">Admin LSP :</p>
                  <div className="mb-4">
                    <span className="font-semibold inline-block w-20">Nama:</span>
                    {formData?.isAdmin ? (
                      <input type="text" className="border border-slate-300 rounded p-1 text-xs outline-none focus:border-[#008BE3] focus:ring-1 focus:ring-[#008BE3]" value={(formData.namaAdmin as string) || ''} onChange={(e) => onChange({...formData, namaAdmin: e.target.value})} placeholder="Nama Admin" />
                    ) : (
                      <span className="text-gray-400">{(formData.namaAdmin as string) || '....................'}</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <span className="font-semibold inline-block mb-1">Tanda Tangan dan Tanggal: {formData.isAdmin ? <span className="text-red-500">*</span> : ''}</span>
                    {formData?.isAdmin || formData?.ttdAdmin ? (
                      <SignatureField value={getSignatureValue(formData.ttdAdmin)} onChange={(val) => onChange({...formData, ttdAdmin: val})} readOnly={!formData?.isAdmin} fallbackName={(formData.namaAdmin as string)} />
                    ) : (
                      <div className="border border-slate-300 rounded bg-white p-2 h-16 text-center text-gray-400 flex items-center justify-center">
                        (Diisi oleh LSP)
                      </div>
                    )}
                  </div>
                </div>
              </td>
            </tr>
            
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}