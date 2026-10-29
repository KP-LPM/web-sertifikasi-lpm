# Sistem Informasi Sertifikasi Lembaga Penjaminan Mutu (LPM / LSP)

Aplikasi web manajemen sertifikasi kompetensi profesi dan uji kompetensi berbasis BNSP (Badan Nasional Sertifikasi Profesi) untuk Lembaga Sertifikasi Profesi (LSP) / Lembaga Penjaminan Mutu (LPM) UIN Sunan Gunung Djati Bandung.

Aplikasi ini mencakup alur lengkap sertifikasi: registrasi asesi, pengajuan skema sertifikasi (FR-APL-01 & FR-APL-02), penugasan asesor, penilaian asesmen, sidang pleno, hingga penerbitan dan pencetakan sertifikat serta berita acara berbasis PDF otomatis.

---

## Fitur Utama

- **Manajemen Pengguna & Role Base Access Control (RBAC)**:
  - `Admin`: Kelola skema, unit kompetensi, TUK, jadwal asesmen, verifikasi berkas, dan penetapan pleno.
  - `Asesor`: Validasi APL-01 & APL-02, input penilaian uji kompetensi, dan berita acara asesmen.
  - `Asesi`: Pendaftaran akun, pengajuan sertifikasi mandiri, upload bukti portofolio, dan pantau status sertifikasi.
- **Generator PDF Otomatis (Headless Puppeteer & Chromium)**:
  - Cetak Formulir Permohonan Sertifikasi (FR-APL-01).
  - Cetak Asesmen Mandiri (FR-APL-02) beserta bukti dokumen.
  - Surat Tugas / Penugasan Asesor.
  - Berita Acara & Surat Keputusan Hasil Sidang Pleno.
  - Blanko Sertifikat Kompetensi BNSP (2 halaman dengan layout presisi F4/Folio).
- **Tanda Tangan Digital**: Integrasi kanvas tanda tangan langsung untuk asesi, asesor, dan ketua LSP.
- **Notifikasi Email (SMTP)**: Notifikasi pendaftaran akun, verifikasi OTP, dan update status asesmen via email resmi.
- **Cloud Storage**: Penyimpanan aman dokumen portofolio dan berkas asesi menggunakan Supabase Storage.

