export type SafetyPolicy = {
    age: 'teen' | 'mature' | 'adult-only';
    consent: 'implied' | 'explicit' | 'none';
    violence: 'low' | 'moderate' | 'high';
    protectedTags: string[];
};
export type SafetyVerdict = {
    allowed: boolean;
    blockedCategories: string[];
    redactions: string[];
};
export declare function checkSafety(text: string, policy: SafetyPolicy): SafetyVerdict;
export declare function redact(text: string, redactions: string[]): string;
