import { verifySession } from '@/src/lib/dal';
import { db } from '@/src/db';
import { stores } from '@/src/db/schema';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { StoreSettingsForm } from '@/src/components/store-settings-form';
import Link from 'next/link';

export default async function SettingsPage() {
  const { userId } = await verifySession();

  const userStore = await db.query.stores.findFirst({
    where: eq(stores.userId, userId),
  });

  if (!userStore) {
    redirect('/dashboard/setup');
  }

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <Link href="/dashboard" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors mb-6 group">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 group-hover:-translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Back to Dashboard
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-500 mt-1">Manage your store preferences and details.</p>
      </div>

      <StoreSettingsForm initialData={{
        name: userStore.name,
        username: userStore.username,
        whatsappNumber: userStore.whatsappNumber,
        description: userStore.description,
        currency: userStore.currency as "NGN" | "USD",
      }} />
    </div>
  );
}
