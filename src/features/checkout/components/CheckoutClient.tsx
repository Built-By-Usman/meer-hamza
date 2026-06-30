'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Truck, MapPin, Loader2, Sparkles } from 'lucide-react';
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
import { useCreateOrder, useSettings, useMyAddress, useUpdateMyAddress } from '@/features/shared/hooks/queries';
import { toast } from 'sonner';
import { formatPrice } from '@/utils/currency';

// --- ZOD VALIDATION SCHEMA ---
const checkoutSchema = z.object({
  // Shipping Address
  firstName: z.string().min(2, 'First name is required (min 2 chars)'),
  lastName: z.string().min(2, 'Last name is required (min 2 chars)'),
  addressLine1: z.string().min(5, 'Address is required (min 5 chars)'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zipCode: z.string().min(3, 'ZIP code is required'),
  country: z.string().min(2, 'Country is required'),
  phone: z.string().min(10, 'Provide a valid phone number (min 10 digits)'),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export function CheckoutClient() {
  const router = useRouter();
  const [step, setStep] = React.useState<1 | 2 | 3>(1);
  const [mounted, setMounted] = React.useState(false);

  const { items, subtotal, discount, shippingCost, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const createOrderMutation = useCreateOrder();
  const { data: storeSettings } = useSettings();
  const { data: savedAddress } = useMyAddress(!!user);
  const updateAddressMutation = useUpdateMyAddress();

  // Set mounted state on client mount to ensure hydration is completed
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect if cart is empty on mount (only after mounting/hydration is completed)
  React.useEffect(() => {
    if (mounted && items.length === 0 && createOrderMutation.isIdle) {
      router.push('/');
    }
  }, [mounted, items, router, createOrderMutation]);

  // Form initialization with React Hook Form
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      country: 'PK',
      state: 'Punjab',
      zipCode: '54000',
    },
  });

  // Pre-fill form with saved address once it loads
  React.useEffect(() => {
    if (savedAddress) {
      setValue('firstName', savedAddress.firstName || '');
      setValue('lastName', savedAddress.lastName || '');
      setValue('addressLine1', savedAddress.addressLine1 || '');
      setValue('city', savedAddress.city || '');
      setValue('state', savedAddress.state || 'Punjab');
      setValue('zipCode', savedAddress.zipCode || '54000');
      setValue('country', savedAddress.country || 'PK');
      setValue('phone', savedAddress.phone || '');
    }
  }, [savedAddress, setValue]);

  const baseShipping = storeSettings !== undefined ? storeSettings.delivery_charges : shippingCost;
  const minOrderForFree = storeSettings?.min_order_amount || 0;
  const finalShippingCost = (minOrderForFree > 0 && subtotal >= minOrderForFree) ? 0 : baseShipping;
  const finalTotal = Math.max(0, parseFloat((subtotal - discount + finalShippingCost).toFixed(2)));

  // Submit final order to repository
  const onSubmit = (values: CheckoutFormValues) => {
    setStep(3); // Enter automatic placing order loading state (Step 3)
    const orderInput = {
      userId: user?.id || 'guest',
      items,
      subtotal,
      discount,
      tax: 0,
      shippingCost: finalShippingCost,
      total: finalTotal,
      shippingAddress: {
        firstName: values.firstName,
        lastName: values.lastName,
        addressLine1: values.addressLine1,
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
        city: values.city,
        state: values.state,
        zipCode: values.zipCode,
        country: values.country,
        phone: values.phone,
      },
      shippingMethod: 'Standard Ground Shipping (5-7 Days)',
      paymentMethod: 'Cash on Delivery',
    };

    createOrderMutation.mutate(orderInput, {
      onSuccess: (order) => {
        clearCart();
        // Silently save the address for next visit if user is logged in
        if (user) {
          updateAddressMutation.mutate({
            firstName: values.firstName,
            lastName: values.lastName,
            addressLine1: values.addressLine1,
            city: values.city,
            state: values.state,
            zipCode: values.zipCode,
            country: values.country,
            phone: values.phone,
          });
        }
        toast.success('Order placed successfully!', {
          description: `Order ID: #${order.id.slice(0, 8).toUpperCase()}`,
        });
        router.push(`/checkout/success?orderId=${order.id}`);
      },
      onError: () => {
        toast.error('An error occurred while creating your order.');
      },
    });
  };

  if (!mounted || (items.length === 0 && createOrderMutation.isIdle)) {
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
            {/* Steps Panels */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* STEP 1: SHIPPING ADDRESS */}
              {step === 1 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold border-b pb-2 mb-4">Delivery Details</h3>

                  {/* Saved address notice */}
                  {savedAddress && (
                    <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-2.5">
                      <span className="text-green-600 text-xs font-bold">✓ Saved address pre-filled</span>
                      <span className="text-green-500 text-xs">— you can edit any field below</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-muted-foreground uppercase">First Name</label>
                      <Input {...register('firstName')} error={!!errors.firstName} placeholder="e.g. Ahmed" />
                      {errors.firstName && <p className="text-[10px] text-destructive font-semibold">{errors.firstName.message}</p>}
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-muted-foreground uppercase">Last Name</label>
                      <Input {...register('lastName')} error={!!errors.lastName} placeholder="e.g. Khan" />
                      {errors.lastName && <p className="text-[10px] text-destructive font-semibold">{errors.lastName.message}</p>}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-muted-foreground uppercase">Street Address</label>
                    <Input {...register('addressLine1')} error={!!errors.addressLine1} placeholder="Street address, apartment, or house number" />
                    {errors.addressLine1 && <p className="text-[10px] text-destructive font-semibold">{errors.addressLine1.message}</p>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-muted-foreground uppercase">City</label>
                      <Input {...register('city')} error={!!errors.city} placeholder="Enter your city" />
                      {errors.city && <p className="text-[10px] text-destructive font-semibold">{errors.city.message}</p>}
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-muted-foreground uppercase">State / Region</label>
                      <Input {...register('state')} error={!!errors.state} placeholder="Punjab, Sindh, etc." />
                      {errors.state && <p className="text-[10px] text-destructive font-semibold">{errors.state.message}</p>}
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-muted-foreground uppercase">ZIP Code</label>
                      <Input {...register('zipCode')} error={!!errors.zipCode} placeholder="54000" />
                      {errors.zipCode && <p className="text-[10px] text-destructive font-semibold">{errors.zipCode.message}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-muted-foreground uppercase">Country</label>
                      <Select {...register('country')}>
                        <option value="PK">Pakistan (PK)</option>
                        <option value="USA">United States (USA)</option>
                        <option value="UK">United Kingdom (UK)</option>
                        <option value="CA">Canada (CA)</option>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-muted-foreground uppercase">Phone Number</label>
                      <Input {...register('phone')} error={!!errors.phone} placeholder="e.g. 03001234567" />
                      {errors.phone && <p className="text-[10px] text-destructive font-semibold">{errors.phone.message}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: AUTOMATIC ORDER SUBMISSION STATE */}
              {step === 3 && (
                <div className="flex flex-col items-center justify-center py-16 text-center space-y-4 bg-secondary/5 rounded-2xl p-6 border border-dashed">
                  <Loader2 className="h-10 w-10 animate-spin text-primary" />
                  <h3 className="text-lg font-bold text-foreground">Placing Your Order...</h3>
                  <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
                    Please wait while we register and confirm your Cash on Delivery order.
                  </p>
                </div>
              )}

              {/* Navigation Controls */}
              {step === 1 && (
                <div className="border-t pt-6">
                  <Button
                    type="submit"
                    disabled={createOrderMutation.isPending}
                    className="w-full py-6 text-xs font-bold uppercase tracking-wider bg-zinc-950 text-white hover:bg-zinc-900 rounded-xl cursor-pointer"
                  >
                    {createOrderMutation.isPending ? (
                      <span className="flex items-center justify-center space-x-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Processing Order...</span>
                      </span>
                    ) : (
                      <span>Place Cash on Delivery Order ({formatPrice(finalTotal)})</span>
                    )}
                  </Button>
                </div>
              )}
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
                        <p className="text-muted-foreground mt-0.5">Qty: {item.quantity} · {formatPrice(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                 {/* Pricing summary */}
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-muted-foreground font-semibold">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-rose-600 font-bold">
                      <span>Discount</span>
                      <span>-{formatPrice(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-muted-foreground font-semibold">
                    <span>Shipping fee</span>
                    <span>
                      {finalShippingCost === 0 ? (
                        <span className="text-emerald-600 font-semibold">Free</span>
                      ) : (
                        `${formatPrice(finalShippingCost)}`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-extrabold text-foreground border-t pt-3 mt-2">
                    <span>Grand Total</span>
                    <span>{formatPrice(finalTotal)}</span>
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
