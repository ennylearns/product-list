import { verifySession } from '@/src/lib/dal';
import { db } from '@/src/db';
import { stores } from '@/src/db/schema';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { StoreSettingsForm } from '@/src/components/store-settings-form';

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
