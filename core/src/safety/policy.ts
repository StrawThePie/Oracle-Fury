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

export function checkSafety(text: string, policy: SafetyPolicy): SafetyVerdict {
  const blocked: string[] = [];
  const redactions: string[] = [];

  const lower = text.toLowerCase();
  if (policy.age !== 'adult-only') {
    if (lower.includes('explicit sexual')) blocked.push('age');
  }
  if (policy.consent === 'explicit') {
    if (lower.includes('non-consensual')) blocked.push('consent');
  }
  if (policy.violence === 'low') {
    if (lower.includes('gore')) redactions.push('gore');
  }
  for (const tag of policy.protectedTags) {
    if (lower.includes(tag.toLowerCase())) redactions.push(`protected:${tag}`);
  }

  const allowed = blocked.length === 0;
  return { allowed, blockedCategories: blocked, redactions };
}

export function redact(text: string, redactions: string[]): string {
  let out = text;
  for (const r of redactions) {
    const key = r.startsWith('protected:') ? r.split(':')[1] : r;
    const re = new RegExp(key, 'ig');
    out = out.replace(re, '[REDACTED]');
  }
  return out;
}