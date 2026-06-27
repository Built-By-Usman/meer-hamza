'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Sparkles, Award, Quote, CheckCircle, ShieldCheck, Truck, ShoppingBag, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProductCard } from '@/features/catalog/components/ProductCard';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { Rating } from '@/components/common/Rating';
import { Header } from '@/features/shared/components/Header';
import { Footer } from '@/features/shared/components/Footer';
import { Loader } from '@/components/common/Loader';
import {
  useFeaturedProducts,
  useNewArrivals,
  useCategories,
} from '@/features/shared/hooks/queries';
import { motion } from 'framer-motion';

// --- Value Pillars Grid ---
const WHY_CHOOSE_US = [
  {
    title: 'Botanical Craftsmanship',
    description: 'Each fragrance is carefully hand-blended in small batches using pure, raw essential oils.',
    icon: <Award className="h-5 w-5 text-primary stroke-[1.25]" />,
  },
  {
    title: 'Complimentary Express Shipping',
    description: 'Maison priority courier delivery on all orders over $80.',
    icon: <Truck className="h-5 w-5 text-primary stroke-[1.25]" />,
  },
  {
    title: 'Signature Gold Gift Wrapping',
    description: 'Delivered in signature cotton ivory boxes wrapped in dark charcoal grosgrain ribbon.',
    icon: <Sparkles className="h-5 w-5 text-primary stroke-[1.25]" />,
  },
  {
    title: 'Authenticity Guarantee',
    description: 'Direct formulations from Meer Hamza Private Reserves with tracking certificates.',
    icon: <ShieldCheck className="h-5 w-5 text-primary stroke-[1.25]" />,
  },
];

