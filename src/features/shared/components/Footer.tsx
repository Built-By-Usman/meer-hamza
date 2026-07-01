'use client';

import * as React from 'react';
import Link from 'next/link';
import TimelessByMeer from '@/components/common/TimelessByMeer';

export function Footer() {
  return (
    <footer className="w-full bg-background border-t border-border/40 py-16 px-6 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Main Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 pb-12 border-b border-border/30 text-left">
          
          {/* Col 1: Brand details */}
          <div className="space-y-4">
            <div className="w-full max-w-[200px] border border-primary/20 rounded-lg bg-[#0a0a0a] py-3 px-4 shadow-md text-center">
              <TimelessByMeer size="xs" />
            </div>
            <p className="text-xs text-zinc-400 font-light leading-relaxed max-w-xs">
              A luxury perfume brand by Meer Hamza, specializing in original, premium Extrait de Parfum formulations.
            </p>
          </div>

          {/* Col 2: Discover Collections */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-white font-semibold">Collections</h4>
            <ul className="space-y-2 text-xs text-zinc-400 font-light">
              <li><Link href="/category/oud-collection" className="hover:text-primary transition-colors">Oud Collection</Link></li>
              <li><Link href="/category/arabic-collection" className="hover:text-primary transition-colors">Arabic Collection</Link></li>
              <li><Link href="/category/gift-sets" className="hover:text-primary transition-colors">Gift Sets</Link></li>
              <li><Link href="/categories" className="hover:text-primary transition-colors">All Collections</Link></li>
            </ul>
          </div>

          {/* Col 3: Customer Care & Policies */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-white font-semibold">Customer Care</h4>
            <ul className="space-y-2 text-xs text-zinc-400 font-light">
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
              <li><Link href="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
              <li><Link href="/blog" className="hover:text-primary transition-colors">Scent Blog</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="/shipping-policy" className="hover:text-primary transition-colors">Shipping Policy</Link></li>
              <li><Link href="/refund-policy" className="hover:text-primary transition-colors">Refund Policy</Link></li>
            </ul>
          </div>

          {/* Col 4: Authentic Address & Phone */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-white font-semibold">Bespoke Address</h4>
            <p className="text-xs text-zinc-400 font-light leading-relaxed">
              Timeless by Meer<br />
              University Road, Sargodha, Punjab, Pakistan
            </p>
            <p className="text-xs text-zinc-400 font-light">
              Phone: <a href="tel:+923211648089" className="text-primary hover:text-white transition-colors font-bold underline">+92 321 1648089</a>
            </p>
          </div>

        </div>

        {/* Footer bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-8 gap-4 text-center sm:text-left">
          <p className="text-[10px] text-muted-foreground/60 tracking-widest uppercase">
            © 2026 TIMELESS BY MEER. ALL RIGHTS RESERVED.
          </p>

          <div className="text-xs text-muted-foreground font-sans tracking-wide">
            Designed & Developed by{' '}
            <a
              href="https://builtbyusman.tech"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-amber-400 font-bold transition-colors underline"
            >
              Muhammad Usman
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
