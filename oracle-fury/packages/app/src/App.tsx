import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import GameScreen from './screens/GameScreen';
import MainMenu from './screens/MainMenu';
import SettingsScreen from './screens/SettingsScreen';
import { useGameStore } from './store/gameStore';
import { useEffect } from 'react';

function App() {
  const initializeGame = useGameStore((state) => state.initialize);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background text-foreground">
        <Routes>
          <Route path="/" element={<MainMenu />} />
          <Route element={<Layout />}>
            <Route path="/game" element={<GameScreen />} />
            <Route path="/settings" element={<SettingsScreen />} />
          </Route>
        </Routes>
        <Toaster
          position="bottom-right"
          toastOptions={{
            className: 'bg-card text-card-foreground border border-border',
            duration: 4000,
          }}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;