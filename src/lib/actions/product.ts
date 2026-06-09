'use server';

import { db } from '@/src/db';
import { products, stores } from '@/src/db/schema';
import { eq, and } from 'drizzle-orm';
import { verifySession } from '@/src/lib/dal';
import { productSchema, ProductFormState } from '@/src/lib/validations/product';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { del } from '@vercel/blob';

export async function createProduct(prevState: ProductFormState, formData: FormData): Promise<ProductFormState> {
  const session = await verifySession();
  if (!session?.userId) {
    return { message: 'Not authenticated' };
  }

  const rawData = {
    name: formData.get('name')?.toString(),
    description: formData.get('description')?.toString() || undefined,
    price: formData.get('price'),
    images: formData.getAll('images').map((img) => img.toString()),
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
      images: validatedFields.data.images || [],
    });
  } catch (error) {
    console.error('Error creating product:', error);
    return { message: 'Failed to create product. Please try again later.' };
  }

  const hasImages = (validatedFields.data.images?.length ?? 0) > 0;
  const hasDescription = !!validatedFields.data.description;

  revalidatePath('/dashboard/products');
  redirect(`/dashboard/products?event=product_added&has_images=${hasImages}&has_description=${hasDescription}`);
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

export async function updateProduct(id: number, prevState: ProductFormState, formData: FormData): Promise<ProductFormState> {
  const session = await verifySession();
  if (!session?.userId) {
    return { message: 'Not authenticated' };
  }

  const rawData = {
    name: formData.get('name')?.toString(),
    description: formData.get('description')?.toString() || undefined,
    price: formData.get('price'),
    images: formData.getAll('images').map((img) => img.toString()),
    inStock: formData.get('inStock') === 'on',
  };

  const validatedFields = productSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Please check your inputs and try again.',
    };
  }

  const currentStore = await db.query.stores.findFirst({
    where: eq(stores.userId, session.userId),
  });

  if (!currentStore) {
    return { message: 'Store not found. Please create a store profile first.' };
  }

  // Verify the product belongs to the store
  const existingProduct = await db.query.products.findFirst({
    where: and(eq(products.id, id), eq(products.storeId, currentStore.id)),
  });

  if (!existingProduct) {
    return { message: 'Product not found or unauthorized.' };
  }

  const priceInCents = Math.round(validatedFields.data.price * 100);

  try {
    await db.update(products).set({
      name: validatedFields.data.name,
      description: validatedFields.data.description || null,
      price: priceInCents,
      inStock: validatedFields.data.inStock !== undefined ? validatedFields.data.inStock : true,
      images: validatedFields.data.images || [],
    }).where(eq(products.id, id));
  } catch (error) {
    console.error('Error updating product:', error);
    return { message: 'Failed to update product. Please try again later.' };
  }

  revalidatePath('/dashboard/products');
  redirect('/dashboard/products');
}

export async function deleteProduct(id: number): Promise<{ message: string; success?: boolean }> {
  const session = await verifySession();
  if (!session?.userId) {
    return { message: 'Not authenticated' };
  }

  const currentStore = await db.query.stores.findFirst({
    where: eq(stores.userId, session.userId),
  });

  if (!currentStore) {
    return { message: 'Store not found.' };
  }

  const existingProduct = await db.query.products.findFirst({
    where: and(eq(products.id, id), eq(products.storeId, currentStore.id)),
  });

  if (!existingProduct) {
    return { message: 'Product not found or unauthorized.' };
  }

  try {
    // Delete associated images from Vercel Blob
    if (existingProduct.images && existingProduct.images.length > 0) {
      await del(existingProduct.images);
    }

    // Delete product from database
    await db.delete(products).where(eq(products.id, id));
  } catch (error) {
    console.error('Error deleting product:', error);
    return { message: 'Failed to delete product. Please try again later.' };
  }

  revalidatePath('/dashboard/products');
  return { message: 'Product deleted successfully.', success: true };
}

export async function toggleProductStock(id: number, inStock: boolean): Promise<{ message: string; success?: boolean }> {
  const session = await verifySession();
  if (!session?.userId) {
    return { message: 'Not authenticated' };
  }

  const currentStore = await db.query.stores.findFirst({
    where: eq(stores.userId, session.userId),
  });

  if (!currentStore) {
    return { message: 'Store not found.' };
  }

  const existingProduct = await db.query.products.findFirst({
    where: and(eq(products.id, id), eq(products.storeId, currentStore.id)),
  });

  if (!existingProduct) {
    return { message: 'Product not found or unauthorized.' };
  }

  try {
    await db.update(products).set({ inStock }).where(eq(products.id, id));
  } catch (error) {
    console.error('Error toggling product stock:', error);
    return { message: 'Failed to update stock status.' };
  }

  revalidatePath('/dashboard/products');
  return { message: 'Stock status updated.', success: true };
}
