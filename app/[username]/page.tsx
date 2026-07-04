import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getStorefrontData } from '@/src/lib/data/storefront';
import { formatPrice } from '@/src/lib/formatters';
// Since the Next.js router params are asynchronous in later Next.js 15+ versions, 
// we should define the Page component appropriately. Next.js 15 allows `params` to be a Promise.
// But based on package.json, we are on Next 15 (next 16 doesn't exist, it said 16.2.7 in package.json? Wait, package.json says "next": "16.2.7"? 15.x is current, maybe it's a futuristic version. Let's use standard Next.js async page syntax).

type Props = {
  params: Promise<{ username: string }>;
};

export default async function StorefrontPage({ params }: Props) {
  const { username } = await params;
  const data = await getStorefrontData(username);

  if (!data) {
    notFound();
  }

  const { store, products } = data;

  return (
    <div className="min-h-screen bg-brand-offwhite text-brand-ink selection:bg-brand-green selection:text-brand-offwhite">
      {/* Decorative top border */}
      <div className="h-1.5 w-full bg-brand-green"></div>

      <main className="mx-auto max-w-7xl px-6 pt-8 pb-16 md:pt-12 md:pb-24 lg:px-8">
        {/* Header Section */}
        <header className="mb-8 md:mb-12 max-w-3xl overflow-hidden">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-tight mb-8 leading-tight text-brand-green truncate">
            {store.name}
          </h1>
          {store.description && (
            <p className="text-lg md:text-xl leading-relaxed text-brand-ink max-w-xl font-light">
              {store.description}
            </p>
          )}
        </header>

        {/* Product Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-8 md:gap-y-12">
          {products.length === 0 ? (
            <div className="col-span-full py-20 text-center text-stone-500 font-light text-lg">
              No pieces currently available.
            </div>
          ) : (
            products.map((product) => {
              const hasImage = product.media && product.media.length > 0;
              const imageUrl = hasImage ? product.media[0] : '';
              const isVideoMedia = hasImage && (imageUrl.toLowerCase().endsWith('.mp4') || imageUrl.toLowerCase().endsWith('.webm'));
              const priceFormatted = formatPrice(product.price, store.currency || 'NGN');

              return (
                <Link
                  key={product.id}
                  href={`/${username}/products/${product.id}`}
                  className="group flex flex-col block transition-all duration-300 md:hover:-translate-y-1 p-2 md:p-3 rounded-2xl border border-brand-green/15 md:border-transparent md:hover:border-brand-green/15 bg-white md:bg-transparent md:hover:bg-white"
                >
                  <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl md:rounded-none bg-brand-offwhite mb-6 flex items-center justify-center border border-brand-green/10 transition-shadow duration-300 group-hover:shadow-xl">
                    {hasImage ? (
                      isVideoMedia ? (
                        <video
                          src={imageUrl}
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105"
                        />
                      ) : (
                        <Image
                          src={imageUrl}
                          alt={product.name}
                          fill
                          className="object-cover object-center transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105"
                          sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        />
                      )
                    ) : (
                      <svg className="w-16 h-16 text-[#D4D4D4] transition-colors duration-700 group-hover:text-[#A3A3A3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    )}
                    
                    {/* Out of stock badge */}
                    {!product.inStock && (
                      <div className="absolute top-4 left-4 z-10">
                        <div className="bg-brand-ink text-white text-xs uppercase tracking-widest px-3 py-1.5 font-medium">
                          Out of Stock
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    <h3 className="text-base md:text-lg font-medium leading-tight group-hover:text-brand-green transition-colors text-brand-ink">
                      {product.name}
                    </h3>
                    <p className="text-xs md:text-sm text-brand-ink/70 tracking-wide">
                      {priceFormatted}
                    </p>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-brand-green/10 mt-24 py-12 text-center text-sm text-brand-green/70 tracking-widest uppercase">
        <p>© {new Date().getFullYear()} {store.name}. All rights reserved.</p>
      </footer>
    </div>
  );
}
