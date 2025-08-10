'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import Image from 'next/image';

interface SaveWallpaperDialogProps {
  imageUrl: string;
  onOpenChange: (open: boolean) => void;
}

export default function SaveWallpaperDialog({ imageUrl, onOpenChange }: SaveWallpaperDialogProps) {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  return (
    <Dialog open={true} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-[90%] bg-card/80 backdrop-blur-xl border-primary/30">
        <DialogHeader>
          <DialogTitle>Your Starlight Wallpaper</DialogTitle>
          <DialogDescription>
            {isIOS
              ? 'Long-press the image and select "Add to Photos" to save.'
              : 'Right-click the image and select "Save Image As..." to download.'}
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 rounded-lg overflow-hidden border border-primary/20">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageUrl} alt="Generated starlight wallpaper" className="w-full h-auto" />
        </div>
      </DialogContent>
    </Dialog>
  );
}
