import type { Relationship, RelationshipType } from '../schemas';
import { nanoid } from 'nanoid';

/**
 * Relationship update with reason for history tracking
 */
export interface RelationshipUpdate {
  heatChange?: number;
  bondChange?: number;
  event: string;
  newType?: RelationshipType;
  addTags?: string[];
  removeTags?: string[];
}

/**
 * Relationship decay configuration
 */
export interface DecayConfig {
  heatDecayRate: number;
  bondDecayRate: number;
  minHeatForDecay: number;
  minBondForDecay: number;
}

/**
 * Manages character relationships with heat/bond mechanics
 */
export class RelationshipManager {
  private relationships: Map<string, Relationship> = new Map();
  private characterRelationships: Map<string, Set<string>> = new Map();
  
  private defaultDecayConfig: DecayConfig = {
    heatDecayRate: 0.1,
    bondDecayRate: 0.01,
    minHeatForDecay: 1,
    minBondForDecay: 1,
  };

  constructor(relationships: Relationship[] = []) {
    for (const rel of relationships) {
      this.addRelationship(rel);
    }
  }

  /**
   * Add a relationship to the manager
   */
  private addRelationship(relationship: Relationship): void {
    this.relationships.set(relationship.id, relationship);
    
    // Update character index
    this.addToCharacterIndex(relationship.characterA, relationship.id);
    this.addToCharacterIndex(relationship.characterB, relationship.id);
  }

  /**
   * Add relationship to character index
   */
  private addToCharacterIndex(characterId: string, relationshipId: string): void {
    if (!this.characterRelationships.has(characterId)) {
      this.characterRelationships.set(characterId, new Set());
    }
    this.characterRelationships.get(characterId)!.add(relationshipId);
  }

  /**
   * Get or create a relationship between two characters
   */
  getOrCreateRelationship(
    characterA: string,
    characterB: string,
    type: RelationshipType = 'neutral'
  ): Relationship {
    // Ensure consistent ordering
    const [charA, charB] = [characterA, characterB].sort();
    
    // Check if relationship exists
    const existing = this.findRelationship(charA, charB);
    if (existing) return existing;

    // Create new relationship
    const relationship: Relationship = {
      id: nanoid(),
      characterA: charA,
      characterB: charB,
      heat: 0,
      bond: 0,
      type,
      tags: [],
      history: [],
      decayRate: {
        heat: this.defaultDecayConfig.heatDecayRate,
        bond: this.defaultDecayConfig.bondDecayRate,
      },
      isActive: true,
    };

    this.addRelationship(relationship);
    return relationship;
  }

  /**
   * Find existing relationship between two characters
   */
  findRelationship(characterA: string, characterB: string): Relationship | undefined {
    const [charA, charB] = [characterA, characterB].sort();
    
    const relIds = this.characterRelationships.get(charA);
    if (!relIds) return undefined;

    for (const relId of relIds) {
      const rel = this.relationships.get(relId);
      if (rel && 
          ((rel.characterA === charA && rel.characterB === charB) ||
           (rel.characterA === charB && rel.characterB === charA))) {
        return rel;
      }
    }

    return undefined;
  }

