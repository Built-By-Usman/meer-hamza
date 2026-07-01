'use client';

import * as React from 'react';
import Link from 'next/link';
import TimelessByMeer from '@/components/common/TimelessByMeer';
import { MapPin, Phone } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full bg-[#050505] border-t border-primary/10 py-16 px-6 font-sans">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        
        {/* Brand Logo Centered */}
        <div className="mb-4 border border-primary/20 rounded-2xl bg-[#09090b] py-4 px-6 shadow-xl text-center">
          <TimelessByMeer size="sm" />
        </div>

        {/* Developer Credits (Prominent Position) */}
        <div className="mb-12 text-sm text-zinc-400 font-sans tracking-wider text-center">
          Designed & Developed by{' '}
          <a
            href="https://builtbyusman.tech"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-white font-bold transition-colors underline decoration-primary/30 hover:decoration-white"
          >
            Muhammad Usman
          </a>
        </div>

        {/* Columns Grid */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-10 pb-12 border-b border-border/10 text-left">
          
          {/* Col 1: Explore */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">Explore</h4>
            <ul className="space-y-3 text-xs text-zinc-400 font-light">
              <li>
                <Link href="/about" className="hover:text-primary transition-all duration-200 hover:translate-x-0.5 inline-block">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition-all duration-200 hover:translate-x-0.5 inline-block">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-primary transition-all duration-200 hover:translate-x-0.5 inline-block">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-primary transition-all duration-200 hover:translate-x-0.5 inline-block">
                  Scent Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: Legal Policies */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">Policies</h4>
            <ul className="space-y-3 text-xs text-zinc-400 font-light">
              <li>
                <Link href="/privacy-policy" className="hover:text-primary transition-all duration-200 hover:translate-x-0.5 inline-block">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-primary transition-all duration-200 hover:translate-x-0.5 inline-block">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/shipping-policy" className="hover:text-primary transition-all duration-200 hover:translate-x-0.5 inline-block">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-primary transition-all duration-200 hover:translate-x-0.5 inline-block">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Flagship Store Details */}
          <div className="space-y-5">
            <h4 className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">Flagship House</h4>
            
            <p className="text-[13px] text-zinc-400 font-light leading-relaxed">
              Crafting premium, high-concentration Extrait de Parfum. Experience the absolute luxury of Timeless by Meer.
            </p>
            
            <div className="space-y-3 pt-1">
              <div className="flex items-start gap-2.5 text-xs text-zinc-400 font-light leading-relaxed">
                <MapPin className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                <span>
                  University Road,<br />
                  Sargodha, Punjab, Pakistan
                </span>
              </div>
              
              <div className="flex items-center gap-2.5 text-xs text-zinc-400 font-light">
                <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                <a href="tel:+923211648089" className="text-zinc-300 hover:text-primary transition-colors font-semibold underline">
                  +92 321 1648089
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Bottom Copyright */}
        <div className="w-full text-center pt-8 text-zinc-500">
          <p className="text-[10px] tracking-widest uppercase font-light">
            © 2026 TIMELESS BY MEER. ALL RIGHTS RESERVED.
          </p>
        </div>
      </div>
    </footer>
  );
}
