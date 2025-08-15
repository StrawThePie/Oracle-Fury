import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { Sparkles, Play, Upload, Book } from 'lucide-react';
import { useState } from 'react';

export default function MainMenu() {
  const navigate = useNavigate();
  const { startNewGame } = useGameStore();
  const [showNewGameOptions, setShowNewGameOptions] = useState(false);
  const [customSeed, setCustomSeed] = useState('');

  const handleNewGame = () => {
    startNewGame(customSeed || undefined);
    navigate('/game');
  };

  const handleLoadGame = () => {
    // TODO: Implement load game dialog
    console.log('Load game not yet implemented');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-oracle-950 to-oracle-900">
      <div className="text-center space-y-8 p-8 max-w-2xl">
        {/* Title */}
        <div className="space-y-4">
          <h1 className="text-6xl font-bold text-white flex items-center justify-center gap-4">
            <Sparkles className="text-oracle-400" size={48} />
            Oracle Fury
          </h1>
          <p className="text-xl text-oracle-200">
            A deterministic narrative RPG engine
          </p>
        </div>

        {/* Main Menu */}
        {!showNewGameOptions ? (
          <div className="space-y-4">
            <button
              onClick={() => setShowNewGameOptions(true)}
              className="w-full px-8 py-4 bg-oracle-600 hover:bg-oracle-500 text-white rounded-lg font-semibold text-lg transition-colors flex items-center justify-center gap-3"
            >
              <Play size={24} />
              New Game
            </button>

            <button
              onClick={handleLoadGame}
              className="w-full px-8 py-4 bg-oracle-800 hover:bg-oracle-700 text-white rounded-lg font-semibold text-lg transition-colors flex items-center justify-center gap-3"
            >
              <Upload size={24} />
              Load Game
            </button>

            <button
              onClick={() => window.open('/docs', '_blank')}
              className="w-full px-8 py-4 bg-oracle-900 hover:bg-oracle-800 text-white rounded-lg font-semibold text-lg transition-colors flex items-center justify-center gap-3"
            >
              <Book size={24} />
              Documentation
            </button>
          </div>
        ) : (
          /* New Game Options */
          <div className="space-y-6 bg-oracle-900/50 p-8 rounded-xl backdrop-blur-sm">
            <h2 className="text-2xl font-bold text-white">New Game Options</h2>
            
            <div className="space-y-4">
              <div className="text-left">
                <label htmlFor="seed" className="block text-sm font-medium text-oracle-200 mb-2">
                  Game Seed (Optional)
                </label>
                <input
                  id="seed"
                  type="text"
                  value={customSeed}
                  onChange={(e) => setCustomSeed(e.target.value)}
                  placeholder="Leave empty for random seed"
                  className="w-full px-4 py-2 bg-oracle-950 border border-oracle-700 rounded-lg text-white placeholder-oracle-400 focus:outline-none focus:ring-2 focus:ring-oracle-500"
                />
                <p className="mt-2 text-sm text-oracle-300">
                  Using the same seed will generate the same story events
                </p>
              </div>

              <div className="text-left">
                <label className="block text-sm font-medium text-oracle-200 mb-2">
                  Difficulty
                </label>
                <select className="w-full px-4 py-2 bg-oracle-950 border border-oracle-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-oracle-500">
                  <option>Normal</option>
                  <option>Hard</option>
                  <option>Ironman</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleNewGame}
                className="flex-1 px-6 py-3 bg-oracle-600 hover:bg-oracle-500 text-white rounded-lg font-semibold transition-colors"
              >
                Start Game
              </button>
              <button
                onClick={() => setShowNewGameOptions(false)}
                className="flex-1 px-6 py-3 bg-oracle-800 hover:bg-oracle-700 text-white rounded-lg font-semibold transition-colors"
              >
                Back
              </button>
            </div>
          </div>
        )}

        {/* Version */}
        <p className="text-sm text-oracle-400">
          Version 0.1.0 - Alpha
        </p>
      </div>
    </div>
  );
}