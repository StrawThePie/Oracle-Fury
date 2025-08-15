export class SeededRandom {
  private state: number;

  constructor(seed: number | string) {
    this.state = SeededRandom.seedToUint32(seed);
  }

  static seedToUint32(seed: number | string): number {
    if (typeof seed === 'number') return seed >>> 0;
    let h = 1779033703 ^ seed.length;
    for (let i = 0; i < seed.length; i++) {
      h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
      h = (h << 13) | (h >>> 19);
    }
    return (h >>> 0) || 1;
  }

  static derive(seed: number | string, ...parts: Array<number | string>): SeededRandom {
    let acc = SeededRandom.seedToUint32(seed);
    for (const p of parts) {
      const mix = SeededRandom.seedToUint32(String(p));
      acc ^= mix + 0x9e3779b9 + ((acc << 6) >>> 0) + (acc >>> 2);
      acc >>>= 0;
    }
    return new SeededRandom(acc);
  }

  // Mulberry32
  private nextUint32(): number {
    let t = (this.state += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return (t ^ (t >>> 14)) >>> 0;
  }

  next(): number {
    return this.nextUint32() / 2 ** 32;
  }

  int(minInclusive: number, maxInclusive: number): number {
    const r = this.next();
    return Math.floor(r * (maxInclusive - minInclusive + 1)) + minInclusive;
  }

  pickWeighted<T>(items: Array<{ item: T; weight: number }>): T {
    const total = items.reduce((a, b) => a + Math.max(0, b.weight), 0);
    if (total <= 0) return items[0]!.item;
    let roll = this.next() * total;
    for (const { item, weight } of items) {
      const w = Math.max(0, weight);
      if (roll < w) return item;
      roll -= w;
    }
    return items[items.length - 1]!.item;
  }
}