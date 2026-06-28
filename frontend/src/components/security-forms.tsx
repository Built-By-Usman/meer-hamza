'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Mail, Key, User, MapPin, Phone, CreditCard, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { sanitizeHTML } from '@/lib/sanitize';
import { toast } from 'sonner';

// ==========================================
// 1. SECURE LOGIN FORM
// ==========================================
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
});

type LoginSchemaType = z.infer<typeof loginSchema>;

export function SecureLoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginSchemaType) => {
    try {
      // Inputs sanitization before submitting (prevents stored XSS injections)
      const sanitizedEmail = sanitizeHTML(data.email);
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: sanitizedEmail, password: data.password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Invalid credentials');
      }

      toast.success('Successfully logged in!');
    } catch (err: any) {
      toast.error(err.message || 'Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md w-full mx-auto p-6 border rounded-2xl bg-card">
      <h3 className="font-serif text-xl font-semibold text-center mb-4">Login</h3>
      <div className="space-y-1">
        <label className="text-xs font-bold text-muted-foreground uppercase">Email</label>
        <div className="relative">
          <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input {...register('email')} type="email" placeholder="email@example.com" className="pl-9 bg-transparent" error={!!errors.email} />
        </div>
        {errors.email && <p className="text-[10px] text-destructive font-semibold">{errors.email.message}</p>}
      </div>

      <div className="space-y-1">
        <label className="text-xs font-bold text-muted-foreground uppercase">Password</label>
        <div className="relative">
          <Key className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input {...register('password')} type="password" placeholder="••••••••" className="pl-9 bg-transparent" error={!!errors.password} />
        </div>
        {errors.password && <p className="text-[10px] text-destructive font-semibold">{errors.password.message}</p>}
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full font-bold mt-2">
        {isSubmitting ? 'Verifying...' : 'Sign In'}
      </Button>
    </form>
  );
}

// ==========================================
// 2. SECURE REGISTRATION FORM
// ==========================================
const registerSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type RegisterSchemaType = z.infer<typeof registerSchema>;

