'use client';

import React, { useEffect } from 'react';
import { useGame } from '@/context/GameContext';
import StarfieldCanvas from './StarfieldCanvas';
import Constellation from './Constellation';
import ProgressRibbon from './ProgressRibbon';
import QuoteCard from './QuoteCard';
import HelperText from './HelperText';
import FinaleCard from './FinaleCard';
import { Button } from './ui/button';

export default function StarlightSerenade() {
  const { state, dispatch } = useGame();

  useEffect(() => {
    if (state.phase === 'intro') {
      const timer = setTimeout(() => {
        dispatch({ type: 'FINISH_INTRO' });
      }, 2000); // Wait 2s on intro screen
      return () => clearTimeout(timer);
    }
  }, [state.phase, dispatch]);
  
  return (
    <div className="w-full h-full" style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <StarfieldCanvas />
      
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <ProgressRibbon />

        {state.phase === 'intro' && (
          <div className="flex flex-col items-center justify-center text-center text-accent animate-fade-in">
            <h1 className="text-4xl font-bold tracking-wider text-glow md:text-6xl font-headline">Starlight Serenade</h1>
            <p className="mt-4 text-lg md:text-xl">For Aparanjitha</p>
          </div>
        )}
        
        {state.phase !== 'intro' && <Constellation />}

        <HelperText />

        <QuoteCard />

        {state.phase === 'finale' && <FinaleCard />}
      </div>
    </div>
  );
}
