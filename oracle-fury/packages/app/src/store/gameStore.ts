import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { 
  WorldState, 
  Character, 
  Relationship, 
  Faction,
  SaveGame 
} from '@oracle-fury/core';
import { 
  SeededRandom, 
  ResolutionEngine,
  RelationshipManager,
  DowntimeManager
} from '@oracle-fury/core';

interface GameSession {
  worldState: WorldState;
  characters: Character[];
  relationships: Relationship[];
  factions: Faction[];
  playerCharacterId: string;
  currentNarrative: string;
  narrativeHistory: Array<{
    turn: number;
    text: string;
    choices?: string[];
    outcome?: string;
  }>;
}

interface GameStore {
  // Core game state
  session: GameSession | null;
  isLoading: boolean;
  
  // Engine instances
  rng: SeededRandom | null;
  resolutionEngine: ResolutionEngine | null;
  relationshipManager: RelationshipManager | null;
  downtimeManager: DowntimeManager | null;
  
  // Actions
  initialize: () => void;
  startNewGame: (seed?: string) => void;
  loadGame: (saveData: SaveGame) => void;
  saveGame: (name: string) => SaveGame;
  
  // Game actions
  makeChoice: (choiceId: string) => void;
  startDowntime: (type: 'hyperspace' | 'camp' | 'base') => void;
  executeDowntimeAction: (actionId: string, targetId?: string) => void;
  endDowntime: () => void;
  
  // UI state
  showSaveMenu: boolean;
  showLoadMenu: boolean;
  showSettings: boolean;
  showAdminPanel: boolean;
  setShowSaveMenu: (show: boolean) => void;
  setShowLoadMenu: (show: boolean) => void;
  setShowSettings: (show: boolean) => void;
  setShowAdminPanel: (show: boolean) => void;
}

