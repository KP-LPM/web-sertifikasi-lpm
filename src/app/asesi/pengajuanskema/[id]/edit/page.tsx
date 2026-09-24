"use client";

import React, { useState, useEffect, ReactNode } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Save, X, FileText, Download, Trash2, CheckCircle, Upload } from "lucide-react";
import { useAppContext } from "@/context/context";
import { getPengajuanDetail, updatePengajuan } from "@/lib/api";
import { supabase } from "@/lib/supabase";
import { EFormApl01 } from "@/components/forms/asesi/FormFRAPL01";
import { Apl01FormData } from "@/types/types";

type PengajuanDetailType = {
  id?: number;
  status?: string;
  skema?: { namaSkema?: string; kodeSkema?: string; [key: string]: unknown };
  tuk?: string;
  tujuanAsesmen?: string;
  dataPribadi?: Record<string, unknown>;
  createdAt?: string;
  verifikasi_pengajuan?: {
    catatan?: string | null;
    rekomendasi?: string | null;
  } | null;
  [key: string]: unknown;
};

interface ActiveModalDoc {
  name?: string;
  url?: string;
  isPreview?: boolean;
  [key: string]: unknown;
}

export default function EditPengajuanSkema() {
  const params = useParams();
  const router = useRouter();
  const { showNotification } = useAppContext();

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apl01FormData, setApl01FormData] = useState<Apl01FormData>({} as Apl01FormData);

  // States untuk fitur Re-upload dokumen
  const [activeModalDoc, setActiveModalDoc] = useState<ActiveModalDoc | null>(null);
  const [tempFiles, setTempFiles] = useState<File[]>([]);
  const [eFormData, setEFormData] = useState<Record<string, unknown>>({});

  useEffect(() => {
    if (params.id) {
      fetchPengajuanDetail(Number(params.id));
    }
  }, [params.id]);

  const fetchPengajuanDetail = async (id: number) => {
    setIsLoading(true);
    try {
      const data = await getPengajuanDetail(id);
      const dp = data.dataPribadi as Record<string, unknown> | undefined;
      const adminCatatan = data.verifikasi_pengajuan?.catatan;

      setApl01FormData({
        isAdmin: false,
        readOnly: false,
        hidePaymentFields: true,
        namaSkema: data.skema?.namaSkema || "",
        kodeSkema: data.skema?.kodeSkema || "",
        tuk: data.tuk || "",
        tujuan: data.tujuanAsesmen || "Sertifikasi",
        ttdAsesi: (dp?.tandaTangan as string) || null,
        catatan: adminCatatan || "",
        ...dp,
        schemeDetail: {
          ...data.skema,
          buktiAdministratif: (data.skema?.master_bukti_administratif as unknown[]) || (data.skema?.buktiAdministratif as unknown[]) || [],
          persyaratanDasar: (data.skema?.persyaratanDasar as unknown[]) || [],
          buktiKompetensi: (data.skema?.buktiKompetensi as unknown[]) || [],
        },
        checklist: (data.checklist as Record<string, boolean>) || {},
        dokumen: (data.dokumen as unknown[]) || [],
      } as unknown as Apl01FormData);

    } catch (error) {
      console.error("Error fetching detail:", error);
      showNotification((error as Error).message || "Gagal memuat detail pengajuan", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async () => {
    setIsSubmitting(true);
    try {
      showNotification("Menyimpan revisi dan mengunggah dokumen (jika ada)...", "success");

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const finalDokumen = [...((apl01FormData.dokumen as any[]) || [])];

      // Upload file baru yang ada di eFormData ke Supabase
      for (const [namaDokumen, value] of Object.entries(eFormData)) {
        const files: unknown[] = Array.isArray(value) ? value : [value];

        for (const file of files) {
          if (file instanceof File) {
            const fileExt = file.name.split(".").pop() || "pdf";
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
              .from("dokumen-pengajuan")
              .upload(fileName, file);

            if (uploadError) {
              throw new Error(`Gagal mengunggah ${namaDokumen}: ${uploadError.message}`);
            }

            const { data: urlData } = supabase.storage
              .from("dokumen-pengajuan")
              .getPublicUrl(fileName);

            const existingIndex = finalDokumen.findIndex((d) => d.namaDokumen === namaDokumen);
            if (existingIndex > -1) {
              finalDokumen[existingIndex].fileUrl = urlData.publicUrl; // Replace existing URL
            } else {
              finalDokumen.push({ namaDokumen, fileUrl: urlData.publicUrl }); // Push new document
            }
          }
        }
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const cleanDokumen = finalDokumen.map((d: any) => ({
        namaDokumen: d.namaDokumen,
        fileUrl: d.fileUrl,
      }));

      // Susun data persis seperti skema awal, ditambah dokumen yang sudah dibersihkan
      const updateData = {
        dataPribadi: {
          namaLengkap: apl01FormData.namaLengkap as string | undefined,
          tempatLahir: apl01FormData.tempatLahir as string | undefined,
          tanggalLahir: apl01FormData.tanggalLahir as string | undefined,
          jenisKelamin: apl01FormData.jenisKelamin as "Perempuan" | "Laki_laki" | undefined,
          kewarganegaraan: apl01FormData.kewarganegaraan as string | undefined,
          alamat: apl01FormData.alamat as string | undefined,
          kodePosAsesi: apl01FormData.kodePosAsesi as string | undefined,
          kodeKota: apl01FormData.kodeKota as string | undefined,
          kodeProvinsi: apl01FormData.kodeProvinsi as string | undefined,
          noHp: apl01FormData.noHp as string | undefined,
          nik: apl01FormData.nik as string | undefined,
          pendidikanTerakhir: apl01FormData.pendidikanTerakhir as string | undefined,
          pekerjaan: apl01FormData.pekerjaan as string | undefined,
          namaInstitusi: apl01FormData.namaInstitusi as string | undefined,
          jabatan: apl01FormData.jabatan as string | undefined,
          alamatInstitusi: apl01FormData.alamatInstitusi as string | undefined,
          kodePosInstitusi: apl01FormData.kodePosInstitusi as string | undefined,
          telpInstitusi: apl01FormData.telpInstitusi as string | undefined,
          emailInstitusi: apl01FormData.emailInstitusi as string | undefined,
          faxInstitusi: apl01FormData.faxInstitusi as string | undefined,
          memerlukanPenyesuaianWajar: apl01FormData.memerlukanPenyesuaianWajar as boolean | undefined,
          isBerpengalaman: apl01FormData.isBerpengalaman as boolean | undefined,
          tandaTangan: apl01FormData.ttdAsesi as string | undefined,
        },
        status: "Menunggu Verifikasi",
        dokumen: cleanDokumen, 
      };

      await updatePengajuan(Number(params.id), updateData);
      showNotification("Revisi berhasil disimpan. Status kembali ke Menunggu Verifikasi.", "success");
      router.push("/asesi/pengajuanskema");
      
      } catch (error: unknown) {
      let errorMessage = "Gagal menyimpan revisi";

      // Tangkap pesan error bawaan (jika ada)
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      // Definisikan struktur tipe balikan error dari API backend-mu
      type ApiError = {
        response?: {
          data?: {
            message?: string;
            data?: {
              fieldErrors?: {
                dataPribadi?: string[];
              };
            };
          };
        };
      };

      // Casting error ke struktur ApiError
      const apiError = error as ApiError;
      const fieldErrors = apiError.response?.data?.data?.fieldErrors;
      
      if (fieldErrors?.dataPribadi && fieldErrors.dataPribadi.length > 0) {
        errorMessage = `Gagal menyimpan: Data Pribadi - ${fieldErrors.dataPribadi.join(", ")}`;
      } else if (apiError.response?.data?.message) {
        errorMessage = apiError.response.data.message;
      }
      
      showNotification(errorMessage, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Dinamis menyuntikkan handler untuk mencegah stale closure, selalu membaca state terbaru eFormData
  const formDataWithHandlers = {
    ...apl01FormData,
    onPreview: (docName: string) => {
      const newFiles = eFormData[docName] as File[];
      let url = "";

      if (newFiles && newFiles.length > 0) {
        url = URL.createObjectURL(newFiles[0]);
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const existing = ((apl01FormData.dokumen as any[]) || []).find((d) => d.namaDokumen === docName);
        if (existing) url = existing.fileUrl;
      }

      if (url) {
        setActiveModalDoc({ name: docName, isPreview: true, url });
      } else {
        showNotification("Dokumen belum diunggah", "error");
      }
    },
    onUpload: (docName: string) => {
      setActiveModalDoc({ name: docName, isPreview: false });
    },
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-blue-400/30 border-t-[#008BE3] rounded-full animate-spin" />
          <p className="text-gray-500 font-medium text-sm">Memuat data pengajuan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-8 pb-8 pt-0 md:pt-2 space-y-6 max-w-[1400px] w-full mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push("/asesi/pengajuanskema")}
          className="p-2 bg-white border border-gray-200 text-gray-500 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-2xl font-black text-slate-800">Revisi Pengajuan</h1>
          <p className="text-sm text-gray-500 font-medium">
            Perbaiki formulir &amp; upload ulang dokumen berdasarkan catatan admin
          </p>
        </div>
      </div>

      {/* Form APL-01 */}
      <EFormApl01
        formData={formDataWithHandlers}
        onChange={(val) => setApl01FormData(val)}
      />

      <div className="flex justify-end gap-2 pt-2 pb-12">
        <button
          onClick={() => router.push("/asesi/pengajuanskema")}
          className="px-5 py-2.5 rounded-lg text-sm font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
        >
          Batal
        </button>
        <button
          onClick={handleUpdate}
          disabled={isSubmitting}
          className="px-5 py-2.5 rounded-lg text-sm font-bold text-white bg-[#008BE3] hover:bg-[#0076C2] shadow-sm transition-colors flex items-center gap-2 disabled:opacity-70 cursor-pointer"
        >
          {isSubmitting ? (
            <span className="animate-spin w-4 h-4 border-2 border-white/20 border-t-white rounded-full" />
          ) : (
            <Save size={16} />
          )}
          Simpan &amp; Kirim Ulang
        </button>
      </div>

      {/* DOCUMENT / UPLOAD MODAL */}
      {activeModalDoc && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className={`bg-white rounded-xl shadow-xl w-full ${activeModalDoc.isPreview ? 'max-w-4xl' : 'max-w-lg'} overflow-hidden animate-in fade-in zoom-in-95 duration-200`}>
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-sm">
                {activeModalDoc.isPreview ? "Pratinjau Dokumen: " : "Lampirkan File Ulang: "}
                {(activeModalDoc.name as ReactNode)}
              </h3>
              <button
                onClick={() => {
                  setActiveModalDoc(null);
                  setTempFiles([]);
                }}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              {activeModalDoc.isPreview ? (
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="w-full rounded-lg overflow-hidden border border-slate-200 shadow-sm bg-slate-50 relative h-[65vh] flex items-center justify-center">
                    {(() => {
                      const files = activeModalDoc.name ? (eFormData[activeModalDoc.name] as File[]) : [];
                      const file = files?.[0];
                      const url = (activeModalDoc.url as string | undefined) || (file ? URL.createObjectURL(file) : null);
                      const isImg = url?.match(/\.(jpeg|jpg|gif|png)$/i) || file?.type.startsWith("image/");

                      if (url) {
                        if (isImg) {
                          return <img src={url} alt="Preview" className="w-full h-full object-contain bg-slate-100" />;
                        }
                        return <iframe src={url} className="w-full h-full rounded-lg bg-white" />;
                      }

                      return (
                        <div className="text-center p-6 opacity-60">
                          <FileText size={48} className="mx-auto text-slate-400 mb-3" />
                          <p className="font-bold text-slate-500">Pratinjau Dokumen</p>
                          <p className="text-xs text-slate-400 mt-1">{activeModalDoc.name}</p>
                        </div>
                      );
                    })()}
                  </div>
                  <div className="flex gap-2 justify-center mt-2 w-full">
                    <button
                      onClick={() => {
                        const files = activeModalDoc.name ? (eFormData[activeModalDoc.name] as File[]) : [];
                        const file = files?.[0];
                        const url = (activeModalDoc.url as string | undefined) || (file ? URL.createObjectURL(file) : null);

                        if (url) {
                          if (file && !activeModalDoc.url) {
                            const a = document.createElement("a");
                            a.href = url;
                            a.download = file.name || "download";
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                          } else {
                            window.open(url, "_blank");
                          }
                        } else {
                          showNotification("Dokumen tidak ditemukan.", "error");
                        }
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 font-bold rounded-lg text-sm hover:bg-slate-50 transition-colors shadow-xs cursor-pointer"
                    >
                      {activeModalDoc.url ? <><FileText size={16} /> Buka File</> : <><Download size={16} /> Unduh</>}
                    </button>
                    <button
                      onClick={() => {
                        const docName = activeModalDoc.name;
                        if (typeof docName === "string") {
                          // 1. Hapus dari state lokal (jika baru diupload di draft)
                          const newEFormData = { ...eFormData };
                          delete newEFormData[docName];
                          setEFormData(newEFormData);

                          // 2. Hapus dari data yang dari server
                          setApl01FormData((prev) => ({
                            ...prev,
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            dokumen: ((prev.dokumen as any[]) || []).filter((d) => d.namaDokumen !== docName)
                          }));

                          showNotification("File berhasil dihapus", "success");
                        }
                        setActiveModalDoc(null);
                        setTempFiles([]);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white border border-red-200 text-red-500 font-bold rounded-lg text-sm hover:bg-red-50 transition-colors shadow-xs cursor-pointer"
                    >
                      <Trash2 size={16} /> Hapus File
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <label className="relative bg-slate-50 border border-slate-200 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-100 transition-colors">
                    <Upload size={32} className="text-[#008BE3] mb-3" />
                    <p className="text-sm font-bold text-slate-800 mb-1">
                      Klik atau seret file ke sini untuk mengganti
                    </p>
                    <p className="text-xs text-slate-500 font-medium">
                      Mendukung file PDF, JPG, PNG (Maks 5MB)
                    </p>
                    <input
                      type="file"
                      multiple
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          const newFiles = Array.from(e.target.files);
                          setTempFiles([...tempFiles, ...newFiles]);
                        }
                      }}
                    />
                  </label>
                  {tempFiles.length > 0 && (
                    <div className="mt-4 space-y-2 max-h-40 overflow-y-auto pr-2">
                      {tempFiles.map((file, idx) => (
                        <div
                          key={idx}
                          className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold">
                            <CheckCircle size={16} className="text-emerald-600 shrink-0" />
                            <span className="truncate max-w-50 sm:max-w-xs">
                              {file.name || "Telah diunggah"}
                            </span>
                          </div>
                          <button
                            onClick={() => {
                              const newFiles = tempFiles.filter((_, i) => i !== idx);
                              setTempFiles(newFiles);
                            }}
                            className="p-1.5 text-red-500 hover:bg-red-100 rounded-md transition-colors cursor-pointer"
                            title="Hapus File"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 rounded-b-xl">
              <button
                onClick={() => {
                  setActiveModalDoc(null);
                  setTempFiles([]);
                }}
                className="px-4 py-2 bg-white text-slate-700 border border-slate-300 rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors cursor-pointer"
              >
                {activeModalDoc.isPreview ? "Tutup" : "Batal"}
              </button>
              {!activeModalDoc.isPreview && (
                <button
                  onClick={() => {
                    if (tempFiles.length === 0) {
                      showNotification("Harap pilih file terlebih dahulu.", "error");
                      return;
                    }
                    if (typeof activeModalDoc.name === "string") {
                      setEFormData({
                        ...eFormData,
                        [activeModalDoc.name]: tempFiles,
                      });
                      showNotification("File baru sementara disimpan. Tekan Simpan & Kirim Ulang untuk menerapkan perubahan.", "success");
                      setActiveModalDoc(null);
                      setTempFiles([]);
                    }
                  }}
                  className="px-4 py-2 bg-[#008BE3] text-white rounded-lg text-sm font-bold hover:bg-[#0076C2] transition-colors cursor-pointer"
                >
                  Simpan Perubahan
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}