export class FallbackLLM {
    async generate(prompt) {
        const summary = prompt.slice(0, 140).replace(/\s+/g, ' ').trim();
        return `Narration: ${summary}${summary.length === 140 ? '…' : ''}`;
    }
    async *stream(prompt) {
        const text = await this.generate(prompt);
        yield { text };
    }
}
//# sourceMappingURL=llmClient.js.map