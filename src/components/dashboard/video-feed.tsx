import Image from 'next/image';
import { useRef, useState } from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

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
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalysisClick = () => {
    if (videoRef.current) {
      setIsAnalyzing(true);
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        onAnalyze(dataUrl);
      }
      setIsAnalyzing(false);
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
              autoPlay
              loop
              muted
              className="h-full w-full object-cover"
              crossOrigin="anonymous"
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
      {!isLive && (
        <CardFooter>
          <Button
            onClick={handleAnalysisClick}
            disabled={isAnalyzing}
            className="w-full"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            {isAnalyzing ? 'Analyzing...' : 'Analyze Crowd'}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
