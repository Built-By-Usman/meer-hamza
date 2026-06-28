'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart, ShoppingBag, Check, ShieldCheck, Sparkles, Award, Star, Compass, Wind, Clock, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Rating } from '@/components/common/Rating';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { Header } from '@/features/shared/components/Header';
import { Footer } from '@/features/shared/components/Footer';
import { Loader } from '@/components/common/Loader';
import {
  useProductBySlug,
  useProductReviews,
  useAddReview,
  useRelatedProducts,
} from '@/features/shared/hooks/queries';
import { useCartStore } from '@/store/cart';
import { useWishlistStore } from '@/store/wishlist';
import { useAuthStore } from '@/store/auth';
import { Product, ProductVariant } from '@/types';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';
import dynamic from 'next/dynamic';
import { ProductGallerySkeleton } from './ProductGallery';
import { ProductReviewsSkeleton } from './ProductReviews';

const ProductGallery = dynamic(
  () => import('./ProductGallery').then((mod) => mod.ProductGallery),
  {
    ssr: false,
    loading: () => <ProductGallerySkeleton />,
  }
);

const ProductReviews = dynamic(
  () => import('./ProductReviews').then((mod) => mod.ProductReviews),
  {
    ssr: false,
    loading: () => <ProductReviewsSkeleton />,
  }
);

const ReviewModal = dynamic(
  () => import('./ReviewModal').then((mod) => mod.ReviewModal),
  {
    ssr: false,
  }
);

interface ProductClientProps {
  slug: string;
}

