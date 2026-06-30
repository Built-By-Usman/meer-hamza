import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/utils/cn';

interface AccordionContextType {
  activeValue: string | null;
  toggleItem: (value: string) => void;
}

const AccordionContext = React.createContext<AccordionContextType | undefined>(undefined);

interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue?: string;
  type?: 'single'; // For single expand (expandable list support)
}

export function Accordion({ defaultValue = '', children, className, ...props }: AccordionProps) {
  const [activeValue, setActiveValue] = React.useState<string | null>(defaultValue || null);

  const toggleItem = React.useCallback((value: string) => {
    setActiveValue((prev) => (prev === value ? null : value));
  }, []);

  const contextValue = React.useMemo(() => ({ activeValue, toggleItem }), [activeValue, toggleItem]);

  return (
    <AccordionContext.Provider value={contextValue}>
      <div className={cn('divide-y border-t border-b', className)} {...props}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

export const AccordionItemContext = React.createContext<string | undefined>(undefined);

export function AccordionItem({ value, className, children, ...props }: AccordionItemProps) {
  return (
    <AccordionItemContext.Provider value={value}>
      <div className={cn('py-1', className)} {...props}>
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
}

interface AccordionTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export function AccordionTrigger({ className, children, ...props }: AccordionTriggerProps) {
  const context = React.useContext(AccordionContext);
  const value = React.useContext(AccordionItemContext);

  if (!context || !value) {
    throw new Error('AccordionTrigger must be used inside AccordionItem');
  }

  const isOpen = context.activeValue === value;

  return (
    <button
      type="button"
      onClick={() => context.toggleItem(value)}
      className={cn(
        'flex w-full items-center justify-between py-4 text-sm font-medium transition-all hover:underline text-left cursor-pointer group',
        className
      )}
      aria-expanded={isOpen}
      {...props}
    >
      {children}
      <ChevronDown
        className={cn(
          'h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-hover:text-foreground',
          isOpen && 'rotate-180'
        )}
      />
    </button>
  );
}

interface AccordionContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export function AccordionContent({ className, children, ...props }: AccordionContentProps) {
  const context = React.useContext(AccordionContext);
  const value = React.useContext(AccordionItemContext);

  if (!context || !value) {
    throw new Error('AccordionContent must be used inside AccordionItem');
  }

  const isOpen = context.activeValue === value;

  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="overflow-hidden"
        >
          <div className={cn('pb-4 pt-0 text-sm text-muted-foreground', className)} {...props}>
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
