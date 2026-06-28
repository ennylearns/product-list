'use client';

import { useActionState } from 'react';
import { setupStore } from '@/src/lib/actions/store';

export default function SetupPage() {
  const [state, action, pending] = useActionState(setupStore, undefined);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 py-12">
      <div className="text-center mb-10">
        <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Create your store</h1>
        <p className="text-slate-500 text-sm">Let's get your business online in seconds.</p>
      </div>

      <form action={action} className="w-full max-w-xl bg-white p-8 sm:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-emerald-50/50 space-y-6">
        {state?.message && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100 mb-6">
            {state.message}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">Store Name</label>
            <input 
              type="text" 
              name="name"
              required
              className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 rounded-2xl px-5 py-3.5 text-slate-900 placeholder-slate-400 outline-none transition-all"
              placeholder="e.g. Acme Clothing"
            />
            {state?.errors?.name && <p className="text-red-500 text-xs mt-1.5 ml-1">{state.errors.name[0]}</p>}
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">Store Username</label>
            <div className="flex bg-slate-50 border border-slate-200 focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/10 rounded-2xl overflow-hidden transition-all">
              <span className="flex items-center px-5 text-slate-500 bg-slate-100 border-r border-slate-200 select-none">
                shop.com/
              </span>
              <input 
                type="text" 
                name="username"
                required
                className="w-full bg-transparent px-5 py-3.5 text-slate-900 placeholder-slate-400 outline-none"
                placeholder="acme-clothing"
              />
            </div>
            {state?.errors?.username && <p className="text-red-500 text-xs mt-1.5 ml-1">{state.errors.username[0]}</p>}
            <p className="text-xs text-slate-500 mt-2 ml-1">This will be your unique store link.</p>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">WhatsApp Number</label>
            <input 
              type="tel" 
              name="whatsappNumber"
              required
              className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 rounded-2xl px-5 py-3.5 text-slate-900 placeholder-slate-400 outline-none transition-all"
              placeholder="+12025550123"
            />
            {state?.errors?.whatsappNumber && <p className="text-red-500 text-xs mt-1.5 ml-1">{state.errors.whatsappNumber[0]}</p>}
            <p className="text-xs text-slate-500 mt-2 ml-1">Include country code (e.g., +234)</p>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">Store Currency</label>
            <div className="relative">
              <select 
                name="currency"
                required
                className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 rounded-2xl px-5 py-3.5 text-slate-900 outline-none transition-all appearance-none cursor-pointer"
                defaultValue="NGN"
              >
                <option value="NGN">Nigerian Naira (₦)</option>
                <option value="USD">US Dollar ($)</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-5 text-slate-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
            {state?.errors?.currency && <p className="text-red-500 text-xs mt-1.5 ml-1">{state.errors.currency[0]}</p>}
            <p className="text-xs text-slate-500 mt-2 ml-1">This is the currency your customers will see.</p>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">Description (Optional)</label>
            <textarea 
              name="description"
              rows={3}
              className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 rounded-2xl px-5 py-3.5 text-slate-900 placeholder-slate-400 outline-none transition-all resize-none"
              placeholder="What do you sell?"
            />
            {state?.errors?.description && <p className="text-red-500 text-xs mt-1.5 ml-1">{state.errors.description[0]}</p>}
          </div>
        </div>

        <div className="pt-4">
          <button 
            disabled={pending}
            className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-70 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-2xl shadow-lg shadow-emerald-500/25 transition-all hover:shadow-emerald-500/40 hover:-translate-y-0.5 active:translate-y-0 active:shadow-emerald-500/20"
          >
            {pending ? 'Creating Store...' : 'Complete Setup'}
          </button>
        </div>
      </form>
    </div>
  );
}
