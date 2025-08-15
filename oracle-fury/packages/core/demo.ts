import { SeededRandom, ResolutionEngine } from './src/rng';
import { RelationshipManager } from './src/relationships';
import { DowntimeManager } from './src/downtime';
import type { WorldState, Character } from './src/schemas';

console.log('Oracle Fury Core Engine Demo\n');

// Initialize RNG with seed for reproducibility
const rng = new SeededRandom('demo-seed-123');
console.log('1. Seeded Random Generation:');
console.log(`   Random value: ${rng.next()}`);
console.log(`   Random int (1-20): ${rng.nextInt(1, 20)}`);
console.log(`   Weighted selection: ${rng.pickWeighted([
  { item: 'Common (70%)', weight: 70 },
  { item: 'Rare (20%)', weight: 20 },
  { item: 'Epic (10%)', weight: 10 },
])}\n`);

// Demonstrate resolution engine
const resolution = new ResolutionEngine(rng);
console.log('2. Probability Resolution:');
const skillCheck = resolution.resolve(0.6, [
  { source: 'Skill bonus', value: 0.3 },
  { source: 'Equipment', value: 0.2 },
]);
console.log(`   Base chance: 60%`);
console.log(`   Modifiers: +0.3 (skill), +0.2 (equipment)`);
console.log(`   Final chance: ${(skillCheck.finalProbability * 100).toFixed(1)}%`);
console.log(`   Roll: ${(skillCheck.roll * 100).toFixed(1)}%`);
console.log(`   Result: ${skillCheck.success ? 'SUCCESS' : 'FAILURE'}\n`);

// Demonstrate relationships
console.log('3. Relationship System:');
const relationships = new RelationshipManager();
relationships.updateRelationship(
  'player', 
  'companion1',
  {
    heatChange: 2,
    bondChange: 1,
    event: 'Shared a meaningful conversation',
  },
  1
);
const rel = relationships.findRelationship('player', 'companion1');
console.log(`   Relationship (Player <-> Companion):`)
console.log(`   - Heat: ${rel?.heat} (emotional intensity)`);
console.log(`   - Bond: ${rel?.bond} (long-term connection)`);
console.log(`   - Type: ${rel?.type}\n`);

// Demonstrate downtime
console.log('4. Downtime Phase:');
const downtime = new DowntimeManager();
const worldState: WorldState = {
  id: 'demo',
  turn: 1,
  phase: 'narrative',
  flags: {},
  counters: {},
  activeModuleIds: ['core'],
};

const player: Character = {
  id: 'player',
  name: 'Demo Player',
  type: 'player',
  stats: {
    health: 80,
    maxHealth: 100,
    energy: 50,
    maxEnergy: 50,
  },
  tags: [],
  inventory: [],
};

downtime.startDowntime(worldState, 'camp');
const actions = downtime.getAvailableActions(worldState, player, relationships);
console.log(`   Started camp downtime with ${worldState.downtimeState?.actionsRemaining} actions`);
console.log(`   Available actions: ${actions.map(a => a.name).join(', ')}`);

// Execute an action
const result = downtime.executeAction('camp_rest', worldState, player, rng);
if (result) {
  console.log(`\n   Executed: ${result.action.name}`);
  console.log(`   Outcome: ${result.outcome.description}`);
  console.log(`   Effects: ${result.outcome.effects.map(e => `${e.type}(${e.target})`).join(', ')}`);
}

console.log('\nDemo complete!');