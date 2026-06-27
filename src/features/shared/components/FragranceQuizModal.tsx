'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, X, ArrowRight, RotateCcw, Check, ShoppingBag } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { PRODUCTS } from '@/data/db';
import { Product } from '@/types';
import { useCartStore } from '@/store/cart';
import { toast } from 'sonner';

interface FragranceQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FragranceQuizModal({ isOpen, onClose }: FragranceQuizModalProps) {
  const router = useRouter();
  const [step, setStep] = React.useState(1);
  const [gender, setGender] = React.useState<string | null>(null);
  const [scentType, setScentType] = React.useState<string | null>(null);
  const [occasion, setOccasion] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<Product | null>(null);

  const addToCart = useCartStore((s) => s.addToCart);

  // Reset quiz states
  const resetQuiz = () => {
    setStep(1);
    setGender(null);
    setScentType(null);
    setOccasion(null);
    setResult(null);
  };

  // Find matching fragrance
  const handleCalculateResult = () => {
    // Basic recommendation logic
    const matched = PRODUCTS.filter((p) => {
      const specGender = p.specifications['Gender'] || 'Unisex';
      const specFamily = p.specifications['Fragrance Family'] || '';
      const specOccasion = p.specifications['Occasion'] || '';

      const matchGender = gender === 'Unisex' ? true : specGender === gender || specGender === 'Unisex';
      
      let matchType = false;
      if (scentType === 'oud') {
        matchType = p.category === 'oud-collection' || specFamily.toLowerCase().includes('oud');
      } else if (scentType === 'woody') {
        matchType = p.category === 'woody-oriental' || specFamily.toLowerCase().includes('woody') || specFamily.toLowerCase().includes('amber');
      } else {
        matchType = p.category === 'fresh-floral' || specFamily.toLowerCase().includes('fresh') || specFamily.toLowerCase().includes('floral');
      }

      return matchGender && matchType;
    });

    const recommended = matched[0] || PRODUCTS[0];
    setResult(recommended);
    setStep(4);
  };

  const handleAddResultToBag = () => {
    if (!result) return;
    addToCart(result, result.variants?.[0], 1);
    toast.success(`${result.name} added to your bag!`);
    onClose();
    resetQuiz();
  };

  const handleNavigateToResult = () => {
    if (!result) return;
    router.push(`/product/${result.slug}`);
    onClose();
    resetQuiz();
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} size="md">
      <DialogContent className="p-6 font-sans rounded-md border-border/60 text-left bg-background/95 backdrop-blur-md">
        <DialogHeader className="border-b pb-3 flex justify-between items-center pr-4">
          <div className="flex items-center space-x-1.5">
            <Sparkles className="h-4 w-4 text-primary fill-primary/10" />
            <DialogTitle className="font-serif italic text-lg tracking-wide text-foreground">Fragrance Finder</DialogTitle>
          </div>
        </DialogHeader>

        {/* Quiz Steps */}
        <div className="py-6 min-h-[220px] flex flex-col justify-between">
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="font-serif italic text-base text-foreground">Who is this fragrance for?</h3>
              <div className="grid grid-cols-3 gap-3">
                {['Men', 'Women', 'Unisex'].map((g) => (
                  <button
                    key={g}
                    onClick={() => {
                      setGender(g);
                      setStep(2);
                    }}
                    className="p-4 border border-border/80 hover:border-primary/50 text-xs uppercase tracking-widest font-extrabold text-muted-foreground hover:text-foreground rounded-sm transition-all text-center bg-card"
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-serif italic text-base text-foreground">What scent profile do you prefer?</h3>
              <div className="flex flex-col space-y-2">
                {[
                  { id: 'oud', title: 'Oud & Arabic', desc: 'Deep, rich, resinous, and extremely long lasting.' },
                  { id: 'woody', title: 'Woody, Warm & Oriental', desc: 'Cedarwood, dry vetiver, amber, and spice.' },
                  { id: 'fresh', title: 'Fresh, Citrus & Floral', desc: 'Jasmin, Damask Rose, seawater, and green tea.' },
                ].map((st) => (
                  <button
                    key={st.id}
                    onClick={() => {
                      setScentType(st.id);
                      setStep(3);
                    }}
                    className="p-4 border border-border/80 hover:border-primary/50 rounded-sm transition-all text-left bg-card space-y-1 group"
                  >
                    <span className="font-bold text-xs uppercase tracking-wider text-muted-foreground group-hover:text-foreground transition-colors">
                      {st.title}
                    </span>
                    <p className="text-[11px] text-muted-foreground font-light">{st.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="font-serif italic text-base text-foreground">When will you wear this fragrance?</h3>
              <div className="flex flex-col space-y-2">
                {[
                  { id: 'evening', title: 'Intimate Evenings & Formal Occasions' },
                  { id: 'daytime', title: 'Office, Daytime Luxury & Brunches' },
                  { id: 'all', title: 'Versatile Daily Signature Scent' },
                ].map((occ) => (
                  <button
                    key={occ.id}
                    onClick={() => {
                      setOccasion(occ.id);
                      handleCalculateResult();
                    }}
                    className="p-4 border border-border/80 hover:border-primary/50 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground rounded-sm transition-all text-left bg-card"
                  >
                    {occ.title}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && result && (
            <div className="space-y-5 text-center flex flex-col items-center">
              <div className="text-[10px] text-primary uppercase font-bold tracking-widest font-sans flex items-center gap-1">
                <Check className="h-3 w-3" /> Your Olfactory Match
              </div>
              
              {/* Product Card preview */}
              <div className="flex items-center space-x-4 border border-border/40 p-4 rounded-sm bg-card w-full max-w-sm">
                <div className="relative h-20 w-16 bg-secondary overflow-hidden rounded-sm border flex-shrink-0">
                  <img src={result.images[0]} alt={result.name} className="object-cover w-full h-full" />
                </div>
                <div className="text-left space-y-1 min-w-0">
                  <span className="text-[9px] text-primary uppercase tracking-widest font-sans font-bold">
                    {result.specifications['Fragrance Family']}
                  </span>
                  <h4 className="font-serif italic text-base text-foreground truncate">{result.name}</h4>
                  <p className="text-[10px] text-muted-foreground truncate font-light">
                    Inspired by: {result.inspiredBy}
                  </p>
                  <span className="font-bold text-sm block font-sans">${result.basePrice}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2.5 w-full max-w-sm pt-2">
                <Button
                  onClick={handleAddResultToBag}
                  className="flex-1 rounded-sm uppercase font-bold text-xs tracking-wider h-11 bg-primary text-primary-foreground hover:bg-primary/95 flex items-center justify-center gap-1.5"
                >
                  <ShoppingBag className="h-4 w-4" /> Add To Bag
                </Button>
                <Button
                  variant="outline"
                  onClick={handleNavigateToResult}
                  className="rounded-sm uppercase font-bold text-[10px] tracking-widest h-11 px-4 hover:bg-secondary border-border"
                >
                  View Details
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Reset / Steps indicator */}
        <div className="border-t pt-4 flex items-center justify-between text-xs text-muted-foreground">
          {step < 4 ? (
            <span>Step {step} of 3</span>
          ) : (
            <button
              onClick={resetQuiz}
              className="flex items-center space-x-1 hover:text-foreground text-[10px] uppercase tracking-wider font-bold"
            >
              <RotateCcw className="h-3 w-3" /> <span>Start Over</span>
            </button>
          )}
          <button onClick={onClose} className="hover:text-foreground text-[10px] uppercase tracking-wider font-bold">
            Close
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
