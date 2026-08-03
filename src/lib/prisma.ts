import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
  const connectionString = process.env.DATABASE_URL;
  
  // Membuat pool koneksi PostgreSQL
  const pool = new Pool({ connectionString });
  
  // Menyambungkan pool ke Prisma Adapter
  const adapter = new PrismaPg(pool);
  
  // Memasukkan adapter saat memanggil PrismaClient
  return new PrismaClient({ adapter });
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;