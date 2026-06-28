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
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-left mb-12 border-b pb-6">
          <span className="text-[10px] uppercase tracking-widest font-bold text-primary flex items-center gap-1.5 mb-2">
            <Sparkles className="h-3.5 w-3.5 fill-primary text-primary" /> Maison Collections
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif italic text-foreground tracking-wide">
            Explore Our Fragrances
          </h1>
          <p className="text-sm text-muted-foreground mt-2 max-w-md font-sans">
            Delve into rare agarwoods, fresh marine accords, and romantic Turkish roses hand-selected for our private reserves.
          </p>
        </div>

        {/* Categories Grid List */}
        {isLoading ? (
          <Loader />
        ) : (
          <div className="space-y-8">
            {categories?.map((cat) => (
              <div
                key={cat.id}
                className="relative w-full aspect-[2.2/1] sm:aspect-[3/1] rounded-none overflow-hidden border border-border group flex items-center bg-zinc-950"
              >
                {/* Background Image with Dark Overlay */}
                <div className="absolute inset-0 w-full h-full">
                  <OptimizedImage
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="transition-transform duration-700 group-hover:scale-102 object-cover opacity-75"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-transparent" />
                </div>

                {/* Content Overlay */}
                <div className="relative z-10 px-6 sm:px-12 max-w-lg text-left text-white space-y-3">
                  <h2 className="text-2xl sm:text-3xl font-serif italic text-primary-foreground">
                    {cat.name}
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans font-light">
                    {cat.description}
                  </p>
                  <div className="pt-2">
                    <Link href={`/category/${cat.slug}`}>
                      <Button
                        size="sm"
                        className="rounded-none bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-bold uppercase tracking-wider h-10 px-5"
                      >
                        Explore Collection <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
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
