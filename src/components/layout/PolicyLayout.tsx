'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/utils/cn';
import { FileText, Shield, Truck, RotateCcw, Sparkles } from 'lucide-react';
import { Header } from '@/features/shared/components/Header';
import { Footer } from '@/features/shared/components/Footer';

interface PolicyLayoutProps {
  children: React.ReactNode;
  title: string;
}

export function PolicyLayout({ children, title }: PolicyLayoutProps) {
  const pathname = usePathname();

  const links = [
    { href: '/privacy-policy', label: 'Privacy Policy', icon: Shield },
    { href: '/terms', label: 'Terms of Service', icon: FileText },
    { href: '/shipping-policy', label: 'Shipping Policy', icon: Truck },
    { href: '/refund-policy', label: 'Refund Policy', icon: RotateCcw },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#050505] font-sans">
      <Header />
      
      {/* Banner Section */}
      <section className="relative h-[220px] bg-zinc-950 flex flex-col justify-center items-center px-6 overflow-hidden border-b border-primary/10">
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/80 to-[#050505] z-10" />
        <div className="absolute inset-0 bg-cover bg-center opacity-15 z-0" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1800')" }} />
        
        <div className="relative z-20 text-center space-y-3">
          <span className="text-[9px] uppercase tracking-[0.35em] font-bold text-primary flex items-center justify-center gap-2">
            <Sparkles className="h-3 w-3 fill-primary text-primary" /> Legal Reserves
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-light text-white tracking-widest uppercase">
            Maison Terms
          </h1>
          <div className="h-[1px] w-16 bg-primary/40 mx-auto mt-2" />
        </div>
      </section>

      {/* Main content grid */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-6 sm:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Sidebar (Left) */}
          <aside className="lg:col-span-3 space-y-4">
            <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 border-b lg:border-none border-zinc-900 scrollbar-hide">
              {links.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex items-center gap-3 px-5 py-3.5 rounded-xl text-xs uppercase tracking-wider font-semibold border transition-all duration-300 flex-shrink-0 cursor-pointer",
                      isActive
                        ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/10"
                        : "bg-zinc-950/40 text-zinc-400 border-zinc-900 hover:text-white hover:border-zinc-800"
                    )}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>
          </aside>

          {/* Policy Document (Right) */}
          <article className="lg:col-span-9 bg-zinc-950/30 p-8 sm:p-12 rounded-3xl border border-zinc-900 shadow-2xl text-left">
            <h2 className="font-serif text-3xl text-white font-light tracking-wide mb-8 border-b border-zinc-900/60 pb-5">
              {title}
            </h2>
            <div className="text-zinc-300 leading-relaxed font-light text-sm sm:text-base space-y-6">
              {children}
            </div>
          </article>

        </div>
      </main>

      <Footer />
    </div>
  );
}
