'use client';

import { useActionState, useState } from 'react';
import { updateStore } from '@/src/lib/actions/store';
import { StoreInput } from '@/src/lib/validations/store';

export function StoreSettingsForm({ initialData }: { initialData: StoreInput }) {
  const [state, action, pending] = useActionState(updateStore, undefined);
  const [selectedCurrency, setSelectedCurrency] = useState(initialData.currency || 'NGN');

  return (
    <form action={action} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 space-y-6 max-w-2xl">
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-1">Store Details</h2>
        <p className="text-slate-500 text-sm mb-6">Update your store information.</p>
      </div>

      {state?.message && (
        <div className={`p-4 rounded-xl text-sm border ${state.success ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
          {state.message}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">Store Name</label>
        <input
          type="text"
          name="name"
          defaultValue={initialData.name}
          className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 rounded-2xl px-5 py-3 text-slate-900 placeholder-slate-400 outline-none transition-all"
        />
        {state?.errors?.name && (
          <p className="text-red-500 text-xs mt-1.5 ml-1">{state.errors.name[0]}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">Store Username</label>
        <div className="flex bg-slate-50 border border-slate-200 focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/10 rounded-2xl overflow-hidden transition-all">
          <span className="flex items-center px-4 text-slate-500 bg-slate-100 border-r border-slate-200 select-none">
            shop.com/
          </span>
          <input
            type="text"
            name="username"
            defaultValue={initialData.username}
            className="w-full bg-transparent px-4 py-3 text-slate-900 placeholder-slate-400 outline-none"
          />
        </div>
        {state?.errors?.username && (
          <p className="text-red-500 text-xs mt-1.5 ml-1">{state.errors.username[0]}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">WhatsApp Number</label>
        <input
          type="tel"
          name="whatsappNumber"
          defaultValue={initialData.whatsappNumber}
          className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 rounded-2xl px-5 py-3 text-slate-900 placeholder-slate-400 outline-none transition-all"
        />
        {state?.errors?.whatsappNumber && (
          <p className="text-red-500 text-xs mt-1.5 ml-1">{state.errors.whatsappNumber[0]}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">Description</label>
        <textarea
          name="description"
          rows={4}
          defaultValue={initialData.description || ''}
          className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 rounded-2xl px-5 py-3 text-slate-900 placeholder-slate-400 outline-none transition-all resize-none"
        />
        {state?.errors?.description && (
          <p className="text-red-500 text-xs mt-1.5 ml-1">{state.errors.description[0]}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">Store Currency</label>
        <select
          name="currency"
          value={selectedCurrency}
          onChange={(e) => setSelectedCurrency(e.target.value as 'NGN' | 'USD')}
          className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 rounded-2xl px-5 py-3 text-slate-900 outline-none transition-all appearance-none cursor-pointer"
        >
          <option value="NGN">Nigerian Naira (₦)</option>
          <option value="USD">US Dollar ($)</option>
        </select>
        {state?.errors?.currency && (
          <p className="text-red-500 text-xs mt-1.5 ml-1">{state.errors.currency[0]}</p>
        )}
        
        {selectedCurrency !== initialData.currency && (
          <div className="mt-3 p-4 rounded-xl text-sm bg-amber-50 text-amber-800 border border-amber-200 shadow-sm flex items-start gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742-2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <strong className="font-semibold block mb-1">Warning: No Automatic Conversion</strong>
              Changing your store currency will NOT automatically convert your existing product prices. Your product prices will remain at their current numerical values but will be displayed in the new currency.
            </div>
          </div>
        )}
      </div>

      <div className="pt-2">
        <button
          disabled={pending}
          className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-70 disabled:cursor-not-allowed text-white font-semibold px-8 py-3 rounded-xl shadow-md shadow-emerald-500/20 transition-all hover:-translate-y-0.5"
        >
          {pending ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}
