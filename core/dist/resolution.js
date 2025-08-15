function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}
function logit(p) {
    const clamped = clamp(p, 1e-6, 1 - 1e-6);
    return Math.log(clamped / (1 - clamped));
}
function sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
}
export function resolveProbability(baseProbability, modifiers) {
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
//# sourceMappingURL=resolution.js.map