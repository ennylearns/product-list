'use client';

import { useActionState, useState } from 'react';
import { signup } from '@/src/lib/actions';
import Link from 'next/link';
import { SignupFormSchema } from '@/src/lib/validations';

export default function SignUpPage() {
  const [state, action, pending] = useActionState(signup, undefined);

  const [formData, setFormData] = useState({ email: '', password: '', confirmPassword: '' });
  const [touched, setTouched] = useState({ email: false, password: false, confirmPassword: false });
  const [errors, setErrors] = useState<{ email?: string[]; password?: string[]; confirmPassword?: string[] }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);
    
    if (touched[name as keyof typeof touched]) {
      const result = SignupFormSchema.safeParse(newFormData);
      
      if (!result.success) {
        const fieldErrors = result.error.flatten().fieldErrors;
        setErrors(prev => ({ 
          ...prev, 
          [name]: fieldErrors[name as keyof typeof fieldErrors] 
        }));
        
        if (name === 'password' && touched.confirmPassword) {
           setErrors(prev => ({ ...prev, confirmPassword: fieldErrors.confirmPassword }));
        }
      } else {
        setErrors({});
      }
    } else {
      if (errors[name as keyof typeof errors]) {
        setErrors(prev => ({ ...prev, [name]: undefined }));
      }
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    // Validate the entire form data because of the .refine for confirmPassword
    const result = SignupFormSchema.safeParse(formData);
    
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors(prev => ({ 
        ...prev, 
        [name]: fieldErrors[name as keyof typeof fieldErrors] 
      }));
      
      // If we're blurring password and confirmPassword was already touched, 
      // we should update its error state too, because they depend on each other.
      if (name === 'password' && touched.confirmPassword) {
         setErrors(prev => ({ ...prev, confirmPassword: fieldErrors.confirmPassword }));
      }
    } else {
      setErrors({});
    }
  };

  const getFieldState = (fieldName: 'email' | 'password' | 'confirmPassword') => {
    const isTouched = touched[fieldName];
    const clientError = errors[fieldName];
    const serverError = state?.errors?.[fieldName];
    const errorList = clientError || serverError;
    const value = formData[fieldName];
    const isValid = isTouched && !errorList?.length && value.trim().length > 0;
    
    return { errors: errorList, isValid, isTouched };
  };

  const emailState = getFieldState('email');
  const passwordState = getFieldState('password');
  const confirmPasswordState = getFieldState('confirmPassword');

  return (
    <>
      <div className="text-center mb-10 -mt-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Welcome to Storefront</h1>
        <p className="text-slate-500 text-sm">Let's set up your new storefront.</p>
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
                ${emailState.errors?.length 
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
            {emailState.errors && emailState.errors.length > 0 && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                <svg className="w-5 h-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
          {emailState.errors && emailState.errors.length > 0 && (
            <p className="text-red-500 text-xs mt-1.5 ml-1 font-medium">{emailState.errors[0]}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">Password</label>
          <div className="relative">
            <input 
              type="password" 
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full bg-slate-50 border focus:ring-4 rounded-2xl px-5 py-3.5 text-slate-900 placeholder-slate-400 outline-none transition-all pr-12
                ${passwordState.errors?.length 
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
            {passwordState.errors && passwordState.errors.length > 0 && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                <svg className="w-5 h-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
          {passwordState.errors && passwordState.errors.length > 0 && (
            <div className="mt-1.5 ml-1 space-y-1">
              {passwordState.errors.map((err, i) => (
                <p key={i} className="text-red-500 text-xs font-medium">{err}</p>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">Confirm Password</label>
          <div className="relative">
            <input 
              type="password" 
              name="confirmPassword"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full bg-slate-50 border focus:ring-4 rounded-2xl px-5 py-3.5 text-slate-900 placeholder-slate-400 outline-none transition-all pr-12
                ${confirmPasswordState.errors?.length 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10' 
                  : confirmPasswordState.isValid 
                    ? 'border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500/10' 
                    : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/10'}`}
              placeholder="••••••••"
            />
            {confirmPasswordState.isValid && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                <svg className="w-5 h-5 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                </svg>
              </div>
            )}
            {confirmPasswordState.errors && confirmPasswordState.errors.length > 0 && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                <svg className="w-5 h-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
          {confirmPasswordState.errors && confirmPasswordState.errors.length > 0 && (
            <p className="text-red-500 text-xs mt-1.5 ml-1 font-medium">{confirmPasswordState.errors[0]}</p>
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
            {pending ? 'Creating Account...' : 'Create Account'}
          </button>
        </div>
      </form>

      <p className="mt-8 text-center text-sm font-medium text-slate-600">
        Already selling with us?
        <Link href="/login" className="ml-2 text-emerald-600 hover:text-emerald-700 transition-colors focus:outline-none">
          Sign in instead
        </Link>
      </p>
    </>
  );
}
