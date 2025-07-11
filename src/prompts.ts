import { securityGuidelines } from './security';
import { accessibilityGuidelines } from './a11y';

export function getPrompt(code: string, mode: 'security' | 'a11y' = 'security'): string {
  const guidelines = mode === 'security' ? securityGuidelines : accessibilityGuidelines;

  return `
You are a static analysis tool. Review the following ${mode === 'security' ? 'JavaScript for security' : 'HTML/CSS for accessibility'} issues.

Guidelines:
${guidelines}

Respond ONLY with a JSON array of objects in the form:
[
  {
    "id": "xss-001",
    "message": "Potential XSS vulnerability with innerHTML assignment",
    "severity": "Warning",
    "line": 14
  },
  ...
]

Code to audit:
\`\`\`
${code}
\`\`\`
  `.trim();
}


export function parseResponse(text: string): {
  id: string;
  message: string;
  severity: 'Error' | 'Warning' | 'Information';
  line: number;
}[] {
  try {
    return JSON.parse(text);
  } catch (e) {
    console.error('Failed to parse LLM response:', text);
    return [];
  }
}