export function HomeClient() {
  const { data: featured, isLoading: isLoadingFeatured } = useFeaturedProducts();
  const { data: newArrivals, isLoading: isLoadingNew } = useNewArrivals();
  const { data: categories, isLoading: isLoadingCats } = useCategories();

  // Signature horizontal scroll container ref
  const signatureScrollRef = React.useRef<HTMLDivElement>(null);

  // Scroll function for signature shelf
  const handleScroll = (direction: 'left' | 'right') => {
    if (signatureScrollRef.current) {
      const { scrollLeft, clientWidth } = signatureScrollRef.current;
      const cardWidth = 300; // width + gap
      const offset = direction === 'left' ? -cardWidth * 2 : cardWidth * 2;
      signatureScrollRef.current.scrollTo({
        left: scrollLeft + offset,
        behavior: 'smooth',
      });
    }
  };

  // Asymmetrical Spotlights
  const spotlightProduct = newArrivals?.[0] || null;
  const secondaryArrivals = newArrivals?.slice(1, 5) || [];

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <Header />

      {/* 1. CINEMATIC HERO SECTION */}
      <section className="relative w-full h-[600px] md:h-[780px] bg-zinc-950 overflow-hidden flex items-center justify-center">
        {/* Full bleed premium background image */}
        <div className="absolute inset-0 w-full h-full">
          <OptimizedImage
            src="https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1800&auto=format&fit=crop"
            alt="Meer Hamza Maison Royal Oud"
            fill
            priority
            containerClassName="w-full h-full rounded-none"
            className="object-cover opacity-65 scale-[1.01]"
          />
          {/* Subtle elegant gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/80" />
        </div>

        {/* Cinematic Content overlay */}
        <div className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 text-white flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] font-extrabold text-primary bg-black/40 px-4 py-1.5 border border-primary/20 rounded-sm">
              L'Artisan Parfumeur
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl sm:text-6xl md:text-7.5xl font-serif italic font-light tracking-wide text-primary-foreground leading-[1.1] max-w-3xl drop-shadow-[0_4px_12px_rgba(0,0,0,0.85)]"
          >
            Royal Oud Private Reserve
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xs sm:text-sm md:text-base text-zinc-200 leading-relaxed font-light font-sans max-w-xl drop-shadow-[0_2px_6px_rgba(0,0,0,0.85)]"
          >
            An imperial signature blend combining rare Cambodian Agarwood, rich saffron pistils, and creamy Mysore Sandalwood. Formulated in extreme parfum concentration.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="pt-4"
          >
            <Link href="/product/royal-oud">
              <Button size="lg" className="rounded-sm shadow-md font-bold text-xs uppercase tracking-widest bg-primary text-primary-foreground hover:bg-primary/95 h-12 px-8 border border-transparent cursor-pointer">
                Discover The Scent
              </Button>
            </Link>
          </motion.div>

          {/* Floating Glassmorphic Coordinates placard */}
          <motion.div
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.6 }}
            className="hidden xl:block absolute right-8 bottom-4 w-72 p-5 bg-black/45 backdrop-blur-md border border-primary/25 rounded-sm text-left space-y-2.5 shadow-2xl"
          >
            <span className="text-[8px] uppercase tracking-widest font-extrabold text-primary">Scent Coordinates</span>
            <h4 className="font-serif italic text-base text-primary-foreground">Royal Oud Formulation</h4>
            <div className="space-y-1 text-[10px] text-zinc-300 font-sans font-light">
              <div className="flex justify-between border-b border-white/10 pb-1">
                <span>Longevity</span>
                <span className="font-bold text-foreground">12h+ (Extraordinary)</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-1">
                <span>Sillage Projection</span>
                <span className="font-bold text-foreground">Intense & Heavy</span>
              </div>
              <div className="flex justify-between pb-0.5">
                <span>Core Accords</span>
                <span className="font-bold text-foreground">Oud, Saffron, Sandalwood</span>
              </div>
            </div>
          </motion.div>

          {/* Scroll Down Pulser */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-2 pointer-events-none">
            <span className="text-[9px] uppercase tracking-widest text-zinc-400 font-medium font-sans">Scroll To Explore</span>
            <div className="w-[1px] h-8 bg-primary/35 relative overflow-hidden">
              <motion.div
                animate={{ y: ['-100%', '100%'] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
                className="absolute top-0 left-0 w-full h-1/2 bg-primary"
              />
            </div>
          </div>
        </div>
      </section>

      <main className="flex-1 bg-background">
        {/* 2. SIGNATURE COLLECTIONS */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 sm:py-36">
          <div className="text-center max-w-xl mx-auto mb-16 space-y-2">
            <span className="text-[10px] uppercase tracking-widest font-extrabold text-primary font-sans">
              Olfactory Universes
            </span>
            <h2 className="text-2.5xl sm:text-3xl font-serif italic text-foreground tracking-wide relative group inline-block">
              Signature Collections
              <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-primary group-hover:w-full transition-all duration-500" />
            </h2>
            <div className="h-[1px] w-12 bg-primary/45 mx-auto mt-3" />
          </div>

          {isLoadingCats ? (
            <Loader />
          ) : (
            <div className="flex lg:grid lg:grid-cols-5 gap-6 overflow-x-auto lg:overflow-visible pb-6 lg:pb-0 snap-x snap-mandatory scroll-smooth no-scrollbar w-full">
              {categories?.slice(0, 5).map((cat, idx) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  className="group relative aspect-[3/4] w-[240px] sm:w-[280px] lg:w-auto flex-shrink-0 snap-start rounded-sm overflow-hidden bg-secondary border border-border/40 shadow-xs hover:shadow-lg transition-all duration-500 luxury-glow"
                >
                  <OptimizedImage
                    src={cat.image}
                    alt={cat.name}
                    fill
                    loading={idx === 0 ? 'eager' : 'lazy'}
                    className="transition-transform duration-[1000ms] ease-out group-hover:scale-[1.04] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/95 via-zinc-950/60 to-transparent flex flex-col justify-end p-5 text-white text-left">
                    <h3 className="font-bold text-sm tracking-wider uppercase font-sans text-primary-foreground drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)]">{cat.name}</h3>
                    <p className="text-[9px] text-zinc-300 leading-relaxed font-sans line-clamp-2 mt-1.5 font-light drop-shadow-[0_1px_3px_rgba(0,0,0,0.85)]">
                      {cat.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* 3. SIGNATURE SELECTION PRODUCTS (ADVANCED HORIZONTAL SCROLL SHELF) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 sm:py-36 border-t border-border/40 relative">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-16 text-left">
            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-widest font-extrabold text-primary font-sans">
                Maison Masterpieces
              </span>
              <h2 className="text-2.5xl sm:text-3xl font-serif italic text-foreground tracking-wide relative group inline-block">
                Signature Selection
                <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-primary group-hover:w-full transition-all duration-500" />
              </h2>
              <p className="text-xs text-muted-foreground mt-2 font-sans font-light max-w-md leading-relaxed">
                Browse our finest luxury formulations. Formulated with high sillage oil concentration and pure botanical resins.
              </p>
            </div>

            {/* Slider Navigation controls */}
            <div className="flex items-center space-x-3 mt-6 sm:mt-0">
              <button
                onClick={() => handleScroll('left')}
                className="h-10 w-10 border border-primary/20 hover:border-primary/50 text-foreground flex items-center justify-center rounded-full hover:bg-secondary/40 transition-all cursor-pointer"
                aria-label="Scroll left"
              >
                <ArrowLeft className="h-4 w-4 stroke-[1.25]" />
              </button>
              <button
                onClick={() => handleScroll('right')}
                className="h-10 w-10 border border-primary/20 hover:border-primary/50 text-foreground flex items-center justify-center rounded-full hover:bg-secondary/40 transition-all cursor-pointer"
                aria-label="Scroll right"
              >
                <ArrowRight className="h-4 w-4 stroke-[1.25]" />
              </button>
            </div>
          </div>

          {isLoadingFeatured ? (
            <Loader />
          ) : (
            <div
              ref={signatureScrollRef}
              className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scroll-smooth no-scrollbar"
            >
              {featured?.map((product) => (
                <div
                  key={product.id}
                  className="snap-start w-[270px] sm:w-[300px] flex-shrink-0"
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 4. BRAND STORY (Editorial Split View) */}
        <section className="w-full bg-secondary/15 border-y border-border/40 py-28 sm:py-36">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-16 items-center">
              {/* Left Column: Image */}
              <div className="lg:col-span-6 relative aspect-[4/3] w-full rounded-sm overflow-hidden border border-border/60 luxury-shadow">
                <OptimizedImage
                  src="https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?q=80&w=1200&auto=format&fit=crop"
                  alt="Meer Hamza Maison Craftsmanship"
                  fill
                  className="object-cover scale-[1.01]"
                />
              </div>

              {/* Right Column: Text content */}
              <div className="lg:col-span-6 text-left space-y-6">
                <span className="text-[10px] uppercase tracking-widest font-extrabold text-primary font-sans">
                  The House Philosophy
                </span>
                <h2 className="text-3xl sm:text-4xl font-serif italic text-foreground leading-tight">
                  Crafted by Hand, Seared in Memory
                </h2>
                <div className="h-[1px] w-12 bg-primary/45" />

                <div className="space-y-4 text-xs sm:text-sm text-muted-foreground font-sans leading-relaxed font-light">
                  <p>
                    Established on the principles of haute perfumery, Meer Hamza Maison is dedicated to the creation of emotional liquid memories. Every batch begins in Grasse, France and is aged inside our private reserves to achieve exceptional projection and longevity.
                  </p>
                  <p>
                    We collect rare resins, botanical elements, and hand-selected agarwoods from around the globe. Our iconic bottles are sealed by hand and delivered inside signature gold-foil cotton ivory boxes wrapped in grosgrain ribbon — representing the peak of luxury craftsmanship.
                  </p>
                </div>

                <div className="pt-2">
                  <Link href="/categories">
                    <Button variant="outline" className="rounded-sm font-bold text-xs uppercase tracking-widest h-11 border-border/80 hover:bg-secondary cursor-pointer">
                      Explore All Collections
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. ASYMMETRICAL NEW ARRIVALS GRID */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 sm:py-36 border-t border-border/40">
          <div className="text-center max-w-xl mx-auto mb-20 space-y-2">
            <span className="text-[10px] uppercase tracking-widest font-extrabold text-primary font-sans">
              Latest Additions
            </span>
            <h2 className="text-2.5xl sm:text-3xl font-serif italic text-foreground tracking-wide relative group inline-block">
              New Arrivals
              <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-primary group-hover:w-full transition-all duration-500" />
            </h2>
            <div className="h-[1px] w-12 bg-primary/45 mx-auto mt-3" />
          </div>

          {isLoadingNew ? (
            <Loader />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
              {/* Left Column: Big Spotlight portrait card (5/12 width) */}
              {spotlightProduct && (
                <div className="lg:col-span-5 flex flex-col justify-between border border-border/50 rounded-sm p-6 bg-zinc-950 text-white relative overflow-hidden luxury-shadow min-h-[500px]">
                  <div className="absolute inset-0 z-0">
                    <OptimizedImage
                      src={spotlightProduct.images[0]}
                      alt={spotlightProduct.name}
                      fill
                      className="object-cover opacity-45 scale-[1.01] hover:scale-[1.04] transition-all duration-1000"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />
                  </div>

                  {/* Tag */}
                  <div className="relative z-10">
                    <Badge className="font-extrabold text-[9px] rounded-none uppercase tracking-widest px-2.5 py-1 bg-primary text-primary-foreground border-none">
                      Maison Spotlight
                    </Badge>
                  </div>

                  {/* Spotlight Info */}
                  <div className="relative z-10 space-y-4 pt-48 drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
                    <span className="text-[9px] uppercase tracking-widest font-extrabold text-primary font-sans block">
                      Inspired by {spotlightProduct.inspiredBy}
                    </span>
                    <h3 className="text-3xl font-serif italic text-white tracking-wide leading-tight">{spotlightProduct.name}</h3>
                    <p className="text-xs text-zinc-200 leading-relaxed font-sans font-light line-clamp-3">
                      {spotlightProduct.description}
                    </p>
                    
                    {/* Key Notes list overlay */}
                    <div className="border-t border-white/20 pt-3 text-[10px] font-sans font-light grid grid-cols-3 gap-2 text-zinc-300">
                      <div>
                        <span className="font-bold text-primary text-[8px] uppercase tracking-wider block">Top Notes</span>
                        <span className="truncate block font-medium text-white">{spotlightProduct.specifications['Top Notes']?.split(',')[0]}</span>
                      </div>
                      <div>
                        <span className="font-bold text-primary text-[8px] uppercase tracking-wider block">Heart Notes</span>
                        <span className="truncate block font-medium text-white">{spotlightProduct.specifications['Heart Notes']?.split(',')[0]}</span>
                      </div>
                      <div>
                        <span className="font-bold text-primary text-[8px] uppercase tracking-wider block">Base Notes</span>
                        <span className="truncate block font-medium text-white">{spotlightProduct.specifications['Base Notes']?.split(',')[0]}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 pt-3">
                      <Link href={`/product/${spotlightProduct.slug}`} className="flex-1">
                        <Button className="w-full rounded-sm font-bold text-xs uppercase tracking-widest h-11 bg-primary text-primary-foreground hover:bg-primary/95 flex items-center justify-center gap-1 cursor-pointer">
                          <Eye className="h-4 w-4" /> Explore Spotlight
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* Right Column: 2x2 grid of smaller cards (7/12 width) */}
              <div className="lg:col-span-7 grid grid-cols-2 gap-6 sm:gap-8">
                {secondaryArrivals.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}
        </section>

        {/* FRAGRANCE FINDER INTERACTIVE BANNER */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="w-full bg-primary/5 border border-primary/20 p-8 sm:p-12 rounded-sm text-center space-y-4 relative overflow-hidden luxury-shadow">
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
            <Sparkles className="h-8 w-8 mx-auto text-primary animate-pulse stroke-[1.25]" />
            <h3 className="font-serif italic text-2xl sm:text-3xl text-foreground">Find Your Perfect Scent Profile</h3>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto font-sans font-light leading-relaxed">
              Answer 3 simple questions about your preferences, lifestyle, and occasion, and let our Maison algorithm recommend the ideal fragrance matching your style.
            </p>
            <div className="pt-2">
              <Button
                onClick={() => window.dispatchEvent(new CustomEvent('toggle-fragrance-quiz'))}
                className="rounded-sm font-bold text-xs uppercase tracking-widest h-11 px-8 bg-primary text-primary-foreground hover:bg-primary/95 cursor-pointer"
              >
                Start Fragrance Finder Quiz
              </Button>
            </div>
          </div>
        </section>

        {/* WHY CHOOSE MEER HAMZA (Editorial Value Grid with divider lines) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 border-t border-border/40">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-primary/25 border-y border-primary/25 py-12 bg-secondary/5 rounded-sm">
            {WHY_CHOOSE_US.map((item, idx) => (
              <div key={idx} className="p-6 text-left space-y-3.5 flex flex-col justify-between first:pl-6 sm:px-6 lg:px-8">
                <div className="space-y-3.5">
                  <div className="p-2.5 border border-primary/20 w-fit rounded-full bg-primary/5">
                    {item.icon}
                  </div>
                  <h3 className="font-serif italic text-base text-foreground leading-snug">{item.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed font-sans font-light">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 6. CUSTOMER REVIEWS */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 border-t border-border/40">
          <div className="text-center max-w-xl mx-auto mb-16 space-y-2">
            <span className="text-[10px] uppercase tracking-widest font-extrabold text-primary font-sans">
              Testimonials
            </span>
            <h2 className="text-2xl sm:text-3xl tracking-wide font-serif italic text-foreground">Maison Guest Book</h2>
            <div className="h-[1px] w-12 bg-primary/45 mx-auto mt-3" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Review 1 */}
            <div className="p-8 border border-border/60 bg-card rounded-sm text-left flex flex-col justify-between h-full luxury-shadow">
              <div className="space-y-4">
                <div className="flex items-center space-x-1">
                  <Rating rating={5} size={11} />
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed italic font-sans font-medium">
                  &quot;The Royal Oud is an absolute masterpiece. The Cambodian Oud note is beautifully smooth and does not overpower the dry-down. I still smell the sandalwood on my wool coats days later.&quot;
                </p>
              </div>
              <div className="flex items-center space-x-3 border-t pt-4 mt-6 border-border/40">
                <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-500 flex-shrink-0" />
                <div>
                  <p className="text-xs font-bold text-foreground font-serif italic">Usman Data</p>
                  <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider font-sans">Verified Scent Collector</p>
                </div>
              </div>
            </div>

            {/* Review 2 */}
            <div className="p-8 border border-border/60 bg-card rounded-sm text-left flex flex-col justify-between h-full luxury-shadow">
              <div className="space-y-4">
                <div className="flex items-center space-x-1">
                  <Rating rating={5} size={11} />
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed italic font-sans font-medium">
                  &quot;Midnight Essence is my go-to date night perfume. Seductive black coffee notes blend gorgeously with sweet almonds and tobacco smoke. Truly room-filling sillage. Excellent presentation.&quot;
                </p>
              </div>
              <div className="flex items-center space-x-3 border-t pt-4 mt-6 border-border/40">
                <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-500 flex-shrink-0" />
                <div>
                  <p className="text-xs font-bold text-foreground font-serif italic">Hamza Meer</p>
                  <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider font-sans">Verified Buyer</p>
                </div>
              </div>
            </div>

            {/* Review 3 */}
            <div className="p-8 border border-border/60 bg-card rounded-sm text-left flex flex-col justify-between h-full luxury-shadow">
              <div className="space-y-4">
                <div className="flex items-center space-x-1">
                  <Rating rating={4.9} size={11} />
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed italic font-sans font-medium">
                  &quot;I purchased Golden Amber as a gift set. The gold-foil luxury packaging and presentation felt like opening an expensive designer box. Resinous benzoin and vanilla orchid note are simply beautiful.&quot;
                </p>
              </div>
              <div className="flex items-center space-x-3 border-t pt-4 mt-6 border-border/40">
                <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-500 flex-shrink-0" />
                <div>
                  <p className="text-xs font-bold text-foreground font-serif italic">Sophia L.</p>
                  <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider font-sans">Verified Buyer</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
