'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { Button } from '@/components/ui/button';
import { Loader } from '@/components/common/Loader';
import { Header } from '@/features/shared/components/Header';
import { Footer } from '@/features/shared/components/Footer';
import { useCategories } from '@/features/shared/hooks/queries';

export function CategoriesClient() {
  const { data: categories, isLoading } = useCategories();

  return (
    <div className="min-h-screen flex flex-col bg-[#050505] font-sans">
      <Header />

      <main className="flex-grow max-w-7xl w-full mx-auto px-6 sm:px-8 lg:px-12 py-16">
        {/* Header Section */}
        <div className="text-center mb-16 space-y-4">
          <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-primary flex items-center justify-center gap-2">
            <Sparkles className="h-3 w-3 fill-primary text-primary" /> Maison Reserves
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-light text-white tracking-wider">
            Explore Our Fragrances
          </h1>
          <div className="h-[1px] w-20 bg-primary/30 mx-auto" />
          <p className="text-xs sm:text-sm text-zinc-400 mt-4 max-w-md mx-auto leading-relaxed font-light">
            Delve into rare agarwoods, fresh marine accords, and romantic Turkish roses hand-selected for our private reserves.
          </p>
        </div>

        {/* Categories Grid List */}
        {isLoading ? (
          <div className="py-20">
            <Loader />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories?.map((cat) => (
              <div
                key={cat.id}
                className="group relative w-full aspect-[4/5] overflow-hidden border border-zinc-900 hover:border-primary/30 rounded-2xl bg-zinc-950 transition-all duration-700 hover:shadow-[0_12px_40px_rgba(0,0,0,0.8)]"
              >
                {/* Background Image with Dark Gradient Overlays */}
                <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
                  <OptimizedImage
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="transition-transform duration-1000 group-hover:scale-105 object-cover opacity-60"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                  <div className="absolute inset-0 bg-black/20" />
                </div>

                {/* Content Overlay */}
                <div className="absolute inset-0 z-10 p-8 flex flex-col justify-end text-left space-y-3">
                  <h2 className="text-2xl sm:text-3xl font-serif font-light text-white tracking-wide transition-colors group-hover:text-primary">
                    {cat.name}
                  </h2>
                  <p className="text-xs text-zinc-300 leading-relaxed font-light max-w-xs">
                    {cat.description}
                  </p>
                  <div className="pt-3">
                    <Link href={`/category/${cat.slug}`} className="inline-block w-full">
                      <Button
                        size="sm"
                        className="w-full justify-between rounded-xl bg-transparent border border-primary/30 hover:border-primary text-primary hover:text-primary-foreground hover:bg-primary text-xs font-semibold uppercase tracking-wider h-11 px-5 transition-all duration-300 active:scale-95"
                      >
                        Explore Collection <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
