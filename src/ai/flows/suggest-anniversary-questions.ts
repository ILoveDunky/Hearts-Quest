// src/ai/flows/suggest-anniversary-questions.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow to suggest additional anniversary question topics using GenAI.
 *
 * - suggestAnniversaryQuestions - A function that returns suggested question topics.
 * - SuggestAnniversaryQuestionsInput - The input type for the suggestAnniversaryQuestions function (empty object).
 * - SuggestAnniversaryQuestionsOutput - The return type for the suggestAnniversaryQuestions function (list of question topics).
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestAnniversaryQuestionsInputSchema = z.object({});
export type SuggestAnniversaryQuestionsInput = z.infer<typeof SuggestAnniversaryQuestionsInputSchema>;

const SuggestAnniversaryQuestionsOutputSchema = z.object({
  questionTopics: z.array(
    z.object({
      topic: z.string().describe('A topic for an anniversary question.'),
      description: z.string().describe('A brief description of the question topic.'),
    })
  ).describe('A list of suggested question topics suitable for an anniversary scavenger hunt.')
});
export type SuggestAnniversaryQuestionsOutput = z.infer<typeof SuggestAnniversaryQuestionsOutputSchema>;

export async function suggestAnniversaryQuestions(
  input: SuggestAnniversaryQuestionsInput
): Promise<SuggestAnniversaryQuestionsOutput> {
  return suggestAnniversaryQuestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestAnniversaryQuestionsPrompt',
  input: {schema: SuggestAnniversaryQuestionsInputSchema},
  output: {schema: SuggestAnniversaryQuestionsOutputSchema},
  prompt: `You are a creative assistant helping to generate ideas for an anniversary scavenger hunt.

  Suggest question topics that are personalized and suitable for a couple celebrating their anniversary. 
  The question topics should be specific, unique to the relationship, and engaging. Provide a brief description for each topic.

  Format the output as a JSON object with a "questionTopics" field. Each item in the array should have a "topic" and a "description" field.
  `,
});

const suggestAnniversaryQuestionsFlow = ai.defineFlow(
  {
    name: 'suggestAnniversaryQuestionsFlow',
    inputSchema: SuggestAnniversaryQuestionsInputSchema,
    outputSchema: SuggestAnniversaryQuestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
