import { SeededRandom } from './rng';
export type DiceRoll = {
    expression: string;
    total: number;
    rolls: number[];
    modifier: number;
};
export declare function rollDice(expression: string, rng: SeededRandom): DiceRoll;
