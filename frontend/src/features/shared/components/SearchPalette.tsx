'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  Search, X, Clock, TrendingUp, ArrowUpRight,
  Flame, Star, Sparkles, ShoppingBag
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useProducts, useCategories } from '@/features/shared/hooks/queries';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { cn } from '@/utils/cn';
import { useCartStore } from '@/store/cart';
import { toast } from 'sonner';

interface SearchPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

const TRENDING = [
  'Royal Oud', 'Midnight Essence', 'Velvet Noir',
  'Golden Amber', 'Fresh Floral', 'Pour Homme',
];

const DEFAULT_RECENT = ['Oud Collection', 'Woody Oriental', 'Rose Floral'];

export function SearchPalette({ isOpen, onClose }: SearchPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = React.useState('');
  const [debouncedQuery, setDebouncedQuery] = React.useState('');
  const [recentSearches, setRecentSearches] = React.useState<string[]>(DEFAULT_RECENT);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const addToCart = useCartStore((s) => s.addToCart);

  // Load saved searches
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('recent_searches');
      if (saved) {
        try { setRecentSearches(JSON.parse(saved)); } catch {}
      }
    }
  }, []);

  // Debounce query
  React.useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 180);
    return () => clearTimeout(t);
  }, [query]);

  // Focus on open, clear on close
  React.useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 60);
    } else {
      setQuery('');
      setDebouncedQuery('');
    }
  }, [isOpen]);

  // ESC to close
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const { data: resultsData, isLoading } = useProducts({
    search: debouncedQuery,
    limit: 6,
  });
  const searchResults = resultsData?.products || [];

  const saveSearch = (term: string) => {
    const updated = [term, ...recentSearches.filter((t) => t !== term)].slice(0, 6);
    setRecentSearches(updated);
    localStorage.setItem('recent_searches', JSON.stringify(updated));
  };

  const goToProduct = (slug: string, name: string) => {
    saveSearch(name);
    onClose();
    router.push(`/product/${slug}`);
  };

  const goToSearch = (term: string) => {
    saveSearch(term);
    onClose();
    router.push(`/search?q=${encodeURIComponent(term)}`);
  };

  const handleQuickAdd = (e: React.MouseEvent, product: any) => {
    e.stopPropagation();
    addToCart(product, product.variants?.[0], 1);
    toast.success('Added to bag', { description: product.name });
  };

  const hasResults = searchResults.length > 0;
  const showSkeleton = isLoading && debouncedQuery.length > 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col" role="dialog" aria-modal="true">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Search panel — slides down from top */}
          <motion.div
            initial={{ opacity: 0, y: -24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ type: 'spring', stiffness: 380, damping: 36 }}
            className="relative z-10 bg-background border-b border-border/40 shadow-2xl"
          >
            {/* ── INPUT ROW ── */}
            <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
              <Search className="h-5 w-5 text-primary flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && query.trim()) goToSearch(query.trim());
                }}
                placeholder="Search fragrances, brands, notes…"
                className="flex-1 bg-transparent text-base font-sans text-foreground placeholder:text-muted-foreground/60 outline-none border-none focus:ring-0 h-8"
                autoComplete="off"
                spellCheck={false}
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Clear"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              <button
                onClick={onClose}
                className="ml-1 font-sans text-[9px] uppercase tracking-widest text-muted-foreground border border-border/50 px-2 py-1 rounded-lg hover:text-foreground hover:border-foreground/25 transition-colors hidden sm:block"
              >
                ESC
              </button>
            </div>

            {/* ── RESULTS / DEFAULT BODY ── */}
            <div className="max-w-2xl mx-auto px-4 pb-6 max-h-[65vh] overflow-y-auto no-scrollbar">

              {/* ─── QUERY RESULTS ─── */}
              {debouncedQuery ? (
                <div>
                  {showSkeleton ? (
                    <div className="space-y-3 pt-2">
                      {[1, 2, 3, 4].map((n) => (
                        <div key={n} className="flex items-center gap-3 animate-pulse">
                          <div className="w-12 h-12 rounded-xl bg-secondary flex-shrink-0" />
                          <div className="flex-1 space-y-1.5">
                            <div className="h-3 bg-secondary rounded w-2/3" />
                            <div className="h-2.5 bg-secondary/60 rounded w-1/3" />
                          </div>
                          <div className="h-3 bg-secondary rounded w-12" />
                        </div>
                      ))}
                    </div>
                  ) : hasResults ? (
                    <div>
                      <div className="flex items-center justify-between pt-1 pb-3">
                        <span className="font-sans text-[8px] uppercase tracking-[0.28em] font-bold text-muted-foreground flex items-center gap-1.5">
                          <Sparkles className="h-3 w-3 text-primary" /> Matching Fragrances
                        </span>
                        <button
                          onClick={() => goToSearch(debouncedQuery)}
                          className="font-sans text-[8px] uppercase tracking-widest text-primary font-bold hover:opacity-70 transition-opacity flex items-center gap-1"
                        >
                          View all <ArrowUpRight className="h-3 w-3" />
                        </button>
                      </div>
                      <div className="divide-y divide-border/20">
                        {searchResults.map((product) => (
                          <div
                            key={product.id}
                            onClick={() => goToProduct(product.slug, product.name)}
                            className="flex items-center gap-3.5 py-3 cursor-pointer group hover:bg-secondary/30 -mx-2 px-2 rounded-xl transition-colors"
                          >
                            {/* Image */}
                            <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-[#f5f3ef] flex-shrink-0 border border-border/20">
                              <OptimizedImage
                                src={product.images[0]}
                                alt={product.name}
                                fill
                                className="object-cover"
                              />
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                              <p className="font-serif text-sm text-foreground font-light tracking-wide leading-snug line-clamp-1 group-hover:text-primary transition-colors">
                                {product.name}
                              </p>
                              <p className="font-sans text-[9px] text-muted-foreground mt-0.5 uppercase tracking-wider">
                                {product.brand}
                                {product.specifications?.['Fragrance Family'] &&
                                  ` · ${product.specifications['Fragrance Family']}`}
                              </p>
                            </div>

                            {/* Price + Quick Add */}
                            <div className="flex items-center gap-2.5 flex-shrink-0">
                              <span className="font-sans font-bold text-sm text-foreground">
                                ${product.basePrice}
                              </span>
                              <button
                                onClick={(e) => handleQuickAdd(e, product)}
                                aria-label="Quick add"
                                className="opacity-0 group-hover:opacity-100 transition-all w-7 h-7 rounded-full bg-zinc-950 text-white flex items-center justify-center hover:bg-zinc-700 active:scale-90"
                              >
                                <ShoppingBag className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* See all results footer */}
                      <button
                        onClick={() => goToSearch(debouncedQuery)}
                        className="mt-4 w-full py-2.5 border border-border/40 rounded-xl text-[10px] font-sans font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground hover:border-foreground/25 transition-colors"
                      >
                        See all results for "{debouncedQuery}"
                      </button>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Search className="h-8 w-8 text-muted-foreground/30 mx-auto mb-3" />
                      <p className="font-serif text-base text-muted-foreground font-light">
                        No fragrances found for "{debouncedQuery}"
                      </p>
                      <p className="font-sans text-xs text-muted-foreground/60 mt-1">
                        Try a brand name, scent family, or ingredient
                      </p>
                      <button
                        onClick={() => goToSearch(debouncedQuery)}
                        className="mt-5 font-sans font-bold text-[9px] uppercase tracking-widest text-primary hover:opacity-70 transition-opacity"
                      >
                        Search entire catalog →
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* ─── DEFAULT EMPTY STATE ─── */
                <div className="pt-2 space-y-6">
                  {/* Recent */}
                  {recentSearches.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-sans text-[8px] uppercase tracking-[0.28em] font-bold text-muted-foreground flex items-center gap-1.5">
                          <Clock className="h-3 w-3" /> Recent
                        </span>
                        <button
                          onClick={() => {
                            setRecentSearches([]);
                            localStorage.removeItem('recent_searches');
                          }}
                          className="font-sans text-[8px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
                        >
                          Clear
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {recentSearches.map((term) => (
                          <button
                            key={term}
                            onClick={() => goToSearch(term)}
                            className="font-sans text-xs font-medium text-foreground/70 hover:text-foreground bg-secondary/60 hover:bg-secondary border border-border/30 hover:border-border/60 px-3 py-1.5 rounded-full transition-all"
                          >
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Trending */}
                  <div>
                    <span className="font-sans text-[8px] uppercase tracking-[0.28em] font-bold text-muted-foreground flex items-center gap-1.5 mb-3">
                      <Flame className="h-3 w-3 text-orange-400" /> Trending Now
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      {TRENDING.map((term, i) => (
                        <button
                          key={term}
                          onClick={() => goToSearch(term)}
                          className="text-left flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-border/30 hover:border-primary/25 hover:bg-primary/3 group transition-all"
                        >
                          <span className="font-sans text-[8px] font-black text-primary/40 group-hover:text-primary/70 w-3.5 flex-shrink-0 transition-colors">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <span className="font-sans text-xs font-medium text-foreground/75 group-hover:text-foreground transition-colors line-clamp-1">
                            {term}
                          </span>
                          <ArrowUpRight className="h-3 w-3 text-muted-foreground/30 group-hover:text-primary/60 ml-auto flex-shrink-0 transition-colors" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quick hint */}
                  <p className="text-center font-sans text-[9px] text-muted-foreground/40 uppercase tracking-widest pb-2">
                    Press ↵ Enter to search all fragrances
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
