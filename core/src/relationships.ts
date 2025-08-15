export type Relationship = {
  characterA: string;
  characterB: string;
  heat: number; // [-5, +5]
  bond: number; // [-5, +5]
  tags: string[];
};

export function clampRel(value: number): number {
  return Math.max(-5, Math.min(5, value));
}

export function decayRelationship(rel: Relationship): Relationship {
  const heat = rel.heat > 0 ? rel.heat - 1 : rel.heat < 0 ? rel.heat + 1 : 0;
  const bond = rel.bond > 0 ? rel.bond - 0.5 : rel.bond < 0 ? rel.bond + 0.5 : 0;
  return { ...rel, heat: clampRel(heat), bond: clampRel(bond) };
}

export function updateRelationship(
  rel: Relationship,
  delta: { heat?: number; bond?: number; addTags?: string[]; removeTags?: string[] }
): Relationship {
  const heat = clampRel(rel.heat + (delta.heat ?? 0));
  const bond = clampRel(rel.bond + (delta.bond ?? 0));
  const add = new Set(delta.addTags ?? []);
  const remove = new Set(delta.removeTags ?? []);
  const tags = Array.from(new Set(rel.tags.filter((t) => !remove.has(t)).concat(Array.from(add))));
  return { ...rel, heat, bond, tags };
}