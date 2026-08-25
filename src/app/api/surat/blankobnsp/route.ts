import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";
import path from "path";
import fs from "fs";
import {
  generatePermohonanBlankoHtml,
  PermohonanBlankoPayload,
} from "@/templates/SuratBnsp";

export async function POST(req: NextRequest) {
  try {
    const payload: PermohonanBlankoPayload = await req.json();

    const logoPath = path.join(process.cwd(), "public", "logo-lsp.png");
    if (fs.existsSync(logoPath)) {
      const logoBuffer = fs.readFileSync(logoPath);
      payload.logoBase64 = `data:image/png;base64,${logoBuffer.toString("base64")}`;
    }

    const htmlContent = generatePermohonanBlankoHtml(payload);

    const browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--font-render-hinting=none",
      ],
    });

    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "domcontentloaded" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
    });

    await browser.close();

    return new NextResponse(Buffer.from(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="Surat_Permohonan_Blanko_${Date.now()}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Error generate Permohonan Blanko PDF:", error);
    return NextResponse.json(
      { error: "Gagal membuat file Surat Permohonan Blanko PDF." },
      { status: 500 },
    );
  }
}
