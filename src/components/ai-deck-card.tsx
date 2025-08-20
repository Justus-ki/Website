import { clashRoyaleCards } from '@/lib/data';
import { ClashCard } from './clash-card';

export function AiDeckCard({ name }: { name: string }) {
  const card = clashRoyaleCards.find(
    (c) => c.name.toLowerCase() === name.toLowerCase()
  );

  if (!card) {
    return (
      <div className="relative aspect-[3/4] overflow-hidden rounded-md border-2 border-destructive/50 shadow-sm bg-muted/50 flex items-center justify-center">
        <p className="p-2 text-center text-xs text-destructive-foreground">{name}</p>
      </div>
    );
  }

  return <ClashCard card={card} />;
}
