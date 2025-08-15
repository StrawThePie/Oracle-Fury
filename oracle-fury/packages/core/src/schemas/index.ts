import Ajv from 'ajv';
import addFormats from 'ajv-formats';

// Import schema definitions
import characterSchema from '../../schemas/character.schema.json';
import factionSchema from '../../schemas/faction.schema.json';
import relationshipSchema from '../../schemas/relationship.schema.json';
import worldStateSchema from '../../schemas/worldState.schema.json';
import eventSchema from '../../schemas/event.schema.json';
import savegameSchema from '../../schemas/savegame.schema.json';
import moduleSchema from '../../schemas/module.schema.json';

// Create AJV instance with formats
const ajv = new Ajv({ 
  strict: false,
  allErrors: true,
  useDefaults: true,
  removeAdditional: 'all'
});
addFormats(ajv);

// Add schemas to AJV
ajv.addSchema(characterSchema);
ajv.addSchema(factionSchema);
ajv.addSchema(relationshipSchema);
ajv.addSchema(worldStateSchema);
ajv.addSchema(eventSchema);
ajv.addSchema(savegameSchema);
ajv.addSchema(moduleSchema);

// Export validators
export const validators = {
  character: ajv.compile(characterSchema),
  faction: ajv.compile(factionSchema),
  relationship: ajv.compile(relationshipSchema),
  worldState: ajv.compile(worldStateSchema),
  event: ajv.compile(eventSchema),
  savegame: ajv.compile(savegameSchema),
  module: ajv.compile(moduleSchema),
};

// Export type definitions based on schemas
export type Character = {
  id: string;
  name: string;
  type: 'player' | 'npc' | 'companion';
  faction?: string;
  stats: {
    health: number;
    maxHealth: number;
    energy: number;
    maxEnergy: number;
    attributes?: Record<string, number>;
  };
  tags: string[];
  inventory: Array<{
    id: string;
    quantity: number;
    equipped?: boolean;
  }>;
  conditions?: Array<{
    id: string;
    duration: number;
    stacks?: number;
  }>;
  location?: string;
  biography?: string;
  portraitUrl?: string;
};

export type Faction = {
  id: string;
  name: string;
  description?: string;
  reputation: number;
  tags: string[];
  relationships?: Record<string, number>;
  headquarters?: string;
  resources?: {
    credits?: number;
    influence?: number;
    military?: number;
    technology?: number;
  };
  leaderIds?: string[];
  memberIds?: string[];
  questlineIds?: string[];
  iconUrl?: string;
};

export type RelationshipType = 'romantic' | 'friendship' | 'rivalry' | 'professional' | 'family' | 'mentor' | 'neutral';

export type Relationship = {
  id: string;
  characterA: string;
  characterB: string;
  heat: number;
  bond: number;
  type: RelationshipType;
  tags?: string[];
  history?: Array<{
    timestamp: number;
    event: string;
    heatChange: number;
    bondChange: number;
  }>;
  decayRate?: {
    heat?: number;
    bond?: number;
  };
  lastInteraction?: number;
  isActive?: boolean;
};

export type GamePhase = 'narrative' | 'downtime' | 'combat' | 'dialogue' | 'cutscene';
export type DowntimeType = 'hyperspace' | 'camp' | 'base';

export type WorldState = {
  id: string;
  turn: number;
  phase: GamePhase;
  downtimeState?: {
    type?: DowntimeType;
    location?: string;
    actionsRemaining?: number;
    activeEvents?: string[];
  };
  flags: Record<string, boolean>;
  counters: Record<string, number>;
  strings?: Record<string, string>;
  activeModuleIds: string[];
  currentLocationId?: string;
  activeQuestIds?: string[];
  completedQuestIds?: string[];
  eventHistory?: Array<{
    turn: number;
    eventId: string;
    outcome: string;
    choices?: string[];
  }>;
  partyIds?: string[];
  inventoryCapacity?: number;
  credits?: number;
  shipState?: {
    fuel?: number;
    hull?: number;
    supplies?: number;
    cargo?: Array<{
      itemId: string;
      quantity: number;
    }>;
  };
  randomSeed?: string;
};

