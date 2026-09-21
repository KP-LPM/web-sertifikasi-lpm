import { db } from './src/lib/db';

async function main() {
  const details = await db.riwayat_asesmen_detail.findMany({
    where: { form_type: 'FR.IA.07' },
    take: 1
  });
  console.log(JSON.stringify(details, null, 2));
}

main().catch(console.error).finally(() => db.$disconnect());
