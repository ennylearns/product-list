import { getProducts } from '@/src/lib/actions/product';
import Link from 'next/link';
import { ProductCardActions } from '@/src/components/products/product-card-actions';

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link href="/dashboard" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 mb-3 transition-colors group">
            <svg className="w-4 h-4 mr-1.5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </Link>
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {products.map((product) => (
            <div 
              key={product.id} 
              className="group bg-white border border-slate-200 rounded-xl hover:shadow-xl hover:shadow-slate-200/50 hover:border-slate-300 transition-all duration-300 flex flex-col relative"
            >
              <div className="aspect-square bg-slate-100 relative border-b border-slate-100 group-hover:bg-slate-200 transition-colors rounded-t-xl overflow-hidden">
                {product.media && product.media.length > 0 ? (
                  product.media[0].endsWith('.mp4') || product.media[0].endsWith('.webm') ? (
                    <video 
                      src={product.media[0]} 
                      autoPlay 
                      muted 
                      loop 
                      playsInline 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <img 
                      src={product.media[0]} 
                      alt={product.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  )
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-12 h-12 text-slate-300 group-hover:text-slate-400 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                
                {product.inStock ? (
                  <span className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-emerald-100 text-emerald-800 text-[10px] sm:text-xs font-bold px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-md border border-emerald-200 shadow-sm backdrop-blur-sm z-10">
                    In Stock
                  </span>
                ) : (
                  <span className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-rose-100 text-rose-800 text-[10px] sm:text-xs font-bold px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-md border border-rose-200 shadow-sm backdrop-blur-sm z-10">
                    Out of Stock
                  </span>
                )}
              </div>
              <div className="p-3 sm:p-5 flex-1 flex flex-col rounded-b-xl">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 truncate tracking-tight">
                  <Link href={`/dashboard/products/${product.id}/edit`} className="focus:outline-none">
                    <span className="absolute inset-0 z-0" aria-hidden="true" />
                    {product.name}
                  </Link>
                </h3>
                <p className="text-slate-500 text-xs sm:text-sm mt-1 line-clamp-2 leading-relaxed flex-1 relative z-10 pointer-events-none">
                  {product.description || 'No description provided.'}
                </p>
                <div className="mt-3 pt-3 sm:mt-4 sm:pt-4 border-t border-slate-100 flex items-center justify-between relative z-10">
                  <span className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                    ₦{(product.price / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  <ProductCardActions productId={product.id} inStock={product.inStock} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
