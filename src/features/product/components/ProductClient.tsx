'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart, ShoppingBag, Check, AlertTriangle, ShieldCheck, Sparkles, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Rating } from '@/components/common/Rating';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { Header } from '@/features/shared/components/Header';
import { Footer } from '@/features/shared/components/Footer';
import { Loader } from '@/components/common/Loader';
import { EmptyState } from '@/components/common/EmptyState';
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

interface ProductClientProps {
  slug: string;
}

export function ProductClient({ slug }: ProductClientProps) {
  const router = useRouter();
  const { data: product, isLoading: isLoadingProduct } = useProductBySlug(slug);
  const { data: reviews, isLoading: isLoadingReviews } = useProductReviews(product?.id || '');
  const { data: related } = useRelatedProducts(product?.id || '', 4);

  // States
  const [selectedVariant, setSelectedVariant] = React.useState<ProductVariant | undefined>(undefined);
  const [activeImage, setActiveImage] = React.useState<string>('');
  const [quantity, setQuantity] = React.useState(1);
  const [isReviewModalOpen, setIsReviewModalOpen] = React.useState(false);
  const [showStickyBar, setShowStickyBar] = React.useState(false);
  const mainPurchasePanelRef = React.useRef<HTMLDivElement>(null);

  // Review Form States
  const [newRating, setNewRating] = React.useState(5);
  const [newComment, setNewComment] = React.useState('');
  const [newAuthor, setNewAuthor] = React.useState('');

  // Stores
  const addToCart = useCartStore((s) => s.addToCart);
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const { isAuthenticated, user } = useAuthStore();
  
  // Mutations
  const addReviewMutation = useAddReview(product?.id || '');

  const isFav = product ? isInWishlist(product.id) : false;

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
            <Button className="mt-4 rounded-sm" onClick={() => router.push('/')}>Return Home</Button>
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
    addToCart(product, selectedVariant, quantity);
    toast.success(`${product.name} added to bag`, {
      description: `Quantity: ${quantity} · Size: ${selectedVariant ? selectedVariant.attributes.volume : '100 ml'}`,
    });
  };

  const handleBuyNow = () => {
    addToCart(product, selectedVariant, quantity);
    router.push('/checkout');
  };

  // Magnifying Glass Zoom Effect coordinates on Hover
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    
    const target = e.currentTarget.querySelector('.zoom-target') as HTMLImageElement;
    if (target) {
      target.style.transformOrigin = `${x}% ${y}%`;
      target.style.transform = 'scale(1.7)';
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.currentTarget.querySelector('.zoom-target') as HTMLImageElement;
    if (target) {
      target.style.transform = 'scale(1)';
    }
  };

  // Submit Review Form
  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) {
      toast.error('Review message cannot be empty');
      return;
    }

    const author = user ? `${user.firstName} ${user.lastName}` : newAuthor.trim() || 'Anonymous Client';

    addReviewMutation.mutate(
      {
        rating: newRating,
        comment: newComment,
        userName: author,
        userId: user?.id || 'guest',
      },
      {
        onSuccess: () => {
          toast.success('Thank you! Review added successfully.');
          setIsReviewModalOpen(false);
          setNewComment('');
          setNewAuthor('');
        },
        onError: () => {
          toast.error('Error submitting review');
        },
      }
    );
  };

  // Dynamic review distribution
  const ratingBreakdown = [5, 4, 3, 2, 1].map((r) => {
    const matching = reviews?.filter((rev) => Math.round(rev.rating) === r) || [];
    const percent = reviews && reviews.length > 0 ? (matching.length / reviews.length) * 100 : 0;
    return { stars: r, count: matching.length, percent };
  });

  const bundleProduct = related?.[0] || null;
  const bundleTotalPrice = bundleProduct ? price + bundleProduct.basePrice : price;

  const handleAddBundle = () => {
    if (!bundleProduct) return;
    addToCart(product, selectedVariant, 1);
    addToCart(bundleProduct, bundleProduct.variants?.[0], 1);
    toast.success('Successfully added bundle items to bag!', {
      description: `${product.name} + ${bundleProduct.name}`,
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <div className="text-left text-xs text-muted-foreground mb-8 flex items-center space-x-1.5 font-sans font-light">
          <Link href="/" className="hover:underline">Maison Home</Link>
          <span>/</span>
          <Link href="/categories" className="hover:underline capitalize font-semibold">Fragrances</Link>
          <span>/</span>
          <span className="font-semibold text-foreground italic">{product.name}</span>
        </div>

        {/* Core details layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16 text-left">
          {/* Gallery side */}
          <div className="space-y-4">
            <div
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="relative aspect-[3/4] w-full bg-secondary border border-border/40 rounded-sm overflow-hidden cursor-crosshair group luxury-shadow"
            >
              <img
                src={activeImage}
                alt={product.name}
                className="zoom-target w-full h-full object-cover transition-transform duration-100 ease-out"
              />
            </div>
            {/* Thumbnails row */}
            <div className="flex items-center space-x-3 overflow-x-auto no-scrollbar">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`relative h-20 w-16 flex-shrink-0 bg-secondary rounded-sm overflow-hidden border transition-all cursor-pointer ${activeImage === img ? 'border-primary ring-2 ring-primary/25 scale-[0.98]' : 'opacity-70 hover:opacity-100'}`}
                >
                  <OptimizedImage src={img} alt={`Scent view ${idx}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Buy actions panel */}
          <div ref={mainPurchasePanelRef} className="space-y-6 flex flex-col justify-between">
            <div className="space-y-5">
              <div>
                <span className="text-[10px] uppercase tracking-widest font-extrabold text-primary font-sans block mb-1">
                  {product.specifications['Fragrance Family']} · {product.specifications['Gender']}
                </span>
                <h1 className="text-3xl sm:text-4xl font-semibold text-foreground font-serif italic tracking-wide">{product.name}</h1>
                
                {product.inspiredBy && (
                  <p className="text-xs text-muted-foreground mt-1.5 font-sans font-medium tracking-wide">
                    Inspired by <span className="text-foreground font-bold">{product.inspiredBy}</span>
                  </p>
                )}

                <div className="flex items-center space-x-2 mt-2.5">
                  <Rating rating={product.rating} size={13} />
                  <span className="text-xs text-muted-foreground font-sans font-medium">({product.rating} average out of {product.reviewsCount} reviews)</span>
                </div>
              </div>

              {/* Pricing Details */}
              <div className="border-y py-4 border-border/40">
                <div className="flex items-baseline space-x-3">
                  <span className="text-2xl sm:text-3xl font-bold text-foreground font-sans">${price.toFixed(2)}</span>
                  {originalPrice > price && (
                    <span className="text-sm sm:text-base text-muted-foreground line-through font-sans">${originalPrice.toFixed(2)}</span>
                  )}
                  {discountPercent > 0 && (
                    <Badge variant="destructive" className="font-bold text-xs rounded-none px-2.5">
                      -{discountPercent}% SPECIAL RESERVE
                    </Badge>
                  )}
                </div>
              </div>

              {/* Product description */}
              <p className="text-sm text-muted-foreground leading-relaxed font-sans font-light">{product.longDescription || product.description}</p>
              
              {/* Olfactory Notes Grid (Luxury Perfume Specific) */}
              <div className="border border-border/40 p-6 bg-secondary/5 rounded-sm space-y-4">
                <h3 className="text-[10px] font-extrabold tracking-widest uppercase text-foreground border-b pb-2 mb-2 font-sans flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-primary" /> Olfactory Pyramid
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-sans font-light">
                  <div className="space-y-1 text-left">
                    <span className="font-bold text-primary tracking-wider uppercase text-[9px] block">Top Notes</span>
                    <p className="text-muted-foreground leading-normal font-medium">{product.specifications['Top Notes']}</p>
                  </div>
                  <div className="space-y-1 text-left">
                    <span className="font-bold text-primary tracking-wider uppercase text-[9px] block">Heart Notes</span>
                    <p className="text-muted-foreground leading-normal font-medium">{product.specifications['Heart Notes']}</p>
                  </div>
                  <div className="space-y-1 text-left">
                    <span className="font-bold text-primary tracking-wider uppercase text-[9px] block">Base Notes</span>
                    <p className="text-muted-foreground leading-normal font-medium">{product.specifications['Base Notes']}</p>
                  </div>
                </div>
              </div>

              {/* Scent Performance statistics (Progress bars) */}
              <div className="space-y-4 border-t pt-4 border-border/30 font-sans text-xs">
                <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block font-sans">Scent Metrics</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                  <div className="space-y-1.5 text-left">
                    <div className="flex justify-between font-medium text-muted-foreground">
                      <span>Longevity</span>
                      <span className="text-foreground font-semibold">{product.specifications['Longevity'] || '8h+'}</span>
                    </div>
                    <div className="h-1 bg-secondary w-full rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: product.specifications['Longevity']?.includes('12h+') ? '95%' : '80%' }} />
                    </div>
                  </div>
                  <div className="space-y-1.5 text-left">
                    <div className="flex justify-between font-medium text-muted-foreground">
                      <span>Sillage / Projection</span>
                      <span className="text-foreground font-semibold">{product.specifications['Projection'] || 'Strong'}</span>
                    </div>
                    <div className="h-1 bg-secondary w-full rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: product.specifications['Projection']?.includes('Heavy') ? '90%' : '75%' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Custom Signature gift boxes */}
              <div className="space-y-2.5 border-t pt-4 border-border/30 font-sans text-xs">
                <span className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest block font-sans">Maison Packaging Showcase</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 border border-primary/20 bg-primary/2 rounded-sm text-left cursor-pointer">
                    <span className="font-semibold text-foreground block">Maison Gold-Foil Packaging</span>
                    <span className="text-[10px] text-muted-foreground/80 block mt-0.5 leading-normal">Wrapped in textured ivory paper boxes and charcoal ribbon (Complimentary).</span>
                  </div>
                  <div className="p-3 border border-border hover:border-muted-foreground/40 rounded-sm text-left cursor-pointer transition-all">
                    <span className="font-semibold text-foreground block">Standard Shipping Shield</span>
                    <span className="text-[10px] text-muted-foreground/80 block mt-0.5 leading-normal">Sealed in protective, generic box for clean transport.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6 pt-4">
              {/* Variant Swatches (Volume Selector) */}
              {product.variants && product.variants.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block font-sans">Available Volume</span>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((v) => {
                      const isSelected = selectedVariant?.id === v.id;
                      const label = v.attributes.volume || '100 ml';
                      return (
                        <button
                          key={v.id}
                          onClick={() => setSelectedVariant(v)}
                          className={`text-xs px-4 py-2 border rounded-sm font-bold cursor-pointer transition-colors font-sans uppercase tracking-widest ${isSelected ? 'border-primary bg-primary/5 text-primary' : 'hover:bg-secondary border-border text-muted-foreground'}`}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quantity Selector & Main Cart Actions */}
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-4">
                  {/* Quantity */}
                  <div className="flex items-center border rounded-sm h-11 bg-background border-border">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="px-3.5 h-full hover:bg-secondary flex items-center justify-center cursor-pointer transition-colors"
                    >
                      -
                    </button>
                    <span className="px-4 text-xs font-bold w-12 text-center select-none font-sans">{quantity}</span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="px-3.5 h-full hover:bg-secondary flex items-center justify-center cursor-pointer transition-colors"
                    >
                      +
                    </button>
                  </div>

                  <Button
                    onClick={handleAddToCart}
                    className="flex-1 h-11 font-bold rounded-sm uppercase text-xs tracking-wider cursor-pointer flex items-center justify-center gap-1.5 bg-primary text-primary-foreground hover:bg-primary/95"
                  >
                    <ShoppingBag className="h-4 w-4" /> Add to Bag
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => {
                      toggleWishlist(product);
                      toast.success(isFav ? 'Removed from wishlist' : 'Saved to wishlist');
                    }}
                    className="h-11 px-4 cursor-pointer rounded-sm border-border"
                    aria-label="Add to wishlist"
                  >
                    <Heart className={`h-4 w-4 ${isFav ? 'fill-rose-500 text-rose-500 border-none' : 'text-muted-foreground'}`} />
                  </Button>
                </div>

                <Button
                  variant="secondary"
                  onClick={handleBuyNow}
                  className="w-full h-11 font-bold bg-secondary text-secondary-foreground hover:bg-secondary/80 cursor-pointer rounded-sm uppercase text-xs tracking-wider border"
                >
                  Instant Checkout
                </Button>
              </div>

              {/* Authenticity Guarantee Card */}
              <div className="border border-border/50 rounded-sm p-4 bg-secondary/5 flex items-start space-x-3 text-xs font-sans">
                <ShieldCheck className="h-5 w-5 text-primary flex-shrink-0" />
                <div className="space-y-0.5 text-left">
                  <h5 className="font-semibold text-foreground">100% Originality Certified</h5>
                  <p className="text-[10px] text-muted-foreground leading-normal font-light">
                    Every bottle is filled and certified at Meer Hamza Private Reserves. Signed authentication certificates are enclosed inside your package.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. FREQUENTLY BOUGHT TOGETHER BUNDLE */}
        {bundleProduct && (
          <section className="mt-20 border border-border/50 rounded-sm p-6 bg-secondary/5 text-left luxury-shadow">
            <h3 className="text-xs font-bold uppercase tracking-widest text-foreground mb-4 font-sans border-b pb-2">Frequently Layered Together</h3>
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 font-sans">
              <div className="flex items-center space-x-4">
                <div className="relative h-20 w-16 border rounded-sm overflow-hidden bg-secondary">
                  <OptimizedImage src={product.images[0]} alt={product.name} fill className="object-cover" />
                </div>
                <span className="text-lg font-bold text-muted-foreground font-serif">+</span>
                <div className="relative h-20 w-16 border rounded-sm overflow-hidden bg-secondary">
                  <OptimizedImage src={bundleProduct.images[0]} alt={bundleProduct.name} fill className="object-cover" />
                </div>
                <div className="hidden sm:block pl-2">
                  <p className="text-sm font-serif italic text-foreground">{product.name}</p>
                  <p className="text-xs text-muted-foreground font-medium">Layered with {bundleProduct.name}</p>
                </div>
              </div>

              {/* Price and Add Bundle Button */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="text-center sm:text-right">
                  <span className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold block">Combined Price</span>
                  <span className="text-lg font-bold text-foreground">${bundleTotalPrice.toFixed(2)}</span>
                </div>
                <Button onClick={handleAddBundle} className="cursor-pointer font-bold text-xs uppercase tracking-wider rounded-sm h-10 px-5 bg-primary text-primary-foreground hover:bg-primary/95">
                  Add Layering Set
                </Button>
              </div>
            </div>
          </section>
        )}

        {/* 3. REVIEWS PANEL */}
        <section className="mt-24 text-left border-t pt-12">
          <div className="flex flex-col md:flex-row md:items-start justify-between mb-8 gap-6 border-b pb-4">
            <div>
              <h2 className="text-2xl font-serif italic text-foreground tracking-wide">Client Testimonials</h2>
              <div className="flex items-center space-x-2 mt-2 font-sans text-xs">
                <Rating rating={product.rating} size={13} />
                <span className="font-semibold text-muted-foreground">({product.rating} average out of {product.reviewsCount} reviews)</span>
              </div>
            </div>
            <Button onClick={() => setIsReviewModalOpen(true)} className="cursor-pointer font-bold text-xs uppercase tracking-wider rounded-sm h-10 px-5">
              Write a Review
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Breakdown meters */}
            <div className="space-y-3 font-sans">
              <h3 className="font-bold text-[10px] text-muted-foreground uppercase tracking-widest mb-3">Rating Breakdown</h3>
              {ratingBreakdown.map((r) => (
                <div key={r.stars} className="flex items-center text-xs space-x-3 font-semibold">
                  <span className="w-12 text-muted-foreground">{r.stars} stars</span>
                  <div className="flex-1 h-1 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${r.percent}%` }} />
                  </div>
                  <span className="w-8 text-right text-muted-foreground">{r.count}</span>
                </div>
              ))}
            </div>

            {/* Reviews list */}
            <div className="lg:col-span-2 space-y-6">
              {isLoadingReviews ? (
                <Loader />
              ) : reviews && reviews.length > 0 ? (
                <div className="space-y-6 divide-y divide-border/50">
                  {reviews.map((rev) => (
                    <div key={rev.id} className="pt-6 first:pt-0">
                      <div className="flex justify-between items-start font-sans">
                        <div className="flex items-center space-x-3">
                          <div className="h-8 w-8 rounded-full bg-secondary overflow-hidden border flex items-center justify-center text-[10px] font-bold text-muted-foreground font-sans">
                            {rev.userName.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-foreground">{rev.userName}</p>
                            <p className="text-[9px] text-muted-foreground flex items-center gap-1.5 mt-0.5 font-bold">
                              <span>{new Date(rev.createdAt).toLocaleDateString()}</span>
                              {rev.verified && <span className="text-emerald-600 uppercase tracking-widest text-[8px] border border-emerald-500/20 px-1 rounded-sm bg-emerald-500/5">Verified Scent</span>}
                            </p>
                          </div>
                        </div>
                        <Rating rating={rev.rating} size={11} />
                      </div>
                      <p className="text-xs text-muted-foreground/90 mt-3 leading-relaxed font-sans font-medium">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="No testimonials yet"
                  description="Share your olfactory experience with this scent by clicking the write button."
                />
              )}
            </div>
          </div>
        </section>
      </main>

      {/* 4. STICKY PURCHASING BAR (Floats above mobile bottom nav bar!) */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-[56px] md:bottom-0 left-0 right-0 z-30 border-t bg-background/95 backdrop-blur-md shadow-2xl py-3 px-4"
          >
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 font-sans">
              <div className="flex items-center space-x-3 overflow-hidden">
                <div className="relative h-10 w-8 border border-border/40 rounded-sm bg-secondary flex-shrink-0">
                  <OptimizedImage src={activeImage} alt={product.name} fill className="object-cover" />
                </div>
                <div className="text-left overflow-hidden">
                  <h4 className="text-xs sm:text-sm font-bold text-foreground truncate">{product.name}</h4>
                  <p className="text-[10px] text-muted-foreground truncate">{selectedVariant ? selectedVariant.attributes.volume : '100 ml'}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <span className="text-sm font-bold">${price.toFixed(2)}</span>
                <Button onClick={handleAddToCart} size="sm" className="font-bold text-[10px] h-8 rounded-sm uppercase tracking-wider px-3 cursor-pointer bg-primary text-primary-foreground hover:bg-primary/95">
                  Add To Bag
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. WRITE A REVIEW DIALOG */}
      <Dialog isOpen={isReviewModalOpen} onClose={() => setIsReviewModalOpen(false)} size="md">
        <DialogHeader>
          <DialogTitle className="font-serif italic text-lg text-foreground">Write a Testimonial</DialogTitle>
          <DialogDescription>Share your honest feedback about {product.name} with other scent collectors.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleReviewSubmit}>
          <DialogContent className="space-y-4 p-6 font-sans">
            {/* Rating Selector */}
            <div className="space-y-1.5 text-left">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">Scent Rating:</label>
              <Rating rating={newRating} size={24} interactive onChange={(val) => setNewRating(val)} />
            </div>

            {/* Author Input (if guest) */}
            {!isAuthenticated && (
              <div className="space-y-1 text-left">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">Your Name:</label>
                <Input
                  type="text"
                  placeholder="e.g. Usman D."
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  className="rounded-sm border-border"
                  required
                />
              </div>
            )}

            {/* Comment Field */}
            <div className="space-y-1 text-left">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">Olfactory Feedback:</label>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="How long does it last? What notes stand out to you?"
                rows={4}
                className="flex w-full rounded-sm border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                required
              />
            </div>
          </DialogContent>
          <DialogFooter className="rounded-sm">
            <Button variant="outline" type="button" onClick={() => setIsReviewModalOpen(false)} className="rounded-sm">
              Cancel
            </Button>
            <Button type="submit" disabled={addReviewMutation.isPending} className="cursor-pointer rounded-sm bg-primary text-primary-foreground hover:bg-primary/95">
              {addReviewMutation.isPending ? 'Submitting...' : 'Submit Testimonial'}
            </Button>
          </DialogFooter>
        </form>
      </Dialog>

      <Footer />
    </div>
  );
}
