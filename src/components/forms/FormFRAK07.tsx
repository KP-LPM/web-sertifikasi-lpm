import React, { useState } from "react";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { FormHeader } from "./FormHeader";
import { SignatureModal } from "./SignatureModal";
import { Assessment } from "@/types/types";
 

export const DEFAULT_ADJUSTMENT_OPTIONS = [
  {
    id: "adj1",
    label: "Keterbatasan asesi terhadap persyaratan bahasa, literasi, numerasi",
    options: [
      "Memerlukan dukungan pembaca, penerjemah, pelayan, penulis. untuk merekam jawaban asesi.",
      "Melakukan asesmen verbal (gunakan pertanyaan lisan/pertanyaan wawancara) dengan dilengkapi gambar diagram dan bentuk-bentuk visual.",
      "Menggunakan Hasil produksi",
      "Menggunakan Ceklis observasi/demonstrasi.",
      "Menggunakan daftar instruksi terstruktur.",
    ],
  },
  {
    id: "adj2",
    label: "Penyediaan dukungan pembaca, penerjemah, pelayan, penulis",
    options: [
      "Menggunakan pertanyaan lisan dengan dilengkapi gambar diagram dan bentuk-bentuk visual.",
    ],
  },
  {
    id: "adj3",
    label: "Penggunaan teknologi adaptif atau peralatan khusus",
    options: [
      "Ceklis observasi/demonstrasi Demonstrasi.",
      "Pertanyaan lisan",
      "Pertanyaan tertulis.",
      "Pertanyaan wawancara.",
      "Daftar instruksi terstruktur.",
      "Ceklis verifikasi portofolio.",
      "Menggunakan dukungan operator komputer.",
    ],
  },
  {
    id: "adj4",
    label:
      "Pelaksanaan asesmen secara fleksibel karena alasan keletihan atau keperluan pengobatan",
    options: [
      "Menggunakan juru tulis.",
      "Menggunakan kamaramen perekam vidio/ataudio.",
      "Memperbolehkan periode waktu yang lebih panjang untuk menyelesaikan tugas pekerjaan dalam asesmen.",
      "Melakukan tugas pekerjaan dalam asesmen dengan waktu lebih pendek.",
      "Menggunakan instruksi-instruksi spesifik pada proyek yang dapat dilakukan pada berbagai tingkatan.",
    ],
  },
  {
    id: "adj5",
    label: "Penyediaan peralatan asesmen berupa braille, audio/video-tape",
    options: [
      "Menggunakan pertanyaan lisan.",
      "Menggunakan pertanyaan wawancara.",
    ],
  },
  {
    id: "adj6",
    label: "Penyesuaian tempat fisik/lingkungan asesmen",
    options: [
      "Pertanyaan lisan.",
      "Pertanyaan tulis.",
      "Pertanyaan wawancara.",
      "Ceklis Verifikasi portofolio.",
      "Ceklis reviu produk.",
      "Daftar instruksi terstruktur.",
    ],
  },
  {
    id: "adj7",
    label: "Pertimbangan umur/usia lanjut/gender asesi",
    options: [
      "Menggunakan studi kasus/daftar instruksi terstrukut",
      "Menggunakan instrumen asesmen dengan huruf normal jangan terlalu kecil.",
      "Menggunakan asesor dengan jenis kelamin yang sama dengan asesi.",
      "Menggunakan instrumen asesmen yang sama walaupun berbeda jenis kelamain (tidak boleh memberi tanda tambahan pada instrumen asesmen yang digunakan dengan tujuan untuk membedakan jenis kelamin).",
    ],
  },
  {
    id: "adj8",
    label: "Pertimbangan budaya/tradisi/agama",
    options: [
      "Menggunakan studi kasus daftar instruksi terstrukut",
      "Menggunakan asesor tanpa pertimbangan budaya/tradisi/agama.",
      "Menggunakan instrumen asesmen yang sama walaupun berbeda budaya/tradisi/agama).",
    ],
  },
];

