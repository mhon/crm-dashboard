import { generateText, generateObject } from 'ai';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { z } from 'zod';

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

const model = openrouter('openai/gpt-4o-mini');

/**
 * Generate a lead score based on lead data and history.
 */
export async function generateLeadScore(leadData: Record<string, any>) {
  const { object } = await generateObject({
    model,
    system: 'You are an expert sales AI assistant. Analyze the provided lead data and score the lead from 0 to 100 based on likelihood to convert. Provide a brief explanation for your score.',
    prompt: `Lead Data: ${JSON.stringify(leadData)}`,
    schema: z.object({
      score: z.number().min(0).max(100),
      explanation: z.string(),
    }),
  });

  return object;
}

/**
 * Draft an email to a lead or customer.
 */
export async function draftEmail(context: { recipientName: string; purpose: string; additionalInfo?: string }) {
  const { text } = await generateText({
    model,
    system: 'You are an expert sales representative. Draft a professional, engaging, and concise email based on the prompt. Only output the email body and subject line (format: "Subject: [subject]\n\n[body]"). Do not include placeholders like "[Your Name]".',
    prompt: `Recipient: ${context.recipientName}\nPurpose: ${context.purpose}\nAdditional Info: ${context.additionalInfo || 'None'}`,
  });

  return text;
}

/**
 * Summarize meeting notes.
 */
export async function summarizeMeeting(meetingNotes: string) {
  const { text } = await generateText({
    model,
    system: 'You are an expert executive assistant. Summarize the following meeting notes into key takeaways and action items. Be extremely concise and use markdown formatting.',
    prompt: `Meeting Notes:\n${meetingNotes}`,
  });

  return text;
}
