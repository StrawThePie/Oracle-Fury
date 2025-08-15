import { describe, it, expect } from 'vitest';
import { SeededRandom } from '../src/rng';
describe('SeededRandom', () => {
    it('is deterministic for same seed', () => {
        const a = new SeededRandom(42);
        const b = new SeededRandom(42);
        const seqA = Array.from({ length: 5 }, () => a.random());
        const seqB = Array.from({ length: 5 }, () => b.random());
        expect(seqA).toEqual(seqB);
    });
    it('derive creates different streams', () => {
        const base = 123;
        const r1 = SeededRandom.derive(base, 'x');
        const r2 = SeededRandom.derive(base, 'y');
        expect(r1.random()).not.toEqual(r2.random());
    });
});
//# sourceMappingURL=rng.test.js.map