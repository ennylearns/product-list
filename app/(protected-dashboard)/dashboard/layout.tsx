import { verifySession } from '@/src/lib/dal';
import { ReactNode } from 'react';
import { db } from '@/src/db';
import { stores } from '@/src/db/schema';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  // Secure server-side check. Redirects to /auth/signin if unauthenticated.
  const { userId } = await verifySession();

  const userStore = await db.query.stores.findFirst({
    where: eq(stores.userId, userId),
  });

  if (!userStore) {
    redirect('/dashboard/setup');
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-500 rounded-full" />
            <span className="font-bold text-slate-800">Dashboard</span>
          </div>
        </div>
      </header>
      
      <main className="max-w-5xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
