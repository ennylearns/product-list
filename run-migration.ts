import { db } from './src/db';
import { sql } from 'drizzle-orm';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function main() {
  console.log('Running migration...');
  try {
    await db.execute(sql`ALTER TABLE "products" RENAME COLUMN "images" TO "media"`);
    console.log('Migration successful!');
  } catch (error) {
    console.error('Migration failed:', error);
  }
  process.exit(0);
}

main();
