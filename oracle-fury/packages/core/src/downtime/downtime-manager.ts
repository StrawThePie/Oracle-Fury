import type { WorldState, DowntimeType, Character, Effect } from '../schemas';
import { RelationshipManager } from '../relationships/relationship-manager';
import { SeededRandom } from '../rng/seeded-random';

/**
 * Downtime action definition
 */
export interface DowntimeAction {
  id: string;
  name: string;
  description: string;
  type: DowntimeType | 'any';
  cost: number; // Action points
  requirements?: {
    minBond?: number;
    maxBond?: number;
    minHeat?: number;
    maxHeat?: number;
    tags?: string[];
    flags?: string[];
    items?: string[];
  };
  outcomes: DowntimeOutcome[];
  cooldown?: number;
}

/**
 * Downtime action outcome
 */
export interface DowntimeOutcome {
  weight: number;
  description: string;
  effects: Effect[];
  narrative?: string;
  triggerEvent?: string;
}

/**
 * Downtime session state
 */
export interface DowntimeSession {
  type: DowntimeType;
  location?: string;
  actionsRemaining: number;
  completedActions: string[];
  cooldowns: Map<string, number>;
}

/**
 * Manages downtime phases and actions
 */
export class DowntimeManager {
  private actions: Map<string, DowntimeAction> = new Map();
  private session: DowntimeSession | null = null;
  private defaultActionsPerPhase = 3;

  constructor() {
    this.initializeDefaultActions();
  }

  /**
   * Initialize default downtime actions
   */
  private initializeDefaultActions(): void {
    // Hyperspace actions
    this.registerAction({
      id: 'hyperspace_meditation',
      name: 'Hyperspace Meditation',
      description: 'Contemplate the void between stars',
      type: 'hyperspace',
      cost: 1,
      outcomes: [
        {
          weight: 70,
          description: 'You find clarity in the endless dark',
          effects: [
            { type: 'modifyCounter', target: 'stress', value: -1 },
            { type: 'addTag', target: 'player', value: 'focused' },
          ],
          narrative: 'The hyperspace void brings unexpected peace.',
        },
        {
          weight: 30,
          description: 'Unsettling visions plague your meditation',
          effects: [
            { type: 'modifyCounter', target: 'stress', value: 1 },
            { type: 'setFlag', target: 'had_visions', value: true },
          ],
          narrative: 'Strange whispers echo through the dimensional fold.',
        },
      ],
    });

    this.registerAction({
      id: 'hyperspace_maintenance',
      name: 'Ship Maintenance',
      description: 'Perform routine maintenance on ship systems',
      type: 'hyperspace',
      cost: 1,
      outcomes: [
        {
          weight: 80,
          description: 'Systems running smoothly',
          effects: [
            { type: 'modifyCounter', target: 'ship_integrity', value: 5 },
          ],
        },
        {
          weight: 20,
          description: 'Discovered a minor issue and fixed it',
          effects: [
            { type: 'modifyCounter', target: 'ship_integrity', value: 10 },
            { type: 'setFlag', target: 'ship_maintained', value: true },
          ],
        },
      ],
    });

    // Camp actions
    this.registerAction({
      id: 'camp_socialize',
      name: 'Socialize',
      description: 'Spend time with a companion',
      type: 'camp',
      cost: 1,
      outcomes: [
        {
          weight: 60,
          description: 'A pleasant conversation',
          effects: [
            { type: 'modifyRelationship', target: 'selected_companion', value: 1 },
          ],
          narrative: 'You share stories by the campfire.',
        },
        {
          weight: 30,
          description: 'Deep connection formed',
          effects: [
            { type: 'modifyRelationship', target: 'selected_companion', value: 2 },
            { type: 'setFlag', target: 'bonding_moment', value: true },
          ],
          narrative: 'A moment of genuine understanding passes between you.',
        },
        {
          weight: 10,
          description: 'Awkward tension',
          effects: [
            { type: 'modifyRelationship', target: 'selected_companion', value: -1 },
          ],
          narrative: 'The conversation takes an uncomfortable turn.',
        },
      ],
    });

    this.registerAction({
      id: 'camp_rest',
      name: 'Rest',
      description: 'Get some much-needed sleep',
      type: 'camp',
      cost: 1,
      outcomes: [
        {
          weight: 90,
          description: 'Restful sleep',
          effects: [
            { type: 'heal', target: 'party', value: 10 },
            { type: 'removeCondition', target: 'party', value: 'exhausted' },
          ],
        },
        {
          weight: 10,
          description: 'Disturbed by nightmares',
          effects: [
            { type: 'heal', target: 'party', value: 5 },
            { type: 'addCondition', target: 'player', value: 'unsettled' },
          ],
          triggerEvent: 'nightmare_event',
        },
      ],
    });

    // Base actions
    this.registerAction({
      id: 'base_training',
      name: 'Training Session',
      description: 'Train with equipment or instructors',
      type: 'base',
      cost: 1,
      outcomes: [
        {
          weight: 100,
          description: 'Improved skills',
          effects: [
            { type: 'modifyCounter', target: 'experience', value: 10 },
            { type: 'addTag', target: 'player', value: 'trained' },
          ],
        },
      ],
    });

    this.registerAction({
      id: 'base_shopping',
      name: 'Visit Markets',
      description: 'Browse the local markets',
      type: 'base',
      cost: 1,
      requirements: {
        flags: ['market_available'],
      },
      outcomes: [
        {
          weight: 100,
          description: 'Browse available goods',
          effects: [],
          triggerEvent: 'market_shopping',
        },
      ],
    });

    this.registerAction({
      id: 'base_mission_planning',
      name: 'Mission Planning',
      description: 'Prepare for upcoming missions',
      type: 'base',
      cost: 1,
      outcomes: [
        {
          weight: 100,
          description: 'Well prepared',
          effects: [
            { type: 'setFlag', target: 'mission_prepared', value: true },
            { type: 'addTag', target: 'party', value: 'prepared' },
          ],
        },
      ],
    });

    // Any location actions
    this.registerAction({
      id: 'personal_time',
      name: 'Personal Time',
      description: 'Focus on personal interests',
      type: 'any',
      cost: 1,
      outcomes: [
        {
          weight: 100,
          description: 'Refreshed',
          effects: [
            { type: 'modifyCounter', target: 'morale', value: 1 },
          ],
        },
      ],
    });
  }

