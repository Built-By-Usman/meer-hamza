'use client';

import * as React from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Home, Compass, Heart, User, ShoppingBag } from 'lucide-react';
import { useWishlistStore } from '@/store/wishlist';
import { useCartStore } from '@/store/cart';
import { cn } from '@/utils/cn';

export function MobileBottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get('tab');

  const wishlistCount = useWishlistStore((s) => s.items.length);
  const cartCount = useCartStore((s) => s.items.reduce((a, i) => a + i.quantity, 0));

  const navItems = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      onClick: () => router.push('/'),
      active: pathname === '/',
    },
    {
      id: 'explore',
      label: 'Explore',
      icon: Compass,
      onClick: () => router.push('/categories'),
      active: pathname.startsWith('/categor'),
    },
    {
      id: 'wishlist',
      label: 'Wishlist',
      icon: Heart,
      onClick: () => router.push('/profile?tab=wishlist'),
      active: pathname === '/profile' && currentTab === 'wishlist',
      badge: wishlistCount,
    },
    {
      id: 'account',
      label: 'Account',
      icon: User,
      onClick: () => router.push('/profile'),
      active: pathname === '/profile' && currentTab !== 'wishlist',
    },
  ];

  const activeIndex = navItems.findIndex((n) => n.active);

  return (
    /* Safe-area padding so nav clears the home indicator on iPhone */
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 pb-safe select-none">
      {/* Floating pill container */}
      <div className="mx-4 mb-4">
        <div className="relative flex items-center bg-zinc-950/95 backdrop-blur-xl rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.28)] border border-white/8 px-1 py-1">

          {/* Sliding active pill — absolute, moves left automatically */}
          {activeIndex !== -1 && (
            <div
              className="absolute top-1 bottom-1 rounded-xl bg-primary transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
              style={{
                width: `calc(${100 / navItems.length}% - 8px)`,
                left: `calc(${(activeIndex / navItems.length) * 100}% + 4px)`,
              }}
            />
          )}

          {/* Nav buttons */}
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={item.onClick}
                className="relative z-10 flex flex-col items-center justify-center flex-1 py-2.5 cursor-pointer transition-all duration-200 active:scale-90"
                aria-label={item.label}
              >
                {/* Icon */}
                <div className="relative">
                  <Icon
                    className={cn(
                      'transition-all duration-300',
                      item.active
                        ? 'h-5 w-5 text-primary-foreground scale-110 stroke-[2]'
                        : 'h-5 w-5 text-zinc-400 stroke-[1.5] group-hover:text-zinc-200'
                    )}
                  />
                  {/* Badge dot */}
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 min-w-[14px] h-[14px] rounded-full bg-rose-500 text-[8px] font-black text-white flex items-center justify-center px-0.5 leading-none shadow">
                      {item.badge > 9 ? '9+' : item.badge}
                    </span>
                  )}
                </div>

                {/* Label — only shown for active tab */}
                <span
                  className={cn(
                    'font-sans font-bold uppercase tracking-widest overflow-hidden transition-all duration-300',
                    item.active
                      ? 'text-[7px] text-primary-foreground mt-1 max-h-4 opacity-100'
                      : 'text-[0px] max-h-0 opacity-0'
                  )}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

