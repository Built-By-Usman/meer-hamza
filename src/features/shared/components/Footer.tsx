'use client';

import * as React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="w-full bg-background border-t border-border/40 py-16 px-4">
      <div className="max-w-7xl mx-auto flex flex-col items-center justify-center text-center space-y-8">
        {/* M H Initials */}
        <h3 className="text-primary font-semibold text-2xl tracking-[0.4em] font-sans">
          M H
        </h3>

        {/* Navigation links */}
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs font-medium text-muted-foreground uppercase tracking-widest">
          <Link href="/categories" className="hover:text-foreground transition-colors">
            About Us
          </Link>
          <Link href="/categories" className="hover:text-foreground transition-colors">
            Bespoke Service
          </Link>
          <Link href="/categories" className="hover:text-foreground transition-colors">
            Store Locator
          </Link>
          <Link href="/categories" className="hover:text-foreground transition-colors">
            Contact
          </Link>
        </div>

        {/* Copyright line */}
        <p className="text-[10px] text-muted-foreground/60 tracking-widest">
          © 2026 MEER HAMZA. ALL RIGHTS RESERVED.
        </p>
      </div>
    </footer>
  );
}
