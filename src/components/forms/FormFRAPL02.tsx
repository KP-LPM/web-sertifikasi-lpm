import React, { useState } from "react";
import { Eye, CheckCircle } from "lucide-react";
import { FormHeader } from "./FormHeader";
import { SignatureModal } from "./SignatureModal";
import { AVAILABLE_SCHEMES } from "@/data/schemes";
import { Assessment, EvidenceFileItem, PenyusunValidator } from "@/types/types";
 

export const DEFAULT_APL02_UNITS = [
  {
    code: "UK.01",
    title: "Melaksanakan Pemeriksaan Dokumen dan Persyaratan Asesmen",
    elemen: [
      {
        title: "Menyiapkan pemeriksaan dokumen",
        kuk: [
          "Dokumen permohonan asesmen diverifikasi kelengkapannya.",
          "Alat dan perangkat pendukung asesmen disiapkan sesuai prosedur.",
        ],
      },
      {
        title: "Melakukan pemeriksaan kesesuaian bukti",
        kuk: [
          "Pemeriksaan bukti relevan dilakukan sesuai standar skema.",
          "Hasil evaluasi dicatat dalam format laporan.",
        ],
      },
    ],
  },
  {
    code: "UK.02",
    title: "Membuat Laporan Hasil Evaluasi Portofolio dan Asesmen Mandiri",
    elemen: [
      {
        title: "Menyusun ringkasan bukti",
        kuk: [
          "Ringkasan bukti disusun berdasarkan kriteria keabsahan.",
          "Laporan direviu oleh asesor sebelum dikirimkan.",
        ],
      },
    ],
  },
];