export interface FormFRAK07Props {
  asesmenData?: Assessment;
  noAdjustment?: boolean;
  onNoAdjustmentChange?: (val: boolean) => void;
  adjustments?: Record<
    string,
    { required: boolean | null; note: string; selectedOptions: string[] }
  >;
  onAdjustmentChange?: (
    id: string,
    field: "required" | "note" | "selectedOptions",
    value: boolean | null | string | string[],
  ) => void;
  acuanPembanding?: string;
  onAcuanPembandingChange?: (val: string) => void;
  metodeAsesmen?: string;
  onMetodeAsesmenChange?: (val: string) => void;
  instrumenAsesmen?: string;
  onInstrumenAsesmenChange?: (val: string) => void;
  asesorName?: string;
  onAsesorNameChange?: (val: string) => void;
  asesorSignature?: string;
  onAsesorSignatureChange?: (val: string) => void;
  asesorDate?: string;
  onAsesorDateChange?: (val: string) => void;
  asesiName?: string;
  onAsesiNameChange?: (val: string) => void;
  asesiSignature?: string;
  onAsesiSignatureChange?: (val: string) => void;
  asesiDate?: string;
  onAsesiDateChange?: (val: string) => void;
  readOnly?: boolean;
  isAsesi?: boolean;
  showHeader?: boolean;
  onNext?: () => void;
  onPrev?: () => void;
  isNextDisabled?: boolean;
}

