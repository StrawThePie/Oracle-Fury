import { useGameStore } from '../store/gameStore';

export default function RelationshipPanel() {
  const { session, relationshipManager } = useGameStore();

  if (!session || !relationshipManager) return null;

  const relationships = relationshipManager.getAllRelationships();

  return (
    <div className="p-4 space-y-4">
      <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
        Relationships
      </h3>

      {relationships.length > 0 ? (
        relationships.map((rel) => (
          <div key={rel.id} className="bg-secondary/50 rounded-lg p-3 space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium">
                  {rel.characterA} ↔ {rel.characterB}
                </p>
                <p className="text-xs text-muted-foreground capitalize">
                  {rel.type}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-muted-foreground">Heat:</span>
                <span className="ml-1 font-medium">{rel.heat}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Bond:</span>
                <span className="ml-1 font-medium">{rel.bond}</span>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-sm text-muted-foreground text-center py-8">
          No relationships formed yet
        </p>
      )}
    </div>
  );
}