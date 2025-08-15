export class MigrationRegistry {
    constructor() {
        this.migrations = [];
    }
    register(m) {
        this.migrations.push(m);
    }
    runAll(save, currentVersion) {
        let cur = { ...save };
        while (cur.version < currentVersion) {
            const mig = this.migrations.find((m) => m.from === cur.version && m.to === cur.version + 1);
            if (!mig)
                break;
            cur = mig.run(cur);
        }
        return cur;
    }
}
export class LocalStorageAdapter {
    async load(key) {
        if (typeof window === 'undefined')
            return null;
        return window.localStorage.getItem(key);
    }
    async save(key, data) {
        if (typeof window === 'undefined')
            return;
        window.localStorage.setItem(key, data);
    }
}
export async function exportToFile(data, filename) {
    return new Blob([data], { type: 'application/json' });
}
//# sourceMappingURL=index.js.map