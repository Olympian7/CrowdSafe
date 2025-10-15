'use server';

/**
 * @fileOverview Summarizes crowd behavior patterns based on object tracking data.
 *
 * - summarizeCrowdBehavior - A function that handles the summarization of crowd behavior.
 * - SummarizeCrowdBehaviorInput - The input type for the summarizeCrowdBehavior function.
 * - SummarizeCrowdBehaviorOutput - The return type for the summarizeCrowdBehavior function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeCrowdBehaviorInputSchema = z.object({
  objectTrackingData: z
    .string()
    .describe(
      'The object tracking data in JSON format.  Each object should have a unique ID, and timestamped location data.'
    ),
});
export type SummarizeCrowdBehaviorInput = z.infer<typeof SummarizeCrowdBehaviorInputSchema>;

const SummarizeCrowdBehaviorOutputSchema = z.object({
  summary: z.string().describe('A summary of crowd behavior patterns.'),
  riskAreas: z.array(z.string()).describe('Identified potential risk areas.'),
  commonMovementFlows: z.array(z.string()).describe('Common movement flows of the crowd.'),
});
export type SummarizeCrowdBehaviorOutput = z.infer<typeof SummarizeCrowdBehaviorOutputSchema>;

export async function summarizeCrowdBehavior(
  input: SummarizeCrowdBehaviorInput
): Promise<SummarizeCrowdBehaviorOutput> {
  return summarizeCrowdBehaviorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeCrowdBehaviorPrompt',
  input: {schema: SummarizeCrowdBehaviorInputSchema},
  output: {schema: SummarizeCrowdBehaviorOutputSchema},
  prompt: `You are an expert in crowd behavior analysis. Analyze the provided object tracking data to identify and summarize crowd behavior patterns, potential risk areas, and common movement flows.

Object Tracking Data: {{{objectTrackingData}}}

Respond using the output schema provided.  Be as concise as possible.`,
});

const summarizeCrowdBehaviorFlow = ai.defineFlow(
  {
    name: 'summarizeCrowdBehaviorFlow',
    inputSchema: SummarizeCrowdBehaviorInputSchema,
    outputSchema: SummarizeCrowdBehaviorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
