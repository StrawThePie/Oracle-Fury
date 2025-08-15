import { describe, it, expect } from 'vitest';
import { MigrationRegistry } from '../src/persistence';
describe('Persistence migrations', () => {
    it('applies sequential migrations to reach current version', () => {
        const reg = new MigrationRegistry();
        reg.register({ from: 0, to: 1, run: (data) => ({ ...data, version: 1 }) });
        reg.register({ from: 1, to: 2, run: (data) => ({ ...data, version: 2 }) });
        const save = { version: 0, seed: 1, state: {}, choices: [] };
        const out = reg.runAll(save, 2);
        expect(out.version).toBe(2);
    });
});
//# sourceMappingURL=persistence.test.js.map