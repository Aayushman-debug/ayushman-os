/**
 * IslandHUD.tsx — Clean, Friendly Roblox-Inspired Island HUD
 *
 * Features:
 * - Location indicator (e.g. 📍 SUNSHINE PLAZA)
 * - Cheerful circular island minimap
 * - Controls guide and interactive prompt [E]
 * - Audio toggle & Pause menu
 * - Smooth transition button back to classic portfolio
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIslandStore } from './useIslandStore';
import { islandAudio } from './islandAudio';
import AvatarCreatorModal from './AvatarCreatorModal';
import WorldMapModal from './WorldMapModal';
import DialogueBoxModal from './DialogueBoxModal';
import InspectSheetModal from './InspectSheetModal';

/* ─── Circular Island Minimap ───────────────────────────────────────── */
function IslandMinimap() {
  const { playerPosition } = useIslandStore();
  const MAP_RADIUS = 52; // world coordinate bounds

  const [px, , pz] = playerPosition;
  const mx = (px / MAP_RADIUS) * 44 + 48;
  const my = (pz / MAP_RADIUS) * 44 + 48;

  return (
    <div
      className="relative w-24 h-24 rounded-full border-2 border-white shadow-lg overflow-hidden select-none bg-[#0284c7]"
      title="Sunshine Island Minimap"
    >
      {/* Island Green Landmass Circle */}
      <div
        className="absolute rounded-full bg-[#4ade80] border border-[#fef08a]"
        style={{
          width: '74%',
          height: '74%',
          top: '13%',
          left: '13%',
        }}
      />

      {/* Village Houses Dots */}
      <div className="absolute w-2 h-2 rounded-sm bg-[#ea580c] top-[40%] left-[38%]" />
      <div className="absolute w-2 h-2 rounded-sm bg-[#0284c7] top-[40%] left-[58%]" />
      <div className="absolute w-2 h-2 rounded-sm bg-[#0d9488] top-[56%] left-[36%]" />
      <div className="absolute w-2 h-2 rounded-sm bg-[#b45309] top-[56%] left-[60%]" />

      {/* Central Plaza Fountain Dot */}
      <div className="absolute w-2.5 h-2.5 rounded-full bg-white shadow-sm top-[46%] left-[46%]" />

      {/* Player Location Marker */}
      <div
        className="absolute w-3 h-3 rounded-full bg-[#dc2626] border-2 border-white shadow-md z-10 transition-all duration-75"
        style={{
          top: `${Math.max(6, Math.min(84, my))}%`,
          left: `${Math.max(6, Math.min(84, mx))}%`,
          transform: 'translate(-50%, -50%)',
        }}
      />

      {/* Compass Ring */}
      <div className="absolute top-1 left-1/2 -translate-x-1/2 text-[0.55rem] font-bold text-white/90 drop-shadow">
        N
      </div>
    </div>
  );
}

/* ─── Pause & Settings Modal ───────────────────────────────────────── */
function PauseModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const navigate = useNavigate();
  const { isMuted, toggleAudio, teleportTo } = useIslandStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 font-sans pointer-events-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-slate-800 border-4 border-amber-300">
        <div className="text-center mb-6">
          <div className="text-3xl mb-1">🌴</div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-wide">
            ISLAND LIFE
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            AYushMan 3D World · Game Paused
          </p>
        </div>

        <div className="space-y-3">
          {/* Resume */}
          <button
            onClick={onClose}
            className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-md transition-transform active:scale-95 text-sm"
          >
            RESUME ADVENTURE ▶
          </button>

          {/* Respawn at Plaza */}
          <button
            onClick={() => {
              teleportTo([0, 2, 4.5], 'SUNSHINE PLAZA');
              onClose();
            }}
            className="w-full py-2.5 px-4 bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold rounded-xl shadow-sm transition-transform active:scale-95 text-xs"
          >
            RESPAWN AT FOUNTAIN ⛲
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleAudio}
            className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs flex items-center justify-center gap-2"
          >
            <span>{isMuted ? '🔇' : '🔊'}</span>
            <span>{isMuted ? 'UNMUTE AUDIO' : 'MUTE SOUND'}</span>
          </button>

          {/* Return to Classic Website */}
          <button
            onClick={() => navigate('/landing')}
            className="w-full py-2.5 px-4 border-2 border-slate-200 hover:bg-slate-50 text-slate-600 font-bold rounded-xl text-xs transition-colors"
          >
            RETURN TO CLASSIC PORTFOLIO ↗
          </button>
        </div>

        <div className="mt-6 text-center text-[0.65rem] text-slate-400">
          Press [ESC] to resume anytime
        </div>
      </div>
    </div>
  );
}

