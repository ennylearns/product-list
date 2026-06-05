import { db } from '../../db';
import { stores, products } from '../../db/schema';
import { eq } from 'drizzle-orm';

export async function getDashboardStats(userId: number) {
  const store = await db.query.stores.findFirst({
    where: eq(stores.userId, userId),
  });

  if (!store) {
    return {
      total: 0,
      inStock: 0,
      outOfStock: 0,
    };
  }

  const allProducts = await db.query.products.findMany({
    where: eq(products.storeId, store.id),
    columns: {
      inStock: true,
    },
  });

  const total = allProducts.length;
  const inStock = allProducts.filter(p => p.inStock).length;
  const outOfStock = total - inStock;

  return {
    total,
    inStock,
    outOfStock,
  };
}
