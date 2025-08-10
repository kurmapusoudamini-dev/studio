'use client';
import type { HintInput } from '@/ai/flows/contextual-hint-tool';
import { getHint } from '@/ai/flows/contextual-hint-tool';
import { STAR_DATA, LETTER_PATHS } from '@/lib/data';
import type { Dispatch, ReactNode } from 'react';
import React, { createContext, useContext, useEffect, useReducer, useRef } from 'react';

type GamePhase = 'intro' | 'playing' | 'finale' | 'freeRoam';

interface GameState {
  phase: GamePhase;
  currentLetterIndex: number;
  currentStarIndex: number;
  completedLetters: boolean[];
  hintText: string;
  isQuoteCardOpen: boolean;
  quote: string;
  showWrongTapEffect: { starIndex: number } | null;
  aCount: number;
  lastTappedStar: {
    tappedStarIndex: number;
    isCorrect: boolean;
  } | null;
}

type Action =
  | { type: 'TAP_STAR'; payload: { tappedStarIndex: number; letterIndex?: number, isFreeRoam?: boolean } }
  | { type: 'CLOSE_QUOTE_CARD' }
  | { type: 'SET_HINT'; payload: string }
  | { type: 'REPLAY' }
  | { type: 'FINISH_INTRO' }
  | { type: 'LOAD_PROGRESS'; payload: GameState }
  | { type: 'RESET_WRONG_TAP_EFFECT' }
  | { type: 'RESET_LAST_TAPPED_STAR' };

const getQuoteKey = (letter: string, aCount: number) => {
  if (letter !== 'A') return letter;
  return `A${aCount}`;
};

const initialState: GameState = {
  phase: 'intro',
  currentLetterIndex: 0,
  currentStarIndex: 0,
  completedLetters: Array(STAR_DATA.letters.length).fill(false),
  hintText: 'Tap a star to begin.',
  isQuoteCardOpen: false,
  quote: '',
  showWrongTapEffect: null,
  aCount: 1,
  lastTappedStar: null,
};

const GameContext = createContext<{ state: GameState; dispatch: Dispatch<Action> } | undefined>(undefined);

