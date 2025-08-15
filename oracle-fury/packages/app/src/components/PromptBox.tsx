import { useGameStore } from '../store/gameStore';
import { useState } from 'react';
import { Send, Dice6, Clock, MessageSquare } from 'lucide-react';

export default function PromptBox() {
  const { 
    session, 
    downtimeManager, 
    relationshipManager,
    startDowntime,
    executeDowntimeAction,
    endDowntime,
    makeChoice 
  } = useGameStore();
  
  const [inputValue, setInputValue] = useState('');
  const [selectedCompanion, setSelectedCompanion] = useState<string | null>(null);

  if (!session) return null;

  const isDowntime = session.worldState.phase === 'downtime';
  const downtimeSession = downtimeManager?.getCurrentSession();

  // Get available downtime actions if in downtime
  const availableActions = isDowntime && downtimeManager && relationshipManager
    ? downtimeManager.getAvailableActions(
        session.worldState,
        session.characters.find(c => c.id === session.playerCharacterId)!,
        relationshipManager
      )
    : [];

  const handleAction = (action: string) => {
    if (isDowntime && downtimeSession) {
      // Execute downtime action
      executeDowntimeAction(action, selectedCompanion || undefined);
      setSelectedCompanion(null);
      
      // Check if downtime should end
      if (downtimeSession.actionsRemaining <= 1) {
        setTimeout(() => endDowntime(), 1500);
      }
    } else {
      // Regular choice
      makeChoice(action);
    }
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      handleAction(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <div className="p-4 space-y-4">
      {/* Phase Indicator */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {isDowntime ? (
            <>
              <Clock size={16} />
              <span>Downtime: {downtimeSession?.type}</span>
              <span className="text-foreground font-medium">
                ({downtimeSession?.actionsRemaining} actions left)
              </span>
            </>
          ) : (
            <>
              <MessageSquare size={16} />
              <span>Narrative Phase</span>
            </>
          )}
        </div>

        {!isDowntime && (
          <div className="flex gap-2">
            <button
              onClick={() => startDowntime('camp')}
              className="px-3 py-1 text-sm bg-secondary hover:bg-secondary/80 rounded-md transition-colors"
            >
              Camp
            </button>
            <button
              onClick={() => startDowntime('hyperspace')}
              className="px-3 py-1 text-sm bg-secondary hover:bg-secondary/80 rounded-md transition-colors"
            >
              Hyperspace
            </button>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {isDowntime && availableActions.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-medium">Available Actions:</p>
          <div className="grid grid-cols-2 gap-2">
            {availableActions.map((action) => (
              <div key={action.id}>
                {/* Show companion selector for social actions */}
                {action.id === 'camp_socialize' && (
                  <select
                    value={selectedCompanion || ''}
                    onChange={(e) => setSelectedCompanion(e.target.value)}
                    className="w-full mb-2 px-3 py-1 text-sm bg-secondary border border-border rounded-md"
                  >
                    <option value="">Select companion...</option>
                    {session.characters
                      .filter(c => c.id !== session.playerCharacterId && c.type !== 'npc')
                      .map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                  </select>
                )}
                
                <button
                  onClick={() => handleAction(action.id)}
                  disabled={action.id === 'camp_socialize' && !selectedCompanion}
                  className="w-full px-4 py-2 bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-primary-foreground rounded-md transition-colors text-sm font-medium"
                >
                  {action.name}
                  {action.cost > 1 && ` (${action.cost} actions)`}
                </button>
                <p className="mt-1 text-xs text-muted-foreground">
                  {action.description}
                </p>
              </div>
            ))}
          </div>
          
          {downtimeSession && downtimeSession.actionsRemaining > 0 && (
            <button
              onClick={endDowntime}
              className="w-full px-4 py-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-md transition-colors text-sm"
            >
              End Downtime Early
            </button>
          )}
        </div>
      )}

      {/* Demo Actions (for testing) */}
      {!isDowntime && (
        <div className="flex gap-2">
          <button
            onClick={() => handleAction('explore')}
            className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md transition-colors text-sm font-medium flex items-center gap-2"
          >
            <Dice6 size={16} />
            Explore
          </button>
          <button
            onClick={() => handleAction('investigate')}
            className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md transition-colors text-sm font-medium"
          >
            Investigate
          </button>
          <button
            onClick={() => handleAction('talk')}
            className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md transition-colors text-sm font-medium"
          >
            Talk
          </button>
        </div>
      )}

      {/* Text Input */}
      <form onSubmit={handleTextSubmit} className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={isDowntime ? "Custom action..." : "What do you do?"}
          className="flex-1 px-4 py-2 bg-secondary border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          type="submit"
          disabled={!inputValue.trim()}
          className="px-4 py-2 bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-primary-foreground rounded-md transition-colors"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}