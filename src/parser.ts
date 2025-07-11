export function parseCode(text: string, language: string): string[] {
  return text.split(/(?<=\n)/).reduce((chunks, line) => {
    const last = chunks[chunks.length - 1];
    if (last && last.length < 600) {
      chunks[chunks.length - 1] += line;
    } else {
      chunks.push(line);
    }
    return chunks;
  }, [] as string[]);
}
