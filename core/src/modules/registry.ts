import Ajv from 'ajv';
import addFormats from 'ajv-formats';

export type ModuleManifest = {
  id: string;
  version: string;
  engineVersion: string;
  capabilities?: string[];
};

export type ModuleContent = {
  manifest: ModuleManifest;
  events?: any[];
  factions?: any[];
  npcs?: any[];
  locations?: any[];
};

const modules = new Map<string, ModuleContent>();

export function validateManifest(manifest: ModuleManifest): { valid: boolean; errors?: string[] } {
  const ajv = new Ajv({ allErrors: true, strict: false });
  addFormats(ajv);
  const schema = {
    type: 'object',
    required: ['id', 'version', 'engineVersion'],
    properties: {
      id: { type: 'string', pattern: '^[a-z0-9-]+$' },
      version: { type: 'string' },
      engineVersion: { type: 'string' },
      capabilities: { type: 'array', items: { type: 'string' } }
    }
  } as const;
  const validate = ajv.compile(schema);
  const ok = validate(manifest);
  return { valid: !!ok, errors: validate.errors?.map((e) => `${e.instancePath} ${e.message}`) };
}

export function registerModule(content: ModuleContent) {
  const v = validateManifest(content.manifest);
  if (!v.valid) throw new Error(`Invalid manifest: ${v.errors?.join(', ')}`);
  modules.set(content.manifest.id, content);
}

export function getModule(id: string): ModuleContent | undefined {
  return modules.get(id);
}