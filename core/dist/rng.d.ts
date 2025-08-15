export type Seed = number;
export declare class SeededRandom {
    private readonly next;
    constructor(seed: Seed);
    static fromString(seedString: string): SeededRandom;
    static derive(baseSeed: Seed, ...parts: Array<string | number>): SeededRandom;
    random(): number;
    integer(minInclusive: number, maxInclusive: number): number;
    pickWeighted<T>(items: Array<{
        item: T;
        weight: number;
    }>): T;
}
