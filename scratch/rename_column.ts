import { sql } from '@vercel/postgres';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function run() {
  try {
    await sql`ALTER TABLE "stores" RENAME COLUMN "businessName" TO "name";`;
    console.log("Column renamed successfully.");
  } catch (err) {
    console.error("Error renaming column:", err);
  }
}

run();
