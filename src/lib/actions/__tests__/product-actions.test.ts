import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createProduct, getProducts } from '../product';
import * as dal from '@/src/lib/dal';
import { db } from '@/src/db';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

vi.mock('@/src/lib/dal', () => ({
  verifySession: vi.fn(),
}));

vi.mock('@/src/db', () => ({
  db: {
    query: {
      stores: {
        findFirst: vi.fn(),
      },
      products: {
        findMany: vi.fn(),
      },
    },
    insert: vi.fn(() => ({
      values: vi.fn().mockResolvedValue(true),
    })),
  },
}));

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

describe('Product Actions', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    (dal.verifySession as any).mockResolvedValue({ isAuth: true, userId: 1 });
  });

  describe('createProduct', () => {
    it('creates a product successfully and converts price to cents', async () => {
      const formData = new FormData();
      formData.append('name', 'Cool Sneaker');
      formData.append('description', 'A very cool sneaker');
      formData.append('price', '150.50');

      (db.query.stores.findFirst as any).mockResolvedValue({ id: 10 }); // Found store

      const response = await createProduct(undefined, formData);
      
      expect(response).toBeUndefined(); // Assuming redirect throws or returns undefined depending on mock

      expect(db.insert).toHaveBeenCalled();
      // The price should be converted to cents 15050
      expect((db.insert as any).mock.results[0].value.values).toHaveBeenCalledWith(
        expect.objectContaining({
          storeId: 10,
          name: 'Cool Sneaker',
          description: 'A very cool sneaker',
          price: 15050,
        })
      );
      expect(revalidatePath).toHaveBeenCalledWith('/dashboard/products');
      expect(redirect).toHaveBeenCalledWith('/dashboard/products');
    });

    it('returns validation errors for invalid input', async () => {
      const formData = new FormData();
      formData.append('name', '');
      formData.append('price', '-10');

      const response = await createProduct(undefined, formData);

      expect(response?.errors?.name).toBeDefined();
      expect(response?.errors?.price).toBeDefined();
      expect(db.insert).not.toHaveBeenCalled();
    });

    it('returns an error if store is not found', async () => {
      const formData = new FormData();
      formData.append('name', 'Cool Sneaker');
      formData.append('price', '150.50');

      (db.query.stores.findFirst as any).mockResolvedValue(null); // No store

      const response = await createProduct(undefined, formData);
      expect(response?.message).toBe('Store not found. Please create a store profile first.');
    });
  });

  describe('getProducts', () => {
    it('returns products for the authenticated user store', async () => {
      (db.query.stores.findFirst as any).mockResolvedValue({ id: 10 });
      (db.query.products.findMany as any).mockResolvedValue([
        { id: 1, name: 'Product 1', price: 1000 },
        { id: 2, name: 'Product 2', price: 2000 },
      ]);

      const result = await getProducts();
      expect(result).toHaveLength(2);
      expect(db.query.products.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.any(Object),
          orderBy: expect.any(Function),
        })
      );
    });

    it('returns empty array if unauthenticated', async () => {
      (dal.verifySession as any).mockResolvedValue(null);
      const result = await getProducts();
      expect(result).toEqual([]);
    });

    it('returns empty array if no store is found', async () => {
      (db.query.stores.findFirst as any).mockResolvedValue(null);
      const result = await getProducts();
      expect(result).toEqual([]);
    });
  });
});
