'use server';

import { productSchema, ProductFormState } from '@/src/lib/validations/product';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { SellerCatalog } from '@/src/lib/core/seller-catalog';

export async function createProduct(prevState: ProductFormState, formData: FormData): Promise<ProductFormState> {
  const catalog = await SellerCatalog.fromSession();
  if (!catalog) {
    return { message: 'Not authenticated or Store not found.' };
  }

  const rawData = {
    name: formData.get('name')?.toString(),
    description: formData.get('description')?.toString() || undefined,
    price: formData.get('price'),
    media: formData.getAll('media').map((img) => img.toString()),
  };

  const validatedFields = productSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Please check your inputs and try again.',
    };
  }

  try {
    const inStock = true;
    await catalog.createProduct({
      ...validatedFields.data,
    });
  } catch (error) {
    console.error('Error creating product:', error);
    return { message: 'Failed to create product. Please try again later.' };
  }

  const hasMedia = (validatedFields.data.media?.length ?? 0) > 0;
  const hasDescription = !!validatedFields.data.description;

  revalidatePath('/dashboard/products');
  redirect(`/dashboard/products?event=product_added&has_media=${hasMedia}&has_description=${hasDescription}`);
}

export async function getProducts() {
  const catalog = await SellerCatalog.fromSession();
  if (!catalog) {
    return [];
  }

  return await catalog.getProducts();
}

export async function updateProduct(id: number, prevState: ProductFormState, formData: FormData): Promise<ProductFormState> {
  const catalog = await SellerCatalog.fromSession();
  if (!catalog) {
    return { message: 'Not authenticated or Store not found.' };
  }

  const rawData = {
    name: formData.get('name')?.toString(),
    description: formData.get('description')?.toString() || undefined,
    price: formData.get('price'),
    media: formData.getAll('media').map((img) => img.toString()),
    inStock: formData.get('inStock') === 'on',
  };

  const validatedFields = productSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Please check your inputs and try again.',
    };
  }

  try {
    await catalog.updateProduct(id, validatedFields.data);
  } catch (error) {
    console.error('Error updating product:', error);
    return { message: 'Failed to update product. Please try again later.' };
  }

  revalidatePath('/dashboard/products');
  redirect('/dashboard/products');
}

export async function deleteProduct(id: number): Promise<{ message: string; success?: boolean }> {
  const catalog = await SellerCatalog.fromSession();
  if (!catalog) {
    return { message: 'Not authenticated or Store not found.' };
  }

  try {
    await catalog.deleteProduct(id);
  } catch (error: any) {
    console.error('Error deleting product:', error);
    if (error.message.includes('Product not found or unauthorized')) {
      return { message: 'Product not found or unauthorized.' };
    }
    return { message: 'Failed to delete product. Please try again later.' };
  }

  revalidatePath('/dashboard/products');
  return { message: 'Product deleted successfully.', success: true };
}

export async function toggleProductStock(id: number, inStock: boolean): Promise<{ message: string; success?: boolean }> {
  const catalog = await SellerCatalog.fromSession();
  if (!catalog) {
    return { message: 'Not authenticated or Store not found.' };
  }

  try {
    await catalog.toggleProductStock(id, inStock);
  } catch (error) {
    console.error('Error toggling product stock:', error);
    return { message: 'Failed to update stock status.' };
  }

  revalidatePath('/dashboard/products');
  return { message: 'Stock status updated.', success: true };
}
