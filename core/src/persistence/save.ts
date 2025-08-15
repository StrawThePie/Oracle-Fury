export type SaveGame = {
  version: number;
  seed: number | string;
  state: any;
  history: Array<{ choice: string; meta?: any }>;
};

export interface SaveAdapter {
  load(id: string): Promise<SaveGame | null>;
  save(id: string, data: SaveGame): Promise<void>;
  delete(id: string): Promise<void>;
}

export class LocalStorageAdapter implements SaveAdapter {
  async load(id: string): Promise<SaveGame | null> {
    if (typeof window === 'undefined') return null;
    const raw = window.localStorage.getItem(id);
    return raw ? (JSON.parse(raw) as SaveGame) : null;
  }
  async save(id: string, data: SaveGame): Promise<void> {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(id, JSON.stringify(data));
  }
  async delete(id: string): Promise<void> {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem(id);
  }
}

export type Migration = {
  from: number;
  to: number;
  migrate: (data: SaveGame) => SaveGame;
};

const registry: Migration[] = [];

export function registerMigration(m: Migration) {
  registry.push(m);
}

export function runMigrations(data: SaveGame): SaveGame {
  let current = data;
  let progressed = true;
  while (progressed) {
    progressed = false;
    for (const m of registry) {
      if (current.version === m.from) {
        current = m.migrate(current);
        current.version = m.to;
        progressed = true;
      }
    }
  }
  return current;
}

export function deterministicReplay(seed: number | string, history: SaveGame['history']): SaveGame['state'] {
  // Placeholder: in full impl, re-apply choices to reconstruct state deterministically
  return { seed, steps: history.length } as any;
}