import { describe, it, expect } from 'vitest';
import { SeededRandom } from '../src/rng';
import { loadEventTableFromString, selectEvent } from '../src/dsl';

describe('DSL selection', () => {
  const yaml = `
- id: a
  weight: 1
  prompt: A
- id: b
  weight: 3
  prompt: B
`;
  const table = loadEventTableFromString('t', yaml, 'yaml');

  it('validates and selects weighted entries deterministically', () => {
    const rng = new SeededRandom(7);
    const rolls = Array.from({ length: 5 }, () => selectEvent(table, { tags: new Set(), phase: 'Camp', flags: {} }, rng).event?.id);
    expect(rolls).toEqual(['a', 'a', 'b', 'b', 'b']);
  });

  it('filters by phase/tag/flag conditions', () => {
    const yaml2 = `
- id: c
  weight: 1
  prompt: C
  conditions:
    - { type: phase, value: Camp }
    - { type: tag, value: ready }
    - { type: flag, value: open }
`;
    const table2 = loadEventTableFromString('t2', yaml2, 'yaml');
    const rng = new SeededRandom(1);
    const none = selectEvent(table2, { tags: new Set(), phase: 'Base', flags: {} }, rng).event;
    expect(none).toBeNull();
    const ok = selectEvent(table2, { tags: new Set(['ready']), phase: 'Camp', flags: { open: true } }, rng).event;
    expect(ok?.id).toBe('c');
  });
});