'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowRight, Gift, Truck, ShieldCheck, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { Header } from '@/features/shared/components/Header';
import { Footer } from '@/features/shared/components/Footer';
import { Loader } from '@/components/common/Loader';
import { ProductCard } from '@/features/catalog/components/ProductCard';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';
import {
  useFeaturedProducts,
  useProducts,
  useBanners,
  useCategories,
} from '@/features/shared/hooks/queries';

const TRUST_PILLARS = [
  {
    icon: Gift,
    title: 'Complimentary Packaging',
    body: 'Every order arrives in our signature ivory cotton box wrapped in premium grosgrain ribbon.',
  },
  {
    icon: Truck,
    title: 'Priority Express Courier',
    body: 'Free express delivery worldwide on all premium fragrance selections above $150.',
  },
  {
    icon: ShieldCheck,
    title: 'Authenticity Certificates',
    body: 'Formulations verified by the Maison Reserve registry with personalized batch signature tags.',
  },
  {
    icon: Headphones,
    title: 'Bespoke Guest Relations',
    body: 'Direct chat assistance with our lead curators to discover scent recommendations.',
  },
];

// Premium editorial animation variants
const fadeInUp = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { ease: [0.16, 1, 0.3, 1], duration: 1.25 }
  }
} as const;

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1
    }
  }
} as const;

const HERO_SLIDES = [
  {
    id: 1,
    tagline: 'Timeless by Meer · Private Collection',
    title: 'The Essence of Excellence',
    description: 'Discover a world of unparalleled luxury and sensory indulgence, curated for the discerning connoisseur.',
    image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1800&auto=format&fit=crop',
    link: '#catalog-section',
    btnText: 'Shop All Fragrances',
  }
];



