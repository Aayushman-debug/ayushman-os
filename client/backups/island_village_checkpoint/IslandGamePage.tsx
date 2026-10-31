/**
 * IslandGamePage.tsx — Dedicated 3D Roblox Island Life Game Page
 *
 * Route: /world (and /game)
 * Contains the 3D Island Canvas, Roblox avatar, and Island HUD.
 */
import React, { useEffect, useState } from 'react';
import IslandScene from '../game/island/IslandScene';
import IslandHUD from '../game/island/IslandHUD';

export default function IslandGamePage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden bg-[#bae6fd]">
      {/* ── Sunny Welcome Intro Screen ──────────────────────────────── */}
      {loading && (
        <div className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-[#bae6fd] text-slate-800 font-sans">
          <div className="w-16 h-16 rounded-3xl bg-white shadow-xl flex items-center justify-center text-3xl mb-4 animate-bounce">
            🌴
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 mb-1">
            AYUSHMAN // ISLAND LIFE
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-emerald-700 tracking-wide">
            Entering Sunshine Bay · Welcome to the Island
          </p>
          <div className="mt-6 w-36 h-2 bg-white/60 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full animate-pulse w-full" />
          </div>
        </div>
      )}

      {/* ── 3D Island World ─────────────────────────────────────────── */}
      <div className="absolute inset-0">
        <IslandScene />
      </div>

      {/* ── Game HUD & Controls ─────────────────────────────────────── */}
      {!loading && <IslandHUD />}
    </div>
  );
}
