import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import path from "path";
import fs from "fs";
import { generatePdfFromHtml } from "@/lib/pdf-browser";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/* eslint-disable @typescript-eslint/no-explicit-any */

// ---------- Helper umum ----------
const esc = (v: unknown): string =>
  String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const parseFd = (v: any): Record<string, any> => {
  if (typeof v === "string") {
    try {
      return JSON.parse(v) || {};
    } catch {
      return {};
    }
  }
  return v && typeof v === "object" ? v : {};
};

// dd/mm/yyyy (UTC supaya tidak bergeser timezone)
const fmtTanggal = (d: any): string => {
  if (!d) return "";
  // Sudah berformat dd/mm/yyyy (mis. dari form web) -> jangan di-parse ulang
  if (typeof d === "string" && /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(d.trim())) return d.trim();
  const dt = new Date(d);
  if (isNaN(dt.getTime())) return typeof d === "string" ? d : "";
  const dd = String(dt.getUTCDate()).padStart(2, "0");
  const mm = String(dt.getUTCMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}/${dt.getUTCFullYear()}`;
};

const sigSrc = (v: any, origin = ""): string => {
  const s = typeof v === "string" ? v : v?.data;
  if (typeof s !== "string") return "";
  if (s.startsWith("data:image") || s.startsWith("http")) return s;
  if (s.startsWith("/") && origin) return origin + s;
  return "";
};

const radio = (checked: boolean) =>
  `<span class="radio${checked ? " on" : ""}"></span>`;

const APL02_KEY = "02. FR.APL.02 Asesmen Mandiri";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID pengajuan tidak diberikan." }, { status: 400 });
    }

    const pengajuanId = parseInt(id, 10);
    const pengajuan: any = await db.pengajuanSkema.findUnique({
      where: { id: pengajuanId },
      include: {
        user: true,
        skema: {
          include: {
            unitKompetensi: { include: { elemenKompetensi: true } },
          },
        },
        dataPribadi: true,
        dokumen: true,
        riwayat_asesmen_detail: true,
      },
    });

    if (!pengajuan) {
      return NextResponse.json({ error: "Pengajuan tidak ditemukan." }, { status: 404 });
    }

    const data = pengajuan.dataPribadi;
    const user = pengajuan.user;
    const units: any[] = pengajuan.skema?.unitKompetensi || [];

    // ---------- Data form tersimpan (FR.APL.02 diprioritaskan) ----------
    const riwayat: any[] = Array.isArray(pengajuan.riwayat_asesmen_detail)
      ? pengajuan.riwayat_asesmen_detail
      : [];
    const ordered = [
      ...riwayat.filter((r) => r.form_type === "FR.APL.02"),
      ...riwayat.filter((r) => r.form_type !== "FR.APL.02"),
    ];
    const fds: Record<string, any>[] = ordered.map((r) => {
      const f = parseFd(r.form_data);
      return { ...f, ...parseFd(f[APL02_KEY]) };
    });
    const pick = (key: string): any => {
      for (const f of fds) {
        const v = f?.[key];
        if (v !== undefined && v !== null && v !== "") return v;
      }
      return undefined;
    };

    // ---------- Header info ----------
    const namaAsesi = String(pick("namaLengkap") || data?.namaLengkap || user?.username || "");
    const tuk = String(pick("tuk") ?? pengajuan.tuk ?? "");
    const namaAsesor = String(pick("asesorName") ?? "");
    const noRegAsesor = String(pick("asesorReg") ?? "");
    const tanggal =
      (typeof pick("tanggal") === "string" && pick("tanggal")) ||
      fmtTanggal(pengajuan.createdAt);

    // ---------- Rekomendasi & tanda tangan ----------
    const rekomendasi = String(pick("rekomendasiApl02") ?? "");
    const origin = new URL(req.url).origin;
    const ttdAsesi =
      sigSrc(pick("ttdAsesi"), origin) ||
      sigSrc(pick("signature"), origin) ||
      sigSrc(data?.tandaTangan, origin) ||
      sigSrc(data?.tanda_tangan, origin) ||
      sigSrc(user?.tandaTangan, origin);
    const ttdAsesor = sigSrc(pick("ttdAsesor"), origin);
    // Kalau tanda tangan tersimpan berupa teks (bukan gambar), web menampilkannya sebagai tanda tangan elektronik
    const rawAsesi = pick("ttdAsesi");
    const ttdAsesiText =
      typeof rawAsesi === "string" && rawAsesi.trim() && !ttdAsesi ? rawAsesi : namaAsesi;
    const tglAsesi = fmtTanggal(pick("tanggalAsesi") ?? pick("asesiDate") ?? tanggal);
    const tglAsesor = fmtTanggal(pick("tanggalAsesor") ?? pick("asesorDate"));

    // ---------- Logo ----------
    const logoPath = path.join(process.cwd(), "public", "logo-lsp.png");
    let logoBase64 = "";
    if (fs.existsSync(logoPath)) {
      logoBase64 = `data:image/png;base64,${fs.readFileSync(logoPath).toString("base64")}`;
    }

    // ---------- Jawaban K / BK ----------
    // Key jawaban di komponen web: `u${indexUnit}e${indexElemen}`
    const kompetensi: Record<string, any> = parseFd(pick("kompetensi"));
    const getAnswer = (unitIdx: number, eIdx: number): string => {
      const v = kompetensi[`u${unitIdx}e${eIdx}`];
      return v === "K" || v === "BK" ? v : "";
    };

    // ---------- Bukti yang relevan ----------
    // Sama seperti komponen web: bukti disimpan di form_data dengan key "<kodeUnit> - <namaElemen>"
    const hasBukti = (kodeUnit: string, namaElemen: string): boolean => {
      const key = `${kodeUnit} - ${namaElemen}`;
      return fds.some((f) => {
        const v = f?.[key];
        if (Array.isArray(v)) return v.length > 0;
        return !!v;
      });
    };

    const pillOk = `<span class="pill ok"><svg viewBox="0 0 16 16" width="10" height="10"><circle cx="8" cy="8" r="6.5" fill="none" stroke="#047857" stroke-width="1.4"/><path d="M5 8.2 7.1 10.2 11 6" fill="none" stroke="#047857" stroke-width="1.5"/></svg>Telah Dilampirkan</span>`;
    const pillNo = `<span class="pill no">Belum Dilampirkan</span>`;

    // ---------- Baris unit ----------
    const unitsHtml = units
      .map((unit, idx) => {
        const elemRows = (unit.elemenKompetensi || [])
          .map((el: any, eIdx: number) => {
            let kukLines: string[] = [];
            try {
              const parsed = JSON.parse(el.kriteriaUnjukKerja);
              kukLines = Array.isArray(parsed) ? parsed : [String(el.kriteriaUnjukKerja)];
            } catch {
              kukLines = String(el.kriteriaUnjukKerja || "")
                .split("\n")
                .filter((k) => k.trim());
            }
            const ans = getAnswer(idx, eIdx);
            return `
              <tr class="r-elem">
                <td class="td-elem">
                  <div class="elem-title">${eIdx + 1}. Elemen: ${esc(el.namaElemen)}</div>
                  <div class="kuk-label">Kriteria Unjuk Kerja:</div>
                  ${kukLines.map((k) => `<div class="kuk">${esc(k)}</div>`).join("")}
                </td>
                <td class="c-center">${radio(ans === "K")}</td>
                <td class="c-center">${radio(ans === "BK")}</td>
                <td class="c-center">${hasBukti(unit.kodeUnit, el.namaElemen) ? pillOk : pillNo}</td>
              </tr>`;
          })
          .join("");

        return `
          <tbody class="unit">
            <tr class="r-unit">
              <td colspan="4">
                <div class="unit-line">Unit Kompetensi ${idx + 1} : Kode : <span class="kode">${esc(unit.kodeUnit)}</span></div>
                <div class="unit-line">Judul : ${esc(unit.judulUnit)}</div>
              </td>
            </tr>
            <tr class="r-tanya">
              <td>Dapatkah Saya ? <span class="req">*</span></td>
              <td class="c-center strong">K</td>
              <td class="c-center strong">BK</td>
              <td></td>
            </tr>
            ${elemRows}
          </tbody>`;
      })
      .join("");

    // ---------- Tanda tangan ----------
    const ttdAsesiHtml = ttdAsesi
      ? `<img class="signature-image" src="${esc(ttdAsesi)}" alt="Tanda tangan asesi" />`
      : `<div class="ttd-auto"><div class="ttd-auto-name">${esc(ttdAsesiText)}</div><div class="ttd-auto-note">Ditandatangani secara elektronik</div></div>`;
    const ttdAsesorHtml = ttdAsesor
      ? `<img class="signature-image" src="${esc(ttdAsesor)}" alt="Tanda tangan asesor" />`
      : `<div class="ttd-none">Tanda tangan belum tersedia</div>`;

    const htmlContent = `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
  @page { size: A4; margin: 12mm 12mm 12mm 12mm; }
  * { box-sizing: border-box; }
  body { font-family: 'Plus Jakarta Sans', Arial, sans-serif; color: #1e293b; font-size: 10px; line-height: 1.45; margin: 0; }

  .header { display: flex; align-items: center; gap: 14px; border-bottom: 2px solid #1e293b; padding-bottom: 12px; margin-bottom: 16px; }
  .header img { height: 52px; width: auto; object-fit: contain; }
  .header h2 { margin: 0; font-size: 15px; font-weight: 800; text-transform: uppercase; }

  table { width: 100%; border-collapse: collapse; }
  td, th { border: 1px solid #cbd5e1; padding: 6px 8px; vertical-align: middle; }

  table.info td.lbl { width: 22%; text-align: center; font-weight: 600; }
  table.info td.val { text-align: left; }
  table.info td.val.b { font-weight: 700; }

  hr.sep { border: 0; border-top: 2px solid #1e293b; margin: 14px 0 14px; }

  .panduan { border: 1px solid #cbd5e1; margin-bottom: 14px; break-inside: avoid; }
  .panduan .ph { display: flex; justify-content: space-between; align-items: center; background: #f8fafc; border-bottom: 1px solid #cbd5e1; padding: 8px 10px; }
  .panduan .ph b { font-size: 10px; text-transform: uppercase; }
  .badge { background: #fef9c3; border: 1px solid #fde68a; color: #92400e; border-radius: 4px; padding: 2px 8px; font-size: 8.5px; font-weight: 600; }
  .panduan .pb { padding: 8px 10px 4px; }
  .panduan ul { margin: 4px 0 4px; padding-left: 18px; }
  .panduan li { margin: 2px 0; }

  table.main { border: 1px solid #cbd5e1; }
  table.main thead { display: table-header-group; }
  table.main th { background: #ebf0fa; font-weight: 700; text-transform: uppercase; letter-spacing: .03em; font-size: 9px; padding: 8px; text-align: center; }
  tr { break-inside: avoid; page-break-inside: avoid; }
  tr.r-unit td { background: #f8fafc; padding: 8px 8px; }
  .unit-line { font-weight: 700; font-size: 10.5px; }
  .kode { color: #0284c7; }
  tr.r-tanya td { font-weight: 500; }
  .req { color: #ef4444; font-weight: 700; }
  .strong { font-weight: 700; }
  .c-center { text-align: center; width: 10%; }
  td.td-elem { width: 56%; vertical-align: top; }
  tr.r-elem td:last-child { width: 24%; }
  .elem-title { font-weight: 700; margin-bottom: 4px; }
  .kuk-label { font-weight: 600; color: #475569; font-size: 9px; margin: 2px 0 2px 6px; }
  .kuk { font-size: 9px; color: #475569; margin: 1px 0 1px 6px; }

  .radio { display: inline-block; width: 11px; height: 11px; border: 1px solid #94a3b8; border-radius: 50%; vertical-align: middle; position: relative; background: #fff; }
  .radio.on { border-color: #0f172a; }
  .radio.on::after { content: ""; position: absolute; inset: 2px; border-radius: 50%; background: #0f172a; }

  .pill { display: inline-flex; align-items: center; gap: 4px; border-radius: 999px; padding: 2px 9px; font-size: 8.5px; font-weight: 700; }
  .pill.ok { background: #ecfdf5; border: 1px solid #a7f3d0; color: #047857; }
  .pill.no { background: #f1f5f9; border: 1px solid #cbd5e1; color: #64748b; }

  .rekom { border: 1px solid #cbd5e1; padding: 10px 12px; margin-top: 14px; break-inside: avoid; }
  .rekom .rt { font-weight: 700; font-size: 10.5px; margin-bottom: 8px; }
  .rekom .opt { display: block; margin: 5px 0; font-size: 10.5px; }
  .rekom .opt .radio { margin-right: 8px; width: 12px; height: 12px; }

  table.ttd { margin-top: 14px; break-inside: avoid; page-break-inside: avoid; }
  table.ttd td { vertical-align: top; padding: 10px 12px; width: 50%; height: 90px; }
  .ln { border-bottom: 1px solid #cbd5e1; padding-bottom: 2px; margin-bottom: 8px; }
  .ln b { margin-right: 6px; }
  .muted { color: #94a3b8; }
  .signature-image { display: block; max-height: 62px; max-width: 200px; margin: 6px 0; }
  .ttd-none { font-style: italic; font-size: 9px; color: #94a3b8; margin: 10px 0 14px; }
  .ttd-auto { height: 52px; margin: 6px 0; }
  .ttd-auto-name { font-family: 'Brush Script MT', 'Segoe Script', cursive; font-size: 20px; color: #1e40af; transform: rotate(-5deg); transform-origin: left center; }
  .ttd-auto-note { font-size: 8px; color: #64748b; margin-top: 4px; }
  .tgl { border-bottom: 1px solid #cbd5e1; padding: 4px 0 2px; margin-top: 8px; min-height: 18px; }
</style>
</head>
<body>
  <div class="header">
    ${logoBase64 ? `<img src="${logoBase64}" alt="Logo LSP" />` : ""}
    <h2>FR.APL.02 ASESMEN MANDIRI</h2>
  </div>

  <table class="info">
    <tr><td class="lbl">Skema Sertifikasi</td><td class="val b">${esc(pengajuan.skema?.namaSkema)}</td></tr>
    <tr><td class="lbl">Nomor Skema</td><td class="val">${esc(pengajuan.skema?.kodeSkema)}</td></tr>
    <tr><td class="lbl">TUK</td><td class="val">${esc(tuk) || "-"}</td></tr>
    <tr><td class="lbl">Nama Asesor</td><td class="val">${esc(namaAsesor) || "-"}</td></tr>
    <tr><td class="lbl">Nama Asesi</td><td class="val">${esc(namaAsesi)}</td></tr>
    <tr><td class="lbl">Tanggal</td><td class="val">${esc(tanggal)}</td></tr>
  </table>

  <hr class="sep" />

  <div class="panduan">
    <div class="ph">
      <b>Panduan Asesmen Mandiri</b>
      <span class="badge">Penilaian K / BK diisi oleh Asesor berdasarkan bukti yang Anda lampirkan</span>
    </div>
    <div class="pb">
      <b>Instruksi:</b>
      <ul>
        <li>Baca setiap pertanyaan di kolom sebelah kiri.</li>
        <li>Status K (Kompeten) dan BK (Belum Kompeten) akan diverifikasi dan ditentukan oleh Asesor.</li>
        <li>Pastikan bukti pendukung yang relevan telah terunggah pada setiap unit kompetensi.</li>
      </ul>
    </div>
  </div>

  <table class="main">
    <thead>
      <tr>
        <th style="width:56%; text-align:left">Unit Kompetensi</th>
        <th style="width:10%">K</th>
        <th style="width:10%">BK</th>
        <th style="width:24%">Bukti yang Relevan</th>
      </tr>
    </thead>
    ${unitsHtml || `<tbody><tr><td colspan="4" class="muted" style="text-align:center">Belum ada unit kompetensi.</td></tr></tbody>`}
  </table>

  <div class="rekom">
    <div class="rt">Rekomendasi Untuk Asesi:</div>
    <span class="opt">${radio(rekomendasi === "Dapat dilanjutkan")}Asesmen dapat dilanjutkan</span>
    <span class="opt">${radio(rekomendasi === "Tidak dapat dilanjutkan")}Asesmen tidak dapat dilanjutkan</span>
  </div>

  <table class="ttd">
    <tr>
      <td>
        <div class="ln"><b>Nama Asesor:</b>${namaAsesor ? esc(namaAsesor) : `<span class="muted">(Belum ditugaskan)</span>`}</div>
        <div class="ln"><b>No Reg:</b>${noRegAsesor ? esc(noRegAsesor) : `<span class="muted">(Belum ditugaskan)</span>`}</div>
      </td>
      <td>
        <b>Tanggal dan Tanda Tangan Asesor:</b>
        ${ttdAsesorHtml}
        <div class="tgl">${esc(tglAsesor)}</div>
      </td>
    </tr>
    <tr>
      <td>
        <div class="ln"><b>Nama Asesi:</b>${esc(namaAsesi)}</div>
      </td>
      <td>
        <b>Tanggal dan Tanda Tangan Asesi:</b>
        ${ttdAsesiHtml}
        <div class="tgl">${esc(tglAsesi)}</div>
      </td>
    </tr>
  </table>
</body>
</html>`;

    const pdfBuffer = await generatePdfFromHtml(htmlContent, {
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true, // margin diatur lewat @page di CSS
    });

    return new NextResponse(pdfBuffer as unknown as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="APL02_${pengajuan.id}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Error generate APL.02 PDF:", error);
    return NextResponse.json({ error: "Gagal membuat file APL.02 PDF." }, { status: 500 });
  }
}
