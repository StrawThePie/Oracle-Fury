export type ModuleManifest = {
    id: string;
    version: string;
    engineVersion: string;
    capabilities: string[];
};
export declare class ModuleRegistry {
    private manifests;
    registerManifest(manifest: ModuleManifest): void;
    getManifest(id: string): ModuleManifest | undefined;
}
export declare function loadManifestFromFile(path: string): ModuleManifest;
