'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Heart, Eye, Check, AlertTriangle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Rating } from '@/components/common/Rating';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { useCartStore } from '@/store/cart';
import { useWishlistStore } from '@/store/wishlist';
import { Product, ProductVariant } from '@/types';
import { cn } from '@/utils/cn';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const [selectedVariant, setSelectedVariant] = React.useState<ProductVariant | undefined>(
    product.variants?.[0]
  );
  const [isQuickViewOpen, setIsQuickViewOpen] = React.useState(false);

  const addToCart = useCartStore((s) => s.addToCart);
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  const isFav = isInWishlist(product.id);

  // Price calculations
  const price = selectedVariant?.price !== undefined ? selectedVariant.price : product.basePrice;
  const originalPrice = selectedVariant?.originalPrice || product.originalPrice || price;
  const discountPercent = selectedVariant?.discountPercent || product.discountPercent || 0;
  const image = selectedVariant?.images?.[0] || product.images[0];

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, selectedVariant, 1);
    toast.success(`${product.name} added to bag`, {
      description: `Size: ${selectedVariant?.attributes.volume || '100 ml'}`,
    });
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product);
    if (!isFav) {
      toast.success(`Saved ${product.name} to Wishlist`, {
        icon: <Heart className="fill-rose-500 text-rose-500 h-4 w-4" />,
      });
    } else {
      toast.info(`Removed ${product.name} from Wishlist`);
    }
  };

  const handleCardClick = () => {
    router.push(`/product/${product.slug}`);
  };

  return (
    <>
      <div
        onClick={handleCardClick}
        className="group relative flex flex-col overflow-hidden rounded-md border border-border/60 bg-card text-card-foreground transition-all duration-500 cursor-pointer h-full text-left luxury-shadow luxury-glow"
      >
        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 z-10 flex flex-col space-y-1.5 pointer-events-none">
          {discountPercent > 0 && (
            <Badge variant="destructive" className="font-bold text-[9px] rounded-none px-2 py-0.5">
              -{discountPercent}% OFF
            </Badge>
          )}
          {product.isBestSeller && (
            <Badge variant="default" className="bg-primary text-primary-foreground font-bold text-[9px] rounded-none uppercase tracking-widest px-2 py-0.5">
              Best Seller
            </Badge>
          )}
        </div>

        {/* Floating Quick Action Overlay (Right Side) */}
        <div className="absolute right-3 top-3 z-10 flex flex-col space-y-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <Button
            variant="secondary"
            size="icon"
            onClick={handleWishlistToggle}
            className="h-8 w-8 rounded-full shadow-xs bg-background/95 hover:bg-secondary cursor-pointer border border-border/80"
            aria-label="Add to wishlist"
          >
            <Heart className={cn('h-3.5 w-3.5 transition-colors', isFav ? 'fill-rose-500 text-rose-500 border-none' : 'text-muted-foreground')} />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              setIsQuickViewOpen(true);
            }}
            className="h-8 w-8 rounded-full shadow-xs bg-background/95 hover:bg-secondary cursor-pointer border border-border/80"
            aria-label="Quick view"
          >
            <Eye className="h-3.5 w-3.5 text-muted-foreground" />
          </Button>
        </div>

        {/* Perfume Bottle Image (luxury display aspect-ratio) */}
        <div className="relative aspect-[3/4] w-full bg-secondary overflow-hidden border-b border-border/40">
          <OptimizedImage
            src={image}
            alt={product.name}
            fill
            className="transition-transform duration-700 ease-out group-hover:scale-[1.03] object-cover"
          />
          {/* Subtle gold overlay on hover */}
          <div className="absolute inset-0 bg-primary/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </div>

        {/* Card Details */}
        <div className="flex flex-1 flex-col p-4 bg-background">
          <div className="flex-1 space-y-1">
            <span className="text-[9px] text-primary uppercase font-bold tracking-widest block font-sans">
              {product.brand}
            </span>
            
            <h3 className="font-serif italic text-base text-foreground group-hover:text-primary transition-colors tracking-wide leading-snug line-clamp-1">
              {product.name}
            </h3>

            {/* Inspired by Designer Fragrance Tag */}
            {product.inspiredBy && (
              <p className="text-[10px] text-muted-foreground font-sans font-medium tracking-wide">
                Inspired by <span className="text-foreground font-bold">{product.inspiredBy}</span>
              </p>
            )}

            {/* Stars & Reviews */}
            <div className="flex items-center space-x-1.5 pt-0.5">
              <Rating rating={product.rating} size={11} />
              <span className="text-[9px] text-muted-foreground font-semibold font-sans">({product.reviewsCount})</span>
            </div>
          </div>

          {/* Pricing Details */}
          <div className="flex items-baseline space-x-2 mb-3 mt-2 border-t pt-2.5 border-border/30">
            <span className="text-sm font-bold text-foreground font-sans">${price.toFixed(2)}</span>
            {originalPrice > price && (
              <span className="text-[11px] text-muted-foreground line-through font-medium font-sans">
                ${originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Simplified Single Add to Bag Button */}
          <div className="mt-auto" onClick={(e) => e.stopPropagation()}>
            <Button
              size="sm"
              onClick={handleAddToCart}
              className="text-[10px] uppercase tracking-wider font-extrabold w-full cursor-pointer rounded-sm h-9 flex items-center justify-center gap-1.5 hover:bg-primary/90 bg-primary text-primary-foreground border border-transparent"
            >
              <ShoppingBag className="h-3.5 w-3.5" /> Add To Bag
            </Button>
          </div>
        </div>
      </div>

      {/* Quick View Dialog Modal */}
      <Dialog isOpen={isQuickViewOpen} onClose={() => setIsQuickViewOpen(false)} size="lg">
        <DialogContent className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 overflow-y-auto rounded-md border-border/60">
          {/* Gallery image */}
          <div className="relative aspect-[3/4] w-full bg-secondary rounded-sm overflow-hidden border">
            <OptimizedImage src={image} alt={product.name} fill className="object-cover" />
          </div>

          {/* Core metadata details */}
          <div className="space-y-5 text-left flex flex-col justify-between">
            <div>
              <span className="text-[10px] uppercase font-extrabold text-primary tracking-widest block font-sans">
                {product.specifications['Fragrance Family']} · {product.specifications['Gender']}
              </span>
              <h2 className="text-2xl font-semibold text-foreground mt-1.5 font-serif italic tracking-wide">{product.name}</h2>
              
              <div className="flex items-center space-x-2 mt-2">
                <Rating rating={product.rating} size={13} />
                <span className="text-xs text-muted-foreground font-sans font-medium">({product.reviewsCount} reviews)</span>
              </div>

              {/* Price row */}
              <div className="flex items-baseline space-x-2 mt-3 mb-2 border-y py-2.5 border-border/40">
                <span className="text-xl font-bold font-sans">${price.toFixed(2)}</span>
                {originalPrice > price && (
                  <span className="text-sm text-muted-foreground line-through font-sans">${originalPrice.toFixed(2)}</span>
                )}
                {discountPercent > 0 && (
                  <Badge variant="destructive" className="font-bold text-[9px] ml-1 rounded-none px-1.5">-{discountPercent}% OFF</Badge>
                )}
              </div>

              {/* Stock Indicator */}
              <div className="flex items-center space-x-1.5 mt-2.5">
                {product.stockStatus === 'in_stock' ? (
                  <span className="flex items-center text-xs font-semibold text-emerald-600 dark:text-emerald-500 font-sans">
                    <Check className="h-3.5 w-3.5 mr-1" /> Original Product Guarantee & In Stock
                  </span>
                ) : (
                  <span className="flex items-center text-xs font-semibold text-amber-600 dark:text-amber-500 font-sans">
                    <AlertTriangle className="h-3.5 w-3.5 mr-1" /> Low Stock ({selectedVariant?.stock || 5} remaining)
                  </span>
                )}
              </div>

              <p className="text-xs text-muted-foreground mt-3 leading-relaxed font-sans font-medium">{product.description}</p>
            </div>

            <div className="space-y-4">
              {/* Olfactory profile summary */}
              <div className="space-y-1.5 text-xs border-t pt-3 border-border/30">
                <div><span className="font-bold text-foreground font-serif italic">Top Notes:</span> <span className="text-muted-foreground">{product.specifications['Top Notes']}</span></div>
                <div><span className="font-bold text-foreground font-serif italic">Heart Notes:</span> <span className="text-muted-foreground">{product.specifications['Heart Notes']}</span></div>
                <div><span className="font-bold text-foreground font-serif italic">Base Notes:</span> <span className="text-muted-foreground">{product.specifications['Base Notes']}</span></div>
              </div>

              {/* Select Variant attribute Swatches */}
              {product.variants && product.variants.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest font-sans block">Select Volume:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {product.variants.map((v) => {
                      const isSelected = selectedVariant?.id === v.id;
                      const label = v.attributes.volume || '100 ml';
                      return (
                        <button
                          key={v.id}
                          onClick={() => setSelectedVariant(v)}
                          className={cn(
                            'text-xs px-3 py-1.5 border rounded-sm font-bold cursor-pointer transition-colors font-sans uppercase tracking-widest',
                            isSelected
                              ? 'border-primary bg-primary/5 text-primary'
                              : 'hover:bg-secondary border-border text-muted-foreground'
                          )}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center space-x-2 pt-2">
                <Button
                  onClick={(e) => {
                    handleAddToCart(e);
                    setIsQuickViewOpen(false);
                  }}
                  className="flex-1 cursor-pointer rounded-sm uppercase font-bold text-xs tracking-wider h-10 bg-primary text-primary-foreground hover:bg-primary/95"
                >
                  Add To Bag
                </Button>
                <Button
                  variant="outline"
                  onClick={handleWishlistToggle}
                  className="cursor-pointer rounded-sm border-border h-10 px-3"
                  aria-label="Wishlist"
                >
                  <Heart className={cn('h-4 w-4', isFav && 'fill-rose-500 text-rose-500 border-none')} />
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
