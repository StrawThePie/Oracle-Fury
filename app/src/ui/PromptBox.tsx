import React, { useMemo, useState } from 'react';
import { useSession } from '../state/session';
import { SeededRandom, rollDice, resolveProbability } from '@oracle-fury/core';

export function PromptBox(): JSX.Element {
  const { seed, log, addTrace } = useSession();
  const [input, setInput] = useState('');
  const local = useMemo(() => SeededRandom.derive(seed, 'prompt'), [seed]);

  function act(): void {
    const dice = rollDice('2d6+1', local);
    addTrace({ label: 'Dice', detail: `${dice.expression} => [${dice.rolls.join(', ')}] + ${dice.modifier} = ${dice.total}` });

    const { probability, success } = resolveProbability(0.5, [
      { id: 'dice-bonus', label: 'Dice Total Adj', weight: Math.max(-2, Math.min(2, (dice.total - 7) / 4)) }
    ]);
    addTrace({ label: 'Resolution', detail: `p=${probability.toFixed(3)} success=${success}` });

    log(success ? `Success: ${input || 'You proceed cautiously.'}` : `Complication: ${input || 'Something goes awry.'}`);
    setInput('');
  }

  return (
    <form
      className="p-3 border-t border-gray-800 flex items-center gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        act();
      }}
    >
      <input
        aria-label="Action or dialogue"
        className="flex-1 bg-gray-900 border border-gray-700 rounded px-3 py-2 outline-none focus:ring"
        placeholder="Say something or choose an action..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 px-3 py-2 rounded text-sm">
        Resolve
      </button>
    </form>
  );
}