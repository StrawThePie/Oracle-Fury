export function clampRel(value) {
    return Math.max(-5, Math.min(5, value));
}
export function decayRelationship(rel) {
    const heat = rel.heat > 0 ? rel.heat - 1 : rel.heat < 0 ? rel.heat + 1 : 0;
    const bond = rel.bond > 0 ? rel.bond - 0.5 : rel.bond < 0 ? rel.bond + 0.5 : 0;
    return { ...rel, heat: clampRel(heat), bond: clampRel(bond) };
}
export function updateRelationship(rel, delta) {
    const heat = clampRel(rel.heat + (delta.heat ?? 0));
    const bond = clampRel(rel.bond + (delta.bond ?? 0));
    const add = new Set(delta.addTags ?? []);
    const remove = new Set(delta.removeTags ?? []);
    const tags = Array.from(new Set(rel.tags.filter((t) => !remove.has(t)).concat(Array.from(add))));
    return { ...rel, heat, bond, tags };
}
//# sourceMappingURL=relationships.js.map