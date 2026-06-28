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
import { motion } from 'framer-motion';
import {
  useFeaturedProducts,
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

export function HomeClient() {
  const { data: featured, isLoading: isLoadingFeatured } = useFeaturedProducts();
  const { data: categories, isLoading: isLoadingCategories } = useCategories();
  const [email, setEmail] = React.useState('');

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <Header />

      <main className="flex-1 bg-background pb-16 overflow-hidden">

        {/* ═══════════════════════════════════════════════
            1. CINEMATIC HERO
        ═══════════════════════════════════════════════ */}
        <section className="relative w-full h-[55vw] min-h-[340px] max-h-[620px] bg-zinc-950 overflow-hidden">
          {/* Background image with continuous zoom */}
          <motion.div 
            initial={{ scale: 1.08, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.7 }}
            transition={{ duration: 5.5, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 w-full h-full"
          >
            <OptimizedImage
              src="https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1800&auto=format&fit=crop"
              alt="Maison de Luxe Masterpieces"
              fill
              priority
              loading="eager"
              className="object-cover"
            />
          </motion.div>

          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />

          {/* Hero text — staggered animation */}
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 lg:px-20 text-white"
          >
            <motion.span
              variants={fadeInUp}
              className="block font-sans text-[8px] sm:text-[10px] uppercase tracking-[0.35em] text-primary mb-3"
            >
              Exclusive Reserve · Est. 2019
            </motion.span>

            <motion.h1
              variants={fadeInUp}
              className="font-serif text-3xl sm:text-5xl lg:text-6xl font-light tracking-wider text-white leading-[1.1] max-w-lg"
            >
              The Essence<br />of Excellence
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="mt-4 font-sans text-[10px] sm:text-xs text-zinc-300 font-light tracking-wide max-w-xs sm:max-w-sm leading-relaxed hidden sm:block"
            >
              Discover a world of unparalleled luxury and sensory indulgence, curated for the discerning connoisseur.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="mt-6 sm:mt-8 flex items-center gap-4"
            >
              <Link href="/categories">
                <button className="btn-shimmer font-sans text-[9px] sm:text-[10px] uppercase tracking-[0.22em] font-bold bg-primary text-primary-foreground px-6 sm:px-8 h-9 sm:h-10 flex items-center gap-2 hover:bg-primary/90 transition-colors cursor-pointer rounded-lg">
                  Explore Collections <ArrowRight className="h-3 w-3" />
                </button>
              </Link>
              <Link href="/categories" className="font-sans text-[9px] uppercase tracking-[0.18em] text-zinc-300 hover:text-white transition-colors border-b border-zinc-400/40 pb-0.5 hover:border-white/60">
                View All
              </Link>
            </motion.div>
          </motion.div>

          {/* Thin gold line at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
        </section>

        {/* ═══════════════════════════════════════════════
            2. COLLECTIONS GRID
        ═══════════════════════════════════════════════ */}
        <section className="px-4 sm:px-6 lg:px-8 py-14 border-b border-border/20">
          <div className="max-w-7xl mx-auto">
            {/* Section header */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6 }}
              className="flex items-end justify-between mb-8"
            >
              <div className="space-y-1">
                <span className="font-sans text-[8px] uppercase tracking-[0.3em] text-primary font-semibold">Maison Catalog</span>
                <h2 className="font-serif text-2xl sm:text-3xl font-light tracking-wide text-foreground">
                  Explore Collections
                </h2>
              </div>
              <Link href="/categories" className="font-sans text-[9px] uppercase tracking-[0.2em] font-bold text-primary hover:opacity-70 transition-opacity flex items-center gap-1">
                All <ArrowRight className="h-3 w-3" />
              </Link>
            </motion.div>

            {/* Desktop: editorial asymmetric grid | Mobile: horizontal scroll */}
            {isLoadingCategories || !categories || categories.length === 0 ? (
              <>
                {/* Mobile scroll skeletons */}
                <div className="flex gap-3 overflow-x-auto pb-3 snap-x snap-mandatory no-scrollbar lg:hidden">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <div
                      key={n}
                      className="snap-start flex-shrink-0 w-[150px] sm:w-[200px] aspect-[3/4] bg-secondary/60 animate-pulse rounded-xl"
                    />
                  ))}
                </div>

                {/* Desktop asymmetric grid skeletons */}
                <div className="hidden lg:grid grid-cols-4 grid-rows-2 gap-3 h-[500px]">
                  <div className="col-span-2 row-span-2 bg-secondary/60 animate-pulse rounded-2xl" />
                  <div className="col-span-1 row-span-1 bg-secondary/60 animate-pulse rounded-xl" />
                  <div className="col-span-1 row-span-1 bg-secondary/60 animate-pulse rounded-xl" />
                  <div className="col-span-1 row-span-1 bg-secondary/60 animate-pulse rounded-xl" />
                  <div className="col-span-1 row-span-1 bg-secondary/60 animate-pulse rounded-xl" />
                </div>
              </>
            ) : (
              <>
                {/* Mobile horizontal scroll */}
                <div className="flex gap-3 overflow-x-auto pb-3 snap-x snap-mandatory scroll-smooth no-scrollbar lg:hidden">
                  {categories.map((cat, idx) => (
                    <motion.div
                      key={cat.id}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.08, duration: 0.9 }}
                      className="snap-start flex-shrink-0 w-[150px] sm:w-[200px]"
                    >
                      <Link
                        href={`/category/${cat.slug}`}
                        className="relative block aspect-[3/4] bg-secondary overflow-hidden group rounded-xl"
                      >
                        <OptimizedImage
                          src={cat.image}
                          alt={cat.name}
                          fill
                          priority={idx === 0}
                          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <h3 className="font-serif text-sm text-white font-light tracking-widest leading-snug">
                            {cat.name}
                          </h3>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Desktop: editorial grid — first tile tall, rest equal */}
                <motion.div 
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-80px' }}
                  variants={staggerContainer}
                  className="hidden lg:grid grid-cols-4 grid-rows-2 gap-3 h-[500px]"
                >
                  {/* Large featured tile */}
                  {categories[0] && (
                    <motion.div variants={fadeInUp} className="col-span-2 row-span-2">
                      <Link
                        href={`/category/${categories[0].slug}`}
                        className="relative block w-full h-full bg-secondary overflow-hidden group rounded-2xl border border-border/20 shadow-xs"
                      >
                        <OptimizedImage
                          src={categories[0].image}
                          alt={categories[0].name}
                          fill
                          priority
                          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                          <span className="font-sans text-[8px] uppercase tracking-[0.25em] text-primary/80 block mb-1.5">Featured Collection</span>
                          <h3 className="font-serif text-2xl text-white font-light tracking-widest">
                            {categories[0].name}
                          </h3>
                        </div>
                        <div className="absolute inset-0 border border-primary/0 group-hover:border-primary/30 transition-colors duration-500 pointer-events-none" />
                      </Link>
                    </motion.div>
                  )}

                  {/* 4 small tiles */}
                  {categories.slice(1, 5).map((cat) => (
                    <motion.div key={cat.id} variants={fadeInUp} className="col-span-1 row-span-1">
                      <Link
                        href={`/category/${cat.slug}`}
                        className="relative block w-full h-full bg-secondary overflow-hidden group rounded-xl border border-border/20 shadow-xs"
                      >
                        <OptimizedImage
                          src={cat.image}
                          alt={cat.name}
                          fill
                          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-3">
                          <h3 className="font-serif text-sm text-white font-light tracking-wide">
                            {cat.name}
                          </h3>
                        </div>
                        <div className="absolute inset-0 border border-primary/0 group-hover:border-primary/25 transition-colors duration-500 pointer-events-none" />
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              </>
            )}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
            3. FEATURED PRODUCTS — stagger-animated cards
        ═══════════════════════════════════════════════ */}
        <section className="px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-7xl mx-auto">
            {/* Section header */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6 }}
              className="mb-10 flex items-end justify-between"
            >
              <div className="space-y-1">
                <span className="font-sans text-[8px] uppercase tracking-[0.3em] text-primary font-semibold">Signature Selection</span>
                <h2 className="font-serif text-2xl sm:text-3xl font-light tracking-wide text-foreground">
                  Curated Masterpieces
                </h2>
              </div>
              <Link href="/categories" className="font-sans text-[9px] uppercase tracking-[0.2em] font-bold text-primary hover:opacity-70 transition-opacity flex items-center gap-1">
                Shop All <ArrowRight className="h-3 w-3" />
              </Link>
            </motion.div>

            {isLoadingFeatured ? (
              <Loader />
            ) : (
              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-100px' }}
                variants={staggerContainer}
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10"
              >
                {featured?.map((product, idx) => (
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
