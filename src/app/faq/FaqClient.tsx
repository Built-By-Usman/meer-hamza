'use client';

import * as React from 'react';
import { ChevronDown, Plus, Minus } from 'lucide-react';
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
    <div className="space-y-4">
      {faqs.map((faq, index) => {
        const isOpen = activeIndex === index;
        return (
          <div
            key={index}
            className="border border-zinc-900 bg-zinc-950/40 rounded-xl overflow-hidden transition-all duration-300"
          >
            <button
              onClick={() => toggleIndex(index)}
              className="w-full text-left px-6 py-4 flex items-center justify-between gap-4 font-sans text-sm sm:text-base font-normal text-white hover:text-primary transition-colors cursor-pointer"
            >
              <span>{faq.question}</span>
              <span className="flex-shrink-0 text-zinc-500">
                {isOpen ? (
                  <Minus className="h-4 w-4 text-primary" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
              </span>
            </button>
            
            <div
              className={cn(
                "transition-all duration-300 ease-in-out overflow-hidden font-sans text-xs sm:text-sm text-zinc-400 font-light",
                isOpen ? "max-h-48 px-6 pb-4 opacity-100" : "max-h-0 opacity-0"
              )}
            >
              <p className="leading-relaxed">{faq.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
