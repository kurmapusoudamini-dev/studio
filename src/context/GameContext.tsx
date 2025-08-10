'use client';
import { STAR_DATA, LETTER_PATHS } from '@/lib/data';
import type { Dispatch, ReactNode } from 'react';
import React, { useContext, createContext, useReducer, useEffect } from 'react';

const CORRECT_HINTS = [
  "Beautiful! You've found the way.",
  "Perfect! The stars align for you.",
  "Nicely done! On to the next.",
  "You're a natural stargazer.",
  "Brilliant! Keep going.",
  "That's it! You're lighting up the sky.",
  "Wonderful! The constellation is taking shape.",
  "You've got it! What's next?",
  "Excellent! Another star in place.",
  "Shining bright! Keep it up.",
];

const INCORRECT_HINTS = [
  "Not quite. Look for the star that glows the brightest.",
  "Almost. The right one is calling to you.",
  "That one's a bit shy. Try the glowing one.",
  "Keep searching. The next star in the path is waiting.",
  "A lovely star, but not the one we need. Look for a gentle pulse of light.",
  "Close! The correct star has a special glow.",
  "Let your heart guide you to the glowing star.",
  "Another beautiful star, but not our next step. Find the one that pulses.",
  "The universe has a path for you, find the glowing star.",
  "Don't give up! The right star is out there, glowing for you.",
];

const getWelcomeHint = () => "Find the first glowing star to begin your journey.";
const getRandomHint = (hints: string[]) => hints[Math.floor(Math.random() * hints.length)];

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
}

type Action =
  | { type: 'TAP_STAR'; payload: { tappedStarIndex: number; letterIndex?: number, isFreeRoam?: boolean } }
  | { type: 'CLOSE_QUOTE_CARD' }
  | { type: 'REPLAY' }
  | { type: 'FINISH_INTRO' }
  | { type: 'LOAD_PROGRESS'; payload: GameState }
  | { type: 'RESET_WRONG_TAP_EFFECT' };

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
};

const GameContext = createContext<{ state: GameState; dispatch: Dispatch<Action> } | undefined>(undefined);

const gameReducer = (state: GameState, action: Action): GameState => {
  switch (action.type) {
    case 'LOAD_PROGRESS':
      return action.payload;

    case 'FINISH_INTRO':
      return { ...state, phase: 'playing', hintText: getWelcomeHint() };

    case 'TAP_STAR': {
      if (state.isQuoteCardOpen) return state;

      const { tappedStarIndex, letterIndex } = action.payload;
      
      if (state.phase === 'freeRoam') {
        if(letterIndex === undefined) return state;
        const letter = STAR_DATA.letters[letterIndex];
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
      
      const isCorrect = tappedStarIndex === state.currentStarIndex;

      if (!isCorrect) {
        return { 
          ...state, 
          showWrongTapEffect: { starIndex: tappedStarIndex }, 
          hintText: getRandomHint(INCORRECT_HINTS),
        };
      }

      // Correct Tap Logic
      const isFirstTapOfTheGame = state.currentLetterIndex === 0 && state.currentStarIndex === 0;

      if (isFirstTapOfTheGame) {
        return {
          ...state,
          currentStarIndex: 1,
          hintText: getRandomHint(CORRECT_HINTS), // Now we can give a correct hint
          showWrongTapEffect: null,
        };
      }

      const currentLetter = STAR_DATA.letters[state.currentLetterIndex];
      const currentPath = LETTER_PATHS[currentLetter];
      const nextStarIndex = state.currentStarIndex + 1;

      // Is the letter complete?
      if (nextStarIndex >= currentPath.length) {
        const newCompletedLetters = [...state.completedLetters];
        newCompletedLetters[state.currentLetterIndex] = true;
        
        let nextACount = state.aCount;
        if (currentLetter === 'A') {
          nextACount++;
        }

        const quoteKey = getQuoteKey(currentLetter, state.aCount);
        const quote = STAR_DATA.quotes[quoteKey as keyof typeof STAR_DATA.quotes];
        const nextLetterIndex = state.currentLetterIndex + 1;

        // Is the whole name complete?
        if (nextLetterIndex >= STAR_DATA.letters.length) {
          return {
            ...state,
            phase: 'finale',
            completedLetters: newCompletedLetters,
            isQuoteCardOpen: true,
            quote,
            hintText: getRandomHint(CORRECT_HINTS),
          };
        }

        // Go to the next letter
        return {
          ...state,
          currentLetterIndex: nextLetterIndex,
          currentStarIndex: 0,
          completedLetters: newCompletedLetters,
          aCount: nextACount,
          isQuoteCardOpen: true,
          quote: quote,
          hintText: getRandomHint(CORRECT_HINTS),
        };
      } else {
        // Go to the next star in the same letter
        return { 
          ...state, 
          currentStarIndex: nextStarIndex, 
          hintText: getRandomHint(CORRECT_HINTS),
          showWrongTapEffect: null,
        };
      }
    }
   
    case 'RESET_WRONG_TAP_EFFECT':
      return { ...state, showWrongTapEffect: null };
      
    case 'CLOSE_QUOTE_CARD': {
       if (state.phase === 'finale') {
          return { ...state, phase: 'freeRoam', isQuoteCardOpen: false, hintText: "You can now tap on any letter to see its message again." };
       }
       if (state.phase === 'playing') {
          return {
            ...state,
            isQuoteCardOpen: false,
            hintText: getWelcomeHint(),
          };
       }
       return { ...state, isQuoteCardOpen: false };
    }

    case 'REPLAY':
      localStorage.removeItem('starlight-serenade-progress');
      return { 
          ...initialState, 
          phase: 'playing', 
          hintText: getWelcomeHint() 
      };

    default:
      return state;
  }
};

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  
  useEffect(() => {
    try {
      const savedState = localStorage.getItem('starlight-serenade-progress');
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        const phase = ['intro', 'playing', 'finale', 'freeRoam'].includes(parsedState.phase) ? parsedState.phase : 'intro';
        if (phase === 'intro') {
            dispatch({ type: 'LOAD_PROGRESS', payload: { ...initialState } });
        } else {
            // Restore everything but ensure card is closed on reload and hint is correct
            const hintText = phase === 'playing' ? getWelcomeHint() : "You can now tap on any letter to see its message again.";
            dispatch({ type: 'LOAD_PROGRESS', payload: { ...initialState, ...parsedState, phase, isQuoteCardOpen: false, hintText } });
        }
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