export function FormFRAK07(props: FormFRAK07Props) {
  // Controlled vs local fallbacks
  const [localNoAdjustment, setLocalNoAdjustment] = useState(false);
  const [localAdjustments, setLocalAdjustments] = useState<
    Record<
      string,
      { required: boolean | null; note: string; selectedOptions: string[] }
    >
  >({});
  const [localAcuan, setLocalAcuan] = useState("");
  const [localMetode, setLocalMetode] = useState("");
  const [localInstrumen, setLocalInstrumen] = useState("");
  const [localAsesorName, setLocalAsesorName] = useState(
    props.asesmenData?.asesor || "Ichsan Taufik",
  );
  const [localAsesorSig, setLocalAsesorSig] = useState("");
  const [localAsesorDate, setLocalAsesorDate] = useState("");
  const [localAsesiName, setLocalAsesiName] = useState(
    props.asesmenData?.nama || "Ahmad Supriyadi",
  );
  const [localAsesiSig, setLocalAsesiSig] = useState("");
  const [localAsesiDate, setLocalAsesiDate] = useState("");

  const [isAsesorSigModalOpen, setIsAsesorSigModalOpen] = useState(false);
  const [isAsesiSigModalOpen, setIsAsesiSigModalOpen] = useState(false);

  const noAdjustment =
    props.noAdjustment !== undefined ? props.noAdjustment : localNoAdjustment;
  const adjustments =
    props.adjustments !== undefined ? props.adjustments : localAdjustments;
  const acuanPembanding =
    props.acuanPembanding !== undefined ? props.acuanPembanding : localAcuan;
  const metodeAsesmen =
    props.metodeAsesmen !== undefined ? props.metodeAsesmen : localMetode;
  const instrumenAsesmen =
    props.instrumenAsesmen !== undefined
      ? props.instrumenAsesmen
      : localInstrumen;
  const asesorName =
    props.asesorName !== undefined ? props.asesorName : localAsesorName;
  const asesorSignature =
    props.asesorSignature !== undefined
      ? props.asesorSignature
      : localAsesorSig;
  const asesorDate =
    props.asesorDate !== undefined ? props.asesorDate : localAsesorDate;
  const asesiName =
    props.asesiName !== undefined ? props.asesiName : localAsesiName;
  const asesiSignature =
    props.asesiSignature !== undefined ? props.asesiSignature : localAsesiSig;
  const asesiDate =
    props.asesiDate !== undefined ? props.asesiDate : localAsesiDate;

  type AdjustmentItem = {
    required: boolean | null;
    note: string;
    selectedOptions: string[];
  };

  const handleNoAdjToggle = (checked: boolean) => {
    if (props.onNoAdjustmentChange) {
      props.onNoAdjustmentChange(checked);
    } else {
      setLocalNoAdjustment(checked);
    }
    const newAdj: Record<string, AdjustmentItem> = {};
    DEFAULT_ADJUSTMENT_OPTIONS.forEach((opt) => {
      newAdj[opt.id] = {
        required: checked ? false : null,
        note: "",
        selectedOptions: [],
      };
    });
    if (props.onAdjustmentChange) {
      Object.keys(newAdj).forEach((id) => {
        props.onAdjustmentChange!(id, "required", checked ? false : null);
      });
    } else {
      setLocalAdjustments(newAdj);
    }
  };

  const handleAdjChangeInternal = (
    id: string,
    field: "required" | "note" | "selectedOptions",
    value: boolean | null | string | string[],
  ) => {
    if (props.onAdjustmentChange) {
      props.onAdjustmentChange(id, field, value);
    } else {
      setLocalAdjustments((prev) => ({
        ...prev,
        [id]: {
          required: prev[id]?.required ?? null,
          note: prev[id]?.note || "",
          selectedOptions: prev[id]?.selectedOptions || [],
          [field]: value,
        },
      }));
    }
  };

  const handleOptionToggleInternal = (id: string, option: string) => {
    const currentOpts = adjustments[id]?.selectedOptions || [];
    const newOpts = currentOpts.includes(option)
      ? currentOpts.filter((o) => o !== option)
      : [...currentOpts, option];
    handleAdjChangeInternal(id, "selectedOptions", newOpts);
  };

  return (
    <div className="animate-in fade-in duration-300">
      {props.showHeader !== false && (
        <FormHeader
          title="CEKLIS PENYESUAIAN YANG WAJAR DAN BERALASAN"
          formCode="FR.AK.07"
          asesmenData={props.asesmenData}
        />
      )}

      {/* Guide box */}
      <div className="border border-slate-300 mb-6 bg-white">
        <div className="border-b border-slate-300 p-2 bg-white font-bold text-sm">
          PANDUAN BAGI ASESOR
        </div>
        <div className="p-4 text-xs md:text-sm space-y-2">
          <ul className="list-disc pl-5 space-y-1 text-slate-800 font-medium">
            <li>
              Formulir ini dapat digunakan (sebelum pra asesmen, saat
              pelaksanaan pra asesmen, setelah pra asesmen)* jika ada asesi yang
              mempunyai keterbatasan sesuai karakteristik yang dimilikinya
              sehingga diperlukan penyesuaian yang wajar dan beralasan, jika
              rencana asesmen dan perangkat asesmen tidak sesuai dengan acuan
              pembanding, potensi asesi dan konteks asesi, jika asesi merasa
              keletihan, sakit, serta jika kondisi alam, listrik padam.
            </li>
            <li>Coretlah pada tanda * yang tidak sesuai.</li>
            <li>
              Berilah tanda{" "}
              <span className="inline-block border border-slate-600 px-1 text-[10px] mx-1">
                v
              </span>{" "}
              pada kotak{" "}
              <span className="inline-block border border-slate-600 px-1 text-[10px] mx-1 font-sans">
                ☐
              </span>{" "}
              pada kolom potensi asesi.
            </li>
            <li>
              Berilah tanda v Ya atau Tidak pada tanda ** sesuai pilihan, jika
              jawaban Ya selanjutnya pada kolom keterangan berilah tanda v di
              kotak{" "}
              <span className="inline-block border border-slate-600 px-1 text-[10px] mx-1 font-sans">
                ☐
              </span>{" "}
              yang tersedia, pilihan boleh lebih dari satu.
            </li>
          </ul>
        </div>
      </div>

      {/* Checkbox No Adjustment */}
      <div className="mb-6">
        <label className="flex items-center gap-3 p-4 border border-slate-300 bg-white cursor-pointer">
          <input
            type="checkbox"
            className="w-5 h-5"
            checked={noAdjustment}
            disabled={props.readOnly}
            onChange={(e) => handleNoAdjToggle(e.target.checked)}
          />
          <span className="font-bold text-slate-900">
            Tidak ada penyesuaian yang diperlukan
          </span>
        </label>
      </div>

      {/* Options Table */}
      <div className="space-y-4 border border-slate-300 overflow-x-auto">
        <table className="w-full border-collapse text-sm min-w-150">
          <thead>
            <tr className="bg-white border-b border-slate-300 text-center">
              <th className="border border-slate-300 p-3 w-12">No</th>
              <th className="border border-slate-300 p-3 text-left">
                Mengidentifikasi Persyaratan (Karakteristik Asesi)
              </th>
              <th className="border border-slate-300 p-3 w-32">
                Diperlukan Penyesuaian?
              </th>
              <th className="border border-slate-300 p-3 w-1/3 text-left">
                Keterangan / Catatan
              </th>
            </tr>
          </thead>
          <tbody>
            {DEFAULT_ADJUSTMENT_OPTIONS.map((opt, idx) => (
              <tr key={opt.id}>
                <td className="border border-slate-300 p-3 text-center align-top">
                  {idx + 1}
                </td>
                <td className="border border-slate-300 p-3 align-top">
                  {opt.label}
                </td>
                <td className="border border-slate-300 p-3 text-center align-top">
                  <div className="flex flex-col gap-2 items-center">
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="radio"
                        name={`req_${opt.id}`}
                        checked={adjustments[opt.id]?.required === true}
                        onChange={() =>
                          handleAdjChangeInternal(opt.id, "required", true)
                        }
                        disabled={noAdjustment || props.readOnly}
                      />{" "}
                      Ya
                    </label>
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="radio"
                        name={`req_${opt.id}`}
                        checked={adjustments[opt.id]?.required === false}
                        onChange={() =>
                          handleAdjChangeInternal(opt.id, "required", false)
                        }
                        disabled={noAdjustment || props.readOnly}
                      />{" "}
                      Tidak
                    </label>
                  </div>
                </td>
                <td className="border border-slate-300 p-3 align-top">
                  <div className="space-y-2 mb-3">
                    {opt.options.map((o, oidx) => (
                      <label
                        key={oidx}
                        className="flex items-start gap-2 text-xs cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          className="mt-0.5 shrink-0"
                          checked={
                            adjustments[opt.id]?.selectedOptions?.includes(o) ||
                            false
                          }
                          onChange={() => handleOptionToggleInternal(opt.id, o)}
                          disabled={noAdjustment || props.readOnly}
                        />
                        <span>{o}</span>
                      </label>
                    ))}
                  </div>
                  <input
                    type="text"
                    className="w-full border-b border-slate-300 outline-none focus:border-slate-800 bg-transparent text-xs py-1"
                    placeholder="Catatan tambahan..."
                    value={adjustments[opt.id]?.note || ""}
                    onChange={(e) =>
                      handleAdjChangeInternal(opt.id, "note", e.target.value)
                    }
                    disabled={noAdjustment || props.readOnly}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Agreement Result */}
      <div className="border border-slate-300 mt-8 mb-6 p-4">
        <h4 className="font-bold text-sm mb-4">
          Hasil Penyesuaian yang wajar dan beralasan disepakati menggunakan :
        </h4>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="w-6 font-bold text-sm">1)</span>
            <span className="w-56 font-bold text-sm">
              Acuan Pembanding Asesmen
            </span>
            <span className="font-bold">:</span>
            <input
              type="text"
              value={acuanPembanding}
              disabled={props.readOnly || props.isAsesi}
              onChange={(e) =>
                props.onAcuanPembandingChange
                  ? props.onAcuanPembandingChange(e.target.value)
                  : setLocalAcuan(e.target.value)
              }
              placeholder="( tuliskan nama acuan pembanding)"
              className="flex-1 border-b border-slate-400 outline-none focus:border-slate-800 bg-transparent text-sm py-1 font-medium"
            />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="w-6 font-bold text-sm">2)</span>
            <span className="w-56 font-bold text-sm">Metode Asesmen</span>
            <span className="font-bold">:</span>
            <input
              type="text"
              value={metodeAsesmen}
              disabled={props.readOnly || props.isAsesi}
              onChange={(e) =>
                props.onMetodeAsesmenChange
                  ? props.onMetodeAsesmenChange(e.target.value)
                  : setLocalMetode(e.target.value)
              }
              placeholder="( tuliskan nama metode asesmen)"
              className="flex-1 border-b border-slate-400 outline-none focus:border-slate-800 bg-transparent text-sm py-1 font-medium"
            />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="w-6 font-bold text-sm">3)</span>
            <span className="w-56 font-bold text-sm">Instrumen Asesmen</span>
            <span className="font-bold">:</span>
            <input
              type="text"
              value={instrumenAsesmen}
              disabled={props.readOnly || props.isAsesi}
              onChange={(e) =>
                props.onInstrumenAsesmenChange
                  ? props.onInstrumenAsesmenChange(e.target.value)
                  : setLocalInstrumen(e.target.value)
              }
              placeholder="( tuliskan nama formulir instrumen asesmen )"
              className="flex-1 border-b border-slate-400 outline-none focus:border-slate-800 bg-transparent text-sm py-1 font-medium"
            />
          </div>
        </div>
      </div>

      {/* Signature Grid */}
      <div className="border border-slate-300 mb-8 grid grid-cols-1 md:grid-cols-2">
        <div className="p-4 border-b md:border-b-0 md:border-r border-slate-300 flex flex-col justify-between">
          <div>
            <div className="flex gap-2">
              <span className="font-bold text-sm">Nama Asesor:</span>
              <input
                type="text"
                value={String(asesorName || "")}
                disabled={props.readOnly || props.isAsesi}
                onChange={(e) =>
                  props.onAsesorNameChange
                    ? props.onAsesorNameChange(e.target.value)
                    : setLocalAsesorName(e.target.value)
                }
                className="flex-1 border-b border-slate-300 outline-none focus:border-slate-800 bg-transparent text-sm font-medium"
              />
            </div>
          </div>
        </div>
        <div className="p-4 flex flex-col justify-between items-start w-full">
          <span className="font-bold text-sm mb-4">
            Tanggal dan Tanda Tangan Asesor:
          </span>
          <div className="mb-4">
            {asesorSignature ? (
              <img
                src={asesorSignature}
                alt="Tanda Tangan Asesor"
                className="h-20 object-contain cursor-pointer"
                onClick={() =>
                  !props.readOnly &&
                  !props.isAsesi &&
                  setIsAsesorSigModalOpen(true)
                }
              />
            ) : (
              <button
                type="button"
                disabled={props.readOnly || props.isAsesi}
                onClick={() => setIsAsesorSigModalOpen(true)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 text-xs font-bold rounded"
              >
                Tanda Tangan Asesor
              </button>
            )}
          </div>
          <div className="w-full">
            <input
              type="date"
              value={asesorDate}
              disabled={props.readOnly || props.isAsesi}
              onChange={(e) =>
                props.onAsesorDateChange
                  ? props.onAsesorDateChange(e.target.value)
                  : setLocalAsesorDate(e.target.value)
              }
              className="w-full border-b border-slate-300 outline-none focus:border-slate-800 bg-transparent text-sm font-medium py-1"
            />
          </div>
        </div>

        <div className="p-4 border-t border-slate-300 border-b md:border-b-0 md:border-r flex flex-col justify-between">
          <div>
            <div className="flex gap-2">
              <span className="font-bold text-sm">Nama Asesi:</span>
              <input
                type="text"
                value={asesiName}
                disabled={props.readOnly}
                onChange={(e) =>
                  props.onAsesiNameChange
                    ? props.onAsesiNameChange(e.target.value)
                    : setLocalAsesiName(e.target.value)
                }
                className="flex-1 border-b border-slate-300 outline-none focus:border-slate-800 bg-transparent text-sm font-medium"
              />
            </div>
          </div>
        </div>
        <div className="p-4 border-t border-slate-300 flex flex-col justify-between items-start w-full">
          <span className="font-bold text-sm mb-4">
            Tanggal dan Tanda Tangan Asesi:
          </span>
          <div className="mb-4">
            {asesiSignature ? (
              <img
                id="signature-container"
                src={asesiSignature}
                alt="Tanda Tangan Asesi"
                className="h-20 object-contain cursor-pointer"
                onClick={() => !props.readOnly && setIsAsesiSigModalOpen(true)}
              />
            ) : (
              <button
                id="signature-container"
                type="button"
                disabled={props.readOnly}
                onClick={() => setIsAsesiSigModalOpen(true)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 text-xs font-bold rounded"
              >
                Tanda Tangan Asesi
              </button>
            )}
          </div>
          <div className="w-full">
            <input
              id="date-input"
              type="date"
              value={asesiDate}
              disabled={props.readOnly}
              onChange={(e) =>
                props.onAsesiDateChange
                  ? props.onAsesiDateChange(e.target.value)
                  : setLocalAsesiDate(e.target.value)
              }
              className="w-full border-b border-slate-300 outline-none focus:border-slate-800 bg-transparent text-sm font-medium py-1"
            />
          </div>
        </div>
      </div>

      {/* Optional navigation */}
      {(props.onPrev || props.onNext) && (
        <div className="mt-8 flex flex-col-reverse sm:flex-row justify-between items-stretch sm:items-center gap-3">
          {props.onPrev ? (
            <button
              type="button"
              onClick={props.onPrev}
              className="border border-slate-300 px-6 py-2.5 font-semibold text-sm hover:bg-slate-50 flex items-center gap-2"
            >
              <ArrowLeft size={16} /> Kembali
            </button>
          ) : (
            <div />
          )}
          {props.onNext && (
            <button
              type="button"
              onClick={props.onNext}
              disabled={props.isNextDisabled}
              className="bg-slate-900 text-white px-6 py-2.5 font-semibold text-sm hover:bg-slate-800 disabled:opacity-50 flex items-center gap-2"
            >
              Lanjut ke Step 2 <ChevronRight size={16} />
            </button>
          )}
        </div>
      )}

      {/* Signature Modals */}
      <SignatureModal
        isOpen={isAsesorSigModalOpen}
        onClose={() => setIsAsesorSigModalOpen(false)}
        title="Tanda Tangan Asesor"
        initialSignature={asesorSignature}
        onSave={(dataUrl) => {
          if (props.onAsesorSignatureChange)
            props.onAsesorSignatureChange(dataUrl);
          else setLocalAsesorSig(dataUrl);
        }}
      />

      <SignatureModal
        isOpen={isAsesiSigModalOpen}
        onClose={() => setIsAsesiSigModalOpen(false)}
        title="Tanda Tangan Asesi"
        initialSignature={asesiSignature}
        onSave={(dataUrl) => {
          if (props.onAsesiSignatureChange)
            props.onAsesiSignatureChange(dataUrl);
          else setLocalAsesiSig(dataUrl);
        }}
      />
    </div>
  );
}