/* ─── Main Island HUD Export ───────────────────────────────────────── */
export default function IslandHUD() {
  const navigate = useNavigate();
  const {
    currentArea,
    isMuted,
    toggleAudio,
    weather,
    cycleWeather,
    toastMessage,
    nearbyTarget,
    isCustomizerOpen,
    setCustomizerOpen,
    isMapOpen,
    setMapOpen,
    collectedStars,
    activeDialogue,
    inspectData,
  } = useIslandStore();
  const [pauseOpen, setPauseOpen] = useState(false);
  const [controlsGuideOpen, setControlsGuideOpen] = useState(false);

  // Background ocean breeze ambient start on first interaction
  useEffect(() => {
    const handleStartSound = () => {
      islandAudio.startAmbience();
      window.removeEventListener('pointerdown', handleStartSound);
      window.removeEventListener('keydown', handleStartSound);
    };
    window.addEventListener('pointerdown', handleStartSound);
    window.addEventListener('keydown', handleStartSound);
    return () => {
      window.removeEventListener('pointerdown', handleStartSound);
      window.removeEventListener('keydown', handleStartSound);
    };
  }, []);

  // Keyboard shortcut for pause [ESC], avatar [C], and map [M]
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Escape') {
        if (inspectData) {
          useIslandStore.getState().closeInspect();
        } else if (activeDialogue) {
          useIslandStore.getState().closeDialogue();
        } else if (isCustomizerOpen) {
          setCustomizerOpen(false);
        } else if (isMapOpen) {
          setMapOpen(false);
        } else {
          setPauseOpen((prev) => !prev);
        }
      } else if (e.code === 'KeyC' && !pauseOpen && !isMapOpen && !inspectData && !activeDialogue) {
        setCustomizerOpen(!isCustomizerOpen);
      } else if (e.code === 'KeyM' && !pauseOpen && !isCustomizerOpen && !inspectData && !activeDialogue) {
        setMapOpen(!isMapOpen);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [
    isCustomizerOpen,
    pauseOpen,
    isMapOpen,
    activeDialogue,
    inspectData,
    setCustomizerOpen,
    setMapOpen,
  ]);

  return (
    <div className="game-hud pointer-events-none fixed inset-0 z-50 font-sans select-none">
      {/* ── Toast Notification Banner ─────────────────────────────── */}
      {toastMessage && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 pointer-events-auto transition-all animate-bounce">
          <div className="px-5 py-2.5 bg-amber-400 text-slate-900 rounded-full font-bold text-xs shadow-xl border-2 border-white flex items-center gap-2">
            <span>✨</span>
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* ── Top-Left: Island Title & Location Pill ──────────────────── */}
      <div className="absolute top-4 left-4 sm:top-5 sm:left-5 pointer-events-auto flex flex-col gap-2 max-w-[calc(100vw-8rem)] sm:max-w-none">
        <div className="bg-white/92 backdrop-blur-md px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-2xl shadow-md border border-slate-200/80 flex items-center gap-2.5 sm:gap-3">
          <span className="text-lg sm:text-xl">🌴</span>
          <div>
            <div className="text-[0.62rem] sm:text-[0.68rem] font-bold text-emerald-700 tracking-wider uppercase">
              AYushMan // ISLAND LIFE
            </div>
            <div className="text-xs sm:text-sm font-extrabold text-slate-900 tracking-tight">
              {currentArea}
            </div>
          </div>
        </div>

        {/* Quick Nav / Action Pills */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => setCustomizerOpen(true)}
            className="bg-amber-400 hover:bg-amber-500 text-slate-950 text-[0.68rem] sm:text-[0.7rem] font-black px-2.5 py-1.2 sm:px-3 sm:py-1.5 rounded-xl shadow-sm border border-amber-300 transition-transform active:scale-95 flex items-center gap-1 cursor-pointer"
            title="Open Avatar Customizer [C]"
          >
            <span>👕</span>
            <span>Avatar [C]</span>
          </button>

          <button
            onClick={() => setMapOpen(true)}
            className="bg-sky-500 hover:bg-sky-600 text-white text-[0.68rem] sm:text-[0.7rem] font-black px-2.5 py-1.2 sm:px-3 sm:py-1.5 rounded-xl shadow-sm border border-sky-400 transition-transform active:scale-95 flex items-center gap-1 cursor-pointer"
            title="Open World Map & Fast Travel [M]"
          >
            <span>🗺️</span>
            <span>Map [M]</span>
          </button>

          <button
            onClick={() => setMapOpen(true)}
            className="bg-white/90 hover:bg-white text-amber-800 text-[0.68rem] sm:text-[0.7rem] font-black px-2.5 py-1.2 sm:px-3 sm:py-1.5 rounded-xl shadow-sm border border-slate-200 transition-transform active:scale-95 flex items-center gap-1 cursor-pointer"
            title="Click to view hidden star locations on map"
          >
            <span>🌟</span>
            <span>{collectedStars.length}/4</span>
          </button>

          <button
            onClick={cycleWeather}
            className="bg-indigo-50 hover:bg-indigo-100 text-indigo-900 text-[0.68rem] sm:text-[0.7rem] font-black px-2.5 py-1.2 sm:px-3 sm:py-1.5 rounded-xl shadow-sm border border-indigo-200 transition-transform active:scale-95 flex items-center gap-1 cursor-pointer"
            title="Cycle world weather"
          >
            <span>{weather === 'rain' ? '🌧️' : weather === 'fog' ? '🌫️' : weather === 'wind' ? '💨' : '☀️'}</span>
            <span>{weather.toUpperCase()}</span>
          </button>

          <button
            onClick={() => navigate('/')}
            className="bg-white/90 hover:bg-white text-slate-800 text-[0.68rem] sm:text-[0.7rem] font-bold px-2.5 py-1.2 sm:px-3 sm:py-1.5 rounded-xl shadow-sm border border-slate-200 transition-transform active:scale-95 flex items-center gap-1 cursor-pointer"
          >
            <span>📄</span>
            <span>Home</span>
          </button>

          <button
            onClick={() => setPauseOpen(true)}
            className="bg-white/90 hover:bg-white text-slate-800 text-[0.68rem] sm:text-[0.7rem] font-bold px-2.5 py-1.2 sm:px-3 sm:py-1.5 rounded-xl shadow-sm border border-slate-200 transition-transform active:scale-95 flex items-center gap-1 cursor-pointer"
          >
            <span>⚙️</span>
            <span>Menu</span>
          </button>
        </div>
      </div>

      {/* ── Top-Right: Minimap & Sound Button ──────────────────────── */}
      <div className="absolute top-5 right-5 pointer-events-auto flex flex-col items-end gap-2.5">
        <IslandMinimap />

        <div className="flex items-center gap-2">
          <button
            onClick={toggleAudio}
            className="w-8 h-8 rounded-full bg-white/90 hover:bg-white shadow-md border border-slate-200 flex items-center justify-center text-xs text-slate-700 active:scale-90 transition-transform"
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          >
            {isMuted ? '🔇' : '🔊'}
          </button>
        </div>
      </div>

      {/* ── Bottom-Center: Proximity Interaction Prompt ───────────── */}
      {nearbyTarget && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 pointer-events-auto animate-pulse">
          <div className="px-6 py-3 bg-white text-slate-900 rounded-2xl shadow-xl border-3 border-amber-400 flex items-center gap-3">
            <span className="w-6 h-6 rounded-lg bg-amber-400 font-extrabold text-xs flex items-center justify-center text-slate-900">
              E
            </span>
            <div>
              <div className="text-xs font-extrabold tracking-wide text-slate-800">
                {nearbyTarget.title}
              </div>
              <div className="text-[0.65rem] text-slate-500 font-medium">
                {nearbyTarget.subtitle}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Bottom-Right: Controls Legend ─────────────────────────── */}
      <div className="absolute bottom-5 right-5 pointer-events-auto">
        <button
          onClick={() => setControlsGuideOpen((v) => !v)}
          className="bg-white/85 hover:bg-white text-slate-700 text-[0.65rem] font-bold px-3 py-1.5 rounded-xl shadow-sm border border-slate-200"
        >
          {controlsGuideOpen ? '▾ HIDE CONTROLS' : '🎮 CONTROLS GUIDE'}
        </button>

        {controlsGuideOpen && (
          <div className="absolute bottom-9 right-0 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-slate-200 text-xs text-slate-700 w-52 space-y-1.5 mt-2">
            <div className="flex justify-between font-medium">
              <span className="font-bold text-slate-900">WASD / Arrows</span>
              <span>Move</span>
            </div>
            <div className="flex justify-between font-medium">
              <span className="font-bold text-slate-900">Mouse Drag</span>
              <span>Orbit Camera</span>
            </div>
            <div className="flex justify-between font-medium">
              <span className="font-bold text-slate-900">Shift</span>
              <span>Run / Sprint</span>
            </div>
            <div className="flex justify-between font-medium">
              <span className="font-bold text-slate-900">Space</span>
              <span>Jump</span>
            </div>
            <div className="flex justify-between font-medium">
              <span className="font-bold text-slate-900">E</span>
              <span>Talk / Inspect</span>
            </div>
            <div className="flex justify-between font-medium">
              <span className="font-bold text-slate-900">M</span>
              <span>World Map & Warp</span>
            </div>
            <div className="flex justify-between font-medium">
              <span className="font-bold text-slate-900">C</span>
              <span>Avatar Wardrobe</span>
            </div>
            <div className="flex justify-between font-medium">
              <span className="font-bold text-slate-900">ESC</span>
              <span>Pause Menu</span>
            </div>
          </div>
        )}
      </div>

      {/* Pause Modal */}
      <PauseModal isOpen={pauseOpen} onClose={() => setPauseOpen(false)} />

      {/* Avatar Creator Modal */}
      <AvatarCreatorModal />

      {/* Fullscreen Interactive World Map */}
      <WorldMapModal />

      {/* NPC Dialogue Box */}
      <DialogueBoxModal />

      {/* Object Inspection Modal */}
      <InspectSheetModal />
    </div>
  );
}
