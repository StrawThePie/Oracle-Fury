export type SaveGame = {
    version: number;
    seed: number;
    state: unknown;
    choices: Array<{
        id: string;
        value: string | number | boolean;
    }>;
};
export type Migration = {
    from: number;
    to: number;
    run: (data: SaveGame) => SaveGame;
};
export declare class MigrationRegistry {
    private migrations;
    register(m: Migration): void;
    runAll(save: SaveGame, currentVersion: number): SaveGame;
}
export interface StorageAdapter {
    load(key: string): Promise<string | null>;
    save(key: string, data: string): Promise<void>;
}
export declare class LocalStorageAdapter implements StorageAdapter {
    load(key: string): Promise<string | null>;
    save(key: string, data: string): Promise<void>;
}
export declare function exportToFile(data: string, filename: string): Promise<Blob>;
