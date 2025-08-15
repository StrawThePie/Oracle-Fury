import { useGameStore } from '../store/gameStore';
import { Heart, Zap, Shield, User } from 'lucide-react';

export default function PartyPanel() {
  const { session } = useGameStore();

  if (!session) return null;

  const partyMembers = session.characters.filter(
    c => session.worldState.partyIds?.includes(c.id)
  );

  return (
    <div className="p-4 space-y-4">
      <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
        Party Members
      </h3>

      {partyMembers.map((character) => (
        <div 
          key={character.id}
          className="bg-secondary/50 rounded-lg p-4 space-y-3"
        >
          {/* Character Header */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
              <User size={20} className="text-primary" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold">{character.name}</h4>
              <p className="text-sm text-muted-foreground capitalize">
                {character.type}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="space-y-2">
            {/* Health */}
            <div>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="flex items-center gap-1">
                  <Heart size={14} />
                  Health
                </span>
                <span>{character.stats.health}/{character.stats.maxHealth}</span>
              </div>
              <div className="h-2 bg-background rounded-full overflow-hidden">
                <div 
                  className="h-full bg-red-500 transition-all duration-300"
                  style={{ 
                    width: `${(character.stats.health / character.stats.maxHealth) * 100}%` 
                  }}
                />
              </div>
            </div>

            {/* Energy */}
            <div>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="flex items-center gap-1">
                  <Zap size={14} />
                  Energy
                </span>
                <span>{character.stats.energy}/{character.stats.maxEnergy}</span>
              </div>
              <div className="h-2 bg-background rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 transition-all duration-300"
                  style={{ 
                    width: `${(character.stats.energy / character.stats.maxEnergy) * 100}%` 
                  }}
                />
              </div>
            </div>
          </div>

          {/* Tags */}
          {character.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {character.tags.map((tag) => (
                <span 
                  key={tag}
                  className="px-2 py-1 bg-background text-xs rounded-md"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Conditions */}
          {character.conditions && character.conditions.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Conditions:</p>
              {character.conditions.map((condition) => (
                <div 
                  key={condition.id}
                  className="flex items-center justify-between text-xs"
                >
                  <span className="flex items-center gap-1">
                    <Shield size={12} />
                    {condition.id}
                  </span>
                  <span className="text-muted-foreground">
                    {condition.duration === -1 ? 'Permanent' : `${condition.duration} turns`}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {partyMembers.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-8">
          No party members
        </p>
      )}
    </div>
  );
}