'use client';

import * as React from 'react';
import { Plus, Minus } from 'lucide-react';
import { cn } from '@/utils/cn';

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqClientProps {
  faqs: FaqItem[];
}

export function FaqClient({ faqs }: FaqClientProps) {
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);

  const toggleIndex = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      {faqs.map((faq, index) => {
        const isOpen = activeIndex === index;
        return (
          <div
            key={index}
            className={cn(
              "border rounded-2xl overflow-hidden transition-all duration-500",
              isOpen 
                ? "border-primary/30 bg-zinc-950/80 shadow-[0_4px_20px_rgba(138,115,85,0.08)]" 
                : "border-zinc-900 bg-zinc-950/30 hover:border-zinc-800"
            )}
          >
            <button
              onClick={() => toggleIndex(index)}
              className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 font-sans text-sm sm:text-base font-light text-zinc-300 hover:text-white transition-colors cursor-pointer"
            >
              <span className={cn(
                "transition-colors duration-300 font-normal",
                isOpen ? "text-primary" : "text-white"
              )}>
                {faq.question}
              </span>
              <span className="flex-shrink-0">
                {isOpen ? (
                  <Minus className="h-4 w-4 text-primary transition-transform duration-300 rotate-180" />
                ) : (
                  <Plus className="h-4 w-4 text-zinc-500 transition-transform duration-300" />
                )}
              </span>
            </button>
            
            <div
              className={cn(
                "transition-all duration-500 ease-in-out overflow-hidden font-sans text-xs sm:text-sm text-zinc-400 font-light",
                isOpen ? "max-h-60 px-6 pb-6 opacity-100" : "max-h-0 opacity-0"
              )}
            >
              <div className="pt-2 border-t border-zinc-900/60 leading-relaxed">
                {faq.answer}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
