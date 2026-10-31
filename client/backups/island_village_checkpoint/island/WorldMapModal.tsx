/**
 * WorldMapModal.tsx — Fullscreen Interactive World Map & Fast Travel
 *
 * Toggled via [M] key or Map button on HUD
 * Displays:
 * - Stylized 2D island map with all districts & points of interest
 * - Real-time player coordinate pinpoint
 * - Star collectibles count & badge progress
 * - One-click Fast Travel teleportation to any landmark
 */
import React, { useEffect } from 'react';
import { useIslandStore } from './useIslandStore';
import { X, Navigation, Sparkles, MapPin } from 'lucide-react';

interface LandmarkPin {
  id: string;
  name: string;
  district: string;
  emoji: string;
  pos: [number, number, number];
  desc: string;
  // Normalized 0-100 coordinates for the map canvas
  mapX: number;
  mapY: number;
}

const LANDMARKS: LandmarkPin[] = [
  {
    id: 'plaza',
    name: 'Sunshine Plaza',
    district: 'Starting Village',
    emoji: '⛲',
    pos: [0, 2, 4.5],
    desc: 'Central island spawn fountain, signposts, and wardrobe mirror',
    mapX: 50,
    mapY: 55,
  },
  {
    id: 'cottage',
    name: 'Sunshine Cottage',
    district: 'Home Island',
    emoji: '🏡',
    pos: [-9, 2, -3.5],
    desc: 'Enterable home with developer workstation & stone fireplace',
    mapX: 40,
    mapY: 46,
  },
  {
    id: 'store',
    name: 'Village Archive',
    district: 'Public Directory',
    emoji: '🏪',
    pos: [-9, 2, 5.5],
    desc: 'Enterable emporium with visitor terminal & technical specs',
    mapX: 40,
    mapY: 56,
  },
  {
    id: 'dev_village',
    name: 'Developer Village',
    district: 'Software Studio',
    emoji: '💻',
    pos: [-24, 2, 0],
    desc: 'Interactive software terminals, tech stack, and GitHub builds',
    mapX: 23,
    mapY: 50,
  },
  {
    id: 'university',
    name: 'University Town',
    district: 'Academics',
    emoji: '🎓',
    pos: [24, 2, -15],
    desc: 'Campus grounds, algorithms, and academic achievements',
    mapX: 77,
    mapY: 33,
  },
  {
    id: 'arcade_pier',
    name: 'Arcade Bay & Pier',
    district: 'Entertainment',
    emoji: '🎮',
    pos: [0, 2, 23.5],
    desc: 'Southern coastal pier, fishing spots, and lo-fi tunes',
    mapX: 50,
    mapY: 76,
  },
  {
    id: 'social_harbour',
    name: 'Social Harbour',
    district: 'Identity & Contacts',
    emoji: '⚓',
    pos: [-22, 2, 20],
    desc: 'South-west dock pier with communication beacon and social channels',
    mapX: 26,
    mapY: 72,
  },
  {
    id: 'forest',
    name: 'Discovery Forest',
    district: 'Exploration',
    emoji: '🌲',
    pos: [0, 2, -26],
    desc: 'Ancient woods, secret clearings, and island mysteries',
    mapX: 50,
    mapY: 21,
  },
  {
    id: 'lighthouse',
    name: 'Coastal Lighthouse',
    district: 'East Coast',
    emoji: '🗼',
    pos: [32, 2, 24],
    desc: 'Rotating beacon tower and ocean vantage lookout',
    mapX: 86,
    mapY: 77,
  },
];

