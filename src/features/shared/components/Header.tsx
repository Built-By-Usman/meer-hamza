'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, Search, Heart, ShoppingBag, X, ChevronDown, Compass, Award, Percent, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
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
      <header className="w-full z-40 relative">
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
        <div className="w-full bg-background/80 backdrop-blur-md border-b sticky top-0 z-30 transition-all duration-300">
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

              <Link href="/" className="flex items-center space-x-2">
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

              {/* Theme Toggle (Hidden on Mobile, moved to drawer) */}
              <div className="hidden sm:inline-flex">
                <ThemeToggle />
              </div>

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
                <ShoppingBag className="h-4 w-4" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-rose-500 text-[8px] font-bold text-white flex items-center justify-center scale-100 transition-all duration-300">
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
        </div>
      </header>

      {/* Cart Drawer Sheet */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Global Command Palette search */}
      <SearchPalette isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Mobile Drawer Navigation Hamburger Menu */}
      <Sheet isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} side="left">
        <SheetHeader className="flex justify-between items-center pr-4">
          <SheetTitle className="tracking-widest">MENU</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col h-[calc(100vh-80px)] justify-between p-6">
          <div className="flex flex-col space-y-3 text-base font-semibold overflow-y-auto no-scrollbar">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-primary transition-colors py-2 border-b">
              Home
            </Link>
            <div className="flex flex-col space-y-1.5 py-2 border-b">
              <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Shop Categories</span>
              <Link href="/category/oud-collection" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-primary transition-colors pl-2 py-1 text-sm font-medium">
                Oud & Arabic
              </Link>
              <Link href="/category/woody-oriental" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-primary transition-colors pl-2 py-1 text-sm font-medium">
                Woody & Oriental
              </Link>
              <Link href="/category/fresh-floral" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-primary transition-colors pl-2 py-1 text-sm font-medium">
                Fresh & Floral
              </Link>
              <Link href="/category/mens-perfumes" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-primary transition-colors pl-2 py-1 text-sm font-medium">
                Pour Homme (Men)
              </Link>
              <Link href="/category/womens-perfumes" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-primary transition-colors pl-2 py-1 text-sm font-medium">
                Pour Femme (Women)
              </Link>
              <Link href="/categories" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-primary transition-colors pl-2 py-1 text-sm text-primary font-semibold">
                All Collections
              </Link>
            </div>
            
            {/* Wishlist Link inside Mobile Drawer */}
            <Link
              href="/profile?tab=wishlist"
              onClick={() => setIsMobileMenuOpen(false)}
              className="hover:text-primary transition-colors py-2 border-b flex items-center justify-between"
            >
              <span>Wishlist</span>
              {wishlistItemsCount > 0 && (
                <Badge className="text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full p-0">
                  {wishlistItemsCount}
                </Badge>
              )}
            </Link>

             <Link href="/category/all?filter=new" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-primary transition-colors py-2 border-b">
              New Arrivals
             </Link>
             <button
               onClick={() => {
                 setIsMobileMenuOpen(false);
                 setIsQuizOpen(true);
               }}
               className="hover:text-primary transition-colors py-2 border-b text-primary font-bold text-left flex items-center gap-1.5 cursor-pointer"
             >
               <Sparkles className="h-4 w-4 fill-primary/10" /> Fragrance Finder Quiz
             </button>
          </div>

          {/* Bottom mobile drawer info (User session & theme) */}
          <div className="border-t pt-4 space-y-4 text-left">
            {/* User Session status */}
            {isAuthenticated && user ? (
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full overflow-hidden border relative flex-shrink-0">
                    <OptimizedImage src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100'} alt={user.firstName} fill />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-foreground truncate">{user.firstName} {user.lastName}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" onClick={() => { setIsMobileMenuOpen(false); router.push('/profile'); }} className="text-xs h-8 cursor-pointer w-full">
                    Account
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      useAuthStore.getState().logout();
                      toast.success('Logged out successfully');
                      router.push('/');
                    }}
                    className="text-xs h-8 cursor-pointer w-full text-destructive border-destructive/20 hover:bg-destructive/5"
                  >
                    Sign Out
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-muted-foreground">Sign in to sync your wishlist and place orders.</p>
                <Button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    // trigger login modal open
                    const btn = document.querySelector('[aria-label="Toggle theme"]') as HTMLElement;
                    if (btn) setIsMobileMenuOpen(false);
                    // Open Login Modal
                    setIsMobileMenuOpen(false);
                    setIsSearchOpen(false);
                    router.push('/profile'); // routes to profile page which prompts sign in
                  }}
                  className="w-full text-xs h-9 cursor-pointer"
                >
                  Sign In Demo Account
                </Button>
              </div>
            )}

            {/* Mobile Theme Toggle Selection Grid */}
            <div className="flex items-center justify-between border-t pt-3 text-xs text-muted-foreground">
              <span>Theme Preference:</span>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </Sheet>

      {/* Fragrance Finder Quiz Modal */}
      <FragranceQuizModal isOpen={isQuizOpen} onClose={() => setIsQuizOpen(false)} />
    </>
  );
}
