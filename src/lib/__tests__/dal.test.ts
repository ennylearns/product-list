import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('server-only', () => ({}));

vi.mock('react', () => ({

  cache: vi.fn((fn) => fn),
}));

vi.mock('next/navigation', () => ({
  redirect: vi.fn(() => { throw new Error('REDIRECT') }),
}));

vi.mock('../auth', () => ({
  auth: vi.fn(),
}));

import { verifySession } from '../dal';
import { auth } from '../auth';
import { redirect } from 'next/navigation';

describe('verifySession', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should redirect if no session', async () => {
    (auth as any).mockResolvedValue(null);

    await expect(verifySession()).rejects.toThrow('REDIRECT');
    expect(redirect).toHaveBeenCalledWith('/auth/signin');
  });

  it('should redirect if no user in session', async () => {
    (auth as any).mockResolvedValue({ user: null });

    await expect(verifySession()).rejects.toThrow('REDIRECT');
    expect(redirect).toHaveBeenCalledWith('/auth/signin');
  });

  it('should redirect if no userId in session', async () => {
    (auth as any).mockResolvedValue({ user: { id: undefined } });

    await expect(verifySession()).rejects.toThrow('REDIRECT');
    expect(redirect).toHaveBeenCalledWith('/auth/signin');
  });

  it('should return session info if user is authenticated', async () => {
    (auth as any).mockResolvedValue({ user: { id: 'user_123' } });

    const result = await verifySession();

    expect(redirect).not.toHaveBeenCalled();
    expect(result).toEqual({ isAuth: true, userId: 'user_123' });
  });
});
