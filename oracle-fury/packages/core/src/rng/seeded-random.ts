/**
 * Seeded Random Number Generator using splitmix32 algorithm
 * Provides deterministic random number generation for game reproducibility
 */
export class SeededRandom {
  private seed: number;

  constructor(seed: string | number) {
    this.seed = typeof seed === 'string' ? this.hashString(seed) : seed;
  }

  /**
   * Hash a string into a 32-bit integer seed
   */
  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  /**
   * Core splitmix32 algorithm
   */
  private splitmix32(): number {
    this.seed |= 0;
    this.seed = this.seed + 0x9e3779b9 | 0;
    let t = this.seed ^ (this.seed >>> 16);
    t = Math.imul(t, 0x85ebca6b);
    t = t ^ (t >>> 13);
    t = Math.imul(t, 0xc2b2ae35);
    return ((t ^ (t >>> 16)) >>> 0) / 4294967296;
  }

  /**
   * Get next random float [0, 1)
   */
  next(): number {
    return this.splitmix32();
  }

  /**
   * Get random integer in range [min, max]
   */
  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  /**
   * Get random float in range [min, max)
   */
  nextFloat(min: number, max: number): number {
    return this.next() * (max - min) + min;
  }

  /**
   * Get random boolean with optional probability
   */
  nextBool(probability = 0.5): boolean {
    return this.next() < probability;
  }

  /**
   * Pick random element from array
   */
  pick<T>(array: T[]): T | undefined {
    if (array.length === 0) return undefined;
    return array[this.nextInt(0, array.length - 1)];
  }

  /**
   * Pick multiple random elements from array (without replacement)
   */
  pickMultiple<T>(array: T[], count: number): T[] {
    const shuffled = this.shuffle([...array]);
    return shuffled.slice(0, Math.min(count, array.length));
  }

  /**
   * Shuffle array in place using Fisher-Yates
   */
  shuffle<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = this.nextInt(0, i);
      [array[i], array[j]] = [array[j]!, array[i]!];
    }
    return array;
  }

  /**
   * Pick weighted random element
   */
  pickWeighted<T>(items: Array<{ item: T; weight: number }>): T | undefined {
    if (items.length === 0) return undefined;
    
    const totalWeight = items.reduce((sum, { weight }) => sum + weight, 0);
    if (totalWeight <= 0) return items[0]?.item;
    
    let random = this.next() * totalWeight;
    
    for (const { item, weight } of items) {
      random -= weight;
      if (random < 0) return item;
    }
    
    return items[items.length - 1]?.item;
  }

  /**
   * Generate normal distribution using Box-Muller transform
   */
  nextGaussian(mean = 0, stdDev = 1): number {
    const u1 = this.next();
    const u2 = this.next();
    const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    return z0 * stdDev + mean;
  }

  /**
   * Create a derived RNG with combined seed
   */
  derive(...parts: (string | number)[]): SeededRandom {
    const combinedSeed = [this.seed, ...parts].join(':');
    return new SeededRandom(combinedSeed);
  }

  /**
   * Get current seed value
   */
  getSeed(): number {
    return this.seed;
  }

  /**
   * Reset to a new seed
   */
  reset(seed: string | number): void {
    this.seed = typeof seed === 'string' ? this.hashString(seed) : seed;
  }

  /**
   * Clone the RNG with current state
   */
  clone(): SeededRandom {
    const cloned = new SeededRandom(0);
    cloned.seed = this.seed;
    return cloned;
  }
}