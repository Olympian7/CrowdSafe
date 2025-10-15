import Image from 'next/image';
import { useRef, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Badge } from '@/components/ui/badge';

const videoFeedImage = PlaceHolderImages.find(
  img => img.id === 'video-feed-1'
);

type VideoFeedProps = {
  videoUrl: string | null;
  onAnalyze: (videoFrame: string) => void;
};

export function VideoFeed({ videoUrl, onAnalyze }: VideoFeedProps) {
  const isLive = !videoUrl;
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasAnalyzed = useRef(false);

  useEffect(() => {
    // Reset analysis state when videoUrl changes
    hasAnalyzed.current = false;
  }, [videoUrl]);

  const handleCanPlay = () => {
    if (videoRef.current && !hasAnalyzed.current) {
      hasAnalyzed.current = true;
      // Ensure video is seekable and has data
      if (videoRef.current.readyState >= 1) { // 1: HAVE_METADATA is enough
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL('image/jpeg');
          onAnalyze(dataUrl);
        }
      }
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{isLive ? 'Live Video Feed' : 'Uploaded Video'}</CardTitle>
        <Badge
          variant={isLive ? 'destructive' : 'secondary'}
          className="flex items-center gap-2"
        >
          {isLive && (
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
          )}
          {isLive ? 'LIVE' : 'ANALYSIS'}
        </Badge>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="aspect-video overflow-hidden rounded-lg border">
          {videoUrl ? (
            <video
              ref={videoRef}
              src={videoUrl}
              loop
              muted
              controls
              className="h-full w-full object-cover"
              crossOrigin="anonymous"
              onCanPlay={handleCanPlay}
            />
          ) : (
            videoFeedImage && (
              <Image
                src={videoFeedImage.imageUrl}
                alt={videoFeedImage.description}
                width={1280}
                height={720}
                data-ai-hint={videoFeedImage.imageHint}
                className="h-full w-full object-cover"
              />
            )
          )}
        </div>
      </CardContent>
    </Card>
  );
}
