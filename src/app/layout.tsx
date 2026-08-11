import React from "react";
import "./globals.css";
import { Plus_Jakarta_Sans } from "next/font/google";
import Providers from "@/components/Providers";
import ClientLayout from "@/components/ClientLayouts";

// Konfigurasi font Plus Jakarta Sans
const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "Web Sertifikasi LPM",
  description: "Sistem Sertifikasi Kompetensi UIN Bandung",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={plusJakartaSans.className}>
      <body suppressHydrationWarning>
        <Providers>
          <ClientLayout>{children}</ClientLayout>
        </Providers>
      </body>
    </html>
  );
}
