import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getProductDetails } from '@/src/lib/data/storefront';

type Props = {
  params: Promise<{ username: string; productId: string }>;
};

export default async function ProductDetailPage({ params }: Props) {
  const { username, productId } = await params;
  const id = parseInt(productId, 10);
  
  if (isNaN(id)) {
    notFound();
  }

  const data = await getProductDetails(username, id);

  if (!data) {
    notFound();
  }

  const { store, product } = data;
  const hasImages = product.images && product.images.length > 0;
  
  const priceFormatted = new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
  }).format(product.price / 100);

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1A1A1A] selection:bg-[#1A1A1A] selection:text-[#FDFBF7] flex flex-col">
      {/* Navigation Bar */}
      <nav className="w-full px-6 py-8 md:px-12 flex items-center justify-between z-10">
        <Link 
          href={`/${username}`}
          className="text-2xl md:text-3xl font-medium tracking-tight hover:opacity-70 transition-opacity"
        >
          {store.name}
        </Link>
        <Link 
          href={`/${username}`}
          className="text-xs uppercase tracking-[0.2em] font-medium border-b border-transparent hover:border-[#1A1A1A] transition-colors pb-1"
        >
          Back to Collection
        </Link>
      </nav>

      <main className="flex-1 w-full max-w-[1600px] mx-auto px-6 md:px-12 pb-24 flex flex-col lg:flex-row gap-16 lg:gap-24 relative">
        
        {/* Left Column: Image Stack (Editorial Style) */}
        <div className="w-full lg:w-3/5 xl:w-2/3 flex flex-col space-y-4 md:space-y-8">
          {hasImages ? (
            product.images.map((img, idx) => (
              <div key={idx} className="relative w-full aspect-[4/5] md:aspect-auto md:min-h-[80vh] bg-[#F5F5F5]">
                <Image
                  src={img}
                  alt={`${product.name} - View ${idx + 1}`}
                  fill
                  className="object-cover object-center"
                  sizes="(min-width: 1024px) 66vw, 100vw"
                  priority={idx === 0}
                />
              </div>
            ))
          ) : (
            <div className="relative w-full aspect-[4/5] md:min-h-[80vh] bg-[#F5F5F5] flex items-center justify-center border border-[#E5E5E5]">
               <svg className="w-24 h-24 text-[#D4D4D4]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            </div>
          )}
        </div>

        {/* Right Column: Product Details (Sticky) */}
        <div className="w-full lg:w-2/5 xl:w-1/3">
          <div className="lg:sticky lg:top-24 flex flex-col pt-8 lg:pt-0">
            {/* Stock Badge */}
            <div className="mb-8">
              {product.inStock ? (
                <span className="text-xs uppercase tracking-[0.2em] text-[#666666] font-medium before:content-[''] before:inline-block before:w-2 before:h-2 before:bg-green-800 before:rounded-full before:mr-3 before:align-middle">
                  Available
                </span>
              ) : (
                <span className="text-xs uppercase tracking-[0.2em] text-[#666666] font-medium before:content-[''] before:inline-block before:w-2 before:h-2 before:bg-[#1A1A1A] before:rounded-full before:mr-3 before:align-middle">
                  Out of Stock
                </span>
              )}
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-light leading-[0.9] tracking-tight mb-8">
              {product.name}
            </h1>

            <div className="text-xl md:text-2xl font-light text-[#4A4A4A] mb-12">
              {priceFormatted}
            </div>

            <div className="h-px w-full bg-[#E5E5E5] mb-12"></div>

            {product.description ? (
              <div className="prose prose-stone prose-lg max-w-none text-[#4A4A4A] font-light leading-relaxed mb-16 whitespace-pre-wrap">
                <p>{product.description}</p>
              </div>
            ) : (
              <div className="text-[#888888] font-light italic mb-16">
                No description provided.
              </div>
            )}

            <button 
              disabled={!product.inStock}
              className={`w-full py-5 px-8 text-sm uppercase tracking-[0.2em] font-medium transition-all duration-500
                ${product.inStock 
                  ? 'bg-[#1A1A1A] text-white hover:bg-[#333333]' 
                  : 'bg-[#E5E5E5] text-[#A3A3A3] cursor-not-allowed'}`}
            >
              {product.inStock ? 'Inquire' : 'Unavailable'}
            </button>
            
            {/* Meta details */}
            <div className="mt-16 space-y-6 text-sm text-[#666666]">
              <div className="flex justify-between border-b border-[#E5E5E5] pb-4">
                <span className="uppercase tracking-widest text-xs">Origin</span>
                <span className="font-medium">{store.name}</span>
              </div>
              <div className="flex justify-between border-b border-[#E5E5E5] pb-4">
                <span className="uppercase tracking-widest text-xs">Reference</span>
                <span className="font-medium">#{product.id.toString().padStart(4, '0')}</span>
              </div>
            </div>
            
          </div>
        </div>
      </main>
    </div>
  );
}
