'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Key, Mail, Sparkles, Loader2, User } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/auth';
import { useLogin, useRegister } from '@/features/shared/hooks/queries';
import { toast } from 'sonner';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const authSchema = z.object({
  fullName: z.string().optional(),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type AuthFormValues = z.infer<typeof authSchema>;

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = React.useState<'login' | 'signup'>('login');
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const loginStore = useAuthStore((state) => state.login);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
    },
  });

  // Reset form when changing mode or opening/closing dialog
  React.useEffect(() => {
    reset();
  }, [mode, isOpen, reset]);

  const onSubmit = (values: AuthFormValues) => {
    if (mode === 'login') {
      loginMutation.mutate(
        { email: values.email, password: values.password },
        {
          onSuccess: (data) => {
            loginStore(data.user, data.token);
            toast.success(`Welcome back, ${data.user.firstName}!`, {
              description: 'You have logged in successfully.',
            });
            onClose();
          },
          onError: (err: any) => {
            toast.error(err.message || 'Invalid email or password');
          },
        }
      );
    } else {
      if (!values.fullName?.trim()) {
        toast.error('Full Name is required for registration.');
        return;
      }
      registerMutation.mutate(
        {
          email: values.email,
          password: values.password,
          fullName: values.fullName.trim(),
        },
        {
          onSuccess: (data) => {
            loginStore(data.user, data.token);
            toast.success(`Welcome, ${data.user.firstName}!`, {
              description: 'Your account has been registered and logged in successfully.',
            });
            onClose();
          },
          onError: (err: any) => {
            toast.error(err.message || 'Registration failed. Email might already exist.');
          },
        }
      );
    }
  };

  const isPending = loginMutation.isPending || registerMutation.isPending;

  return (
    <Dialog isOpen={isOpen} onClose={onClose} size="sm">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-1.5 justify-center">
          <Sparkles className="h-5 w-5 text-primary fill-primary animate-pulse" />
          <span>{mode === 'login' ? 'Member Login' : 'Create Account'}</span>
        </DialogTitle>
        <DialogDescription className="text-center">
          {mode === 'login'
            ? 'Access your personalized dashboard, track order receipts, and manage saved wishlists.'
            : 'Register a new customer account to start saving items and tracking delivery status.'}
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent className="space-y-4 p-6">
          {/* Full Name field (Sign Up Mode Only) */}
          {mode === 'signup' && (
            <div className="space-y-1 text-left">
              <label className="text-xs font-bold text-muted-foreground uppercase">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  {...register('fullName')}
                  type="text"
                  placeholder="e.g. Ahmed Khan"
                  className="pl-9 bg-transparent"
                  error={!!errors.fullName}
                />
              </div>
              {errors.fullName && <p className="text-[10px] text-destructive font-semibold">{errors.fullName.message}</p>}
            </div>
          )}

          {/* Email field */}
          <div className="space-y-1 text-left">
            <label className="text-xs font-bold text-muted-foreground uppercase">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                {...register('email')}
                type="email"
                placeholder="example@gmail.com"
                className="pl-9 bg-transparent"
                error={!!errors.email}
              />
            </div>
            {errors.email && <p className="text-[10px] text-destructive font-semibold">{errors.email.message}</p>}
          </div>

          {/* Password field */}
          <div className="space-y-1 text-left">
            <label className="text-xs font-bold text-muted-foreground uppercase">Password</label>
            <div className="relative">
              <Key className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                {...register('password')}
                type="password"
                placeholder="••••••••"
                className="pl-9 bg-transparent"
                error={!!errors.password}
              />
            </div>
            {errors.password && <p className="text-[10px] text-destructive font-semibold">{errors.password.message}</p>}
          </div>
        </DialogContent>

        <DialogFooter className="flex flex-col space-y-4">
          <Button type="submit" disabled={isPending} className="w-full cursor-pointer font-bold py-6 rounded-xl">
            {isPending ? (
              <span className="flex items-center justify-center gap-1.5">
                <Loader2 className="h-4 w-4 animate-spin" />
                {mode === 'login' ? 'Logging in...' : 'Registering...'}
              </span>
            ) : (
              <span>{mode === 'login' ? 'Sign In' : 'Sign Up'}</span>
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            {mode === 'login' ? (
              <>
                Don&apos;t have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className="font-bold text-zinc-950 underline hover:text-zinc-800 cursor-pointer"
                >
                  Sign Up
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="font-bold text-zinc-950 underline hover:text-zinc-800 cursor-pointer"
                >
                  Sign In
                </button>
              </>
            )}
          </p>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
