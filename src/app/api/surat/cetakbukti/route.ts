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
        skema: true,
        dataPribadi: true,
      },
    });

    if (!pengajuan) {
      return NextResponse.json({ error: "Pengajuan tidak ditemukan." }, { status: 404 });
    }

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
        <title>Bukti Pendaftaran Sertifikasi</title>
        <style>
          /* Set font 12px dan spasi 1.5 */
          body { font-family: 'Helvetica', 'Arial', sans-serif; padding: 40px; color: #333; font-size: 12px; line-height: 1.5; }
          .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 20px; margin-bottom: 30px; }
          .header img { max-width: 100px; margin-bottom: 10px; }
          .header h1 { margin: 0; font-size: 20px; text-transform: uppercase; }
          .header h2 { margin: 5px 0 0 0; font-size: 14px; font-weight: normal; }
          .content { line-height: 1.5; }
          .title { text-align: center; font-size: 16px; font-weight: bold; margin-bottom: 30px; text-decoration: underline; }
          
          /* Baris Data */
          .row { display: flex; margin-bottom: 10px; }
          .label { width: 200px; font-weight: bold; }
          .value { flex: 1; }
          
          h3 { font-size: 14px; margin-bottom: 10px; border-bottom: 1px solid #ccc; padding-bottom: 5px; }

          /* Perbaikan Tanda Tangan Anti-Offside */
          .signature-container { display: flex; justify-content: flex-end; margin-top: 50px; page-break-inside: avoid; break-inside: avoid; width: 100%; }
          .signature-box { text-align: center; width: 250px; }
          .signature-box .name { font-weight: bold; text-decoration: underline; margin-top: 60px; }
        </style>
      </head>
      <body>
        <div class="header">
          ${logoBase64 ? `<img src="${logoBase64}" alt="Logo LSP" />` : ""}
          <h1>LSP P1 UIN SUNAN GUNUNG DJATI</h1>
          <h2>Jl. A.H. Nasution No. 105, Cibiru, Bandung Raya</h2>
        </div>
        <div class="content">
          <div class="title">BUKTI PENDAFTARAN SERTIFIKASI KOMPETENSI</div>
          
          <div class="row">
            <div class="label">Nomor Registrasi</div>
            <div class="value">: ${pengajuan.id.toString().padStart(5, '0')}/LSP-UINSGD/${new Date(pengajuan.createdAt).getFullYear()}</div>
          </div>
          <div class="row">
            <div class="label">Tanggal Pengajuan</div>
            <div class="value">: ${new Date(pengajuan.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
          </div>
          <br/>
          
          <h3>Data Asesi</h3>
          <div class="row">
            <div class="label">Nama Lengkap</div>
            <div class="value">: ${pengajuan.dataPribadi?.namaLengkap || pengajuan.user?.username || '-'}</div>
          </div>
          <div class="row">
            <div class="label">Email</div>
            <div class="value">: ${pengajuan.user?.email || '-'}</div>
          </div>
          <br/>
          
          <h3>Data Skema</h3>
          <div class="row">
            <div class="label">Skema Sertifikasi</div>
            <div class="value">: ${pengajuan.skema?.namaSkema || '-'}</div>
          </div>
          <div class="row">
            <div class="label">Kode Skema</div>
            <div class="value">: ${pengajuan.skema?.kodeSkema || '-'}</div>
          </div>
          <div class="row">
            <div class="label">Status Pengajuan</div>
            <div class="value">: <strong>${pengajuan.status.toUpperCase()}</strong></div>
          </div>
          <div class="row">
            <div class="label">TUK (Tempat Uji)</div>
            <div class="value">: ${pengajuan.tuk || '-'}</div>
          </div>
        </div>

        <!-- Pembungkus Tanda Tangan -->
        <div class="signature-container">
          <div class="signature-box">
            <div>Bandung, ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
            <div style="margin-top: 5px;">Asesi,</div>
            <div class="name">${pengajuan.dataPribadi?.namaLengkap || pengajuan.user?.username || '_______________________'}</div>
          </div>
        </div>
      </body>
      </html>
    `;

    const browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
      ],
    });

    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "domcontentloaded" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "20px", right: "20px", bottom: "20px", left: "20px" },
    });

    await browser.close();

    return new NextResponse(Buffer.from(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="Bukti_Pendaftaran_${pengajuan.id}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Error generate Cetak Bukti PDF:", error);
    return NextResponse.json(
      { error: "Gagal membuat file Bukti PDF." },
      { status: 500 },
    );
  }
}
