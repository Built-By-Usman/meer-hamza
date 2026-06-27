'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { CreditCard, Truck, MapPin, ArrowRight, ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Header } from '@/features/shared/components/Header';
import { Footer } from '@/features/shared/components/Footer';
import { Loader } from '@/components/common/Loader';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { useCartStore } from '@/store/cart';
import { useAuthStore } from '@/store/auth';
import { useCreateOrder } from '@/features/shared/hooks/queries';
import { toast } from 'sonner';

// --- ZOD VALIDATION SCHEMA ---
const checkoutSchema = z.object({
  // Shipping Address
  firstName: z.string().min(2, 'First name is required (min 2 chars)'),
  lastName: z.string().min(2, 'Last name is required (min 2 chars)'),
  addressLine1: z.string().min(5, 'Address is required (min 5 chars)'),
  addressLine2: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required (e.g. CA)'),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, 'ZIP code must be 5 digits (e.g. 94105)'),
  country: z.string().min(2, 'Country is required'),
  phone: z.string().min(10, 'Provide a valid phone number (min 10 digits)'),

  // Shipping Method
  shippingMethod: z.string(),

  // Payment Details
  cardholderName: z.string().min(4, 'Cardholder name is required'),
  cardNumber: z.string().regex(/^\d{16}$/, 'Card number must be 16 digits'),
  cardExpiry: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Expiry must be in MM/YY format'),
  cardCvv: z.string().regex(/^\d{3}$/, 'CVV must be 3 digits'),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export function CheckoutClient() {
  const router = useRouter();
  const [step, setStep] = React.useState<1 | 2 | 3>(1);

  const { items, subtotal, discount, tax, shippingCost, total, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const createOrderMutation = useCreateOrder();

  // Redirect if cart is empty on mount
  React.useEffect(() => {
    if (items.length === 0 && createOrderMutation.isIdle) {
      router.push('/cart');
    }
  }, [items, router, createOrderMutation]);

  // Form initialization with React Hook Form
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    trigger,
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      country: 'USA',
      shippingMethod: shippingCost === 0 ? 'standard_free' : 'standard_paid',
      cardholderName: user ? `${user.firstName} ${user.lastName}` : '',
    },
  });

  const selectedShipping = watch('shippingMethod');

  // Shipping cost adjusts dynamically based on choice
  const getShippingCostValue = (method: string) => {
    if (method === 'standard_free') return 0;
    if (method === 'standard_paid') return 15;
    if (method === 'express') return 25;
    if (method === 'overnight') return 45;
    return 15;
  };

  const finalShippingCost = getShippingCostValue(selectedShipping);
  const finalTotal = parseFloat((subtotal - discount + tax + finalShippingCost).toFixed(2));

  // Step advancement validation
  const nextStep = async () => {
    if (step === 1) {
      const isStep1Valid = await trigger([
        'firstName',
        'lastName',
        'addressLine1',
        'city',
        'state',
        'zipCode',
        'country',
        'phone',
      ]);
      if (isStep1Valid) setStep(2);
    } else if (step === 2) {
      const isStep2Valid = await trigger(['shippingMethod']);
      if (isStep2Valid) setStep(3);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep((s) => (s - 1) as any);
    }
  };

  // Submit final order to repository
  const onSubmit = (values: CheckoutFormValues) => {
    const orderInput = {
      userId: user?.id || 'guest',
      items,
      subtotal,
      discount,
      tax,
      shippingCost: finalShippingCost,
      total: finalTotal,
      shippingAddress: {
        firstName: values.firstName,
        lastName: values.lastName,
        addressLine1: values.addressLine1,
        addressLine2: values.addressLine2,
        city: values.city,
        state: values.state,
        zipCode: values.zipCode,
        country: values.country,
        phone: values.phone,
      },
      billingAddress: {
        firstName: values.firstName,
        lastName: values.lastName,
        addressLine1: values.addressLine1,
        addressLine2: values.addressLine2,
        city: values.city,
        state: values.state,
        zipCode: values.zipCode,
        country: values.country,
        phone: values.phone,
      },
      shippingMethod:
        values.shippingMethod === 'express'
          ? 'Express Shipping (2-3 Days)'
          : values.shippingMethod === 'overnight'
          ? 'Overnight Delivery (Next Business Day)'
          : 'Standard Ground Shipping (5-7 Days)',
      paymentMethod: `Credit Card (ending in ${values.cardNumber.slice(-4)})`,
    };

    createOrderMutation.mutate(orderInput, {
      onSuccess: (order) => {
        clearCart();
        toast.success('Order placed successfully!', {
          description: `Order ID: ${order.id}`,
        });
        router.push(`/checkout/success?orderId=${order.id}`);
      },
      onError: () => {
        toast.error('An error occurred while creating your order.');
      },
    });
  };

  if (items.length === 0 && createOrderMutation.isIdle) {
    return <Loader fullPage />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-extrabold text-foreground text-left tracking-tight mb-8 border-b pb-4">
          Checkout Flow
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* A. Wizard Form Column (Left) */}
          <div className="lg:col-span-2 space-y-6 text-left">
            {/* Step Indicators */}
            <div className="flex items-center justify-between border bg-secondary/10 rounded-lg p-4 mb-2">
              {[
                { number: 1, label: 'Address', icon: <MapPin className="h-4 w-4" /> },
                { number: 2, label: 'Shipping', icon: <Truck className="h-4 w-4" /> },
                { number: 3, label: 'Payment', icon: <CreditCard className="h-4 w-4" /> },
              ].map((s) => {
                const isActive = step === s.number;
                const isCompleted = step > s.number;
                return (
                  <div key={s.number} className="flex items-center space-x-2">
                    <div
                      className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : isCompleted
                          ? 'bg-emerald-600 text-white'
                          : 'bg-secondary text-muted-foreground'
                      }`}
                    >
                      {isCompleted ? '✓' : s.number}
                    </div>
                    <span
                      className={`text-xs font-semibold hidden sm:inline ${
                        isActive ? 'text-foreground' : 'text-muted-foreground'
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Steps Panels */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* STEP 1: SHIPPING ADDRESS */}
              {step === 1 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold border-b pb-2 mb-4">1. Shipping Address</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-muted-foreground uppercase">First Name</label>
                      <Input {...register('firstName')} error={!!errors.firstName} placeholder="Hamza" />
                      {errors.firstName && <p className="text-[10px] text-destructive font-semibold">{errors.firstName.message}</p>}
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-muted-foreground uppercase">Last Name</label>
                      <Input {...register('lastName')} error={!!errors.lastName} placeholder="Meer" />
                      {errors.lastName && <p className="text-[10px] text-destructive font-semibold">{errors.lastName.message}</p>}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-muted-foreground uppercase">Address Line 1</label>
                    <Input {...register('addressLine1')} error={!!errors.addressLine1} placeholder="123 Tech Lane" />
                    {errors.addressLine1 && <p className="text-[10px] text-destructive font-semibold">{errors.addressLine1.message}</p>}
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-muted-foreground uppercase">Address Line 2 (Optional)</label>
                    <Input {...register('addressLine2')} placeholder="Apt, Suite, Building, Unit" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-muted-foreground uppercase">City</label>
                      <Input {...register('city')} error={!!errors.city} placeholder="San Francisco" />
                      {errors.city && <p className="text-[10px] text-destructive font-semibold">{errors.city.message}</p>}
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-muted-foreground uppercase">State / Region</label>
                      <Input {...register('state')} error={!!errors.state} placeholder="CA" />
                      {errors.state && <p className="text-[10px] text-destructive font-semibold">{errors.state.message}</p>}
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-muted-foreground uppercase">ZIP Code</label>
                      <Input {...register('zipCode')} error={!!errors.zipCode} placeholder="94105" />
                      {errors.zipCode && <p className="text-[10px] text-destructive font-semibold">{errors.zipCode.message}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-muted-foreground uppercase">Country</label>
                      <Select {...register('country')}>
                        <option value="USA">United States (USA)</option>
                        <option value="UK">United Kingdom (UK)</option>
                        <option value="PK">Pakistan (PK)</option>
                        <option value="CA">Canada (CA)</option>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-muted-foreground uppercase">Phone Number</label>
                      <Input {...register('phone')} error={!!errors.phone} placeholder="5550192831" />
                      {errors.phone && <p className="text-[10px] text-destructive font-semibold">{errors.phone.message}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: SHIPPING METHODS */}
              {step === 2 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold border-b pb-2 mb-4">2. Shipping Tiers</h3>
                  <div className="space-y-3">
                    {/* Free shipping option */}
                    {shippingCost === 0 && (
                      <label className="flex items-center justify-between border p-4 rounded-lg cursor-pointer hover:bg-secondary/20">
                        <div className="flex items-center space-x-3">
                          <input type="radio" value="standard_free" {...register('shippingMethod')} className="h-4 w-4" />
                          <div>
                            <p className="text-sm font-semibold">Standard Ground Shipping</p>
                            <p className="text-xs text-muted-foreground">Delivery in 5-7 business days</p>
                          </div>
                        </div>
                        <span className="text-sm font-bold text-emerald-600">FREE (Promotion)</span>
                      </label>
                    )}

                    {/* Paid standard shipping option */}
                    {shippingCost > 0 && (
                      <label className="flex items-center justify-between border p-4 rounded-lg cursor-pointer hover:bg-secondary/20">
                        <div className="flex items-center space-x-3">
                          <input type="radio" value="standard_paid" {...register('shippingMethod')} className="h-4 w-4" />
                          <div>
                            <p className="text-sm font-semibold">Standard Ground Shipping</p>
                            <p className="text-xs text-muted-foreground">Delivery in 5-7 business days</p>
                          </div>
                        </div>
                        <span className="text-sm font-bold">$15.00</span>
                      </label>
                    )}

                    {/* Express shipping */}
                    <label className="flex items-center justify-between border p-4 rounded-lg cursor-pointer hover:bg-secondary/20">
                      <div className="flex items-center space-x-3">
                        <input type="radio" value="express" {...register('shippingMethod')} className="h-4 w-4" />
                        <div>
                          <p className="text-sm font-semibold">Express 2-Day shipping</p>
                          <p className="text-xs text-muted-foreground">Delivery in 2-3 business days</p>
                        </div>
                      </div>
                      <span className="text-sm font-bold">$25.00</span>
                    </label>

                    {/* Overnight delivery */}
                    <label className="flex items-center justify-between border p-4 rounded-lg cursor-pointer hover:bg-secondary/20">
                      <div className="flex items-center space-x-3">
                        <input type="radio" value="overnight" {...register('shippingMethod')} className="h-4 w-4" />
                        <div>
                          <p className="text-sm font-semibold">Overnight Delivery</p>
                          <p className="text-xs text-muted-foreground">Next business day delivery</p>
                        </div>
                      </div>
                      <span className="text-sm font-bold">$45.00</span>
                    </label>
                  </div>
                </div>
              )}

              {/* STEP 3: PAYMENT DETAILS */}
              {step === 3 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold border-b pb-2 mb-4">3. Secure Credit Card Payment</h3>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-muted-foreground uppercase">Cardholder Name</label>
                      <Input {...register('cardholderName')} error={!!errors.cardholderName} placeholder="Hamza Meer" />
                      {errors.cardholderName && <p className="text-[10px] text-destructive font-semibold">{errors.cardholderName.message}</p>}
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-muted-foreground uppercase">Credit Card Number</label>
                      <Input {...register('cardNumber')} error={!!errors.cardNumber} placeholder="1111222233334444" maxLength={16} />
                      {errors.cardNumber && <p className="text-[10px] text-destructive font-semibold">{errors.cardNumber.message}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-muted-foreground uppercase">Expiration Date</label>
                        <Input {...register('cardExpiry')} error={!!errors.cardExpiry} placeholder="05/29" maxLength={5} />
                        {errors.cardExpiry && <p className="text-[10px] text-destructive font-semibold">{errors.cardExpiry.message}</p>}
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-muted-foreground uppercase">CVV / Code</label>
                        <Input {...register('cardCvv')} error={!!errors.cardCvv} placeholder="123" maxLength={3} />
                        {errors.cardCvv && <p className="text-[10px] text-destructive font-semibold">{errors.cardCvv.message}</p>}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Controls */}
              <div className="flex items-center justify-between border-t pt-6">
                {step > 1 ? (
                  <Button type="button" variant="outline" onClick={prevStep} className="cursor-pointer">
                    <ArrowLeft className="h-4 w-4 mr-1.5" /> Back
                  </Button>
                ) : (
                  <div />
                )}

                {step < 3 ? (
                  <Button type="button" onClick={nextStep} className="cursor-pointer">
                    Continue <ArrowRight className="h-4 w-4 ml-1.5" />
                  </Button>
                ) : (
                  <Button type="submit" disabled={createOrderMutation.isPending} className="cursor-pointer font-bold bg-primary text-primary-foreground hover:bg-primary/90">
                    {createOrderMutation.isPending ? (
                      <span className="flex items-center space-x-1.5">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Processing Order...</span>
                      </span>
                    ) : (
                      <span>Place Order (${finalTotal.toFixed(2)})</span>
                    )}
                  </Button>
                )}
              </div>
            </form>
          </div>

          {/* B. Order Summary Column (Right) */}
          <div className="space-y-6 text-left">
            <Card className="rounded-xl border shadow-sm sticky top-24 bg-card/25">
              <CardContent className="p-6 space-y-4">
                <h3 className="font-bold text-base border-b pb-3 flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-primary fill-primary" /> Shopping Bag Summary
                </h3>

                {/* Items loop */}
                <div className="max-h-[220px] overflow-y-auto space-y-3 pr-2 no-scrollbar border-b pb-4">
                  {items.map((item) => (
                    <div key={`${item.productId}-${item.variantId || ''}`} className="flex items-center space-x-3 text-xs">
                      <div className="relative h-12 w-12 border rounded bg-secondary flex-shrink-0">
                        <OptimizedImage src={item.image} alt={item.name} fill />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-foreground truncate">{item.name}</p>
                        <p className="text-muted-foreground mt-0.5">Qty: {item.quantity} · ${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pricing summary */}
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-muted-foreground font-semibold">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-rose-600 font-bold">
                      <span>Discount</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-muted-foreground font-semibold">
                    <span>Shipping fee</span>
                    <span>
                      {finalShippingCost === 0 ? (
                        <span className="text-emerald-600 font-semibold">Free</span>
                      ) : (
                        `$${finalShippingCost.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-muted-foreground font-semibold">
                    <span>Sales tax (8%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-extrabold text-foreground border-t pt-3 mt-2">
                    <span>Grand Total</span>
                    <span>${finalTotal.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
