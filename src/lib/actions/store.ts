'use server';

import { db } from '@/src/db';
import { stores } from '@/src/db/schema';
import { eq, ne, and } from 'drizzle-orm';
import { verifySession } from '@/src/lib/dal';
import { storeSchema } from '@/src/lib/validations/store';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function setupStore(prevState: any, formData: FormData) {
  const session = await verifySession();
  if (!session?.userId) {
    return { message: 'Not authenticated' };
  }

  const rawData = {
    name: formData.get('name') as string,
    username: formData.get('username') as string,
    whatsappNumber: formData.get('whatsappNumber') as string,
    description: formData.get('description') as string,
    currency: formData.get('currency') as string,
  };

  const validatedFields = storeSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Please check your inputs and try again.',
    };
  }

  // Check if user already has a store
  const existingStoreForUser = await db.query.stores.findFirst({
    where: eq(stores.userId, session.userId),
  });

  if (existingStoreForUser) {
    return { message: 'You already have a store.' };
  }

  // Check username uniqueness
  const existingStoreByUsername = await db.query.stores.findFirst({
    where: eq(stores.username, validatedFields.data.username),
  });

  if (existingStoreByUsername) {
    return {
      errors: { username: ['This username is already taken.'] },
      message: 'Please choose a different username.',
    };
  }

  try {
    await db.insert(stores).values({
      userId: session.userId,
      name: validatedFields.data.name,
      username: validatedFields.data.username,
      whatsappNumber: validatedFields.data.whatsappNumber,
      description: validatedFields.data.description || null,
      currency: validatedFields.data.currency,
    });
  } catch (error) {
    console.error('Error creating store:', error);
    return { message: 'Failed to create store. Please try again later.' };
  }

  redirect('/dashboard?event=store_created');
}

export async function updateStore(prevState: any, formData: FormData) {
  const session = await verifySession();
  if (!session?.userId) {
    return { message: 'Not authenticated' };
  }

  const rawData = {
    name: formData.get('name') as string,
    username: formData.get('username') as string,
    whatsappNumber: formData.get('whatsappNumber') as string,
    description: formData.get('description') as string,
    currency: formData.get('currency') as string,
  };

  const validatedFields = storeSchema.safeParse(rawData);

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
    return { message: 'Store not found.' };
  }

  // Check username uniqueness (excluding current store)
  const existingStoreByUsername = await db.query.stores.findFirst({
    where: and(
      eq(stores.username, validatedFields.data.username),
      ne(stores.id, currentStore.id)
    ),
  });

  if (existingStoreByUsername) {
    return {
      errors: { username: ['This username is already taken.'] },
      message: 'Please choose a different username.',
    };
  }

  try {
    await db.update(stores)
      .set({
        name: validatedFields.data.name,
        username: validatedFields.data.username,
        whatsappNumber: validatedFields.data.whatsappNumber,
        description: validatedFields.data.description || null,
        currency: validatedFields.data.currency,
        updatedAt: new Date(),
      })
      .where(eq(stores.id, currentStore.id));
  } catch (error) {
    console.error('Error updating store:', error);
    return { message: 'Failed to update store. Please try again later.' };
  }

  revalidatePath('/dashboard/settings');
  revalidatePath('/dashboard');
  
  return { success: true, message: 'Store settings updated successfully.' };
}
