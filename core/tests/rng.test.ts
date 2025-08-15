import { describe, expect, it } from 'vitest';
import { SeededRandom } from '../src/rng/SeededRandom';

describe('SeededRandom', () => {
	it('produces deterministic sequence for same seed', () => {
		const a = new SeededRandom(42);
		const b = new SeededRandom(42);
		const seqA = Array.from({ length: 5 }, () => a.next());
		const seqB = Array.from({ length: 5 }, () => b.next());
		expect(seqA).toEqual(seqB);
	});

	it('derive produces different sequences', () => {
		const base = 1337;
		const a = SeededRandom.derive(base, 'x');
		const b = SeededRandom.derive(base, 'y');
		expect(Array.from({ length: 3 }, () => a.next())).not.toEqual(
			Array.from({ length: 3 }, () => b.next()),
		);
	});
});