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

export function VideoFeed() {
  if (!videoFeedImage) {
    return null;
  }
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Live Video Feed</CardTitle>
        <Badge variant="destructive" className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
          LIVE
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="aspect-video overflow-hidden rounded-lg border">
          <Image
            src={videoFeedImage.imageUrl}
            alt={videoFeedImage.description}
            width={1280}
            height={720}
            data-ai-hint={videoFeedImage.imageHint}
            className="h-full w-full object-cover"
          />
        </div>
      </CardContent>
    </Card>
  );
}
