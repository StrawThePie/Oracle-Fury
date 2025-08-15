import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
export class ModuleRegistry {
    constructor() {
        this.manifests = new Map();
    }
    registerManifest(manifest) {
        if (this.manifests.has(manifest.id))
            throw new Error(`Duplicate module id: ${manifest.id}`);
        this.manifests.set(manifest.id, manifest);
    }
    getManifest(id) {
        return this.manifests.get(id);
    }
}
export function loadManifestFromFile(path) {
    const full = resolve(path);
    const content = readFileSync(full, 'utf-8');
    const manifest = JSON.parse(content);
    if (!manifest.id || !manifest.version || !manifest.engineVersion) {
        throw new Error('Invalid module manifest');
    }
    return manifest;
}
//# sourceMappingURL=index.js.map