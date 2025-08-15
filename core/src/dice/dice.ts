import { SeededRandom } from '../rng/SeededRandom';

export type DiceRoll = {
  formula: string;
  rolls: number[];
  modifier: number;
  total: number;
};

export function rollDice(formula: string, rng: SeededRandom): DiceRoll {
  const match = formula.trim().match(/^(\d+)[dD](\d+)([+-]\d+)?$/);
  if (!match) throw new Error(`Invalid dice formula: ${formula}`);
  const num = parseInt(match[1]!, 10);
  const sides = parseInt(match[2]!, 10);
  const mod = match[3] ? parseInt(match[3], 10) : 0;
  const rolls: number[] = [];
  for (let i = 0; i < num; i++) {
    rolls.push(rng.int(1, sides));
  }
  const total = rolls.reduce((a, b) => a + b, 0) + mod;
  return { formula, rolls, modifier: mod, total };
}