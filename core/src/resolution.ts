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

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function logit(p: number): number {
  const clamped = clamp(p, 1e-6, 1 - 1e-6);
  return Math.log(clamped / (1 - clamped));
}

function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x));
}

export function resolveProbability(
  baseProbability: number,
  modifiers: ModifierTrace[]
): { success: boolean; probability: number; trace: ResolutionTrace } {
  const weighted = modifiers.reduce((acc, m) => acc + m.weight, logit(baseProbability));
  const p = clamp(sigmoid(weighted), 0, 1);
  const success = p >= 0.5;
  return {
    success,
    probability: p,
    trace: {
      baseProbability,
      finalProbability: p,
      modifiers: [...modifiers]
    }
  };
}