import { describe, it, expect } from 'vitest';
import { checkSafety } from '../src/safety/policy';
import { OverrideLog } from '../src/safety/override';

describe('Safety policy', () => {
  it('blocks age/consent violations and redacts protected tags', () => {
    const verdict = checkSafety('Non-consensual gore around Artifact X', {
      age: 'teen',
      consent: 'explicit',
      violence: 'low',
      protectedTags: ['Artifact X']
    });
    expect(verdict.allowed).toBe(false);
    expect(verdict.blockedCategories).toContain('consent');
    expect(verdict.redactions).toContain('gore');
    expect(verdict.redactions).toContain('protected:Artifact X');
  });
});

describe("OverrideLog", () => {
  it('maintains hash-chain integrity', () => {
    const log = new OverrideLog();
    const a = log.append('gm', 'allow mild violence', 'violence:moderate');
    const b = log.append('gm', 'allow scene', 'scene:123');
    expect(log.verify()).toBe(true);
    // Tamper
    (log as any).getAll()[0].reason = 'tampered';
    expect(log.verify()).toBe(false);
  });
});