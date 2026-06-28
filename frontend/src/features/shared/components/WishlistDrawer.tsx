'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Heart, Trash2, ShoppingBag } from 'lucide-react';
import { Sheet, SheetHeader, SheetTitle, SheetContent } from '@/components/ui/sheet';
import { EmptyState } from '@/components/common/EmptyState';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { useWishlistStore } from '@/store/wishlist';
import { useCartStore } from '@/store/cart';
import { toast } from 'sonner';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WishlistDrawer({ isOpen, onClose }: WishlistDrawerProps) {
  const router = useRouter();
  const { items, removeFromWishlist } = useWishlistStore();
  const { addToCart } = useCartStore();

  const handleMoveToCart = (product: any) => {
    addToCart(product, product.variants?.[0], 1);
    removeFromWishlist(product.id);
    toast.success(`Moved ${product.name} to Shopping Bag`);
  };

  return (
    <Sheet isOpen={isOpen} onClose={onClose} side="right">
      <SheetHeader className="flex items-center justify-between border-b pb-4">
        <SheetTitle className="flex items-center space-x-2 text-zinc-950 font-serif">
          <Heart className="h-5 w-5 text-rose-500 fill-rose-500/10" />
          <span>My Wishlist ({items.length})</span>
        </SheetTitle>
      </SheetHeader>

      <SheetContent className="flex flex-col h-[calc(100vh-80px)] justify-between pr-2 mt-4">
        {items.length === 0 ? (
          <div className="flex items-center justify-center h-full pr-4">
            <EmptyState
              title="Your Wishlist is empty"
              description="Save premium fragrances while browsing, and they will appear here."
              icon={<Heart className="h-12 w-12 stroke-[1.5]" />}
              actionLabel="Discover Scents"
              onAction={() => {
                onClose();
                router.push('/');
              }}
            />
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto pr-4 space-y-4 divide-y divide-border">
            {items.map((item, idx) => (
              <div key={item.id} className={cn('flex py-4 first:pt-0', idx > 0 && 'border-t')}>
                {/* Product Thumbnail */}
                <div className="relative h-20 w-20 flex-shrink-0 bg-secondary rounded-lg overflow-hidden border">
                  <OptimizedImage
                    src={item.images[0]}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Info & controls */}
                <div className="ml-4 flex flex-1 flex-col justify-between">
                  <div>
                    <div className="flex justify-between text-sm font-semibold">
                      <h4 className="line-clamp-1 text-zinc-900">{item.name}</h4>
                      <p className="ml-4 font-bold text-zinc-950">${item.basePrice}</p>
                    </div>
                    <p className="text-[10px] text-muted-foreground uppercase font-sans font-semibold tracking-wider mt-0.5">{item.brand}</p>
                  </div>

                  <div className="flex items-center justify-between text-xs mt-2">
                    {/* Add to Bag */}
                    <button
                      onClick={() => handleMoveToCart(item)}
                      className="font-bold text-primary hover:underline cursor-pointer flex items-center space-x-1"
                    >
                      <ShoppingBag className="h-3.5 w-3.5" />
                      <span>Add to Bag</span>
                    </button>

                    {/* Delete Item */}
                    <button
                      onClick={() => {
                        removeFromWishlist(item.id);
                        toast.success(`Removed ${item.name} from Wishlist`);
                      }}
                      className="font-medium text-destructive hover:text-destructive/80 transition-colors cursor-pointer flex items-center space-x-1"
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

// Inline helper to avoid classnames module dependency
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
