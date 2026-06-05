import { db } from '../src/db';
import { users } from '../src/db/schema';

async function main() {
  try {
    const result = await db.select().from(users).limit(1);
    console.log("Connection successful:", result);
  } catch (e) {
    console.error("Connection failed:", e);
  }
}
main();
