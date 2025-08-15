export type StreamChunk = { text: string };

export interface LLMClient {
  generate(prompt: string, options?: { stream?: boolean; seed?: number }): Promise<string>;
  stream(prompt: string, options?: { seed?: number }): AsyncIterable<StreamChunk>;
}

export class FallbackLLM implements LLMClient {
  async generate(prompt: string): Promise<string> {
    const summary = prompt.slice(0, 140).replace(/\s+/g, ' ').trim();
    return `Narration: ${summary}${summary.length === 140 ? '…' : ''}`;
  }

  async *stream(prompt: string): AsyncIterable<StreamChunk> {
    const text = await this.generate(prompt);
    yield { text };
  }
}