'use client';

import { useGame } from '@/context/GameContext';
import { STAR_DATA } from '@/lib/data';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { useState } from 'react';
import { generateWallpaper } from '@/lib/wallpaper';
import SaveWallpaperDialog from './SaveWallpaperDialog';
import { RotateCcw, Download } from 'lucide-react';

export default function FinaleCard() {
  const { dispatch } = useGame();
  const [isGenerating, setIsGenerating] = useState(false);
  const [wallpaperUrl, setWallpaperUrl] = useState<string | null>(null);

  const handleReplay = () => {
    dispatch({ type: 'REPLAY' });
  };

  const handleSaveWallpaper = async () => {
    setIsGenerating(true);
    try {
      const url = await generateWallpaper();
      setWallpaperUrl(url);
    } catch (error) {
      console.error('Failed to generate wallpaper', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <div className="absolute z-20 flex items-center justify-center inset-0 bg-black/50 animate-fade-in">
        <Card className="w-[90%] max-w-md bg-card/80 backdrop-blur-xl border-primary/30 animate-slide-up">
          <CardHeader>
            <CardTitle className="text-glow text-center text-3xl">Aparanjitha</CardTitle>
            <CardDescription className="text-center text-accent/80 pt-2">
              The constellation is complete.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center text-lg">{STAR_DATA.finaleNote}</p>
          </CardContent>
          <CardFooter className="flex-col gap-4 sm:flex-row">
            <Button onClick={handleReplay} variant="outline" className="w-full">
              <RotateCcw className="mr-2" />
              Replay the stars
            </Button>
            <Button onClick={handleSaveWallpaper} disabled={isGenerating} className="w-full">
               <Download className="mr-2" />
              {isGenerating ? 'Creating magic...' : 'Save as wallpaper'}
            </Button>
          </CardFooter>
        </Card>
      </div>
      {wallpaperUrl && <SaveWallpaperDialog imageUrl={wallpaperUrl} onOpenChange={() => setWallpaperUrl(null)} />}
    </>
  );
}
