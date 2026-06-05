import { describe, it, expect } from 'vitest';
import { SignupFormSchema, SigninFormSchema } from '../validations';

describe('Validation Schemas', () => {
  describe('SignupFormSchema', () => {
    it('should validate correctly with valid data', () => {
      const result = SignupFormSchema.safeParse({
        email: 'test@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!'
      });
      expect(result.success).toBe(true);
    });

    it('should fail if email is invalid', () => {
      const result = SignupFormSchema.safeParse({
        email: 'not-an-email',
        password: 'Password123!',
        confirmPassword: 'Password123!'
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.email).toBeDefined();
      }
    });

    it('should fail if password is too short', () => {
      const result = SignupFormSchema.safeParse({
        email: 'test@example.com',
        password: 'Pass1!',
        confirmPassword: 'Pass1!'
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.password?.[0]).toContain('at least 8 characters');
      }
    });

    it('should fail if password has no letter', () => {
      const result = SignupFormSchema.safeParse({
        email: 'test@example.com',
        password: '12345678!',
        confirmPassword: '12345678!'
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.password?.[0]).toContain('at least one letter');
      }
    });

    it('should fail if password has no number', () => {
      const result = SignupFormSchema.safeParse({
        email: 'test@example.com',
        password: 'Password!',
        confirmPassword: 'Password!'
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.password?.[0]).toContain('at least one number');
      }
    });

    it('should fail if passwords do not match', () => {
      const result = SignupFormSchema.safeParse({
        email: 'test@example.com',
        password: 'Password123!',
        confirmPassword: 'Password321!'
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.confirmPassword).toBeDefined();
        expect(result.error.flatten().fieldErrors.confirmPassword?.[0]).toBe('Passwords do not match.');
      }
    });
  });

  describe('SigninFormSchema', () => {
    it('should validate correctly with valid data', () => {
      const result = SigninFormSchema.safeParse({
        email: 'test@example.com',
        password: 'Password123!'
      });
      expect(result.success).toBe(true);
    });

    it('should fail if email is empty', () => {
      const result = SigninFormSchema.safeParse({
        email: '',
        password: 'Password123!'
      });
      expect(result.success).toBe(false);
    });

    it('should fail if password is empty', () => {
      const result = SigninFormSchema.safeParse({
        email: 'test@example.com',
        password: ''
      });
      expect(result.success).toBe(false);
    });
  });
});
