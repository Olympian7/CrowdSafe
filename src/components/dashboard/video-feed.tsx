import Image from 'next/image';
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
};

export function VideoFeed({ videoUrl }: VideoFeedProps) {
  const isLive = !videoUrl;

  return (
    <Card className="h-full">
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
      <CardContent>
        <div className="aspect-video overflow-hidden rounded-lg border">
          {videoUrl ? (
            <video
              src={videoUrl}
              autoPlay
              loop
              muted
              className="h-full w-full object-cover"
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