  /**
   * Update a relationship
   */
  updateRelationship(
    characterA: string,
    characterB: string,
    update: RelationshipUpdate,
    currentTurn: number
  ): Relationship {
    const relationship = this.getOrCreateRelationship(characterA, characterB);

    // Apply heat change
    if (update.heatChange !== undefined) {
      const oldHeat = relationship.heat;
      relationship.heat = this.clampValue(relationship.heat + update.heatChange);
      
      // Record in history if significant
      if (oldHeat !== relationship.heat) {
        relationship.history = relationship.history || [];
        relationship.history.push({
          timestamp: currentTurn,
          event: update.event,
          heatChange: relationship.heat - oldHeat,
          bondChange: 0,
        });
      }
    }

    // Apply bond change
    if (update.bondChange !== undefined) {
      const oldBond = relationship.bond;
      relationship.bond = this.clampValue(relationship.bond + update.bondChange);
      
      // Update history
      if (oldBond !== relationship.bond) {
        const lastEntry = relationship.history?.[relationship.history.length - 1];
        if (lastEntry && lastEntry.timestamp === currentTurn && lastEntry.event === update.event) {
          // Update existing entry
          lastEntry.bondChange = relationship.bond - oldBond;
        } else {
          // Create new entry
          relationship.history = relationship.history || [];
          relationship.history.push({
            timestamp: currentTurn,
            event: update.event,
            heatChange: 0,
            bondChange: relationship.bond - oldBond,
          });
        }
      }
    }

    // Update type if specified
    if (update.newType) {
      relationship.type = update.newType;
    }

    // Update tags
    if (update.addTags) {
      relationship.tags = relationship.tags || [];
      for (const tag of update.addTags) {
        if (!relationship.tags.includes(tag)) {
          relationship.tags.push(tag);
        }
      }
    }

    if (update.removeTags) {
      relationship.tags = (relationship.tags || []).filter(
        tag => !update.removeTags!.includes(tag)
      );
    }

    // Update last interaction
    relationship.lastInteraction = currentTurn;

    return relationship;
  }

  /**
   * Apply decay to all relationships during downtime
   */
  applyDowntimeDecay(currentTurn: number, config?: Partial<DecayConfig>): void {
    const decayConfig = { ...this.defaultDecayConfig, ...config };

    for (const relationship of this.relationships.values()) {
      if (!relationship.isActive) continue;

      let changed = false;

      // Apply heat decay
      if (Math.abs(relationship.heat) >= decayConfig.minHeatForDecay) {
        const heatDecay = relationship.decayRate?.heat ?? decayConfig.heatDecayRate;
        const oldHeat = relationship.heat;
        
        if (relationship.heat > 0) {
          relationship.heat = Math.max(0, relationship.heat - heatDecay);
        } else {
          relationship.heat = Math.min(0, relationship.heat + heatDecay);
        }
        
        if (oldHeat !== relationship.heat) {
          changed = true;
        }
      }

      // Apply bond decay
      if (Math.abs(relationship.bond) >= decayConfig.minBondForDecay) {
        const bondDecay = relationship.decayRate?.bond ?? decayConfig.bondDecayRate;
        const oldBond = relationship.bond;
        
        if (relationship.bond > 0) {
          relationship.bond = Math.max(0, relationship.bond - bondDecay);
        } else {
          relationship.bond = Math.min(0, relationship.bond + bondDecay);
        }
        
        if (oldBond !== relationship.bond) {
          changed = true;
        }
      }

      // Record decay in history if significant
      if (changed) {
        relationship.history = relationship.history || [];
        relationship.history.push({
          timestamp: currentTurn,
          event: 'Downtime decay',
          heatChange: 0,
          bondChange: 0,
        });
      }
    }
  }

  /**
   * Get all relationships for a character
   */
  getCharacterRelationships(characterId: string): Relationship[] {
    const relIds = this.characterRelationships.get(characterId);
    if (!relIds) return [];

    const relationships: Relationship[] = [];
    for (const relId of relIds) {
      const rel = this.relationships.get(relId);
      if (rel && rel.isActive !== false) {
        relationships.push(rel);
      }
    }

    return relationships;
  }

  /**
   * Get relationship summary for UI
   */
  getRelationshipSummary(characterId: string): Array<{
    otherCharacterId: string;
    relationship: Relationship;
    intensity: 'cold' | 'cool' | 'neutral' | 'warm' | 'hot';
    strength: 'hostile' | 'distant' | 'neutral' | 'close' | 'bonded';
  }> {
    const relationships = this.getCharacterRelationships(characterId);
    
    return relationships.map(rel => {
      const otherCharacterId = rel.characterA === characterId ? rel.characterB : rel.characterA;
      
      // Categorize heat (-5 to +5)
      let intensity: 'cold' | 'cool' | 'neutral' | 'warm' | 'hot';
      if (rel.heat <= -3) intensity = 'cold';
      else if (rel.heat <= -1) intensity = 'cool';
      else if (rel.heat <= 1) intensity = 'neutral';
      else if (rel.heat <= 3) intensity = 'warm';
      else intensity = 'hot';

      // Categorize bond (-5 to +5)
      let strength: 'hostile' | 'distant' | 'neutral' | 'close' | 'bonded';
      if (rel.bond <= -3) strength = 'hostile';
      else if (rel.bond <= -1) strength = 'distant';
      else if (rel.bond <= 1) strength = 'neutral';
      else if (rel.bond <= 3) strength = 'close';
      else strength = 'bonded';

      return {
        otherCharacterId,
        relationship: rel,
        intensity,
        strength,
      };
    });
  }

