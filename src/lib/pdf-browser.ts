import puppeteerCore, { Browser, PDFOptions } from "puppeteer-core";
import chromium from "@sparticuz/chromium-min";

const CHROMIUM_PACK_URL =
  "https://github.com/Sparticuz/chromium/releases/download/v131.0.1/chromium-v131.0.1-pack.tar";

export async function getPdfBrowser(): Promise<Browser> {
  const isServerless =
    process.env.VERCEL === "1" ||
    !!process.env.VERCEL ||
    !!process.env.AWS_LAMBDA_FUNCTION_NAME ||
    (process.env.NODE_ENV === "production" && process.platform === "linux");

  if (isServerless) {
    const executablePath = await chromium.executablePath(CHROMIUM_PACK_URL);

    return (await puppeteerCore.launch({
      args: [...chromium.args, "--font-render-hinting=none"],
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
    await page.setContent(htmlContent, { waitUntil: "domcontentloaded" });
    const pdfBuffer = await page.pdf(pdfOptions);
    return new Uint8Array(pdfBuffer);
  } finally {
    if (browser) {
      await browser.close().catch(() => {});
    }
  }
}
