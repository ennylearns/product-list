import { describe, it, expect, vi, beforeEach } from 'vitest';
import bcrypt from 'bcryptjs';

// We mock next-auth
vi.mock('next-auth', () => ({
  default: vi.fn(() => ({
    handlers: {},
    auth: vi.fn(),
    signIn: vi.fn(),
    signOut: vi.fn(),
  }))
}));

vi.mock('next-auth/providers/credentials', () => ({
  default: vi.fn()
}));

// We mock db to prevent real DB queries during unit testing
vi.mock('@/db', () => ({

  db: {
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
  }
}));

// We mock bcryptjs
vi.mock('bcryptjs', () => ({
  default: {
    compare: vi.fn(),
  }
}));

import { db } from '@/src/db';
import { authorize } from '../auth';

describe('Auth Authorize Callback', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return user if email exists and password matches', async () => {
    // Mock user found in DB
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      hashedPassword: 'hashed_password',
    };
    
    // Setup Drizzle mock chain to return our mock user
    const limitMock = vi.fn().mockResolvedValue([mockUser]);
    const whereMock = vi.fn().mockReturnValue({ limit: limitMock });
    const fromMock = vi.fn().mockReturnValue({ where: whereMock });
    const selectMock = vi.fn().mockReturnValue({ from: fromMock });
    
    (db.select as any).mockImplementation(selectMock);
    
    // Mock password match
    (bcrypt.compare as any).mockResolvedValue(true);

    const result = await authorize({ email: 'test@example.com', password: 'password123' });

    expect(result).toEqual({ id: '1', email: 'test@example.com' });
    expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashed_password');
  });

  it('should return null if user does not exist', async () => {
    // Setup Drizzle mock chain to return empty array
    const limitMock = vi.fn().mockResolvedValue([]);
    const whereMock = vi.fn().mockReturnValue({ limit: limitMock });
    const fromMock = vi.fn().mockReturnValue({ where: whereMock });
    const selectMock = vi.fn().mockReturnValue({ from: fromMock });
    
    (db.select as any).mockImplementation(selectMock);

    const result = await authorize({ email: 'nonexistent@example.com', password: 'password123' });

    expect(result).toBeNull();
    expect(bcrypt.compare).not.toHaveBeenCalled();
  });

  it('should return null if password does not match', async () => {
    // Mock user found in DB
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      hashedPassword: 'hashed_password',
    };
    
    const limitMock = vi.fn().mockResolvedValue([mockUser]);
    const whereMock = vi.fn().mockReturnValue({ limit: limitMock });
    const fromMock = vi.fn().mockReturnValue({ where: whereMock });
    const selectMock = vi.fn().mockReturnValue({ from: fromMock });
    
    (db.select as any).mockImplementation(selectMock);
    
    // Mock password mismatch
    (bcrypt.compare as any).mockResolvedValue(false);

    const result = await authorize({ email: 'test@example.com', password: 'wrongpassword' });

    expect(result).toBeNull();
  });
});
