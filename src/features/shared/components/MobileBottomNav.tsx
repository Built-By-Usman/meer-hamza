'use client';

import * as React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Home, Compass, Search, Heart, ShoppingBag, User } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { useWishlistStore } from '@/store/wishlist';
import { cn } from '@/utils/cn';

export function MobileBottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  const cartItemsCount = useCartStore((state) => state.items.reduce((acc, item) => acc + item.quantity, 0));
  const wishlistItemsCount = useWishlistStore((state) => state.items.length);

  const navItems = [
    {
      label: 'Home',
      icon: <Home className="h-5 w-5" />,
      onClick: () => router.push('/'),
      active: pathname === '/',
    },
    {
      label: 'Categories',
      icon: <Compass className="h-5 w-5" />,
      onClick: () => router.push('/categories'),
      active: pathname === '/categories',
    },
    {
      label: 'Search',
      icon: <Search className="h-5 w-5" />,
      onClick: () => router.push('/search'),
      active: pathname === '/search',
    },
    {
      label: 'Wishlist',
      icon: <Heart className="h-5 w-5" />,
      onClick: () => router.push('/profile?tab=wishlist'),
      active: pathname === '/profile' && typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('tab') === 'wishlist',
      badge: wishlistItemsCount,
      badgeColor: 'bg-primary text-primary-foreground',
    },
    {
      label: 'Cart',
      icon: <ShoppingBag className="h-5 w-5" />,
      onClick: () => router.push('/cart'),
      active: pathname === '/cart',
      badge: cartItemsCount,
      badgeColor: 'bg-rose-500 text-white',
    },
    {
      label: 'Account',
      icon: <User className="h-5 w-5" />,
      onClick: () => router.push('/profile'),
      active: pathname === '/profile' && (typeof window !== 'undefined' ? !new URLSearchParams(window.location.search).get('tab') : true),
    },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-lg border-t border-border/80 px-2 py-1.5 shadow-lg select-none">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {navItems.map((item, idx) => (
          <button
            key={idx}
            onClick={item.onClick}
            className={cn(
              "flex flex-col items-center justify-center flex-1 py-1 px-2 cursor-pointer transition-colors relative",
              item.active ? "text-primary" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {/* Icon */}
            <div className="relative">
              {item.icon}
              {/* Badge */}
              {item.badge !== undefined && item.badge > 0 && (
                <span className={cn(
                  "absolute -top-1.5 -right-2 h-4 min-w-4 rounded-full px-1 text-[8px] font-bold flex items-center justify-center animate-pulse",
                  item.badgeColor
                )}>
                  {item.badge}
                </span>
              )}
            </div>

            {/* Label */}
            <span className="text-[10px] font-medium tracking-wide mt-1 scale-95">{item.label}</span>

            {/* Accent dot indicator */}
            {item.active && (
              <span className="absolute bottom-0 h-1 w-1 rounded-full bg-primary" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
