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
import { RotateCcw } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


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

  const handleReplay = () => {
    dispatch({ type: 'REPLAY' });
  };
  
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

      {state.phase !== 'intro' && state.phase !== 'finale' && (
         <div className="absolute z-20 bottom-4 right-4">
           <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon">
                  <RotateCcw className="w-6 h-6 text-accent/70" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Start Over?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will restart your journey through the stars from the beginning. Are you sure?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleReplay}>Restart</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
         </div>
      )}
    </div>
  );
}
