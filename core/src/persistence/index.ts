export type SaveGame = {
  version: number;
  seed: number;
  state: unknown;
  choices: Array<{ id: string; value: string | number | boolean }>;
};

export type Migration = {
  from: number;
  to: number;
  run: (data: SaveGame) => SaveGame;
};

export class MigrationRegistry {
  private migrations: Migration[] = [];

  register(m: Migration): void {
    this.migrations.push(m);
  }

  runAll(save: SaveGame, currentVersion: number): SaveGame {
    let cur = { ...save };
    while (cur.version < currentVersion) {
      const mig = this.migrations.find((m) => m.from === cur.version && m.to === cur.version + 1);
      if (!mig) break;
      cur = mig.run(cur);
    }
    return cur;
  }
}

export interface StorageAdapter {
  load(key: string): Promise<string | null>;
  save(key: string, data: string): Promise<void>;
}

export class LocalStorageAdapter implements StorageAdapter {
  async load(key: string): Promise<string | null> {
    if (typeof window === 'undefined') return null;
    return window.localStorage.getItem(key);
  }
  async save(key: string, data: string): Promise<void> {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(key, data);
  }
}

export async function exportToFile(data: string, filename: string): Promise<Blob> {
  return new Blob([data], { type: 'application/json' });
}