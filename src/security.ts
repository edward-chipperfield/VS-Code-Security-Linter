export const securityGuidelines = `
SECURITY GUIDELINES

1. Avoid using \`innerHTML\` for inserting untrusted content into the DOM.
2. Do not use \`eval()\`, \`Function()\`, or similar dynamic execution methods.
3. Always validate and sanitize user inputs both on client and server.
4. Implement CSRF protection on state-changing HTTP requests.
5. Never hardcode secrets, API keys, or credentials in frontend code.
6. Prefer strict CSP headers to mitigate XSS attacks.
7. Use HTTPS exclusively and ensure secure cookies are enabled.
`;
