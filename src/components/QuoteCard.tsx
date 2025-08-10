'use client';

import { useGame } from '@/context/GameContext';
import { Card, CardContent } from './ui/card';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

export default function QuoteCard() {
  const { state, dispatch } = useGame();
  const { isQuoteCardOpen, quote } = state;
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (isQuoteCardOpen) {
      const timer = setTimeout(() => {
        dispatch({ type: 'CLOSE_QUOTE_CARD' });
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isQuoteCardOpen, dispatch]);

  const handleTapOutside = () => {
    if (isQuoteCardOpen) {
      dispatch({ type: 'CLOSE_QUOTE_CARD' });
    }
  };

  return (
    <>
      <div
        className={cn(
          'fixed inset-0 z-10 bg-black/30 transition-opacity duration-300',
          isQuoteCardOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={handleTapOutside}
      />
      <div
        className={cn(
          'fixed bottom-0 left-1/2 z-20 w-[90%] max-w-md transition-transform duration-500 ease-out',
          isQuoteCardOpen ? 'translate-y-0 translate-x-[-50%]' : 'translate-y-full translate-x-[-50%]',
          prefersReducedMotion && isQuoteCardOpen && 'animate-fade-in',
          prefersReducedMotion && !isQuoteCardOpen && 'opacity-0'
        )}
        style={{
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        <Card className="bg-card/70 backdrop-blur-lg border-primary/20">
          <CardContent className="p-6 text-center">
            <p className="text-lg text-accent">{quote}</p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
