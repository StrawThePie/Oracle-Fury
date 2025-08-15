import React from 'react';
import { useSession } from '../state/session';

export function ResponseWindow(): JSX.Element {
  const logs = useSession((s) => s.logs);
  const traces = useSession((s) => s.traces);

  return (
    <section aria-label="Narration" className="flex-1 overflow-auto p-4 space-y-4">
      <div className="space-y-2">
        {logs.length === 0 ? (
          <div className="text-gray-500 text-sm">No narration yet. Begin by selecting an action.</div>
        ) : (
          logs.map((l, i) => (
            <p key={i} className="leading-relaxed">
              {l}
            </p>
          ))
        )}
      </div>
      {traces.length > 0 && (
        <details className="bg-gray-900/50 rounded border border-gray-800">
          <summary className="cursor-pointer p-2 text-sm">Roll Traces</summary>
          <div className="p-2 text-xs space-y-1">
            {traces.map((t, i) => (
              <div key={i}>
                <span className="font-semibold">{t.label}:</span> {t.detail}
              </div>
            ))}
          </div>
        </details>
      )}
    </section>
  );
}