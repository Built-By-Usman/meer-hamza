import * as React from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { Header } from '@/features/shared/components/Header';
import { Footer } from '@/features/shared/components/Footer';
import { ProductCard } from '@/features/catalog/components/ProductCard';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { PRODUCTS } from '@/data/db';
import { Product } from '@/types';

export const revalidate = 60;

interface PageProps {
  searchParams: Promise<{ cursor?: string }>;
}

async function ProductsList({ cursor }: { cursor: string }) {
  let products: Product[] = [];
  let nextCursor: string | null = null;
  let prevCursor: string | null = null;

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  try {
    const url = `${apiBaseUrl}/products?cursor=${cursor}&limit=8`;
    const res = await fetch(url, { next: { revalidate: 60 } });
    
    if (res.ok) {
      const data = await res.json();
      products = data.items || [];
      nextCursor = data.nextCursor || null;
      prevCursor = data.prevCursor || null;
    } else {
      throw new Error(`API returned error status ${res.status}`);
    }
  } catch (err: any) {
    // Graceful fallback to mock PRODUCTS array if backend is not running in local environment
    const pageSize = 8;
    const startIndex = cursor ? parseInt(cursor, 10) : 0;
    
    if (isNaN(startIndex)) {
      products = PRODUCTS.slice(0, pageSize);
      nextCursor = PRODUCTS.length > pageSize ? String(pageSize) : null;
      prevCursor = null;
    } else {
      const endIndex = startIndex + pageSize;
      products = PRODUCTS.slice(startIndex, endIndex);
      nextCursor = endIndex < PRODUCTS.length ? String(endIndex) : null;
      prevCursor = startIndex > 0 ? String(Math.max(0, startIndex - pageSize)) : null;
    }
  }

  return (
    <div className="space-y-12">
      {products.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10">
          {products.map((product, idx) => (
            <ProductCard key={product.id} product={product} index={idx} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border border-dashed rounded-2xl bg-card">
          <p className="text-sm text-muted-foreground">No fragrances found in this collection.</p>
        </div>
      )}

      {/* Pagination Controls */}
      {(prevCursor !== null || nextCursor !== null) && (
        <div className="flex items-center justify-between border-t border-border/30 pt-6">
          <div>
            {prevCursor !== null ? (
              <Link
                href={`/products?cursor=${prevCursor}`}
                className="inline-flex items-center gap-1.5 font-sans font-bold text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" /> Previous
              </Link>
            ) : (
              <span className="text-xs uppercase tracking-wider font-bold text-muted-foreground/30 select-none">
                Previous
              </span>
            )}
          </div>
          <div className="text-xs font-sans text-muted-foreground font-light">
            Showing Page
          </div>
          <div>
            {nextCursor !== null ? (
              <Link
                href={`/products?cursor=${nextCursor}`}
                className="inline-flex items-center gap-1.5 font-sans font-bold text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                Next <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <span className="text-xs uppercase tracking-wider font-bold text-muted-foreground/30 select-none">
                Next
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const cursor = params.cursor || '';

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <Header />
      
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left">
        {/* Collection Header */}
        <div className="border-b border-border/25 pb-6 mb-10">
          <div className="flex items-center gap-1.5 text-primary mb-1">
            <Sparkles className="h-4 w-4 fill-primary/10" />
            <span className="font-sans text-[10px] uppercase font-bold tracking-[0.25em]">Timeless Collections</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif tracking-wider font-light text-foreground">
            Explore Fragrances
          </h1>
          <p className="text-xs text-muted-foreground font-sans font-light mt-2 max-w-xl">
            Unveil our exclusive line of hand-crafted masterworks. Formulated using rare oils, amber resins, and pure agarwood extracts.
          </p>
        </div>

        {/* Page Content wrapped in Error Boundary */}
        <ErrorBoundary>
          <ProductsList cursor={cursor} />
        </ErrorBoundary>
      </main>

      <Footer />
    </div>
  );
}
