import { describe, it, expect, vi, beforeEach } from 'vitest';
import { updateProduct, deleteProduct, toggleProductStock } from '../lib/actions/product';
import { ProductFormState } from '../lib/validations/product';
import { verifySession } from '../lib/dal';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { del } from '@vercel/blob';

// Mock dependencies
vi.mock('../lib/dal', () => ({
  verifySession: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

vi.mock('@vercel/blob', () => ({
  del: vi.fn(),
}));

const { dbMock } = vi.hoisted(() => {
  return {
    dbMock: {
      query: {
        stores: {
          findFirst: vi.fn(),
        },
        products: {
          findFirst: vi.fn(),
          findMany: vi.fn(),
        },
      },
      insert: vi.fn(() => ({
        values: vi.fn(),
      })),
      update: vi.fn(() => ({
        set: vi.fn(() => ({
          where: vi.fn(),
        })),
      })),
      delete: vi.fn(() => ({
        where: vi.fn(),
      })),
    }
  };
});

vi.mock('../db', () => ({
  db: dbMock,
}));

vi.mock('../db/schema', () => ({
  products: {
    id: 'id',
    storeId: 'storeId',
  },
  stores: {
    id: 'id',
    userId: 'userId',
  },
}));

describe('Product Actions', () => {
  const mockSession = { isAuth: true, userId: 1 };
  const mockStore = { id: 10, userId: 1 };
  const mockProduct = { id: 100, storeId: 10, images: ['https://example.com/img1.jpg'] };

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Default successful mocks
    (verifySession as any).mockResolvedValue(mockSession);
    
    dbMock.query.stores.findFirst.mockResolvedValue(mockStore);
    dbMock.query.products.findFirst.mockResolvedValue(mockProduct);
  });

  describe('updateProduct', () => {
    it('should validate input and update the product', async () => {
      const formData = new FormData();
      formData.append('name', 'Updated Product');
      formData.append('price', '25.50');
      formData.append('inStock', 'on');
      formData.append('images', 'https://example.com/new.jpg');

      await updateProduct(100, {}, formData);

      expect(dbMock.update).toHaveBeenCalled();
      expect(revalidatePath).toHaveBeenCalledWith('/dashboard/products');
      expect(redirect).toHaveBeenCalledWith('/dashboard/products');
    });

    it('should return validation errors for invalid input', async () => {
      const formData = new FormData();
      formData.append('name', ''); // Empty name is invalid
      formData.append('price', '-10'); // Negative price

      const result = await updateProduct(100, {}, formData);
      expect(result?.errors).toBeDefined();
      expect(result?.errors?.name).toBeDefined();
      expect(result?.errors?.price).toBeDefined();
      expect(dbMock.update).not.toHaveBeenCalled();
    });
  });

  describe('deleteProduct', () => {
    it('should delete product and its images from vercel blob', async () => {
      await deleteProduct(100);

      expect(del).toHaveBeenCalledWith(['https://example.com/img1.jpg']);
      expect(dbMock.delete).toHaveBeenCalled();
      
      expect(revalidatePath).toHaveBeenCalledWith('/dashboard/products');
    });

    it('should fail if product does not belong to store', async () => {
      dbMock.query.products.findFirst.mockResolvedValueOnce(null);
      const result = await deleteProduct(100);
      
      expect(result.message).toContain('Product not found or unauthorized');
      expect(dbMock.delete).not.toHaveBeenCalled();
    });
  });

  describe('toggleProductStock', () => {
    it('should toggle stock status', async () => {
      await toggleProductStock(100, false);
      expect(dbMock.update).toHaveBeenCalled();
      
      expect(revalidatePath).toHaveBeenCalledWith('/dashboard/products');
    });
  });
});
