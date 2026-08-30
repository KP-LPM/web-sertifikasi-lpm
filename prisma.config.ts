import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
    // Supabase: kalau kamu pakai connection pooling (port 6543) untuk
    // DATABASE_URL, tambahkan directUrl yang mengarah ke koneksi langsung
    // (port 5432) — dibutuhkan Prisma untuk migrate/db pull.
    // directUrl: env('DIRECT_URL'),
  },
});
