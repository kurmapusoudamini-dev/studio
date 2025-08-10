
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

export interface LetterPath {
  stars: Star[];
  segments: number[][]; // Array of segments, where each segment is an array of star indices
}

export const LETTER_PATHS: { [key: string]: LetterPath } = {
  A: {
    stars: [
      { x: 0.5, y: 0.1 }, { x: 0.1, y: 0.9 }, { x: 0.9, y: 0.9 }, // Main triangle (0,1,2)
      { x: 0.3, y: 0.6 }, { x: 0.7, y: 0.6 },                    // Cross-bar (3,4)
    ],
    segments: [
      [0, 1], 
      [0, 2],
      [3, 4],
    ],
  },
  P: {
    stars: [
      { x: 0.2, y: 0.9 }, { x: 0.2, y: 0.1 }, { x: 0.8, y: 0.1 },
      { x: 0.8, y: 0.5 }, { x: 0.2, y: 0.5 },
    ],
    segments: [[0, 1, 2, 3, 4]],
  },
  R: {
    stars: [
      { x: 0.2, y: 0.9 }, { x: 0.2, y: 0.1 }, { x: 0.8, y: 0.1 },
      { x: 0.8, y: 0.5 }, { x: 0.2, y: 0.5 }, { x: 0.8, y: 0.9 },
    ],
    segments: [[0, 1, 2, 3, 4, 5]],
  },
  N: {
    stars: [
      { x: 0.1, y: 0.9 }, { x: 0.1, y: 0.1 }, { x: 0.9, y: 0.9 },
      { x: 0.9, y: 0.1 },
    ],
    segments: [[0, 1, 2, 3]],
  },
  J: {
    stars: [
      { x: 0.9, y: 0.1 }, { x: 0.5, y: 0.1 }, { x: 0.5, y: 0.9 },
      { x: 0.1, y: 0.9 }, { x: 0.1, y: 0.7 },
    ],
    segments: [[0, 1, 2, 3, 4]],
  },
  I: {
    stars: [
      { x: 0.5, y: 0.1 }, { x: 0.5, y: 0.9 }, { x: 0.3, y: 0.1 },
      { x: 0.7, y: 0.1 }, { x: 0.3, y: 0.9 }, { x: 0.7, y: 0.9 },
    ],
    segments: [[2,3], [4,5], [0,1]],
  },
  T: {
    stars: [
      { x: 0.1, y: 0.1 }, { x: 0.9, y: 0.1 }, { x: 0.5, y: 0.1 },
      { x: 0.5, y: 0.9 },
    ],
    segments: [[0, 1], [2,3]],
  },
  H: {
    stars: [
      { x: 0.1, y: 0.1 }, { x: 0.1, y: 0.9 }, { x: 0.1, y: 0.5 },
      { x: 0.9, y: 0.5 }, { x: 0.9, y: 0.1 }, { x: 0.9, y: 0.9 },
    ],
    segments: [[0, 1], [2, 3], [4, 5]],
  },
};
