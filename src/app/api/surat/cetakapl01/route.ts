import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";
import { db } from "@/lib/db";
import path from "path";
import fs from "fs";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID pengajuan tidak diberikan." }, { status: 400 });
    }

    const pengajuanId = parseInt(id, 10);
    const pengajuan = await db.pengajuanSkema.findUnique({
      where: { id: pengajuanId },
      include: {
        user: true,
        skema: {
          include: {
            unitKompetensi: true,
          }
        },
        dataPribadi: true,
        dokumen: true,
      },
    });

    if (!pengajuan) {
      return NextResponse.json({ error: "Pengajuan tidak ditemukan." }, { status: 404 });
    }

    const data = pengajuan.dataPribadi;
    const user = pengajuan.user;

    const logoPath = path.join(process.cwd(), "public", "logo-lsp.png");
    let logoBase64 = "";
    if (fs.existsSync(logoPath)) {
      const logoBuffer = fs.readFileSync(logoPath);
      logoBase64 = `data:image/png;base64,${logoBuffer.toString("base64")}`;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="id">
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: 'Arial', sans-serif; padding: 40px; color: #000; font-size: 14px; line-height: 1.5; }
          .header { display: flex; align-items: center; border-bottom: 3px solid #000; padding-bottom: 20px; margin-bottom: 20px; }
          .header img { max-width: 80px; margin-right: 20px; }
          .header h2 { margin: 0; font-size: 18px; text-transform: uppercase; }
          .title { font-weight: bold; margin-bottom: 10px; font-size: 14px; }
          .table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          .table th, .table td { border: 1px solid #000; padding: 8px; vertical-align: top; }
          .table th { background-color: #f0f0f0; text-align: left; }
          .section-title { font-weight: bold; background-color: #f0f0f0; padding: 5px; margin-top: 20px; border: 1px solid #000; border-bottom: none; }
          .signature-box { float: right; width: 300px; text-align: left; margin-top: 40px; }
          .signature-box .date { margin-bottom: 40px; }
          .signature-box .name { font-weight: bold; text-decoration: underline; }
          .clearfix::after { content: ""; clear: both; display: table; }
          .check-box { width: 15px; height: 15px; border: 1px solid #000; display: inline-block; text-align: center; line-height: 15px; margin-right: 5px; }
        </style>
      </head>
      <body>
        <div class="header">
          ${logoBase64 ? `<img src="${logoBase64}" alt="Logo LSP" />` : ""}
          <div>
            <h2>FR.APL.01 PERMOHONAN SERTIFIKASI KOMPETENSI</h2>
          </div>
        </div>

        <div class="title">Rincian Data Pemohon Sertifikasi</div>
        <table class="table">
          <tr>
            <td colspan="3" style="background-color: #f0f0f0; font-weight: bold;">a. Data Pribadi</td>
          </tr>
          <tr><td width="30%">Nama Lengkap</td><td width="5%">:</td><td>${data?.namaLengkap || user?.username || ''}</td></tr>
          <tr><td>No. KTP/NIK/Paspor</td><td>:</td><td>${data?.nik || ''}</td></tr>
          <tr><td>Tempat / Tgl. Lahir</td><td>:</td><td>${data?.tempatLahir || ''} / ${data?.tanggalLahir ? new Date(data.tanggalLahir).toLocaleDateString('id-ID') : ''}</td></tr>
          <tr><td>Jenis Kelamin</td><td>:</td><td>${data?.jenisKelamin === 'Laki_laki' ? 'Laki-laki' : 'Perempuan'}</td></tr>
          <tr><td>Alamat Rumah</td><td>:</td><td>${data?.alamat || ''}</td></tr>
          <tr><td>Kewarganegaraan</td><td>:</td><td>${data?.kewarganegaraan || ''}</td></tr>
          <tr><td>No. Telepon/HP</td><td>:</td><td>${data?.noHp || ''}</td></tr>
          <tr><td>Email</td><td>:</td><td>${user?.email || ''}</td></tr>
          <tr><td>Pendidikan Terakhir</td><td>:</td><td>${data?.pendidikanTerakhir || ''}</td></tr>
          
          <tr>
            <td colspan="3" style="background-color: #f0f0f0; font-weight: bold;">b. Data Pekerjaan Sekarang</td>
          </tr>
          <tr><td>Nama Institusi / Perusahaan</td><td>:</td><td>${data?.namaInstitusi || ''}</td></tr>
          <tr><td>Jabatan</td><td>:</td><td>${data?.jabatan || ''}</td></tr>
          <tr><td>Alamat Kantor</td><td>:</td><td>${data?.alamatInstitusi || ''}</td></tr>
          <tr><td>No. Telp/Fax/Email</td><td>:</td><td>${data?.telpInstitusi || ''} / ${data?.faxInstitusi || ''} / ${data?.emailInstitusi || ''}</td></tr>
        </table>

        <div class="title">Data Permohonan Sertifikasi</div>
        <table class="table">
          <tr><td width="30%">Tujuan Asesmen</td><td width="5%">:</td><td>${pengajuan.jenisAsesmen || ''}</td></tr>
          <tr><td rowspan="2">Skema Sertifikasi</td><td>Judul</td><td>${pengajuan.skema?.namaSkema || ''}</td></tr>
          <tr><td>Nomor</td><td>${pengajuan.skema?.kodeSkema || ''}</td></tr>
        </table>

        <div class="clearfix">
          <div class="signature-box">
            <div class="date">Tanggal: ${new Date().toLocaleDateString('id-ID')}</div>
            <div class="name">${data?.namaLengkap || user?.username || '_______________________'}</div>
            <div>Tanda Tangan Asesi</div>
          </div>
        </div>
      </body>
      </html>
    `;

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
    });

    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "domcontentloaded" });

    const pdfBuffer = await page.pdf({ format: "A4", printBackground: true, margin: { top: "30px", right: "30px", bottom: "30px", left: "30px" } });
    await browser.close();

    return new NextResponse(Buffer.from(pdfBuffer), {
      status: 200,
      headers: { "Content-Type": "application/pdf", "Content-Disposition": `inline; filename="APL01_${pengajuan.id}.pdf"` },
    });
  } catch (error) {
    console.error("Error generate APL.01 PDF:", error);
    return NextResponse.json({ error: "Gagal membuat file APL.01 PDF." }, { status: 500 });
  }
}
