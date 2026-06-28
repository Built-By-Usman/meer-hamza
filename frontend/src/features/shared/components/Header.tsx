'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Menu, Search, Heart, ShoppingBag, X, ChevronDown, Compass, Award, Percent, Sparkles, Home, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import { ThemeToggle } from './ThemeToggle';
import dynamic from 'next/dynamic';

const CartDrawer = dynamic(() => import('@/features/cart/components/CartDrawer').then((mod) => mod.CartDrawer), { ssr: false });
const WishlistDrawer = dynamic(() => import('./WishlistDrawer').then((mod) => mod.WishlistDrawer), { ssr: false });
const FragranceQuizModal = dynamic(() => import('./FragranceQuizModal').then((mod) => mod.FragranceQuizModal), { ssr: false });
const SearchPalette = dynamic(() => import('./SearchPalette').then((mod) => mod.SearchPalette), { ssr: false });
import { useCartStore } from '@/store/cart';
import { useWishlistStore } from '@/store/wishlist';
import { useAuthStore } from '@/store/auth';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'sonner';
import TimelessByMeer from '@/components/common/TimelessByMeer';

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
  const [isWishlistOpen, setIsWishlistOpen] = React.useState(false);
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

  // Retrigger wishlist bounce animation every time count increases
  const [wishlistBounceKey, setWishlistBounceKey] = React.useState(0);
  const prevWishlistCount = React.useRef(wishlistItemsCount);
  React.useEffect(() => {
    if (wishlistItemsCount > prevWishlistCount.current) {
      setWishlistBounceKey((k) => k + 1);
    }
    prevWishlistCount.current = wishlistItemsCount;
  }, [wishlistItemsCount]);

  // Listen to custom window events triggered by MobileBottomNav
  React.useEffect(() => {
    const handleToggleCart = () => setIsCartOpen((prev) => !prev);
    const handleToggleWishlist = () => setIsWishlistOpen((prev) => !prev);
    const handleToggleSearch = () => setIsSearchOpen((prev) => !prev);
    const handleToggleMenu = () => setIsMobileMenuOpen((prev) => !prev);
    const handleToggleQuiz = () => setIsQuizOpen((prev) => !prev);

    window.addEventListener('toggle-cart-drawer', handleToggleCart);
    window.addEventListener('toggle-wishlist-drawer', handleToggleWishlist);
    window.addEventListener('toggle-search-palette', handleToggleSearch);
    window.addEventListener('toggle-mobile-menu', handleToggleMenu);
    window.addEventListener('toggle-fragrance-quiz', handleToggleQuiz);

    return () => {
      window.removeEventListener('toggle-cart-drawer', handleToggleCart);
      window.removeEventListener('toggle-wishlist-drawer', handleToggleWishlist);
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
        <div className="w-full bg-zinc-950/98 backdrop-blur-md border-b border-zinc-900 text-white transition-all duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            {/* Left: Hamburg menu (mobile) & Brand Logo */}
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden h-9 w-9 cursor-pointer text-zinc-400 hover:text-white hover:bg-zinc-900"
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label="Open mobile menu"
              >
                <Menu className="h-5 w-5" />
              </Button>

              <Link href="/" className="flex items-center group py-1">
                <TimelessByMeer size="xs" />
              </Link>
            </div>

            {/* Center: Desktop Navigation Mega Menu triggers */}
            <nav className="hidden md:flex items-center space-x-4 h-full z-40">
              <Link href="/#catalog-section" className="px-3 py-2 text-sm font-semibold text-zinc-300 hover:text-white transition-colors">
                Shop Catalog
              </Link>
              <Link href="/#catalog-section" className="px-3 py-2 text-sm font-semibold text-zinc-300 hover:text-white transition-colors">
                New Arrivals
              </Link>
              <button
                onClick={() => setIsQuizOpen(true)}
                className="px-3 py-2 text-sm font-bold text-amber-400 hover:text-amber-300 transition-colors cursor-pointer flex items-center gap-1 bg-transparent border-none"
              >
                <Sparkles className="h-3.5 w-3.5 fill-amber-400/10 text-amber-400" /> Fragrance Finder
              </button>
            </nav>

            {/* Right: Actions Menu */}
            <div className="flex items-center space-x-1 sm:space-x-2">
              {/* Cmd+K Search trigger */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="hidden lg:flex items-center text-left space-x-2 px-3 py-1.5 rounded-full border border-zinc-200 bg-white text-zinc-600 hover:text-zinc-900 hover:border-zinc-300 text-xs transition-colors w-[180px] cursor-pointer shadow-xs"
              >
                <Search className="h-3.5 w-3.5 text-zinc-400" />
                <span className="flex-1 font-medium">Search catalog...</span>
                <kbd className="inline-flex h-4 items-center select-none rounded border border-zinc-200 bg-zinc-100 px-1.5 font-mono text-[9px] font-medium text-zinc-500">
                  ⌘K
                </kbd>
              </button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchOpen(true)}
                className="lg:hidden h-9 w-9 rounded-full cursor-pointer text-zinc-400 hover:text-white hover:bg-zinc-900"
                aria-label="Search"
              >
                <Search className="h-4 w-4" />
              </Button>

              {/* Wishlist count trigger (Always visible) */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsWishlistOpen(true)}
                className="h-8 w-8 sm:h-9 sm:w-9 rounded-full relative cursor-pointer text-zinc-400 hover:text-white hover:bg-zinc-900"
                aria-label="Wishlist"
              >
                {/* Expanding sonar ripple ring on add to wishlist */}
                {wishlistBounceKey > 0 && (
                  <motion.span
                    key={`wishlist-ripple-${wishlistBounceKey}`}
                    initial={{ scale: 0.8, opacity: 0.8 }}
                    animate={{ scale: 2.2, opacity: 0 }}
                    transition={{ duration: 0.85, ease: "easeOut" }}
                    className="absolute inset-0 rounded-full border-2 border-[#f43f5e] pointer-events-none"
                  />
                )}

                <motion.span
                  key={wishlistBounceKey}
                  animate={wishlistBounceKey > 0 ? {
                    scale: [1, 1.5, 0.8, 1.25, 1],
                    rotate: [0, -15, 15, -8, 0],
                    color: ["#a1a1aa", "#f43f5e", "#f43f5e", "#ffffff", "#a1a1aa"]
                  } : {}}
                  transition={{ duration: 0.65, ease: "easeInOut" }}
                  className="inline-block"
                >
                  <Heart className="h-4 w-4" />
                </motion.span>
                <AnimatePresence mode="popLayout">
                  {wishlistItemsCount > 0 && (
                    <motion.span
                      key={wishlistItemsCount}
                      initial={{ scale: 0.4, opacity: 0 }}
                      animate={{ scale: [0.4, 1.4, 0.9, 1.1, 1], opacity: 1 }}
                      exit={{ scale: 0.4, opacity: 0 }}
                      transition={{ duration: 0.45 }}
                      className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-amber-500 text-[7px] font-bold text-black flex items-center justify-center pointer-events-none"
                    >
                      {wishlistItemsCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
 
              {/* Cart Drawer Toggle (Always visible) */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsCartOpen(true)}
                className="h-8 w-8 sm:h-9 sm:w-9 rounded-full relative cursor-pointer text-zinc-400 hover:text-white hover:bg-zinc-900"
                aria-label="Cart"
              >
                {/* Expanding sonar ripple ring on add to cart */}
                {cartBounceKey > 0 && (
                  <motion.span
                    key={`ripple-${cartBounceKey}`}
                    initial={{ scale: 0.8, opacity: 0.8 }}
                    animate={{ scale: 2.2, opacity: 0 }}
                    transition={{ duration: 0.85, ease: "easeOut" }}
                    className="absolute inset-0 rounded-full border-2 border-[#fbbf24] pointer-events-none"
                  />
                )}

                <motion.span
                  key={cartBounceKey}
                  animate={cartBounceKey > 0 ? {
                    scale: [1, 1.5, 0.8, 1.25, 1],
                    rotate: [0, -15, 15, -8, 0],
                    color: ["#a1a1aa", "#fbbf24", "#fbbf24", "#ffffff", "#a1a1aa"]
                  } : {}}
                  transition={{ duration: 0.65, ease: "easeInOut" }}
                  className="inline-block"
                >
                  <ShoppingBag className="h-4 w-4" />
                </motion.span>
                <AnimatePresence mode="popLayout">
                  {cartItemsCount > 0 && (
                    <motion.span
                      key={cartItemsCount}
                      initial={{ scale: 0.4, opacity: 0 }}
                      animate={{ scale: [0.4, 1.4, 0.9, 1.1, 1], opacity: 1 }}
                      exit={{ scale: 0.4, opacity: 0 }}
                      transition={{ duration: 0.45 }}
                      className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-rose-500 text-[7px] font-bold text-white flex items-center justify-center pointer-events-none"
                    >
                      {cartItemsCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
 
              {/* User Account avatar or login (Always visible) */}
              <div className="inline-flex">
                <Link href="/profile">
                  {isAuthenticated && user ? (
                    <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full overflow-hidden border border-zinc-800 cursor-pointer hover:opacity-90 transition-opacity relative">
                      <OptimizedImage
                        src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100'}
                        alt={user.firstName}
                        fill
                      />
                    </div>
                  ) : (
                    <Button variant="ghost" size="sm" className="rounded-full text-[10px] sm:text-xs h-7 sm:h-8 font-bold cursor-pointer px-3.5 bg-white text-zinc-950 hover:bg-zinc-100 transition-colors border-none">
                      Sign In
                    </Button>
                  )}
                </Link>
              </div>
            </div>
          </div>

          {/* Mobile Search Bar Row */}
          <div className="md:hidden w-full px-4 pb-3 pt-1 bg-zinc-950">
            <div
              onClick={() => setIsSearchOpen(true)}
              className="w-full h-10 flex items-center space-x-2 px-4 bg-white border border-zinc-200 rounded-full cursor-pointer transition-colors shadow-xs"
            >
              <Search className="h-4 w-4 text-zinc-500 stroke-[1.5]" />
              <span className="text-xs text-zinc-500 font-normal tracking-wide">Search perfumes...</span>
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
                <div className="flex items-center py-1">
                  <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                    <TimelessByMeer size="xs" />
                  </Link>
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
                  { label: 'My Wishlist', href: '#', icon: Heart, count: wishlistItemsCount },
                  { label: 'My Account', href: '/profile', icon: User },
                ].map((item, i) => {
                  const Icon = item.icon;
                  const isWishlist = item.label === 'My Wishlist';

                  const itemContent = (
                    <div className="flex items-center justify-between py-3.5 border-b border-white/6 text-white/75 hover:text-white hover:border-primary/30 group transition-colors">
                      <div className="flex items-center gap-3.5">
                        <Icon className="h-4 w-4 text-primary/70 group-hover:text-primary transition-colors flex-shrink-0" />
                        <span className="font-sans font-semibold text-sm tracking-wide">{item.label}</span>
                      </div>
                      {item.count !== undefined && item.count > 0 && (
                        <span className="h-5 min-w-5 rounded-full bg-rose-500 text-[9px] font-black text-white flex items-center justify-center px-1">
                          {item.count}
                        </span>
                      )}
                    </div>
                  );

                  return (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: -18 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 + i * 0.06, type: 'spring', stiffness: 300, damping: 28 }}
                    >
                      {isWishlist ? (
                        <button
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            setIsWishlistOpen(true);
                          }}
                          className="w-full text-left block cursor-pointer"
                        >
                          {itemContent}
                        </button>
                      ) : (
                        <Link
                          href={item.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {itemContent}
                        </Link>
                      )}
                    </motion.div>
                  );
                })}
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

      {/* Wishlist Sliding Drawer */}
      <WishlistDrawer isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} />
    </>
  );
}
