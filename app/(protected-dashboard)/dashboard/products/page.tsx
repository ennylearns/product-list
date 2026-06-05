import { getProducts } from '@/src/lib/actions/product';
import Link from 'next/link';

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Products</h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">Manage your store catalog and inventory.</p>
        </div>
        <Link 
          href="/dashboard/products/new"
          className="inline-flex items-center justify-center bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2.5 px-6 rounded-xl transition-all shadow-md shadow-emerald-500/20 active:scale-95 hover:-translate-y-0.5"
        >
          <svg className="w-5 h-5 mr-2 -ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Product
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="bg-white border border-slate-200 border-dashed rounded-xl p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4 ring-8 ring-slate-50">
            <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">No products found</h3>
          <p className="text-slate-500 max-w-sm mb-6 leading-relaxed">
            Your catalog is currently empty. Start adding products to showcase them to your customers.
          </p>
          <Link 
            href="/dashboard/products/new"
            className="inline-flex items-center text-sm font-semibold text-slate-900 hover:text-emerald-600 transition-colors"
          >
            Create your first product
            <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div 
              key={product.id} 
              className="group bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-xl hover:shadow-slate-200/50 hover:border-slate-300 transition-all duration-300 flex flex-col"
            >
              <div className="aspect-square bg-slate-100 relative border-b border-slate-100 group-hover:bg-slate-200 transition-colors">
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-12 h-12 text-slate-300 group-hover:text-slate-400 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                {product.inStock ? (
                  <span className="absolute top-3 right-3 bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-md border border-emerald-200 shadow-sm backdrop-blur-sm">
                    In Stock
                  </span>
                ) : (
                  <span className="absolute top-3 right-3 bg-rose-100 text-rose-800 text-xs font-bold px-2.5 py-1 rounded-md border border-rose-200 shadow-sm backdrop-blur-sm">
                    Out of Stock
                  </span>
                )}
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-lg font-bold text-slate-900 truncate tracking-tight">{product.name}</h3>
                <p className="text-slate-500 text-sm mt-1 line-clamp-2 leading-relaxed flex-1">
                  {product.description || 'No description provided.'}
                </p>
                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-lg font-black text-slate-900 tracking-tight">
                    ₦{(product.price / 100).toFixed(2)}
                  </span>
                  <button className="text-slate-400 hover:text-emerald-600 transition-colors p-2 -mr-2 rounded-lg hover:bg-emerald-50 active:bg-emerald-100">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
