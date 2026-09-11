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
            unitKompetensi: {
              include: {
                elemenKompetensi: true
              }
            },
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
    const units = pengajuan.skema?.unitKompetensi || [];

    const logoPath = path.join(process.cwd(), "public", "logo-lsp.png");
    let logoBase64 = "";
    if (fs.existsSync(logoPath)) {
      const logoBuffer = fs.readFileSync(logoPath);
      logoBase64 = `data:image/png;base64,${logoBuffer.toString("base64")}`;
    }

    // Build Unit Rows
    let unitsHtml = "";
    units.forEach((unit, idx) => {
      let elemenHtml = "";
      unit.elemenKompetensi.forEach((el, eIdx) => {
        let kukLines: string[] = [];
        try {
          kukLines = JSON.parse(el.kriteriaUnjukKerja);
          if (!Array.isArray(kukLines)) kukLines = [el.kriteriaUnjukKerja];
        } catch {
          kukLines = el.kriteriaUnjukKerja.split("\n").filter(k => k.trim());
        }

        const kukListHtml = kukLines.map((kuk, kIdx) => `<li>${kIdx + 1}.${kIdx + 1} ${kuk}</li>`).join("");

        elemenHtml += `
          <tr>
            <td class="td-content">
              <strong>${eIdx + 1}. Elemen: ${el.namaElemen}</strong>
              <div style="margin-top: 5px;">Kriteria Unjuk Kerja:</div>
              <ul style="margin-top: 5px; padding-left: 20px; list-style-type: none; margin-bottom: 0;">
                ${kukListHtml}
              </ul>
            </td>
            <td class="text-center">[  ]</td>
            <td class="text-center">[  ]</td>
            <td class="text-center">Bukti Portofolio ${unit.kodeUnit}</td>
          </tr>
        `;
      });

      unitsHtml += `
        <div class="unit-title">Unit Kompetensi ${idx + 1}</div>
        <table class="table mb-20">
          <tr>
            <td colspan="4" style="background-color: #f0f0f0;">
              Kode Unit: <strong>${unit.kodeUnit}</strong><br/>
              Judul Unit: <strong>${unit.judulUnit}</strong>
            </td>
          </tr>
          <tr>
            <th width="45%">Dapatkah Saya................?</th>
            <th width="10%" class="text-center">K</th>
            <th width="10%" class="text-center">BK</th>
            <th width="35%" class="text-center">Bukti yang relevan</th>
          </tr>
          ${elemenHtml}
        </table>
      `;
    });

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="id">
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: 'Arial', sans-serif; padding: 40px; color: #000; font-size: 13px; line-height: 1.5; }
          .header { display: flex; align-items: center; border-bottom: 3px solid #000; padding-bottom: 20px; margin-bottom: 20px; }
          .header img { max-width: 80px; margin-right: 20px; }
          .header h2 { margin: 0; font-size: 18px; text-transform: uppercase; }
          .table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          .table th, .table td { border: 1px solid #000; padding: 8px; vertical-align: top; }
          .table th { background-color: #f0f0f0; text-align: left; }
          .text-center { text-align: center; }
          .unit-title { font-weight: bold; font-size: 14px; margin-top: 20px; margin-bottom: 5px; }
          .td-content { padding: 10px; }
          .signature-box { float: right; width: 300px; text-align: left; margin-top: 40px; }
          .signature-box .date { margin-bottom: 40px; }
          .signature-box .name { font-weight: bold; text-decoration: underline; }
          .clearfix::after { content: ""; clear: both; display: table; }
          .info-table { border: none; margin-bottom: 20px; }
          .info-table td { border: none; padding: 4px; }
          .instructions { border: 1px solid #000; padding: 10px; margin-bottom: 20px; background-color: #f9f9f9; }
          .instructions ul { margin: 0; padding-left: 20px; }
        </style>
      </head>
      <body>
        <div class="header">
          ${logoBase64 ? `<img src="${logoBase64}" alt="Logo LSP" />` : ""}
          <div>
            <h2>FR.APL.02 ASESMEN MANDIRI</h2>
          </div>
        </div>

        <table class="info-table">
          <tr><td width="150px">Skema Sertifikasi</td><td>:</td><td>${pengajuan.skema?.namaSkema || ''}</td></tr>
          <tr><td>Nomor</td><td>:</td><td>${pengajuan.skema?.kodeSkema || ''}</td></tr>
        </table>

        <div class="instructions">
          <strong>PANDUAN ASESMEN MANDIRI</strong><br/>
          Instruksi:
          <ul>
            <li>Baca setiap pertanyaan di kolom sebelah kiri</li>
            <li>Beri tanda centang pada kotak K jika Anda yakin dapat melakukan tugas, atau BK jika belum kompeten.</li>
            <li>Isi kolom di sebelah kanan dengan menuliskan bukti yang relevan yang Anda miliki.</li>
          </ul>
        </div>

        ${unitsHtml}

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
      headers: { "Content-Type": "application/pdf", "Content-Disposition": `inline; filename="APL02_${pengajuan.id}.pdf"` },
    });
  } catch (error) {
    console.error("Error generate APL.02 PDF:", error);
    return NextResponse.json({ error: "Gagal membuat file APL.02 PDF." }, { status: 500 });
  }
}