---

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, React 19, TypeScript)
- **Database & ORM**: PostgreSQL & [Prisma ORM](https://www.prisma.io/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/) (Credentials Provider)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & [Framer Motion](https://www.framer.com/motion/)
- **PDF Engine**: [Puppeteer](https://pptr.dev/) & [Sparticuz Chromium](https://github.com/Sparticuz/chromium)
- **File Storage**: [Supabase Storage](https://supabase.com/storage)
- **Email Service**: [Nodemailer](https://nodemailer.com/) & [React Email](https://react.email/)
- **Deployment**: Vercel (Serverless) / Docker & Docker Compose (VPS)

---

## Struktur Direktori

```text
├── prisma/
│   ├── schema.prisma        # Definisi skema database & relasi model
│   └── seed.ts              # Data awal (seeder) database
├── public/                  # Asset statis publik (logo garuda, logo kampus, dsb.)
├── src/
│   ├── app/                 # Next.js App Router (Halaman & Endpoint API)
│   │   ├── admin/           # Dashboard & fitur admin
│   │   ├── asesor/          # Dashboard & fitur asesor
│   │   ├── asesi/           # Portal pendaftaran & pengajuan asesi
│   │   └── api/             # REST API endpoint (surat, cetak PDF, auth, upload)
│   ├── components/          # Reusable UI components & React Email templates
│   ├── lib/                 # Konfigurasi utilitas (Prisma, Supabase, PDF Browser, NextAuth)
│   ├── repositories/        # Database access layer (Data Access Object)
│   ├── schemas/             # Validasi payload & schema Zod
│   ├── services/            # Business logic layer
│   └── templates/           # Template HTML presisi untuk cetak PDF dokumen resmi
├── Dockerfile               # Konfigurasi container image Next.js + Chromium + Font
├── docker-compose.yml       # Orkestrasi container Web + Database PostgreSQL
└── README.md
```

---

## Persyaratan Sistem (Prerequisites)

- **Node.js**: Versi `20.x` LTS atau lebih baru
- **NPM**: Versi `10.x` ke atas
- **Database**: PostgreSQL (v14 ke atas) atau instance Supabase PostgreSQL
- **Supabase Account**: Untuk bucket storage dokumen asesi

---

## Panduan Instalasi Lokal (Development)

1. **Clone Repositori**:
   ```bash
   git clone <URL_REPOSITORI>
   cd web-sertifikasi-lpm
   ```

2. **Install Dependensi**:
   ```bash
   npm install
   ```

3. **Konfigurasi Environment Variable (`.env`)**:
   Duplikasi atau buat file `.env` pada root direktori:
   ```env
   # Database PostgreSQL
   DATABASE_URL="postgresql://user:password@localhost:5432/web_sertifikasi_lpm?schema=public"

   # Supabase Storage
   NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"

   # Autentikasi NextAuth
   NEXTAUTH_SECRET="buat_string_acak_panjang"
   NEXTAUTH_URL="http://localhost:3000"
   NEXT_PUBLIC_API_URL="/api"

   # SMTP Mailer
   SMTP_HOST="smtp.gmail.com"
   SMTP_PORT=465
   SMTP_USER="email@domain.com"
   SMTP_PASS="password-aplikasi-email"
   ```

4. **Sinkronisasi Database**:
   ```bash
   npx prisma generate
   npx prisma db push
   # (Opsional) Jalankan seeder jika diperlukan:
   # npx tsx prisma/seed.ts
   ```

5. **Jalankan Aplikasi**:
   ```bash
   npm run dev
   ```
   Buka peramban di `http://localhost:3000`.

---

## Panduan Deployment ke VPS (Docker & Docker Compose)

Aplikasi telah dilengkapi konfigurasi Docker yang siap pakai di lingkungan VPS Linux (termasuk instalasi library Chromium dan font Times New Roman agar cetak sertifikat tidak berubah ke font default).

1. **Pastikan Docker & Docker Compose sudah terpasang di VPS**:
   ```bash
   docker --version
   docker compose version
   ```

2. **Clone Proyek di VPS**:
   ```bash
   git clone <URL_REPOSITORI> /opt/web-sertifikasi-lpm
   cd /opt/web-sertifikasi-lpm
   ```

3. **Sesuaikan `docker-compose.yml`**:
   Atur password database, domain `NEXTAUTH_URL`, dan kredensial Supabase Storage serta SMTP pada bagian environment service `web` dan `db`.

4. **Jalankan Container**:
   ```bash
   docker compose up -d --build
   ```

5. **Cek Status Container**:
   ```bash
   docker compose ps
   docker compose logs -f web
   ```
   Aplikasi akan otomatis menjalankan migrasi Prisma (`prisma migrate deploy`) dan langsung melayani request di port `3000`.

6. **Konfigurasi Reverse Proxy (Nginx / Cloudflare)**:
   Arahkan domain publik Anda ke port `3000` VPS dengan SSL aktif.

---

## Catatan Penting Mengenai Cetak PDF

- Untuk pencetakan di lingkungan Serverless (Vercel), generator memanfaatkan `@sparticuz/chromium-min` via remote tarball.
- Untuk pencetakan di lingkungan lokal (Windows/macOS), generator otomatis memakai Puppeteer lokal.
- Untuk pencetakan di VPS (Docker), image Linux Alpine sudah diinjeksi font `msttcorefonts-installer` (Times New Roman asli) dan paket font `ttf-freefont` agar tampilan format dokumen sertifikat BNSP tetap presisi dan proporsional.

---

## Lisensi

Dikembangkan untuk kebutuhan internal LSP / LPM UIN Sunan Gunung Djati Bandung.
