'use client';

import * as React from 'react';
import Link from 'next/link';
import { Send, ShieldCheck, Truck, RefreshCcw, Headphones, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export function Footer() {
  const [email, setEmail] = React.useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter a valid email address');
      return;
    }
    // simple email check
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isEmail) {
      toast.error('Please provide a correctly formatted email');
      return;
    }

    toast.success('Successfully subscribed to our premium newsletter!', {
      description: 'Check your inbox soon for exclusive offers.',
    });
    setEmail('');
  };

  return (
    <footer className="w-full bg-secondary/30 border-t mt-auto">
      {/* 1. Trust Badges Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-b grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="flex items-center space-x-3 text-left">
          <Truck className="h-6 w-6 text-muted-foreground flex-shrink-0" />
          <div>
            <h4 className="text-sm font-semibold">Free Express Shipping</h4>
            <p className="text-xs text-muted-foreground">On all orders over $150 USD</p>
          </div>
        </div>
        <div className="flex items-center space-x-3 text-left">
          <ShieldCheck className="h-6 w-6 text-muted-foreground flex-shrink-0" />
          <div>
            <h4 className="text-sm font-semibold">Secure checkout</h4>
            <p className="text-xs text-muted-foreground">SSL Encrypted payment portals</p>
          </div>
        </div>
        <div className="flex items-center space-x-3 text-left">
          <RefreshCcw className="h-6 w-6 text-muted-foreground flex-shrink-0" />
          <div>
            <h4 className="text-sm font-semibold">30-Day Hassle-Free Returns</h4>
            <p className="text-xs text-muted-foreground">Easy size changes or full refunds</p>
          </div>
        </div>
        <div className="flex items-center space-x-3 text-left">
          <Headphones className="h-6 w-6 text-muted-foreground flex-shrink-0" />
          <div>
            <h4 className="text-sm font-semibold">24/7 Dedicated Support</h4>
            <p className="text-xs text-muted-foreground">Direct helpline and instant chat</p>
          </div>
        </div>
      </div>

      {/* 2. Main Footer Links & Newsletter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-5 gap-8">
        {/* Newsletter Signup */}
        <div className="md:col-span-2 space-y-4 text-left">
          <h3 className="font-extrabold tracking-widest text-lg font-serif italic">MEER HAMZA</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            Subscribe to receive priority notifications on new fragrance launches, private sales, and exclusive brand offerings.
          </p>
          <form onSubmit={handleSubscribe} className="flex max-w-sm space-x-2">
            <Input
              type="email"
              placeholder="Enter your email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-background rounded-none border-foreground/15"
            />
            <Button type="submit" size="icon" className="rounded-none cursor-pointer flex-shrink-0" aria-label="Subscribe">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>

        {/* Link Columns */}
        <div className="text-left space-y-3">
          <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">Maison Catalog</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/category/oud-collection" className="hover:text-foreground transition-colors">Oud & Arabic Collection</Link></li>
            <li><Link href="/category/woody-oriental" className="hover:text-foreground transition-colors">Woody & Oriental</Link></li>
            <li><Link href="/category/fresh-floral" className="hover:text-foreground transition-colors">Fresh & Floral</Link></li>
            <li><Link href="/categories" className="hover:text-foreground transition-colors">All Collections</Link></li>
          </ul>
        </div>

        <div className="text-left space-y-3">
          <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">Customer Support</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/profile?tab=orders" className="hover:text-foreground transition-colors">Track Order</Link></li>
            <li><Link href="/profile" className="hover:text-foreground transition-colors">Manage Account</Link></li>
            <li><span className="cursor-pointer hover:text-foreground transition-colors">Shipping & Returns policy</span></li>
            <li><span className="cursor-pointer hover:text-foreground transition-colors">Contact Support desk</span></li>
          </ul>
        </div>

        <div className="text-left space-y-3">
          <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">Our Company</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><span className="cursor-pointer hover:text-foreground transition-colors">About Meer Hamza Maison</span></li>
            <li><span className="cursor-pointer hover:text-foreground transition-colors">Sustainability pledges</span></li>
            <li><span className="cursor-pointer hover:text-foreground transition-colors">Maison Careers</span></li>
            <li><span className="cursor-pointer hover:text-foreground transition-colors">Terms of Service</span></li>
          </ul>
        </div>
      </div>

      {/* 3. Bottom Bar: Copyright & Payments */}
      <div className="bg-secondary/40 border-t py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Meer Hamza Maison. All rights reserved. Created for Usman & Hamza.</p>
          <div className="flex items-center space-x-4">
            <span className="flex items-center text-[10px] uppercase font-bold tracking-wider">
              <Lock className="h-3 w-3 mr-1 text-emerald-600" /> Secure Checkout
            </span>
            <div className="flex space-x-2 text-muted-foreground opacity-70">
              <span className="border border-border/80 px-1 py-0.5 rounded font-mono text-[9px]">VISA</span>
              <span className="border border-border/80 px-1 py-0.5 rounded font-mono text-[9px]">MC</span>
              <span className="border border-border/80 px-1 py-0.5 rounded font-mono text-[9px]">AMEX</span>
              <span className="border border-border/80 px-1 py-0.5 rounded font-mono text-[9px]">PP</span>
              <span className="border border-border/80 px-1 py-0.5 rounded font-mono text-[9px]">APAY</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
