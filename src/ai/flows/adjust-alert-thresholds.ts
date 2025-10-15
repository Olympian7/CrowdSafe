// Adjust alert thresholds flow
'use server';

/**
 * @fileOverview Adjust alert thresholds flow that takes in a crowd density threshold from a slider,
 * uses it to determine the crowd status level, and then displays the appropriate alert.
 *
 * @ exported adjustAlertThresholds - A function that adjusts the alert thresholds.
 * @ exported AdjustAlertThresholdsInput - The input type for the adjustAlertThresholds function.
 * @ exported AdjustAlertThresholdsOutput - The return type for the adjustAlertThresholds function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AdjustAlertThresholdsInputSchema = z.object({
  crowdDensityThreshold: z
    .number()
    .describe(
      'The crowd density threshold adjusted by the user, ranging from 0 to 100.'
    ),
  currentCrowdDensity: z.number().describe('The current crowd density.'),
});
export type AdjustAlertThresholdsInput = z.infer<typeof AdjustAlertThresholdsInputSchema>;

const AdjustAlertThresholdsOutputSchema = z.object({
  alertMessage: z.string().describe('The alert message to display to the user.'),
  crowdStatusLevel: z
    .string()
    .describe(
      'The crowd status level based on the adjusted threshold (e.g., Normal, Caution, Warning, Critical)'
    ),
});
export type AdjustAlertThresholdsOutput = z.infer<typeof AdjustAlertThresholdsOutputSchema>;

export async function adjustAlertThresholds(
  input: AdjustAlertThresholdsInput
): Promise<AdjustAlertThresholdsOutput> {
  return adjustAlertThresholdsFlow(input);
}

const adjustAlertThresholdsPrompt = ai.definePrompt({
  name: 'adjustAlertThresholdsPrompt',
  input: {schema: AdjustAlertThresholdsInputSchema},
  output: {schema: AdjustAlertThresholdsOutputSchema},
  prompt: `You are a security system that analyzes crowd density and provides alerts based on a threshold set by the security operator.

You will receive the current crowd density and the crowd density threshold.

Based on these values, you will determine the crowd status level (Normal, Caution, Warning, or Critical) and generate an appropriate alert message.

Here are the crowd density levels based on the crowdDensityThreshold:
- Normal: currentCrowdDensity is below crowdDensityThreshold - 25
- Caution: currentCrowdDensity is between crowdDensityThreshold - 25 and crowdDensityThreshold
- Warning: currentCrowdDensity is between crowdDensityThreshold and crowdDensityThreshold + 25
- Critical: currentCrowdDensity is above crowdDensityThreshold + 25

Current Crowd Density: {{{currentCrowdDensity}}}
Crowd Density Threshold: {{{crowdDensityThreshold}}}

Based on the crowd status level, construct an alert message to display to the user.`,
});

const adjustAlertThresholdsFlow = ai.defineFlow(
  {
    name: 'adjustAlertThresholdsFlow',
    inputSchema: AdjustAlertThresholdsInputSchema,
    outputSchema: AdjustAlertThresholdsOutputSchema,
  },
  async input => {
    const {output} = await adjustAlertThresholdsPrompt(input);
    return output!;
  }
);
