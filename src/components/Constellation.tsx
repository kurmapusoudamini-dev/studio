'use client';
import { useGame } from '@/context/GameContext';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { LETTER_PATHS, STAR_DATA, type Star } from '@/lib/data';
import { cn } from '@/lib/utils';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from './ui/button';

export default function Constellation() {
  const { state, dispatch } = useGame();
  const containerRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ width: 0, height: 0, padding: 30 });
  const prefersReducedMotion = usePrefersReducedMotion();

  const { phase, currentLetterIndex, currentStarIndex, completedLetters, showWrongTapEffect } = state;

  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      if (entries[0]) {
        const { width, height } = entries[0].contentRect;
        setDims({ width, height, padding: Math.min(width, height) * 0.15 });
      }
    });
    if (containerRef.current) resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    if (showWrongTapEffect) {
      const timer = setTimeout(() => {
        dispatch({ type: 'RESET_WRONG_TAP_EFFECT' });
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [showWrongTapEffect, dispatch]);

  const transformCoords = (star: Star): { x: number; y: number } => {
    const { width, height, padding } = dims;
    const canvasWidth = width - padding * 2;
    const canvasHeight = height - padding * 2;
    const scale = Math.min(canvasWidth, canvasHeight);
    const xOffset = padding + (width - scale - padding*2) / 2;
    const yOffset = padding + (height - scale - padding*2) / 2;

    return { x: star.x * scale + xOffset, y: star.y * scale + yOffset };
  };

  const currentLetterStr = STAR_DATA.letters[currentLetterIndex];
  const currentPath = LETTER_PATHS[currentLetterStr] || [];

  const renderedStars = useMemo(() => {
    if (phase === 'playing') {
      return currentPath.map((star, index) => ({
        ...transformCoords(star),
        isCompleted: index < currentStarIndex,
        isNext: index === currentStarIndex,
        isWrong: showWrongTapEffect?.starIndex === index,
        originalIndex: index,
      }));
    }
    if (phase === 'finale' || phase === 'freeRoam') {
      let allStars: any[] = [];
      STAR_DATA.letters.forEach((letter, letterIdx) => {
        const path = LETTER_PATHS[letter] || [];
        path.forEach((star, starIdx) => {
          allStars.push({
            ...transformCoords(star),
            isCompleted: true,
            isNext: false,
            isWrong: false,
            originalIndex: starIdx,
            letterIndex: letterIdx
          });
        });
      });
      return allStars;
    }
    return [];
  }, [phase, currentPath, currentStarIndex, showWrongTapEffect, dims, completedLetters]);
  
  const renderedLines = useMemo(() => {
    if (phase === 'playing') {
       if (currentStarIndex === 0) return [];
       const lines = [];
       for (let i = 0; i < currentStarIndex; i++) {
           if (i < currentPath.length - 1) {
               const start = transformCoords(currentPath[i]);
               const end = transformCoords(currentPath[i+1]);
               lines.push({ x1: start.x, y1: start.y, x2: end.x, y2: end.y, key: `line-${currentLetterIndex}-${i}`});
           }
       }
       return lines;
    }
    if (phase === 'finale' || phase === 'freeRoam') {
       const lines: any[] = [];
       STAR_DATA.letters.forEach((letter, letterIdx) => {
           const path = LETTER_PATHS[letter];
           for (let i = 0; i < path.length - 1; i++) {
               const start = transformCoords(path[i]);
               const end = transformCoords(path[i+1]);
               lines.push({ x1: start.x, y1: start.y, x2: end.x, y2: end.y, key: `line-final-${letterIdx}-${i}`});
           }
       });
       return lines;
    }
    return [];
  }, [phase, currentStarIndex, currentLetterIndex, currentPath, dims, completedLetters]);
  

  const handleStarClick = (starIndex: number) => {
    dispatch({ type: 'TAP_STAR', payload: { tappedStarIndex: starIndex, isFreeRoam: phase === 'freeRoam' } });
  };
  
  const handleNextClick = () => {
    handleStarClick(currentStarIndex);
  };


  return (
    <div ref={containerRef} className="w-full h-full">
      <svg className="absolute inset-0 w-full h-full overflow-visible">
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <g>
          {renderedLines.map(line => (
            <line {...line}
              className={cn(
                'stroke-primary transition-all duration-500',
                prefersReducedMotion ? 'animate-fade-in' : ''
              )}
              strokeWidth="2"
              strokeLinecap="round"
              filter="url(#glow)"
            />
          ))}
        </g>
      </svg>
      
      {renderedStars.map((star, i) => (
        <button
          key={`star-${star.letterIndex ?? currentLetterIndex}-${star.originalIndex}`}
          onClick={() => handleStarClick(star.originalIndex)}
          className={cn(
            'absolute w-11 h-11 rounded-full bg-accent transition-all duration-300 transform -translate-x-1/2 -translate-y-1/2 focus:outline-none focus:ring-2 focus:ring-primary',
            star.isCompleted ? 'opacity-70 star-glow' : 'opacity-100',
            star.isNext && 'animate-pulse star-glow-active',
            star.isWrong && 'animate-shake bg-destructive',
            phase === 'finale' && 'animate-fade-in-slow',
          )}
          style={{ left: star.x, top: star.y }}
          aria-label={`Star ${star.originalIndex + 1} of ${currentPath.length} for letter ${currentLetterStr}`}
        />
      ))}

      {prefersReducedMotion && phase === 'playing' && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2">
            <Button onClick={handleNextClick}>Next Star</Button>
        </div>
      )}
    </div>
  );
}