export function ProductClient({ slug }: ProductClientProps) {
  const router = useRouter();
  const { data: product, isLoading: isLoadingProduct } = useProductBySlug(slug);
  const { data: reviews, isLoading: isLoadingReviews } = useProductReviews(product?.id || '');

  // States
  const [selectedVariant, setSelectedVariant] = React.useState<ProductVariant | undefined>(undefined);
  const [activeImage, setActiveImage] = React.useState<string>('');
  const [quantity, setQuantity] = React.useState(1);
  const [isReviewModalOpen, setIsReviewModalOpen] = React.useState(false);
  const [showStickyBar, setShowStickyBar] = React.useState(false);
  const [isAdding, setIsAdding] = React.useState(false);
  const mainPurchasePanelRef = React.useRef<HTMLDivElement>(null);

  // Stores
  const addToCart = useCartStore((s) => s.addToCart);
  const cartItems = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const { isAuthenticated, user } = useAuthStore();
  
  // Mutations
  const addReviewMutation = useAddReview(product?.id || '');
  const isFav = product ? isInWishlist(product.id) : false;

  const currentCartItem = product ? cartItems.find(
    (item) => item.productId === product.id && item.variantId === selectedVariant?.id
  ) : null;
  const quantityInCart = currentCartItem ? currentCartItem.quantity : 0;

  // Sync selected variant when product loads
  React.useEffect(() => {
    if (product) {
      setSelectedVariant(product.variants?.[0]);
      setActiveImage(product.images[0]);
    }
  }, [product]);

  // Sync active image when variant changes
  React.useEffect(() => {
    if (selectedVariant?.images?.[0]) {
      setActiveImage(selectedVariant.images[0]);
    }
  }, [selectedVariant]);

  // Scroll listener for Sticky Bottom Purchasing Bar
  React.useEffect(() => {
    const handleScroll = () => {
      if (!mainPurchasePanelRef.current) return;
      const rect = mainPurchasePanelRef.current.getBoundingClientRect();
      setShowStickyBar(rect.bottom < 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isLoadingProduct) {
    return <Loader fullPage />;
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-grow flex items-center justify-center p-8">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-serif italic text-foreground">Fragrance Not Found</h2>
            <p className="text-muted-foreground mt-2 font-sans font-light">The requested scent could not be loaded.</p>
            <Button className="mt-4 rounded-xl" onClick={() => router.push('/')}>Return Home</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Price calculations
  const price = selectedVariant?.price !== undefined ? selectedVariant.price : product.basePrice;
  const originalPrice = selectedVariant?.originalPrice || product.originalPrice || price;
  const discountPercent = selectedVariant?.discountPercent || product.discountPercent || 0;

  const handleAddToCart = () => {
    if (isAdding) return;
    setIsAdding(true);
    addToCart(product, selectedVariant, quantity);
    toast.success(`${product.name} added to bag`, {
      description: `Quantity: {quantity} · Size: ${selectedVariant ? selectedVariant.attributes.volume : '100 ml'}`,
    });
    setTimeout(() => setIsAdding(false), 1200);
  };

  // Submit Review Form
  const handleReviewSubmit = (rating: number, comment: string, authorInput: string) => {
    if (!comment.trim()) {
      toast.error('Review message cannot be empty');
      return;
    }

    const author = user ? `${user.firstName} ${user.lastName}` : authorInput.trim() || 'Anonymous Client';

    addReviewMutation.mutate(
      {
        rating,
        comment,
        userName: author,
        userId: user?.id || 'guest',
      },
      {
        onSuccess: () => {
          toast.success('Thank you! Review added successfully.');
          setIsReviewModalOpen(false);
        },
        onError: () => {
          toast.error('Error submitting review');
        },
      }
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Modern Breadcrumb */}
        <div className="text-left text-[9px] tracking-[0.2em] uppercase text-muted-foreground mb-6 flex items-center space-x-2 font-sans font-medium">
          <Link href="/" className="hover:text-foreground transition-colors">Maison</Link>
          <ChevronRight className="h-2.5 w-2.5" />
          <Link href="/#catalog-section" className="hover:text-foreground transition-colors">Catalog</Link>
          <ChevronRight className="h-2.5 w-2.5" />
          <span className="text-foreground italic font-serif lowercase">{product.name}</span>
        </div>

        {/* Core details layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-14 text-left">
          
          {/* Gallery side (Lazy loaded with skeleton to prevent CLS) */}
          <ProductGallery
            images={product.images}
            productName={product.name}
            activeImage={activeImage}
            setActiveImage={setActiveImage}
          />

          {/* Buy actions panel */}
          <div ref={mainPurchasePanelRef} className="md:col-span-5 flex flex-col justify-start space-y-6">
            
            {/* Header info */}
            <div className="space-y-2">
              <span className="font-sans text-[8px] uppercase tracking-[0.25em] font-extrabold text-primary">
                {product.brand} · {product.specifications['Gender']}
              </span>
              <h1 className="text-2xl sm:text-3xl font-light text-foreground font-serif leading-tight tracking-wide">{product.name}</h1>
              
              <div className="flex items-center gap-2 pt-1">
                <Rating rating={product.rating} size={11} />
                <span className="text-[10px] text-muted-foreground font-sans">({product.reviewsCount} reviews)</span>
              </div>
            </div>

            {/* Price display */}
            <div className="py-2 border-y border-border/10 flex items-baseline gap-3">
              <span className="text-2xl font-bold text-foreground font-sans">${price.toFixed(2)}</span>
              {originalPrice > price && (
                <span className="text-sm text-muted-foreground line-through font-sans">${originalPrice.toFixed(2)}</span>
              )}
              {discountPercent > 0 && (
                <span className="font-sans font-black text-[8px] tracking-widest bg-amber-100 text-amber-800 px-2 py-0.5 rounded uppercase">
                  −{discountPercent}% OFF
                </span>
              )}
            </div>

            {/* Minimal Scent overview */}
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-sans font-light">
              {product.description}
            </p>

            {/* Variant selector */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-2">
                <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest block font-sans">Select Volume</span>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => {
                    const isSelected = selectedVariant?.id === v.id;
                    const label = v.attributes.volume || '100 ml';
                    return (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariant(v)}
                        className={cn(
                          'text-xs px-3.5 py-2 border rounded-xl font-bold cursor-pointer transition-all font-sans uppercase tracking-widest',
                          isSelected 
                            ? 'border-zinc-950 bg-zinc-950 text-white' 
                            : 'hover:bg-secondary border-border text-muted-foreground hover:border-zinc-400'
                        )}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity Selector & Main Cart Actions */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                {/* Quantity */}
                <div className="flex items-center border rounded-xl h-11 bg-background border-border overflow-hidden">
                  <button
                    onClick={() => {
                      if (quantityInCart > 0) {
                        updateQuantity(product.id, quantityInCart - 1, selectedVariant?.id);
                        toast.success('Updated cart', {
                          description: `Decreased quantity to ${quantityInCart - 1}`,
                          duration: 1500,
                        });
                      } else {
                        setQuantity((q) => Math.max(1, q - 1));
                      }
                    }}
                    className="px-3 h-full hover:bg-secondary flex items-center justify-center cursor-pointer transition-colors"
                  >
                    -
                  </button>
                  <span className="px-3 text-xs font-bold w-10 text-center select-none font-sans">
                    {quantityInCart > 0 ? quantityInCart : quantity}
                  </span>
                  <button
                    onClick={() => {
                      if (quantityInCart > 0) {
                        updateQuantity(product.id, quantityInCart + 1, selectedVariant?.id);
                        toast.success('Updated cart', {
                          description: `Increased quantity to ${quantityInCart + 1}`,
                          duration: 1500,
                        });
                      } else {
                        setQuantity((q) => q + 1);
                      }
                    }}
                    className="px-3 h-full hover:bg-secondary flex items-center justify-center cursor-pointer transition-colors"
                  >
                    +
                  </button>
                </div>

                {quantityInCart > 0 ? (
                  <Button
                    onClick={() => window.dispatchEvent(new CustomEvent('toggle-cart-drawer'))}
                    className="btn-shimmer flex-1 h-11 font-bold rounded-xl uppercase text-[10px] tracking-widest cursor-pointer flex items-center justify-center gap-2 bg-emerald-700 text-white hover:bg-emerald-800 border-none"
                  >
                    <Check className="h-4 w-4" /> Added (Open Bag)
                  </Button>
                ) : (
                  <Button
                    onClick={handleAddToCart}
                    className="btn-shimmer flex-1 h-11 font-bold rounded-xl uppercase text-[10px] tracking-widest cursor-pointer flex items-center justify-center gap-2 bg-zinc-950 text-white hover:bg-zinc-800"
                  >
                    {isAdding ? (
                      <>
                        <Check className="h-4 w-4 text-emerald-500" /> Added!
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="h-4 w-4" /> Add to Bag
                      </>
                    )}
                  </Button>
                )}

                <Button
                  variant="outline"
                  onClick={() => {
                    toggleWishlist(product);
                    toast.success(isFav ? 'Removed from wishlist' : 'Saved to wishlist');
                  }}
                  className="h-11 px-4 cursor-pointer rounded-xl border-border"
                  aria-label="Add to wishlist"
                >
                  <Heart className={cn('h-4 w-4 transition-colors', isFav ? 'fill-rose-500 text-rose-500 border-none' : 'text-muted-foreground')} />
                </Button>
              </div>
            </div>

            <Accordion type="single" className="w-full border-t border-border/10 pt-2">
              <AccordionItem value="notes" className="border-b border-border/10 py-1">
                <AccordionTrigger className="font-sans font-bold text-[9px] uppercase tracking-widest text-foreground hover:no-underline">
                  Olfactory Notes
                </AccordionTrigger>
                <AccordionContent className="font-sans text-xs leading-relaxed text-muted-foreground pt-1 pb-3 text-left">
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <span className="font-bold text-primary text-[8px] uppercase tracking-wider block mb-0.5">Top</span>
                      <p>{product.specifications['Top Notes'] || 'Citrus, Herbaceous'}</p>
                    </div>
                    <div>
                      <span className="font-bold text-primary text-[8px] uppercase tracking-wider block mb-0.5">Heart</span>
                      <p>{product.specifications['Heart Notes'] || 'Floral, Spicy'}</p>
                    </div>
                    <div>
                      <span className="font-bold text-primary text-[8px] uppercase tracking-wider block mb-0.5">Base</span>
                      <p>{product.specifications['Base Notes'] || 'Oud, Amber, Musk'}</p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="performance" className="border-b border-border/10 py-1">
                <AccordionTrigger className="font-sans font-bold text-[9px] uppercase tracking-widest text-foreground hover:no-underline">
                  Longevity & Sillage
                </AccordionTrigger>
                <AccordionContent className="font-sans text-xs leading-relaxed text-muted-foreground pt-1 pb-3 text-left space-y-2.5">
                  <div className="flex justify-between">
                    <span>Longevity:</span>
                    <span className="font-semibold text-foreground">{product.specifications['Longevity'] || '8-12 hours'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Projection / Sillage:</span>
                    <span className="font-semibold text-foreground">{product.specifications['Projection'] || 'Moderate to Strong'}</span>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="shipping" className="border-b border-border/10 py-1">
                <AccordionTrigger className="font-sans font-bold text-[9px] uppercase tracking-widest text-foreground hover:no-underline">
                  Complimentary Shipping & Packaging
                </AccordionTrigger>
                <AccordionContent className="font-sans text-xs leading-relaxed text-muted-foreground pt-1 pb-3 text-left space-y-1.5">
                  <p>All orders arrive in our signature gift presentation wraps wrapped in custom grosgrain ribbon (Complimentary).</p>
                  <p>Free standard courier shipping globally for orders above $150.</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {/* Clean minimalist guarantee */}
            <div className="flex items-center gap-2 justify-center pt-2 font-sans text-[9px] text-muted-foreground/60 tracking-wider uppercase">
              <ShieldCheck className="h-4 w-4 text-emerald-600/70" /> 100% Authentic Reserve Guarantee
            </div>
          </div>
        </div>

        {/* Testimonials Panel (Lazy loaded with skeleton to prevent CLS) */}
        <ProductReviews
          product={product}
          reviews={reviews}
          isLoadingReviews={isLoadingReviews}
          onWriteReview={() => setIsReviewModalOpen(true)}
        />
      </main>

      {/* Floating Sticky Buy pill capsule (sitting cleanly at bottom-4) */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-4 left-4 right-4 z-45"
          >
            <div className="max-w-xl mx-auto flex items-center justify-between gap-4 font-sans bg-zinc-950 text-white rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.35)] border border-white/8 px-4 py-2.5">
              <div className="flex items-center space-x-3 overflow-hidden">
                <div className="relative h-9 w-7 border border-white/10 rounded-lg bg-zinc-900 flex-shrink-0 overflow-hidden">
                  <OptimizedImage src={activeImage} alt={product.name} fill className="object-cover" />
                </div>
                <div className="text-left overflow-hidden">
                  <h4 className="text-xs font-bold text-white truncate">{product.name}</h4>
                  <p className="text-[9px] text-zinc-400 truncate">{selectedVariant ? selectedVariant.attributes.volume : '100 ml'}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3.5">
                <span className="text-xs font-bold text-white">${price.toFixed(2)}</span>
                <button 
                  onClick={() => {
                    if (quantityInCart > 0) {
                      window.dispatchEvent(new CustomEvent('toggle-cart-drawer'));
                    } else {
                      handleAddToCart();
                    }
                  }} 
                  className={cn(
                    "font-bold text-[9px] h-8 rounded-lg uppercase tracking-widest px-3.5 cursor-pointer transition-colors border-none",
                    quantityInCart > 0 
                      ? "bg-emerald-600 text-white hover:bg-emerald-700" 
                      : "bg-white text-zinc-950 hover:bg-zinc-200"
                  )}
                >
                  {quantityInCart > 0 ? 'Added (Open Bag)' : isAdding ? 'Added' : 'Add To Bag'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Review Dialog Modal (Lazy loaded on demand) */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        productName={product.name}
        isAuthenticated={isAuthenticated}
        isPending={addReviewMutation.isPending}
        onSubmit={handleReviewSubmit}
      />

      <Footer />
    </div>
  );
}
