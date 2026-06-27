'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Search, History, TrendingUp, Sparkles, ShoppingBag, ArrowRight } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useProducts, useCategories } from '@/features/shared/hooks/queries';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { cn } from '@/utils/cn';

interface SearchPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchPalette({ isOpen, onClose }: SearchPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = React.useState('');
  const [debouncedQuery, setDebouncedQuery] = React.useState('');
  const [recentSearches, setRecentSearches] = React.useState<string[]>([]);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Load recent searches on client mount
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('recent_searches');
      setRecentSearches(saved ? JSON.parse(saved) : ['iPhone', 'Nike', 'Sony WH-1000XM5']);
    }
  }, [isOpen]);

  // Debounce query input
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 150);
    return () => clearTimeout(timer);
  }, [query]);

  // Fetch search results reactive query
  const { data: resultsData, isLoading: isSearching } = useProducts({
    search: debouncedQuery,
    limit: 5,
  });

  const { data: categories } = useCategories();

  const searchResults = resultsData?.products || [];

  const trendingSearches = ['Titanium', 'Headphones', 'Linen Blazer', 'Dyson V15'];

  // Global hotkey binding for Cmd+K
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // Wait, let caller handle open. 
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Auto focus input on dialogue open
  React.useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
        setQuery('');
        setActiveIndex(0);
      }, 50);
    }
  }, [isOpen]);

  // Save query to recent searches
  const saveSearch = (term: string) => {
    const updated = [term, ...recentSearches.filter((t) => t !== term)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recent_searches', JSON.stringify(updated));
  };

  // Click / Select action
  const handleSelectProduct = (slug: string, name: string) => {
    saveSearch(name);
    onClose();
    router.push(`/product/${slug}`);
  };

  const handleSelectQuery = (term: string) => {
    saveSearch(term);
    onClose();
    router.push(`/search?q=${encodeURIComponent(term)}`);
  };

  // Keyboard navigation items list flat structure
  const flatItemsCount = searchResults.length + (query ? 0 : recentSearches.length + trendingSearches.length);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % Math.max(1, flatItemsCount));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + flatItemsCount) % Math.max(1, flatItemsCount));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (query && searchResults.length > 0) {
        if (activeIndex < searchResults.length) {
          const prod = searchResults[activeIndex];
          handleSelectProduct(prod.slug, prod.name);
        } else {
          handleSelectQuery(query);
        }
      } else if (!query) {
        if (activeIndex < recentSearches.length) {
          handleSelectQuery(recentSearches[activeIndex]);
        } else {
          const trendIndex = activeIndex - recentSearches.length;
          handleSelectQuery(trendingSearches[trendIndex]);
        }
      } else {
        handleSelectQuery(query);
      }
    }
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} className="p-0 max-w-xl">
      <DialogContent className="p-0 border-0">
        {/* Input Bar */}
        <div className="flex items-center border-b px-4 py-3 bg-card/30">
          <Search className="h-5 w-5 text-muted-foreground mr-3" />
          <Input
            ref={inputRef}
            placeholder="Type a product, brand, or category (e.g. iPhone)..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            onKeyDown={handleKeyDown}
            className="border-0 shadow-none focus-visible:ring-0 text-base h-auto py-1 px-0 flex-1 bg-transparent"
          />
          <kbd className="hidden sm:inline-flex h-5 items-center select-none rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            ESC
          </kbd>
        </div>

        {/* Results Body */}
        <div className="max-h-[350px] overflow-y-auto p-4 no-scrollbar">
          {query ? (
            /* Searched Items list */
            <div>
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center">
                <Sparkles className="h-3 w-3 mr-1 text-primary" /> Matching Products
              </div>
              
              {isSearching ? (
                <div className="space-y-2 py-4">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="h-12 w-full bg-secondary/50 rounded-md animate-pulse" />
                  ))}
                </div>
              ) : searchResults.length > 0 ? (
                <div className="space-y-1">
                  {searchResults.map((product, idx) => {
                    const isSelected = activeIndex === idx;
                    return (
                      <div
                        key={product.id}
                        onClick={() => handleSelectProduct(product.slug, product.name)}
                        onMouseEnter={() => setActiveIndex(idx)}
                        className={cn(
                          'flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors text-left',
                          isSelected ? 'bg-secondary text-foreground' : 'hover:bg-secondary/40 text-muted-foreground hover:text-foreground'
                        )}
                      >
                        <div className="flex items-center space-x-3">
                          <OptimizedImage
                            src={product.images[0]}
                            alt={product.name}
                            width={36}
                            height={36}
                            className="rounded-md"
                          />
                          <div>
                            <p className="text-sm font-semibold text-foreground">{product.name}</p>
                            <p className="text-xs text-muted-foreground">{product.brand} · {product.category}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-semibold text-foreground">${product.basePrice}</span>
                          <ArrowRight className={cn('h-4 w-4 opacity-0 transition-opacity', isSelected && 'opacity-100')} />
                        </div>
                      </div>
                    );
                  })}
                  
                  {/* Enter to see all */}
                  <div
                    onClick={() => handleSelectQuery(query)}
                    className={cn(
                      'text-xs text-center py-2 text-muted-foreground border-t mt-3 cursor-pointer',
                      activeIndex === searchResults.length && 'text-primary font-medium'
                    )}
                  >
                    Press <span className="font-semibold">Enter</span> to search all results for &quot;{query}&quot;
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  No products found for &quot;{query}&quot;. Try another search.
                </div>
              )}
            </div>
          ) : (
            /* Default Suggestion screen */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Recent searches */}
              <div>
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center">
                  <History className="h-3.5 w-3.5 mr-1" /> Recent Searches
                </div>
                <div className="space-y-1">
                  {recentSearches.map((term, idx) => {
                    const isSelected = activeIndex === idx;
                    return (
                      <div
                        key={idx}
                        onClick={() => handleSelectQuery(term)}
                        onMouseEnter={() => setActiveIndex(idx)}
                        className={cn(
                          'flex items-center justify-between px-3 py-1.5 rounded-md cursor-pointer text-sm text-left transition-colors',
                          isSelected ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:bg-secondary/40 hover:text-foreground'
                        )}
                      >
                        <span>{term}</span>
                        <ArrowRight className={cn('h-3.5 w-3.5 opacity-0', isSelected && 'opacity-100')} />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Trending searches */}
              <div>
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center">
                  <TrendingUp className="h-3.5 w-3.5 mr-1" /> Trending Now
                </div>
                <div className="space-y-1">
                  {trendingSearches.map((term, idx) => {
                    const flatIdx = recentSearches.length + idx;
                    const isSelected = activeIndex === flatIdx;
                    return (
                      <div
                        key={idx}
                        onClick={() => handleSelectQuery(term)}
                        onMouseEnter={() => setActiveIndex(flatIdx)}
                        className={cn(
                          'flex items-center justify-between px-3 py-1.5 rounded-md cursor-pointer text-sm text-left transition-colors',
                          isSelected ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:bg-secondary/40 hover:text-foreground'
                        )}
                      >
                        <span>{term}</span>
                        <ArrowRight className={cn('h-3.5 w-3.5 opacity-0', isSelected && 'opacity-100')} />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
