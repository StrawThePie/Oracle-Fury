import React, { useMemo, useState } from 'react';
import { useSession } from '../state/session';
import { LocalStorageAdapter } from '@oracle-fury/core';

export function SidePanel(): JSX.Element {
  const { seed, reset, phase, setPhase, flags, toggleFlag, logs } = useSession();
  const storage = useMemo(() => new LocalStorageAdapter(), []);
  const [overrideReason, setOverrideReason] = useState('');
  const [overrideScope, setOverrideScope] = useState('');

  async function save(): Promise<void> {
    const data = JSON.stringify({ seed, phase, flags, logs }, null, 2);
    await storage.save('oracle-fury-save', data);
  }
  async function load(): Promise<void> {
    const data = await storage.load('oracle-fury-save');
    if (data) {
      const parsed = JSON.parse(data);
      reset(parsed.seed ?? 123456);
    }
  }

  return (
    <div className="p-3 space-y-4">
      <section aria-label="Session Controls">
        <h2 className="text-sm font-semibold mb-2">Session</h2>
        <div className="flex items-center gap-2 mb-2">
          <input
            type="number"
            className="w-28 bg-gray-900 border border-gray-700 rounded px-2 py-1"
            defaultValue={seed}
            onBlur={(e) => reset(Number(e.target.value || 0))}
          />
          <button className="bg-gray-800 px-2 py-1 rounded text-sm" onClick={() => reset(seed)}>
            Reset
          </button>
        </div>
        <div className="flex gap-2">
          <button className="bg-green-700 px-2 py-1 rounded text-sm" onClick={save}>
            Save
          </button>
          <button className="bg-blue-700 px-2 py-1 rounded text-sm" onClick={load}>
            Load
          </button>
        </div>
      </section>

      <section aria-label="Downtime Phase">
        <h2 className="text-sm font-semibold mb-2">Phase</h2>
        <select
          className="bg-gray-900 border border-gray-700 rounded px-2 py-1"
          value={phase}
          onChange={(e) => setPhase(e.target.value as any)}
        >
          <option>Hyperspace</option>
          <option>Camp</option>
          <option>Base</option>
        </select>
      </section>

      <section aria-label="Flags">
        <h2 className="text-sm font-semibold mb-2">Flags</h2>
        <div className="space-y-1 text-sm">
          {Object.entries(flags).length === 0 ? (
            <div className="text-gray-500">No flags yet.</div>
          ) : (
            Object.entries(flags).map(([k, v]) => (
              <label key={k} className="flex items-center gap-2">
                <input type="checkbox" checked={!!v} onChange={() => toggleFlag(k)} /> {k}
              </label>
            ))
          )}
        </div>
      </section>

      <section aria-label="Safety">
        <h2 className="text-sm font-semibold mb-2">Safety</h2>
        <div className="text-xs text-gray-400">Content policy enforced pre/post generation. Admin overrides are logged.</div>
      </section>

      <section aria-label="Admin Override" className="border-t border-gray-800 pt-3">
        <h2 className="text-sm font-semibold mb-2">GM/Admin</h2>
        <input
          className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-1 mb-1"
          placeholder="Reason"
          value={overrideReason}
          onChange={(e) => setOverrideReason(e.target.value)}
        />
        <input
          className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-1 mb-2"
          placeholder="Scope (e.g. allow:violence)"
          value={overrideScope}
          onChange={(e) => setOverrideScope(e.target.value)}
        />
        <button
          className="bg-amber-700 hover:bg-amber-600 px-2 py-1 rounded text-sm w-full"
          onClick={() => {
            console.log('Override', { overrideReason, overrideScope });
            setOverrideReason('');
            setOverrideScope('');
          }}
        >
          Commander’s Discretion
        </button>
      </section>
    </div>
  );
}