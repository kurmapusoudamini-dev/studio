
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
    const lines: any[] = [];
    
    // Draw lines for all completed letters
    completedLetters.forEach((isCompleted, letterIdx) => {
      if (isCompleted) {
        const letter = STAR_DATA.letters[letterIdx];
        const path = LETTER_PATHS[letter];
        for (let i = 1; i < path.length; i++) {
          const start = transformCoords(path[i-1]);
          const end = transformCoords(path[i]);
          lines.push({ x1: start.x, y1: start.y, x2: end.x, y2: end.y, key: `line-completed-${letterIdx}-${i}`});
        }
      }
    });

    // Draw lines for the current letter in progress
    if (phase === 'playing' && currentStarIndex > 1) {
       for (let i = 1; i < currentStarIndex; i++) {
           const start = transformCoords(currentPath[i-1]);
           const end = transformCoords(currentPath[i]);
           lines.push({ x1: start.x, y1: start.y, x2: end.x, y2: end.y, key: `line-current-${currentLetterIndex}-${i}`});
       }
    } else if (phase === 'finale' || phase === 'freeRoam') {
      // In finale, all lines should be drawn. This covers any letters not marked as complete.
      STAR_DATA.letters.forEach((letter, letterIdx) => {
        if (!completedLetters[letterIdx]) {
          const path = LETTER_PATHS[letter];
          for (let i = 1; i < path.length; i++) {
            const start = transformCoords(path[i-1]);
            const end = transformCoords(path[i]);
            lines.push({ x1: start.x, y1: start.y, x2: end.x, y2: end.y, key: `line-final-${letterIdx}-${i}`});
          }
        }
      });
    }

    return lines;
  }, [phase, currentStarIndex, currentLetterIndex, currentPath, dims, completedLetters]);
  

  const handleStarClick = (starIndex: number, letterIndex?: number) => {
    if (phase === 'freeRoam') {
      dispatch({ type: 'TAP_STAR', payload: { tappedStarIndex: starIndex, letterIndex, isFreeRoam: true } });
    } else {
      dispatch({ type: 'TAP_STAR', payload: { tappedStarIndex: starIndex } });
    }
  };
  
  const handleNextClick = () => {
    dispatch({ type: 'TAP_STAR', payload: { tappedStarIndex: currentStarIndex } });
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
          <path id="star-path" d="M12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2Z" />
        </defs>
        <g>
          {renderedLines.map(({ key, ...lineProps }) => (
            <line key={key} {...lineProps}
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
        
        {renderedStars.map((star, i) => (
           <g key={`star-group-${star.letterIndex ?? currentLetterIndex}-${star.originalIndex}`} 
              transform={`translate(${star.x}, ${star.y}) scale(1.5)`}
              onClick={() => handleStarClick(star.originalIndex, star.letterIndex)}>
            <use
              href="#star-path"
              className={cn(
                'fill-accent transition-all duration-300 transform -translate-x-3 -translate-y-3 cursor-pointer',
                star.isCompleted ? 'opacity-70 star-glow' : 'opacity-100',
                star.isNext && 'animate-pulse star-glow-active',
                star.isWrong && 'animate-shake fill-destructive',
                phase === 'finale' && 'animate-fade-in-slow'
              )}
              aria-label={`Star ${star.originalIndex + 1} of ${currentPath.length} for letter ${currentLetterStr}`}
            />
           </g>
        ))}

      </svg>
      

      {prefersReducedMotion && phase === 'playing' && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2">
            <Button onClick={handleNextClick}>Next Star</Button>
        </div>
      )}
    </div>
  );
}

