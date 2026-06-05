import { auth } from '@/src/lib/auth';
import { signout } from '@/src/lib/actions';

export default async function DashboardPage() {
  const session = await auth();

  return (
    <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm max-w-2xl mx-auto mt-10">
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Welcome to your Dashboard</h1>
      <p className="text-slate-500 mb-8">
        You are authenticated as <strong className="text-slate-800">{session?.user?.email}</strong>.
      </p>
      
      <form action={signout}>
        <button className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition-colors">
          Sign Out
        </button>
      </form>
    </div>
  );
}
