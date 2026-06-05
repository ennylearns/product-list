'use client';

import { useState } from 'react';
import Image from 'next/image';

type ProductImageCarouselProps = {
  images: string[];
  productName: string;
};

export function ProductImageCarousel({ images, productName }: ProductImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="relative w-full aspect-[4/5] md:min-h-[80vh] bg-[#F5F5F5] flex items-center justify-center border border-[#E5E5E5]">
        <svg className="w-24 h-24 text-[#D4D4D4]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    );
  }

  if (images.length === 1) {
    return (
      <div className="relative w-full aspect-[4/5] md:aspect-auto md:min-h-[80vh] bg-[#F5F5F5]">
        <Image
          src={images[0]}
          alt={productName}
          fill
          className="object-cover object-center"
          sizes="(min-width: 1024px) 66vw, 100vw"
          priority
        />
      </div>
    );
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  const goToPrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  return (
    <div className="relative w-full aspect-[4/5] md:aspect-auto md:min-h-[80vh] bg-[#F5F5F5] overflow-hidden group">
      {/* Images container */}
      <div 
        className="flex w-full h-full transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((img, idx) => (
          <div key={idx} className="relative w-full h-full flex-shrink-0">
            <Image
              src={img}
              alt={`${productName} - View ${idx + 1}`}
              fill
              className="object-cover object-center"
              sizes="(min-width: 1024px) 66vw, 100vw"
              priority={idx === 0}
            />
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      <div className="absolute inset-0 flex items-center justify-between p-4 md:p-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button 
          onClick={goToPrev}
          className="w-12 h-12 flex items-center justify-center bg-white/80 backdrop-blur-md text-[#1A1A1A] rounded-full hover:bg-white transition-colors"
          aria-label="Previous image"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button 
          onClick={goToNext}
          className="w-12 h-12 flex items-center justify-center bg-white/80 backdrop-blur-md text-[#1A1A1A] rounded-full hover:bg-white transition-colors"
          aria-label="Next image"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`transition-all duration-300 ${
              currentIndex === idx 
                ? 'w-8 h-1 bg-[#1A1A1A]' 
                : 'w-2 h-1 bg-[#1A1A1A]/30 hover:bg-[#1A1A1A]/60'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
