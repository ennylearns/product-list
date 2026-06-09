import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest, NextResponse } from 'next/server';

// Mock cookies
const getCookieMock = vi.fn();
vi.mock('next/headers', () => ({
  cookies: vi.fn(() => ({
    get: getCookieMock,
  }))
}));

// Mock NextRequest and NextResponse
vi.mock('next/server', () => {
  class MockNextRequest {
    nextUrl: { pathname: string };
    url: string;
    cookies: { has: (name: string) => boolean };
    constructor(url: string) {
      this.url = url;
      const parsedUrl = new URL(url);
      this.nextUrl = { pathname: parsedUrl.pathname };
      this.cookies = {
        has: getCookieMock
      };
    }
  }

  return {
    NextRequest: MockNextRequest,
    NextResponse: {
      redirect: vi.fn((url) => ({ status: 307, url: url.toString() })),
      next: vi.fn(() => ({ status: 200 })),
    }
  };
});

import { proxy } from '../../proxy';

describe('Proxy', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should redirect unauthenticated users away from protected routes', async () => {
    getCookieMock.mockReturnValue(false); // No authjs session token
    
    const request = new NextRequest('http://localhost:3000/dashboard/settings');
    const response = await proxy(request as any);
    
    expect(NextResponse.redirect).toHaveBeenCalled();
    const urlStr = (NextResponse.redirect as any).mock.calls[0][0].toString();
    expect(urlStr).toContain('/login');
  });

  it('should redirect authenticated users away from auth routes', async () => {
    getCookieMock.mockReturnValue(true); // Has authjs session token
    
    const request = new NextRequest('http://localhost:3000/login');
    const response = await proxy(request as any);
    
    expect(NextResponse.redirect).toHaveBeenCalled();
    const urlStr = (NextResponse.redirect as any).mock.calls[0][0].toString();
    expect(urlStr).toContain('/dashboard');
  });

  it('should allow authenticated users to access protected routes', async () => {
    getCookieMock.mockReturnValue(true); // Has authjs session token
    
    const request = new NextRequest('http://localhost:3000/dashboard/settings');
    const response = await proxy(request as any);
    
    expect(NextResponse.next).toHaveBeenCalled();
    expect(NextResponse.redirect).not.toHaveBeenCalled();
  });

  it('should allow unauthenticated users to access public routes', async () => {
    getCookieMock.mockReturnValue(false); // No authjs session token
    
    const request = new NextRequest('http://localhost:3000/');
    const response = await proxy(request as any);
    
    expect(NextResponse.next).toHaveBeenCalled();
    expect(NextResponse.redirect).not.toHaveBeenCalled();
  });
});
