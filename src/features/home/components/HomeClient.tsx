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
    tagline: 'Exclusive Reserve · Est. 2019',
    title: 'The Essence of Excellence',
    description: 'Discover a world of unparalleled luxury and sensory indulgence, curated for the discerning connoisseur.',
    image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1800&auto=format&fit=crop',
    link: '#catalog-section',
    btnText: 'Shop All Fragrances',
  },
  {
    id: 2,
    tagline: 'Maison Special · Limited Edition',
    title: 'Midnight Seduction Scent',
    description: 'A dark, sensual fusion of warm spices, sultry black orchid, and toasted coffee beans.',
    image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=1800&auto=format&fit=crop',
    link: '/product/midnight-essence',
    btnText: 'Discover Midnight',
  },
  {
    id: 3,
    tagline: 'Private Blend · New Launch',
    title: 'Royal Oud Masterpiece',
    description: 'Sourced from the heart of Cambodia, our pure oud oil is layered with Bulgarian rose petals.',
    image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=1800&auto=format&fit=crop',
    link: '/product/royal-oud',
    btnText: 'Experience Oud',
  },
];



export function HomeClient() {
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');
  const { data: productsData, isLoading: isLoadingProducts } = useProducts({
    category: selectedCategory === 'all' ? undefined : selectedCategory,
    limit: 12,
  });
  const productsList = productsData?.products || [];
  const [email, setEmail] = React.useState('');
  const [activeSlide, setActiveSlide] = React.useState(0);

  // Auto-play slides every 6.5 seconds
  React.useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6500);
    return () => clearInterval(timer);
  }, []);

  const currentHero = HERO_SLIDES[activeSlide];

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <Header />

      <main className="flex-1 bg-background pb-16 overflow-hidden">

        {/* ═══════════════════════════════════════════════
            1. CINEMATIC HERO SLIDER
        ═══════════════════════════════════════════════ */}
        <section className="relative w-full h-[55vw] min-h-[360px] max-h-[620px] bg-zinc-950 overflow-hidden group/hero">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
              className="absolute inset-0 w-full h-full"
            >
              {/* Background image with continuous Ken Burns zoom */}
              <motion.div 
                initial={{ scale: 1.08 }}
                animate={{ scale: 1.01 }}
                transition={{ duration: 6.5, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 w-full h-full"
              >
                <OptimizedImage
                  src={currentHero.image}
                  alt={currentHero.title}
                  fill
                  priority
                  loading="eager"
                  className="object-cover opacity-70"
                />
              </motion.div>

              {/* Gradient overlays */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-transparent to-transparent" />

              {/* Hero text content */}
              <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 lg:px-20 text-white">
                <motion.span
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="block font-sans text-[8px] sm:text-[10px] uppercase tracking-[0.35em] text-primary mb-3 font-semibold"
                >
                  {currentHero.tagline}
                </motion.span>

                <motion.h1
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                  className="font-serif text-3xl sm:text-5xl lg:text-6xl font-light tracking-wider text-white leading-[1.1] max-w-lg"
                >
                  {currentHero.title}
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                  className="mt-4 font-sans text-[10px] sm:text-xs text-zinc-300 font-light tracking-wide max-w-xs sm:max-w-sm leading-relaxed hidden sm:block"
                >
                  {currentHero.description}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="mt-6 sm:mt-8 flex items-center gap-4"
                >
                  {currentHero.link.startsWith('#') ? (
                    <button
                      onClick={() => {
                        const el = document.getElementById(currentHero.link.substring(1));
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="btn-shimmer font-sans text-[9px] sm:text-[10px] uppercase tracking-[0.22em] font-bold bg-primary text-primary-foreground px-6 sm:px-8 h-9 sm:h-10 flex items-center gap-2 hover:bg-primary/90 transition-colors cursor-pointer rounded-lg"
                    >
                      {currentHero.btnText} <ArrowRight className="h-3 w-3" />
                    </button>
                  ) : (
                    <Link href={currentHero.link}>
                      <button className="btn-shimmer font-sans text-[9px] sm:text-[10px] uppercase tracking-[0.22em] font-bold bg-primary text-primary-foreground px-6 sm:px-8 h-9 sm:h-10 flex items-center gap-2 hover:bg-primary/90 transition-colors cursor-pointer rounded-lg">
                        {currentHero.btnText} <ArrowRight className="h-3 w-3" />
                      </button>
                    </Link>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Dot Indicators */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2.5 z-20">
            {HERO_SLIDES.map((slide, i) => (
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
            onClick={() => setActiveSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center cursor-pointer transition-all opacity-0 group-hover/hero:opacity-100 hidden sm:flex z-20"
            aria-label="Previous slide"
          >
            ←
          </button>
          <button
            onClick={() => setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center cursor-pointer transition-all opacity-0 group-hover/hero:opacity-100 hidden sm:flex z-20"
            aria-label="Next slide"
          >
            →
          </button>

          {/* Thin gold line at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
        </section>




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
              {[
                { label: 'All', value: 'all' },
                { label: 'Oud & Arabic', value: 'oud-collection' },
                { label: 'Woody & Oriental', value: 'woody-oriental' },
                { label: 'Fresh & Floral', value: 'fresh-floral' },
                { label: 'Pour Homme', value: 'mens-perfumes' },
                { label: 'Pour Femme', value: 'womens-perfumes' },
              ].map((tab) => {
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

        {/* ═══════════════════════════════════════════════
            4. TRUST PILLARS — horizontal on desktop
        ═══════════════════════════════════════════════ */}
        <section className="border-t border-border/20 px-4 sm:px-6 lg:px-8 py-14">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={staggerContainer}
            className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {TRUST_PILLARS.map(({ icon: Icon, title, body }) => (
              <motion.div 
                variants={fadeInUp}
                key={title} 
                className="flex flex-col items-start gap-3"
              >
                <div className="w-9 h-9 flex items-center justify-center border border-primary/20 bg-primary/5 rounded-lg">
                  <Icon className="h-4 w-4 text-primary stroke-[1.25]" />
                </div>
                <div>
                  <h4 className="font-sans text-[9px] uppercase tracking-[0.22em] font-bold text-foreground">{title}</h4>
                  <p className="font-sans text-[10px] text-muted-foreground font-light mt-1.5 leading-relaxed">{body}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ═══════════════════════════════════════════════
            5. NEWSLETTER — dark luxe block
        ═══════════════════════════════════════════════ */}
        <section className="mx-4 sm:mx-6 lg:mx-8 mb-4">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="relative bg-zinc-950 overflow-hidden px-8 sm:px-16 py-16 sm:py-20 text-center rounded-2xl"
          >
            {/* Subtle gold gradient accent */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[40%] h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

            <span className="font-sans text-[8px] uppercase tracking-[0.35em] text-primary block mb-4">Members Only</span>
            <h3 className="font-serif text-2xl sm:text-3xl text-white font-light tracking-widest mb-3">
              Join the Maison
            </h3>
            <p className="font-sans text-[10px] sm:text-xs text-zinc-400 font-light leading-relaxed max-w-sm mx-auto mb-8">
              Subscribe for private announcements on reserve batch openings, luxury sample sets, and bespoke curations.
            </p>
            <form
              onSubmit={(e) => { e.preventDefault(); setEmail(''); }}
              className="flex flex-col sm:flex-row max-w-md mx-auto gap-0"
            >
              <input
                type="email"
                placeholder="Your email address..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-zinc-900 border border-zinc-700 border-r-0 px-4 py-2.5 font-sans text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-primary/60 transition-colors rounded-l-lg"
                required
              />
              <button
                type="submit"
                className="btn-shimmer bg-primary text-primary-foreground font-sans font-bold text-[9px] uppercase tracking-[0.22em] px-7 h-10 hover:bg-primary/90 transition-colors cursor-pointer border border-primary flex-shrink-0 rounded-r-lg"
              >
                Subscribe
              </button>
            </form>
          </motion.div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
