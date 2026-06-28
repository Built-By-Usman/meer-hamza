'use client';

import * as React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Search, ArrowLeft } from 'lucide-react';
import { ProductCard } from '@/features/catalog/components/ProductCard';
import { EmptyState } from '@/components/common/EmptyState';
import { Loader } from '@/components/common/Loader';
import { Header } from '@/features/shared/components/Header';
import { Footer } from '@/features/shared/components/Footer';
import { useProducts } from '@/features/shared/hooks/queries';

export function SearchClient() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  const { data: resultsData, isLoading } = useProducts({
    search: query,
    limit: 12,
  });

  const products = resultsData?.products || [];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-left mb-8 border-b pb-6">
          <Link href="/" className="inline-flex items-center text-xs text-muted-foreground hover:text-foreground hover:underline gap-1 mb-3">
            <ArrowLeft className="h-3 w-3" /> Back to Home
          </Link>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
            Search Results
          </h1>
          <p className="text-sm text-muted-foreground mt-2 font-medium">
            {isLoading ? 'Searching...' : `Showing ${products.length} matches for "${query}"`}
          </p>
        </div>

        {/* Results grid */}
        {isLoading ? (
          <Loader />
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-12">
            <EmptyState
              title="No results found"
              description={`We could not find any products matching your query "${query}". Try searching for something else like "Apple" or "Nike".`}
              icon={<Search className="h-12 w-12 stroke-[1.5]" />}
            />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
