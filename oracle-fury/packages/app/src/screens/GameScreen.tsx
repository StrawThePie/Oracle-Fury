import { useGameStore } from '../store/gameStore';
import ResponseWindow from '../components/ResponseWindow';
import PromptBox from '../components/PromptBox';
import PartyPanel from '../components/PartyPanel';
import RelationshipPanel from '../components/RelationshipPanel';
import { useState } from 'react';
import { Users, Heart, Map, ChevronRight } from 'lucide-react';

export default function GameScreen() {
  const { session } = useGameStore();
  const [activePanel, setActivePanel] = useState<'party' | 'relationships' | 'mission' | null>(null);

  if (!session) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-muted-foreground">No active game session</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex">
      {/* Main Game Area */}
      <div className="flex-1 flex flex-col">
        {/* Response Window */}
        <div className="flex-1 overflow-hidden">
          <ResponseWindow />
        </div>

        {/* Prompt Box */}
        <div className="border-t border-border">
          <PromptBox />
        </div>
      </div>

      {/* Right Sidebar */}
      <aside className="w-80 border-l border-border flex flex-col">
        {/* Quick Stats */}
        <div className="p-4 border-b border-border space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Credits</span>
            <span className="font-medium">{session.worldState.counters.credits || 0}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Morale</span>
            <span className="font-medium">{session.worldState.counters.morale || 0}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Phase</span>
            <span className="font-medium capitalize">{session.worldState.phase}</span>
          </div>
        </div>

        {/* Panel Tabs */}
        <div className="flex border-b border-border">
          <button
            onClick={() => setActivePanel(activePanel === 'party' ? null : 'party')}
            className={`flex-1 px-4 py-2 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
              activePanel === 'party' 
                ? 'bg-secondary text-secondary-foreground' 
                : 'hover:bg-secondary/50'
            }`}
          >
            <Users size={16} />
            Party
          </button>
          <button
            onClick={() => setActivePanel(activePanel === 'relationships' ? null : 'relationships')}
            className={`flex-1 px-4 py-2 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
              activePanel === 'relationships' 
                ? 'bg-secondary text-secondary-foreground' 
                : 'hover:bg-secondary/50'
            }`}
          >
            <Heart size={16} />
            Relations
          </button>
          <button
            onClick={() => setActivePanel(activePanel === 'mission' ? null : 'mission')}
            className={`flex-1 px-4 py-2 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
              activePanel === 'mission' 
                ? 'bg-secondary text-secondary-foreground' 
                : 'hover:bg-secondary/50'
            }`}
          >
            <Map size={16} />
            Mission
          </button>
        </div>

        {/* Panel Content */}
        <div className="flex-1 overflow-y-auto">
          {activePanel === 'party' && <PartyPanel />}
          {activePanel === 'relationships' && <RelationshipPanel />}
          {activePanel === 'mission' && (
            <div className="p-4">
              <p className="text-muted-foreground text-sm">Mission panel coming soon...</p>
            </div>
          )}
          {!activePanel && (
            <div className="p-4 text-center text-muted-foreground">
              <p className="text-sm">Select a panel to view details</p>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}