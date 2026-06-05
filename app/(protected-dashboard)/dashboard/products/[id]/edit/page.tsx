import { db } from '@/src/db';
import { products, stores } from '@/src/db/schema';
import { eq, and } from 'drizzle-orm';
import { verifySession } from '@/src/lib/dal';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { updateProduct } from '@/src/lib/actions/product';
import { ProductForm } from '@/src/components/products/product-form';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const productId = parseInt(id, 10);

  if (isNaN(productId)) {
    notFound();
  }

  const session = await verifySession();
  if (!session?.userId) {
    redirect('/auth/signin');
  }

  const currentStore = await db.query.stores.findFirst({
    where: eq(stores.userId, session.userId),
  });

  if (!currentStore) {
    redirect('/dashboard');
  }

  const product = await db.query.products.findFirst({
    where: and(eq(products.id, productId), eq(products.storeId, currentStore.id)),
  });

  if (!product) {
    notFound();
  }

  const updateProductWithId = updateProduct.bind(null, productId);

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <Link 
          href="/dashboard/products" 
          className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-6"
        >
          <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Products
        </Link>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Edit Product</h1>
        <p className="text-slate-500 mt-2 leading-relaxed">
          Make changes to your product details.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden relative">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-slate-800 to-slate-900" />
        <div className="p-6 sm:p-10">
          <ProductForm 
            initialData={product} 
            action={updateProductWithId} 
            submitLabel="Save Changes" 
          />
        </div>
      </div>
    </div>
  );
}
