'use client';

import { useActionState } from 'react';
import { signin } from '@/src/lib/actions';
import Link from 'next/link';

export default function SignInPage() {
  const [state, action, pending] = useActionState(signin, undefined);

  return (
    <>
      <div className="text-center mb-10 -mt-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Welcome back!</h1>
        <p className="text-slate-500 text-sm">We're so glad to see you again.</p>
      </div>

      <form action={action} className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-emerald-50/50 space-y-5">
        {state?.message && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm border border-red-100">
            {state.message}
          </div>
        )}
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">Email</label>
          <input 
            type="email" 
            name="email"
            required
            className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 rounded-2xl px-5 py-3.5 text-slate-900 placeholder-slate-400 outline-none transition-all"
            placeholder="hello@example.com"
          />
          {state?.errors?.email && (
            <p className="text-red-500 text-xs mt-1.5 ml-1">{state.errors.email[0]}</p>
          )}
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-1.5 ml-1 pr-1">
            <label className="block text-sm font-medium text-slate-700">Password</label>
            <Link href="#" className="text-xs font-medium text-emerald-600 hover:text-emerald-700">Forgot?</Link>
          </div>
          <input 
            type="password" 
            name="password"
            required
            className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 rounded-2xl px-5 py-3.5 text-slate-900 placeholder-slate-400 outline-none transition-all"
            placeholder="••••••••"
          />
          {state?.errors?.password && (
            <p className="text-red-500 text-xs mt-1.5 ml-1">{state.errors.password[0]}</p>
          )}
        </div>

        <div className="pt-2">
          <button 
            disabled={pending}
            className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-70 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-2xl shadow-lg shadow-emerald-500/25 transition-all hover:shadow-emerald-500/40 hover:-translate-y-0.5 active:translate-y-0 active:shadow-emerald-500/20"
          >
            {pending ? 'Signing in...' : 'Sign In'}
          </button>
        </div>
      </form>

      <p className="mt-8 text-center text-sm font-medium text-slate-600">
        New to PRODUCT LIST?
        <Link href="/signup" className="ml-2 text-emerald-600 hover:text-emerald-700 transition-colors focus:outline-none">
          Create an account
        </Link>
      </p>
    </>
  );
}
