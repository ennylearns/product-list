'use server';

import { db } from '@/src/db';
import { products, stores } from '@/src/db/schema';
import { eq } from 'drizzle-orm';
import { verifySession } from '@/src/lib/dal';
import { productSchema, ProductFormState } from '@/src/lib/validations/product';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function createProduct(prevState: ProductFormState, formData: FormData): Promise<ProductFormState> {
  const session = await verifySession();
  if (!session?.userId) {
    return { message: 'Not authenticated' };
  }

  const rawData = {
    name: formData.get('name')?.toString(),
    description: formData.get('description')?.toString() || undefined,
    price: formData.get('price'),
  };

  const validatedFields = productSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Please check your inputs and try again.',
    };
  }

  // Find the current store
  const currentStore = await db.query.stores.findFirst({
    where: eq(stores.userId, session.userId),
  });

  if (!currentStore) {
    return { message: 'Store not found. Please create a store profile first.' };
  }

  // Convert price to cents
  const priceInCents = Math.round(validatedFields.data.price * 100);

  try {
    await db.insert(products).values({
      storeId: currentStore.id,
      name: validatedFields.data.name,
      description: validatedFields.data.description || null,
      price: priceInCents,
      inStock: true,
      images: [],
    });
  } catch (error) {
    console.error('Error creating product:', error);
    return { message: 'Failed to create product. Please try again later.' };
  }

  revalidatePath('/dashboard/products');
  redirect('/dashboard/products');
}

export async function getProducts() {
  const session = await verifySession();
  if (!session?.userId) {
    return [];
  }

  const currentStore = await db.query.stores.findFirst({
    where: eq(stores.userId, session.userId),
  });

  if (!currentStore) {
    return [];
  }

  const storeProducts = await db.query.products.findMany({
    where: eq(products.storeId, currentStore.id),
    orderBy: (products, { desc }) => [desc(products.createdAt)],
  });

  return storeProducts;
}