  /**
   * Register a custom downtime action
   */
  registerAction(action: DowntimeAction): void {
    this.actions.set(action.id, action);
  }

  /**
   * Start a downtime session
   */
  startDowntime(
    worldState: WorldState,
    type: DowntimeType,
    location?: string,
    actionsCount?: number
  ): DowntimeSession {
    this.session = {
      type,
      location,
      actionsRemaining: actionsCount || this.defaultActionsPerPhase,
      completedActions: [],
      cooldowns: new Map(),
    };

    // Update world state
    worldState.phase = 'downtime';
    worldState.downtimeState = {
      type,
      location,
      actionsRemaining: this.session.actionsRemaining,
      activeEvents: [],
    };

    return this.session;
  }

  /**
   * Get available actions for current downtime
   */
  getAvailableActions(
    worldState: WorldState,
    character: Character,
    _relationshipManager: RelationshipManager
  ): DowntimeAction[] {
    if (!this.session) return [];

    const available: DowntimeAction[] = [];

    for (const action of this.actions.values()) {
      // Check type compatibility
      if (action.type !== 'any' && action.type !== this.session.type) {
        continue;
      }

      // Check cooldown
      const cooldownRemaining = this.session.cooldowns.get(action.id) || 0;
      if (cooldownRemaining > 0) {
        continue;
      }

      // Check cost
      if (action.cost > this.session.actionsRemaining) {
        continue;
      }

      // Check requirements
      if (action.requirements) {
        const req = action.requirements;

        // Check flags
        if (req.flags) {
          const hasAllFlags = req.flags.every(flag => worldState.flags[flag]);
          if (!hasAllFlags) continue;
        }

        // Check tags
        if (req.tags) {
          const hasAllTags = req.tags.every(tag => character.tags.includes(tag));
          if (!hasAllTags) continue;
        }

        // Check items
        if (req.items) {
          const hasAllItems = req.items.every(itemId =>
            character.inventory.some(inv => inv.id === itemId)
          );
          if (!hasAllItems) continue;
        }

        // TODO: Check relationship requirements when needed
      }

      available.push(action);
    }

    return available;
  }

  /**
   * Execute a downtime action
   */
  executeAction(
    actionId: string,
    worldState: WorldState,
    _character: Character,
    rng: SeededRandom,
    targetCharacterId?: string
  ): {
    action: DowntimeAction;
    outcome: DowntimeOutcome;
    effects: Effect[];
  } | null {
    if (!this.session) return null;

    const action = this.actions.get(actionId);
    if (!action) return null;

    // Check if action is available
    if (action.cost > this.session.actionsRemaining) return null;

    // Select outcome
    const outcome = rng.pickWeighted(
      action.outcomes.map(o => ({ item: o, weight: o.weight }))
    );
    if (!outcome) return null;

    // Apply effects with target substitution
    const effects = outcome.effects.map(effect => {
      if (effect.target === 'selected_companion' && targetCharacterId) {
        return { ...effect, target: targetCharacterId };
      }
      return effect;
    });

    // Update session
    this.session.actionsRemaining -= action.cost;
    this.session.completedActions.push(actionId);

    // Set cooldown
    if (action.cooldown) {
      this.session.cooldowns.set(actionId, action.cooldown);
    }

    // Update world state
    if (worldState.downtimeState) {
      worldState.downtimeState.actionsRemaining = this.session.actionsRemaining;
    }

    return {
      action,
      outcome,
      effects,
    };
  }

  /**
   * End downtime session
   */
  endDowntime(worldState: WorldState, relationshipManager: RelationshipManager): void {
    if (!this.session) return;

    // Apply relationship decay
    relationshipManager.applyDowntimeDecay(worldState.turn);

    // Clear downtime state
    worldState.phase = 'narrative';
    worldState.downtimeState = undefined;

    this.session = null;
  }

  /**
   * Get current session info
   */
  getCurrentSession(): DowntimeSession | null {
    return this.session;
  }

  /**
   * Check if downtime is active
   */
  isActive(): boolean {
    return this.session !== null;
  }

  /**
   * Reduce cooldowns (call at turn end)
   */
  reduceCooldowns(): void {
    if (!this.session) return;

    for (const [actionId, cooldown] of this.session.cooldowns.entries()) {
      if (cooldown > 0) {
        this.session.cooldowns.set(actionId, cooldown - 1);
      }
    }
  }
}