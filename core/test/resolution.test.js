import { describe, it, expect } from 'vitest';
import { resolveProbability } from '../src/resolution';
describe('resolveProbability', () => {
    it('increases probability with positive weight', () => {
        const { probability } = resolveProbability(0.5, [{ id: 'w', label: 'w', weight: 1 }]);
        expect(probability).toBeGreaterThan(0.5);
    });
    it('decreases probability with negative weight', () => {
        const { probability } = resolveProbability(0.5, [{ id: 'w', label: 'w', weight: -1 }]);
        expect(probability).toBeLessThan(0.5);
    });
    it('clamps probability between 0 and 1', () => {
        const { probability: hi } = resolveProbability(0.01, [{ id: 'w', label: 'w', weight: 100 }]);
        const { probability: lo } = resolveProbability(0.99, [{ id: 'w', label: 'w', weight: -100 }]);
        expect(hi).toBeLessThanOrEqual(1);
        expect(lo).toBeGreaterThanOrEqual(0);
    });
});
//# sourceMappingURL=resolution.test.js.map