export const useGameStore = create<GameStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        session: null,
        isLoading: false,
        rng: null,
        resolutionEngine: null,
        relationshipManager: null,
        downtimeManager: null,
        
        // UI state
        showSaveMenu: false,
        showLoadMenu: false,
        showSettings: false,
        showAdminPanel: false,
        
        // Initialize game systems
        initialize: () => {
          const seed = Date.now().toString();
          const rng = new SeededRandom(seed);
          const resolutionEngine = new ResolutionEngine(rng);
          const relationshipManager = new RelationshipManager();
          const downtimeManager = new DowntimeManager();
          
          set({
            rng,
            resolutionEngine,
            relationshipManager,
            downtimeManager,
          });
        },
        
        // Start new game
        startNewGame: (seed) => {
          const gameSeed = seed || Date.now().toString();
          const rng = new SeededRandom(gameSeed);
          const resolutionEngine = new ResolutionEngine(rng);
          const relationshipManager = new RelationshipManager();
          const downtimeManager = new DowntimeManager();
          
          // Create initial game state
          const playerCharacter: Character = {
            id: 'player',
            name: 'Captain',
            type: 'player',
            stats: {
              health: 100,
              maxHealth: 100,
              energy: 50,
              maxEnergy: 50,
            },
            tags: ['protagonist'],
            inventory: [],
          };
          
          const worldState: WorldState = {
            id: 'main',
            turn: 0,
            phase: 'narrative',
            flags: {},
            counters: {
              morale: 50,
              credits: 1000,
            },
            activeModuleIds: ['core'],
            partyIds: ['player'],
            randomSeed: gameSeed,
          };
          
          const session: GameSession = {
            worldState,
            characters: [playerCharacter],
            relationships: [],
            factions: [],
            playerCharacterId: 'player',
            currentNarrative: 'Welcome to Oracle Fury. Your journey begins...',
            narrativeHistory: [{
              turn: 0,
              text: 'Welcome to Oracle Fury. Your journey begins...',
            }],
          };
          
          set({
            session,
            rng,
            resolutionEngine,
            relationshipManager,
            downtimeManager,
          });
        },
        
        // Load game
        loadGame: (saveData) => {
          const { rng, resolutionEngine, relationshipManager, downtimeManager } = get();
          
          if (!rng || !relationshipManager) return;
          
          // Reset RNG to saved seed
          if (saveData.replayData?.initialSeed) {
            rng.reset(saveData.replayData.initialSeed);
          }
          
          // Import relationships
          relationshipManager.importRelationships(saveData.relationships);
          
          // Create session from save data
          const session: GameSession = {
            worldState: saveData.worldState,
            characters: saveData.characters,
            relationships: saveData.relationships,
            factions: saveData.factions,
            playerCharacterId: saveData.worldState.partyIds?.[0] || 'player',
            currentNarrative: 'Game loaded successfully.',
            narrativeHistory: [{
              turn: saveData.worldState.turn,
              text: 'Game loaded successfully.',
            }],
          };
          
          set({ session });
        },
        
        // Save game
        saveGame: (name) => {
          const { session } = get();
          if (!session) throw new Error('No active game session');
          
          const saveData: SaveGame = {
            version: '0.1.0',
            timestamp: new Date().toISOString(),
            name,
            worldState: session.worldState,
            characters: session.characters,
            relationships: session.relationships,
            factions: session.factions,
            replayData: {
              initialSeed: session.worldState.randomSeed,
            },
          };
          
          return saveData;
        },
        
        // Make a narrative choice
        makeChoice: (choiceId) => {
          const { session, rng } = get();
          if (!session || !rng) return;
          
          // TODO: Implement choice resolution with event system
          
          // Update turn
          session.worldState.turn += 1;
          
          set({ session: { ...session } });
        },
        
        // Start downtime phase
        startDowntime: (type) => {
          const { session, downtimeManager } = get();
          if (!session || !downtimeManager) return;
          
          downtimeManager.startDowntime(session.worldState, type);
          
          session.currentNarrative = `You've entered ${type} downtime. Choose your actions wisely.`;
          session.narrativeHistory.push({
            turn: session.worldState.turn,
            text: session.currentNarrative,
          });
          
          set({ session: { ...session } });
        },
        
        // Execute downtime action
        executeDowntimeAction: (actionId, targetId) => {
          const { session, downtimeManager, rng } = get();
          if (!session || !downtimeManager || !rng) return;
          
          const player = session.characters.find(c => c.id === session.playerCharacterId);
          if (!player) return;
          
          const result = downtimeManager.executeAction(
            actionId,
            session.worldState,
            player,
            rng,
            targetId
          );
          
          if (result) {
            session.currentNarrative = result.outcome.narrative || result.outcome.description;
            session.narrativeHistory.push({
              turn: session.worldState.turn,
              text: session.currentNarrative,
            });
            
            // TODO: Apply effects to game state
          }
          
          set({ session: { ...session } });
        },
        
        // End downtime
        endDowntime: () => {
          const { session, downtimeManager, relationshipManager } = get();
          if (!session || !downtimeManager || !relationshipManager) return;
          
          downtimeManager.endDowntime(session.worldState, relationshipManager);
          
          session.worldState.turn += 1;
          session.currentNarrative = 'Downtime has ended. The journey continues...';
          session.narrativeHistory.push({
            turn: session.worldState.turn,
            text: session.currentNarrative,
          });
          
          set({ session: { ...session } });
        },
        
        // UI actions
        setShowSaveMenu: (show) => set({ showSaveMenu: show }),
        setShowLoadMenu: (show) => set({ showLoadMenu: show }),
        setShowSettings: (show) => set({ showSettings: show }),
        setShowAdminPanel: (show) => set({ showAdminPanel: show }),
      }),
      {
        name: 'oracle-fury-game',
        partialize: (state) => ({
          // Only persist the save game data, not the engine instances
          session: state.session,
        }),
      }
    )
  )
);