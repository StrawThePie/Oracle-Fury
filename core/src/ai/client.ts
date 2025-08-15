export type StreamChunk = { text: string };

export interface LLMClient {
  generateStream(prompt: string, opts?: { seed?: number; maxTokens?: number }): AsyncIterable<StreamChunk>;
}

export class FallbackLLM implements LLMClient {
  async *generateStream(prompt: string, opts?: { seed?: number }): AsyncIterable<StreamChunk> {
    const intro = 'Narrator: ';
    yield { text: intro };
    const body = `A deterministic narration unfolds. Seed=${opts?.seed ?? 0}.`;
    yield { text: body };
  }
}