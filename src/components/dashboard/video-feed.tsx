import Image from 'next/image';
import { useRef, useEffect, RefObject } from 'react';
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
  videoRef: RefObject<HTMLVideoElement>;
};

export function VideoFeed({ videoUrl, onAnalyze, videoRef }: VideoFeedProps) {
  const isLive = !videoUrl;
  const hasAnalyzed = useRef(false);

  useEffect(() => {
    // Reset analysis state when videoUrl changes
    hasAnalyzed.current = false;
  }, [videoUrl]);

  const handleCanPlay = () => {
    const videoElement = videoRef.current;
    if (videoElement && !hasAnalyzed.current && videoElement.readyState >= 2) { // HAVE_CURRENT_DATA
      hasAnalyzed.current = true;
      
      const canvas = document.createElement('canvas');
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Seek to beginning to capture the first frame
        videoElement.currentTime = 0;
        setTimeout(() => {
            ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
            const dataUrl = canvas.toDataURL('image/jpeg');
            onAnalyze(dataUrl);
        }, 100); // Small delay to ensure frame is drawn
      }
    }
  };

  const showVideoPlayer = videoUrl || videoRef.current?.srcObject;

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
          <video
            ref={videoRef}
            src={videoUrl ?? undefined}
            loop={!!videoUrl} // Only loop uploaded videos
            muted
            autoPlay={!!videoUrl} // Only autoplay uploaded videos
            controls
            className="h-full w-full object-cover"
            crossOrigin="anonymous"
            onLoadedData={videoUrl ? handleCanPlay : undefined}
            style={{ display: showVideoPlayer ? 'block' : 'none' }}
           />
          {!showVideoPlayer && videoFeedImage && (
            <Image
              src={videoFeedImage.imageUrl}
              alt={videoFeedImage.description}
              width={1280}
              height={720}
              data-ai-hint={videoFeedImage.imageHint}
              className="h-full w-full object-cover"
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
