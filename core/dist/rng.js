function mulberry32(seed) {
    let t = seed >>> 0;
    return function random() {
        t += 0x6D2B79F5;
        let r = Math.imul(t ^ (t >>> 15), 1 | t);
        r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
        return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
}
export class SeededRandom {
    constructor(seed) {
        this.next = mulberry32(seed);
    }
    static fromString(seedString) {
        let h = 2166136261 >>> 0;
        for (let i = 0; i < seedString.length; i++) {
            h ^= seedString.charCodeAt(i);
            h = Math.imul(h, 16777619);
        }
        return new SeededRandom(h >>> 0);
    }
    static derive(baseSeed, ...parts) {
        let h = baseSeed >>> 0;
        for (const part of parts) {
            const s = String(part);
            for (let i = 0; i < s.length; i++) {
                h ^= s.charCodeAt(i);
                h = Math.imul(h, 16777619);
            }
            h ^= (h << 13) | (h >>> 19);
        }
        return new SeededRandom(h >>> 0);
    }
    random() {
        return this.next();
    }
    integer(minInclusive, maxInclusive) {
        const r = this.random();
        const min = Math.ceil(minInclusive);
        const max = Math.floor(maxInclusive);
        return Math.floor(r * (max - min + 1)) + min;
    }
    pickWeighted(items) {
        const total = items.reduce((acc, it) => acc + Math.max(0, it.weight), 0);
        if (total <= 0)
            return items[0].item;
        let roll = this.random() * total;
        for (const it of items) {
            const w = Math.max(0, it.weight);
            if (roll < w)
                return it.item;
            roll -= w;
        }
        return items[items.length - 1].item;
    }
}
//# sourceMappingURL=rng.js.map