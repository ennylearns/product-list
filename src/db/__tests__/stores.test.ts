import { describe, it, expect } from 'vitest';
import { db } from '../index';
import { stores } from '../schema';

describe('Store Schema', () => {
  it('should generate valid insert SQL with required fields', () => {
    const query = db.insert(stores).values({
      userId: 1,
      name: 'My Store',
      username: 'mystore',
      whatsappNumber: '1234567890',
      description: 'A great store',
    }).toSQL();

    expect(query.sql).toContain('insert into "stores"');
    expect(query.sql).toContain('"userId"');
    expect(query.sql).toContain('"name"');
    expect(query.sql).toContain('"username"');
    expect(query.sql).toContain('"whatsappNumber"');
  });
});
