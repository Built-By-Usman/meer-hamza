'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon, Laptop } from 'lucide-react';
import { cn } from '@/utils/cn';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // useEffect is required to prevent SSR hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center space-x-1 bg-secondary/40 p-1 rounded-full border border-border/20 w-[96px] h-9 animate-pulse" />
    );
  }

  return (
    <div className="flex items-center space-x-0.5 bg-secondary/50 p-0.5 rounded-full border border-border/40 h-8">
      {/* Light Mode Button */}
      <button
        type="button"
        onClick={() => setTheme('light')}
        className={cn(
          "h-7 px-2.5 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer select-none",
          theme === 'light'
            ? "bg-background text-amber-500 shadow-sm border border-border/30 font-bold scale-[1.02]"
            : "text-muted-foreground hover:text-foreground"
        )}
        title="Light Mode"
        aria-label="Activate Light Mode"
      >
        <Sun className="h-3.5 w-3.5 mr-1" />
        <span className="text-[9px] uppercase tracking-wider font-sans font-bold">Light</span>
      </button>

      {/* Dark Mode Button */}
      <button
        type="button"
        onClick={() => setTheme('dark')}
        className={cn(
          "h-7 px-2.5 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer select-none",
          theme === 'dark'
            ? "bg-background text-indigo-400 shadow-sm border border-border/30 font-bold scale-[1.02]"
            : "text-muted-foreground hover:text-foreground"
        )}
        title="Dark Mode"
        aria-label="Activate Dark Mode"
      >
        <Moon className="h-3.5 w-3.5 mr-1" />
        <span className="text-[9px] uppercase tracking-wider font-sans font-bold">Dark</span>
      </button>

      {/* System Default Button */}
      <button
        type="button"
        onClick={() => setTheme('system')}
        className={cn(
          "h-7 px-2.5 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer select-none",
          theme === 'system'
            ? "bg-background text-foreground shadow-sm border border-border/30 font-bold scale-[1.02]"
            : "text-muted-foreground hover:text-foreground"
        )}
        title="System Theme"
        aria-label="Activate System Default Mode"
      >
        <Laptop className="h-3.5 w-3.5 mr-1" />
        <span className="text-[9px] uppercase tracking-wider font-sans font-bold">Auto</span>
      </button>
    </div>
  );
}
