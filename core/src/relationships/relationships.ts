export type Relationship = {
  characterA: string;
  characterB: string;
  bond: number; // [-5, +5]
  heat: number; // [-5, +5]
};

export function clampRelationshipValue(v: number): number {
  return Math.max(-5, Math.min(5, Math.round(v)));
}

export function decayRelationship(rel: Relationship): Relationship {
  const decayedBond = rel.bond > 0 ? rel.bond - 1 : rel.bond < 0 ? rel.bond + 1 : 0;
  const decayedHeat = rel.heat > 0 ? rel.heat - 1 : rel.heat < 0 ? rel.heat + 1 : 0;
  return { ...rel, bond: clampRelationshipValue(decayedBond), heat: clampRelationshipValue(decayedHeat) };
}

export function updateRelationship(
  rel: Relationship,
  delta: { bond?: number; heat?: number }
): Relationship {
  return {
    ...rel,
    bond: clampRelationshipValue(rel.bond + (delta.bond ?? 0)),
    heat: clampRelationshipValue(rel.heat + (delta.heat ?? 0))
  };
}