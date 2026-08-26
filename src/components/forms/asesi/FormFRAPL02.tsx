import React from "react";
import { FormFRAPL02 } from "@/components/forms/FormFRAPL02";
import { EFormApl02Props } from "@/types/types";

export function EFormApl02({
  formData,
  onChange,
  allData = {},
}: EFormApl02Props) {
  const toggleK = (id: string, isK: boolean) => {
    if (!formData.isAdmin) return; // Prevent changing competencies if admin
    const kData = formData.kompetensi || {};
    onChange({
      ...formData,
      kompetensi: {
        ...kData,
        [id]: isK ? "K" : "BK",
      },
    });
  };

  return (
    <div className="w-full bg-white">
      <FormFRAPL02
        asesmenData={{
          id: Number(formData.id) || 0,
          metode: formData.metode || "",
          status: formData.status || "",
          nama: formData.namaLengkap || "AHMAD FAUZI",
          skema:
            formData.skema ||
            formData.schemeDetail?.name ||
            "Pengelolaan Pinjaman / Pembiayaan",
          noSkema:
            formData.nomorSkema ||
            formData.schemeDetail?.code ||
            "006/SKM/LSP-KJN/II/2023",
          tuk: formData.tuk || "Mandiri",
          tanggal: formData.tanggal || new Date().toLocaleDateString("en-GB"),
          schemeDetail: formData.schemeDetail,
          asesor: formData.asesorName,
          asesorReg: formData.asesorReg,
        }}
        units={formData.schemeDetail?.units?.map((u) => ({
          code: u.unitCode || u.kode || "",
          title: u.unitTitle || u.judul || "",
          elemen: (u.elemen || []).map((e) => ({
            title: e.title || e.nama || "",
            kuk: e.kuk || [],
          })),
        }))}
        answers={(formData.kompetensi as Record<string, "K" | "BK">) || {}}
        onAnswerChange={(key, val) => toggleK(key, val === "K")}
        evidenceFiles={allData}
        readOnly={formData.readOnly || formData.isAdmin}
        isAsesi={!formData.isAdmin}
        asesiName={formData.namaLengkap || "AHMAD FAUZI"}
        asesiSignature={
          typeof formData.ttdAsesi === "string"
            ? formData.ttdAsesi
            : formData.signature || formData.namaLengkap
        }
        onAsesiSignatureChange={(sig) =>
          !formData.isAdmin && onChange({ ...formData, ttdAsesi: sig })
        }
        asesorName={formData.asesorName}
        asesorReg={formData.asesorReg}
        asesorSignature={
          typeof formData.ttdAsesor === "string"
            ? formData.ttdAsesor
            : undefined
        }
        onAsesorSignatureChange={(sig) =>
          formData.isAdmin && onChange({ ...formData, ttdAsesor: sig })
        }
        rekomendasi={
          formData.rekomendasiApl02 === "Dapat dilanjutkan" ||
          formData.rekomendasiApl02 === "Tidak dapat dilanjutkan"
            ? formData.rekomendasiApl02
            : ""
        }
        onRekomendasiChange={(val) =>
          formData.isAdmin && onChange({ ...formData, rekomendasiApl02: val })
        }
        penyusun={(Array.isArray(formData.penyusun)
          ? formData.penyusun
          : []
        ).map((p) => ({
          nama: p.nama ?? "",
          noMet: p.noMet ?? "",
          ttdTanggal: p.ttdTanggal ?? "",
        }))}
        onPenyusunChange={(val) =>
          formData.isAdmin && onChange({ ...formData, penyusun: val })
        }
        validator={(Array.isArray(formData.validator)
          ? formData.validator
          : []
        ).map((v) => ({
          nama: v.nama ?? "",
          noMet: v.noMet ?? "",
          ttdTanggal: v.ttdTanggal ?? "",
        }))}
        onValidatorChange={(val) =>
          formData.isAdmin && onChange({ ...formData, validator: val })
        }
      />
    </div>
  );
}
