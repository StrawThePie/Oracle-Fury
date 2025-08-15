import type { Modifier } from '../schemas';
import { SeededRandom } from './seeded-random';

/**
 * Resolution trace for debugging and UI display
 */
export interface ResolutionTrace {
  baseProbability: number;
  modifiers: Array<{
    source: string;
    value: number;
    applied: boolean;
    reason?: string;
  }>;
  finalProbability: number;
  roll: number;
  success: boolean;
  seed: number;
}

/**
 * Probability Resolution Engine
 * Handles skill checks, event probabilities, and weighted outcomes
 */
export class ResolutionEngine {
  private rng: SeededRandom;

  constructor(rng: SeededRandom) {
    this.rng = rng;
  }

  /**
   * Convert probability to logit space
   * logit(p) = log(p / (1 - p))
   */
  private logit(p: number): number {
    // Clamp to avoid infinity
    const clamped = Math.max(0.0001, Math.min(0.9999, p));
    return Math.log(clamped / (1 - clamped));
  }

  /**
   * Convert logit back to probability
   * sigmoid(x) = 1 / (1 + e^(-x))
   */
  private sigmoid(x: number): number {
    return 1 / (1 + Math.exp(-x));
  }

  /**
   * Resolve a probability check with modifiers
   */
  resolve(
    baseProbability: number,
    modifiers: Modifier[] = [],
    context?: Record<string, any>
  ): ResolutionTrace {
    const trace: ResolutionTrace = {
      baseProbability,
      modifiers: [],
      finalProbability: baseProbability,
      roll: 0,
      success: false,
      seed: this.rng.getSeed(),
    };

    // Convert base probability to logit space
    let logitValue = this.logit(baseProbability);

    // Apply modifiers in logit space (additive)
    for (const modifier of modifiers) {
      const applied = this.checkModifierConditions(modifier, context);
      
      trace.modifiers.push({
        source: modifier.source,
        value: modifier.value,
        applied,
        reason: applied ? undefined : 'Conditions not met',
      });

      if (applied) {
        logitValue += modifier.value;
      }
    }

    // Convert back to probability space
    trace.finalProbability = this.sigmoid(logitValue);

    // Clamp final probability
    trace.finalProbability = Math.max(0, Math.min(1, trace.finalProbability));

    // Roll the dice
    trace.roll = this.rng.next();
    trace.success = trace.roll < trace.finalProbability;

    return trace;
  }

  /**
   * Check if modifier conditions are met
   */
  private checkModifierConditions(
    modifier: Modifier,
    context?: Record<string, any>
  ): boolean {
    if (!modifier.conditions || !context) return true;

    // TODO: Implement condition checking logic
    // This will be implemented when we have the condition evaluator
    return true;
  }

  /**
   * Resolve a contested check between two entities
   */
  resolveContested(
    actorProbability: number,
    actorModifiers: Modifier[],
    targetProbability: number,
    targetModifiers: Modifier[],
    context?: Record<string, any>
  ): {
    actorTrace: ResolutionTrace;
    targetTrace: ResolutionTrace;
    winner: 'actor' | 'target' | 'tie';
  } {
    const actorTrace = this.resolve(actorProbability, actorModifiers, context);
    const targetTrace = this.resolve(targetProbability, targetModifiers, context);

    // Compare degrees of success
    const actorMargin = actorTrace.finalProbability - actorTrace.roll;
    const targetMargin = targetTrace.finalProbability - targetTrace.roll;

    let winner: 'actor' | 'target' | 'tie';
    if (actorTrace.success && !targetTrace.success) {
      winner = 'actor';
    } else if (!actorTrace.success && targetTrace.success) {
      winner = 'target';
    } else if (actorTrace.success && targetTrace.success) {
      // Both succeeded, compare margins
      winner = actorMargin > targetMargin ? 'actor' : 
               targetMargin > actorMargin ? 'target' : 'tie';
    } else {
      // Both failed, compare who failed less
      winner = actorMargin > targetMargin ? 'actor' : 
               targetMargin > actorMargin ? 'target' : 'tie';
    }

    return { actorTrace, targetTrace, winner };
  }

  /**
   * Select from weighted options
   */
  selectWeighted<T>(
    options: Array<{ option: T; weight: number; modifiers?: Modifier[] }>,
    context?: Record<string, any>
  ): {
    selected: T | undefined;
    weights: Array<{ option: T; originalWeight: number; finalWeight: number }>;
  } {
    if (options.length === 0) {
      return { selected: undefined, weights: [] };
    }

    // Calculate final weights with modifiers
    const weights = options.map(({ option, weight, modifiers = [] }) => {
      // Apply modifiers to weight in logit space
      let logitWeight = this.logit(weight / 100); // Normalize weight to probability
      
      for (const modifier of modifiers) {
        if (this.checkModifierConditions(modifier, context)) {
          logitWeight += modifier.value;
        }
      }

      const finalWeight = Math.max(0, this.sigmoid(logitWeight) * 100);
      
      return { option, originalWeight: weight, finalWeight };
    });

    // Use RNG to select weighted option
    const selected = this.rng.pickWeighted(
      weights.map(w => ({ item: w.option, weight: w.finalWeight }))
    );

    return { selected, weights };
  }

  /**
   * Roll dice with modifiers
   */
  rollDice(
    dice: string,
    modifiers: Modifier[] = [],
    context?: Record<string, any>
  ): {
    result: number;
    rolls: number[];
    modifier: number;
    formula: string;
  } {
    const parsed = this.parseDice(dice);
    if (!parsed) {
      throw new Error(`Invalid dice formula: ${dice}`);
    }

    const rolls: number[] = [];
    let total = 0;

    // Roll the dice
    for (let i = 0; i < parsed.count; i++) {
      const roll = this.rng.nextInt(1, parsed.sides);
      rolls.push(roll);
      total += roll;
    }

    // Add base modifier
    total += parsed.modifier;

    // Apply additional modifiers
    let additionalModifier = 0;
    for (const modifier of modifiers) {
      if (this.checkModifierConditions(modifier, context)) {
        additionalModifier += modifier.value;
      }
    }

    return {
      result: total + additionalModifier,
      rolls,
      modifier: parsed.modifier + additionalModifier,
      formula: `${parsed.count}d${parsed.sides}${
        parsed.modifier >= 0 ? '+' : ''
      }${parsed.modifier}${
        additionalModifier !== 0 
          ? (additionalModifier >= 0 ? '+' : '') + additionalModifier 
          : ''
      }`,
    };
  }

  /**
   * Parse dice notation (e.g., "2d6+3", "1d20-2")
   */
  private parseDice(dice: string): {
    count: number;
    sides: number;
    modifier: number;
  } | null {
    const match = dice.match(/^(\d+)d(\d+)([+-]\d+)?$/);
    if (!match) return null;

    return {
      count: parseInt(match[1]!, 10),
      sides: parseInt(match[2]!, 10),
      modifier: match[3] ? parseInt(match[3], 10) : 0,
    };
  }

  /**
   * Calculate success chance with modifiers (for UI preview)
   */
  calculateChance(
    baseProbability: number,
    modifiers: Modifier[] = [],
    context?: Record<string, any>
  ): number {
    let logitValue = this.logit(baseProbability);

    for (const modifier of modifiers) {
      if (this.checkModifierConditions(modifier, context)) {
        logitValue += modifier.value;
      }
    }

    return Math.max(0, Math.min(1, this.sigmoid(logitValue)));
  }
}