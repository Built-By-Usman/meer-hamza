'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Trash2, Plus, Minus, CreditCard, Heart, ArrowLeft, Tag, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/common/EmptyState';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { Header } from '@/features/shared/components/Header';
import { Footer } from '@/features/shared/components/Footer';
import { useCartStore } from '@/store/cart';
import { useWishlistStore } from '@/store/wishlist';
import { useValidateCoupon } from '@/features/shared/hooks/queries';
import { toast } from 'sonner';

export function CartClient() {
  const router = useRouter();
  const {
    items,
    coupon,
    subtotal,
    discount,
    tax,
    shippingCost,
    total,
    updateQuantity,
    removeFromCart,
    applyCoupon,
    removeCoupon,
    addToCart,
  } = useCartStore();

  const { items: wishlistItems, removeFromWishlist } = useWishlistStore();
  const validateCouponMutation = useValidateCoupon();
  const [couponCode, setCouponCode] = React.useState('');

  // Handle Coupon code submissions
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
              description: data.type === 'percentage' ? `${data.value}% discount applied` : `$${data.value} discount applied`,
            });
            setCouponCode('');
          } else {
            toast.error('Invalid coupon code or minimum purchase amount not met.', {
              description: 'Try codes like PREMIUM10 or WELCOME50 (min spend $300).',
            });
          }
        },
        onError: () => {
          toast.error('Error validating coupon code');
        },
      }
    );
  };

  // Move item from wishlist to cart
  const handleMoveToCart = (product: any) => {
    addToCart(product, product.variants?.[0], 1);
    removeFromWishlist(product.id);
    toast.success(`Moved ${product.name} to Shopping Cart`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-left mb-6">
          <Link href="/category/all" className="inline-flex items-center text-xs text-muted-foreground hover:text-foreground hover:underline gap-1 mb-3">
            <ArrowLeft className="h-3 w-3" /> Continue Shopping
          </Link>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Shopping Cart</h1>
        </div>

        {items.length === 0 ? (
          <div className="py-8">
            <EmptyState
              title="Your cart is empty"
              description="Explore our curated collection of premium products to find exactly what you need."
              icon={<ShoppingCart className="h-16 w-12 stroke-[1.5]" />}
              actionLabel="Shop Catalog"
              onAction={() => router.push('/category/all')}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 1. Cart Items Column (Left) */}
            <div className="lg:col-span-2 space-y-4 text-left">
              <div className="border rounded-xl bg-card overflow-hidden divide-y divide-border">
                {items.map((item) => (
                  <div key={`${item.productId}-${item.variantId || ''}`} className="flex p-6 items-center">
                    {/* Image */}
                    <div className="relative h-24 w-24 flex-shrink-0 bg-secondary border rounded-lg overflow-hidden">
                      <OptimizedImage src={item.image} alt={item.name} fill />
                    </div>

                    {/* Details & Info */}
                    <div className="ml-6 flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-base leading-snug">
                            <Link href={`/product/${item.productId}`} className="hover:text-primary hover:underline">{item.name}</Link>
                          </h3>
                          {item.attributes && Object.keys(item.attributes).length > 0 && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {Object.entries(item.attributes)
                                .map(([key, val]) => `${key}: ${val}`)
                                .join(' · ')}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground mt-0.5">SKU: {item.sku}</p>
                        </div>
                        <span className="font-bold text-base">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>

                      {/* Quantity & Deletion Controls */}
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center border rounded-md h-8 bg-background">
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity - 1, item.variantId)}
                            className="px-2.5 h-full hover:bg-secondary flex items-center justify-center cursor-pointer transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="px-3 text-sm font-bold select-none">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity + 1, item.variantId)}
                            className="px-2.5 h-full hover:bg-secondary flex items-center justify-center cursor-pointer transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.productId, item.variantId)}
                          className="text-xs font-semibold text-destructive hover:text-destructive/80 transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <Trash2 className="h-4 w-4" /> Remove Item
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Order summary Panel (Right) */}
            <div className="space-y-6 text-left">
              <Card className="rounded-xl border shadow-sm">
                <CardContent className="p-6 space-y-6">
                  <h3 className="font-bold text-lg border-b pb-3">Order Summary</h3>
                  
                  {/* Summary grid */}
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between text-muted-foreground font-semibold">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-rose-600 font-bold">
                        <span>Discount {coupon && `(${coupon.code})`}</span>
                        <div className="flex items-center gap-1.5">
                          <span>-${discount.toFixed(2)}</span>
                          <X
                            className="h-3.5 w-3.5 cursor-pointer hover:text-rose-800"
                            onClick={removeCoupon}
                          />
                        </div>
                      </div>
                    )}
                    <div className="flex justify-between text-muted-foreground font-semibold">
                      <span>Shipping</span>
                      <span>
                        {shippingCost === 0 ? (
                          <span className="text-emerald-600 font-semibold">Free Express Shipping</span>
                        ) : (
                          `$${shippingCost.toFixed(2)}`
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between text-muted-foreground font-semibold">
                      <span>Estimated Sales Tax (8%)</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between text-base font-extrabold text-foreground border-t pt-4 mt-2">
                      <span>Total Amount</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Coupon Validation Input Form */}
                  {!coupon ? (
                    <form onSubmit={handleApplyCoupon} className="space-y-2 pt-2 border-t">
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Have a Coupon Code?</label>
                      <div className="flex space-x-2">
                        <div className="relative flex-1">
                          <Tag className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                          <Input
                            type="text"
                            placeholder="e.g. PREMIUM10"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            className="pl-9 bg-transparent"
                          />
                        </div>
                        <Button type="submit" variant="secondary" className="cursor-pointer" disabled={validateCouponMutation.isPending}>
                          {validateCouponMutation.isPending ? 'Validating' : 'Apply'}
                        </Button>
                      </div>
                      <p className="text-[10px] text-muted-foreground">Try code <span className="font-semibold text-foreground">PREMIUM10</span> to save 10% on your purchase.</p>
                    </form>
                  ) : (
                    <div className="flex items-center justify-between p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-md text-emerald-800 dark:text-emerald-400 text-xs font-semibold">
                      <div className="flex items-center space-x-1.5">
                        <Tag className="h-4 w-4" />
                        <span>Code &quot;{coupon.code}&quot; active</span>
                      </div>
                      <button onClick={removeCoupon} className="text-xs text-destructive hover:underline cursor-pointer">Remove</button>
                    </div>
                  )}

                  {/* Checkout CTA */}
                  <Button
                    onClick={() => router.push('/checkout')}
                    className="w-full h-11 font-bold cursor-pointer flex items-center justify-center space-x-2"
                  >
                    <CreditCard className="h-4 w-4" />
                    <span>Proceed to Checkout</span>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* 3. SAVE FOR LATER SHELF (FROM WISHLIST) */}
        {wishlistItems.length > 0 && (
          <section className="mt-16 text-left border-t pt-10">
            <h2 className="text-xl font-bold tracking-tight mb-6">Saved For Later (Wishlist)</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {wishlistItems.map((prod) => (
                <div key={prod.id} className="border rounded-xl bg-card overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between p-4">
                  <div className="space-y-3">
                    <div className="relative aspect-square w-full bg-secondary rounded-lg overflow-hidden">
                      <OptimizedImage src={prod.images[0]} alt={prod.name} fill />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">{prod.brand}</span>
                      <h4 className="font-semibold text-sm leading-snug line-clamp-1 mt-0.5">{prod.name}</h4>
                      <p className="text-sm font-bold text-foreground mt-1">${prod.basePrice}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <Button variant="outline" size="sm" onClick={() => removeFromWishlist(prod.id)} className="text-xs py-1 h-8 cursor-pointer">
                      Remove
                    </Button>
                    <Button size="sm" onClick={() => handleMoveToCart(prod)} className="text-xs py-1 h-8 cursor-pointer">
                      Move to Cart
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