export function HomeClient() {
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');
  const { data: productsData, isLoading: isLoadingProducts } = useProducts({
    category: selectedCategory === 'all' ? undefined : selectedCategory,
    limit: 12,
  });
  const productsList = productsData?.products || [];
  const { data: dynamicBannersData } = useBanners();
  const { data: categoriesData } = useCategories();
  const [email, setEmail] = React.useState('');
  const [activeSlide, setActiveSlide] = React.useState(0);

  const categoryTabs = React.useMemo(() => {
    if (categoriesData && categoriesData.length > 0) {
      return [
        { label: 'All', value: 'all' },
        ...categoriesData.map((cat: any) => ({
          label: cat.name,
          value: cat.slug,
        })),
      ];
    }
    return [
      { label: 'All', value: 'all' },
    ];
  }, [categoriesData]);

  const heroSlides = React.useMemo(() => {
    const activeBanners = (dynamicBannersData || []).filter((b: any) => b.is_active);
    if (activeBanners.length > 0) {
      return activeBanners.map((b: any) => {
        const desk = b.desktop_image_url;
        const tab = b.tablet_image_url || desk;
        const mob = b.mobile_image_url || tab || desk;
        return {
          id: b.id,
          tagline: b.subtitle || (b.title ? 'Private Collection' : ''),
          title: b.title || '',
          description: b.title ? 'Experience the exquisite aroma of our selected collections.' : '',
          desktopImageUrl: desk,
          tabletImageUrl: tab,
          mobileImageUrl: mob,
          altText: b.alt_text || b.title || 'Maison Fragrance Campaign Banner',
          link: '#catalog-section',
          btnText: b.title ? 'Shop Collection' : '',
        };
      });
    }
    return HERO_SLIDES.map((s) => ({
      id: s.id,
      tagline: s.tagline,
      title: s.title,
      description: s.description,
      desktopImageUrl: s.image,
      tabletImageUrl: s.image,
      mobileImageUrl: s.image,
      altText: s.title || 'Maison Fragrance Campaign Banner',
      link: s.link,
      btnText: s.btnText,
    }));
  }, [dynamicBannersData]);

  // Auto-play slides every 6.5 seconds
  React.useEffect(() => {
    if (heroSlides.length === 0) return;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const currentHero = heroSlides.length > 0 ? (heroSlides[activeSlide] || heroSlides[0]) : null;

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <Header />

      <main className="flex-1 bg-background pb-16 overflow-hidden">

        {/* ═══════════════════════════════════════════════
            1. CINEMATIC HERO SLIDER
        ═══════════════════════════════════════════════ */}
        {heroSlides.length > 0 && currentHero && (
          <section className="relative w-full h-[125vw] min-h-[300px] sm:h-[50vw] sm:min-h-[400px] lg:h-[30vw] lg:max-h-[550px] bg-zinc-950 overflow-hidden group/hero">
            
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlide}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
                className="absolute inset-0 w-full h-full"
              >
                {/* Clean Image / Clickable banner vs Cinematic text overlay */}
                {!currentHero.title ? (
                  currentHero.link.startsWith('#') ? (
                    <button
                      onClick={() => {
                        const el = document.getElementById(currentHero.link.substring(1));
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="absolute inset-0 w-full h-full block text-left cursor-pointer z-10"
                    >
                      <motion.div 
                        initial={{ scale: 1.08 }}
                        animate={{ scale: 1.01 }}
                        transition={{ duration: 6.5, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute inset-0 w-full h-full"
                      >
                        <picture className="absolute inset-0 w-full h-full">
                          <source media="(max-width: 640px)" srcSet={currentHero.mobileImageUrl} />
                          <source media="(max-width: 1024px)" srcSet={currentHero.tabletImageUrl} />
                          <img
                            src={currentHero.desktopImageUrl}
                            alt={currentHero.altText}
                            loading={activeSlide === 0 ? "eager" : "lazy"}
                            className="w-full h-full object-cover opacity-100"
                          />
                        </picture>
                      </motion.div>
                    </button>
                  ) : (
                    <Link href={currentHero.link} className="absolute inset-0 w-full h-full block cursor-pointer z-10">
                      <motion.div 
                        initial={{ scale: 1.08 }}
                        animate={{ scale: 1.01 }}
                        transition={{ duration: 6.5, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute inset-0 w-full h-full"
                      >
                        <picture className="absolute inset-0 w-full h-full">
                          <source media="(max-width: 640px)" srcSet={currentHero.mobileImageUrl} />
                          <source media="(max-width: 1024px)" srcSet={currentHero.tabletImageUrl} />
                          <img
                            src={currentHero.desktopImageUrl}
                            alt={currentHero.altText}
                            loading={activeSlide === 0 ? "eager" : "lazy"}
                            className="w-full h-full object-cover opacity-100"
                          />
                        </picture>
                      </motion.div>
                    </Link>
                  )
                ) : (
                  <>
                    {/* Background image with continuous Ken Burns zoom */}
                    <motion.div 
                      initial={{ scale: 1.08 }}
                      animate={{ scale: 1.01 }}
                      transition={{ duration: 6.5, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute inset-0 w-full h-full"
                    >
                      <picture className="absolute inset-0 w-full h-full">
                        <source media="(max-width: 640px)" srcSet={currentHero.mobileImageUrl} />
                        <source media="(max-width: 1024px)" srcSet={currentHero.tabletImageUrl} />
                        <img
                          src={currentHero.desktopImageUrl}
                          alt={currentHero.altText}
                          loading={activeSlide === 0 ? "eager" : "lazy"}
                          className="w-full h-full object-cover opacity-70"
                        />
                      </picture>
                    </motion.div>

                    {/* Gradient overlays */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-transparent to-transparent" />

                    {/* Hero text content */}
                    <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 lg:px-20 text-white z-10">
                      {currentHero.tagline && (
                        <motion.span
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                          className="block font-sans text-[7px] sm:text-[10px] uppercase tracking-[0.35em] text-primary mb-1.5 sm:mb-3 font-semibold"
                        >
                          {currentHero.tagline}
                        </motion.span>
                      )}

                      <motion.h1
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                        className="font-serif text-2xl sm:text-5xl lg:text-6xl font-light tracking-wider text-white leading-[1.1] max-w-lg"
                      >
                        {currentHero.title}
                      </motion.h1>

                      {currentHero.description && (
                        <motion.p
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.35, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                          className="mt-4 font-sans text-[10px] sm:text-xs text-zinc-300 font-light tracking-wide max-w-xs sm:max-w-sm leading-relaxed hidden sm:block"
                        >
                          {currentHero.description}
                        </motion.p>
                      )}

                      {currentHero.btnText && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.45, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                          className="mt-4 sm:mt-8 flex items-center gap-4"
                        >
                          {currentHero.link.startsWith('#') ? (
                            <button
                              onClick={() => {
                                const el = document.getElementById(currentHero.link.substring(1));
                                if (el) el.scrollIntoView({ behavior: 'smooth' });
                              }}
                              className="btn-shimmer font-sans text-[8px] sm:text-[10px] uppercase tracking-[0.22em] font-bold bg-primary text-primary-foreground px-4 sm:px-8 h-8 sm:h-10 flex items-center gap-2 hover:bg-primary/90 transition-colors cursor-pointer rounded-lg"
                            >
                              {currentHero.btnText} <ArrowRight className="h-3 w-3" />
                            </button>
                          ) : (
                            <Link href={currentHero.link}>
                              <button className="btn-shimmer font-sans text-[8px] sm:text-[10px] uppercase tracking-[0.22em] font-bold bg-primary text-primary-foreground px-4 sm:px-8 h-8 sm:h-10 flex items-center gap-2 hover:bg-primary/90 transition-colors cursor-pointer rounded-lg">
                                {currentHero.btnText} <ArrowRight className="h-3 w-3" />
                              </button>
                            </Link>
                          )}
                        </motion.div>
                      )}
                    </div>
                  </>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation Dot Indicators */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2.5 z-20">
              {heroSlides.map((slide, i) => (
                <button
                  key={slide.id}
                  onClick={() => setActiveSlide(i)}
                  className={cn(
                    'h-1.5 rounded-full transition-all duration-300 cursor-pointer',
                    activeSlide === i ? 'w-6 bg-primary' : 'w-1.5 bg-white/40 hover:bg-white/60'
                  )}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>

            {/* Left/Right controls (Shown on hover) */}
            <button
              onClick={() => setActiveSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center cursor-pointer transition-all opacity-0 group-hover/hero:opacity-100 hidden sm:flex z-20"
              aria-label="Previous slide"
            >
              ←
            </button>
            <button
              onClick={() => setActiveSlide((prev) => (prev + 1) % heroSlides.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center cursor-pointer transition-all opacity-0 group-hover/hero:opacity-100 hidden sm:flex z-20"
              aria-label="Next slide"
            >
              →
            </button>

            {/* Thin gold line at bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
          </section>
        )}




        {/* ═══════════════════════════════════════════════
            3. FEATURED PRODUCTS — stagger-animated cards
        ═══════════════════════════════════════════════ */}
        <section id="catalog-section" className="px-4 sm:px-6 lg:px-8 pt-6 pb-16">
          <div className="max-w-7xl mx-auto">
            {/* Section header */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6 }}
              className="mb-8 flex items-end justify-between"
            >
              <div className="space-y-1">
                <span className="font-sans text-[8px] uppercase tracking-[0.3em] text-primary font-semibold">Maison Catalog</span>
                <h2 className="font-serif text-2xl sm:text-3xl font-light tracking-wide text-foreground">
                  Our Fragrances
                </h2>
              </div>
            </motion.div>

            {/* Interactive Category Filter Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar scroll-smooth">
              {categoryTabs.map((tab) => {
                const isActive = selectedCategory === tab.value;
                return (
                  <button
                    key={tab.value}
                    onClick={() => setSelectedCategory(tab.value)}
                    className={cn(
                      'px-5 py-2.5 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all cursor-pointer flex-shrink-0 border',
                      isActive
                        ? 'bg-zinc-950 text-white border-zinc-950 shadow-xs'
                        : 'bg-secondary/40 text-muted-foreground border-border/20 hover:bg-secondary/80 hover:text-foreground'
                    )}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {isLoadingProducts ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className="space-y-4">
                    <div className="aspect-[3/4] w-full rounded-2xl bg-secondary/60 animate-pulse" />
                    <div className="h-3 w-1/3 bg-secondary/60 animate-pulse rounded-md" />
                    <div className="h-4 w-2/3 bg-secondary/60 animate-pulse rounded-md" />
                  </div>
                ))}
              </div>
            ) : productsList.length === 0 ? (
              <div className="text-center py-12 text-sm text-muted-foreground">
                No perfumes found in this collection.
              </div>
            ) : (
              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-100px' }}
                variants={staggerContainer}
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10"
              >
                {productsList.map((product, idx) => (
                  <ProductCard key={product.id} product={product} index={idx} />
                ))}
              </motion.div>
            )}
          </div>
        </section>



      </main>

      <Footer />
    </div>
  );
}
