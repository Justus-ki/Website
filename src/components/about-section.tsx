import Image from 'next/image';
import { Card, CardContent } from './ui/card';

export function AboutSection() {
  return (
    <section id="about">
      <Card className="overflow-hidden bg-card/50">
        <div className="grid md:grid-cols-2">
          <div className="flex flex-col justify-center p-6 text-center md:p-8">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              About Me
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Hey everyone! I'm ClashPro, a passionate Clash Royale player and content creator. I've been playing since the game's launch and love sharing my knowledge, strategies, and epic battles with the community. My goal is to help you climb the ladder, master new decks, and have fun with Clash Royale!
            </p>
            <p className="mt-4 text-lg text-muted-foreground">
              Join me on my journey to become the best, and let's conquer the arena together. Don't forget to follow me on my socials to stay updated!
            </p>
          </div>
          <div className="relative min-h-[300px] md:min-h-full">
            <Image
              src="https://placehold.co/600x600.png"
              alt="ClashPro"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover grayscale-[50%] contrast-125"
              data-ai-hint="portrait person"
            />
          </div>
        </div>
      </Card>
    </section>
  );
}
