'use client';

import * as React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle2, Truck, Calendar, ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useOrderDetails } from '@/features/shared/hooks/queries';
import { Header } from '@/features/shared/components/Header';
import { Footer } from '@/features/shared/components/Footer';
import { Loader } from '@/components/common/Loader';
import { formatPrice } from '@/utils/currency';

export function CheckoutSuccessClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId') || '';

  const { data: order, isLoading } = useOrderDetails(orderId);

  // Auto scroll to top on mount
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (isLoading) {
    return <Loader fullPage />;
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold font-serif italic">Receipt Not Found</h2>
            <p className="text-muted-foreground mt-2 text-sm">We could not retrieve order details for ID &quot;{orderId}&quot;.</p>
            <Button className="mt-4 rounded-xl" onClick={() => router.push('/')}>Go Home</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Calculate delivery date (5 days from now)
  const deliveryDate = new Date(order.createdAt);
  deliveryDate.setDate(deliveryDate.getDate() + 5);



  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <Header />

      <main className="flex-1 max-w-md w-full mx-auto px-4 py-12 text-center space-y-8">
        
        {/* Animated Green Checkmark Header */}
        <div className="flex flex-col items-center space-y-4">
          <div className="h-20 w-20 rounded-full bg-emerald-500/10 flex items-center justify-center animate-scale-up">
            <CheckCircle2 className="h-12 w-12 text-emerald-600 stroke-[1.5]" />
          </div>
          <div className="space-y-1">
            <span className="text-[9px] uppercase tracking-[0.25em] font-black text-emerald-600 block">Step 4 of 4</span>
            <h1 className="text-3xl font-light font-serif text-zinc-900 leading-tight">Order Confirmed!</h1>
            <p className="text-xs text-muted-foreground max-w-xs mx-auto font-medium">
              Your order has been placed successfully. Your order will be delivered in 4 to 5 business days.
            </p>
          </div>
        </div>

        {/* Core Order Metadata cards */}
        <div className="space-y-3.5 text-left font-sans">
          
          <Card className="rounded-2xl border border-border/40 shadow-xs bg-secondary/5">
            <CardContent className="p-4 space-y-2.5 text-xs text-muted-foreground">
              <div className="flex justify-between items-center text-zinc-950 font-bold border-b pb-2 mb-1">
                <span className="flex items-center gap-1.5"><ShoppingBag className="h-4 w-4" /> Order Overview</span>
                <span>ID: #{order.id.slice(0, 8).toUpperCase()}</span>
              </div>
              {order.items.map((item, idx) => (
                <div key={idx} className="border-b border-border/10 pb-2.5 last:border-none last:pb-0 space-y-1">
                  <div className="flex justify-between">
                    <span>Fragrance:</span>
                    <span className="font-semibold text-zinc-900 truncate max-w-[180px]">{item.name}</span>
                  </div>
                  {item.attributes && Object.keys(item.attributes).length > 0 && (
                    <div className="flex justify-between text-[10px] text-zinc-500">
                      <span>Variant:</span>
                      <span>
                        {Object.entries(item.attributes)
                          .map(([k, v]) => `${k}: ${v}`)
                          .join(', ')}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Quantity & Unit Price:</span>
                    <span className="font-semibold text-zinc-900">{item.quantity} x {formatPrice(item.price)}</span>
                  </div>
                </div>
              ))}
              <div className="flex justify-between border-t pt-2.5 text-zinc-950 font-bold text-sm">
                <span>Paid Total:</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border border-border/40 shadow-xs bg-secondary/5">
            <CardContent className="p-4 space-y-2.5 text-xs text-muted-foreground">
              <div className="flex justify-between items-center text-zinc-950 font-bold border-b pb-2 mb-1">
                <span className="flex items-center gap-1.5"><Truck className="h-4 w-4" /> Shipping & Delivery</span>
              </div>
              <div className="flex justify-between">
                <span>Method:</span>
                <span className="font-semibold text-zinc-900">{order.shippingMethod}</span>
              </div>
              <div className="flex justify-between">
                <span>Recipient Address:</span>
                <span className="font-semibold text-zinc-900 truncate max-w-[180px]">{order.shippingAddress.addressLine1}</span>
              </div>
              <div className="flex justify-between items-center border-t pt-2.5 text-emerald-700 font-bold">
                <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> Delivery Estimate:</span>
                <span>4 to 5 business days</span>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Action Controls */}
        <div className="flex flex-col gap-3">
          <Button
            onClick={() => router.push('/')}
            className="w-full h-14 bg-zinc-950 hover:bg-zinc-800 text-white font-bold rounded-2xl uppercase text-xs tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            Continue Shopping <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

      </main>

      <Footer />
    </div>
  );
}
