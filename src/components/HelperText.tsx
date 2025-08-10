'use client';
import { useGame } from '@/context/GameContext';
import { cn } from '@/lib/utils';

export default function HelperText() {
  const { state } = useGame();
  const { hintText, phase } = state;

  return (
    <div
      aria-live="polite"
      className={cn(
        'absolute z-10 transition-all duration-300 text-center px-4',
        phase === 'intro' ? 'opacity-0' : 'opacity-100',
        phase === 'finale' ? 'bottom-48' : 'bottom-[calc(25%+env(safe-area-inset-bottom))]'
      )}
    >
      <p className="text-lg text-accent/80">{hintText}</p>
    </div>
  );
}
