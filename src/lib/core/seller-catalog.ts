import { verifySession } from '../dal';
import { db } from '../../db';
import { stores, products } from '../../db/schema';
import { eq, and } from 'drizzle-orm';
import { productSchema } from '../validations/product';
import * as z from 'zod';
import { del } from '@vercel/blob';

export type ValidatedProductData = z.infer<typeof productSchema>;

export class SellerCatalog {
  constructor(public readonly storeId: number, public readonly currency: string = 'NGN') {}

  static async fromSession(): Promise<SellerCatalog | null> {
    const session = await verifySession();
    if (!session?.userId) {
      return null;
    }

    const currentStore = await db.query.stores.findFirst({
      where: eq(stores.userId, session.userId),
    });

    if (!currentStore) {
      return null;
    }

    return new SellerCatalog(currentStore.id, currentStore.currency);
  }

  async createProduct(data: ValidatedProductData) {
    const priceInCents = Math.round(data.price * 100);
    await db.insert(products).values({
      storeId: this.storeId,
      name: data.name,
      description: data.description || null,
      price: priceInCents,
      inStock: data.inStock !== undefined ? data.inStock : true,
      media: data.media || [],
    });
  }

  async getProducts() {
    return await db.query.products.findMany({
      where: eq(products.storeId, this.storeId),
      orderBy: (products, { desc }) => [desc(products.createdAt)],
    });
  }

  async updateProduct(id: number, data: ValidatedProductData) {
    const priceInCents = Math.round(data.price * 100);
    await db.update(products).set({
      name: data.name,
      description: data.description || null,
      price: priceInCents,
      inStock: data.inStock !== undefined ? data.inStock : true,
      media: data.media || [],
    }).where(and(eq(products.id, id), eq(products.storeId, this.storeId)));
  }

  async deleteProduct(id: number) {
    const existingProduct = await db.query.products.findFirst({
      where: and(eq(products.id, id), eq(products.storeId, this.storeId)),
    });

    if (!existingProduct) {
      throw new Error('Product not found or unauthorized.');
    }

    if (existingProduct.media && existingProduct.media.length > 0) {
      await del(existingProduct.media);
    }

    await db.delete(products).where(eq(products.id, id));
  }

  async toggleProductStock(id: number, inStock: boolean) {
    await db.update(products).set({ inStock }).where(and(eq(products.id, id), eq(products.storeId, this.storeId)));
  }
}

