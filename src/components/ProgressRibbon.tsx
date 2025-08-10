'use client';

import { useGame } from '@/context/GameContext';
import { STAR_DATA } from '@/lib/data';
import { cn } from '@/lib/utils';

export default function ProgressRibbon() {
  const { state } = useGame();
  const { currentLetterIndex, completedLetters, phase } = state;

  if (phase === 'intro') {
    return null;
  }

  return (
    <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-center pt-[calc(env(safe-area-inset-top)+1rem)]">
      <div className="flex items-center justify-center p-2 space-x-2 text-sm tracking-widest rounded-full bg-card/50 backdrop-blur-sm">
        {STAR_DATA.letters.map((letter, index) => (
          <React.Fragment key={index}>
            <span
              className={cn(
                'transition-all duration-500 font-bold',
                completedLetters[index] ? 'text-primary' : 'text-foreground/50',
                index === currentLetterIndex && phase === 'playing' && 'text-glow text-accent animate-pulse'
              )}
            >
              {letter}
            </span>
            {index < STAR_DATA.letters.length - 1 && (
              <span className="text-foreground/30">•</span>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
