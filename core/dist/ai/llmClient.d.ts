export type StreamChunk = {
    text: string;
};
export interface LLMClient {
    generate(prompt: string, options?: {
        stream?: boolean;
        seed?: number;
    }): Promise<string>;
    stream(prompt: string, options?: {
        seed?: number;
    }): AsyncIterable<StreamChunk>;
}
export declare class FallbackLLM implements LLMClient {
    generate(prompt: string): Promise<string>;
    stream(prompt: string): AsyncIterable<StreamChunk>;
}
