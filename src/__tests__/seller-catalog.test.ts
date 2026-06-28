import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SellerCatalog } from '../lib/core/seller-catalog';
import { verifySession } from '../lib/dal';

vi.mock('../lib/dal', () => ({
  verifySession: vi.fn(),
}));

vi.mock('@vercel/blob', () => ({
  del: vi.fn(),
}));

const { dbMock, insertValuesMock } = vi.hoisted(() => {
  const insertValuesMock = vi.fn();
  return {
    insertValuesMock,
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
        values: insertValuesMock,
      })),
      update: vi.fn(),
      delete: vi.fn(),
    } as any
  };
});

vi.mock('../db', () => ({
  db: dbMock,
}));

vi.mock('../db/schema', () => ({
  stores: {
    id: 'id',
    userId: 'userId',
  },
  products: {
    id: 'id',
    storeId: 'storeId',
  },
}));

describe('SellerCatalog', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fromSession', () => {
    it('returns null if no session', async () => {
      vi.mocked(verifySession).mockResolvedValue(null as any);
      const catalog = await SellerCatalog.fromSession();
      expect(catalog).toBeNull();
    });

    it('returns null if no store for session user', async () => {
      vi.mocked(verifySession).mockResolvedValue({ isAuth: true, userId: 1 });
      dbMock.query.stores.findFirst.mockResolvedValue(null);
      
      const catalog = await SellerCatalog.fromSession();
      expect(catalog).toBeNull();
    });

    it('returns instantiated SellerCatalog with storeId and currency if valid', async () => {
      vi.mocked(verifySession).mockResolvedValue({ isAuth: true, userId: 1 });
      dbMock.query.stores.findFirst.mockResolvedValue({ id: 10, userId: 1, currency: 'USD' });
      
      const catalog = await SellerCatalog.fromSession();
      expect(catalog).toBeInstanceOf(SellerCatalog);
      expect(catalog?.storeId).toBe(10);
      expect(catalog?.currency).toBe('USD');
    });
  });

  describe('createProduct', () => {
    it('inserts a product with storeId and defaults', async () => {
      const catalog = new SellerCatalog(10);
      const data = {
        name: 'Test Product',
        price: 10,
        media: ['img.jpg'],
      };

      await catalog.createProduct(data as any);
      
      expect(dbMock.insert).toHaveBeenCalled();
      expect(insertValuesMock).toHaveBeenCalledWith({
        storeId: 10,
        name: 'Test Product',
        description: null,
        price: 1000,
        inStock: true,
        media: ['img.jpg'],
      });
    });
  });

  describe('getProducts', () => {
    it('returns products for the store', async () => {
      const catalog = new SellerCatalog(10);
      const mockProducts = [{ id: 1, name: 'Product 1' }];
      dbMock.query.products = {
        findMany: vi.fn().mockResolvedValue(mockProducts),
      };

      const products = await catalog.getProducts();

      expect(products).toEqual(mockProducts);
      expect(dbMock.query.products.findMany).toHaveBeenCalled();
    });
  });

  describe('updateProduct', () => {
    it('updates a product belonging to the store', async () => {
      const catalog = new SellerCatalog(10);
      const data = {
        name: 'Updated Product',
        price: 20,
        media: [],
      };

      const updateSetMock = vi.fn().mockReturnValue({ where: vi.fn() });
      dbMock.update = vi.fn().mockReturnValue({ set: updateSetMock });

      await catalog.updateProduct(1, data as any);

      expect(dbMock.update).toHaveBeenCalled();
      expect(updateSetMock).toHaveBeenCalledWith({
        name: 'Updated Product',
        description: null,
        price: 2000,
        inStock: true,
        media: [],
      });
    });
  });

  describe('deleteProduct', () => {
    it('deletes a product', async () => {
      const catalog = new SellerCatalog(10);
      const deleteWhereMock = vi.fn();
      dbMock.delete = vi.fn().mockReturnValue({ where: deleteWhereMock });
      dbMock.query.products.findFirst = vi.fn().mockResolvedValue({ id: 1, storeId: 10, media: [] });

      await catalog.deleteProduct(1);

      expect(dbMock.delete).toHaveBeenCalled();
      expect(deleteWhereMock).toHaveBeenCalled();
    });
  });

  describe('toggleProductStock', () => {
    it('toggles product stock', async () => {
      const catalog = new SellerCatalog(10);
      const updateSetMock = vi.fn().mockReturnValue({ where: vi.fn() });
      dbMock.update = vi.fn().mockReturnValue({ set: updateSetMock });

      await catalog.toggleProductStock(1, false);

      expect(dbMock.update).toHaveBeenCalled();
      expect(updateSetMock).toHaveBeenCalledWith({
        inStock: false,
      });
    });
  });
});

