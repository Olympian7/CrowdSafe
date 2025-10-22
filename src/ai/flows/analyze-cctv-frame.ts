'use server';

/**
 * @fileOverview Analyzes a video frame from CCTV to count people and assess crowd density.
 *
 * - analyzeCctvFrame - A function that handles the frame analysis.
 * - AnalyzeCctvFrameInput - The input type for the analyzeCctvFrame function.
 * - AnalyzeCctvFrameOutput - The return type for the analyzeCctvFrame function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

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
  prompt: `You are a precision-focused AI surveillance system. Your critical task is to provide the most accurate count of individuals in the provided video frame.

Follow this exact procedure:
1.  **Systematic Scan:** Divide the image into a 3x3 grid. Analyze each quadrant meticulously, from top-left to bottom-right.
2.  **Identify and Tag:** For each quadrant, identify every individual. Mentally tag each person to avoid double-counting.
3.  **Handle Obstructions:** If a person is partially obstructed, in poor lighting, or in a dense group, make a confident estimation. If you can identify a head and torso, count it as one person. Do not count individuals you cannot reasonably confirm.
4.  **Aggregate Count:** Sum the counts from all nine quadrants to get a total number.
5.  **Verification:** Before finalizing, perform a quick, full-image scan to ensure your aggregated count is logical and you haven't missed any obvious individuals.

Your final output for 'peopleCount' must be the most accurate integer count possible based on this rigorous process.

After determining the precise people count, use the provided thresholds to determine the density level:
- Normal: Less than the medium threshold.
- Caution: Between medium and high thresholds.
- Warning: Between high and critical thresholds.
- Critical: Above the critical threshold.

Thresholds:
- Medium: {{{thresholds.medium}}}
- High: {{{thresholds.high}}}
- Critical: {{{thresholds.critical}}}

Finally, generate a concise, one-sentence alert message that is appropriate for the determined density level and the exact people count.

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
