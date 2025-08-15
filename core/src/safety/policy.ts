export type SafetyPolicy = {
  blockedTags: string[];
  minAge: number;
  requireConsent: boolean;
  protectedTags: string[];
};

export type SafetyVerdict = {
  allowed: boolean;
  reasons: string[];
  redactions?: string[];
};

export const defaultPolicy: SafetyPolicy = {
  blockedTags: ['sexual-violence', 'torture'],
  minAge: 18,
  requireConsent: true,
  protectedTags: ['minor', 'protected-class']
};

export function prePromptGuardrails(prompt: string, policy: SafetyPolicy = defaultPolicy): { prompt: string; notes: string[] } {
  const notes: string[] = [];
  // Insert simple guardrails via system notes
  notes.push('Do not depict minors in adult contexts.');
  notes.push('Do not depict non-consensual acts.');
  notes.push('Avoid graphic violence.');
  return { prompt, notes };
}

export function postCheck(text: string, policy: SafetyPolicy = defaultPolicy): SafetyVerdict {
  const lower = text.toLowerCase();
  const reasons: string[] = [];
  const redactions: string[] = [];
  for (const tag of policy.blockedTags) {
    if (lower.includes(tag)) reasons.push(`blockedTag:${tag}`);
  }
  if (lower.includes('minor')) reasons.push('protected:minor');
  const allowed = reasons.length === 0;
  if (!allowed) {
    redactions.push('[content redacted due to safety policy]');
  }
  return { allowed, reasons, redactions: redactions.length ? redactions : undefined };
}

export type OverrideRecord = {
  id: string;
  timestamp: number;
  reason: string;
  scope: string;
  previousHash: string;
  hash: string;
};

export function hashChain(prev: string, record: Omit<OverrideRecord, 'hash'>): string {
  const data = `${prev}|${record.id}|${record.timestamp}|${record.reason}|${record.scope}|${record.previousHash}`;
  let h = 0;
  for (let i = 0; i < data.length; i++) h = (h * 31 + data.charCodeAt(i)) >>> 0;
  return h.toString(16).padStart(8, '0');
}