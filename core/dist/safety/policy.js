export function checkSafety(text, policy) {
    const blocked = [];
    const redactions = [];
    const lower = text.toLowerCase();
    if (policy.age !== 'adult-only') {
        if (lower.includes('explicit sexual'))
            blocked.push('age');
    }
    if (policy.consent === 'explicit') {
        if (lower.includes('non-consensual'))
            blocked.push('consent');
    }
    if (policy.violence === 'low') {
        if (lower.includes('gore'))
            redactions.push('gore');
    }
    for (const tag of policy.protectedTags) {
        if (lower.includes(tag.toLowerCase()))
            redactions.push(`protected:${tag}`);
    }
    const allowed = blocked.length === 0;
    return { allowed, blockedCategories: blocked, redactions };
}
export function redact(text, redactions) {
    let out = text;
    for (const r of redactions) {
        const key = r.startsWith('protected:') ? r.split(':')[1] : r;
        const re = new RegExp(key, 'ig');
        out = out.replace(re, '[REDACTED]');
    }
    return out;
}
//# sourceMappingURL=policy.js.map