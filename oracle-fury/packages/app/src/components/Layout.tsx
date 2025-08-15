import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { 
  Menu, 
  Save, 
  Download, 
  Settings, 
  Shield,
  Home
} from 'lucide-react';
import { useState } from 'react';

export default function Layout() {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const {
    session,
    setShowSaveMenu,
    setShowLoadMenu,
    setShowSettings,
    setShowAdminPanel,
  } = useGameStore();

  if (!session) {
    navigate('/');
    return null;
  }

  return (
    <div className="flex min-h-screen">
      {/* Side Panel */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-64 bg-card border-r border-border
        transform transition-transform duration-200 ease-in-out
        ${showMenu ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-border">
            <h1 className="text-xl font-bold text-primary">Oracle Fury</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Turn {session.worldState.turn}
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            <Link
              to="/game"
              className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-secondary transition-colors"
            >
              <Home size={18} />
              <span>Game</span>
            </Link>
            
            <button
              onClick={() => setShowSaveMenu(true)}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-secondary transition-colors text-left"
            >
              <Save size={18} />
              <span>Save Game</span>
            </button>
            
            <button
              onClick={() => setShowLoadMenu(true)}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-secondary transition-colors text-left"
            >
              <Download size={18} />
              <span>Load Game</span>
            </button>
            
            <button
              onClick={() => setShowSettings(true)}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-secondary transition-colors text-left"
            >
              <Settings size={18} />
              <span>Settings</span>
            </button>
          </nav>

          {/* Bottom Actions */}
          <div className="p-4 border-t border-border">
            <button
              onClick={() => setShowAdminPanel(true)}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-secondary transition-colors text-left text-sm"
            >
              <Shield size={16} />
              <span>Admin Panel</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Menu Toggle */}
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-card border border-border rounded-md"
      >
        <Menu size={24} />
      </button>

      {/* Mobile Backdrop */}
      {showMenu && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setShowMenu(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
    </div>
  );
}