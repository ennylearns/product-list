import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getDashboardStats } from '../lib/data/dashboard';

const { dbMock } = vi.hoisted(() => {
  return {
    dbMock: {
      query: {
        stores: {
          findFirst: vi.fn(),
        },
        products: {
          findMany: vi.fn(),
        },
      },
    }
  };
});

vi.mock('../db', () => ({
  db: dbMock,
}));

describe('getDashboardStats', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 0 counts if store does not exist', async () => {
    dbMock.query.stores.findFirst.mockResolvedValue(undefined);

    const result = await getDashboardStats(1);

    expect(dbMock.query.stores.findFirst).toHaveBeenCalled();
    expect(dbMock.query.products.findMany).not.toHaveBeenCalled();
    expect(result).toEqual({ total: 0, inStock: 0, outOfStock: 0, username: '' });
  });

  it('should return correct counts when store exists and has products', async () => {
    const mockStore = { id: 10, userId: 1, username: 'teststore' };
    const mockProducts = [
      { id: 101, inStock: true },
      { id: 102, inStock: false },
      { id: 103, inStock: true },
    ];

    dbMock.query.stores.findFirst.mockResolvedValue(mockStore);
    dbMock.query.products.findMany.mockResolvedValue(mockProducts);

    const result = await getDashboardStats(1);

    expect(dbMock.query.stores.findFirst).toHaveBeenCalled();
    expect(dbMock.query.products.findMany).toHaveBeenCalled();
    
    expect(result).toEqual({
      total: 3,
      inStock: 2,
      outOfStock: 1,
      username: 'teststore',
    });
  });

  it('should return 0 counts when store exists but has no products', async () => {
    const mockStore = { id: 10, userId: 1, username: 'teststore2' };
    const mockProducts: any[] = [];

    dbMock.query.stores.findFirst.mockResolvedValue(mockStore);
    dbMock.query.products.findMany.mockResolvedValue(mockProducts);

    const result = await getDashboardStats(1);

    expect(result).toEqual({
      total: 0,
      inStock: 0,
      outOfStock: 0,
      username: 'teststore2',
    });
  });
});
