/**
 * GamePage.tsx — Full-screen game entry point
 *
 * This is the new "/" public entry point.
 * It renders the 3D scene + HUD.
 * A small "ENTER OS" escape hatch allows admin to navigate to the classic dashboard.
 */
import React, { useEffect } from 'react';
import Scene from '../game/world/Scene';
import GameHUD from '../game/ui/GameHUD';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function GamePage() {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();

  // Boot sequence — brief flash before world loads
  const [booting, setBooting] = React.useState(true);
  useEffect(() => {
    const t = setTimeout(() => setBooting(false), 1800);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden" style={{ background: '#050810' }}>
      {/* Boot splash */}
      {booting && (
        <div
          className="absolute inset-0 z-[100] flex flex-col items-center justify-center"
          style={{ background: '#050810', fontFamily: 'monospace' }}
        >
          <div
            style={{
              color: '#00f5ff',
              fontSize: '2rem',
              fontWeight: 700,
              letterSpacing: '0.3em',
              textShadow: '0 0 30px #00f5ff',
              animation: 'pulse 0.8s ease-in-out infinite alternate',
            }}
          >
            AYUSHMAN
          </div>
          <div style={{ color: '#ff006e', fontSize: '0.75rem', letterSpacing: '0.5em', marginTop: 8 }}>
            NEON DISTRICT · BOOTING
          </div>
          <div
            className="mt-8 w-40 h-px"
            style={{
              background: 'linear-gradient(90deg, transparent, #00f5ff, transparent)',
              animation: 'shimmer 1.2s ease-in-out infinite',
            }}
          />
          <style>{`
            @keyframes shimmer {
              0% { opacity: 0.2; transform: scaleX(0.3); }
              50% { opacity: 1; transform: scaleX(1); }
              100% { opacity: 0.2; transform: scaleX(0.3); }
            }
          `}</style>
        </div>
      )}

      {/* 3D World */}
      <div className="absolute inset-0">
        <Scene />
      </div>

      {/* HUD */}
      {!booting && <GameHUD />}

      {/* Admin escape hatch — only visible if logged-in admin */}
      {isAdmin && !booting && (
        <button
          onClick={() => navigate('/dashboard')}
          className="fixed bottom-4 left-4 z-[70] text-xs tracking-widest px-3 py-1.5"
          style={{
            fontFamily: 'monospace',
            color: '#4a6080',
            background: 'rgba(5,8,16,0.85)',
            border: '1px solid #1a2a40',
            cursor: 'pointer',
          }}
        >
          ◈ ADMIN OS
        </button>
      )}

      {/* Login hint for visitors — unobtrusive */}
      {!user && !booting && (
        <button
          onClick={() => navigate('/login')}
          className="fixed bottom-4 left-4 z-[70] text-xs tracking-widest px-3 py-1.5"
          style={{
            fontFamily: 'monospace',
            color: '#2a3a50',
            background: 'transparent',
            border: '1px solid #1a2035',
            cursor: 'pointer',
          }}
        >
          ◈ ADMIN
        </button>
      )}
    </div>
  );
}
