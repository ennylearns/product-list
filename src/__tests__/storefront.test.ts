import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getStorefrontData, getProductDetails } from '../lib/data/storefront';

const { dbMock } = vi.hoisted(() => {
  return {
    dbMock: {
      query: {
        stores: {
          findFirst: vi.fn(),
        },
        products: {
          findMany: vi.fn(),
          findFirst: vi.fn(),
        },
      },
    }
  };
});

vi.mock('../db', () => ({
  db: dbMock,
}));

describe('getStorefrontData', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return store and products if store exists', async () => {
    const mockStore = { id: 1, name: 'My Store', username: 'mystore', description: 'desc' };
    const mockProducts = [
      { id: 101, storeId: 1, name: 'Prod 1', price: 1000, inStock: true, images: [] }
    ];

    dbMock.query.stores.findFirst.mockResolvedValue(mockStore);
    dbMock.query.products.findMany.mockResolvedValue(mockProducts);

    const result = await getStorefrontData('mystore');

    expect(dbMock.query.stores.findFirst).toHaveBeenCalledWith({
      where: expect.any(Object),
    });
    
    expect(dbMock.query.products.findMany).toHaveBeenCalledWith({
      where: expect.any(Object),
      orderBy: expect.any(Array),
    });

    expect(result).toEqual({ store: mockStore, products: mockProducts });
  });

  it('should return null if store does not exist', async () => {
    dbMock.query.stores.findFirst.mockResolvedValue(undefined);

    const result = await getStorefrontData('invalid');

    expect(dbMock.query.stores.findFirst).toHaveBeenCalled();
    expect(dbMock.query.products.findMany).not.toHaveBeenCalled();
    expect(result).toBeNull();
  });
});

describe('getProductDetails', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return store and product if both exist and product belongs to store', async () => {
    const mockStore = { id: 1, username: 'mystore' };
    const mockProduct = { id: 101, storeId: 1, name: 'Prod 1' };

    dbMock.query.stores.findFirst.mockResolvedValue(mockStore);
    dbMock.query.products.findFirst.mockResolvedValue(mockProduct);

    const result = await getProductDetails('mystore', 101);

    expect(dbMock.query.stores.findFirst).toHaveBeenCalled();
    expect(dbMock.query.products.findFirst).toHaveBeenCalled();
    expect(result).toEqual({ store: mockStore, product: mockProduct });
  });

  it('should return null if store does not exist', async () => {
    dbMock.query.stores.findFirst.mockResolvedValue(undefined);

    const result = await getProductDetails('invalid', 101);

    expect(dbMock.query.stores.findFirst).toHaveBeenCalled();
    expect(dbMock.query.products.findFirst).not.toHaveBeenCalled();
    expect(result).toBeNull();
  });

  it('should return null if product does not exist', async () => {
    const mockStore = { id: 1, username: 'mystore' };
    dbMock.query.stores.findFirst.mockResolvedValue(mockStore);
    dbMock.query.products.findFirst.mockResolvedValue(undefined);

    const result = await getProductDetails('mystore', 999);

    expect(result).toBeNull();
  });
});
