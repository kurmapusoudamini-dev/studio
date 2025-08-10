export const STAR_DATA = {
  letters: ["A", "P", "A", "R", "A", "N", "J", "I", "T", "H", "A"],
  quotes: {
    A1: "A universe of stars, and I was looking for you.",
    P: "Perhaps we were written in the same constellation.",
    A2: "And in your light, I learn how to love.",
    R: "Remember the night we first met? The stars remember too.",
    A3: "All my atoms have always loved all your atoms.",
    N: "Now and forever, you are my favorite star to gaze upon.",
    J: "Just like a star, you light up my darkest nights.",
    I: "I would find you in any lifetime.",
    T: "To the moon and back is not enough; I love you to the stars and beyond.",
    H: "How is it that you are the sun to my day and the stars to my night?",
    A4: "And so, the adventure begins... with you. Happy birthday, Aparanjitha.",
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
