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
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out mt-8 px-4 sm:px-0 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <h1 className={`${bricolage.className} text-3xl font-extrabold tracking-tight text-slate-900`}>
            Store Overview
          </h1>
        </div>
      </div>

      {stats.username && (
        <CopyStoreLinkBanner username={stats.username} />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Inventory Card */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 sm:p-8 border-b border-slate-100 flex-1">
            <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              Inventory Status
            </h2>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-slate-500 text-sm font-medium mb-1">Total</p>
                <p className={`${bricolage.className} text-4xl font-bold text-slate-900`}>{stats.total}</p>
              </div>
              <div>
                <p className="text-slate-500 text-sm font-medium mb-1">Active</p>
                <p className={`${bricolage.className} text-4xl font-bold text-emerald-600`}>{stats.inStock}</p>
              </div>
              <div>
                <p className="text-slate-500 text-sm font-medium mb-1">Depleted</p>
                <p className={`${bricolage.className} text-4xl font-bold text-rose-500`}>{stats.outOfStock}</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-50 p-4 sm:px-8 border-t border-slate-100 flex justify-end">
            <Link 
              href="/dashboard/products"
              className="px-6 py-2.5 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors text-sm flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              Manage Products
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Quick Links Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 flex flex-col gap-4">
          <h2 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Quick Actions
          </h2>
          <Link 
            href="/dashboard/settings"
            className="w-full px-4 py-3 bg-white text-slate-700 font-medium rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-sm flex items-center justify-between group"
          >
            Store Settings
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          {stats.username && (
            <Link 
              href={`/${stats.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full px-4 py-3 bg-slate-50 text-slate-700 font-medium rounded-lg hover:bg-slate-100 border border-slate-100 transition-colors text-sm flex items-center justify-between group"
            >
              View Storefront
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </Link>
          )}
        </div>
      </div>

      <div className="pt-8 border-t border-slate-200 flex justify-center sm:justify-start">
        <form action={signout}>
          <button className="px-5 py-2.5 bg-white border border-slate-200 text-slate-500 font-medium text-sm rounded-lg hover:bg-slate-50 hover:text-rose-600 transition-colors flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Log out
          </button>
        </form>
      </div>
    </div>
  );
}