export interface FormFRAPL02Props {
  asesmenData?: Assessment;
  units?: Array<{
    code: string;
    title: string;
    elemen?: Array<{
      title: string;
      kuk: string[];
    }>;
  }>;
  answers?: Record<string, "K" | "BK">;
  onAnswerChange?: (key: string, value: "K" | "BK") => void;
  evidenceFiles?: Record<string, EvidenceFileItem | File | string>;
  rekomendasi?: "Dapat dilanjutkan" | "Tidak dapat dilanjutkan" | "";
  onRekomendasiChange?: (
    val: "Dapat dilanjutkan" | "Tidak dapat dilanjutkan" | "",
  ) => void;
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
  onPenyusunChange?: (
    penyusun: Array<{ nama: string; noMet: string; ttdTanggal: string }>,
  ) => void;
  validator?: Array<{ nama: string; noMet: string; ttdTanggal: string }>;
  onValidatorChange?: (
    validator: Array<{ nama: string; noMet: string; ttdTanggal: string }>,
  ) => void;
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
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.classList.add("bg-red-50");
        setTimeout(() => el.classList.remove("bg-red-50"), 2000);
      }
    };
    window.addEventListener("scroll-to-unfilled", handleScroll);
    return () => window.removeEventListener("scroll-to-unfilled", handleScroll);
  }, []);

  const matchedScheme =
    AVAILABLE_SCHEMES.find(
      (s) =>
        s.name === props.asesmenData?.skema ||
        s.code === props.asesmenData?.noSkema ||
        (props.asesmenData?.skema &&
          s.name
            .toLowerCase()
            .includes(props.asesmenData.skema.toLowerCase())) ||
        (props.asesmenData?.skema &&
          props.asesmenData.skema.toLowerCase().includes(s.name.toLowerCase())),
    ) || AVAILABLE_SCHEMES[0];
  const units =
    props.units ||
    (props.asesmenData?.schemeDetail as { units?: typeof DEFAULT_APL02_UNITS })
      ?.units ||
    matchedScheme?.units ||
    DEFAULT_APL02_UNITS;
  const [localAnswers, setLocalAnswers] = useState<Record<string, "K" | "BK">>({
  });
  const [localRekomendasi, setLocalRekomendasi] = useState<
    "Dapat dilanjutkan" | "Tidak dapat dilanjutkan" | ""
  >("Dapat dilanjutkan");
  const [localAsesiName, setLocalAsesiName] = useState(
    props.asesmenData?.nama || "AHMAD FAUZI",
  );
  const [localAsesiSig, setLocalAsesiSig] = useState("");
  const [localAsesiDate, setLocalAsesiDate] = useState(
    props.asesmenData?.tanggal ||
      new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
  );

  const [localAsesorName, setLocalAsesorName] = useState(
    props.asesmenData?.asesor || "",
  );
  const [localAsesorReg, setLocalAsesorReg] = useState(
    props.asesmenData?.asesorReg || "",
  );
  const [localAsesorSig, setLocalAsesorSig] = useState("");
  const [localAsesorDate, setLocalAsesorDate] = useState(
    props.asesmenData?.tanggal ||
      new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
  );

  const defaultPenyusun = [
    {
      nama: props.asesmenData?.asesor || "",
      noMet: props.asesmenData?.asesorReg || "",
      ttdTanggal: props.asesmenData?.tanggal || "",
    },
    { nama: "", noMet: "", ttdTanggal: "" },
  ];
  const defaultValidator = [
    { nama: "", noMet: "", ttdTanggal: "" },
    { nama: "", noMet: "", ttdTanggal: "" },
  ];

  const [localPenyusun, setLocalPenyusun] = useState(defaultPenyusun);
  const [localValidator, setLocalValidator] = useState(defaultValidator);

  const [isAsesiSigModalOpen, setIsAsesiSigModalOpen] = useState(false);
  const [isAsesorSigModalOpen, setIsAsesorSigModalOpen] = useState(false);

  const answers = props.answers || localAnswers;
  const rekomendasi =
    props.rekomendasi !== undefined ? props.rekomendasi : localRekomendasi;
  const asesiName =
    props.asesiName !== undefined ? props.asesiName : localAsesiName;
  const asesiSignature =
    props.asesiSignature !== undefined ? props.asesiSignature : localAsesiSig;
  const asesiDate =
    props.asesiDate !== undefined ? props.asesiDate : localAsesiDate;
  const asesorName =
    props.asesorName !== undefined ? props.asesorName : localAsesorName;
  const asesorReg =
    props.asesorReg !== undefined ? props.asesorReg : localAsesorReg;
  const asesorSignature =
    props.asesorSignature !== undefined
      ? props.asesorSignature
      : localAsesorSig;
  const asesorDate =
    props.asesorDate !== undefined ? props.asesorDate : localAsesorDate;
  const penyusun = props.penyusun || localPenyusun;
  const validator = props.validator || localValidator;

  const handleAnswerChangeInternal = (key: string, val: "K" | "BK") => {
    if (props.onAnswerChange) {
      props.onAnswerChange(key, val);
    } else {
      setLocalAnswers((prev) => ({ ...prev, [key]: val }));
    }
  };

  const handleRekomendasiChangeInternal = (
    val: "Dapat dilanjutkan" | "Tidak dapat dilanjutkan" | "",
  ) => {
    if (props.onRekomendasiChange) {
      props.onRekomendasiChange(val);
    } else {
      setLocalRekomendasi(val);
    }
  };

  const handlePenyusunChangeInternal = (
    index: number,
    field: "nama" | "noMet" | "ttdTanggal",
    value: string,
  ) => {
    const updated = [...(penyusun as PenyusunValidator[])];
    updated[index] = { ...updated[index], [field]: value };
    if (props.onPenyusunChange) {
      props.onPenyusunChange(updated);
    } else {
      setLocalPenyusun(updated);
    }
  };

  const handleValidatorChangeInternal = (
    index: number,
    field: "nama" | "noMet" | "ttdTanggal",
    value: string,
  ) => {
    const updated = [...validator];
    updated[index] = { ...updated[index], [field]: value };
    if (props.onValidatorChange) {
      props.onValidatorChange(updated);
    } else {
      setLocalValidator(updated);
    }
  };

  return (
    <div className="animate-in fade-in duration-300">
      {props.showHeader !== false && (
        <FormHeader
          title="ASESMEN MANDIRI"
          formCode="FR.APL.02"
          asesmenData={props.asesmenData}
        />
      )}

      {/* Skema Info Box */}
      <table className="w-full table-fixed border-collapse border border-slate-300 text-xs sm:text-sm mb-6 bg-white">
        <tbody>
          <tr>
            <td className="border border-slate-300 p-2 sm:p-3 font-semibold w-25 sm:w-45 bg-slate-50 text-center align-middle">
              Skema Sertifikasi
            </td>
            <td className="border border-slate-300 p-0">
              <table className="w-full h-full table-fixed border-collapse">
                <tbody>
                  <tr>
                    <td className="border-b border-r border-slate-300 p-2 sm:p-2.5 font-semibold w-17.5 sm:w-1/6 bg-slate-50/50 whitespace-nowrap">
                      Judul :
                    </td>
                    <td className="border-b border-slate-300 p-2 sm:p-2.5 font-bold text-slate-900 wrap-break-word break-all sm:break-normal">
                      {props.asesmenData?.skema ||
                        "Pengelolaan Pinjaman / Pembiayaan"}
                    </td>
                  </tr>
                  <tr>
                    <td className="border-r border-slate-300 p-2 sm:p-2.5 font-semibold w-17.5 sm:w-1/6 bg-slate-50/50 whitespace-nowrap">
                      Nomor :
                    </td>
                    <td className="p-2 sm:p-2.5 font-medium text-slate-700 wrap-break-word break-all sm:break-normal">
                      {String(
                        props.asesmenData?.noSkema || "006/SKM/LSP-KJN/II/2023",
                      )}
                    </td>
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
            <li>
              Beri tanda centang pada kotak K (Kompeten) jika Anda yakin dapat
              melakukan tugas yang dijelaskan, atau BK (Belum Kompeten) jika
              tidak.
            </li>
            <li>
              Isi kolom di sebelah kanan dengan mendaftar bukti yang Anda
              miliki.
            </li>
          </ul>
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto border border-slate-300 mb-6 bg-white">
        <table className="w-full border-collapse text-xs sm:text-sm min-w-175">
          <thead>
            <tr className="bg-[#ebf0fa] border-b border-slate-300 text-slate-800">
              <th className="border border-slate-300 px-4 py-3 text-xs font-bold uppercase tracking-wider text-left w-1/2">
                Unit Kompetensi
              </th>
              <th className="border border-slate-300 px-4 py-3 text-xs font-bold uppercase tracking-wider text-center w-14">
                K
              </th>
              <th className="border border-slate-300 px-4 py-3 text-xs font-bold uppercase tracking-wider text-center w-14">
                BK
              </th>
              <th className="border border-slate-300 px-4 py-3 text-xs font-bold uppercase tracking-wider text-center w-1/3">
                Bukti Yang Relevan
              </th>
            </tr>
          </thead>
          <tbody>
            {units.map((unit, idx) => (
              <React.Fragment key={idx}>
                <tr className="bg-slate-50 border-t-2 border-slate-300">
                  <td
                    className="border border-slate-300 p-3 font-bold text-slate-900"
                    colSpan={4}
                  >
                    Unit Kompetensi {idx + 1} : Kode :{" "}
                    <span className="text-[#008BE3]">{unit.code}</span>
                    <br />
                    Judul : {unit.title}
                  </td>
                </tr>
                <tr className="bg-white">
                  <td className="border border-slate-300 p-2.5 font-semibold text-slate-700">
                    Dapatkah Saya ?{" "}
                    {!props.readOnly && <span className="text-red-500">*</span>}
                  </td>
                  <td className="border border-slate-300 p-2 text-center font-bold bg-slate-50/50">
                    K
                  </td>
                  <td className="border border-slate-300 p-2 text-center font-bold bg-slate-50/50">
                    BK
                  </td>
                  <td className="border border-slate-300 p-2"></td>
                </tr>
                {(unit.elemen || []).map((el, eIdx) => {
                  const fieldKey = `u${idx}e${eIdx}`;
                  const fileKey = unit.code + " - " + el.title;
                  const fileObj =
                    props.evidenceFiles?.[fileKey] ||
                    (props.evidenceFiles &&
                    Object.keys(props.evidenceFiles).length > 0
                      ? null
                      : [
                          {
                            name: `Bukti_Portofolio_${unit.code}_${eIdx + 1}.pdf`,
                            url: "#",
                          },
                        ]);
                  return (
                    <tr
                      key={eIdx}
                      id={`row-${fieldKey}`}
                      className="align-top hover:bg-slate-50/60 transition-colors scroll-m-20"
                    >
                      <td className="border border-slate-300 p-4">
                        <div className="font-bold text-slate-900 mb-2">
                          {eIdx + 1}. Elemen: {el.title}
                        </div>
                        <div className="pl-2">
                          <div className="font-semibold text-xs text-slate-500 mb-1">
                            Kriteria Unjuk Kerja:
                          </div>
                          <ul className="space-y-1">
                            {(el.kuk || []).map((k, kIdx) => (
                              <li
                                key={kIdx}
                                className="text-slate-700 text-xs flex items-start gap-1.5"
                              >
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
                          checked={answers[fieldKey] === "K"}
                          onChange={() =>
                            handleAnswerChangeInternal(fieldKey, "K")
                          }
                          className="w-4 h-4 text-[#008BE3] focus:ring-[#008BE3] cursor-pointer"
                        />
                      </td>
                      <td className="border border-slate-300 p-2 text-center align-middle">
                        <input
                          type="radio"
                          disabled={props.readOnly}
                          name={fieldKey}
                          checked={answers[fieldKey] === "BK"}
                          onChange={() =>
                            handleAnswerChangeInternal(fieldKey, "BK")
                          }
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
                                  const files = Array.isArray(fileObj)
                                    ? fileObj
                                    : [fileObj];
                                  if (files.length > 0) {
                                    const f = files[0];
                                    if (f instanceof File) {
                                      window.open(
                                        URL.createObjectURL(f),
                                        "_blank",
                                      );
                                    } else if (typeof f === "string") {
                                      window.open(f, "_blank");
                                    } else if (
                                      f &&
                                      typeof f === "object" &&
                                      "url" in f &&
                                      f.url
                                    ) {
                                      window.open(String(f.url), "_blank");
                                    } else {
                                      const fileName =
                                        f &&
                                        typeof f === "object" &&
                                        "name" in f
                                          ? String(f.name)
                                          : "File Bukti";
                                      alert("Pratinjau dokumen: " + fileName);
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
      <div className="border border-slate-300 p-4 mb-6 bg-white text-xs sm:text-sm">
        <p className="font-bold mb-3 text-slate-900">
          Rekomendasi Untuk Asesi:
        </p>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer text-slate-800">
            <input
              type="radio"
              name="rekomendasi_apl02"
              disabled={props.readOnly || props.isAsesi}
              checked={rekomendasi === "Dapat dilanjutkan"}
              onChange={() =>
                handleRekomendasiChangeInternal("Dapat dilanjutkan")
              }
              className="w-4 h-4 text-[#008BE3] focus:ring-[#008BE3]"
            />
            <span>Asesmen dapat dilanjutkan</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-slate-800">
            <input
              type="radio"
              name="rekomendasi_apl02"
              disabled={props.readOnly || props.isAsesi}
              checked={rekomendasi === "Tidak dapat dilanjutkan"}
              onChange={() =>
                handleRekomendasiChangeInternal("Tidak dapat dilanjutkan")
              }
              className="w-4 h-4 text-[#008BE3] focus:ring-[#008BE3]"
            />
            <span>Asesmen tidak dapat dilanjutkan</span>
          </label>
        </div>
      </div>

      {/* Signature Grid */}
      <div className="border border-slate-300 mb-6 grid grid-cols-1 md:grid-cols-2 bg-white">
        <div className="p-4 border-b md:border-b-0 md:border-r border-slate-300 flex flex-col justify-between">
          <div>
            <div className="flex gap-2">
              <span className="font-bold text-sm">Nama Asesor:</span>
              <input
                type="text"
                value={String(asesorName)}
                disabled={props.readOnly || props.isAsesi}
                onChange={(e) =>
                  props.onAsesorNameChange
                    ? props.onAsesorNameChange(e.target.value)
                    : setLocalAsesorName(e.target.value)
                }
                className="flex-1 border-b border-slate-300 outline-none focus:border-slate-800 bg-transparent text-sm font-medium"
                placeholder={props.isAsesi ? "(Belum ditugaskan)" : ""}
              />
            </div>
            {asesorReg !== undefined && (
              <div className="flex gap-2 items-center mt-2">
                <span className="font-bold text-sm">No Reg:</span>
                <input
                  type="text"
                  value={String(asesorReg)}
                  disabled={props.readOnly || props.isAsesi}
                  onChange={(e) =>
                    props.onAsesorRegChange
                      ? props.onAsesorRegChange(e.target.value)
                      : setLocalAsesorReg(e.target.value)
                  }
                  className="flex-1 border-b border-slate-300 outline-none focus:border-slate-800 bg-transparent text-sm font-mono"
                  placeholder={props.isAsesi ? "(Belum ditugaskan)" : ""}
                />
              </div>
            )}
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
              value={String(asesorDate)}
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
              value={String(asesiDate)}
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

      {/* Penyusun & Validator */}
      <div className="mb-6">
        <h3 className="font-bold mb-2 text-xs sm:text-sm">
          PENYUSUN DAN VALIDATOR
        </h3>
        <div className="border border-slate-300 overflow-x-auto">
          <table className="w-full border-collapse text-center text-xs sm:text-sm min-w-137.5">
            <thead>
              <tr className="bg-white border-b border-slate-300 font-bold">
                <th className="border-r border-slate-300 p-2">STATUS</th>
                <th className="border-r border-slate-300 p-2 w-12">NO</th>
                <th className="border-r border-slate-300 p-2">NAMA</th>
                <th className="border-r border-slate-300 p-2">NOMOR MET</th>
                <th className="p-2">TANDA TANGAN DAN TANGGAL</th>
              </tr>
            </thead>
            <tbody>
              {penyusun.map((p, idx) => (
                <tr key={"p-" + idx} className="border-b border-slate-300">
                  {idx === 0 && (
                    <td
                      className="border-r border-slate-300 p-2 font-bold"
                      rowSpan={penyusun.length}
                    >
                      PENYUSUN
                    </td>
                  )}
                  <td className="border-r border-slate-300 p-2">{idx + 1}</td>
                  <td className="border-r border-slate-300 p-2">
                    <input
                      type="text"
                      disabled={props.readOnly || props.isAsesi}
                      className="w-full outline-none bg-transparent"
                      value={String(p.nama)}
                      onChange={(e) =>
                        handlePenyusunChangeInternal(
                          idx,
                          "nama",
                          e.target.value,
                        )
                      }
                    />
                  </td>
                  <td className="border-r border-slate-300 p-2">
                    <input
                      type="text"
                      disabled={props.readOnly || props.isAsesi}
                      className="w-full outline-none bg-transparent text-center"
                      value={String(p.noMet)}
                      onChange={(e) =>
                        handlePenyusunChangeInternal(
                          idx,
                          "noMet",
                          e.target.value,
                        )
                      }
                    />
                  </td>
                  <td className="p-2 text-center">
                    <input
                      type="text"
                      disabled={props.readOnly || props.isAsesi}
                      className="w-full outline-none bg-transparent text-center"
                      value={String(p.ttdTanggal)}
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
                <tr
                  key={"v-" + idx}
                  className={
                    idx === validator.length - 1
                      ? ""
                      : "border-b border-slate-300"
                  }
                >
                  {idx === 0 && (
                    <td
                      className="border-r border-slate-300 p-2 font-bold"
                      rowSpan={validator.length}
                    >
                      VALIDATOR
                    </td>
                  )}
                  <td className="border-r border-slate-300 p-2">{idx + 1}</td>
                  <td className="border-r border-slate-300 p-2">
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
                  <td className="border-r border-slate-300 p-2">
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
                  <td className="p-2 text-center">
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
          ) : (
            <div />
          )}

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
          if (props.onAsesiSignatureChange)
            props.onAsesiSignatureChange(sigData);
          else setLocalAsesiSig(sigData);
        }}
      />

      <SignatureModal
        isOpen={isAsesorSigModalOpen}
        onClose={() => setIsAsesorSigModalOpen(false)}
        title="Tanda Tangan Asesor"
        initialSignature={asesorSignature}
        onSave={(sigData) => {
          if (props.onAsesorSignatureChange)
            props.onAsesorSignatureChange(sigData);
          else setLocalAsesorSig(sigData);
        }}
      />
    </div>
  );
}
