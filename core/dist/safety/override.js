function fnv1a64Hex(input) {
    let h1 = 0xcbf29ce4 ^ 0xffffffff;
    let h2 = 0x84222325 ^ 0xffffffff;
    for (let i = 0; i < input.length; i++) {
        const c = input.charCodeAt(i);
        h1 ^= c & 0xff;
        h1 = Math.imul(h1, 0x1000000 + 0x93);
        h2 ^= (c >>> 8) & 0xff;
        h2 = Math.imul(h2, 0x1000000 + 0x93);
    }
    // Combine and convert to hex
    const hi = (h1 ^ 0xffffffff) >>> 0;
    const lo = (h2 ^ 0xffffffff) >>> 0;
    return hi.toString(16).padStart(8, '0') + lo.toString(16).padStart(8, '0');
}
function uuid() {
    const u = globalThis.crypto?.randomUUID?.();
    if (u)
        return u;
    // Fallback pseudo-uuid
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}
export class OverrideLog {
    constructor() {
        this.entries = [];
    }
    getAll() {
        return [...this.entries];
    }
    append(actor, reason, scope) {
        const timestamp = Date.now();
        const id = uuid();
        const prevHash = this.entries.length ? this.entries[this.entries.length - 1].hash : 'GENESIS';
        const payload = `${id}|${timestamp}|${actor}|${reason}|${scope}|${prevHash}`;
        const hash = fnv1a64Hex(payload);
        const entry = { id, timestamp, actor, reason, scope, prevHash, hash };
        this.entries.push(entry);
        return entry;
    }
    verify() {
        let prev = 'GENESIS';
        for (const e of this.entries) {
            const payload = `${e.id}|${e.timestamp}|${e.actor}|${e.reason}|${e.scope}|${prev}`;
            const hash = fnv1a64Hex(payload);
            if (hash !== e.hash)
                return false;
            prev = e.hash;
        }
        return true;
    }
}
//# sourceMappingURL=override.js.map