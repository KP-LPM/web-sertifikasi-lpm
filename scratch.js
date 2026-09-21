const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const details = await prisma.riwayat_asesmen_detail.findMany({
    where: { form_type: 'FR.IA.07' },
    take: 1
  });
  console.log(JSON.stringify(details, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