export function SecureRegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterSchemaType>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterSchemaType) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: sanitizeHTML(data.firstName),
          lastName: sanitizeHTML(data.lastName),
          email: sanitizeHTML(data.email),
          password: data.password,
        }),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      toast.success('Account successfully registered!');
    } catch (err: any) {
      toast.error(err.message || 'Registration failed');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md w-full mx-auto p-6 border rounded-2xl bg-card">
      <h3 className="font-serif text-xl font-semibold text-center mb-4">Register</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-muted-foreground uppercase">First Name</label>
          <div className="relative">
            <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input {...register('firstName')} placeholder="Jane" className="pl-9 bg-transparent" error={!!errors.firstName} />
          </div>
          {errors.firstName && <p className="text-[10px] text-destructive font-semibold">{errors.firstName.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-muted-foreground uppercase">Last Name</label>
          <div className="relative">
            <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input {...register('lastName')} placeholder="Doe" className="pl-9 bg-transparent" error={!!errors.lastName} />
          </div>
          {errors.lastName && <p className="text-[10px] text-destructive font-semibold">{errors.lastName.message}</p>}
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-bold text-muted-foreground uppercase">Email</label>
        <div className="relative">
          <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input {...register('email')} type="email" placeholder="jane.doe@example.com" className="pl-9 bg-transparent" error={!!errors.email} />
        </div>
        {errors.email && <p className="text-[10px] text-destructive font-semibold">{errors.email.message}</p>}
      </div>

      <div className="space-y-1">
        <label className="text-xs font-bold text-muted-foreground uppercase">Password</label>
        <div className="relative">
          <Key className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input {...register('password')} type="password" placeholder="••••••••" className="pl-9 bg-transparent" error={!!errors.password} />
        </div>
        {errors.password && <p className="text-[10px] text-destructive font-semibold">{errors.password.message}</p>}
      </div>

      <div className="space-y-1">
        <label className="text-xs font-bold text-muted-foreground uppercase">Confirm Password</label>
        <div className="relative">
          <Key className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input {...register('confirmPassword')} type="password" placeholder="••••••••" className="pl-9 bg-transparent" error={!!errors.confirmPassword} />
        </div>
        {errors.confirmPassword && <p className="text-[10px] text-destructive font-semibold">{errors.confirmPassword.message}</p>}
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full font-bold mt-2">
        {isSubmitting ? 'Creating Account...' : 'Register'}
      </Button>
    </form>
  );
}

// ==========================================
// 3. SECURE CHECKOUT FORM
// ==========================================
const checkoutSchema = z.object({
  fullName: z.string().min(4, 'Please enter your full name'),
  addressLine1: z.string().min(5, 'Please enter a valid shipping address'),
  city: z.string().min(2, 'Please enter your city'),
  postalCode: z.string().min(4, 'Please enter a valid ZIP/Postal code'),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Please enter a valid E.164 phone number'),
  creditCardNumber: z.string().regex(/^\d{16}$/, 'Card number must be exactly 16 digits'),
  expiry: z.string().regex(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/, 'Expiry must be MM/YY format'),
  cvv: z.string().regex(/^\d{3,4}$/, 'CVV must be 3 or 4 digits'),
});

type CheckoutSchemaType = z.infer<typeof checkoutSchema>;

export function SecureCheckoutForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutSchemaType>({
    resolver: zodResolver(checkoutSchema),
  });

  const onSubmit = async (data: CheckoutSchemaType) => {
    try {
      // Strip out CC details from being processed in plain text JSON if using Stripe (Tokenize first client-side)
      // For demonstration, we sanitize inputs and submit payload via POST request
      const response = await fetch('/api/orders/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: sanitizeHTML(data.fullName),
          addressLine1: sanitizeHTML(data.addressLine1),
          city: sanitizeHTML(data.city),
          postalCode: sanitizeHTML(data.postalCode),
          phone: sanitizeHTML(data.phone),
          // In production, NEVER send raw CC details to your server. Use Stripe Elements / tokenization!
          paymentToken: 'tok_emulated_from_elements_client',
        }),
      });

      if (!response.ok) {
        throw new Error('Transaction declined');
      }

      toast.success('Order placed successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Payment processing failed');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-lg w-full mx-auto p-6 border rounded-2xl bg-card">
      <h3 className="font-serif text-xl font-semibold text-center mb-4">Checkout & Shipping</h3>

      <div className="space-y-4">
        <h4 className="font-semibold text-sm border-b pb-1 text-muted-foreground uppercase">Shipping Address</h4>
        
        <div className="space-y-1">
          <label className="text-xs font-bold text-muted-foreground uppercase">Full Name</label>
          <div className="relative">
            <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input {...register('fullName')} placeholder="Jane Doe" className="pl-9 bg-transparent" error={!!errors.fullName} />
          </div>
          {errors.fullName && <p className="text-[10px] text-destructive font-semibold">{errors.fullName.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-muted-foreground uppercase">Address</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input {...register('addressLine1')} placeholder="123 Luxury Dr" className="pl-9 bg-transparent" error={!!errors.addressLine1} />
          </div>
          {errors.addressLine1 && <p className="text-[10px] text-destructive font-semibold">{errors.addressLine1.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-muted-foreground uppercase">City</label>
            <Input {...register('city')} placeholder="New York" className="bg-transparent" error={!!errors.city} />
            {errors.city && <p className="text-[10px] text-destructive font-semibold">{errors.city.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-muted-foreground uppercase">ZIP / Postal Code</label>
            <Input {...register('postalCode')} placeholder="10001" className="bg-transparent" error={!!errors.postalCode} />
            {errors.postalCode && <p className="text-[10px] text-destructive font-semibold">{errors.postalCode.message}</p>}
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-muted-foreground uppercase">Phone Number (E.164)</label>
          <div className="relative">
            <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input {...register('phone')} placeholder="+15550199" className="pl-9 bg-transparent" error={!!errors.phone} />
          </div>
          {errors.phone && <p className="text-[10px] text-destructive font-semibold">{errors.phone.message}</p>}
        </div>
      </div>

      <div className="space-y-4 pt-4">
        <div className="flex items-center gap-1 text-amber-600">
          <ShieldAlert className="h-4 w-4" />
          <h4 className="font-semibold text-sm text-amber-700 uppercase">Secure Payment details</h4>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-muted-foreground uppercase">Card Number</label>
          <div className="relative">
            <CreditCard className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input {...register('creditCardNumber')} placeholder="0000000000000000" className="pl-9 bg-transparent" error={!!errors.creditCardNumber} />
          </div>
          {errors.creditCardNumber && <p className="text-[10px] text-destructive font-semibold">{errors.creditCardNumber.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-muted-foreground uppercase">Expiry (MM/YY)</label>
            <Input {...register('expiry')} placeholder="12/28" className="bg-transparent" error={!!errors.expiry} />
            {errors.expiry && <p className="text-[10px] text-destructive font-semibold">{errors.expiry.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-muted-foreground uppercase">CVV</label>
            <Input {...register('cvv')} type="password" placeholder="•••" className="bg-transparent" error={!!errors.cvv} />
            {errors.cvv && <p className="text-[10px] text-destructive font-semibold">{errors.cvv.message}</p>}
          </div>
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full font-bold mt-4 bg-zinc-950 text-white hover:bg-zinc-800">
        {isSubmitting ? 'Processing Payment...' : 'Pay & Order'}
      </Button>
    </form>
  );
}
