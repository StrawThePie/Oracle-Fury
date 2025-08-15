import { describe, expect, it } from 'vitest';
import { logit, resolveProbability, sigmoid } from '../src/resolution/resolution';

describe('resolution', () => {
	it('sigmoid/logit roundtrip', () => {
		const p = 0.7;
		const x = logit(p);
		const p2 = sigmoid(x);
		expect(Math.abs(p - p2)).toBeLessThan(1e-12);
	});

	it('weights increase probability', () => {
		const res = resolveProbability(0.5, [
			{ label: 'advantage', weight: 1 },
		]);
		expect(res.adjustedProbability).toBeGreaterThan(0.5);
	});

	it('weights decrease probability', () => {
		const res = resolveProbability(0.5, [
			{ label: 'disadvantage', weight: -1 },
		]);
		expect(res.adjustedProbability).toBeLessThan(0.5);
	});
});