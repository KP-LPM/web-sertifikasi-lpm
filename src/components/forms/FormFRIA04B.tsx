import React, { useState } from "react";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { FormHeader } from "./FormHeader";
import { SignatureModal } from "./SignatureModal";
import { Apl02FormData, PenyusunValidatorItem } from "@/types/types";

export const DEFAULT_STEP3_QUESTIONS = [
  {
    id: "s3_q1",
    skenario:
      "Selama menerjemahkan teks panduan teknis, Anda menemui istilah khusus industri yang tidak ada di kamus umum dan alat bantu konvensional.",
    pertanyaan:
      "Bagaimana Anda akan mencari padanan istilah tersebut dan mendokumentasikan prosesnya?",
    elemen: "E1/KUK 1.1; E2/KUK 2.1",
  },
  {
    id: "s3_q2",
    skenario:
      "Anda telah menemukan beberapa referensi dari alat bantu nonkonvensional (misalnya forum profesi atau korpus).",
    pertanyaan:
      "Bagaimana Anda merangkum dan memverifikasi ketepatan makna ungkapan tersebut sebelum menggunakannya dalam terjemahan?",
    elemen: "E1/KUK 1.2; E2/KUK 2.2",
  },
  {
    id: "s3_q3",
    skenario:
      "Klien meminta agar teks diterjemahkan dengan gaya bahasa santai untuk pembaca remaja, meskipun teks aslinya agak formal.",
    pertanyaan:
      "Metode penerjemahan apa yang akan Anda pilih dan bagaimana Anda menerapkannya?",
    elemen: "E1/KUK 1.1; E2/KUK 2.2",
  },
  {
    id: "s3_q4",
    skenario:
      "Anda menemui kalimat idiomatik yang jika diterjemahkan harfiah akan terdengar kaku di bahasa sasaran.",
    pertanyaan:
      "Teknik penerjemahan apa yang akan Anda gunakan pada frasa atau klausa tersebut agar alami namun maknanya tersampaikan?",
    elemen: "E1/KUK 1.2; E2/KUK 2.1",
  },
];

export interface FormFRIA04BProps {
  asesmenData?: Apl02FormData;
  questions?: typeof DEFAULT_STEP3_QUESTIONS;
  step3Questions?: typeof DEFAULT_STEP3_QUESTIONS;
  answers?: Record<string, { answer: string; achievement: boolean | null }>;
  step3Answers?: Record<
    string,
    { answer: string; achievement: boolean | null }
  >;
  onAnswerChange?: (
    id: string,
    field: "answer" | "achievement",
    value: string | boolean | null,
  ) => void;
  onStep3Change?: (
    id: string,
    field: "answer" | "achievement",
    value: string | boolean | null,
  ) => void;
  rekomendasi?: string;
  rekomendasiStep3?: string;
  onRekomendasiChange?: (val: string) => void;
  onRekomendasiStep3Change?: (val: string) => void;
  asesiName?: string;
  asesiNameStep3?: string;
  onAsesiNameChange?: (val: string) => void;
  onAsesiNameStep3Change?: (val: string) => void;
  asesiSignature?: string;
  asesiSignatureStep3?: string;
  onAsesiSignatureChange?: (val: string) => void;
  onAsesiSignatureStep3Change?: (val: string) => void;
  asesiDate?: string;
  asesiDateStep3?: string;
  onAsesiDateChange?: (val: string) => void;
  onAsesiDateStep3Change?: (val: string) => void;
  asesorName?: string;
  asesorNameStep3?: string;
  onAsesorNameChange?: (val: string) => void;
  onAsesorNameStep3Change?: (val: string) => void;
  asesorReg?: string;
  asesorRegStep3?: string;
  onAsesorRegChange?: (val: string) => void;
  onAsesorRegStep3Change?: (val: string) => void;
  asesorSignature?: string;
  asesorSignatureStep3?: string;
  onAsesorSignatureChange?: (val: string) => void;
  onAsesorSignatureStep3Change?: (val: string) => void;
  asesorDate?: string;
  asesorDateStep3?: string;
  onAsesorDateChange?: (val: string) => void;
  onAsesorDateStep3Change?: (val: string) => void;
  penyusun?: PenyusunValidatorItem[];
  penyusunStep3?: PenyusunValidatorItem[];
  onPenyusunChange?: (penyusun: PenyusunValidatorItem[]) => void;
  onPenyusunStep3Change?: (penyusun: PenyusunValidatorItem[]) => void;
  validator?: PenyusunValidatorItem[];
  validatorStep3?: PenyusunValidatorItem[];
  onValidatorChange?: (validator: PenyusunValidatorItem[]) => void;
  onValidatorStep3Change?: (validator: PenyusunValidatorItem[]) => void;
  readOnly?: boolean;
  isAsesi?: boolean;
  showHeader?: boolean;
  onNext?: () => void;
  onPrev?: () => void;
  isNextDisabled?: boolean;
}

