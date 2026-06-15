import { verifySession } from '@/src/lib/dal';
import { getDashboardStats } from '@/src/lib/data/dashboard';
import { signout } from '@/src/lib/actions';
import Link from 'next/link';
import { Bricolage_Grotesque } from 'next/font/google';
import { CopyStoreLinkBanner } from '@/src/components/copy-store-link-banner';

const bricolage = Bricolage_Grotesque({ subsets: ['latin'], display: 'swap' });

export default async function DashboardPage() {
  const { userId } = await verifySession();
  const stats = await getDashboardStats(userId);

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out mt-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <h1 className={`${bricolage.className} text-4xl font-extrabold tracking-tight text-slate-900 mb-2 uppercase`}>
            Operations Control
          </h1>
          <p className="text-slate-600 text-lg">
            Real-time telemetry of your store&apos;s inventory status.
          </p>
        </div>
        
        <form action={signout}>
          <button className="px-5 py-2.5 bg-transparent border-2 border-slate-900 text-slate-900 font-bold uppercase tracking-wider text-sm hover:bg-slate-900 hover:text-white transition-all shadow-[4px_4px_0px_0px_#0f172a] hover:shadow-[2px_2px_0px_0px_#0f172a] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px]">
            LOG OUT
          </button>
        </form>
      </div>

      {stats.username && (
        <CopyStoreLinkBanner username={stats.username} />
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Products Card */}
        <div className="bg-emerald-400 p-5 md:p-8 border-2 border-slate-900 shadow-[6px_6px_0px_0px_#0f172a] flex flex-col justify-between aspect-auto md:aspect-square group transition-all hover:-translate-y-1 hover:shadow-[6px_10px_0px_0px_#0f172a]">
          <h2 className="text-slate-900 font-bold uppercase tracking-widest text-sm border-b-2 border-slate-900/20 pb-4">
            Total Inventory
          </h2>
          <div className="mt-auto">
            <span className={`${bricolage.className} text-5xl md:text-8xl font-black text-slate-900 group-hover:scale-110 origin-bottom-left transition-transform inline-block`}>
              {stats.total}
            </span>
          </div>
        </div>

        {/* In Stock Card */}
        <div className="bg-amber-300 p-5 md:p-8 border-2 border-slate-900 shadow-[6px_6px_0px_0px_#0f172a] flex flex-col justify-between aspect-auto md:aspect-square group transition-all hover:-translate-y-1 hover:shadow-[6px_10px_0px_0px_#0f172a]">
          <h2 className="text-slate-900 font-bold uppercase tracking-widest text-sm border-b-2 border-slate-900/20 pb-4">
            Active / In Stock
          </h2>
          <div className="mt-auto">
            <span className={`${bricolage.className} text-5xl md:text-8xl font-black text-slate-900 group-hover:scale-110 origin-bottom-left transition-transform inline-block`}>
              {stats.inStock}
            </span>
          </div>
        </div>

        {/* Out of Stock Card */}
        <div className="bg-rose-400 p-5 md:p-8 border-2 border-slate-900 shadow-[6px_6px_0px_0px_#0f172a] flex flex-col justify-between aspect-auto md:aspect-square group transition-all hover:-translate-y-1 hover:shadow-[6px_10px_0px_0px_#0f172a]">
          <h2 className="text-slate-900 font-bold uppercase tracking-widest text-sm border-b-2 border-slate-900/20 pb-4">
            Depleted
          </h2>
          <div className="mt-auto">
            <span className={`${bricolage.className} text-5xl md:text-8xl font-black text-slate-900 group-hover:scale-110 origin-bottom-left transition-transform inline-block`}>
              {stats.outOfStock}
            </span>
          </div>
        </div>
      </div>

      <div className="pt-8 flex flex-col sm:flex-row gap-4">
        <Link 
          href="/dashboard/products"
          className="group relative inline-flex items-center justify-center w-full sm:w-auto px-8 py-5 bg-slate-900 text-white font-bold uppercase tracking-widest overflow-hidden border-2 border-slate-900 shadow-[6px_6px_0px_0px_#0f172a] hover:shadow-[2px_2px_0px_0px_#0f172a] hover:translate-x-[4px] hover:translate-y-[4px] transition-all"
        >
          <span className="relative z-10 flex items-center gap-3">
            Manage Products Database
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </span>
          <div className="absolute inset-0 h-full w-0 bg-emerald-500 transition-all duration-300 ease-out group-hover:w-full z-0"></div>
        </Link>
      </div>
    </div>
  );
}
