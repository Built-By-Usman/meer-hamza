'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Key, Mail, Sparkles, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/auth';
import { useLogin } from '@/features/shared/hooks/queries';
import { toast } from 'sonner';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(4, 'Password must be at least 4 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const loginMutation = useLogin();
  const loginStore = useAuthStore((state) => state.login);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'usman@gmail.com',
      password: 'password',
    },
  });

  const onSubmit = (values: LoginFormValues) => {
    loginMutation.mutate(
      { email: values.email, password: values.password },
      {
        onSuccess: (data) => {
          loginStore(data.user, data.token);
          toast.success(`Welcome back, ${data.user.firstName}!`, {
            description: 'You have logged in successfully.',
          });
          reset();
          onClose();
        },
        onError: (err: any) => {
          toast.error(err.message || 'Invalid email or password', {
            description: 'Hint: use "usman@gmail.com" and any password.',
          });
        },
      }
    );
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} size="sm">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-1.5 justify-center">
          <Sparkles className="h-5 w-5 text-primary fill-primary" />
          <span>Member Login</span>
        </DialogTitle>
        <DialogDescription className="text-center">
          Access your personalized dashboard, track order receipts, and manage saved wishlists.
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent className="space-y-4 p-6">
          {/* Email field */}
          <div className="space-y-1 text-left">
            <label className="text-xs font-bold text-muted-foreground uppercase">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                {...register('email')}
                type="email"
                placeholder="usman@gmail.com"
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

          <p className="text-[10px] text-muted-foreground text-center">
            Demo user: <span className="font-semibold text-foreground">usman@gmail.com</span> / password
          </p>
        </DialogContent>
        <DialogFooter className="flex flex-col space-y-2">
          <Button type="submit" disabled={loginMutation.isPending} className="w-full cursor-pointer font-bold">
            {loginMutation.isPending ? (
              <span className="flex items-center justify-center gap-1">
                <Loader2 className="h-4 w-4 animate-spin" /> Loggin in...
              </span>
            ) : (
              <span>Sign In</span>
            )}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
