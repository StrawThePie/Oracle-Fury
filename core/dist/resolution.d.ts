export type ModifierTrace = {
    id: string;
    label: string;
    weight: number;
};
export type ResolutionTrace = {
    baseProbability: number;
    finalProbability: number;
    modifiers: ModifierTrace[];
};
export declare function resolveProbability(baseProbability: number, modifiers: ModifierTrace[]): {
    success: boolean;
    probability: number;
    trace: ResolutionTrace;
};
