'use client';

import * as React from 'react';
import Link from 'next/link';
import TimelessByMeer from '@/components/common/TimelessByMeer';
import { MapPin, Phone, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full bg-[#050505] border-t border-primary/10 py-16 px-6 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Main Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-border/10 text-left">
          
          {/* Col 1: Brand Editorial Profile */}
          <div className="space-y-5">
            <div className="inline-block border border-primary/20 rounded-xl bg-[#09090b] py-3.5 px-5 shadow-lg">
              <TimelessByMeer size="xs" />
            </div>
            <p className="text-[13px] text-zinc-400 font-light leading-relaxed max-w-xs">
              Crafting premium, high-concentration Extrait de Parfum. Experience the absolute luxury and sensory excellence of Timeless by Meer.
            </p>
          </div>

          {/* Col 2: Quick Links */}
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

          {/* Col 3: Legal Policy Documentation */}
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

          {/* Col 4: Flagship Store Location Profile */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">Flagship House</h4>
            
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

        {/* Footer Bottom Credentials */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-8 gap-4 text-center sm:text-left text-zinc-500">
          <p className="text-[10px] tracking-widest uppercase font-light">
            © 2026 TIMELESS BY MEER. ALL RIGHTS RESERVED.
          </p>

          <div className="text-xs font-light tracking-wide">
            Designed & Developed by{' '}
            <a
              href="https://builtbyusman.tech"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-white font-semibold transition-colors underline"
            >
              Muhammad Usman
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
