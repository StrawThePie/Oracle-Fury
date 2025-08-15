import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import YAML from 'yaml';
import { SeededRandom } from '../rng/SeededRandom';

export type EventEntry = {
  id: string;
  weight?: number;
  conditions?: Array<{ type: 'tag' | 'phase' | 'flag'; key: string; op?: 'eq' | 'neq'; value?: any }>;
  effects?: Array<{ type: 'state' | 'relationship' | 'inventory' | 'flag'; path?: string; key?: string; value?: any; delta?: number }>;
  prompt?: string;
  tags?: string[];
};

export type EventTable = {
  id: string;
  entries: EventEntry[];
};

export type WorldState = {
  phase: string;
  tags: Record<string, boolean>;
  flags: Record<string, any>;
  relationships: Record<string, { bond: number; heat: number }>;
  inventory: Record<string, number>;
};

export type SelectionTrace = {
  tableId: string;
  candidates: Array<{ id: string; weight: number; passed: boolean }>;
  pickedId: string | null;
};

export function createValidator(schema: object) {
  const ajv = new Ajv({ allErrors: true, strict: false });
  addFormats(ajv);
  return ajv.compile(schema);
}

export function parseEventTable(input: string | object): EventTable {
  const obj = typeof input === 'string' ? (input.trim().startsWith('{') ? JSON.parse(input) : YAML.parse(input)) : input;
  if (!obj || typeof obj !== 'object') throw new Error('Invalid event table input');
  return obj as EventTable;
}

export function evaluateConditions(entry: EventEntry, state: WorldState): boolean {
  if (!entry.conditions || entry.conditions.length === 0) return true;
  return entry.conditions.every((c) => {
    if (c.type === 'phase') return (c.op === 'neq') ? state.phase !== c.key : state.phase === c.key;
    if (c.type === 'tag') return !!state.tags[c.key] === (c.op === 'neq' ? false : true);
    if (c.type === 'flag') {
      const v = state.flags[c.key];
      return c.op === 'neq' ? v !== c.value : v === c.value;
    }
    return true;
  });
}

export function applyEffects(entry: EventEntry, state: WorldState): WorldState {
  if (!entry.effects) return state;
  const next = { ...state, flags: { ...state.flags }, inventory: { ...state.inventory }, relationships: { ...state.relationships } };
  for (const e of entry.effects) {
    if (e.type === 'state' && e.path) {
      (next as any)[e.path] = e.value;
    } else if (e.type === 'flag' && e.key) {
      next.flags[e.key] = e.value;
    } else if (e.type === 'inventory' && e.key) {
      next.inventory[e.key] = (next.inventory[e.key] ?? 0) + (e.delta ?? 0);
    } else if (e.type === 'relationship' && e.key && typeof e.value === 'object') {
      const cur = next.relationships[e.key] ?? { bond: 0, heat: 0 };
      next.relationships[e.key] = {
        bond: Math.max(-5, Math.min(5, (cur.bond ?? 0) + (e.value.bond ?? 0))),
        heat: Math.max(-5, Math.min(5, (cur.heat ?? 0) + (e.value.heat ?? 0)))
      };
    }
  }
  return next;
}

export function selectEvent(table: EventTable, state: WorldState, rng: SeededRandom): { entry: EventEntry | null; trace: SelectionTrace } {
  const candidates = table.entries.map((e) => ({ id: e.id, weight: e.weight ?? 1, passed: evaluateConditions(e, state) }));
  const passed = candidates.filter((c) => c.passed);
  let pickedId: string | null = null;
  if (passed.length > 0) {
    const picked = rng.pickWeighted(passed.map((p) => ({ item: p, weight: p.weight })));
    pickedId = picked.id;
  }
  const entry = pickedId ? table.entries.find((e) => e.id === pickedId) ?? null : null;
  return { entry, trace: { tableId: table.id, candidates, pickedId } };
}