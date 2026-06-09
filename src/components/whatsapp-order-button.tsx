'use client';

import { trackEvent, GA_EVENTS } from '@/src/lib/analytics';

type WhatsappOrderButtonProps = {
  productName: string;
  productPriceFormatted: string;
  productPriceInCents: number;
  storeName: string;
  whatsappNumber: string;
  inStock: boolean;
};

export function WhatsappOrderButton({
  productName,
  productPriceFormatted,
  productPriceInCents,
  storeName,
  whatsappNumber,
  inStock,
}: WhatsappOrderButtonProps) {
  if (!inStock) {
    return (
      <button
        disabled
        className="w-full py-5 px-8 text-sm uppercase tracking-[0.2em] font-medium transition-all duration-500 bg-[#E5E5E5] text-[#A3A3A3] cursor-not-allowed"
      >
        Unavailable
      </button>
    );
  }

  const handleOrderClick = () => {
    trackEvent(GA_EVENTS.WHATSAPP_ORDER_CLICK, {
      store_name: storeName,
      product_name: productName,
      price: productPriceInCents,
      in_stock: inStock,
    });

    const currentUrl = window.location.href;
    
    const messageTemplate = `Hello, I am interested in this product.

Product:
${productName}

Price:
${productPriceFormatted}

Store:
${storeName}

Product Link:
${currentUrl}`;

    // Remove the leading '+' from the E.164 formatted number
    const cleanNumber = whatsappNumber.startsWith('+') 
      ? whatsappNumber.slice(1) 
      : whatsappNumber;
      
    const encodedMessage = encodeURIComponent(messageTemplate);
    const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
  };

  return (
    <button
      onClick={handleOrderClick}
      className="w-full py-5 px-8 text-sm uppercase tracking-[0.2em] font-medium transition-all duration-500 bg-[#1A1A1A] text-white hover:bg-[#333333]"
    >
      Order on WhatsApp
    </button>
  );
}
