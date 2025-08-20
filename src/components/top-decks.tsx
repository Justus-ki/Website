import { topDecks } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ClashCard } from './clash-card';

export function TopDecks() {
  return (
    <section id="decks">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
          Top Decks
        </h2>
        <p className="mt-3 text-lg text-muted-foreground">
          My curated list of powerful decks to dominate the meta.
        </p>
      </div>
      <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {topDecks.map((deck) => (
          <Card key={deck.name} className="flex flex-col transition-all duration-300 hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-1">
            <CardHeader>
              <CardTitle className="text-xl text-primary">{deck.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="grid grid-cols-4 gap-2">
                {deck.cards.map((card) => (
                  <ClashCard key={card.name} card={card} />
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
