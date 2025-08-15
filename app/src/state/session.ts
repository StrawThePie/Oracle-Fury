import { create } from 'zustand';
import { SeededRandom } from '@oracle-fury/core';

export type RollTrace = {
  label: string;
  detail: string;
};

export type SessionState = {
  seed: number;
  rng: SeededRandom;
  logs: string[];
  traces: RollTrace[];
  flags: Record<string, boolean>;
  phase: 'Hyperspace' | 'Camp' | 'Base';
  setPhase: (p: SessionState['phase']) => void;
  log: (line: string) => void;
  addTrace: (t: RollTrace) => void;
  toggleFlag: (k: string, v?: boolean) => void;
  reset: (seed: number) => void;
};

export const useSession = create<SessionState>((set, get) => ({
  seed: 123456,
  rng: new SeededRandom(123456),
  logs: [],
  traces: [],
  flags: {},
  phase: 'Camp',
  setPhase: (p) => set({ phase: p }),
  log: (line) => set({ logs: [...get().logs, line] }),
  addTrace: (t) => set({ traces: [...get().traces, t] }),
  toggleFlag: (k, v) => set({ flags: { ...get().flags, [k]: v ?? !get().flags[k] } }),
  reset: (seed) => set({ seed, rng: new SeededRandom(seed), logs: [], traces: [], flags: {}, phase: 'Camp' })
}));