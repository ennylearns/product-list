'use client';

import { useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { ProductFormState } from '@/src/lib/validations/product';
import { MediaUpload } from '@/src/components/products/media-upload';

interface ProductFormProps {
  initialData?: {
    id: number;
    name: string;
    description: string | null;
    price: number; // in cents
    media: string[];
    inStock: boolean;
  };
  action: (prevState: ProductFormState, formData: FormData) => Promise<ProductFormState>;
  submitLabel?: string;
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full sm:w-auto inline-flex items-center justify-center bg-emerald-500 hover:bg-emerald-600 disabled:opacity-70 disabled:cursor-not-allowed text-white font-semibold py-3 px-8 rounded-xl transition-all shadow-md shadow-emerald-500/20 active:scale-95"
    >
      {pending ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Saving...
        </>
      ) : (
        label
      )}
    </button>
  );
}

export function ProductForm({ initialData, action, submitLabel = 'Save Product' }: ProductFormProps) {
  const initialState: ProductFormState = { message: '', errors: {} };
  const [state, formAction] = useActionState(action, initialState);
  
  // Local state for stock toggle
  const [inStock, setInStock] = useState(initialData ? initialData.inStock : true);

  return (
    <form action={formAction} className="space-y-6">
      {state?.message && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl text-sm font-medium animate-in fade-in flex items-start">
          <svg className="w-5 h-5 mr-3 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {state.message}
        </div>
      )}

      <div className="space-y-1.5">
        <label htmlFor="name" className="block text-sm font-bold text-slate-700">
          Product Name <span className="text-rose-500">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          defaultValue={initialData?.name}
          placeholder="e.g., Signature Heavyweight Hoodie"
          className={`w-full px-5 py-3 rounded-2xl border ${
            state?.errors?.name ? 'border-red-300 ring-red-100' : 'border-slate-200'
          } bg-slate-50 focus:bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all`}
          required
        />
        {state?.errors?.name && (
          <p className="text-sm font-medium text-rose-500 mt-1">{state.errors.name[0]}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="price" className="block text-sm font-bold text-slate-700">
          Price (NGN) <span className="text-rose-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <span className="text-slate-500 font-bold">₦</span>
          </div>
          <input
            id="price"
            name="price"
            type="number"
            step="0.01"
            min="0"
            defaultValue={initialData ? (initialData.price / 100).toFixed(2) : undefined}
            placeholder="0.00"
            className={`w-full pl-8 pr-5 py-3 rounded-2xl border ${
              state?.errors?.price ? 'border-red-300 ring-red-100' : 'border-slate-200'
            } bg-slate-50 focus:bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all`}
            required
          />
        </div>
        {state?.errors?.price && (
          <p className="text-sm font-medium text-rose-500 mt-1">{state.errors.price[0]}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="description" className="block text-sm font-bold text-slate-700">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={initialData?.description || ''}
          placeholder="Describe the product, materials, sizing, etc."
          className={`w-full px-5 py-3 rounded-2xl border ${
            state?.errors?.description ? 'border-red-300 ring-red-100' : 'border-slate-200'
          } bg-slate-50 focus:bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all resize-none`}
        />
        {state?.errors?.description && (
          <p className="text-sm font-medium text-rose-500 mt-1">{state.errors.description[0]}</p>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-2xl">
          <div>
            <h4 className="text-sm font-bold text-slate-900">In Stock</h4>
            <p className="text-xs text-slate-500 mt-0.5">Allow customers to order this product</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              name="inStock"
              className="sr-only peer" 
              checked={inStock}
              onChange={(e) => setInStock(e.target.checked)}
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
          </label>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="block text-sm font-bold text-slate-700">
          Product Media <span className="text-slate-400 font-normal">(Optional, up to 5 items)</span>
        </label>
        <MediaUpload 
          maxFiles={5}
          maxSizeMB={5}
          error={state?.errors?.media?.[0]}
          initialMedia={initialData?.media || []}
        />
      </div>

      <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
        <SubmitButton label={submitLabel} />
      </div>
    </form>
  );
}
