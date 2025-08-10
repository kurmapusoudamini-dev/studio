export const STAR_DATA = {
  letters: ["A", "P", "A", "R", "A", "N", "J", "I", "T", "H", "A"],
  quotes: {
    A1: "As stars scatter, my thoughts settle on you.",
    P: "Promise me more ordinary days made magic.",
    A2: "Always, your laugh redraws my sky.",
    R: "Right here, I find my north.",
    A3: "All my quiet hours learn your name.",
    N: "Near or far, your light finds me.",
    J: "Just one look, and night brightens.",
    I: "In small moments, we become huge.",
    T: "Tonight is ours; tomorrow can wait.",
    H: "Hand in hand, through every season.",
    A4: "Always and again—happy birthday, Aparanjitha.",
  },
  finaleNote:
    "Under this little sky we made, I wish you a year of easy laughter, brave dreams, and every good thing finding you. Happy birthday, Aparanjitha.",
};

export type Star = { x: number; y: number };
export type LetterPath = Star[];

export const LETTER_PATHS: { [key: string]: LetterPath } = {
  A: [
    { x: 0.5, y: 0.1 },
    { x: 0.1, y: 0.9 },
    { x: 0.9, y: 0.9 },
    { x: 0.5, y: 0.1 },
    { x: 0.3, y: 0.6 },
    { x: 0.7, y: 0.6 },
  ],
  P: [
    { x: 0.2, y: 0.9 },
    { x: 0.2, y: 0.1 },
    { x: 0.8, y: 0.1 },
    { x: 0.8, y: 0.5 },
    { x: 0.2, y: 0.5 },
  ],
  R: [
    { x: 0.2, y: 0.9 },
    { x: 0.2, y: 0.1 },
    { x: 0.8, y: 0.1 },
    { x: 0.8, y: 0.5 },
    { x: 0.2, y: 0.5 },
    { x: 0.8, y: 0.9 },
  ],
  N: [
    { x: 0.1, y: 0.9 },
    { x: 0.1, y: 0.1 },
    { x: 0.9, y: 0.9 },
    { x: 0.9, y: 0.1 },
  ],
  J: [
    { x: 0.9, y: 0.1 },
    { x: 0.5, y: 0.1 },
    { x: 0.5, y: 0.9 },
    { x: 0.1, y: 0.9 },
    { x: 0.1, y: 0.7 },
  ],
  I: [
    { x: 0.5, y: 0.1 },
    { x: 0.5, y: 0.9 },
    { x: 0.3, y: 0.1 },
    { x: 0.7, y: 0.1 },
    { x: 0.3, y: 0.9 },
    { x: 0.7, y: 0.9 },
  ],
  T: [
    { x: 0.1, y: 0.1 },
    { x: 0.9, y: 0.1 },
    { x: 0.5, y: 0.1 },
    { x: 0.5, y: 0.9 },
  ],
  H: [
    { x: 0.1, y: 0.1 },
    { x: 0.1, y: 0.9 },
    { x: 0.1, y: 0.5 },
    { x: 0.9, y: 0.5 },
    { x: 0.9, y: 0.1 },
    { x: 0.9, y: 0.9 },
  ],
};
