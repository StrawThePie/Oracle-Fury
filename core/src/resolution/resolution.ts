export type ModifierTrace = {
  label: string;
  weight: number;
};

export type ResolutionTrace = {
  baseProbability: number;
  weights: ModifierTrace[];
  adjustedProbability: number;
};

export function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x));
}

export function logit(p: number): number {
  const clamped = Math.min(1 - 1e-9, Math.max(1e-9, p));
  return Math.log(clamped / (1 - clamped));
}

export function resolveProbability(baseProbability: number, modifiers: ModifierTrace[]): ResolutionTrace {
  const baseLogit = logit(baseProbability);
  const sumWeights = modifiers.reduce((sum, m) => sum + m.weight, 0);
  const adjusted = sigmoid(baseLogit + sumWeights);
  return {
    baseProbability,
    weights: modifiers.slice(),
    adjustedProbability: Math.min(1, Math.max(0, adjusted))
  };
}