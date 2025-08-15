import { useGameStore } from '../store/gameStore';
import { useEffect, useRef } from 'react';
import { ChevronUp } from 'lucide-react';

export default function ResponseWindow() {
  const { session } = useGameStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom when new narrative is added
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [session?.narrativeHistory]);

  if (!session) return null;

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="px-6 py-3 border-b border-border">
        <h2 className="text-lg font-semibold">Story</h2>
      </div>

      {/* Narrative Content */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto scrollbar-thin p-6 space-y-6"
      >
        {session.narrativeHistory.map((entry, index) => (
          <div 
            key={`${entry.turn}-${index}`}
            className="animate-fade-in"
          >
            {/* Turn indicator */}
            {index === 0 || entry.turn !== session.narrativeHistory[index - 1]?.turn ? (
              <div className="flex items-center gap-2 mb-2">
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs text-muted-foreground px-2">
                  Turn {entry.turn}
                </span>
                <div className="h-px flex-1 bg-border" />
              </div>
            ) : null}

            {/* Narrative text */}
            <div className="prose prose-invert max-w-none">
              <p className="text-foreground leading-relaxed">
                {entry.text}
              </p>
            </div>

            {/* Choices made */}
            {entry.choices && entry.choices.length > 0 && (
              <div className="mt-3 space-y-1">
                {entry.choices.map((choice, choiceIndex) => (
                  <div 
                    key={choiceIndex}
                    className="text-sm text-muted-foreground italic flex items-center gap-2"
                  >
                    <ChevronUp size={14} className="rotate-90" />
                    <span>{choice}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Outcome */}
            {entry.outcome && (
              <div className="mt-2 pl-4 border-l-2 border-oracle-600">
                <p className="text-sm text-oracle-200">
                  {entry.outcome}
                </p>
              </div>
            )}
          </div>
        ))}

        {/* Current narrative (most recent) */}
        {session.currentNarrative && (
          <div className="animate-fade-in">
            <div className="prose prose-invert max-w-none">
              <p className="text-foreground leading-relaxed font-medium">
                {session.currentNarrative}
              </p>
            </div>
          </div>
        )}

        {/* Scroll anchor */}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}