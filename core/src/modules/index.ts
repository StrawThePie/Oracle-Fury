import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

export type ModuleManifest = {
  id: string;
  version: string;
  engineVersion: string;
  capabilities: string[];
};

export class ModuleRegistry {
  private manifests = new Map<string, ModuleManifest>();

  registerManifest(manifest: ModuleManifest): void {
    if (this.manifests.has(manifest.id)) throw new Error(`Duplicate module id: ${manifest.id}`);
    this.manifests.set(manifest.id, manifest);
  }

  getManifest(id: string): ModuleManifest | undefined {
    return this.manifests.get(id);
  }
}

export function loadManifestFromFile(path: string): ModuleManifest {
  const full = resolve(path);
  const content = readFileSync(full, 'utf-8');
  const manifest = JSON.parse(content) as ModuleManifest;
  if (!manifest.id || !manifest.version || !manifest.engineVersion) {
    throw new Error('Invalid module manifest');
  }
  return manifest;
}