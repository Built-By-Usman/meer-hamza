'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Heart, Eye, Check, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { useCartStore } from '@/store/cart';
import { useWishlistStore } from '@/store/wishlist';
import { Product, ProductVariant } from '@/types';
import { cn } from '@/utils/cn';
import { toast } from 'sonner';
import { Rating } from '@/components/common/Rating';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const router = useRouter();
  const [selectedVariant, setSelectedVariant] = React.useState<ProductVariant | undefined>(
    product.variants?.[0]
  );
  const [isQuickViewOpen, setIsQuickViewOpen] = React.useState(false);
  const [isAdding, setIsAdding] = React.useState(false);
  const [showFloat, setShowFloat] = React.useState(false);
  const [addBtnKey, setAddBtnKey] = React.useState(0);

  const addToCart = useCartStore((s) => s.addToCart);
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const isFav = isInWishlist(product.id);

  const price = selectedVariant?.price !== undefined ? selectedVariant.price : product.basePrice;
  const originalPrice = selectedVariant?.originalPrice || product.originalPrice || price;
  const discountPercent = selectedVariant?.discountPercent || product.discountPercent || 0;
  const image = selectedVariant?.images?.[0] || product.images[0];

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isAdding) return;

    addToCart(product, selectedVariant, 1);
    setIsAdding(true);
    setShowFloat(true);
    setAddBtnKey((k) => k + 1); // retrigger add-pop animation

    toast.success('Added to bag', {
      description: `${product.name} · ${selectedVariant?.attributes.volume || '100 ml'}`,
      duration: 2000,
    });

    setTimeout(() => setIsAdding(false), 1400);
    setTimeout(() => setShowFloat(false), 700);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product);
    toast[isFav ? 'info' : 'success'](
      isFav ? 'Removed from Wishlist' : 'Saved to Wishlist'
    );
  };

  const handleCardClick = () => router.push(`/product/${product.slug}`);

  const animDelay = `${index * 70}ms`;

  return (
    <>
      {/* ═══ CARD ═══ */}
      <div
        className="card-animate group relative flex flex-col cursor-pointer"
        style={{ animationDelay: animDelay }}
        onClick={handleCardClick}
      >
        {/* ── IMAGE ── */}
        <div className="relative w-full aspect-[3/4] overflow-hidden rounded-2xl bg-[#f5f3ef] shadow-sm group-hover:shadow-md transition-shadow duration-500">

          <OptimizedImage
            src={image}
            alt={product.name}
            fill
            className="object-cover will-change-transform transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-[1.07]"
          />

          {/* Gradient vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none rounded-2xl" />

          {/* ── BADGES top-left ── */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none z-10">
            {discountPercent > 0 && (
              <span className="font-sans font-black text-[9px] tracking-widest bg-zinc-950 text-white px-2 py-0.5 rounded-md">
                −{discountPercent}%
              </span>
            )}
            {product.isBestSeller && (
              <span className="font-sans font-bold text-[8px] tracking-[0.18em] uppercase bg-primary text-primary-foreground px-2 py-0.5 rounded-md">
                ★ Best Seller
              </span>
            )}
          </div>

          {/* ── WISHLIST top-right — always visible, low opacity unless active ── */}
          <button
            onClick={handleWishlistToggle}
            aria-label={isFav ? 'Remove from wishlist' : 'Save to wishlist'}
            className={cn(
              'absolute top-3 right-3 z-10 w-8 h-8 rounded-full',
              'flex items-center justify-center',
              'bg-white/85 backdrop-blur-sm border border-white/60 shadow-sm',
              'transition-all duration-200 active:scale-90 hover:scale-110',
              isFav ? 'opacity-100' : 'opacity-50 hover:opacity-100'
            )}
          >
            <Heart
              className={cn(
                'h-3.5 w-3.5 transition-all duration-200',
                isFav ? 'fill-rose-500 text-rose-500' : 'text-zinc-700'
              )}
            />
          </button>

          {/* ── QUICK-VIEW centre — desktop hover only ── */}
          <div className="absolute inset-0 z-10 flex items-center justify-center">
            <button
              onClick={(e) => { e.stopPropagation(); setIsQuickViewOpen(true); }}
              className={cn(
                'hidden sm:flex items-center gap-1.5',
                'opacity-0 group-hover:opacity-100',
                'translate-y-3 group-hover:translate-y-0',
                'transition-all duration-300',
                'bg-white/92 backdrop-blur-sm border border-white/70 shadow-lg',
                'px-4 py-2 rounded-full',
                'font-sans font-bold text-[9px] uppercase tracking-widest text-zinc-800',
                'hover:bg-white hover:scale-105'
              )}
            >
              <Eye className="h-3 w-3" />
              Quick View
            </button>
          </div>

          {/* ── VARIANT SIZE SELECTOR — slides up on hover (desktop) / always visible dots (mobile) ── */}
          {product.variants && product.variants.length > 1 && (
            <div
              className={cn(
                'absolute bottom-0 left-0 right-0 z-10 px-3 py-3',
                'bg-white/80 backdrop-blur-sm',
                'sm:translate-y-full sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100',
                'sm:transition-all sm:duration-300'
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <span className="font-sans text-[8px] uppercase tracking-widest text-zinc-500 font-bold">Size</span>
                <div className="flex gap-1.5">
                  {product.variants.slice(0, 4).map((v) => {
                    const isSelected = selectedVariant?.id === v.id;
                    return (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariant(v)}
                        className={cn(
                          'font-sans text-[8px] px-2 py-0.5 rounded-md border font-bold uppercase tracking-wide transition-all duration-150',
                          isSelected
                            ? 'bg-zinc-950 text-white border-zinc-950'
                            : 'bg-white/90 text-zinc-600 border-zinc-200 hover:border-zinc-400'
                        )}
                      >
                        {v.attributes.volume?.replace('ml', '') || '100'}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── INFO + CTA ROW ── */}
        <div className="relative flex items-end justify-between mt-3 gap-2">

          {/* Text block */}
          <div className="flex-1 min-w-0">
            <span className="font-sans text-[8px] uppercase tracking-[0.25em] text-primary font-bold block">
              {product.brand}
            </span>
            <h3 className="font-serif text-sm text-foreground leading-snug font-light tracking-wide mt-0.5 line-clamp-1 group-hover:text-primary transition-colors duration-300">
              {product.name}
            </h3>
            <div className="flex items-center gap-1 mt-1">
              <Rating rating={product.rating} size={9} />
              <span className="font-sans text-[8px] text-muted-foreground">({product.reviewsCount})</span>
            </div>
            <div className="flex items-baseline gap-1.5 mt-1.5">
              <span className="font-sans font-bold text-sm text-foreground">${price.toFixed(2)}</span>
              {originalPrice > price && (
                <span className="font-sans text-[10px] text-muted-foreground line-through">${originalPrice.toFixed(2)}</span>
              )}
            </div>
          </div>

          {/* ── ADD TO BAG BUTTON — always visible ── */}
          <div
            className="relative flex-shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Floating "+1" that rises on add */}
            {showFloat && (
              <span
                key={addBtnKey}
                className="float-up absolute -top-5 left-1/2 -translate-x-1/2 z-30 font-sans font-black text-[10px] text-emerald-600 pointer-events-none whitespace-nowrap"
              >
                +1 ✓
              </span>
            )}

            <button
              key={`btn-${addBtnKey}`}
              onClick={handleAddToCart}
              aria-label="Add to bag"
              className={cn(
                'add-pop relative flex items-center justify-center gap-1.5',
                'w-10 h-10 rounded-full',
                'transition-all duration-300 active:scale-90',
                'shadow-sm hover:shadow-md',
                isAdding
                  ? 'bg-emerald-500 text-white scale-110'
                  : 'bg-zinc-950 text-white hover:bg-zinc-700'
              )}
            >
              {isAdding
                ? <Check className="h-4 w-4 stroke-[2.5]" />
                : <ShoppingBag className="h-4 w-4" />
              }
            </button>
          </div>
        </div>

        {/* Animated gold underline */}
        <div className="mt-3 h-[1px] bg-border/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/40 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
        </div>
      </div>

      {/* ── QUICK VIEW DIALOG ── */}
      <Dialog isOpen={isQuickViewOpen} onClose={() => setIsQuickViewOpen(false)} size="lg">
        <DialogContent className="grid grid-cols-1 md:grid-cols-2 gap-0 p-0 overflow-hidden rounded-2xl border-border/40 max-h-[90vh]">
          {/* Image */}
          <div className="relative aspect-[3/4] w-full bg-[#f5f3ef] overflow-hidden md:aspect-auto md:min-h-[480px]">
            <OptimizedImage src={image} alt={product.name} fill className="object-cover" />
            {discountPercent > 0 && (
              <span className="absolute top-3 left-3 font-sans font-black text-[9px] tracking-widest bg-zinc-950 text-white px-2 py-0.5 rounded-md">
                −{discountPercent}%
              </span>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col justify-between p-7 overflow-y-auto bg-background">
            <div className="space-y-4">
              <div>
                <span className="font-sans text-[8px] uppercase tracking-[0.28em] font-bold text-primary block">
                  {product.specifications?.['Fragrance Family']} · {product.specifications?.['Gender']}
                </span>
                <h2 className="font-serif text-xl sm:text-2xl text-foreground mt-1 font-light tracking-wide">{product.name}</h2>
                <div className="flex items-center gap-2 mt-2">
                  <Rating rating={product.rating} size={12} />
                  <span className="font-sans text-xs text-muted-foreground">({product.reviewsCount} reviews)</span>
                </div>
              </div>

              <div className="flex items-baseline gap-2 py-3 border-y border-border/25">
                <span className="font-sans text-2xl font-bold">${price.toFixed(2)}</span>
                {originalPrice > price && (
                  <span className="font-sans text-sm text-muted-foreground line-through">${originalPrice.toFixed(2)}</span>
                )}
                {discountPercent > 0 && (
                  <span className="font-sans font-black text-[10px] tracking-widest bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">−{discountPercent}%</span>
                )}
              </div>

              <div>
                {product.stockStatus === 'in_stock' ? (
                  <span className="inline-flex items-center gap-1.5 font-sans text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                    <Check className="h-3 w-3" /> In Stock · Authentic
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 font-sans text-xs font-semibold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">
                    <AlertTriangle className="h-3 w-3" /> Low Stock
                  </span>
                )}
              </div>

              <p className="font-sans text-xs text-muted-foreground leading-relaxed">{product.description}</p>

              {(product.specifications?.['Top Notes'] || product.specifications?.['Heart Notes']) && (
                <div className="space-y-1 text-xs bg-secondary/40 rounded-xl p-3">
                  {product.specifications?.['Top Notes'] && (
                    <div><span className="font-serif italic font-semibold text-foreground">Top:</span> <span className="text-muted-foreground">{product.specifications['Top Notes']}</span></div>
                  )}
                  {product.specifications?.['Heart Notes'] && (
                    <div><span className="font-serif italic font-semibold text-foreground">Heart:</span> <span className="text-muted-foreground">{product.specifications['Heart Notes']}</span></div>
                  )}
                  {product.specifications?.['Base Notes'] && (
                    <div><span className="font-serif italic font-semibold text-foreground">Base:</span> <span className="text-muted-foreground">{product.specifications['Base Notes']}</span></div>
                  )}
                </div>
              )}

              {product.variants && product.variants.length > 0 && (
                <div className="space-y-2">
                  <span className="font-sans text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Select Volume</span>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((v) => {
                      const isSel = selectedVariant?.id === v.id;
                      return (
                        <button
                          key={v.id}
                          onClick={() => setSelectedVariant(v)}
                          className={cn(
                            'font-sans text-xs px-3 py-1.5 rounded-lg border font-bold cursor-pointer transition-all duration-200',
                            isSel
                              ? 'bg-zinc-950 text-white border-zinc-950 scale-105'
                              : 'hover:bg-secondary border-border text-muted-foreground hover:border-zinc-400'
                          )}
                        >
                          {v.attributes.volume || '100 ml'}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 mt-6 pt-4 border-t border-border/20">
              <button
                onClick={(e) => { handleAddToCart(e); setIsQuickViewOpen(false); }}
                className="btn-shimmer flex-1 cursor-pointer rounded-xl font-sans font-bold text-[10px] tracking-widest uppercase h-11 bg-zinc-950 text-white hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingBag className="h-4 w-4" /> Add to Bag
              </button>
              <button
                onClick={handleWishlistToggle}
                className={cn(
                  'cursor-pointer rounded-xl border h-11 w-11 flex items-center justify-center transition-all duration-200',
                  isFav ? 'bg-rose-50 border-rose-200' : 'border-border hover:bg-secondary'
                )}
                aria-label="Wishlist"
              >
                <Heart className={cn('h-4 w-4 transition-all', isFav && 'fill-rose-500 text-rose-500')} />
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
