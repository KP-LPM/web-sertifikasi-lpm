import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function main() {
  const result = await pool.query(
    "SELECT pg_get_constraintdef(oid) FROM pg_constraint WHERE conname = 'pleno_asesi_status_pleno_check';"
  );
  console.log(result.rows);
  await pool.end();
}
main();
