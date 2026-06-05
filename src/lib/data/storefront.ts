import { db } from '../../db';
import { stores, products } from '../../db/schema';
import { eq, desc } from 'drizzle-orm';

export async function getStorefrontData(username: string) {
  const store = await db.query.stores.findFirst({
    where: eq(stores.username, username),
  });

  if (!store) {
    return null;
  }

  const storeProducts = await db.query.products.findMany({
    where: eq(products.storeId, store.id),
    orderBy: [desc(products.createdAt)],
  });

  return {
    store,
    products: storeProducts,
  };
}
