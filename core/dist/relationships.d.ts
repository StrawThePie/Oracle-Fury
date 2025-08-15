export type Relationship = {
    characterA: string;
    characterB: string;
    heat: number;
    bond: number;
    tags: string[];
};
export declare function clampRel(value: number): number;
export declare function decayRelationship(rel: Relationship): Relationship;
export declare function updateRelationship(rel: Relationship, delta: {
    heat?: number;
    bond?: number;
    addTags?: string[];
    removeTags?: string[];
}): Relationship;
