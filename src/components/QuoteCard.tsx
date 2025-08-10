'use client';

import { useGame } from '@/context/GameContext';
import { Card, CardContent, CardFooter } from './ui/card';
import { cn } from '@/lib/utils';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { Button } from './ui/button';
import { ArrowRight } from 'lucide-react';

const RoseIcon = () => (
    <svg viewBox="0 0 100 100" className="rose-blessing h-16 w-16 mx-auto mb-4 text-primary">
      <path d="M50,90 C40,80 30,70 30,50 C30,30 50,20 50,20 C50,20 70,30 70,50 C70,70 60,80 50,90 Z" fill="currentColor" />
      <path d="M50,20 C40,10 30,10 30,20 C30,30 40,30 50,20 Z" fill="currentColor" />
      <path d="M50,20 C60,10 70,10 70,20 C70,30 60,30 50,20 Z" fill="currentColor" />
      <path d="M50,50 C40,55 35,65 35,75" stroke="hsl(var(--card))" fill="none" strokeWidth="3" strokeLinecap="round" />
      <path d="M50,50 C60,55 65,65 65,75" stroke="hsl(var(--card))" fill="none" strokeWidth="3" strokeLinecap="round" />
    </svg>
);


export default function QuoteCard() {
  const { state, dispatch } = useGame();
  const { isQuoteCardOpen, quote } = state;
  const prefersReducedMotion = usePrefersReducedMotion();

  const handleNext = () => {
    if (isQuoteCardOpen) {
      dispatch({ type: 'CLOSE_QUOTE_CARD' });
    }
  };
  
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only close if the overlay itself is clicked, not the card content
    if (e.target === e.currentTarget) {
      handleNext();
    }
  };

  return (
    <>
      <div
        onClick={handleOverlayClick}
        className={cn(
          'fixed inset-0 z-30 bg-black/50 transition-opacity duration-300 flex items-center justify-center',
          isQuoteCardOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
      >
        <div
          // This div prevents the card from inheriting the parent's click handler
          onClick={(e) => e.stopPropagation()}
          className={cn(
            'w-[90%] max-w-md transition-all duration-500 ease-out',
            isQuoteCardOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0',
            prefersReducedMotion && isQuoteCardOpen && 'animate-fade-in',
            prefersReducedMotion && !isQuoteCardOpen && 'opacity-0'
          )}
        >
          <Card className="bg-card/70 backdrop-blur-lg border-primary/20 overflow-hidden">
            <CardContent className="p-6 text-center">
              {isQuoteCardOpen && <RoseIcon />}
              <p className="text-lg text-accent">{quote}</p>
            </CardContent>
            <CardFooter>
              <Button onClick={handleNext} className="w-full">
                Next
                <ArrowRight className="ml-2" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
}