export function FormFRIA04B(props: FormFRIA04BProps) {
  const questions =
    props.step3Questions || props.questions || DEFAULT_STEP3_QUESTIONS;

  const [localAnswers, setLocalAnswers] = useState<
    Record<string, { answer: string; achievement: boolean | null }>
  >({});
  const [localRekomendasi, setLocalRekomendasi] = useState<
    "Kompeten" | "Belum Kompeten" | ""
  >("");
  const [localAsesiName, setLocalAsesiName] = useState(
    props.asesmenData?.nama || "Ahmad Supriyadi",
  );
  const [localAsesiSig, setLocalAsesiSig] = useState("");
  const [localAsesiDate, setLocalAsesiDate] = useState("");
  const [localAsesorName, setLocalAsesorName] = useState(
    props.asesmenData?.asesor || "Ichsan Taufik",
  );
  const [localAsesorReg, setLocalAsesorReg] = useState("");
  const [localAsesorSig, setLocalAsesorSig] = useState("");
  const [localAsesorDate, setLocalAsesorDate] = useState("");

  const [localPenyusun, setLocalPenyusun] = useState<PenyusunValidatorItem[]>(
    [],
  );
  const [localValidator, setLocalValidator] = useState<PenyusunValidatorItem[]>(
    [],
  );

  const [isAsesiSigModalOpen, setIsAsesiSigModalOpen] = useState(false);
  const [isAsesorSigModalOpen, setIsAsesorSigModalOpen] = useState(false);

  const answers = props.step3Answers || props.answers || localAnswers;
  const rekomendasi =
    props.rekomendasiStep3 !== undefined
      ? props.rekomendasiStep3
      : props.rekomendasi !== undefined
        ? props.rekomendasi
        : localRekomendasi;
  const asesiName =
    props.asesiNameStep3 !== undefined
      ? props.asesiNameStep3
      : props.asesiName !== undefined
        ? props.asesiName
        : localAsesiName;
  const asesiSignature =
    props.asesiSignatureStep3 !== undefined
      ? props.asesiSignatureStep3
      : props.asesiSignature !== undefined
        ? props.asesiSignature
        : localAsesiSig;
  const asesiDate =
    props.asesiDateStep3 !== undefined
      ? props.asesiDateStep3
      : props.asesiDate !== undefined
        ? props.asesiDate
        : localAsesiDate;
  const asesorName =
    props.asesorNameStep3 !== undefined
      ? props.asesorNameStep3
      : props.asesorName !== undefined
        ? props.asesorName
        : localAsesorName;
  const asesorReg =
    props.asesorRegStep3 !== undefined
      ? props.asesorRegStep3
      : props.asesorReg !== undefined
        ? props.asesorReg
        : localAsesorReg;
  const asesorSignature =
    props.asesorSignatureStep3 !== undefined
      ? props.asesorSignatureStep3
      : props.asesorSignature !== undefined
        ? props.asesorSignature
        : localAsesorSig;
  const asesorDate =
    props.asesorDateStep3 !== undefined
      ? props.asesorDateStep3
      : props.asesorDate !== undefined
        ? props.asesorDate
        : localAsesorDate;
  const penyusun = props.penyusunStep3 || props.penyusun || localPenyusun;
  const validator = props.validatorStep3 || props.validator || localValidator;

  const handleAnswerChangeInternal = (
    id: string,
    field: "answer" | "achievement",
    val: string | boolean | null,
  ) => {
    if (props.onStep3Change) {
      props.onStep3Change(id, field, val);
    } else if (props.onAnswerChange) {
      props.onAnswerChange(id, field, val);
    } else {
      setLocalAnswers((prev) => ({
        ...prev,
        [id]: {
          answer: prev[id]?.answer || "",
          achievement: prev[id]?.achievement ?? null,
          [field]: val,
        },
      }));
    }
  };

  const handleRekomendasiChange = (val: "Kompeten" | "Belum Kompeten") => {
    if (props.onRekomendasiStep3Change) props.onRekomendasiStep3Change(val);
    if (props.onRekomendasiChange) props.onRekomendasiChange(val);
    setLocalRekomendasi(val);
  };

  const handleAsesiNameChange = (val: string) => {
    if (props.onAsesiNameStep3Change) props.onAsesiNameStep3Change(val);
    if (props.onAsesiNameChange) props.onAsesiNameChange(val);
    setLocalAsesiName(val);
  };

  const handleAsesiSignatureChange = (val: string) => {
    if (props.onAsesiSignatureStep3Change)
      props.onAsesiSignatureStep3Change(val);
    if (props.onAsesiSignatureChange) props.onAsesiSignatureChange(val);
    setLocalAsesiSig(val);
  };

  const handleAsesiDateChange = (val: string) => {
    if (props.onAsesiDateStep3Change) props.onAsesiDateStep3Change(val);
    if (props.onAsesiDateChange) props.onAsesiDateChange(val);
    setLocalAsesiDate(val);
  };

  const handleAsesorNameChange = (val: string) => {
    if (props.onAsesorNameStep3Change) props.onAsesorNameStep3Change(val);
    if (props.onAsesorNameChange) props.onAsesorNameChange(val);
    setLocalAsesorName(val);
  };

  const handleAsesorRegChange = (val: string) => {
    if (props.onAsesorRegStep3Change) props.onAsesorRegStep3Change(val);
    if (props.onAsesorRegChange) props.onAsesorRegChange(val);
    setLocalAsesorReg(val);
  };

  const handleAsesorSignatureChange = (val: string) => {
    if (props.onAsesorSignatureStep3Change)
      props.onAsesorSignatureStep3Change(val);
    if (props.onAsesorSignatureChange) props.onAsesorSignatureChange(val);
    setLocalAsesorSig(val);
  };

  const handleAsesorDateChange = (val: string) => {
    if (props.onAsesorDateStep3Change) props.onAsesorDateStep3Change(val);
    if (props.onAsesorDateChange) props.onAsesorDateChange(val);
    setLocalAsesorDate(val);
  };

  const handlePenyusunChangeInternal = (
    idx: number,
    field: string,
    val: string,
  ) => {
    const updated = [...penyusun];
    updated[idx] = { ...updated[idx], [field]: val };
    if (props.onPenyusunStep3Change) props.onPenyusunStep3Change(updated);
    if (props.onPenyusunChange) props.onPenyusunChange(updated);
    setLocalPenyusun(updated);
  };

  const handleValidatorChangeInternal = (
    idx: number,
    field: string,
    val: string,
  ) => {
    const updated = [...validator];
    updated[idx] = { ...updated[idx], [field]: val };
    if (props.onValidatorStep3Change) props.onValidatorStep3Change(updated);
    if (props.onValidatorChange) props.onValidatorChange(updated);
    setLocalValidator(updated);
  };

  const lingkupList = [
    {
      title: "Mencari Makna Kata dan Ungkapan Menggunakan Alat Bantu",
      qs: [questions[0], questions[1]].filter(Boolean),
    },
    {
      title: "Memilih Metode Penerjemahan yang Tepat",
      qs: [questions[2], questions[3]].filter(Boolean),
    },
    {
      title: "Memilih Teknik Penerjemahan",
      qs: [questions[4], questions[5]].filter(Boolean),
    },
    {
      title: "Penilaian Hasil Terjemahan",
      qs: [questions[6], questions[7]].filter(Boolean),
    },
    {
      title: "Penyusunan Glosarium",
      qs: [questions[8], questions[9]].filter(Boolean),
    },
  ].filter((l) => l.qs.length > 0);

  return (
    <div className="animate-in fade-in duration-300">
      {props.showHeader !== false && (
        <FormHeader
          title="PENILAIAN PROYEK SINGKAT ATAU KEGIATAN TERSTRUKTUR LAINNYA"
          formCode="FR.IA.04B"
          asesmenData={props.asesmenData}
        />
      )}

      {/* Panduan Asesor */}
      <div className="border border-slate-300 mb-6 bg-white">
        <div className="border-b border-slate-300 p-2 bg-white font-bold text-sm">
          PANDUAN BAGI ASESOR
        </div>
        <div className="p-4 text-xs md:text-sm space-y-2">
          <ul className="list-disc pl-5 space-y-1 text-slate-800 font-medium">
            <li>
              Lakukan penilaian pencapaian hasil proyek singkat atau kegiatan
              terstruktur lainnya melalui presentasi.
            </li>
            <li>
              Penilaian dilakukan sesuai dengan{" "}
              <strong>
                FR IA 04A. DIT. Daftar Instruksi Terstruktur (Penjelasan Proyek
                Singkat/ Kegiatan Terstruktur Lainnya)
              </strong>
            </li>
            <li>
              Pertanyaan disampaikan oleh asesor setelah asesi melakukan
              presentasi proyek singkat/ kegiatan terstruktur lainnya.
            </li>
            <li>
              Pertanyaan dapat dikembangkan oleh asesor berdasarkan dokumen
              presentasi dan atau hasil presentasi.
            </li>
            <li>
              Pertanyaan yang disampaikan untuk pemenuhan pencapaian 5 dimensi
              kompetensi.
            </li>
            <li>
              Isilah kolom lingkup penyajian proyek atau kegiatan terstruktur
              lainnya sesuai sektor/ sub-sektor/ profesi.
            </li>
            <li>
              Berikan keputusan pencapaian berdasarkan kesimpulan jawaban asesi.
            </li>
          </ul>
        </div>
      </div>

      {/* Questions Table */}
      <div className="border border-slate-300 overflow-x-auto text-sm">
        <table className="w-full border-collapse min-w-162.5">
          <thead>
            <tr className="bg-white border-b border-slate-300 text-center">
              <th className="border border-slate-300 p-2" colSpan={3}>
                Aspek Penilaian
              </th>
              <th className="border border-slate-300 p-2" colSpan={2}>
                Pencapaian
              </th>
            </tr>
            <tr className="bg-white text-center">
              <th className="border border-slate-300 p-2 font-bold w-1/4">
                Lingkup Penyajian proyek atau kegiatan terstruktur lainnya
              </th>
              <th className="border border-slate-300 p-2 font-bold w-1/2">
                Daftar Pertanyaan
              </th>
              <th className="border border-slate-300 p-2 font-bold w-32">
                Kesesuaian dengan standar kompetensi kerja (unit/elemen/KUK)
              </th>
              <th className="border border-slate-300 p-2 font-bold w-12">Ya</th>
              <th className="border border-slate-300 p-2 font-bold w-12">
                Tdk
              </th>
            </tr>
          </thead>
          <tbody>
            {lingkupList.map((lingkup, lIdx) => (
              <React.Fragment key={lIdx}>
                {lingkup.qs.map((q, qIdx) => (
                  <tr key={q.id}>
                    {qIdx === 0 && (
                      <td
                        className="border border-slate-300 p-2 align-top"
                        rowSpan={lingkup.qs.length}
                      >
                        <div className="flex gap-2">
                          <span>{lIdx + 1}.</span>
                          <span>{lingkup.title}</span>
                        </div>
                      </td>
                    )}
                    <td className="border border-slate-300 p-3 align-top space-y-2">
                      <div className="font-bold">Pertanyaan :</div>
                      <div>
                        {lIdx * 2 + qIdx + 1}. Skenario: {q.skenario}
                      </div>
                      <div>Pertanyaan: {q.pertanyaan}</div>
                      <div className="mt-4">
                        <div className="font-bold mb-1">Tanggapan:</div>
                        <textarea
                          disabled={props.readOnly || props.isAsesi}
                          className="w-full border border-slate-300 outline-none focus:border-slate-800 p-2 bg-transparent min-h-25"
                          placeholder="Tanggapan..."
                          value={answers[q.id]?.answer || ""}
                          onChange={(e) =>
                            handleAnswerChangeInternal(
                              q.id,
                              "answer",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                    </td>
                    <td className="border border-slate-300 p-2 align-top text-center text-xs whitespace-pre-wrap">
                      {q.elemen.replace(";", "\n")}
                    </td>
                    <td className="border border-slate-300 p-2 align-top text-center">
                      <input
                        type="radio"
                        name={`ach3_${q.id}`}
                        className="w-4 h-4 cursor-pointer"
                        checked={answers[q.id]?.achievement === true}
                        onChange={() =>
                          handleAnswerChangeInternal(q.id, "achievement", true)
                        }
                        disabled={props.readOnly || props.isAsesi}
                      />
                    </td>
                    <td className="border border-slate-300 p-2 align-top text-center">
                      <input
                        type="radio"
                        name={`ach3_${q.id}`}
                        className="w-4 h-4 cursor-pointer"
                        checked={answers[q.id]?.achievement === false}
                        onChange={() =>
                          handleAnswerChangeInternal(q.id, "achievement", false)
                        }
                        disabled={props.readOnly || props.isAsesi}
                      />
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Rekomendasi Asesor */}
      <div className="mt-8 border border-slate-300 bg-white text-sm">
        <table className="w-full border-collapse">
          <tbody>
            <tr>
              <td className="border border-slate-300 p-3 font-bold w-1/3 align-top">
                Rekomendasi Asesor:
              </td>
              <td className="border border-slate-300 p-3 align-top space-y-2">
                <div>
                  Asesi telah memenuhi/belum memenuhi pencapaian seluruh
                  kriteria unjuk kerja, direkomendasikan:
                </div>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="rekomendasi_step3"
                      className="w-4 h-4 cursor-pointer"
                      checked={rekomendasi === "Kompeten"}
                      onChange={() => handleRekomendasiChange("Kompeten")}
                      disabled={props.readOnly || props.isAsesi}
                    />
                    <span>Kompeten</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="rekomendasi_step3"
                      className="w-4 h-4 cursor-pointer"
                      checked={rekomendasi === "Belum Kompeten"}
                      onChange={() => handleRekomendasiChange("Belum Kompeten")}
                      disabled={props.readOnly || props.isAsesi}
                    />
                    <span>Belum Kompeten</span>
                  </label>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <table className="w-full border-collapse">
          <tbody>
            <tr className="bg-white">
              <td className="border border-slate-300 p-2 font-bold" colSpan={3}>
                ASESI :
              </td>
            </tr>
            <tr>
              <td className="border border-slate-300 p-2 w-1/3">Nama</td>
              <td className="border border-slate-300 p-2 w-8 text-center">:</td>
              <td className="border border-slate-300 p-2">
                <input
                  type="text"
                  disabled={props.readOnly}
                  className="w-full outline-none bg-transparent"
                  value={asesiName as string}
                  onChange={(e) => handleAsesiNameChange(e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <td className="border border-slate-300 p-2">
                Tanda tangan dan Tanggal
              </td>
              <td className="border border-slate-300 p-2 text-center">:</td>
              <td className="border border-slate-300 p-2">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
                  <div
                    id="signature-container"
                    className="flex-1 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() =>
                      !props.readOnly && setIsAsesiSigModalOpen(true)
                    }
                  >
                    {asesiSignature ? (
                      <img
                        src={asesiSignature}
                        alt="TTD Asesi"
                        className="h-full object-contain"
                      />
                    ) : (
                      <span className="text-gray-400 text-sm">
                        Klik untuk tanda tangan
                      </span>
                    )}
                  </div>
                  <input
                    id="date-input"
                    type="date"
                    disabled={props.readOnly}
                    className="w-full sm:w-40 outline-none bg-transparent border-b border-slate-300 pb-1"
                    value={asesiDate}
                    onChange={(e) => handleAsesiDateChange(e.target.value)}
                  />
                </div>
              </td>
            </tr>
            <tr className="bg-white">
              <td className="border border-slate-300 p-2 font-bold" colSpan={3}>
                ASESOR :
              </td>
            </tr>
            <tr>
              <td className="border border-slate-300 p-2">Nama</td>
              <td className="border border-slate-300 p-2 text-center">:</td>
              <td className="border border-slate-300 p-2">
                <input
                  type="text"
                  disabled={props.readOnly || props.isAsesi}
                  className="w-full outline-none bg-transparent"
                  value={String(asesorName || "")}
                  onChange={(e) => handleAsesorNameChange(e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <td className="border border-slate-300 p-2">No. Reg</td>
              <td className="border border-slate-300 p-2 text-center">:</td>
              <td className="border border-slate-300 p-2">
                <input
                  type="text"
                  disabled={props.readOnly || props.isAsesi}
                  className="w-full outline-none bg-transparent"
                  value={asesorReg}
                  onChange={(e) => handleAsesorRegChange(e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <td className="border border-slate-300 p-2">
                Tanda tangan dan Tanggal
              </td>
              <td className="border border-slate-300 p-2 text-center">:</td>
              <td className="border border-slate-300 p-2">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
                  <div
                    className="flex-1 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() =>
                      !props.readOnly &&
                      !props.isAsesi &&
                      setIsAsesorSigModalOpen(true)
                    }
                  >
                    {asesorSignature ? (
                      <img
                        src={asesorSignature}
                        alt="TTD Asesor"
                        className="h-full object-contain"
                      />
                    ) : (
                      <span className="text-gray-400 text-sm">
                        Klik untuk tanda tangan
                      </span>
                    )}
                  </div>
                  <input
                    type="date"
                    disabled={props.readOnly || props.isAsesi}
                    className="w-full sm:w-40 outline-none bg-transparent border-b border-slate-300 pb-1"
                    value={asesorDate}
                    onChange={(e) => handleAsesorDateChange(e.target.value)}
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Penyusun & Validator */}
      <div className="mt-8 border border-slate-300 bg-white text-sm">
        <div className="font-bold p-2">PENYUSUN DAN VALIDATOR</div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-137.5">
            <thead>
              <tr className="bg-white border-b border-slate-300 text-center">
                <th className="border border-slate-300 p-2 w-1/4">STATUS</th>
                <th className="border border-slate-300 p-2 w-12">NO</th>
                <th className="border border-slate-300 p-2">NAMA</th>
                <th className="border border-slate-300 p-2 w-1/4">NOMOR MET</th>
                <th className="border border-slate-300 p-2 w-1/4">
                  TANDA TANGAN DAN TANGGAL
                </th>
              </tr>
            </thead>
            <tbody>
              {penyusun.map((p, idx) => (
                <tr key={"p3-" + idx}>
                  {idx === 0 && (
                    <td
                      className="border border-slate-300 p-2 text-center align-top font-bold"
                      rowSpan={penyusun.length}
                    >
                      PENYUSUN
                    </td>
                  )}
                  <td className="border border-slate-300 p-2 text-center">
                    {idx + 1}
                  </td>
                  <td className="border border-slate-300 p-2">
                    <input
                      type="text"
                      disabled={props.readOnly || props.isAsesi}
                      className="w-full outline-none bg-transparent"
                      value={String(p.nama || "")}
                      onChange={(e) =>
                        handlePenyusunChangeInternal(
                          idx,
                          "nama",
                          e.target.value,
                        )
                      }
                    />
                  </td>
                  <td className="border border-slate-300 p-2">
                    <input
                      type="text"
                      disabled={props.readOnly || props.isAsesi}
                      className="w-full outline-none bg-transparent text-center"
                      value={p.noMet}
                      onChange={(e) =>
                        handlePenyusunChangeInternal(
                          idx,
                          "noMet",
                          e.target.value,
                        )
                      }
                    />
                  </td>
                  <td className="border border-slate-300 p-2">
                    <input
                      type="text"
                      disabled={props.readOnly || props.isAsesi}
                      className="w-full outline-none bg-transparent text-center"
                      value={String(p.ttdTanggal || "")}
                      onChange={(e) =>
                        handlePenyusunChangeInternal(
                          idx,
                          "ttdTanggal",
                          e.target.value,
                        )
                      }
                    />
                  </td>
                </tr>
              ))}
              {validator.map((v, idx) => (
                <tr key={"v3-" + idx}>
                  {idx === 0 && (
                    <td
                      className="border border-slate-300 p-2 text-center align-top font-bold"
                      rowSpan={validator.length}
                    >
                      VALIDATOR
                    </td>
                  )}
                  <td className="border border-slate-300 p-2 text-center">
                    {idx + 1}
                  </td>
                  <td className="border border-slate-300 p-2">
                    <input
                      type="text"
                      disabled={props.readOnly || props.isAsesi}
                      className="w-full outline-none bg-transparent"
                      value={v.nama}
                      onChange={(e) =>
                        handleValidatorChangeInternal(
                          idx,
                          "nama",
                          e.target.value,
                        )
                      }
                    />
                  </td>
                  <td className="border border-slate-300 p-2">
                    <input
                      type="text"
                      disabled={props.readOnly || props.isAsesi}
                      className="w-full outline-none bg-transparent text-center"
                      value={v.noMet}
                      onChange={(e) =>
                        handleValidatorChangeInternal(
                          idx,
                          "noMet",
                          e.target.value,
                        )
                      }
                    />
                  </td>
                  <td className="border border-slate-300 p-2">
                    <input
                      type="text"
                      disabled={props.readOnly || props.isAsesi}
                      className="w-full outline-none bg-transparent text-center"
                      value={v.ttdTanggal}
                      onChange={(e) =>
                        handleValidatorChangeInternal(
                          idx,
                          "ttdTanggal",
                          e.target.value,
                        )
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Navigation */}
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
              Lanjut ke Step 4 <ChevronRight size={16} />
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
        onSave={(dataUrl) => {
          handleAsesiSignatureChange(dataUrl);
        }}
      />

      <SignatureModal
        isOpen={isAsesorSigModalOpen}
        onClose={() => setIsAsesorSigModalOpen(false)}
        title="Tanda Tangan Asesor"
        initialSignature={asesorSignature}
        onSave={(dataUrl) => {
          handleAsesorSignatureChange(dataUrl);
        }}
      />
    </div>
  );
}
