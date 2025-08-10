'use server';

/**
 * @fileOverview A contextual hint AI agent. Provides helpful and encouraging messages during constellation construction.
 *
 * - getHint - A function that generates a hint message.
 * - HintInput - The input type for the getHint function.
 * - HintOutput - The return type for the getHint function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const HintInputSchema = z.object({
  isCorrect: z.boolean().describe('Whether the user tapped the correct star.'),
  currentLetterIndex: z.number().describe('The index of the current letter.'),
  currentStarIndex: z.number().describe('The index of the current star within the letter.'),
  totalStarsInLetter: z.number().describe('The total number of stars in the current letter.'),
});
export type HintInput = z.infer<typeof HintInputSchema>;

const HintOutputSchema = z.object({
  hint: z.string().describe('A helpful and encouraging hint message for the user.'),
});
export type HintOutput = z.infer<typeof HintOutputSchema>;

export async function getHint(input: HintInput): Promise<HintOutput> {
  return hintFlow(input);
}

const hintPrompt = ai.definePrompt({
  name: 'hintPrompt',
  input: {schema: HintInputSchema},
  output: {schema: HintOutputSchema},
  prompt: `You are a helpful assistant guiding a user through a star constellation game.

  The user is currently on letter index {{{currentLetterIndex}}} and star index {{{currentStarIndex}}}.
  There are {{{totalStarsInLetter}}} stars in the current letter.

  Generate a short, encouraging, and helpful hint message based on whether the user tapped the correct star.

  {% if isCorrect %}
  The user tapped the correct star. Congratulate them and provide encouragement for the next star.
  {% else %}
  The user tapped the wrong star. Gently guide them towards the correct star without explicitly revealing its position. Remind them to look for the glowing star.
  {% endif %}

  Keep the message concise and friendly.
  `,
});

const hintFlow = ai.defineFlow(
  {
    name: 'hintFlow',
    inputSchema: HintInputSchema,
    outputSchema: HintOutputSchema,
  },
  async input => {
    const {output} = await hintPrompt(input);
    return output!;
  }
);
