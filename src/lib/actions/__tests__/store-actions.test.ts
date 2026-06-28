import { describe, it, expect, vi, beforeEach } from 'vitest';
import { setupStore, updateStore } from '../store';
import * as dal from '@/src/lib/dal';
import { db } from '@/src/db';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

vi.mock('@/src/lib/dal', () => ({
  verifySession: vi.fn(),
}));

vi.mock('@/src/db', () => ({
  db: {
    query: {
      stores: {
        findFirst: vi.fn(),
      },
    },
    insert: vi.fn(() => ({
      values: vi.fn().mockResolvedValue(true),
    })),
    update: vi.fn(() => ({
      set: vi.fn(() => ({
        where: vi.fn().mockResolvedValue(true),
      })),
    })),
  },
}));

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

describe('Store Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (dal.verifySession as any).mockResolvedValue({ isAuth: true, userId: 1 });
  });

  describe('setupStore', () => {
    it('should fail if unauthenticated', async () => {
      (dal.verifySession as any).mockResolvedValue(null);
      const formData = new FormData();
      const res = await setupStore(null, formData);
      expect(res).toEqual({ message: 'Not authenticated' });
    });

    it('should validate input fields', async () => {
      const formData = new FormData();
      formData.set('name', ''); // invalid
      const res = await setupStore(null, formData);
      expect(res).toHaveProperty('errors');
      expect(res).toHaveProperty('message', 'Please check your inputs and try again.');
    });

    it('should fail if user already has a store', async () => {
      const formData = new FormData();
      formData.set('name', 'My Store');
      formData.set('username', 'mystore');
      formData.set('whatsappNumber', '+1234567890');
      formData.set('currency', 'NGN');

      (db.query.stores.findFirst as any).mockResolvedValueOnce({ id: 1 }); // User has store

      const res = await setupStore(null, formData);
      expect(res).toEqual({ message: 'You already have a store.' });
    });

    it('should succeed and redirect when data is valid', async () => {
      const formData = new FormData();
      formData.set('name', 'My Store');
      formData.set('username', 'mystore');
      formData.set('whatsappNumber', '+1234567890');
      formData.set('currency', 'NGN');

      (db.query.stores.findFirst as any).mockResolvedValue(null); // No existing store or username

      await setupStore(null, formData);
      expect(db.insert).toHaveBeenCalled();
      expect(redirect).toHaveBeenCalledWith('/dashboard?event=store_created');
    });
  });

  describe('updateStore', () => {
    it('should fail if store not found', async () => {
      const formData = new FormData();
      formData.set('name', 'My Store');
      formData.set('username', 'mystore');
      formData.set('whatsappNumber', '+1234567890');
      formData.set('currency', 'NGN');

      (db.query.stores.findFirst as any).mockResolvedValueOnce(null); // No store found

      const res = await updateStore(null, formData);
      expect(res).toEqual({ message: 'Store not found.' });
    });

    it('should succeed and revalidate paths', async () => {
      const formData = new FormData();
      formData.set('name', 'New Store Name');
      formData.set('username', 'newstore');
      formData.set('whatsappNumber', '+1234567890');
      formData.set('currency', 'NGN');

      // mock current store
      (db.query.stores.findFirst as any).mockResolvedValueOnce({ id: 1, userId: 1 }); 
      // mock username uniqueness check
      (db.query.stores.findFirst as any).mockResolvedValueOnce(null); 

      const res = await updateStore(null, formData);
      expect(db.update).toHaveBeenCalled();
      expect(revalidatePath).toHaveBeenCalledWith('/dashboard/settings');
      expect(revalidatePath).toHaveBeenCalledWith('/dashboard');
      expect(res).toEqual({ success: true, message: 'Store settings updated successfully.' });
    });
  });
});
