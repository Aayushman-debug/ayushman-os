import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Clock, ArrowRight, Lock, LogOut } from 'lucide-react';
import ThemeSelector from './ThemeSelector';
import { useAuth } from '@/context/AuthContext';

interface NavbarProps {
  onOpenCommandPalette: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCommandPalette }) => {
  const [time, setTime] = useState<string>('');
  const location = useLocation();
  const { isAdmin, logout } = useAuth();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const isPublicHome = location.pathname === '/';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-[#07090e]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Name */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-lg font-bold tracking-tight text-white group-hover:text-purple-300 transition">
              AYushMan
            </span>
          </Link>
        </div>

        {/* Center: Clock & Search Trigger */}
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.03] border border-white/5 text-xs font-mono text-neutral-400">
            <Clock className="size-3 text-neutral-500" />
            <span>{time || '18:00:00'} IST</span>
          </div>

          <button
            onClick={onOpenCommandPalette}
            className="flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-white/[0.03] hover:bg-white/[0.07] border border-white/5 hover:border-white/15 text-neutral-400 hover:text-white text-xs transition group cursor-pointer"
          >
            <Search className="size-3.5 text-neutral-500 group-hover:text-purple-300 transition" />
            <span>Search or jump to section...</span>
            <kbd className="px-1.5 py-0.5 rounded bg-black/40 border border-white/10 text-[10px] font-mono text-neutral-400">
              Ctrl+K
            </kbd>
          </button>
        </div>

        {/* Right side navigation */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Island World 3D Link */}
          <Link
            to="/world"
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 hover:text-emerald-200 text-xs font-semibold transition"
            title="Explore 3D Roblox Island World"
          >
            <span>🌴</span>
            <span className="hidden sm:inline">Island World</span>
          </Link>

          <ThemeSelector />

          {/* Unobtrusive Admin Entry or Authenticated Session Pill */}
          {isAdmin ? (
            <div className="flex items-center gap-2">
              <Link
                to="/settings"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 transition group cursor-pointer text-xs text-purple-200"
                title="Admin workspace"
              >
                Admin
              </Link>
              <button
                onClick={() => logout()}
                className="p-1.5 rounded-full text-neutral-400 hover:text-rose-300 hover:bg-rose-500/10 transition cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="size-3.5" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.03] hover:bg-purple-500/10 border border-white/10 hover:border-purple-500/30 text-neutral-300 hover:text-white text-xs font-medium transition cursor-pointer group"
              title="Administrator Sign In"
            >
              <Lock className="size-3 text-neutral-400 group-hover:text-purple-400 transition" />
              <span>Admin</span>
            </Link>
          )}

          <button
            onClick={onOpenCommandPalette}
            className="md:hidden p-2 rounded-lg bg-white/5 text-neutral-400 hover:text-white"
            aria-label="Search"
          >
            <Search className="size-4" />
          </button>

          {isPublicHome ? (
            <Link
              to="/social"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white text-black hover:bg-neutral-200 text-xs font-semibold transition"
            >
              <span>Explore</span>
              <ArrowRight className="size-3.5" />
            </Link>
          ) : (
            <Link
              to="/"
              className="px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white text-xs font-medium transition"
            >
              Home
            </Link>
          )}
        </div>

      </div>
    </header>
  );
};

export default Navbar;
