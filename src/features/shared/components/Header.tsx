'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Menu, Search, Heart, ShoppingBag, X, ChevronDown, Compass, Award, Percent, Sparkles, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import { ThemeToggle } from './ThemeToggle';
import { SearchPalette } from './SearchPalette';
import { CartDrawer } from '@/features/cart/components/CartDrawer';
import { FragranceQuizModal } from './FragranceQuizModal';
import { useCartStore } from '@/store/cart';
import { useWishlistStore } from '@/store/wishlist';
import { useAuthStore } from '@/store/auth';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'sonner';

const ANNOUNCEMENTS = [
  'Free complimentary luxury packaging on all orders',
  'Get 10% off with code PREMIUM10 at checkout',
  'Discover the new Royal Oud Collection - now available',
];

export function Header() {
  const router = useRouter();
  const [announcementIndex, setAnnouncementIndex] = React.useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [isCartOpen, setIsCartOpen] = React.useState(false);
  const [isQuizOpen, setIsQuizOpen] = React.useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = React.useState<string | null>(null);

  const cartItemsCount = useCartStore((state) => state.items.reduce((acc, item) => acc + item.quantity, 0));
  const wishlistItemsCount = useWishlistStore((state) => state.items.length);
  const { isAuthenticated, user } = useAuthStore();

  // Retrigger cart bounce animation every time count increases
  const [cartBounceKey, setCartBounceKey] = React.useState(0);
  const prevCartCount = React.useRef(cartItemsCount);
  React.useEffect(() => {
    if (cartItemsCount > prevCartCount.current) {
      setCartBounceKey((k) => k + 1);
    }
    prevCartCount.current = cartItemsCount;
  }, [cartItemsCount]);

  // Listen to custom window events triggered by MobileBottomNav
  React.useEffect(() => {
    const handleToggleCart = () => setIsCartOpen((prev) => !prev);
    const handleToggleSearch = () => setIsSearchOpen((prev) => !prev);
    const handleToggleMenu = () => setIsMobileMenuOpen((prev) => !prev);
    const handleToggleQuiz = () => setIsQuizOpen((prev) => !prev);

    window.addEventListener('toggle-cart-drawer', handleToggleCart);
    window.addEventListener('toggle-search-palette', handleToggleSearch);
    window.addEventListener('toggle-mobile-menu', handleToggleMenu);
    window.addEventListener('toggle-fragrance-quiz', handleToggleQuiz);

    return () => {
      window.removeEventListener('toggle-cart-drawer', handleToggleCart);
      window.removeEventListener('toggle-search-palette', handleToggleSearch);
      window.removeEventListener('toggle-mobile-menu', handleToggleMenu);
      window.removeEventListener('toggle-fragrance-quiz', handleToggleQuiz);
    };
  }, []);

  // Rotate announcement bar messages
  React.useEffect(() => {
    const timer = setInterval(() => {
      setAnnouncementIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <header className="w-full sticky top-0 z-40">
        {/* 1. Announcement Bar */}
        <div className="w-full h-8 bg-primary text-primary-foreground text-xs font-semibold flex items-center justify-center overflow-hidden px-4">
          <AnimatePresence mode="wait">
            <motion.p
              key={announcementIndex}
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -15, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-center cursor-pointer hover:underline"
              onClick={() => {
                if (announcementIndex === 1) {
                  navigator.clipboard.writeText('PREMIUM10');
                }
              }}
            >
              {ANNOUNCEMENTS[announcementIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* 2. Main Sticky Navigation Header */}
        <div className="w-full bg-background/95 backdrop-blur-md border-b transition-all duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            {/* Left: Hamburg menu (mobile) & Brand Logo */}
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden h-9 w-9 cursor-pointer"
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label="Open mobile menu"
              >
                <Menu className="h-5 w-5" />
              </Button>

              <Link href="/" className="flex items-center space-x-2.5">
                <div className="h-8 w-8 rounded-full border border-border/40 bg-zinc-950 flex items-center justify-center overflow-hidden">
                  <Image
                    src="/logo.png"
                    alt="Meer Hamza Logo"
                    width={22}
                    height={22}
                    className="object-contain"
                  />
                </div>
                <span className="font-extrabold text-xl tracking-widest bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent font-serif italic">
                  MEER HAMZA
                </span>
              </Link>
            </div>

            {/* Center: Desktop Navigation Mega Menu triggers */}
            <nav className="hidden md:flex items-center space-x-1 h-full z-40">
              <div
                className="relative h-full flex items-center"
                onMouseEnter={() => setActiveMegaMenu('shop')}
                onMouseLeave={() => setActiveMegaMenu(null)}
              >
                <button className="flex items-center space-x-1 px-3 py-2 text-sm font-semibold hover:text-primary transition-colors h-full cursor-pointer">
                  <span>Shop Catalog</span>
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${activeMegaMenu === 'shop' ? 'rotate-180' : ''}`} />
                </button>

                {/* Shop Mega Menu */}
                <AnimatePresence>
                  {activeMegaMenu === 'shop' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-[64px] left-1/2 -translate-x-[200px] w-[650px] bg-background border rounded-lg shadow-xl p-6 grid grid-cols-3 gap-6"
                    >
                      {/* Col 1: Categories */}
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2 font-bold text-sm tracking-wide text-foreground border-b pb-2 mb-2">
                          <Compass className="h-4 w-4 text-muted-foreground" />
                          <span>Categories</span>
                        </div>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li>
                            <Link href="/category/oud-collection" className="hover:text-primary hover:font-medium transition-colors block">Oud & Arabic</Link>
                          </li>
                          <li>
                            <Link href="/category/woody-oriental" className="hover:text-primary hover:font-medium transition-colors block">Woody & Oriental</Link>
                          </li>
                          <li>
                            <Link href="/category/fresh-floral" className="hover:text-primary hover:font-medium transition-colors block">Fresh & Floral</Link>
                          </li>
                          <li>
                            <Link href="/category/mens-perfumes" className="hover:text-primary hover:font-medium transition-colors block">Pour Homme (Men)</Link>
                          </li>
                          <li>
                            <Link href="/category/womens-perfumes" className="hover:text-primary hover:font-medium transition-colors block">Pour Femme (Women)</Link>
                          </li>
                          <li>
                            <Link href="/categories" className="hover:text-primary hover:font-medium transition-colors block text-primary font-semibold">View All Collections →</Link>
                          </li>
                        </ul>
                      </div>

                      {/* Col 2: Brand collections */}
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2 font-bold text-sm tracking-wide text-foreground border-b pb-2 mb-2">
                          <Award className="h-4 w-4 text-muted-foreground" />
                          <span>Featured Fragrances</span>
                        </div>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li>
                            <Link href="/product/royal-oud" className="hover:text-primary hover:font-medium transition-colors block">Royal Oud</Link>
                          </li>
                          <li>
                            <Link href="/product/midnight-essence" className="hover:text-primary hover:font-medium transition-colors block">Midnight Essence</Link>
                          </li>
                          <li>
                            <Link href="/product/velvet-noir" className="hover:text-primary hover:font-medium transition-colors block">Velvet Noir</Link>
                          </li>
                          <li>
                            <Link href="/product/golden-amber" className="hover:text-primary hover:font-medium transition-colors block">Golden Amber</Link>
                          </li>
                          <li>
                            <Link href="/product/eternal-gold" className="hover:text-primary hover:font-medium transition-colors block">Eternal Gold</Link>
                          </li>
                        </ul>
                      </div>

                      {/* Col 3: Fragrance Finder */}
                      <div className="space-y-3 border-l pl-6 border-border/60">
                        <div className="flex items-center space-x-2 font-bold text-sm tracking-wide text-foreground border-b pb-2 mb-2">
                          <Sparkles className="h-4 w-4 text-primary" />
                          <span>Fragrance Finder</span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed font-sans font-light">
                          Unsure which perfume matches your style or occasion? Let our interactive finder guide you to your custom match.
                        </p>
                        <Button
                          size="sm"
                          onClick={() => {
                            setActiveMegaMenu(null);
                            setIsQuizOpen(true);
                          }}
                          className="w-full text-[10px] uppercase tracking-widest font-extrabold rounded-sm mt-1 bg-primary text-primary-foreground hover:bg-primary/95"
                        >
                          Find Scent Match
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link href="/category/all?filter=new" className="px-3 py-2 text-sm font-semibold hover:text-primary transition-colors">
                New Arrivals
              </Link>
              <button
                onClick={() => setIsQuizOpen(true)}
                className="px-3 py-2 text-sm font-bold text-primary hover:text-primary/80 transition-colors cursor-pointer flex items-center gap-1"
              >
                <Sparkles className="h-3.5 w-3.5 fill-primary/10" /> Fragrance Finder
              </button>
            </nav>

            {/* Right: Actions Menu */}
            <div className="flex items-center space-x-1 sm:space-x-2">
              {/* Cmd+K Search trigger */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="hidden lg:flex items-center text-left space-x-2 px-3 py-1.5 rounded-full border bg-secondary/30 text-muted-foreground hover:text-foreground text-xs hover:border-muted-foreground/40 transition-colors w-[180px] cursor-pointer"
              >
                <Search className="h-3.5 w-3.5" />
                <span className="flex-1">Search catalog...</span>
                <kbd className="inline-flex h-4 items-center select-none rounded border bg-muted px-1.5 font-mono text-[9px] font-medium text-muted-foreground">
                  ⌘K
                </kbd>
              </button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchOpen(true)}
                className="lg:hidden h-9 w-9 rounded-full cursor-pointer hover:bg-secondary"
                aria-label="Search"
              >
                <Search className="h-4 w-4" />
              </Button>

              {/* Theme Toggle removed for light theme force */}

              {/* Wishlist count link (Hidden on Mobile, moved to drawer) */}
              <Link href="/profile?tab=wishlist" className="hidden sm:inline-flex" aria-label="Wishlist">
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full relative cursor-pointer hover:bg-secondary">
                  <Heart className="h-4 w-4" />
                  {wishlistItemsCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[8px] font-bold text-primary-foreground flex items-center justify-center animate-bounce">
                      {wishlistItemsCount}
                    </span>
                  )}
                </Button>
              </Link>

              {/* Cart Drawer Toggle (Always visible) */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsCartOpen(true)}
                className="h-9 w-9 rounded-full relative cursor-pointer hover:bg-secondary"
                aria-label="Cart"
              >
                <span key={cartBounceKey} className={cartBounceKey > 0 ? 'cart-bounce' : ''}>
                  <ShoppingBag className="h-4 w-4" />
                </span>
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-rose-500 text-[8px] font-bold text-white flex items-center justify-center transition-all duration-300">
                    {cartItemsCount}
                  </span>
                )}
              </Button>

              {/* User Account avatar or login (Hidden on Mobile, moved to drawer) */}
              <div className="hidden sm:inline-flex">
                <Link href="/profile">
                  {isAuthenticated && user ? (
                    <div className="h-8 w-8 rounded-full overflow-hidden border cursor-pointer hover:opacity-90 transition-opacity relative">
                      <OptimizedImage
                        src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100'}
                        alt={user.firstName}
                        fill
                      />
                    </div>
                  ) : (
                    <Button variant="outline" size="sm" className="rounded-full text-xs font-semibold cursor-pointer">
                      Sign In
                    </Button>
                  )}
                </Link>
              </div>
            </div>
          </div>

          {/* Mobile Search Bar Row */}
          <div className="md:hidden w-full px-4 pb-3 pt-1 bg-background">
            <div
              onClick={() => setIsSearchOpen(true)}
              className="w-full h-10 flex items-center space-x-2 px-4 bg-secondary/80 hover:bg-secondary/95 border border-border/40 rounded-full cursor-pointer transition-colors shadow-xs"
            >
              <Search className="h-4 w-4 text-muted-foreground stroke-[1.5]" />
              <span className="text-xs text-muted-foreground font-light tracking-wide">Search perfumes...</span>
            </div>
          </div>
        </div>
      </header>

      {/* Cart Drawer Sheet */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Global Command Palette search */}
      <SearchPalette isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Mobile Drawer Navigation — animated dark luxury side nav */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex overflow-hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Drawer panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="relative flex flex-col h-full w-[82vw] max-w-[340px] bg-zinc-950 shadow-2xl z-10 overflow-hidden"
            >
              {/* Gold accent left bar */}
              <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-primary/80 via-primary/40 to-transparent" />

              {/* Header */}
              <div className="flex items-center justify-between px-7 pt-10 pb-6">
                <div className="flex items-center gap-3">
                  <div className="h-7 w-7 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center overflow-hidden">
                    <Image src="/logo.png" alt="Logo" width={18} height={18} className="object-contain" />
                  </div>
                  <span className="font-serif italic text-sm font-light tracking-[0.22em] text-white/90">MEER HAMZA</span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-7 h-7 flex items-center justify-center rounded-full bg-white/8 hover:bg-white/14 text-white/60 hover:text-white transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Nav items with stagger */}
              <div className="flex-1 overflow-y-auto no-scrollbar px-5">
                {/* Primary nav */}
                {[
                  { label: 'Home', href: '/', icon: Home },
                  { label: 'New Arrivals', href: '/category/all?filter=new', icon: Sparkles },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: -18 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 + i * 0.06, type: 'spring', stiffness: 300, damping: 28 }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-3.5 py-3.5 border-b border-white/6 text-white/75 hover:text-white hover:border-primary/30 group transition-colors"
                      >
                        <Icon className="h-4 w-4 text-primary/70 group-hover:text-primary transition-colors flex-shrink-0" />
                        <span className="font-sans font-semibold text-sm tracking-wide">{item.label}</span>
                      </Link>
                    </motion.div>
                  );
                })}

                {/* Collections section */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mt-6 mb-2"
                >
                  <span className="font-sans text-[8px] uppercase tracking-[0.3em] text-zinc-500 font-bold px-0">Collections</span>
                </motion.div>

                {[
                  { label: 'Oud & Arabic', href: '/category/oud-collection', delay: 0.22 },
                  { label: 'Woody & Oriental', href: '/category/woody-oriental', delay: 0.27 },
                  { label: 'Fresh & Floral', href: '/category/fresh-floral', delay: 0.32 },
                  { label: 'Pour Homme', href: '/category/mens-perfumes', delay: 0.37 },
                  { label: 'Pour Femme', href: '/category/womens-perfumes', delay: 0.42 },
                  { label: 'View All →', href: '/categories', delay: 0.47, gold: true },
                ].map((item) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -14 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: item.delay, type: 'spring', stiffness: 280, damping: 28 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center py-2.5 pl-3 border-b border-white/5 text-sm transition-all hover:pl-5 group ${
                        item.gold ? 'text-primary font-bold' : 'text-white/55 hover:text-white/90 font-medium'
                      }`}
                    >
                      {!item.gold && (
                        <span className="w-1 h-1 rounded-full bg-primary/40 group-hover:bg-primary mr-3 flex-shrink-0 transition-colors" />
                      )}
                      {item.label}
                    </Link>
                  </motion.div>
                ))}

                {/* Actions */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-6 space-y-1"
                >
                  <Link
                    href="/profile?tab=wishlist"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between py-3.5 border-b border-white/6 text-white/75 hover:text-white group transition-colors"
                  >
                    <div className="flex items-center gap-3.5">
                      <Heart className="h-4 w-4 text-rose-400/70 group-hover:text-rose-400 transition-colors" />
                      <span className="font-sans font-semibold text-sm tracking-wide">Wishlist</span>
                    </div>
                    {wishlistItemsCount > 0 && (
                      <span className="h-5 min-w-5 rounded-full bg-rose-500 text-[9px] font-black text-white flex items-center justify-center px-1">
                        {wishlistItemsCount}
                      </span>
                    )}
                  </Link>

                  <button
                    onClick={() => { setIsMobileMenuOpen(false); setIsQuizOpen(true); }}
                    className="w-full flex items-center gap-3.5 py-3.5 text-white/75 hover:text-primary group transition-colors"
                  >
                    <Sparkles className="h-4 w-4 text-primary/70 group-hover:text-primary transition-colors" />
                    <span className="font-sans font-semibold text-sm tracking-wide">Fragrance Finder</span>
                  </button>
                </motion.div>
              </div>

              {/* Bottom: user card */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 }}
                className="border-t border-white/8 mx-5 pt-5 pb-8"
              >
                {isAuthenticated && user ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full overflow-hidden border border-white/15 relative flex-shrink-0">
                        <OptimizedImage src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100'} alt={user.firstName} fill />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-white truncate">{user.firstName} {user.lastName}</p>
                        <p className="text-[10px] text-zinc-500 truncate">{user.email}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => { setIsMobileMenuOpen(false); router.push('/profile'); }}
                        className="text-[10px] font-bold uppercase tracking-widest text-white/80 h-8 border border-white/12 hover:border-white/25 hover:text-white rounded-lg transition-colors"
                      >Account</button>
                      <button
                        onClick={() => { setIsMobileMenuOpen(false); useAuthStore.getState().logout(); toast.success('Signed out'); router.push('/'); }}
                        className="text-[10px] font-bold uppercase tracking-widest text-rose-400/80 h-8 border border-rose-400/15 hover:border-rose-400/35 rounded-lg transition-colors"
                      >Sign Out</button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    <p className="text-[10px] text-zinc-500 leading-relaxed">Sign in to sync your wishlist and track orders.</p>
                    <button
                      onClick={() => { setIsMobileMenuOpen(false); router.push('/profile'); }}
                      className="w-full h-9 bg-primary text-primary-foreground font-sans font-bold text-[9px] uppercase tracking-widest rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      Sign In
                    </button>
                  </div>
                )}
              </motion.div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Fragrance Finder Quiz Modal */}
      <FragranceQuizModal isOpen={isQuizOpen} onClose={() => setIsQuizOpen(false)} />
    </>
  );
}
