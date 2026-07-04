import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getProductDetails } from '@/src/lib/data/storefront';
import { WhatsappOrderButton } from '@/src/components/whatsapp-order-button';
import { ProductMediaCarousel } from '@/src/components/products/product-media-carousel';
import { formatPrice } from '@/src/lib/formatters';

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
  const hasImages = product.media && product.media.length > 0;

  const priceFormatted = formatPrice(product.price, store.currency || 'NGN');

  return (
    <div className="min-h-screen bg-brand-offwhite text-brand-ink selection:bg-brand-green selection:text-brand-offwhite flex flex-col">
      {/* Navigation Bar */}
      <nav className="w-full px-6 py-8 md:px-12 flex items-center justify-between z-10">
        <Link
          href={`/${username}`}
          className="text-2xl md:text-3xl font-medium tracking-tight hover:opacity-70 transition-opacity text-brand-green"
        >
          {store.name}
        </Link>
        <Link
          href={`/${username}`}
          className="text-xs uppercase tracking-[0.2em] font-medium border-b border-transparent hover:border-brand-green text-brand-ink transition-colors pb-1 hover:text-brand-green"
        >
          Back to Collection
        </Link>
      </nav>

      <main className="flex-1 w-full max-w-[1600px] mx-auto px-6 md:px-12 pb-24 flex flex-col lg:flex-row gap-16 lg:gap-24 relative">

        {/* Left Column: Image Carousel */}
        <div className="w-full lg:w-3/5 xl:w-2/3 flex flex-col">
          <ProductMediaCarousel media={product.media || []} productName={product.name} />
        </div>

        {/* Right Column: Product Details (Sticky) */}
        <div className="w-full lg:w-2/5 xl:w-1/3">
          <div className="lg:sticky lg:top-24 flex flex-col pt-8 lg:pt-0">
            {/* Stock Badge */}
            <div className="mb-8">
              {product.inStock ? (
                <span className="text-xs uppercase tracking-[0.2em] text-brand-ink/70 font-medium before:content-[''] before:inline-block before:w-2 before:h-2 before:bg-brand-green-mid before:rounded-full before:mr-3 before:align-middle">
                  Available
                </span>
              ) : (
                <span className="text-xs uppercase tracking-[0.2em] text-brand-ink/70 font-medium before:content-[''] before:inline-block before:w-2 before:h-2 before:bg-brand-ink before:rounded-full before:mr-3 before:align-middle">
                  Out of Stock
                </span>
              )}
            </div>

            <h1 className="text-2xl md:text-3xl lg:text-4xl font-light leading-tight tracking-tight mb-8 text-brand-green">
              {product.name}
            </h1>

            <div className="text-xl md:text-2xl font-light text-brand-ink/80 mb-12">
              {priceFormatted}
            </div>

            <div className="h-px w-full bg-brand-green/10 mb-12"></div>

            {product.description ? (
              <div className="prose prose-stone prose-lg max-w-none text-brand-ink font-light leading-relaxed mb-16 whitespace-pre-wrap">
                <p>{product.description}</p>
              </div>
            ) : (
              <div className="text-brand-ink/60 font-light italic mb-16">
                No description provided.
              </div>
            )}

            <WhatsappOrderButton
              productName={product.name}
              productPriceFormatted={priceFormatted}
              productPriceInCents={product.price}
              storeName={store.name}
              whatsappNumber={store.whatsappNumber}
              inStock={product.inStock}
            />

          </div>
        </div>
      </main>
    </div>
  );
}
