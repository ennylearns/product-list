import { describe, it, expect, vi } from 'vitest';
import { db } from '../index';
import { sql } from 'drizzle-orm';

vi.mock('@vercel/postgres', () => {
  const query = vi.fn().mockResolvedValue({ rows: [{ result: 1 }] });
  return {
    sql: Object.assign(
      (...args: any[]) => query(...args),
      { query }
    )
  };
});

describe('Database Connection', () => {
  it('should be able to execute a basic query', async () => {
    const result = await db.execute(sql`SELECT 1 as result`);
    expect(result.rows[0].result).toBe(1);
  });
});
