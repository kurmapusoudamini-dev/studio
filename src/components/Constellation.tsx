
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
  
  const renderedStars = useMemo(() => {
    const starsToRender: any[] = [];
  
    if (phase === 'playing') {
      const currentLetterStr = STAR_DATA.letters[currentLetterIndex];
      const currentLetterStars = LETTER_PATHS[currentLetterStr]?.stars || [];
      starsToRender.push(
        ...currentLetterStars.map((star, index) => ({
          ...transformCoords(star),
          isCompleted: index < currentStarIndex,
          isNext: index === currentStarIndex,
          isWrong: showWrongTapEffect?.starIndex === index,
          originalIndex: index,
          letterIndex: currentLetterIndex,
        }))
      );
    } else if (phase === 'finale' || phase === 'freeRoam') {
      STAR_DATA.letters.forEach((letter, letterIdx) => {
        const path = LETTER_PATHS[letter]?.stars || [];
        path.forEach((star, starIdx) => {
          starsToRender.push({
            ...transformCoords(star),
            isCompleted: true,
            isNext: false,
            isWrong: false,
            originalIndex: starIdx,
            letterIndex: letterIdx,
          });
        });
      });
    }
    
    return starsToRender;
  }, [phase, currentLetterIndex, currentStarIndex, completedLetters, showWrongTapEffect, dims]);

  const renderedLines = useMemo(() => {
    const lines: any[] = [];
  
    const drawLinesForLetter = (letterIndex: number, maxStarIndex?: number) => {
      const letterStr = STAR_DATA.letters[letterIndex];
      const letterDef = LETTER_PATHS[letterStr];
      if (!letterDef) return;
  
      const stars = letterDef.stars;
      const segments = letterDef.segments;
  
      segments.forEach((segment, segIdx) => {
        for (let i = 1; i < segment.length; i++) {
          const startIdx = segment[i - 1];
          const endIdx = segment[i];
  
          if (maxStarIndex === undefined || (startIdx < maxStarIndex && endIdx < maxStarIndex)) {
            const start = transformCoords(stars[startIdx]);
            const end = transformCoords(stars[endIdx]);
            lines.push({
              x1: start.x, y1: start.y, x2: end.x, y2: end.y,
              key: `line-l${letterIndex}-s${segIdx}-i${i}`,
            });
          }
        }
      });
    };
  
    if (phase === 'playing') {
      // Draw lines for the current, in-progress letter
      drawLinesForLetter(currentLetterIndex, currentStarIndex);
    } else if (phase === 'finale' || phase === 'freeRoam') {
      // In finale/freeRoam, all letters are considered complete
      STAR_DATA.letters.forEach((_, letterIdx) => {
        drawLinesForLetter(letterIdx);
      });
    } else {
        // Draw lines for all fully completed letters
        completedLetters.forEach((isCompleted, letterIdx) => {
          if (isCompleted) {
            drawLinesForLetter(letterIdx);
          }
        });
    }
  
    return lines;
  }, [phase, currentLetterIndex, currentStarIndex, completedLetters, dims]);


  const handleStarClick = (starIndex: number, letterIndex?: number) => {
    if (phase === 'freeRoam') {
      dispatch({ type: 'TAP_STAR', payload: { tappedStarIndex: starIndex, letterIndex, isFreeRoam: true } });
    } else {
      // During 'playing', only clicks on the current letter are valid.
      if (letterIndex === currentLetterIndex) {
        dispatch({ type: 'TAP_STAR', payload: { tappedStarIndex: starIndex } });
      }
    }
  };
  
  const handleNextClick = () => {
    dispatch({ type: 'TAP_STAR', payload: { tappedStarIndex: currentStarIndex } });
  };

  const currentLetterStr = STAR_DATA.letters[currentLetterIndex];

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
        
        {/* Render lines for completed letters first (underneath) */}
        <g>
          {renderedLines.map(({ key, ...lineProps }) => (
            <line key={key} {...lineProps}
              className={cn(
                'stroke-primary/70 transition-all duration-500',
                 (phase === 'finale' || phase === 'freeRoam') ? 'stroke-primary' : '',
                 prefersReducedMotion ? 'animate-fade-in' : ''
              )}
              strokeWidth="2"
              strokeLinecap="round"
              filter="url(#glow)"
            />
          ))}
        </g>
        
        {/* Render stars */}
        {renderedStars.map((star, i) => (
           <g key={`star-group-${star.letterIndex}-${star.originalIndex}`} 
              transform={`translate(${star.x}, ${star.y}) scale(1.5)`}
              onClick={() => handleStarClick(star.originalIndex, star.letterIndex)}>
            <use
              href="#star-path"
              className={cn(
                'fill-accent transition-all duration-300 transform -translate-x-3 -translate-y-3 cursor-pointer',
                star.isCompleted ? 'opacity-70 star-glow' : 'opacity-100',
                star.isNext && 'animate-pulse star-glow-active',
                star.isWrong && 'animate-shake fill-destructive',
                (phase === 'finale' || (phase === 'playing' && completedLetters[star.letterIndex])) && 'star-glow',
                phase === 'finale' && 'animate-fade-in-slow'
              )}
              aria-label={`Star ${star.originalIndex + 1} for letter ${STAR_DATA.letters[star.letterIndex]}`}
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
