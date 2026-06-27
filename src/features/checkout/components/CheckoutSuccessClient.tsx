'use client';

import * as React from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle2, ShoppingBag, Truck, Calendar, CreditCard, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader } from '@/components/common/Loader';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { useOrderDetails } from '@/features/shared/hooks/queries';
import { Header } from '@/features/shared/components/Header';
import { Footer } from '@/features/shared/components/Footer';

export function CheckoutSuccessClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId') || '';

  const { data: order, isLoading } = useOrderDetails(orderId);

  if (isLoading) {
    return <Loader fullPage />;
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Receipt Not Found</h2>
            <p className="text-muted-foreground mt-2">We could not retrieve order details for ID &quot;{orderId}&quot;.</p>
            <Button className="mt-4" onClick={() => router.push('/')}>Go Home</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Calculate estimated delivery (5 days from today)
  const deliveryDate = new Date(order.createdAt);
  deliveryDate.setDate(deliveryDate.getDate() + 5);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8 text-center sm:text-left">
          {/* Header checkmark */}
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left space-y-3 pb-6 border-b">
            <CheckCircle2 className="h-16 w-16 text-emerald-500 fill-emerald-500/10 stroke-[1.25]" />
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">Order Confirmed!</h1>
              <p className="text-sm text-muted-foreground mt-1.5">
                Thank you for your purchase. We have sent a confirmation email to your registered address.
              </p>
            </div>
          </div>

          {/* Quick Invoice metadata card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            <Card className="rounded-xl border shadow-sm">
              <CardContent className="p-5 space-y-2 text-sm">
                <h3 className="font-bold flex items-center gap-1.5"><ShoppingBag className="h-4 w-4 text-muted-foreground" /> Order Details</h3>
                <div>Order ID: <span className="font-semibold text-foreground">{order.id}</span></div>
                <div>Status: <Badge variant="success" className="text-[9px] py-0 font-bold uppercase tracking-wider">{order.status}</Badge></div>
                <div>Created: <span className="font-semibold text-foreground">{new Date(order.createdAt).toLocaleDateString()}</span></div>
              </CardContent>
            </Card>

            <Card className="rounded-xl border shadow-sm">
              <CardContent className="p-5 space-y-2 text-sm">
                <h3 className="font-bold flex items-center gap-1.5"><Truck className="h-4 w-4 text-muted-foreground" /> Shipping Details</h3>
                <div>Carrier Code: <span className="font-semibold text-foreground">{order.trackingNumber || 'Pending'}</span></div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Delivery Est: <span className="font-semibold text-foreground">{deliveryDate.toLocaleDateString()}</span></span>
                </div>
                <div>Method: <span className="font-semibold text-foreground truncate block max-w-[200px]">{order.shippingMethod}</span></div>
              </CardContent>
            </Card>
          </div>

          {/* Items Summary list */}
          <div className="text-left border rounded-xl overflow-hidden divide-y bg-card">
            <div className="p-5 bg-secondary/10 border-b">
              <h3 className="font-bold text-sm text-foreground uppercase tracking-wider">Items Purchased</h3>
            </div>
            
            <div className="divide-y divide-border p-2">
              {order.items.map((item) => (
                <div key={`${item.productId}-${item.variantId || ''}`} className="flex items-center p-4">
                  <div className="relative h-16 w-16 border rounded bg-secondary flex-shrink-0">
                    <OptimizedImage src={item.image} alt={item.name} fill />
                  </div>
                  <div className="ml-4 flex-1 min-w-0">
                    <h4 className="font-semibold text-sm truncate">{item.name}</h4>
                    {item.attributes && Object.keys(item.attributes).length > 0 && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {Object.entries(item.attributes)
                          .map(([key, val]) => `${key}: ${val}`)
                          .join(' · ')}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-0.5">Qty: {item.quantity} · ${item.price} each</p>
                  </div>
                  <span className="font-bold text-sm ml-4">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="p-5 bg-secondary/15 text-sm space-y-1.5 border-t">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-rose-600 font-semibold">
                  <span>Applied discount</span>
                  <span>-${order.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping cost</span>
                <span>{order.shippingCost === 0 ? 'Free' : `$${order.shippingCost.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Sales Tax (8%)</span>
                <span>${order.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-extrabold border-t pt-3 mt-2 text-foreground">
                <span>Paid Total</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Checkout success actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t pt-6 bg-transparent">
            <div className="flex items-center space-x-1.5 text-xs text-muted-foreground">
              <CreditCard className="h-4 w-4 text-emerald-600" />
              <span>Paid via {order.paymentMethod}</span>
            </div>
            
            <Link href="/category/all">
              <Button className="cursor-pointer font-bold flex items-center gap-1.5">
                <span>Continue Shopping</span> <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
