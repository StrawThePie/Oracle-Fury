import { describe, it, expect } from 'vitest';
import { SeededRandom } from './seeded-random';

describe('SeededRandom', () => {
  it('should produce deterministic results with same seed', () => {
    const rng1 = new SeededRandom('test-seed');
    const rng2 = new SeededRandom('test-seed');

    expect(rng1.next()).toBe(rng2.next());
    expect(rng1.next()).toBe(rng2.next());
    expect(rng1.nextInt(1, 100)).toBe(rng2.nextInt(1, 100));
  });

  it('should produce different results with different seeds', () => {
    const rng1 = new SeededRandom('seed1');
    const rng2 = new SeededRandom('seed2');

    expect(rng1.next()).not.toBe(rng2.next());
  });

  it('should handle numeric seeds', () => {
    const rng = new SeededRandom(12345);
    const value = rng.next();
    
    expect(value).toBeGreaterThanOrEqual(0);
    expect(value).toBeLessThan(1);
  });

  it('should generate integers within range', () => {
    const rng = new SeededRandom('test');
    
    for (let i = 0; i < 100; i++) {
      const value = rng.nextInt(5, 10);
      expect(value).toBeGreaterThanOrEqual(5);
      expect(value).toBeLessThanOrEqual(10);
    }
  });

  it('should pick weighted items correctly', () => {
    const rng = new SeededRandom('test');
    const items = [
      { item: 'common', weight: 80 },
      { item: 'rare', weight: 20 },
    ];

    const results = { common: 0, rare: 0 };
    for (let i = 0; i < 1000; i++) {
      const picked = rng.pickWeighted(items);
      if (picked === 'common') results.common++;
      else if (picked === 'rare') results.rare++;
    }

    // With these weights, common should appear roughly 80% of the time
    expect(results.common).toBeGreaterThan(700);
    expect(results.rare).toBeLessThan(300);
  });

  it('should derive consistent sub-generators', () => {
    const rng1 = new SeededRandom('base');
    const rng2 = new SeededRandom('base');

    const derived1 = rng1.derive('event', 1);
    const derived2 = rng2.derive('event', 1);

    expect(derived1.next()).toBe(derived2.next());
  });

  it('should shuffle arrays deterministically', () => {
    const rng1 = new SeededRandom('shuffle-test');
    const rng2 = new SeededRandom('shuffle-test');

    const arr1 = [1, 2, 3, 4, 5];
    const arr2 = [1, 2, 3, 4, 5];

    rng1.shuffle(arr1);
    rng2.shuffle(arr2);

    expect(arr1).toEqual(arr2);
    expect(arr1).not.toEqual([1, 2, 3, 4, 5]); // Should be shuffled
  });
});