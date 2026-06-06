'use client';

import { useState, useTransition } from 'react';
import { deleteProduct, toggleProductStock } from '@/src/lib/actions/product';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface ProductCardActionsProps {
  productId: number;
  inStock: boolean;
}

export function ProductCardActions({ productId, inStock }: ProductCardActionsProps) {
  const [isPending, startTransition] = useTransition();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      startTransition(async () => {
        const result = await deleteProduct(productId);
        if (result.success) {
          setIsMenuOpen(false);
        } else {
          alert(result.message);
        }
      });
    }
  };

  const handleStockToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const actionText = inStock ? 'mark as out of stock' : 'mark as in stock';
    if (window.confirm(`Are you sure you want to ${actionText}?`)) {
      startTransition(async () => {
        const result = await toggleProductStock(productId, !inStock);
        if (result.success) {
          setIsMenuOpen(false);
        } else {
          alert(result.message);
        }
      });
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsMenuOpen(!isMenuOpen);
        }}
        disabled={isPending}
        className="text-slate-400 hover:text-emerald-600 transition-colors p-2 -mr-2 rounded-lg hover:bg-emerald-50 active:bg-emerald-100 disabled:opacity-50"
      >
        {isPending ? (
          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        )}
      </button>

      {isMenuOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsMenuOpen(false);
            }} 
          />
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg shadow-slate-200/50 border border-slate-100 py-1.5 z-20 animate-in fade-in zoom-in-95 duration-200">
            <Link 
              href={`/dashboard/products/${productId}/edit`}
              className="flex items-center w-full px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-emerald-600 transition-colors"
            >
              <svg className="w-4 h-4 mr-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Product
            </Link>
            
            <button 
              onClick={handleStockToggle}
              className="flex items-center w-full px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-emerald-600 transition-colors"
            >
              <svg className="w-4 h-4 mr-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {inStock ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                )}
              </svg>
              {inStock ? 'Mark Out of Stock' : 'Mark In Stock'}
            </button>
            
            <div className="h-px bg-slate-100 my-1" />
            
            <button 
              onClick={handleDelete}
              className="flex items-center w-full px-4 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors"
            >
              <svg className="w-4 h-4 mr-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete Product
            </button>
          </div>
        </>
      )}
    </div>
  );
}
