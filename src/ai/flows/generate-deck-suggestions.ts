// This file is machine-generated - edit at your own risk!

'use server';

/**
 * @fileOverview Generates Clash Royale deck suggestions based on recent Clash Royale videos.
 *
 * - generateDeckSuggestions - A function that generates deck suggestions.
 * - GenerateDeckSuggestionsInput - The input type for the generateDeckSuggestions function.
 * - GenerateDeckSuggestionsOutput - The return type for the generateDeckSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDeckSuggestionsInputSchema = z.object({
  recentVideoSummary: z.string().describe('A summary of recent Clash Royale videos, including popular strategies and card usage.'),
});
export type GenerateDeckSuggestionsInput = z.infer<typeof GenerateDeckSuggestionsInputSchema>;

const GenerateDeckSuggestionsOutputSchema = z.object({
  deckName: z.string().describe('The name of the suggested deck.'),
  cards: z.array(z.string()).describe('An array of cards in the suggested deck.'),
  overview: z.string().describe('A brief overview of the deck and its playstyle.'),
  pros: z.string().describe('The strengths of the deck.'),
  cons: z.string().describe('The weaknesses of the deck.'),
});
export type GenerateDeckSuggestionsOutput = z.infer<typeof GenerateDeckSuggestionsOutputSchema>;

export async function generateDeckSuggestions(input: GenerateDeckSuggestionsInput): Promise<GenerateDeckSuggestionsOutput> {
  return generateDeckSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDeckSuggestionsPrompt',
  input: {schema: GenerateDeckSuggestionsInputSchema},
  output: {schema: GenerateDeckSuggestionsOutputSchema},
  prompt: `You are an expert Clash Royale deck builder. Based on the following summary of recent Clash Royale videos, suggest an original and effective deck.

Summary: {{{recentVideoSummary}}}

Consider the current game meta and popular strategies when creating the deck. Provide a deck name, a list of cards, an overview of the deck and its playstyle, the strengths of the deck, and the weaknesses of the deck.

Output should be formatted as JSON:
{
  "deckName": "",
  "cards": ["", "", "", "", "", "", "", ""],
  "overview": "",
  "pros": "",
  "cons": ""
}
`,
});

const generateDeckSuggestionsFlow = ai.defineFlow(
  {
    name: 'generateDeckSuggestionsFlow',
    inputSchema: GenerateDeckSuggestionsInputSchema,
    outputSchema: GenerateDeckSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