export default function WorldMapModal() {
  const {
    isMapOpen,
    setMapOpen,
    playerPosition,
    teleportTo,
    collectedStars,
    currentArea,
  } = useIslandStore();

  useEffect(() => {
    if (!isMapOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'KeyM' || e.code === 'Escape') {
        setMapOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isMapOpen, setMapOpen]);

  if (!isMapOpen) return null;

  // Calculate player map percentage (bounds -45 to +45)
  const [px, , pz] = playerPosition;
  const playerMapX = Math.max(8, Math.min(92, ((px + 45) / 90) * 100));
  const playerMapY = Math.max(8, Math.min(92, ((pz + 45) / 90) * 100));

  return (
    <div
      onClick={() => setMapOpen(false)}
      className="fixed inset-0 z-[130] flex items-center justify-center bg-black/65 backdrop-blur-md p-3 sm:p-6 font-sans select-none pointer-events-auto animate-fadeIn"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl shadow-2xl border-4 border-amber-300 max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden text-slate-800 pointer-events-auto"
      >
        
        {/* ── Modal Header ────────────────────────────────────────── */}
        <div className="px-6 py-4 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-300 flex items-center justify-between border-b-2 border-amber-200">
          <div className="flex items-center gap-3">
            <span className="text-2xl p-1.5 bg-white/70 rounded-xl shadow-sm">🗺️</span>
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-wide flex items-center gap-2">
                SUNSHINE ISLAND // WORLD MAP
              </h2>
              <p className="text-xs font-semibold text-amber-900/80">
                Explore all 6 districts or click any landmark to Fast Travel
              </p>
            </div>
          </div>

          <button
            onClick={() => setMapOpen(false)}
            className="w-9 h-9 rounded-full bg-white/80 hover:bg-white text-slate-800 flex items-center justify-center font-bold text-lg shadow-sm transition-transform active:scale-90"
            title="Close Map [M / ESC]"
          >
            <X className="w-5 h-5 text-slate-700" />
          </button>
        </div>

        {/* ── Summary Stats Ribbon ────────────────────────────────── */}
        <div className="px-6 py-2.5 bg-slate-100 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 font-bold text-slate-700">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>Current:</span>
              <span className="text-slate-900 font-extrabold uppercase">{currentArea}</span>
            </div>

            <div className="flex items-center gap-1.5 font-bold text-amber-600">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Stars:</span>
              <span className="text-slate-900 font-extrabold">
                {collectedStars.length} / 4 Discovered
              </span>
            </div>
          </div>

          <div className="text-[0.68rem] text-slate-400 font-medium">
            Click any pin or button below to Fast Travel instantly
          </div>
        </div>

        {/* ── Main Split View ──────────────────────────────────────── */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
          
          {/* Left Canvas: Stylized 2D Island Map (md: 7 cols) */}
          <div className="md:col-span-7 bg-[#0284c7] relative flex items-center justify-center p-6 overflow-hidden min-h-[300px]">
            {/* Soft Ocean Wave Ripples */}
            <div className="absolute inset-4 rounded-full border-4 border-dashed border-white/20 animate-spin duration-[40000ms]" />

            {/* Sandy Beach Outer Coast */}
            <div className="relative w-[280px] h-[280px] sm:w-[340px] sm:h-[340px] rounded-full bg-[#fef08a] shadow-2xl flex items-center justify-center border-4 border-amber-200">
              {/* Green Island Landmass */}
              <div className="w-[82%] h-[82%] rounded-full bg-[#4ade80] shadow-inner relative overflow-hidden border-2 border-emerald-400">
                {/* Rolling Green Hills & Forest Areas */}
                <div className="absolute -top-4 left-1/4 w-32 h-32 rounded-full bg-[#22c55e]/40" />
                <div className="absolute -bottom-6 -right-6 w-36 h-36 rounded-full bg-[#16a34a]/30" />

                {/* Inland Pond */}
                <div className="absolute top-[28%] left-[24%] w-12 h-10 rounded-full bg-[#38bdf8] border border-white/60" />

                {/* Cobblestone Village Plaza Circle */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-[#e2e8f0] border-2 border-[#94a3b8]" />

                {/* Compass Star in Background */}
                <div className="absolute top-2 right-2 text-white/50 text-xs font-black tracking-widest pointer-events-none">
                  N ▲
                </div>
              </div>

              {/* Landmark Map Pins */}
              {LANDMARKS.map((lm) => (
                <button
                  key={lm.id}
                  onClick={() => teleportTo(lm.pos, lm.name)}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer transition-transform hover:scale-125 z-20"
                  style={{ left: `${lm.mapX}%`, top: `${lm.mapY}%` }}
                  title={`${lm.name} — Click to Warp`}
                >
                  <div className="w-7 h-7 rounded-full bg-white shadow-lg border-2 border-amber-400 flex items-center justify-center text-xs group-hover:bg-amber-300 transition-colors">
                    {lm.emoji}
                  </div>
                  {/* Hover Tooltip */}
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[0.62rem] font-bold px-2 py-0.5 rounded shadow whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    {lm.name}
                  </div>
                </button>
              ))}

              {/* Live Player Position Pin */}
              <div
                className="absolute -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none transition-all duration-300"
                style={{ left: `${playerMapX}%`, top: `${playerMapY}%` }}
              >
                <div className="relative">
                  <div className="w-4 h-4 rounded-full bg-red-600 border-2 border-white shadow-xl animate-ping opacity-75" />
                  <div className="absolute inset-0 w-4 h-4 rounded-full bg-red-600 border-2 border-white shadow-lg flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: Fast Travel Landmark Directory (md: 5 cols) */}
          <div className="md:col-span-5 bg-slate-50 flex flex-col overflow-hidden border-t md:border-t-0 md:border-l border-slate-200">
            <div className="p-3 bg-slate-100/90 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center justify-between">
              <span>Fast Travel Destinations</span>
              <Navigation className="w-3.5 h-3.5 text-amber-600" />
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {LANDMARKS.map((lm) => (
                <div
                  key={lm.id}
                  className="p-3 rounded-2xl bg-white border border-slate-200 hover:border-amber-400 hover:shadow-sm transition-all flex items-center justify-between gap-2.5"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl p-2 bg-slate-100 rounded-xl">{lm.emoji}</span>
                    <div>
                      <div className="text-xs font-black text-slate-800">{lm.name}</div>
                      <div className="text-[0.65rem] text-slate-500 font-medium">{lm.desc}</div>
                    </div>
                  </div>

                  <button
                    onClick={() => teleportTo(lm.pos, lm.name)}
                    className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-[0.68rem] shadow-sm transition-transform active:scale-95 whitespace-nowrap"
                  >
                    WARP ⚡
                  </button>
                </div>
              ))}
            </div>

            <div className="p-3 bg-white border-t border-slate-200 text-center text-[0.68rem] text-slate-400">
              Press [M] to close map anytime
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
