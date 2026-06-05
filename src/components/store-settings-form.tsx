'use client';

import { useActionState } from 'react';
import { updateStore } from '@/src/lib/actions/store';
import { StoreInput } from '@/src/lib/validations/store';

export function StoreSettingsForm({ initialData }: { initialData: StoreInput }) {
  const [state, action, pending] = useActionState(updateStore, undefined);

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
