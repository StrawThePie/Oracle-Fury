import { SeededRandom } from '../rng';

export type Condition = {
  type: 'tag' | 'phase' | 'flag';
  value: string;
};

export type Effect =
  | { type: 'flag'; key: string; value: boolean }
  | { type: 'relationship'; a: string; b: string; heat?: number; bond?: number };

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
  considered: Array<{ id: string; weight: number; passed: boolean; reasons: string[] }>;
  chosenId: string | null;
};

export function selectEvent(
  table: EventTable,
  context: { tags: Set<string>; phase: string; flags: Record<string, boolean> },
  rng: SeededRandom
): { event: EventEntry | null; trace: SelectionTrace } {
  const eligible = table.events.map((e) => {
    const reasons: string[] = [];
    let passed = true;
    if (e.conditions) {
      for (const c of e.conditions) {
        if (c.type === 'tag' && !context.tags.has(c.value)) {
          passed = false;
          reasons.push(`missing-tag:${c.value}`);
        }
        if (c.type === 'phase' && context.phase !== c.value) {
          passed = false;
          reasons.push(`wrong-phase:${c.value}`);
        }
        if (c.type === 'flag' && context.flags[c.value] !== true) {
          passed = false;
          reasons.push(`flag-not-set:${c.value}`);
        }
      }
    }
    return { e, passed, reasons };
  });

  const candidates = eligible.filter((x) => x.passed).map((x) => ({ item: x.e, weight: x.e.weight }));
  const chosen = candidates.length > 0 ? rng.pickWeighted(candidates) : null;

  const trace: SelectionTrace = {
    tableId: table.id,
    seed: 0,
    considered: eligible.map((x) => ({ id: x.e.id, weight: x.e.weight, passed: x.passed, reasons: x.reasons })),
    chosenId: chosen ? chosen.id : null
  };
  return { event: chosen, trace };
}

export { loadEventTableFromString } from './loader';