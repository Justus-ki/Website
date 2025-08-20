import Image from 'next/image';
import type { Card } from '@/lib/types';
import { Droplet, XCircle } from 'lucide-react';

interface ClashCardProps {
  card: Card;
  onRemove?: () => void;
  canRemove?: boolean;
}

export function ClashCard({ card, onRemove, canRemove = false }: ClashCardProps) {
  return (
    <div className="group relative aspect-[3/4] w-full overflow-hidden rounded-md border-2 border-primary/20 shadow-sm transition-transform duration-200 hover:scale-105 hover:z-10">
      <Image
        src={card.iconUrl}
        alt={card.name}
        fill
        sizes="(max-width: 768px) 20vw, 10vw"
        className="object-cover"
        data-ai-hint="clash royale card"
      />
      
      {/* Elixir cost */}
      <div className="absolute top-1 left-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-pink-500 shadow-md">
        <span className="font-bold text-white text-sm">{card.elixir}</span>
        <Droplet className="absolute -z-10 h-8 w-8 text-pink-500/80" fill="currentColor" />
      </div>

      {/* Name banner */}
      <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/80 via-black/50 to-transparent p-4 pt-8 text-center">
        <p className="truncate text-xs font-semibold text-white drop-shadow-lg">{card.name}</p>
      </div>

      {/* Remove button */}
      {canRemove && onRemove && (
        <button
          onClick={onRemove}
          className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        >
          <XCircle className="h-8 w-8 text-white/70 transition-colors hover:text-white" />
        </button>
      )}
    </div>
  );
}
