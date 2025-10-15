// analyze crowd video flow
'use server';

/**
 * @fileOverview Analyzes a video frame to estimate crowd density.
 *
 * - analyzeCrowdVideo - A function that handles the crowd analysis.
 * - AnalyzeCrowdVideoInput - The input type for the analyzeCrowdVideo function.
 * - AnalyzeCrowdVideoOutput - The return type for the analyzeCrowdVideo function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeCrowdVideoInputSchema = z.object({
  videoFrame: z
    .string()
    .describe(
      "A single frame from a video, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeCrowdVideoInput = z.infer<typeof AnalyzeCrowdVideoInputSchema>;

const AnalyzeCrowdVideoOutputSchema = z.object({
  peopleCount: z.number().describe('The approximate number of people in the frame.'),
  estimatedArea: z.number().describe('The estimated area in square meters.'),
  analysis: z
    .string()
    .describe('A brief analysis of the crowd density and potential risks.'),
});
export type AnalyzeCrowdVideoOutput = z.infer<typeof AnalyzeCrowdVideoOutputSchema>;

export async function analyzeCrowdVideo(
  input: AnalyzeCrowdVideoInput
): Promise<AnalyzeCrowdVideoOutput> {
  return analyzeCrowdVideoFlow(input);
}

const analyzeCrowdVideoPrompt = ai.definePrompt({
  name: 'analyzeCrowdVideoPrompt',
  input: {schema: AnalyzeCrowdVideoInputSchema},
  output: {schema: AnalyzeCrowdVideoOutputSchema},
  prompt: `You are a security expert analyzing a video frame for crowd safety. Your task is to estimate the number of people, the area of the space they are in, and provide a brief analysis.

Analyze the image provided and respond with your estimations.

Image: {{media url=videoFrame}}`,
});

const analyzeCrowdVideoFlow = ai.defineFlow(
  {
    name: 'analyzeCrowdVideoFlow',
    inputSchema: AnalyzeCrowdVideoInputSchema,
    outputSchema: AnalyzeCrowdVideoOutputSchema,
  },
  async input => {
    const {output} = await analyzeCrowdVideoPrompt(input);
    return output!;
  }
);
