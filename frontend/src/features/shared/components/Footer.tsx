'use client';

import * as React from 'react';
import Link from 'next/link';
import TimelessByMeer from '@/components/common/TimelessByMeer';

export function Footer() {
  return (
    <footer className="w-full bg-background border-t border-border/40 py-16 px-4">
      <div className="max-w-7xl mx-auto flex flex-col items-center justify-center text-center space-y-8">
        {/* Luxury Brand Logo */}
        <div className="w-full max-w-[320px] border border-primary/20 rounded-xl bg-[#0a0a0a] py-6 px-4 shadow-md">
          <TimelessByMeer size="sm" />
        </div>

        {/* Navigation links */}
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs font-medium text-muted-foreground uppercase tracking-widest">
          <Link href="/" className="hover:text-foreground transition-colors">
            About Us
          </Link>
          <Link href="/" className="hover:text-foreground transition-colors">
            Bespoke Service
          </Link>
          <Link href="/" className="hover:text-foreground transition-colors">
            Store Locator
          </Link>
          <Link href="/" className="hover:text-foreground transition-colors">
            Contact
          </Link>
        </div>

        {/* Copyright line */}
        <p className="text-[10px] text-muted-foreground/60 tracking-widest uppercase">
          © 2026 TIMELESS BY MEER. ALL RIGHTS RESERVED.
        </p>
      </div>
    </footer>
  );
}
