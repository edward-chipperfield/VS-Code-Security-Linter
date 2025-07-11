import { getPrompt, parseResponse } from './prompts';
import { parseCode } from './parser';
import { sendToLLM } from './llm-api';
import * as vscode from 'vscode';

export async function auditActiveFile(document: vscode.TextDocument) {
  const text = document.getText();
  const language = document.languageId;

  console.log(`Auditing file: ${document.fileName}`);
  console.log(`Language detected: ${language}`);

  const codeChunks = parseCode(text, language);
  const results = [];

  for (const chunk of codeChunks) {
    const mode = language === 'html' || language === 'css' ? 'a11y' : 'security';
const prompt = getPrompt(chunk, mode);

    console.log(`Prompt:\n${prompt}`);

    const response = await sendToLLM(prompt);
    console.log(`Raw LLM response:\n${response}`);

    const issues = parseResponse(response);
    console.log(`Parsed issues:\n`, issues);

    results.push(...issues.map((i: any) => ({ ...i, file: document.fileName })));
  }

  return results;
}
