import { db } from './src/lib/db';

async function main() {
  const completedBatches = await db.jadwal_asesmen.findMany({
    where: { status: "Selesai" },
    include: {
      hasil_asesmen: true,
      jadwal_asesmen_peserta: {
        include: {
          pengajuan_skema: {
            include: {
              dataPribadi: true,
              hasil_asesmen: true
            }
          }
        }
      }
    },
  });
  console.log(JSON.stringify(completedBatches, null, 2));
}

main();
