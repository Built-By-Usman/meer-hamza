'use client';

import * as React from 'react';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { cn } from '@/utils/cn';

interface ProductGalleryProps {
  images: string[];
  productName: string;
  activeImage: string;
  setActiveImage: (img: string) => void;
}

export function ProductGallery({
  images,
  productName,
  activeImage,
  setActiveImage,
}: ProductGalleryProps) {
  // Magnifying Glass Zoom Effect coordinates on Hover
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    
    const target = e.currentTarget.querySelector('.zoom-target') as HTMLImageElement;
    if (target) {
      target.style.transformOrigin = `${x}% ${y}%`;
      target.style.transform = 'scale(1.5)';
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.currentTarget.querySelector('.zoom-target') as HTMLImageElement;
    if (target) {
      target.style.transform = 'scale(1)';
    }
  };

  return (
    <div className="md:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
      {/* Thumbnails row/column */}
      <div className="flex sm:flex-col gap-2.5 overflow-x-auto sm:overflow-y-auto no-scrollbar sm:h-[480px]">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setActiveImage(img)}
            className={cn(
              'relative w-14 h-18 sm:w-18 sm:h-22 flex-shrink-0 bg-[#f5f3ef] rounded-xl overflow-hidden border transition-all cursor-pointer shadow-xs',
              activeImage === img ? 'border-zinc-950 ring-2 ring-zinc-950/10 scale-95' : 'opacity-70 border-transparent hover:opacity-100'
            )}
          >
            <OptimizedImage src={img} alt={`Scent view ${idx}`} fill className="object-cover" />
          </button>
        ))}
      </div>

      {/* Main Stage Image view */}
      <div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="flex-1 relative aspect-[3/4] w-full bg-[#f5f3ef] border border-border/20 rounded-2xl overflow-hidden cursor-crosshair group shadow-xs hover:shadow-sm transition-all duration-300"
      >
        {activeImage ? (
          <OptimizedImage
            src={activeImage}
            alt={productName}
            fill
            priority={true}
            className="zoom-target transition-transform duration-100 ease-out"
            containerClassName="w-full h-full rounded-2xl bg-transparent"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        ) : (
          <div className="w-full h-full bg-[#f5f3ef] animate-pulse rounded-2xl" />
        )}
      </div>
    </div>
  );
}

export function ProductGallerySkeleton() {
  return (
    <div className="md:col-span-7 flex flex-col-reverse sm:flex-row gap-4 animate-pulse">
      {/* Thumbnails Skeleton */}
      <div className="flex sm:flex-col gap-2.5 overflow-hidden sm:h-[480px]">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="w-14 h-18 sm:w-18 sm:h-22 flex-shrink-0 bg-secondary rounded-xl"
          />
        ))}
      </div>

      {/* Main Stage Image Skeleton */}
      <div className="flex-1 relative aspect-[3/4] w-full bg-secondary rounded-2xl" />
    </div>
  );
}
