
'use client';

import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { PlayCircle, Loader2 } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import type { Video } from '@/lib/types';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useState, useEffect } from 'react';

const getYouTubeEmbedUrl = (url: string): string | null => {
  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);

  if (match && match[2].length === 11) {
    return `https://www.youtube.com/embed/${match[2]}?autoplay=1&rel=0`;
  } else {
    return null;
  }
};


export function VideoSpotlight() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'videos'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const videosData: Video[] = [];
        querySnapshot.forEach((doc) => {
          videosData.push({ id: doc.id, ...doc.data() } as Video);
        });
        setVideos(videosData);
        setIsLoading(false);
      },
      (error) => {
        console.error('Error fetching videos: ', error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const embedUrl = selectedVideo ? getYouTubeEmbedUrl(selectedVideo.videoUrl) : null;

  return (
    <>
    <section id="videos">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
          Latest Videos
        </h2>
        <p className="mt-3 text-lg text-muted-foreground">
          Check out my latest Clash Royale battles and strategies.
        </p>
      </div>
      <div className="mt-8">
        {isLoading ? (
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : videos.length > 0 ? (
          <Carousel
            opts={{
              align: 'start',
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {videos.map((video) => (
                <CarouselItem
                  key={video.id}
                  className="md:basis-1/2 lg:basis-1/4"
                >
                  <div className="p-1">
                    <button onClick={() => setSelectedVideo(video)} className="w-full text-left">
                      <Card className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-1">
                        <CardHeader className="p-0">
                          <div className="relative aspect-video">
                            <Image
                              src={video.thumbnailUrl}
                              alt={video.title}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                              className="object-cover transition-transform duration-300 group-hover:scale-105"
                              data-ai-hint="gameplay screenshot"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors duration-300 group-hover:bg-black/40">
                              <PlayCircle className="h-16 w-16 text-white/70 transition-all duration-300 group-hover:scale-110 group-hover:text-white" />
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="p-4">
                          <CardTitle className="line-clamp-2 text-base font-semibold leading-tight">
                            {video.title}
                          </CardTitle>
                        </CardContent>
                        <CardFooter className="p-4 pt-0">
                          <p className="text-sm text-muted-foreground">
                            by {video.creator}
                          </p>
                        </CardFooter>
                      </Card>
                    </button>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="ml-12" />
            <CarouselNext className="mr-12" />
          </Carousel>
        ) : (
          <p className="text-center text-muted-foreground">
            No videos have been added yet.
          </p>
        )}
      </div>
    </section>

    <Dialog open={!!selectedVideo} onOpenChange={(isOpen) => !isOpen && setSelectedVideo(null)}>
        <DialogContent className="max-w-4xl p-0 border-0">
            <DialogTitle className="sr-only">{selectedVideo?.title || 'Video Player'}</DialogTitle>
             {embedUrl && (
                <div className="aspect-video">
                    <iframe
                        src={embedUrl}
                        title={selectedVideo?.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                    ></iframe>
                </div>
            )}
        </DialogContent>
    </Dialog>
    </>
  );
}
