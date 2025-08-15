import { SeededRandom } from '../rng';
export type Condition = {
    type: 'tag' | 'phase' | 'flag';
    value: string;
};
export type Effect = {
    type: 'flag';
    key: string;
    value: boolean;
} | {
    type: 'relationship';
    a: string;
    b: string;
    heat?: number;
    bond?: number;
};
export type EventEntry = {
    id: string;
    weight: number;
    conditions?: Condition[];
    effects?: Effect[];
    prompt: string;
};
export type EventTable = {
    id: string;
    events: EventEntry[];
};
export type SelectionTrace = {
    tableId: string;
    seed: number;
    considered: Array<{
        id: string;
        weight: number;
        passed: boolean;
        reasons: string[];
    }>;
    chosenId: string | null;
};
export declare function selectEvent(table: EventTable, context: {
    tags: Set<string>;
    phase: string;
    flags: Record<string, boolean>;
}, rng: SeededRandom): {
    event: EventEntry | null;
    trace: SelectionTrace;
};
export { loadEventTableFromString } from './loader';
