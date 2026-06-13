import { describe, it, expect } from 'vitest';
import { db } from '../index';
import { products } from '../schema';

describe('Product Schema', () => {
  it('should generate valid insert SQL with required fields', () => {
    const query = db.insert(products).values({
      storeId: 1,
      name: 'Air Force 1',
      description: 'Classic sneakers',
      price: 15000,
      inStock: true,
      media: ['img1.jpg', 'video1.mp4'],
    }).toSQL();

    expect(query.sql).toContain('insert into "products"');
    expect(query.sql).toContain('"storeId"');
    expect(query.sql).toContain('"name"');
    expect(query.sql).toContain('"price"');
    expect(query.sql).toContain('"inStock"');
    expect(query.sql).toContain('"media"');
  });
});
