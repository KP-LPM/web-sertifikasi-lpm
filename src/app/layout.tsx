import "./globals.css";
import { Plus_Jakarta_Sans } from "next/font/google";

// Konfigurasi font Plus Jakarta Sans
const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "Web Sertifikasi LPM",
  description: "Aplikasi Login",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      {/* Memasukkan font Plus Jakarta Sans ke seluruh tag body */}
      <body className={plusJakartaSans.className}>{children}</body>
    </html>
  );
}
