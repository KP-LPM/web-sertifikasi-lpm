"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Save, AlertTriangle } from "lucide-react";
import { useAppContext } from "@/context/context";
import { getPengajuanDetail, updatePengajuan } from "@/lib/api";
import { EFormApl01 } from "@/components/forms/asesi/FormFRAPL01";
import { EFormApl02 } from "@/components/forms/asesi/FormFRAPL02";
import { Apl01FormData, EvidenceFileItem } from "@/types/types";

type PengajuanDetailType = {
  id?: number;
  skema?: { namaSkema?: string; kodeSkema?: string };
  tuk?: string;
  tujuanAsesmen?: string;
  dataPribadi?: Record<string, unknown>;
  createdAt?: string;
  asesmenMandiri?: { unitId?: string; unitKompetensi?: { kodeUnit?: string }; penilaianAsesi?: string }[];
  dokumen?: { namaDokumen?: string; fileUrl?: string }[];
  [key: string]: unknown;
};

export default function EditPengajuanSkema() {
  const params = useParams();
  const router = useRouter();
  const { showNotification } = useAppContext();

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pengajuanData, setPengajuanData] = useState<PengajuanDetailType | null>(null);
  const [step, setStep] = useState(1);

  const [tempEFormData, setTempEFormData] = useState<Record<string, unknown>>({});

  useEffect(() => {
    if (params.id) {
      fetchPengajuanDetail(Number(params.id));
    }
  }, [params.id]);

  const fetchPengajuanDetail = async (id: number) => {
    setIsLoading(true);
    try {
      const data = await getPengajuanDetail(id);
      setPengajuanData(data);

      const initialEFormData: Record<string, unknown> = {
        namaSkema: data.skema?.namaSkema || "",
        kodeSkema: data.skema?.kodeSkema || "",
        tuk: data.tuk || "",
        tujuan: data.tujuanAsesmen || "Sertifikasi",
        ttdAsesi: data.dataPribadi?.tandaTangan || "",
        ...data.dataPribadi,
        schemeDetail: {
          ...data.skema,
          buktiAdministratif: data.skema?.master_bukti_administratif || data.skema?.buktiAdministratif || [],
          persyaratanDasar: data.skema?.persyaratanDasar || [],
          buktiKompetensi: data.skema?.buktiKompetensi || [],
        },
      };

      setTempEFormData(initialEFormData);

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
      const updateData = {
        dataPribadi: {
          namaLengkap: tempEFormData.namaLengkap as string | undefined,
          tempatLahir: tempEFormData.tempatLahir as string | undefined,
          tanggalLahir: tempEFormData.tanggalLahir as string | undefined,
          jenisKelamin: tempEFormData.jenisKelamin as "Perempuan" | "Laki_laki" | undefined,
          kewarganegaraan: tempEFormData.kewarganegaraan as string | undefined,
          alamat: tempEFormData.alamat as string | undefined,
          kodePosAsesi: tempEFormData.kodePosAsesi as string | undefined,
          kodeKota: tempEFormData.kodeKota as string | undefined,
          kodeProvinsi: tempEFormData.kodeProvinsi as string | undefined,
          noHp: tempEFormData.noHp as string | undefined,
          nik: tempEFormData.nik as string | undefined,
          pendidikanTerakhir: tempEFormData.pendidikanTerakhir as string | undefined,
          pekerjaan: tempEFormData.pekerjaan as string | undefined,
          namaInstitusi: tempEFormData.namaInstitusi as string | undefined,
          jabatan: tempEFormData.jabatan as string | undefined,
          alamatInstitusi: tempEFormData.alamatInstitusi as string | undefined,
          kodePosInstitusi: tempEFormData.kodePosInstitusi as string | undefined,
          telpInstitusi: tempEFormData.telpInstitusi as string | undefined,
          emailInstitusi: tempEFormData.emailInstitusi as string | undefined,
          faxInstitusi: tempEFormData.faxInstitusi as string | undefined,
          memerlukanPenyesuaianWajar: tempEFormData.memerlukanPenyesuaianWajar as boolean | undefined,
          isBerpengalaman: tempEFormData.isBerpengalaman as boolean | undefined,
          tandaTangan: tempEFormData.ttdAsesi as string | undefined,
        },
        status: "Terjadwal"
      };

      await updatePengajuan(Number(params.id), updateData);
      showNotification("Revisi pengajuan berhasil disimpan. Status telah dikembalikan ke Terjadwal.", "success");
      router.push("/asesi/overview");
    } catch (error) {
      showNotification((error as Error).message || "Gagal menyimpan revisi", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500 font-medium">Memuat data pengajuan...</div>;
  }

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push("/asesi/overview")}
          className="p-2 bg-white border border-gray-200 text-gray-500 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-2xl font-black text-slate-800">Revisi Pengajuan</h1>
          <p className="text-sm text-gray-500 font-medium">Perbaiki formulir yang membutuhkan perbaikan</p>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl flex items-start gap-3">
        <AlertTriangle className="text-yellow-600 shrink-0 mt-0.5" size={20} />
        <div>
          <h3 className="font-bold text-yellow-800">Perhatian</h3>
          <p className="text-sm text-yellow-700 mt-1">
            Harap pastikan Anda telah memperbaiki bagian yang diminta oleh Asesor sebelum menyimpan ulang form ini. Setelah disimpan, status akan kembali ke Terjadwal.
          </p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="flex border-b border-gray-100">
          <button
            onClick={() => setStep(1)}
            className={`flex-1 py-4 text-sm font-bold border-b-2 transition-colors ${step === 1 ? "border-[#008BE3] text-[#008BE3]" : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
          >
            FR.APL.01 (Data Pribadi)
          </button>
          <button
            onClick={() => setStep(2)}
            className={`flex-1 py-4 text-sm font-bold border-b-2 transition-colors ${step === 2 ? "border-[#008BE3] text-[#008BE3]" : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
          >
            FR.APL.02 (Asesmen Mandiri)
          </button>
        </div>

        <div className="p-6">
          {step === 1 ? (
            <EFormApl01
              formData={tempEFormData as unknown as Apl01FormData}
              onChange={(val) => setTempEFormData(val as Record<string, unknown>)}
            />
          ) : (
            <EFormApl02
              formData={{
                ...tempEFormData,
                schemeDetail: pengajuanData?.skema,
                readOnly: false,
                isAdmin: false,
                id: pengajuanData?.id,
                nomorSkema: pengajuanData?.skema?.kodeSkema,
                tuk: pengajuanData?.tuk,
                tanggal: pengajuanData?.createdAt ? new Date(pengajuanData.createdAt).toLocaleDateString("en-GB") : "",
                kompetensi: pengajuanData?.asesmenMandiri?.reduce((acc: Record<string, string>, curr: { unitKompetensi?: { kodeUnit?: string }; unitId?: string; penilaianAsesi?: string }) => {
                  const kode = curr.unitKompetensi?.kodeUnit || curr.unitId || "";
                  acc[kode] = curr.penilaianAsesi || "";
                  return acc;
                }, {} as Record<string, string>) || {}
              }}
              onChange={(updated) => setTempEFormData({ ...tempEFormData, ...updated })}
              allData={pengajuanData?.dokumen?.reduce((acc: Record<string, EvidenceFileItem>, curr: { namaDokumen?: string; fileUrl?: string }) => {
                const docName = curr.namaDokumen || "unknown";
                acc[docName] = { nama: docName, url: curr.fileUrl || "" };
                return acc;
              }, {} as Record<string, EvidenceFileItem>) || {}}
            />
          )}
        </div>

        <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
          <button
            onClick={() => router.push("/asesi/overview")}
            className="px-6 py-2.5 rounded-lg font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            onClick={handleUpdate}
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-lg font-bold text-white bg-[#008BE3] hover:bg-[#0076C2] transition-colors flex items-center gap-2 disabled:opacity-70 cursor-pointer"
          >
            {isSubmitting ? (
              <span className="animate-spin w-4 h-4 border-2 border-white/20 border-t-white rounded-full"></span>
            ) : (
              <Save size={18} />
            )}
            Simpan Revisi
          </button>
        </div>
      </div>
    </div>
  );
}
