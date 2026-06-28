'use client';

import * as React from 'react';
import { Rating } from '@/components/common/Rating';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/common/EmptyState';
import { Product } from '@/types';

interface ProductReview {
  id: string;
  rating: number;
  comment: string;
  userName: string;
  userId: string;
  createdAt: string;
  verified?: boolean;
}

interface ProductReviewsProps {
  product: Product;
  reviews: ProductReview[] | undefined;
  isLoadingReviews: boolean;
  onWriteReview: () => void;
}

export function ProductReviews({
  product,
  reviews,
  isLoadingReviews,
  onWriteReview,
}: ProductReviewsProps) {
  // Dynamic review distribution
  const ratingBreakdown = [5, 4, 3, 2, 1].map((r) => {
    const matching = reviews?.filter((rev) => Math.round(rev.rating) === r) || [];
    const percent = reviews && reviews.length > 0 ? (matching.length / reviews.length) * 100 : 0;
    return { stars: r, count: matching.length, percent };
  });

  return (
    <section className="mt-20 text-left border-t pt-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-xl font-serif italic text-foreground tracking-wide">Client Testimonials</h2>
          <div className="flex items-center gap-2 mt-1.5 font-sans text-xs">
            <Rating rating={product.rating} size={11} />
            <span className="text-muted-foreground">({product.rating} average out of {product.reviewsCount} reviews)</span>
          </div>
        </div>
        <Button onClick={onWriteReview} className="cursor-pointer font-bold text-[9px] uppercase tracking-widest rounded-xl h-9 px-4 bg-zinc-950 text-white hover:bg-zinc-800">
          Write a Review
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Rating breakdown */}
        <div className="lg:col-span-4 space-y-3 font-sans border-r border-border/10 pr-0 lg:pr-8">
          {ratingBreakdown.map((r) => (
            <div key={r.stars} className="flex items-center text-xs space-x-3 font-semibold">
              <span className="w-12 text-muted-foreground">{r.stars} stars</span>
              <div className="flex-1 h-1 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: `${r.percent}%` }} />
              </div>
              <span className="w-6 text-right text-muted-foreground">{r.count}</span>
            </div>
          ))}
        </div>

        {/* Review list */}
        <div className="lg:col-span-8 space-y-5">
          {isLoadingReviews ? (
            <ProductReviewsSkeletonOnlyList />
          ) : reviews && reviews.length > 0 ? (
            <div className="space-y-5 divide-y divide-border/10">
              {reviews.map((rev) => (
                <div key={rev.id} className="pt-5 first:pt-0">
                  <div className="flex justify-between items-start font-sans">
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 rounded-full bg-secondary/80 overflow-hidden border flex items-center justify-center text-[9px] font-bold text-muted-foreground font-sans">
                        {rev.userName.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-foreground">{rev.userName}</p>
                        <p className="text-[9px] text-muted-foreground flex items-center gap-2 mt-0.5">
                          <span>{new Date(rev.createdAt).toLocaleDateString()}</span>
                          {rev.verified && <span className="text-emerald-600 uppercase tracking-widest text-[8px] font-bold">Verified Scent</span>}
                        </p>
                      </div>
                    </div>
                    <Rating rating={rev.rating} size={9} />
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed mt-2.5 font-sans font-medium">{rev.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No testimonials yet"
              description="Share your olfactory experience with this scent by clicking the write button."
            />
          )}
        </div>
      </div>
    </section>
  );
}

function ProductReviewsSkeletonOnlyList() {
  return (
    <div className="space-y-6 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className="space-y-2 border-b border-border/10 pb-4 last:border-0">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-full bg-secondary" />
              <div className="space-y-1">
                <div className="h-3 w-24 bg-secondary rounded" />
                <div className="h-2 w-12 bg-secondary rounded" />
              </div>
            </div>
            <div className="h-3 w-16 bg-secondary rounded" />
          </div>
          <div className="h-3 w-full bg-secondary rounded" />
          <div className="h-3 w-3/4 bg-secondary rounded" />
        </div>
      ))}
    </div>
  );
}

export function ProductReviewsSkeleton() {
  return (
    <section className="mt-20 text-left border-t pt-10 animate-pulse">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div className="space-y-2">
          <div className="h-6 w-48 bg-secondary rounded" />
          <div className="h-3 w-64 bg-secondary rounded" />
        </div>
        <div className="h-9 w-32 bg-secondary rounded-xl" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-3 pr-0 lg:pr-8">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center space-x-3">
              <div className="h-3 w-12 bg-secondary rounded" />
              <div className="flex-1 h-2 bg-secondary rounded-full" />
              <div className="h-3 w-6 bg-secondary rounded" />
            </div>
          ))}
        </div>
        <div className="lg:col-span-8">
          <ProductReviewsSkeletonOnlyList />
        </div>
      </div>
    </section>
  );
}
