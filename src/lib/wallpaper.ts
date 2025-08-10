import { LETTER_PATHS, STAR_DATA } from './data';
import type { Star } from './data';

const WALLPAPER_WIDTH = 1170;
const WALLPAPER_HEIGHT = 2532;

export async function generateWallpaper(): Promise<string> {
  const canvas = document.createElement('canvas');
  canvas.width = WALLPAPER_WIDTH;
  canvas.height = WALLPAPER_HEIGHT;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  // 1. Draw Gradient Background
  const gradient = ctx.createRadialGradient(
    canvas.width / 2, canvas.height, 0,
    canvas.width / 2, canvas.height, canvas.height
  );
  gradient.addColorStop(0, '#4B0082'); // Indigo
  gradient.addColorStop(1, '#191970'); // Deep Navy
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 2. Draw Stars
  const numBgStars = 400;
  ctx.fillStyle = '#E0FFFF'; // Cool white
  for (let i = 0; i < numBgStars; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const size = Math.random() * 2 + 0.5;
    const alpha = Math.random() * 0.7 + 0.2;
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;


  // 3. Draw Constellation
  const padding = 150;
  const drawableWidth = canvas.width - padding * 2;
  const drawableHeight = canvas.height * 0.5; // Constellation in top half
  const yOffset = 200;

  const transformCoords = (star: Star, letterIndex: number, totalLetters: number): { x: number; y: number } => {
    const letterWidth = drawableWidth / totalLetters;
    const letterXOffset = padding + letterIndex * letterWidth;
    
    return {
      x: star.x * (letterWidth * 0.8) + letterXOffset,
      y: star.y * drawableHeight + yOffset,
    };
  };

  ctx.strokeStyle = '#FF5A8A'; // Warm Rose
  ctx.fillStyle = '#E0FFFF';
  ctx.lineWidth = 3;
  ctx.shadowColor = '#FF5A8A';
  ctx.shadowBlur = 10;
  
  const totalLetters = STAR_DATA.letters.length;
  let lastStarPos: {x: number, y: number} | null = null;
  let currentPath: Star[] | null = null;

  STAR_DATA.letters.forEach((letter, letterIdx) => {
    const path = LETTER_PATHS[letter];
    currentPath = path;
    path.forEach((star, starIdx) => {
      const pos = transformCoords(star, letterIdx, totalLetters);
      // Draw star
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 5, 0, Math.PI * 2);
      ctx.fill();

      // Draw line from previous star in the same letter's path
      if (starIdx > 0) {
        const prevPos = transformCoords(path[starIdx-1], letterIdx, totalLetters);
        ctx.beginPath();
        ctx.moveTo(prevPos.x, prevPos.y);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
      }
    });
  });

  ctx.shadowBlur = 0;

  // 4. Draw Footer Text
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.font = '32px Inter, sans-serif';
  ctx.textAlign = 'center';
  const currentYear = new Date().getFullYear();
  ctx.fillText(
    `Made for Aparanjitha • ${currentYear}`,
    canvas.width / 2,
    canvas.height - 80
  );

  return canvas.toDataURL('image/png');
}
