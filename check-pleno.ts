import { db } from './src/lib/db';

async function main() {
  const batches = await db.pleno_batch.findMany({
    include: {
      pleno_asesi: true,
    }
  });
  console.log(JSON.stringify(batches, null, 2));
}

main();
