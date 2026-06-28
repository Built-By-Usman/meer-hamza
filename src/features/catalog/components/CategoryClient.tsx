'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LayoutGrid, List, SlidersHorizontal, ArrowUpDown, X, Star, ShoppingBag, Eye, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { ProductCard } from './ProductCard';
import { Header } from '@/features/shared/components/Header';
import { Footer } from '@/features/shared/components/Footer';
import { Loader } from '@/components/common/Loader';
import { EmptyState } from '@/components/common/EmptyState';
import { useProducts, useCategories, useBrands } from '@/features/shared/hooks/queries';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useCartStore } from '@/store/cart';
import { useWishlistStore } from '@/store/wishlist';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { toast } from 'sonner';
import { cn } from '@/utils/cn';

interface CategoryClientProps {
  slug: string;
}

export function CategoryClient({ slug }: CategoryClientProps) {
  const router = useRouter();
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = React.useState(false);
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
  
  // Filter States
  const [priceRange, setPriceRange] = React.useState<[number, number]>([0, 11000]);
  const [selectedBrand, setSelectedBrand] = React.useState<string>('all');
  const [selectedRating, setSelectedRating] = React.useState<number | null>(null);
  const [selectedStock, setSelectedStock] = React.useState<string>('all');
  const [sort, setSort] = React.useState<any>('featured');
  const [page, setPage] = React.useState(1);

  // Queries
  const { data: categories } = useCategories();
  const { data: brands } = useBrands();
  
  // Selected category info
  const activeCategory = categories?.find((c) => c.slug === slug);
  const title = activeCategory ? activeCategory.name : slug === 'all' ? 'All Products' : 'Catalog';

  // Construct filters payload for React Query
  const filters = React.useMemo(() => {
    return {
      category: slug === 'all' ? undefined : slug,
      brand: selectedBrand === 'all' ? undefined : selectedBrand,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      rating: selectedRating || undefined,
      stockStatus: selectedStock === 'all' ? undefined : (selectedStock === 'in_stock' ? ['in_stock', 'low_stock'] : ['out_of_stock']) as any,
      sort,
      page,
      limit: 9,
    };
  }, [slug, selectedBrand, priceRange, selectedRating, selectedStock, sort, page]);

  const { data: productsData, isLoading: isLoadingProducts, isPlaceholderData } = useProducts(filters);
  const products = productsData?.products || [];
  const totalItems = productsData?.total || 0;
  const totalPages = productsData?.pages || 1;

  // Reset page when slug or filters change
  React.useEffect(() => {
    setPage(1);
  }, [slug, selectedBrand, priceRange, selectedRating, selectedStock, sort]);

  const handleClearFilters = () => {
    setPriceRange([0, 11000]);
    setSelectedBrand('all');
    setSelectedRating(null);
    setSelectedStock('all');
    setSort('featured');
    setPage(1);
  };

  // List View layout component (for row-oriented catalog display)
  function ListViewCard({ product }: { product: any }) {
    const addToCart = useCartStore((s) => s.addToCart);
    const { toggleWishlist, isInWishlist } = useWishlistStore();
    const isFav = isInWishlist(product.id);

    const handleAdd = (e: React.MouseEvent) => {
      e.stopPropagation();
      addToCart(product, product.variants?.[0], 1);
      toast.success(`${product.name} added to cart`);
    };

    return (
      <div
        onClick={() => router.push(`/product/${product.slug}`)}
        className="flex flex-col sm:flex-row border rounded-xl overflow-hidden bg-card hover:shadow-md transition-all duration-300 cursor-pointer text-left"
      >
        <div className="relative aspect-square sm:h-48 sm:w-48 bg-secondary flex-shrink-0">
          <OptimizedImage src={product.images[0]} alt={product.name} fill />
        </div>
        <div className="p-6 flex flex-col justify-between flex-1">
          <div>
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">{product.brand}</span>
                <h3 className="font-semibold text-lg text-foreground mt-0.5 line-clamp-1">{product.name}</h3>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleWishlist(product);
                }}
                className="h-8 w-8 rounded-full"
              >
                <Heart className={cn('h-4 w-4', isFav && 'fill-rose-500 text-rose-500')} />
              </Button>
            </div>
            <div className="flex items-center space-x-2 mt-1.5">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span className="text-xs font-bold">{product.rating}</span>
              <span className="text-xs text-muted-foreground">({product.reviewsCount} reviews)</span>
            </div>
            <p className="text-sm text-muted-foreground mt-3 line-clamp-2">{product.description}</p>
          </div>
          <div className="flex items-center justify-between mt-6">
            <span className="text-lg font-bold">${product.basePrice}</span>
            <Button size="sm" onClick={handleAdd} className="cursor-pointer">
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Common filters JSX (reused in desktop sidebar & mobile drawer)
  const FilterElements = (
    <div className="space-y-8 text-left">
      {/* Brand list */}
      <div className="space-y-3">
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary border-b pb-2">Brands</h4>
        <div className="flex flex-col space-y-1.5">
          <button
            onClick={() => setSelectedBrand('all')}
            className={cn(
              'text-xs text-left py-1 font-light tracking-wide transition-colors hover:text-primary cursor-pointer',
              selectedBrand === 'all' ? 'text-primary font-bold' : 'text-muted-foreground'
            )}
          >
            All Brands
          </button>
          {brands?.map((brand) => (
            <button
              key={brand.id}
              onClick={() => setSelectedBrand(brand.name)}
              className={cn(
                'text-xs text-left py-1 font-light tracking-wide transition-colors hover:text-primary cursor-pointer',
                selectedBrand === brand.name ? 'text-primary font-bold' : 'text-muted-foreground'
              )}
            >
              {brand.name}
            </button>
          ))}
        </div>
      </div>

      {/* Dual handle price slider */}
      <div className="space-y-3">
        <div className="flex justify-between items-center border-b pb-2">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary">Price Limit</h4>
          <span className="text-[10px] font-sans font-semibold px-2 py-0.5 border rounded-none bg-secondary/35 text-foreground">
            ${priceRange[0]} - ${priceRange[1]}
          </span>
        </div>
        <div className="pt-2">
          <Slider
            min={0}
            max={11000}
            step={50}
            value={priceRange}
            onChange={(val) => setPriceRange(val)}
          />
        </div>
      </div>

      {/* Ratings */}
      <div className="space-y-3">
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary border-b pb-2">Minimum Rating</h4>
        <div className="flex flex-col space-y-2.5">
          {[5, 4, 3].map((star) => (
            <button
              key={star}
              onClick={() => setSelectedRating(selectedRating === star ? null : star)}
              className={cn(
                'flex items-center space-x-2 text-xs text-left py-0.5 transition-colors hover:text-primary cursor-pointer',
                selectedRating === star ? 'text-primary font-bold' : 'text-muted-foreground'
              )}
            >
              <div className="flex items-center space-x-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      'h-3.5 w-3.5',
                      i < star ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/20'
                    )}
                  />
                ))}
              </div>
              <span className="text-[10px] font-sans font-light">& Up</span>
            </button>
          ))}
        </div>
      </div>

      {/* Stock availability */}
      <div className="space-y-3">
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary border-b pb-2">Availability</h4>
        <div className="flex flex-col space-y-1.5">
          {['all', 'in_stock', 'out_of_stock'].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStock(status)}
              className={cn(
                'text-xs text-left py-1 capitalize font-light tracking-wide transition-colors hover:text-primary cursor-pointer',
                selectedStock === status ? 'text-primary font-bold' : 'text-muted-foreground'
              )}
            >
              {status.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <Header />

      {/* Category Cinematic Hero Banner */}
      <div className="relative w-full h-[180px] sm:h-[240px] bg-zinc-950 flex items-center overflow-hidden">
        {activeCategory?.image ? (
          <OptimizedImage
            src={activeCategory.image}
            alt={title}
            fill
            priority
            className="object-cover opacity-35 transition-transform duration-1000 ease-out hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-tr from-amber-950 via-zinc-900 to-stone-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        
        <div className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 text-left text-white space-y-2.5">
          <div className="text-[9px] text-zinc-300 font-sans tracking-widest uppercase flex items-center space-x-1.5">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <span className="text-primary font-medium">{title}</span>
          </div>
          <h1 className="text-3xl sm:text-4.5xl font-serif tracking-wider font-light text-white uppercase drop-shadow-md">
            {title}
          </h1>
          {activeCategory?.description ? (
            <p className="text-xs sm:text-sm text-zinc-300 font-sans font-light max-w-2xl leading-relaxed mt-1 drop-shadow-xs">
              {activeCategory.description}
            </p>
          ) : (
            <p className="text-xs sm:text-sm text-zinc-300 font-sans font-light max-w-2xl leading-relaxed mt-1 drop-shadow-xs">
              Indulge in our exquisite collection of premium formulations crafted for the discerning fragrance connoisseur.
            </p>
          )}
        </div>
      </div>

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex gap-8">
          {/* A. Desktop Sidebar filters */}
          <aside className="hidden lg:block w-64 flex-shrink-0 border-r border-border/40 pr-6 self-start sticky top-24">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-serif italic text-lg font-light tracking-wide text-foreground">Filter Catalog</h3>
              <button
                onClick={handleClearFilters}
                className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground hover:text-primary transition-colors cursor-pointer"
              >
                Clear All
              </button>
            </div>
            {FilterElements}
          </aside>

          {/* B. Products Catalog Section */}
          <div className="flex-grow space-y-6">
            {/* Control Bar: Sorting & Display modes */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/40 pb-4">
              <div className="text-xs text-muted-foreground font-sans tracking-wide uppercase font-semibold">
                {isLoadingProducts ? (
                  <span>Searching products...</span>
                ) : (
                  <span>Showing {totalItems} matches</span>
                )}
              </div>

              <div className="flex items-center space-x-3">
                {/* Mobile Filter Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsMobileFiltersOpen(true)}
                  className="lg:hidden flex items-center space-x-1 h-8 rounded-none border-border/60 hover:bg-secondary cursor-pointer"
                >
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  <span className="text-[10px] uppercase tracking-wider font-bold">Filters</span>
                </Button>

                {/* Sorting Select */}
                <div className="flex items-center space-x-2">
                  <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
                  <Select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="w-[140px] sm:w-[170px] h-8 text-[10px] uppercase tracking-wider py-0.5 rounded-none"
                  >
                    <option value="featured">Sort: Featured</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="rating_desc">Top Customer Rated</option>
                    <option value="newest">Newest Arrivals</option>
                  </Select>
                </div>

                {/* Display Grid/List switcher */}
                <div className="hidden sm:flex border border-border/40 rounded-none p-0.5 bg-background">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={cn(
                      'p-1 rounded-none cursor-pointer transition-colors',
                      viewMode === 'grid' ? 'bg-secondary text-primary' : 'text-muted-foreground hover:text-foreground'
                    )}
                    aria-label="Grid View"
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={cn(
                      'p-1 rounded-none cursor-pointer transition-colors',
                      viewMode === 'list' ? 'bg-secondary text-primary' : 'text-muted-foreground hover:text-foreground'
                    )}
                    aria-label="List View"
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Active Filters Row */}
            {(selectedBrand !== 'all' || selectedRating !== null || selectedStock !== 'all' || priceRange[0] > 0 || priceRange[1] < 11000) && (
              <div className="flex flex-wrap items-center gap-2 border border-dashed border-border/60 p-3 bg-secondary/5">
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mr-1">Active Filters:</span>
                {selectedBrand !== 'all' && (
                  <Badge variant="secondary" className="text-[9px] py-1 px-2.5 rounded-none flex items-center gap-1.5 h-6 bg-background border border-border/40 hover:bg-secondary">
                    <span>{selectedBrand}</span>
                    <X className="h-3 w-3 cursor-pointer text-muted-foreground hover:text-destructive transition-colors" onClick={() => setSelectedBrand('all')} />
                  </Badge>
                )}
                {selectedRating !== null && (
                  <Badge variant="secondary" className="text-[9px] py-1 px-2.5 rounded-none flex items-center gap-1.5 h-6 bg-background border border-border/40 hover:bg-secondary">
                    <span>{selectedRating}+ Stars</span>
                    <X className="h-3 w-3 cursor-pointer text-muted-foreground hover:text-destructive transition-colors" onClick={() => setSelectedRating(null)} />
                  </Badge>
                )}
                {selectedStock !== 'all' && (
                  <Badge variant="secondary" className="text-[9px] py-1 px-2.5 rounded-none flex items-center gap-1.5 h-6 bg-background border border-border/40 hover:bg-secondary">
                    <span>{selectedStock.replace('_', ' ')}</span>
                    <X className="h-3 w-3 cursor-pointer text-muted-foreground hover:text-destructive transition-colors" onClick={() => setSelectedStock('all')} />
                  </Badge>
                )}
                {(priceRange[0] > 0 || priceRange[1] < 11000) && (
                  <Badge variant="secondary" className="text-[9px] py-1 px-2.5 rounded-none flex items-center gap-1.5 h-6 bg-background border border-border/40 hover:bg-secondary">
                    <span>${priceRange[0]}-${priceRange[1]}</span>
                    <X className="h-3 w-3 cursor-pointer text-muted-foreground hover:text-destructive transition-colors" onClick={() => setPriceRange([0, 11000])} />
                  </Badge>
                )}
                <button
                  onClick={handleClearFilters}
                  className="text-[10px] font-bold tracking-wider text-destructive hover:underline ml-auto cursor-pointer uppercase"
                >
                  Clear All
                </button>
              </div>
            )}

            {/* Product display Grid/List */}
            {isLoadingProducts ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 py-8">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div key={n} className="flex flex-col space-y-3">
                    <div className="aspect-square bg-secondary rounded-lg animate-pulse" />
                    <div className="h-4 bg-secondary rounded w-3/4 animate-pulse" />
                    <div className="h-4 bg-secondary rounded w-1/2 animate-pulse" />
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className={cn(
                'transition-all duration-300',
                isPlaceholderData && 'opacity-50' // smooth visual indicator during React Query updates
              )}>
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                    {products.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {products.map((product) => (
                      <ListViewCard key={product.id} product={product} />
                    ))}
                  </div>
                )}

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center space-x-1.5 mt-10 border-t pt-6">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page === 1}
                      onClick={() => setPage((p) => p - 1)}
                      className="cursor-pointer"
                    >
                      Previous
                    </Button>
                    {Array.from({ length: totalPages }).map((_, i) => {
                      const p = i + 1;
                      return (
                        <Button
                          key={p}
                          variant={page === p ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setPage(p)}
                          className="h-8 w-8 p-0 cursor-pointer"
                        >
                          {p}
                        </Button>
                      );
                    })}
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page === totalPages}
                      onClick={() => setPage((p) => p + 1)}
                      className="cursor-pointer"
                    >
                      Next
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-12">
                <EmptyState
                  title="No items found"
                  description="We could not find any products matching your active filters. Try adjusting your price ranges or selecting another brand."
                  actionLabel="Reset Filters"
                  onAction={handleClearFilters}
                />
              </div>
            )}
          </div>
        </div>
      </main>

      {/* C. Mobile Filters Drawer Sheet */}
      <Sheet isOpen={isMobileFiltersOpen} onClose={() => setIsMobileFiltersOpen(false)} side="bottom">
        <SheetHeader className="flex justify-between items-center pr-4">
          <SheetTitle>Filter Catalog</SheetTitle>
        </SheetHeader>
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {FilterElements}
          <div className="mt-8 flex space-x-3 border-t pt-4">
            <Button variant="outline" className="flex-1 cursor-pointer" onClick={handleClearFilters}>
              Reset All
            </Button>
            <Button className="flex-1 cursor-pointer" onClick={() => setIsMobileFiltersOpen(false)}>
              Show {totalItems} Results
            </Button>
          </div>
        </div>
      </Sheet>

      <Footer />
    </div>
  );
}
