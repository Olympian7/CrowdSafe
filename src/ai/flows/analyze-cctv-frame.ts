'use server';

/**
 * @fileOverview Analyzes a video frame from CCTV to count people and assess crowd density.
 *
 * - analyzeCctvFrame - A function that handles the frame analysis.
 * - AnalyzeCctvFrameInput - The input type for the analyzeCctvFrame function.
 * - AnalyzeCctvFrameOutput - The return type for the analyzeCctvFrame function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AnalyzeCctvFrameInputSchema = z.object({
  videoFrame: z
    .string()
    .describe(
      "A single frame from a video, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
    thresholds: z.object({
        medium: z.number(),
        high: z.number(),
        critical: z.number(),
    }).describe('The density thresholds for crowd levels.'),
});
export type AnalyzeCctvFrameInput = z.infer<typeof AnalyzeCctvFrameInputSchema>;

const AnalyzeCctvFrameOutputSchema = z.object({
  peopleCount: z.number().describe('The approximate number of people in the frame.'),
  densityLevel: z
    .string()
    .describe('The determined density level (e.g., Normal, Caution, Warning, Critical).'),
  alertMessage: z.string().describe('A concise alert message based on the density level.'),
});
export type AnalyzeCctvFrameOutput = z.infer<typeof AnalyzeCctvFrameOutputSchema>;

export async function analyzeCctvFrame(
  input: AnalyzeCctvFrameInput
): Promise<AnalyzeCctvFrameOutput> {
  return analyzeCctvFrameFlow(input);
}

const analyzeCctvFramePrompt = ai.definePrompt({
  name: 'analyzeCctvFramePrompt',
  input: { schema: AnalyzeCctvFrameInputSchema },
  output: { schema: AnalyzeCctvFrameOutputSchema },
  prompt: `You are a security AI analyzing a CCTV video frame. Your task is to count the people and determine the crowd density level.

Analyze the image provided. Count the number of people visible.

Based on the people count and the provided thresholds, determine the density level:
- Normal: Less than the medium threshold.
- Caution: Between medium and high thresholds.
- Warning: Between high and critical thresholds.
- Critical: Above the critical threshold.

Thresholds:
- Medium: {{{thresholds.medium}}}
- High: {{{thresholds.high}}}
- Critical: {{{thresholds.critical}}}

Finally, generate a short, one-sentence alert message appropriate for the determined density level.

Image: {{media url=videoFrame}}`,
});

const analyzeCctvFrameFlow = ai.defineFlow(
  {
    name: 'analyzeCctvFrameFlow',
    inputSchema: AnalyzeCctvFrameInputSchema,
    outputSchema: AnalyzeCctvFrameOutputSchema,
  },
  async input => {
    const { output } = await analyzeCctvFramePrompt(input);
    return output!;
  }
);
