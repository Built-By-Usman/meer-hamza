'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Trash2, Plus, Minus, CreditCard, Tag, X } from 'lucide-react';
import { Sheet, SheetHeader, SheetTitle, SheetContent, SheetFooter } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EmptyState } from '@/components/common/EmptyState';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { useCartStore } from '@/store/cart';
import { useValidateCoupon, useSettings } from '@/features/shared/hooks/queries';
import { toast } from 'sonner';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { formatPrice } from '@/utils/currency';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const router = useRouter();
  const {
    items,
    coupon,
    subtotal,
    discount,
    shippingCost,
    total,
    updateQuantity,
    removeFromCart,
    applyCoupon,
    removeCoupon,
  } = useCartStore();
  const { data: storeSettings } = useSettings();

  const baseShipping = storeSettings !== undefined ? storeSettings.delivery_charges : shippingCost;
  const minOrderForFree = storeSettings?.min_order_amount || 0;
  const finalShippingCost = (minOrderForFree > 0 && subtotal >= minOrderForFree) ? 0 : baseShipping;
  const finalTotal = Math.max(0, parseFloat((subtotal - discount + finalShippingCost).toFixed(2)));

  const [couponCode, setCouponCode] = React.useState('');
  const validateCouponMutation = useValidateCoupon();

  const handleCheckoutClick = () => {
    onClose();
    router.push('/checkout');
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }

    validateCouponMutation.mutate(
      { code: couponCode.trim(), subtotal },
      {
        onSuccess: (data) => {
          if (data) {
            applyCoupon(data);
            toast.success(`Coupon code ${data.code} applied successfully!`, {
              description: data.type === 'percentage' ? `${data.value}% discount applied` : `${formatPrice(data.value)} discount applied`,
            });
            setCouponCode('');
          } else {
            toast.error('Invalid coupon code or minimum purchase amount not met.', {
              description: 'Try codes like PREMIUM10 or WELCOME50 (min spend Rs. 300).',
            });
          }
        },
        onError: () => {
          toast.error('Error validating coupon code');
        },
      }
    );
  };

  return (
    <Sheet isOpen={isOpen} onClose={onClose} side="right">
      <ErrorBoundary>
        <SheetHeader className="flex items-center justify-between">
        <SheetTitle className="flex items-center space-x-2">
          <ShoppingCart className="h-5 w-5" />
          <span>Shopping Cart ({items.reduce((acc, item) => acc + item.quantity, 0)})</span>
        </SheetTitle>
      </SheetHeader>

      <SheetContent className="flex flex-col h-full justify-between pr-2">
        {items.length === 0 ? (
          <div className="flex items-center justify-center h-full pr-4">
            <EmptyState
              title="Your cart is empty"
              description="Explore our curated collection of premium products to find exactly what you need."
              icon={<ShoppingCart className="h-12 w-12 stroke-[1.5]" />}
              actionLabel="Start Shopping"
              onAction={() => {
                onClose();
                router.push('/');
              }}
            />
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto pr-4 space-y-4 divide-y divide-border">
            {items.map((item, idx) => (
              <div key={`${item.productId}-${item.variantId || ''}`} className={cn('flex py-4 first:pt-0', idx > 0 && 'border-t')}>
                {/* Product Thumbnail */}
                <div className="relative h-20 w-20 flex-shrink-0">
                  <OptimizedImage
                    src={item.image}
                    alt={item.name}
                    fill
                    className="rounded-md"
                  />
                </div>

                {/* Info & Quantity controls */}
                <div className="ml-4 flex flex-1 flex-col">
                  <div>
                    <div className="flex justify-between text-base font-semibold">
                      <h4 className="line-clamp-1">{item.name}</h4>
                      <p className="ml-4">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                    {/* Display variant labels if they exist */}
                    {item.attributes && Object.keys(item.attributes).length > 0 && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {Object.entries(item.attributes)
                          .map(([key, val]) => `${key}: ${val}`)
                          .join(' · ')}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-1 items-end justify-between text-sm">
                    {/* Quantity selectors */}
                    <div className="flex items-center border rounded-md h-8">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1, item.variantId)}
                        className="px-2.5 h-full hover:bg-secondary flex items-center justify-center transition-colors cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="px-3 text-sm font-semibold select-none">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1, item.variantId)}
                        className="px-2.5 h-full hover:bg-secondary flex items-center justify-center transition-colors cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {/* Delete Item */}
                    <button
                      onClick={() => removeFromCart(item.productId, item.variantId)}
                      className="font-medium text-destructive hover:text-destructive/80 transition-colors cursor-pointer flex items-center space-x-1"
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </SheetContent>

      {items.length > 0 && (
        <SheetFooter className="p-5 border-t flex flex-col space-y-4 bg-secondary/5 text-left">
          {/* Coupon Entry Block */}
          <div className="w-full space-y-2 border-b pb-4">
            <span className="font-sans text-[9px] uppercase tracking-wider text-muted-foreground font-bold">Have a Coupon?</span>
            {!coupon ? (
              <form onSubmit={handleApplyCoupon} className="flex gap-2 w-full">
                <Input
                  placeholder="Promo Code (e.g. PREMIUM10)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="h-9 text-xs rounded-lg border-border"
                  disabled={validateCouponMutation.isPending}
                />
                <Button
                  type="submit"
                  size="sm"
                  variant="outline"
                  disabled={validateCouponMutation.isPending}
                  className="h-9 text-xs font-bold shrink-0 cursor-pointer rounded-lg px-4 border-zinc-950 text-zinc-950 hover:bg-zinc-50"
                >
                  Apply
                </Button>
              </form>
            ) : (
              <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 rounded-lg p-2.5 w-full text-xs">
                <div className="flex items-center gap-2">
                  <Tag className="h-3.5 w-3.5 animate-scale-up" />
                  <span className="font-bold">Code "{coupon.code}" active</span>
                </div>
                <button
                  onClick={removeCoupon}
                  type="button"
                  className="h-5 w-5 rounded-full hover:bg-emerald-500/20 flex items-center justify-center cursor-pointer transition-colors"
                  aria-label="Remove coupon"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>

          {/* Summary pricing */}
          <div className="space-y-1.5 text-xs w-full">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-rose-600 font-medium animate-fade-in">
                <span>Discount</span>
                <span>-{formatPrice(discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-muted-foreground">
              <span>Shipping</span>
              <span>
                {finalShippingCost === 0 ? (
                  <span className="text-emerald-600 font-medium">Free</span>
                ) : (
                  `${formatPrice(finalShippingCost)}`
                )}
              </span>
            </div>
            <div className="flex justify-between text-sm font-bold text-foreground border-t pt-2 mt-2 font-serif">
              <span>Total</span>
              <span>{formatPrice(finalTotal)}</span>
            </div>
          </div>

          {/* CTA Action */}
          <div className="w-full">
            <Button
              onClick={handleCheckoutClick}
              className="w-full cursor-pointer flex items-center justify-center space-x-2 bg-zinc-950 text-white hover:bg-zinc-900 py-6 text-xs font-bold tracking-widest uppercase rounded-lg"
            >
              <CreditCard className="h-4 w-4" />
              <span>Proceed to Checkout</span>
            </Button>
          </div>
        </SheetFooter>
      )}
      </ErrorBoundary>
    </Sheet>
  );
}

// Inline helper to avoid circular dependencies
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