export type ConditionOperator = 'equals' | 'notEquals' | 'greater' | 'less' | 'greaterOrEqual' | 'lessOrEqual' | 'contains' | 'notContains';
export type ConditionType = 'flag' | 'counter' | 'tag' | 'relationship' | 'phase' | 'location' | 'quest' | 'item' | 'character';

export type Condition = {
  type: ConditionType;
  target: string;
  operator?: ConditionOperator;
  value: string | number | boolean;
};

export type ConditionSet = {
  all?: Condition[];
  any?: Condition[];
  none?: Condition[];
};

export type EffectType = 'setFlag' | 'setCounter' | 'modifyCounter' | 'addTag' | 'removeTag' | 
  'modifyRelationship' | 'addItem' | 'removeItem' | 'modifyCredits' | 'damage' | 'heal' | 
  'addCondition' | 'removeCondition' | 'triggerEvent' | 'startQuest' | 'completeQuest' | 'moveLocation';

export type Effect = {
  type: EffectType;
  target?: string;
  value?: string | number | boolean;
  amount?: number;
};

export type Modifier = {
  source: string;
  value: number;
  conditions?: ConditionSet;
};

export type Choice = {
  id: string;
  text: string;
  conditions?: ConditionSet;
  probability?: {
    base?: number;
    modifiers?: Modifier[];
  };
  outcomes?: Outcome[];
  effects?: Effect[];
};

export type Outcome = {
  id: string;
  weight: number;
  narrative?: string;
  effects?: Effect[];
  nextEventId?: string;
};

export type Event = {
  id: string;
  title: string;
  description?: string;
  weight?: number;
  priority?: number;
  conditions?: ConditionSet;
  narrative?: {
    intro: string;
    context?: Record<string, string>;
  };
  choices?: Choice[];
  outcomes?: Outcome[];
  effects?: Effect[];
  tags?: string[];
  phase?: Array<'narrative' | 'downtime' | 'combat' | 'any'>;
  cooldown?: number;
  maxOccurrences?: number;
  moduleId?: string;
};

export type SaveGame = {
  version: string;
  engineVersion?: string;
  timestamp: string;
  name?: string;
  thumbnail?: string;
  playtime?: number;
  worldState: WorldState;
  characters: Character[];
  relationships: Relationship[];
  factions: Faction[];
  eventCooldowns?: Record<string, number>;
  eventOccurrences?: Record<string, number>;
  replayData?: {
    initialSeed?: string;
    choices?: Array<{
      turn: number;
      eventId: string;
      choiceId: string;
      seed?: string;
    }>;
  };
  metadata?: {
    difficulty?: string;
    ironman?: boolean;
    mods?: Array<{
      id: string;
      version: string;
    }>;
  };
};

export type Module = {
  id: string;
  version: string;
  name: string;
  description?: string;
  author?: string;
  engineVersion: string;
  dependencies?: Array<{
    id: string;
    version: string;
  }>;
  capabilities?: {
    saveCompatible?: boolean;
    multiplayerCompatible?: boolean;
    moddable?: boolean;
    experimental?: boolean;
  };
  content?: {
    events?: string[];
    characters?: string[];
    factions?: string[];
    locations?: string[];
    items?: string[];
    quests?: string[];
  };
  assets?: {
    images?: string;
    audio?: string;
  };
  settings?: {
    namespace?: string;
    priority?: number;
    tags?: string[];
  };
  localization?: {
    default?: string;
    supported?: string[];
  };
};

// Validation helper functions
export function validateCharacter(data: unknown): data is Character {
  return validators.character(data);
}

export function validateFaction(data: unknown): data is Faction {
  return validators.faction(data);
}

export function validateRelationship(data: unknown): data is Relationship {
  return validators.relationship(data);
}

export function validateWorldState(data: unknown): data is WorldState {
  return validators.worldState(data);
}

export function validateEvent(data: unknown): data is Event {
  return validators.event(data);
}

export function validateSaveGame(data: unknown): data is SaveGame {
  return validators.savegame(data);
}

export function validateModule(data: unknown): data is Module {
  return validators.module(data);
}

// Error formatting helper
export function getValidationErrors(validator: any): string[] {
  if (!validator.errors) return [];
  return validator.errors.map((err: any) => {
    const path = err.instancePath || '/';
    return `${path}: ${err.message}`;
  });
}