const gameReducer = (state: GameState, action: Action): GameState => {
  switch (action.type) {
    case 'LOAD_PROGRESS':
      return action.payload;

    case 'FINISH_INTRO':
      return { ...state, phase: 'playing' };

    case 'TAP_STAR': {
      if (state.isQuoteCardOpen) return state; // Prevent taps while card is open

      const { tappedStarIndex, isFreeRoam, letterIndex } = action.payload;
      
      if (state.phase === 'freeRoam') {
        if(letterIndex === undefined) return state;
        const letter = STAR_DATA.letters[letterIndex];
        // In free roam, we need to determine which 'A' it is if there are multiple.
        let aCountForQuote = 1;
        if(letter === 'A') {
          let seenAs = 0;
          for(let i=0; i <= letterIndex; i++) {
            if(STAR_DATA.letters[i] === 'A') seenAs++;
          }
          aCountForQuote = seenAs;
        }

        const quoteKey = getQuoteKey(letter, aCountForQuote);
        const quote = STAR_DATA.quotes[quoteKey as keyof typeof STAR_DATA.quotes];
        return {
          ...state,
          isQuoteCardOpen: true,
          quote: quote,
        };
      }

      if (state.phase !== 'playing') return state;

      const currentLetter = STAR_DATA.letters[state.currentLetterIndex];
      const currentPath = LETTER_PATHS[currentLetter];

      const isCorrect = tappedStarIndex === state.currentStarIndex;

      if (isCorrect) {
        const nextStarIndex = state.currentStarIndex + 1;
        if (nextStarIndex >= currentPath.length) {
          // Letter complete
          const newCompletedLetters = [...state.completedLetters];
          newCompletedLetters[state.currentLetterIndex] = true;
          const nextLetterIndex = state.currentLetterIndex + 1;

          let nextACount = state.aCount;
          if (currentLetter === 'A') {
            nextACount++;
          }

          const quoteKey = getQuoteKey(currentLetter, state.aCount);
          const quote = STAR_DATA.quotes[quoteKey as keyof typeof STAR_DATA.quotes];

          if (nextLetterIndex >= STAR_DATA.letters.length) {
            // All letters complete
            return {
              ...state,
              phase: 'finale',
              currentStarIndex: 0,
              completedLetters: newCompletedLetters,
              isQuoteCardOpen: true,
              quote,
              lastTappedStar: { tappedStarIndex, isCorrect },
              hintText: 'Beautiful!', // Immediate feedback
            };
          } else {
            // Go to next letter
            return {
              ...state,
              currentLetterIndex: nextLetterIndex,
              currentStarIndex: 0,
              completedLetters: newCompletedLetters,
              aCount: nextACount,
              isQuoteCardOpen: true,
              quote: quote,
              lastTappedStar: { tappedStarIndex, isCorrect },
              hintText: 'Beautiful!', // Immediate feedback
            };
          }
        } else {
          // Go to next star
          return { 
            ...state, 
            currentStarIndex: nextStarIndex, 
            lastTappedStar: { tappedStarIndex, isCorrect },
            hintText: 'Beautiful!', // Immediate feedback
          };
        }
      } else {
        // Wrong tap
        return { 
          ...state, 
          showWrongTapEffect: { starIndex: tappedStarIndex }, 
          lastTappedStar: { tappedStarIndex, isCorrect },
          hintText: 'Almost—try the glowing star.', // Immediate feedback
        };
      }
    }
    case 'RESET_LAST_TAPPED_STAR':
      return { ...state, lastTappedStar: null };

    case 'RESET_WRONG_TAP_EFFECT':
      return { ...state, showWrongTapEffect: null };
      
    case 'CLOSE_QUOTE_CARD':
      return { ...state, isQuoteCardOpen: false };
      
    case 'SET_HINT':
      return { ...state, hintText: action.payload };

    case 'REPLAY':
      // After finale, replay enters free roam mode
      return { ...initialState, phase: 'freeRoam', completedLetters: Array(STAR_DATA.letters.length).fill(true), hintText: 'Tap any star to see its message again.' };

    default:
      return state;
  }
};

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  
  const { lastTappedStar, phase, currentLetterIndex, currentStarIndex } = state;

  useEffect(() => {
    // This effect now only fetches the AI hint in the background
    if (phase !== 'playing' || !lastTappedStar) return;

    const { isCorrect } = lastTappedStar;
    const currentLetter = STAR_DATA.letters[currentLetterIndex];
    const currentPath = LETTER_PATHS[currentLetter];

    const hintInput: HintInput = {
      isCorrect,
      currentLetterIndex: currentLetterIndex,
      // If correct, we need to send the index of the star that was just completed
      // If incorrect, we send the current star index they should be aiming for
      currentStarIndex: isCorrect ? currentStarIndex -1 : currentStarIndex,
      totalStarsInLetter: currentPath.length,
    };
    
    let isMounted = true;
    
    // Fetch AI hint but don't wait for it to update UI
    getHint(hintInput)
      .then(res => {
        if (isMounted) {
          // Update the hint text when the AI response arrives
          dispatch({ type: 'SET_HINT', payload: res.hint });
        }
      })
      .catch((err) => {
        console.error("Failed to get hint:", err);
        // The reducer has already set a sensible default, so we might not need to do anything here
      })
      .finally(() => {
        if (isMounted) {
          // Reset the trigger for this effect
          dispatch({ type: 'RESET_LAST_TAPPED_STAR' });
        }
      });
      
    return () => { isMounted = false; }
  }, [lastTappedStar, phase, currentLetterIndex, currentStarIndex]);


  useEffect(() => {
    try {
      const savedState = localStorage.getItem('starlight-serenade-progress');
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        // Ensure phase is valid, default to intro if not
        const phase = ['intro', 'playing', 'finale', 'freeRoam'].includes(parsedState.phase) ? parsedState.phase : 'intro';
        dispatch({ type: 'LOAD_PROGRESS', payload: { ...initialState, ...parsedState, phase } });
      }
    } catch (e) {
      console.error("Failed to load state from localStorage", e);
    }
  }, []);

  useEffect(() => {
    try {
      if (state.phase !== 'intro') {
        localStorage.setItem('starlight-serenade-progress', JSON.stringify(state));
      }
    } catch (e) {
        console.error("Failed to save state to localStorage", e);
    }
  }, [state]);

  return <GameContext.Provider value={{ state, dispatch }}>{children}</GameContext.Provider>;
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
