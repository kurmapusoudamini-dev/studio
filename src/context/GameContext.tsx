'use client';
import type { HintInput } from '@/ai/flows/contextual-hint-tool';
import { getHint } from '@/ai/flows/contextual-hint-tool';
import { STAR_DATA, LETTER_PATHS } from '@/lib/data';
import type { Dispatch, ReactNode } from 'react';
import React, { createContext, useContext, useEffect, useReducer } from 'react';

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
  | { type: 'TAP_STAR'; payload: { tappedStarIndex: number; isFreeRoam?: boolean } }
  | { type: 'CLOSE_QUOTE_CARD' }
  | { type: 'SET_HINT'; payload: string }
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
      return { ...state, phase: 'playing' };

    case 'TAP_STAR': {
      const { tappedStarIndex, isFreeRoam } = action.payload;
      const currentLetter = STAR_DATA.letters[state.currentLetterIndex];
      const currentPath = LETTER_PATHS[currentLetter];

      if (isFreeRoam) {
        // In free roam, find which letter was tapped
        // This is a simplified version; a real implementation would need to check coordinates
        const quoteKey = getQuoteKey(currentLetter, state.aCount);
        return {
          ...state,
          isQuoteCardOpen: true,
          quote: STAR_DATA.quotes[quoteKey as keyof typeof STAR_DATA.quotes],
        };
      }

      const isCorrect = tappedStarIndex === state.currentStarIndex;

      const hintInput: HintInput = {
        isCorrect,
        currentLetterIndex: state.currentLetterIndex,
        currentStarIndex: state.currentStarIndex,
        totalStarsInLetter: currentPath.length,
      };

      getHint(hintInput)
        .then(res => {
          dispatch({ type: 'SET_HINT', payload: res.hint });
        })
        .catch(() => {
          dispatch({
            type: 'SET_HINT',
            payload: isCorrect ? 'Beautiful!' : 'Almost—try the glowing star.',
          });
        });

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
            };
          }
        } else {
          // Go to next star
          return { ...state, currentStarIndex: nextStarIndex };
        }
      } else {
        // Wrong tap
        return { ...state, showWrongTapEffect: { starIndex: tappedStarIndex } };
      }
    }
    case 'RESET_WRONG_TAP_EFFECT':
      return { ...state, showWrongTapEffect: null };
      
    case 'CLOSE_QUOTE_CARD':
      return { ...state, isQuoteCardOpen: false };
      
    case 'SET_HINT':
      return { ...state, hintText: action.payload };

    case 'REPLAY':
      return { ...initialState, phase: 'playing' };

    default:
      return state;
  }
};

let dispatch: Dispatch<Action>;

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [state, _dispatch] = useReducer(gameReducer, initialState);
  dispatch = _dispatch;

  useEffect(() => {
    try {
      const savedState = localStorage.getItem('starlight-serenade-progress');
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        dispatch({ type: 'LOAD_PROGRESS', payload: { ...initialState, ...parsedState, phase: parsedState.phase || 'intro' } });
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
