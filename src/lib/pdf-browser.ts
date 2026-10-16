if (!process.env.AWS_LAMBDA_JS_RUNTIME) {
  process.env.AWS_LAMBDA_JS_RUNTIME = "nodejs20.x";
}
if (!process.env.FONTCONFIG_PATH) {
  process.env.FONTCONFIG_PATH = "/tmp/fonts";
}
process.env.HOME = "/tmp";

import puppeteerCore, { Browser, PDFOptions } from "puppeteer-core";
import chromium from "@sparticuz/chromium-min";
import fs from "fs";
import path from "path";

const CHROMIUM_PACK_URL =
  "https://github.com/Sparticuz/chromium/releases/download/v131.0.1/chromium-v131.0.1-pack.tar";

export async function getPdfBrowser(): Promise<Browser> {
  const isServerless =
    process.env.VERCEL === "1" ||
    !!process.env.VERCEL ||
    !!process.env.AWS_LAMBDA_FUNCTION_NAME ||
    (process.env.NODE_ENV === "production" && process.platform === "linux");

  if (isServerless) {
    chromium.setGraphicsMode = false;

    // Jika /tmp/chromium sudah ada dari request sebelumnya tapi al2023 belum diekstrak, bersihkan agar diekstrak ulang lengkap dengan shared libraries
    if (fs.existsSync("/tmp/chromium") && !fs.existsSync("/tmp/al2023")) {
      try {
        fs.unlinkSync("/tmp/chromium");
      } catch {}
    }

    const executablePath = await chromium.executablePath(CHROMIUM_PACK_URL);

    // Set LD_LIBRARY_PATH agar loader Linux di Vercel dapat menemukan libnss3.so, libnspr4.so, dsb.
    const al2023Dir = "/tmp/al2023";
    const al2Dir = "/tmp/al2";
    const chromiumDir = path.dirname(executablePath);
    const existingLd = process.env.LD_LIBRARY_PATH || "";
    process.env.LD_LIBRARY_PATH = `${al2023Dir}:${al2023Dir}/lib:${al2Dir}:${chromiumDir}:${existingLd}`;

    // Pastikan font fallback dari @sparticuz/chromium disalin ke ~/.fonts untuk fontconfig
    try {
      const fontsDir = "/tmp/fonts";
      const dotFontsDir = "/tmp/.fonts";
      if (!fs.existsSync(dotFontsDir)) {
        fs.mkdirSync(dotFontsDir, { recursive: true });
      }
      if (fs.existsSync(fontsDir)) {
        const fontFiles = fs.readdirSync(fontsDir);
        for (const file of fontFiles) {
          const src = path.join(fontsDir, file);
          const dest = path.join(dotFontsDir, file);
          if (!fs.existsSync(dest)) {
            try {
              fs.copyFileSync(src, dest);
            } catch {}
          }
        }
      }
    } catch {}

    return (await puppeteerCore.launch({
      args: [
        ...chromium.args,
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--font-render-hinting=none",
      ],
      defaultViewport: chromium.defaultViewport,
      executablePath,
      headless: chromium.headless,
    })) as unknown as Browser;
  }

  // Fallback lokal (Windows / macOS / local dev)
  try {
    const puppeteer = await import("puppeteer");
    return (await puppeteer.default.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--font-render-hinting=none",
      ],
    })) as unknown as Browser;
  } catch {
    const executablePath = await chromium.executablePath(CHROMIUM_PACK_URL);
    return (await puppeteerCore.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath,
      headless: chromium.headless,
    })) as unknown as Browser;
  }
}

export async function generatePdfFromHtml(
  htmlContent: string,
  pdfOptions: PDFOptions = {
    format: "A4",
    printBackground: true,
    preferCSSPageSize: true,
    margin: { top: "0", right: "0", bottom: "0", left: "0" },
  }
): Promise<Uint8Array> {
  let browser: Browser | null = null;
  try {
    browser = await getPdfBrowser();
    const page = await browser.newPage();

    // Suntikkan font Open Sans ke HTML agar teks dijamin tampil pada serverless Linux
    const fontInjection = `
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,400;0,600;0,700;1,400&display=swap" rel="stylesheet">
      <style>
        body, p, span, h1, h2, h3, h4, td, th, div, a {
          font-family: 'Open Sans', Arial, Helvetica, sans-serif !important;
        }
      </style>
    `;

    const finalHtml = htmlContent.includes("<head>")
      ? htmlContent.replace("<head>", `<head>${fontInjection}`)
      : `${fontInjection}${htmlContent}`;

    try {
      await page.setContent(finalHtml, {
        waitUntil: ["load", "networkidle0"],
        timeout: 10000,
      });
    } catch {
      await page.setContent(finalHtml, { waitUntil: "domcontentloaded" });
    }

    // Tunggu hingga seluruh font siap sebelum render ke PDF
    await page.evaluateHandle("document.fonts.ready").catch(() => {});

    const pdfBuffer = await page.pdf(pdfOptions);
    return new Uint8Array(pdfBuffer);
  } finally {
    if (browser) {
      await browser.close().catch(() => {});
    }
  }
}
