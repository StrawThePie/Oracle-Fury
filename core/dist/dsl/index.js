export function selectEvent(table, context, rng) {
    const eligible = table.events.map((e) => {
        const reasons = [];
        let passed = true;
        if (e.conditions) {
            for (const c of e.conditions) {
                if (c.type === 'tag' && !context.tags.has(c.value)) {
                    passed = false;
                    reasons.push(`missing-tag:${c.value}`);
                }
                if (c.type === 'phase' && context.phase !== c.value) {
                    passed = false;
                    reasons.push(`wrong-phase:${c.value}`);
                }
                if (c.type === 'flag' && context.flags[c.value] !== true) {
                    passed = false;
                    reasons.push(`flag-not-set:${c.value}`);
                }
            }
        }
        return { e, passed, reasons };
    });
    const candidates = eligible.filter((x) => x.passed).map((x) => ({ item: x.e, weight: x.e.weight }));
    const chosen = candidates.length > 0 ? rng.pickWeighted(candidates) : null;
    const trace = {
        tableId: table.id,
        seed: 0,
        considered: eligible.map((x) => ({ id: x.e.id, weight: x.e.weight, passed: x.passed, reasons: x.reasons })),
        chosenId: chosen ? chosen.id : null
    };
    return { event: chosen, trace };
}
export { loadEventTableFromString } from './loader';
//# sourceMappingURL=index.js.map