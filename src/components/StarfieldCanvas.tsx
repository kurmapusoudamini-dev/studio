'use client';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useGame } from '@/context/GameContext';
import React, { useRef, useEffect, useCallback } from 'react';

const NUM_STARS = 200;
const STAR_SIZES = [0.5, 1, 1.5];

type Star = {
  x: number;
  y: number;
  size: number;
  alpha: number;
  alphaDirection: number;
};

let shootingStar: { x: number, y: number, length: number, speed: number, alpha: number } | null = null;

export default function StarfieldCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const animationFrameId = useRef<number>();
  const prefersReducedMotion = usePrefersReducedMotion();
  const { state } = useGame();

  const createStars = useCallback((width: number, height: number) => {
    const newStars: Star[] = [];
    for (let i = 0; i < NUM_STARS; i++) {
      newStars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: STAR_SIZES[Math.floor(Math.random() * STAR_SIZES.length)],
        alpha: Math.random() * 0.5 + 0.1,
        alphaDirection: Math.random() > 0.5 ? 1 : -1,
      });
    }
    starsRef.current = newStars;
  }, []);

  const triggerShootingStar = useCallback(() => {
      if(shootingStar) return;
      shootingStar = {
          x: Math.random() * window.innerWidth * 0.8,
          y: Math.random() * window.innerHeight * 0.2,
          length: Math.random() * 100 + 100,
          speed: Math.random() * 5 + 5,
          alpha: 1
      };
  }, []);

  useEffect(() => {
    if (state.completedLetters[5] && !state.completedLetters[6]) { // After N
        triggerShootingStar();
    }
  }, [state.completedLetters, triggerShootingStar]);


  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      createStars(canvas.width, canvas.height);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw stars
      ctx.fillStyle = 'hsl(180 100% 94%)';
      starsRef.current.forEach(star => {
        if (!prefersReducedMotion) {
            star.alpha += 0.005 * star.alphaDirection;
            if (star.alpha <= 0.1 || star.alpha >= 0.6) {
                star.alphaDirection *= -1;
            }
        }
        ctx.globalAlpha = star.alpha;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw shooting star
      if (shootingStar) {
        ctx.globalAlpha = shootingStar.alpha;
        const gradient = ctx.createLinearGradient(shootingStar.x, shootingStar.y, shootingStar.x - shootingStar.length, shootingStar.y + shootingStar.length);
        gradient.addColorStop(0, 'white');
        gradient.addColorStop(1, 'transparent');
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(shootingStar.x, shootingStar.y);
        ctx.lineTo(shootingStar.x - shootingStar.length, shootingStar.y + shootingStar.length);
        ctx.stroke();

        shootingStar.x -= shootingStar.speed;
        shootingStar.y += shootingStar.speed;
        shootingStar.alpha -= 0.015;

        if (shootingStar.alpha <= 0) {
            shootingStar = null;
        }
      }


      ctx.globalAlpha = 1;
      animationFrameId.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [createStars, prefersReducedMotion]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full -z-10" />;
}
