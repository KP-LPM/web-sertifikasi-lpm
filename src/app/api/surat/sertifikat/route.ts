import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";
import path from "path";
import fs from "fs";
import {
  generateSertifikatHtml,
  SertifikatPayload,
} from "@/templates/Sertifikat";

export async function POST(req: NextRequest) {
  try {
    const payload: SertifikatPayload = await req.json();

    // Baca logo Garuda dari folder public menjadi Base64 Data URI
    const garudaPath = path.join(process.cwd(), "public", "logo-garuda.png");
    if (fs.existsSync(garudaPath)) {
      const garudaBuffer = fs.readFileSync(garudaPath);
      payload.logoGarudaBase64 = `data:image/png;base64,${garudaBuffer.toString("base64")}`;
    }

    // Render HTML dengan Base64
    const htmlContent = generateSertifikatHtml(payload);

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
        "Content-Disposition": `attachment; filename="Sertifikat_${Date.now()}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Error generate Sertifikat PDF:", error);
    return NextResponse.json(
      { error: "Gagal membuat file Sertifikat PDF." },
      { status: 500 },
    );
  }
}
