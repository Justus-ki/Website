"use client";

import { useState, useMemo, type DragEvent } from 'react';
import { Card as CardComponent, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { clashRoyaleCards } from '@/lib/data';
import type { Card } from '@/lib/types';
import { Droplet, PencilRuler, PlusCircle, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { ClashCard } from './clash-card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

type SortCriteria = 'elixir' | 'alphabetic' | 'release';
type SortDirection = 'asc' | 'desc';

export function SimpleDeckEditor() {
  const [deck, setDeck] = useState<(Card | null)[]>(Array(8).fill(null));
  const [draggedCard, setDraggedCard] = useState<Card | null>(null);
  const [sortCriteria, setSortCriteria] = useState<SortCriteria>('elixir');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const addCardToDeck = (card: Card) => {
    if (!deck.some(c => c?.name === card.name)) {
      const emptyIndex = deck.findIndex(c => c === null);
      if (emptyIndex !== -1) {
        const newDeck = [...deck];
        newDeck[emptyIndex] = card;
        setDeck(newDeck);
      }
    }
  };

  const removeCardFromDeck = (index: number) => {
    const newDeck = [...deck];
    newDeck[index] = null;
    setDeck(newDeck);
  };

  const clearDeck = () => {
    setDeck(Array(8).fill(null));
  };
  
  const deckCards = useMemo(() => deck.filter((c): c is Card => c !== null), [deck]);
  
  const sortedCards = useMemo(() => {
    return [...clashRoyaleCards].sort((a, b) => {
      let comparison = 0;
      if (sortCriteria === 'elixir') {
        comparison = a.elixir - b.elixir;
      } else if (sortCriteria === 'alphabetic') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortCriteria === 'release') {
        comparison = a.releaseOrder - b.releaseOrder;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [sortCriteria, sortDirection]);

  const toggleSortDirection = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  }

  const averageElixir = useMemo(() => {
    if (deckCards.length === 0) return 0;
    const totalElixir = deckCards.reduce((sum, card) => sum + card.elixir, 0);
    return (totalElixir / deckCards.length).toFixed(1);
  }, [deckCards]);

  const handleDragStart = (e: DragEvent<HTMLDivElement>, card: Card) => {
    setDraggedCard(card);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    if (draggedCard && !deck.some(c => c?.name === draggedCard.name)) {
      const newDeck = [...deck];
      newDeck[index] = draggedCard;
      setDeck(newDeck);
    }
    setDraggedCard(null);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <section id="deck-editor">
      <CardComponent className="bg-card/50">
        <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex items-center justify-center rounded-full bg-primary/10 p-3">
                <PencilRuler className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-3xl font-bold tracking-tight md:text-4xl">
                Simple Deck Editor
            </CardTitle>
            <CardDescription className="mt-3 text-lg">
                Drag and drop cards to build your deck.
            </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-8 md:grid-cols-2">
          <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Available Cards</h3>
                <div className="flex items-center gap-2">
                  <Select value={sortCriteria} onValueChange={(value: SortCriteria) => setSortCriteria(value)}>
                      <SelectTrigger className="w-[140px]">
                          <SelectValue placeholder="Sort by..." />
                      </SelectTrigger>
                      <SelectContent>
                          <SelectItem value="elixir">Elixir</SelectItem>
                          <SelectItem value="alphabetic">Alphabetic</SelectItem>
                          <SelectItem value="release">Release</SelectItem>
                      </SelectContent>
                  </Select>
                   <Button variant="outline" size="icon" onClick={toggleSortDirection}>
                    {sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                   </Button>
                </div>
            </div>
            <ScrollArea className="h-[450px] pr-4">
              <div className="grid grid-cols-4 gap-2">
                {sortedCards.map(card => (
                   <div
                    key={card.name}
                    draggable
                    onDragStart={(e) => handleDragStart(e, card)}
                    className={`cursor-grab ${deck.some(c => c?.name === card.name) ? 'opacity-50' : ''}`}
                   >
                    <ClashCard card={card} onRemove={() => addCardToDeck(card)} canRemove={false}/>
                   </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          <div className="flex flex-col">
            <h3 className="mb-4 text-xl font-semibold">Your Deck</h3>
            <CardComponent className="flex-grow bg-background">
                <CardContent className="p-4 space-y-4">
                    <div className="grid grid-cols-4 gap-2">
                        {deck.map((card, i) => (
                           <div 
                            key={i}
                            onDrop={(e) => handleDrop(e, i)}
                            onDragOver={handleDragOver}
                            className="aspect-[3/4] rounded-md bg-muted/50 flex items-center justify-center"
                           >
                            {card ? (
                                <ClashCard card={card} onRemove={() => removeCardFromDeck(i)} canRemove={true}/>
                            ) : (
                                <PlusCircle className="h-8 w-8 text-muted-foreground" />
                            )}
                           </div>
                        ))}
                    </div>

                    {deckCards.length > 0 && (
                        <div className="pt-4">
                            <h4 className="font-semibold text-lg mb-2">Deck Stats</h4>
                             <div className="flex items-center space-x-4 text-lg">
                                <div className="flex items-center">
                                    <Droplet className="h-5 w-5 mr-2 text-primary" />
                                    <span>Avg. Elixir:</span>
                                    <span className="font-bold ml-2 text-primary">{averageElixir}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </CardComponent>
             <Button onClick={clearDeck} variant="destructive" className="mt-4 w-full" disabled={deckCards.length === 0}>
                <Trash2 className="mr-2 h-4 w-4" /> Clear Deck
            </Button>
          </div>
        </CardContent>
      </CardComponent>
    </section>
  );
}
