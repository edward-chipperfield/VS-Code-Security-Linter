import OpenAI from 'openai';
import { config } from 'dotenv';
import { getPrompt } from './getPrompt';
config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function sendToLLM(code: string): Promise<string> {
  const prompt = getPrompt(code);

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0,
  });

  const result = response.choices[0].message?.content ?? '';
  console.log("Raw LLM output:", result);
  return result;
}
