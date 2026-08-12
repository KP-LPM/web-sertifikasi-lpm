import React from "react";
import "./globals.css";
import Providers from "@/components/Providers";
import ClientLayout from "@/components/ClientLayouts";

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
    <html lang="id">
      <body suppressHydrationWarning>
        <Providers>
          <ClientLayout>{children}</ClientLayout>
        </Providers>
      </body>
    </html>
  );
}
