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

        {/* Developer Credits */}
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

        {/* Copyright line */}
        <p className="text-[10px] text-muted-foreground/60 tracking-widest uppercase">
          © 2026 TIMELESS BY MEER. ALL RIGHTS RESERVED.
        </p>
      </div>
    </footer>
  );
}
