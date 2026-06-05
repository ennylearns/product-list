import { describe, it, expect } from 'vitest';
import { db } from '../index';
import { users } from '../schema';

describe('User Schema', () => {
  it('should generate valid insert SQL with required fields', () => {
    const query = db.insert(users).values({
      email: 'test@example.com',
      hashedPassword: 'password123',
    }).toSQL();

    expect(query.sql).toContain('insert into "users"');
    expect(query.sql).toContain('"email"');
    expect(query.sql).toContain('"hashedPassword"');
  });
});
