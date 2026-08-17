import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

// 1. Ambil URL Database dari file .env
const connectionString = `${process.env.DATABASE_URL}`;

// 2. Buat jembatan koneksi (Pool) pakai driver PG
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

// 3. Konfigurasi Singleton Prisma
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// 4. Masukkan adapter ke dalam PrismaClient!
export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;