"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import {
  generateDeckSuggestions,
  type GenerateDeckSuggestionsOutput,
} from '@/ai/flows/generate-deck-suggestions';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Button } from './ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { Textarea } from './ui/textarea';
import { Loader2, Sparkles, ThumbsDown, ThumbsUp } from 'lucide-react';
import { AiDeckCard } from './ai-deck-card';

const formSchema = z.object({
  recentVideoSummary: z
    .string()
    .min(50, {
      message: 'Summary must be at least 50 characters long.',
    })
    .max(1000, {
      message: 'Summary must be less than 1000 characters.',
    }),
});

export function DeckAiGenerator() {
  const [generatedDeck, setGeneratedDeck] =
    useState<GenerateDeckSuggestionsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      recentVideoSummary: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setGeneratedDeck(null);
    try {
      const result = await generateDeckSuggestions(values);
      setGeneratedDeck(result);
    } catch (error) {
      console.error('Error generating deck:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to generate deck suggestion. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section id="ai-generator">
      <Card className="bg-card/50">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex items-center justify-center rounded-full bg-primary/10 p-3">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight md:text-4xl">
            AI Deck Generator
          </CardTitle>
          <CardDescription className="mt-3 text-lg">
            Generate a fresh deck based on the latest meta trends.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-8 md:grid-cols-2">
          <div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="recentVideoSummary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg">
                        Recent Video Summary
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., 'Recent videos show a rise in cheap cycle decks. Hog rider and goblin barrel are very popular. Many players are using inferno tower to counter golem and lava hound...'"
                          className="min-h-[150px] font-code"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Describe the current meta or strategies you've seen. The more detail, the better the suggestion!
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Deck
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </div>

          <div className="flex items-center justify-center">
            {isLoading && (
              <div className="text-center">
                <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
                <p className="mt-4 text-muted-foreground">
                  The AI is thinking...
                </p>
              </div>
            )}
            {generatedDeck && (
              <Card className="w-full animate-fade-in bg-background">
                <CardHeader>
                  <CardTitle className="text-2xl text-primary">
                    {generatedDeck.deckName}
                  </CardTitle>
                  <CardDescription>
                    {generatedDeck.overview}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="mb-2 font-semibold">Cards</h4>
                    <div className="grid grid-cols-4 gap-2">
                      {generatedDeck.cards.map((card) => (
                        <AiDeckCard key={card} name={card} />
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="mb-2 flex items-center gap-2 font-semibold text-green-500">
                      <ThumbsUp className="h-5 w-5" /> Pros
                    </h4>
                    <p className="text-sm text-muted-foreground">{generatedDeck.pros}</p>
                  </div>
                   <div>
                    <h4 className="mb-2 flex items-center gap-2 font-semibold text-red-500">
                      <ThumbsDown className="h-5 w-5" /> Cons
                    </h4>
                    <p className="text-sm text-muted-foreground">{generatedDeck.cons}</p>
                  </div>
                </CardContent>
              </Card>
            )}
            {!isLoading && !generatedDeck && (
              <div className="text-center text-muted-foreground">
                <p>Your generated deck will appear here.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