  /**
   * Get relationship modifiers for probability checks
   */
  getRelationshipModifiers(
    actorId: string,
    targetId: string,
    action: 'persuade' | 'intimidate' | 'deceive' | 'seduce' | 'assist'
  ): Array<{ source: string; value: number }> {
    const relationship = this.findRelationship(actorId, targetId);
    if (!relationship) return [];

    const modifiers: Array<{ source: string; value: number }> = [];

    // Bond modifiers
    if (relationship.bond !== 0) {
      const bondModifier = relationship.bond * 0.2; // +/- 1.0 at max bond
      modifiers.push({
        source: `${relationship.bond > 0 ? 'Positive' : 'Negative'} bond`,
        value: bondModifier,
      });
    }

    // Heat modifiers (context-dependent)
    if (relationship.heat !== 0) {
      let heatModifier = 0;
      let source = '';

      switch (action) {
        case 'seduce':
          // High heat helps seduction
          heatModifier = relationship.heat * 0.3;
          source = 'Romantic tension';
          break;
        case 'intimidate':
          // Negative heat helps intimidation
          heatModifier = relationship.heat < 0 ? Math.abs(relationship.heat) * 0.2 : -relationship.heat * 0.1;
          source = relationship.heat < 0 ? 'Existing animosity' : 'Warm feelings hinder intimidation';
          break;
        case 'persuade':
        case 'assist':
          // Positive heat helps, negative hinders
          heatModifier = relationship.heat * 0.15;
          source = relationship.heat > 0 ? 'Positive rapport' : 'Tension hinders cooperation';
          break;
        case 'deceive':
          // Extreme heat (either direction) hinders deception
          heatModifier = -Math.abs(relationship.heat) * 0.1;
          source = 'Strong emotions make deception harder';
          break;
      }

      if (heatModifier !== 0) {
        modifiers.push({ source, value: heatModifier });
      }
    }

    // Type-specific modifiers
    switch (relationship.type) {
      case 'romantic':
        if (action === 'seduce') modifiers.push({ source: 'Romantic relationship', value: 0.5 });
        if (action === 'persuade') modifiers.push({ source: 'Romantic bond', value: 0.3 });
        break;
      case 'family':
        if (action === 'persuade' || action === 'assist') {
          modifiers.push({ source: 'Family ties', value: 0.4 });
        }
        break;
      case 'rivalry':
        if (action === 'intimidate') modifiers.push({ source: 'Rivalry', value: 0.3 });
        if (action === 'persuade') modifiers.push({ source: 'Rivalry', value: -0.3 });
        break;
      case 'mentor':
        if (action === 'persuade' && relationship.characterA === actorId) {
          modifiers.push({ source: 'Mentor authority', value: 0.4 });
        }
        break;
    }

    // Tag-based modifiers
    if (relationship.tags?.includes('betrayed')) {
      modifiers.push({ source: 'Past betrayal', value: -0.5 });
    }
    if (relationship.tags?.includes('indebted') && relationship.characterB === actorId) {
      modifiers.push({ source: 'Owes a debt', value: 0.3 });
    }

    return modifiers;
  }

  /**
   * Clamp value to [-5, 5] range
   */
  private clampValue(value: number): number {
    return Math.max(-5, Math.min(5, value));
  }

  /**
   * Export all relationships
   */
  getAllRelationships(): Relationship[] {
    return Array.from(this.relationships.values());
  }

  /**
   * Import relationships (for save/load)
   */
  importRelationships(relationships: Relationship[]): void {
    this.relationships.clear();
    this.characterRelationships.clear();
    
    for (const rel of relationships) {
      this.addRelationship(rel);
    }
  }
}