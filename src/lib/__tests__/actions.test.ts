import { describe, it, expect, vi, beforeEach } from 'vitest';
import bcrypt from 'bcryptjs';

// Mock validations
vi.mock('../validations', () => {
  return {
    SignupFormSchema: {
      safeParse: vi.fn(),
    },
    SigninFormSchema: {
      safeParse: vi.fn(),
    },
  };
});

// Mock DB
vi.mock('@/src/db', () => ({
  db: {
    insert: vi.fn().mockReturnThis(),
    values: vi.fn().mockReturnThis(),
    returning: vi.fn().mockReturnThis(),
  }
}));

// Mock Auth
vi.mock('../auth', () => ({
  signIn: vi.fn(),
  signOut: vi.fn(),
}));

// Mock next/navigation
vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}));

import { signup, signin, signout } from '../actions';
import { SignupFormSchema, SigninFormSchema } from '../validations';
import { db } from '@/src/db';
import { signIn, signOut } from '../auth';
import { redirect } from 'next/navigation';

describe('Server Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('signup action', () => {
    it('should return validation errors if data is invalid', async () => {
      (SignupFormSchema.safeParse as any).mockReturnValue({
        success: false,
        error: { flatten: () => ({ fieldErrors: { email: ['Invalid email'] } }) }
      });

      const formData = new FormData();
      formData.append('email', 'bad');
      formData.append('password', '123');

      const result = await signup(undefined, formData);

      expect(result).toEqual({ errors: { email: ['Invalid email'] } });
      expect(db.insert).not.toHaveBeenCalled();
    });

    it('should insert user and sign in when data is valid', async () => {
      (SignupFormSchema.safeParse as any).mockReturnValue({
        success: true,
        data: { email: 'test@example.com', password: 'password123' }
      });
      
      const returningMock = vi.fn().mockResolvedValue([{ id: 1 }]);
      const valuesMock = vi.fn().mockReturnValue({ returning: returningMock });
      (db.insert as any).mockReturnValue({ values: valuesMock });
      
      // Hash mock
      vi.spyOn(bcrypt, 'hash').mockImplementation(async () => 'hashed_pwd');

      const formData = new FormData();
      formData.append('email', 'test@example.com');
      formData.append('password', 'password123');
      formData.append('confirmPassword', 'password123');

      await signup(undefined, formData);

      expect(db.insert).toHaveBeenCalled();
      expect(signIn).toHaveBeenCalledWith('credentials', { email: 'test@example.com', password: 'password123', redirect: false });
      expect(redirect).toHaveBeenCalledWith('/dashboard?event=sign_up');
    });

    it('should return conflict message on duplicate email', async () => {
      (SignupFormSchema.safeParse as any).mockReturnValue({
        success: true,
        data: { email: 'test@example.com', password: 'password123' }
      });
      
      const returningMock = vi.fn().mockRejectedValue({ code: '23505' }); // Postgres unique violation code
      const valuesMock = vi.fn().mockReturnValue({ returning: returningMock });
      (db.insert as any).mockReturnValue({ values: valuesMock });

      const formData = new FormData();
      const result = await signup(undefined, formData);

      expect(result).toEqual({ message: 'An account with this email already exists' });
      expect(signIn).not.toHaveBeenCalled();
      expect(redirect).not.toHaveBeenCalled();
    });
  });

  describe('signin action', () => {
    it('should return validation errors if data is invalid', async () => {
      (SigninFormSchema.safeParse as any).mockReturnValue({
        success: false,
        error: { flatten: () => ({ fieldErrors: { email: ['Required'] } }) }
      });

      const formData = new FormData();
      const result = await signin(undefined, formData);

      expect(result).toEqual({ errors: { email: ['Required'] } });
      expect(signIn).not.toHaveBeenCalled();
    });

    it('should sign in and redirect on success', async () => {
      (SigninFormSchema.safeParse as any).mockReturnValue({
        success: true,
        data: { email: 'test@example.com', password: 'password123' }
      });
      
      (signIn as any).mockResolvedValue(true);

      const formData = new FormData();
      formData.append('email', 'test@example.com');
      formData.append('password', 'password123');

      await signin(undefined, formData);

      expect(signIn).toHaveBeenCalledWith('credentials', { email: 'test@example.com', password: 'password123', redirect: false });
      expect(redirect).toHaveBeenCalledWith('/dashboard');
    });

    it('should return invalid credentials message on CredentialsSignin error', async () => {
      (SigninFormSchema.safeParse as any).mockReturnValue({
        success: true,
        data: { email: 'test@example.com', password: 'password123' }
      });
      
      (signIn as any).mockRejectedValue({ type: 'CredentialsSignin' });

      const formData = new FormData();
      const result = await signin(undefined, formData);

      expect(result).toEqual({ message: 'Invalid email or password' });
      expect(redirect).not.toHaveBeenCalled();
    });
    
    it('should rethrow unknown errors', async () => {
      (SigninFormSchema.safeParse as any).mockReturnValue({
        success: true,
        data: { email: 'test@example.com', password: 'password123' }
      });
      
      const unknownError = new Error('Database down');
      (signIn as any).mockRejectedValue(unknownError);

      const formData = new FormData();
      
      await expect(signin(undefined, formData)).rejects.toThrow('Database down');
    });
  });

  describe('signout action', () => {
    it('should call signOut', async () => {
      await signout();
      expect(signOut).toHaveBeenCalledWith({ redirectTo: '/login' });
    });
  });
});
