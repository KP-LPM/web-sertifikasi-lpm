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

const fmtTanggal = (d: any): string => {
  if (!d) return "";
  const dt = new Date(d);
  if (isNaN(dt.getTime())) return "";
  // dd/mm/yyyy, pakai UTC agar tanggal lahir tidak bergeser oleh timezone server
  const dd = String(dt.getUTCDate()).padStart(2, "0");
  const mm = String(dt.getUTCMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}/${dt.getUTCFullYear()}`;
};

const fmtTanggalPanjang = (d: any): string => {
  const dt = d ? new Date(d) : new Date();
  return dt.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  });
};

// Ambil sumber gambar tanda tangan (data URL / http URL) dari string atau objek {type,data}
const sigSrc = (v: any): string => {
  const s = typeof v === "string" ? v : v?.data;
  if (typeof s === "string" && (s.startsWith("data:image") || s.startsWith("http"))) {
    return s;
  }
  return "";
};

// ---------- Komponen HTML kecil ----------
const radio = (checked: boolean) =>
  `<span class="radio${checked ? " on" : ""}"></span>`;

const checkbox = (checked: boolean) =>
  `<span class="cb${checked ? " on" : ""}">${
    checked
      ? `<svg viewBox="0 0 10 10" width="9" height="9"><path d="M1.5 5.2 4 7.6 8.6 2.4" fill="none" stroke="#000" stroke-width="1.6"/></svg>`
      : ""
  }</span>`;

const TUJUAN_OPTIONS: { value: string; label: string; aliases: string[] }[] = [
  { value: "Sertifikasi", label: "Sertifikasi", aliases: ["sertifikasi"] },
  { value: "Sertifikasi Ulang", label: "Sertifikasi Ulang", aliases: ["sertifikasi ulang"] },
  { value: "PKT", label: "Pengakuan Kompetensi Terkini (PKT)", aliases: ["pkt", "pengakuan kompetensi terkini (pkt)"] },
  { value: "RPL", label: "Rekognisi Pembelajaran Lampau (RPL)", aliases: ["rpl", "rekognisi pembelajaran lampau (rpl)"] },
  { value: "Lainnya", label: "Lainnya", aliases: ["lainnya"] },
];

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
        skema: { include: { unitKompetensi: true } },
        dataPribadi: true,
        dokumen: true,
        riwayat_asesmen_detail: true,
      },
    });

    if (!pengajuan) {
      return NextResponse.json({ error: "Pengajuan tidak ditemukan." }, { status: 404 });
    }

    // ---------- Daftar persyaratan (Bagian 3) ----------
    // Query terpisah + try/catch: kalau nama relasi di schema.prisma berbeda,
    // PDF tetap jadi (Bagian 3 kosong) dan error tercatat di log server.
    let persyaratanDasar: string[] = [];
    let buktiAdministratif: string[] = [];
    try {
      const extra: any = await db.pengajuanSkema.findUnique({
        where: { id: pengajuanId },
        include: {
          skema: {
            include: {
              persyaratanDasar: true,
              master_bukti_administratif: true,
            },
          },
        },
      });
      const sortUrut = (a: any, b: any) => (a?.urutan ?? 0) - (b?.urutan ?? 0);
      persyaratanDasar = [...(extra?.skema?.persyaratanDasar || [])]
        .sort(sortUrut)
        .map((p: any) => p.namaDokumen)
        .filter(Boolean);
      buktiAdministratif = [...(extra?.skema?.master_bukti_administratif || [])]
        .filter((a: any) => a.isAktif !== false)
        .sort(sortUrut)
        .map((a: any) => a.namaDokumen)
        .filter(Boolean);
    } catch (e) {
      console.error("APL.01: gagal memuat persyaratan skema:", e);
    }

    // ---------- Data form tersimpan (riwayat_asesmen_detail) ----------
    const riwayat: any[] = Array.isArray(pengajuan.riwayat_asesmen_detail)
      ? pengajuan.riwayat_asesmen_detail
      : [];
    const ordered = [
      ...riwayat.filter((r) => r.form_type === "FR.APL.01"),
      ...riwayat.filter((r) => r.form_type !== "FR.APL.01"),
    ];
    const fds: Record<string, any>[] = ordered.map((r) => {
      const f = parseFd(r.form_data);
      return { ...f, ...parseFd(f["01. FR.APL.01 Permohonan Sertifikasi"]) };
    });
    const pick = (key: string): any => {
      for (const f of fds) {
        const v = f?.[key];
        if (v !== undefined && v !== null && v !== "") return v;
      }
      return undefined;
    };

    const data = pengajuan.dataPribadi;
    const user = pengajuan.user;

    const tujuanRaw = String(pick("tujuan") ?? pick("tujuanAsesmen") ?? "Sertifikasi");
    const tujuanKey = tujuanRaw.trim().toLowerCase();
    const tujuanSelected =
      TUJUAN_OPTIONS.find((o) => o.aliases.includes(tujuanKey) || o.value.toLowerCase() === tujuanKey)
        ?.value ?? "Lainnya";

    const checklist: Record<string, string> =
      parseFd(pick("checklist")) || parseFd(pengajuan.checklist) || {};
    const rekomendasi = String(pick("rekomendasi") ?? "");
    const catatan = String(pick("catatan") ?? "");
    const namaAdmin = String(pick("namaAdmin") ?? "");

    const namaPemohon = data?.namaLengkap || user?.username || "";

    // Tanda tangan asesi: urutan prioritas (sesuaikan kalau kolom di DB kamu beda)
    const ttdAsesi =
      sigSrc(pick("ttdAsesi")) ||
      sigSrc(pick("tandaTangan")) ||
      sigSrc(pengajuan.tandaTangan) ||
      sigSrc(data?.tandaTangan) ||
      sigSrc(data?.tanda_tangan) ||
      sigSrc(user?.tandaTangan) ||
      "";
    const ttdAdmin = sigSrc(pick("ttdAdmin"));
    const tglAsesi = fmtTanggalPanjang(pick("asesiDate") ?? pengajuan.createdAt);

    // ---------- Logo ----------
    const logoPath = path.join(process.cwd(), "public", "logo-lsp.png");
    let logoBase64 = "";
    if (fs.existsSync(logoPath)) {
      logoBase64 = `data:image/png;base64,${fs.readFileSync(logoPath).toString("base64")}`;
    }

    // ---------- Baris tabel ----------
    const row = (label: string, value: unknown) =>
      `<tr><td class="lbl">${label}</td><td class="val">${esc(value) || "&nbsp;"}</td></tr>`;

    const tujuanRows = TUJUAN_OPTIONS.map(
      (o, i) =>
        `<tr>${i === 0 ? `<td class="k" rowspan="${TUJUAN_OPTIONS.length}">Tujuan Asesmen :</td>` : ""}<td class="c-radio">${radio(tujuanSelected === o.value)}</td><td>${o.label}</td></tr>`,
    ).join("");

    const syaratRow = (label: string) => {
      const st = checklist[label];
      return `<tr>
        <td>${esc(label)}</td>
        <td class="c-center">${checkbox(st === "memenuhi")}</td>
        <td class="c-center">${checkbox(st === "tidak memenuhi")}</td>
      </tr>`;
    };
    const syaratRows = [...persyaratanDasar, ...buktiAdministratif].map(syaratRow).join("");

    const ttdAsesiHtml = ttdAsesi
      ? `<img class="ttd" src="${esc(ttdAsesi)}" alt="Tanda tangan" />`
      : `<div class="ttd-empty"></div>`;
    const ttdAdminHtml = ttdAdmin
      ? `<img class="ttd" src="${esc(ttdAdmin)}" alt="Tanda tangan admin" />`
      : `<div class="ttd-box">(Diisi oleh LSP)</div>`;

    const htmlContent = `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<style>
  @page { size: A4; margin: 14mm 14mm 14mm 14mm; }
  * { box-sizing: border-box; }
  body { font-family: 'Open Sans', Arial, sans-serif; color: #1e293b; font-size: 10.5px; line-height: 1.45; margin: 0; }

  .header { display: flex; align-items: center; gap: 14px; border-bottom: 2px solid #1e293b; padding-bottom: 12px; margin-bottom: 16px; }
  .header img { height: 52px; width: auto; object-fit: contain; }
  .header h2 { margin: 0; font-size: 15px; font-weight: 800; text-transform: uppercase; }

  h3 { font-size: 11.5px; font-weight: 700; margin: 14px 0 2px; }
  .desc { font-size: 9.5px; color: #475569; margin: 0 0 8px; }
  h4 { font-size: 10.5px; font-weight: 700; margin: 8px 0 4px; }

  table { width: 100%; border-collapse: collapse; }
  td, th { border: 1px solid #cbd5e1; padding: 6px 8px; vertical-align: middle; }
  td.lbl { width: 33%; font-weight: 600; background: #fff; }
  td.val { background: #fff; }

  .c-radio { width: 17%; text-align: center; }
  .c-center { text-align: center; width: 20%; }
  table.sertifikasi td.k { font-weight: 600; width: 33%; }
  table.sertifikasi td.sub { width: 17%; font-weight: 600; }

  table.syarat th { background: #ebf0fa; font-weight: 700; text-transform: uppercase; letter-spacing: .04em; font-size: 9.5px; padding: 8px; text-align: center; }
  table.syarat td { padding: 5px 8px; }

  .radio { display: inline-block; width: 11px; height: 11px; border: 1px solid #475569; border-radius: 50%; vertical-align: middle; position: relative; }
  .radio.on::after { content: ""; position: absolute; inset: 2px; border-radius: 50%; background: #0f172a; }
  .cb { display: inline-flex; align-items: center; justify-content: center; width: 11px; height: 11px; border: 1px solid #94a3b8; border-radius: 2px; vertical-align: middle; }
  .cb.on { border-color: #0f172a; }
  .opt { display: block; margin: 2px 0; }
  .opt .radio { margin-right: 6px; }

  table.ttd-table { margin-top: 18px; page-break-inside: avoid; break-inside: avoid; }
  table.ttd-table td { vertical-align: top; padding: 10px 12px; width: 50%; }
  .row-nama { margin: 6px 0; }
  .row-nama b { display: inline-block; width: 52px; }
  .catatan { border: 1px solid #cbd5e1; border-radius: 3px; min-height: 64px; padding: 6px; white-space: pre-wrap; }
  .ttd { display: block; max-height: 70px; max-width: 200px; margin: 6px 0; }
  .ttd-empty { height: 60px; }
  .ttd-box { border: 1px solid #cbd5e1; border-radius: 4px; height: 56px; display: flex; align-items: center; justify-content: center; color: #94a3b8; margin-top: 4px; }
  .admin { border-top: 1px solid #cbd5e1; margin-top: 12px; padding-top: 10px; }
  .muted { color: #94a3b8; }
</style>
</head>
<body>
  <div class="header">
    ${logoBase64 ? `<img src="${logoBase64}" alt="Logo LSP" />` : ""}
    <h2>FR.APL.01 PERMOHONAN SERTIFIKASI KOMPETENSI</h2>
  </div>

  <h3>Bagian 1 : Rincian Data Pemohon Sertifikasi</h3>
  <p class="desc">Pada bagian ini, cantumkan data pribadi, data pendidikan formal serta data pekerjaan anda pada saat ini.</p>

  <h4>A. Data Pribadi</h4>
  <table>
    ${row("Nama Lengkap :", namaPemohon)}
    ${row("No. KTP/NIK/Paspor :", data?.nik)}
    ${row("Tempat / Tgl. Lahir :", `${data?.tempatLahir || ""} / ${fmtTanggal(data?.tanggalLahir)}`)}
    ${row("Jenis Kelamin :", data?.jenisKelamin === "Laki_laki" || data?.jenisKelamin === "Laki-laki" ? "Laki-laki" : data?.jenisKelamin ? "Perempuan" : "")}
    ${row("Alamat Rumah :", data?.alamat)}
  </table>

  <h4>B. Data Pekerjaan Sekarang</h4>
  <table>
    ${row("Nama Institusi / Perusahaan :", data?.namaInstitusi)}
    ${row("Jabatan :", data?.jabatan)}
  </table>

  <h3>Bagian 2 : Data Sertifikasi</h3>
  <p class="desc">Tuliskan Judul dan Nomor Skema Sertifikasi yang anda ajukan berikut Daftar Unit Kompetensi.</p>
  <table class="sertifikasi">
    <tr><td class="k" rowspan="2">Skema Sertifikasi</td><td class="sub">Judul :</td><td>${esc(pengajuan.skema?.namaSkema)}</td></tr>
    <tr><td class="sub">Nomor :</td><td>${esc(pengajuan.skema?.kodeSkema)}</td></tr>
    ${tujuanRows}
  </table>

  <h3>Bagian 3 : Bukti Kelengkapan Pemohon</h3>
  <p class="desc">Diisi oleh LSP/Asesor.</p>
  <table class="syarat">
    <thead>
      <tr><th style="width:60%">Bukti Persyaratan Dasar</th><th>Memenuhi Syarat</th><th>Tidak Memenuhi Syarat</th></tr>
    </thead>
    <tbody>
      ${syaratRows || `<tr><td colspan="3" class="muted" style="text-align:center">Belum ada persyaratan diatur.</td></tr>`}
    </tbody>
  </table>

  <table class="ttd-table">
    <tr>
      <td>
        <b>Rekomendasi (diisi oleh LSP):</b>
        <p style="margin:4px 0">Berdasarkan ketentuan persyaratan dasar, maka pemohon:</p>
        <span class="opt">${radio(rekomendasi === "Diterima")}Diterima</span>
        <span class="opt">${radio(rekomendasi === "Tidak Diterima")}Tidak Diterima</span>
        <p style="margin:4px 0">sebagai peserta sertifikasi</p>
        <b>Catatan:</b>
        <div class="catatan">${esc(catatan)}</div>
      </td>
      <td>
        <b>Pemohon / Kandidat :</b>
        <div class="row-nama"><b>Nama:</b> ${esc(namaPemohon)}</div>
        <div><b>Tanda Tangan dan Tanggal:</b></div>
        ${ttdAsesiHtml}
        <div style="font-size:9.5px;color:#475569">Tanggal: ${esc(tglAsesi)}</div>

        <div class="admin">
          <b>Admin LSP :</b>
          <div class="row-nama"><b>Nama:</b> ${namaAdmin ? esc(namaAdmin) : `<span class="muted">....................</span>`}</div>
          <div><b>Tanda Tangan dan Tanggal:</b></div>
          ${ttdAdminHtml}
        </div>
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
        "Content-Disposition": `inline; filename="APL01_${pengajuan.id}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Error generate APL.01 PDF:", error);
    return NextResponse.json({ error: "Gagal membuat file APL.01 PDF." }, { status: 500 });
  }
}
