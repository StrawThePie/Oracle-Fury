export function rollDice(expression, rng) {
    const match = expression.trim().match(/^(\d+)[dD](\d+)([+-]\d+)?$/);
    if (!match)
        throw new Error(`Invalid dice expression: ${expression}`);
    const count = parseInt(match[1], 10);
    const sides = parseInt(match[2], 10);
    const mod = match[3] ? parseInt(match[3], 10) : 0;
    const rolls = [];
    for (let i = 0; i < count; i++) {
        rolls.push(rng.integer(1, sides));
    }
    const total = rolls.reduce((a, b) => a + b, 0) + mod;
    return { expression, total, rolls, modifier: mod };
}
//# sourceMappingURL=dice.js.map