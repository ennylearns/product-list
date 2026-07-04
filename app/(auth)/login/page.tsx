'use client';

import { useActionState, useState } from 'react';
import { signin } from '@/src/lib/actions';
import Link from 'next/link';
import { SigninFormSchema } from '@/src/lib/validations';

export default function SignInPage() {
  const [state, action, pending] = useActionState(signin, undefined);
  
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [touched, setTouched] = useState({ email: false, password: false });
  const [errors, setErrors] = useState<{ email?: string[]; password?: string[] }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name as 'email' | 'password';
    const value = e.target.value;
    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);
    
    if (touched[name]) {
      const result = SigninFormSchema.safeParse(newFormData);
      
      if (!result.success) {
        const fieldErrors = result.error.flatten().fieldErrors;
        setErrors(prev => ({ ...prev, [name]: fieldErrors[name as keyof typeof fieldErrors] }));
      } else {
        setErrors({});
      }
    } else {
      if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: undefined }));
      }
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const name = e.target.name as 'email' | 'password';
    setTouched(prev => ({ ...prev, [name]: true }));
    
    const result = SigninFormSchema.safeParse(formData);
    
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors(prev => ({ ...prev, [name]: fieldErrors[name as keyof typeof fieldErrors] }));
    } else {
      setErrors({});
    }
  };

  const getFieldState = (fieldName: 'email' | 'password') => {
    const isTouched = touched[fieldName];
    const clientError = errors[fieldName]?.[0];
    const serverError = state?.errors?.[fieldName]?.[0];
    const error = clientError || serverError;
    const value = formData[fieldName];
    const isValid = isTouched && !error && value.trim().length > 0;
    
    return { error, isValid, isTouched };
  };

  const emailState = getFieldState('email');
  const passwordState = getFieldState('password');

  return (
    <>
      <div className="text-center mb-10 -mt-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Welcome back!</h1>
        <p className="text-slate-500 text-sm">We're so glad to see you again.</p>
      </div>

      <form action={action} className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-emerald-50/50 space-y-5">
        {state?.message && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm border border-red-100 flex items-start gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mt-0.5 shrink-0">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
            </svg>
            <span>{state.message}</span>
          </div>
        )}
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">Email</label>
          <div className="relative">
            <input 
              type="email" 
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full bg-slate-50 border focus:ring-4 rounded-2xl px-5 py-3.5 text-slate-900 placeholder-slate-400 outline-none transition-all pr-12
                ${emailState.error 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10' 
                  : emailState.isValid 
                    ? 'border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500/10' 
                    : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/10'}`}
              placeholder="hello@example.com"
            />
            {emailState.isValid && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                <svg className="w-5 h-5 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                </svg>
              </div>
            )}
            {emailState.error && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                <svg className="w-5 h-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
          {emailState.error && (
            <p className="text-red-500 text-xs mt-1.5 ml-1 font-medium">{emailState.error}</p>
          )}
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-1.5 ml-1 pr-1">
            <label className="block text-sm font-medium text-slate-700">Password</label>
            <Link href="#" className="text-xs font-medium text-emerald-600 hover:text-emerald-700">Forgot?</Link>
          </div>
          <div className="relative">
            <input 
              type="password" 
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full bg-slate-50 border focus:ring-4 rounded-2xl px-5 py-3.5 text-slate-900 placeholder-slate-400 outline-none transition-all pr-12
                ${passwordState.error 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10' 
                  : passwordState.isValid 
                    ? 'border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500/10' 
                    : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/10'}`}
              placeholder="••••••••"
            />
            {passwordState.isValid && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                <svg className="w-5 h-5 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                </svg>
              </div>
            )}
            {passwordState.error && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                <svg className="w-5 h-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
          {passwordState.error && (
            <p className="text-red-500 text-xs mt-1.5 ml-1 font-medium">{passwordState.error}</p>
          )}
        </div>

        <div className="pt-2">
          <button 
            disabled={pending}
            className="w-full relative flex items-center justify-center bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-400 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-2xl shadow-lg shadow-emerald-500/25 transition-all hover:shadow-emerald-500/40 hover:-translate-y-0.5 active:translate-y-0 active:shadow-emerald-500/20"
          >
            {pending && (
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {pending ? 'Signing in...' : 'Sign In'}
          </button>
        </div>
      </form>

      <p className="mt-8 text-center text-sm font-medium text-slate-600">
        New to Storefront?
        <Link href="/signup" className="ml-2 text-emerald-600 hover:text-emerald-700 transition-colors focus:outline-none">
          Create an account
        </Link>
      </p>
    </>
  );
}
