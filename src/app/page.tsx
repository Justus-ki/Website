import { AboutSection } from '@/components/about-section';
import { DeckAiGenerator } from '@/components/deck-ai-generator';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { LiveChat } from '@/components/live-chat';
import { SimpleDeckEditor } from '@/components/simple-deck-editor';
import { TopDecks } from '@/components/top-decks';
import { VideoSpotlight } from '@/components/video-spotlight';
import { Separator } from '@/components/ui/separator';

export default function Home() {
  return (
    <>
      <Header />
      <main className="container mx-auto flex-grow px-4 py-8 md:py-12">
        <div className="space-y-16 md:space-y-24">
          <VideoSpotlight />
          <LiveChat />
          <AboutSection />
          <TopDecks />
          <Separator />
          <SimpleDeckEditor />
          <Separator />
          <DeckAiGenerator />
        </div>
      </main>
      <Footer />
    </>
  );
}
