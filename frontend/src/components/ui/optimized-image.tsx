'use client';

import * as React from 'react';
import Image, { ImageProps } from 'next/image';
import { cn } from '@/utils/cn';

interface OptimizedImageProps extends Omit<ImageProps, 'onLoad'> {
  className?: string;
  containerClassName?: string;
}

export function OptimizedImage({
  src,
  alt,
  className,
  containerClassName,
  width,
  height,
  fill,
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  loading,
  quality = 75,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = React.useState(true);

  return (
    <div
      className={cn(
        'relative overflow-hidden bg-secondary rounded-md',
        fill && 'w-full h-full',
        containerClassName
      )}
    >
      {/* Shimmering Skeleton Background */}
      {isLoading && (
        <div className="absolute inset-0 z-10 animate-pulse bg-gradient-to-r from-secondary via-muted to-secondary bg-[length:200%_100%] animate-shimmer" />
      )}

      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        fill={fill}
        priority={priority}
        sizes={sizes}
        quality={quality}
        loading={loading || (priority ? undefined : 'lazy')}
        onLoad={() => setIsLoading(false)}
        className={cn(
          'duration-500 ease-in-out object-cover',
          isLoading ? 'scale-105 blur-md' : 'scale-100 blur-0',
          className
        )}
        {...props}
      />
    </div>
  );
}
