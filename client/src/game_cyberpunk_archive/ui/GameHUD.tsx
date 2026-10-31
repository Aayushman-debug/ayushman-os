/**
 * GameHUD.tsx — In-game heads-up display overlay
 *
 * Elements:
 * - Top-left: district name + coordinates
 * - Bottom-center: interaction prompt (E key) when near a target
 * - Bottom-right: controls legend toggle
 * - Top-right: minimap placeholder
 * - Full-screen overlay: district info panel (on interact)
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/useGameStore';
import DialogPanel from './DialogPanel';
import TacticalMapModal from './TacticalMapModal';
import TouchControls from './TouchControls';
import { sound } from '../audio/soundEngine';
import {
  CentralNexusContent,
  MemoryLaneContent,
  AcademiaContent,
  TechCoreContent,
  Arcade99Content,
  SkyportContent,
} from '../world/terminalContents';

/* ─── Scanline overlay (pure CSS) ─────────────────────────────────── */
function Scanlines() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[60]"
      style={{
        background:
          'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.07) 2px, rgba(0,0,0,0.07) 4px)',
      }}
    />
  );
}

/* ─── Vignette ────────────────────────────────────────────────────── */
function Vignette() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[59]"
      style={{
        background:
          'radial-gradient(ellipse at center, transparent 55%, rgba(5,8,16,0.85) 100%)',
      }}
    />
  );
}

/* ─── Notification banner ─────────────────────────────────────────── */
function NotificationBanner() {
  const { notification } = useGameStore();
  if (!notification) return null;

  return (
    <div
      className="fixed top-6 left-1/2 -translate-x-1/2 z-[75] pointer-events-none"
      style={{ fontFamily: 'monospace' }}
    >
      <div
        className="px-5 py-2 flex items-center gap-3 border"
        style={{
          background: 'rgba(5, 8, 16, 0.96)',
          borderColor: '#00f5ff',
          boxShadow: '0 0 25px rgba(0, 245, 255, 0.4)',
          color: '#00f5ff',
          fontSize: '0.75rem',
          letterSpacing: '0.15em',
        }}
      >
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: '#00f5ff',
            boxShadow: '0 0 8px #00f5ff',
          }}
        />
        <span>{notification}</span>
      </div>
    </div>
  );
}

/* ─── District badge (top-left) ─────────────────────────────────── */
function DistrictBadge() {
  const {
    currentDistrict,
    playerPosition,
    visitedDistricts,
    contactedNpcs,
    collectedShards,
    soundMuted,
    toggleSoundMuted,
    cameraMode,
    cycleCameraMode,
  } = useGameStore();
  const label = currentDistrict.replace(/_/g, ' ').toUpperCase();
  const [x, , z] = playerPosition;

  return (
    <div className="fixed top-4 left-4 z-[70] select-none flex flex-col gap-1.5">
      <div>
        <div
          style={{ fontFamily: 'monospace', color: '#00f5ff', textShadow: '0 0 10px #00f5ff' }}
          className="text-xs tracking-widest mb-0.5 opacity-90 font-bold"
        >
          ◈ NEON DISTRICT · {label}
        </div>
        <div
          style={{ fontFamily: 'monospace', color: '#4a6080', fontSize: '0.65rem' }}
          className="tracking-wider flex flex-wrap items-center gap-2"
        >
          <span>{Math.round(x).toString().padStart(4, '0')} · {Math.round(z).toString().padStart(4, '0')}</span>
          <span className="text-[#00f5ff] opacity-40">|</span>
          <span className="text-slate-300">ARCHIVES: {visitedDistricts.length}/6</span>
          <span className="text-[#00f5ff] opacity-40">|</span>
          <span className="text-slate-300">SIGNALS: {contactedNpcs.length}/4</span>
          <span className="text-[#00f5ff] opacity-40">|</span>
          <span style={{ color: collectedShards.length === 5 ? '#ffb700' : '#8899aa' }}>
            SHARDS: {collectedShards.length}/5
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-0.5">
        <button
          onClick={toggleSoundMuted}
          style={{
            fontFamily: 'monospace',
            fontSize: '0.62rem',
            color: soundMuted ? '#4a6080' : '#00f5ff',
            border: `1px solid ${soundMuted ? '#1a2538' : 'rgba(0,245,255,0.4)'}`,
            background: 'rgba(5,8,16,0.85)',
            padding: '2px 8px',
            cursor: 'pointer',
          }}
        >
          {soundMuted ? '🔇 AUDIO MUTED' : '🔊 CYBER AUDIO ON'}
        </button>
        <button
          onClick={cycleCameraMode}
          title="Press [V] to switch camera perspective"
          style={{
            fontFamily: 'monospace',
            fontSize: '0.62rem',
            color: '#ffb700',
            border: '1px solid rgba(255,183,0,0.4)',
            background: 'rgba(5,8,16,0.85)',
            padding: '2px 8px',
            cursor: 'pointer',
          }}
        >
          📷 CAM: {cameraMode.toUpperCase()} [V]
        </button>
      </div>
    </div>
  );
}

/* ─── Interaction prompt (bottom-center) ────────────────────────── */
function InteractionPrompt() {
  const { nearbyTarget } = useGameStore();
  const [visible, setVisible] = useState(false);
  const [pulsed, setPulsed] = useState(false);

  useEffect(() => {
    if (nearbyTarget) {
      setVisible(true);
      // Pulse animation trigger
      setPulsed(false);
      const t = setTimeout(() => setPulsed(true), 50);
      return () => clearTimeout(t);
    } else {
      setVisible(false);
    }
  }, [nearbyTarget]);

  if (!visible || !nearbyTarget) return null;

  return (
    <div
      className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[70] pointer-events-none"
      style={{
        transform: `translateX(-50%) translateY(${pulsed ? '0px' : '16px'})`,
        opacity: pulsed ? 1 : 0,
        transition: 'all 0.35s cubic-bezier(0.34,1.56,0.64,1)',
      }}
    >
      <div
        className="px-6 py-3 rounded-sm flex items-center gap-3"
        style={{
          background: 'rgba(5, 8, 16, 0.88)',
          border: '1px solid #00f5ff',
          boxShadow: '0 0 20px rgba(0,245,255,0.3), inset 0 0 20px rgba(0,245,255,0.05)',
          fontFamily: 'monospace',
        }}
      >
        <span
          className="px-2 py-0.5 text-xs font-bold rounded"
          style={{
            background: '#00f5ff',
            color: '#050810',
            boxShadow: '0 0 10px #00f5ff',
          }}
        >
          E
        </span>
        <div>
          <div style={{ color: '#00f5ff', fontSize: '0.75rem', letterSpacing: '0.1em' }}>
            ENTER · {nearbyTarget.label}
          </div>
          <div style={{ color: '#4a6080', fontSize: '0.6rem', letterSpacing: '0.05em', marginTop: 2 }}>
            {nearbyTarget.hint}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Controls legend (bottom-right) ─────────────────────────────── */
function ControlsLegend() {
  const [open, setOpen] = useState(false);
  return (
    <div className="fixed bottom-4 right-4 z-[70] select-none">
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          fontFamily: 'monospace',
          color: '#4a6080',
          fontSize: '0.65rem',
          letterSpacing: '0.1em',
          background: 'transparent',
          border: '1px solid #1a2a40',
          padding: '4px 8px',
          cursor: 'pointer',
        }}
      >
        {open ? '▾ CONTROLS' : '▸ CONTROLS'}
      </button>
      {open && (
        <div
          className="absolute bottom-8 right-0 p-3 text-xs space-y-1 min-w-[160px]"
          style={{
            fontFamily: 'monospace',
            background: 'rgba(5,8,16,0.92)',
            border: '1px solid #1a2a40',
            color: '#4a6080',
          }}
        >
          {[
            ['WASD / ↑↓←→', 'Move'],
            ['Mouse Drag', 'Camera Look'],
            ['SHIFT', 'Sprint'],
            ['SPACE', 'Jump'],
            ['E', 'Interact / Terminal'],
            ['V', 'Camera Perspective'],
            ['M', 'Tactical Fast-Travel'],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between gap-4">
              <span style={{ color: '#00f5ff' }}>{k}</span>
              <span>{v}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Minimap (top-right) ─────────────────────────────────────────── */
const DISTRICT_POSITIONS = [
  { id: 'central_nexus', pos: [0, -18], color: '#00f5ff' },
  { id: 'memory_lane',   pos: [-22, -8],  color: '#ff006e' },
  { id: 'academia',      pos: [22, -8],   color: '#ffb700' },
  { id: 'tech_core',     pos: [-16, 14],  color: '#00f5ff' },
  { id: 'arcade_99',     pos: [16, 14],   color: '#ff006e' },
  { id: 'skyport',       pos: [0, 20],    color: '#ffb700' },
];

function Minimap() {
  const { minimapVisible, playerPosition, setTacticalMapOpen } = useGameStore();
  if (!minimapVisible) return null;

  const MAP_SIZE = 105;
  const WORLD_RANGE = 35; // ±35 units visible on minimap

  const worldToMap = (wx: number, wz: number) => ({
    x: ((wx / WORLD_RANGE) * 0.5 + 0.5) * MAP_SIZE,
    y: ((wz / WORLD_RANGE) * 0.5 + 0.5) * MAP_SIZE,
  });

  const [px, , pz] = playerPosition;
  const pMap = worldToMap(px, pz);

  return (
    <div
      onClick={() => setTacticalMapOpen(true)}
      title="Click or press [M] to open Tactical Fast-Travel Map"
      className="fixed top-4 right-4 z-[70] select-none cursor-pointer group transition-transform hover:scale-105"
      style={{
        width: MAP_SIZE,
        height: MAP_SIZE,
        background: 'rgba(5,8,16,0.92)',
        border: '1px solid #00f5ff',
        boxShadow: '0 0 15px rgba(0,245,255,0.25)',
        overflow: 'hidden',
      }}
    >
      {/* Radar sweep line */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, rgba(0,245,255,0.15) 0%, transparent 80%)',
          animation: 'radarSweep 3s linear infinite',
        }}
      />

      {/* District dots */}
      {DISTRICT_POSITIONS.map((d) => {
        const m = worldToMap(d.pos[0], d.pos[1]);
        return (
          <div
            key={d.id}
            style={{
              position: 'absolute',
              left: m.x - 4,
              top: m.y - 4,
              width: 8,
              height: 8,
              borderRadius: 1,
              background: d.color,
              opacity: 0.75,
              boxShadow: `0 0 6px ${d.color}`,
            }}
          />
        );
      })}

      {/* Player dot */}
      <div
        style={{
          position: 'absolute',
          left: pMap.x - 3,
          top: pMap.y - 3,
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: '#ffffff',
          boxShadow: '0 0 10px #ffffff',
          zIndex: 5,
        }}
      />

      {/* Label */}
      <div
        style={{
          position: 'absolute',
          bottom: 2,
          right: 4,
          fontFamily: 'monospace',
          fontSize: '0.45rem',
          color: '#00f5ff',
          letterSpacing: '0.05em',
        }}
        className="group-hover:text-white"
      >
        [M] FAST-TRAVEL
      </div>

      <style>{`
        @keyframes radarSweep {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
      `}</style>
    </div>
  );
}

/* ─── District info overlay (when E is pressed) ──────────────────── */
function DistrictOverlay() {
  const { activeOverlay, closeOverlay, nearbyTarget } = useGameStore();
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Escape') closeOverlay();
      if (e.code === 'KeyE' && nearbyTarget && !activeOverlay) {
        // Open handled via separate listener in GamePage
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [closeOverlay, nearbyTarget, activeOverlay]);

  if (!activeOverlay) return null;

  const district = DISTRICT_POSITIONS.find((d) => d.id === activeOverlay);
  const color = district?.color ?? '#00f5ff';

  const renderContent = () => {
    switch (activeOverlay) {
      case 'central_nexus': return <CentralNexusContent />;
      case 'memory_lane': return <MemoryLaneContent />;
      case 'academia': return <AcademiaContent />;
      case 'tech_core': return <TechCoreContent />;
      case 'arcade_99': return <Arcade99Content />;
      case 'skyport': return <SkyportContent />;
      default: return <div>Signal stream active.</div>;
    }
  };

  const getDistrictRoute = () => {
    switch (activeOverlay) {
      case 'central_nexus': return '/landing';
      case 'memory_lane': return '/social';
      case 'academia': return '/academics';
      case 'tech_core': return '/developer';
      case 'arcade_99': return '/entertainment';
      case 'skyport': return '/social';
      default: return '/';
    }
  };

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center p-4"
      style={{ background: 'rgba(5,8,16,0.92)', backdropFilter: 'blur(8px)' }}
    >
      <div
        className="relative max-w-3xl w-full max-h-[88vh] flex flex-col"
        style={{
          border: `1px solid ${color}`,
          boxShadow: `0 0 40px ${color}33, inset 0 0 40px ${color}0a`,
          background: 'rgba(5,8,16,0.97)',
          fontFamily: 'monospace',
        }}
      >
        {/* Header Bar */}
        <div
          className="flex items-center justify-between px-5 py-3 border-b shrink-0"
          style={{ borderColor: `${color}33`, background: `${color}08` }}
        >
          <div className="flex items-center gap-3">
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: color,
                boxShadow: `0 0 10px ${color}`,
              }}
            />
            <div>
              <div style={{ color, fontSize: '0.62rem', letterSpacing: '0.2em' }}>
                ◈ TERMINAL LINK ESTABLISHED
              </div>
              <div style={{ color: '#ffffff', fontSize: '1rem', fontWeight: 700 }}>
                {activeOverlay.replace(/_/g, ' ').toUpperCase()}
              </div>
            </div>
          </div>
          <button
            onClick={closeOverlay}
            className="px-3 py-1 text-xs opacity-70 hover:opacity-100 transition-opacity"
            style={{ color, border: `1px solid ${color}55`, background: 'transparent', cursor: 'pointer' }}
          >
            ✕ ESC
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-6 text-sm" style={{ color: '#c8d8e8' }}>
          {renderContent()}
        </div>

        {/* Action / Footer Bar */}
        <div
          className="p-4 border-t shrink-0 flex flex-wrap items-center justify-between gap-3"
          style={{ borderColor: `${color}22`, background: 'rgba(5,8,16,0.9)' }}
        >
          <div style={{ fontSize: '0.62rem', color: '#4a6080', letterSpacing: '0.1em' }}>
            PRESS ESC TO EXIT · OR LAUNCH FULL WEB VIEW
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                closeOverlay();
                navigate(getDistrictRoute());
              }}
              className="py-1.5 px-4 text-xs font-bold tracking-widest"
              style={{
                background: color,
                color: '#050810',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              FULL WEB VIEW ↗
            </button>
            <button
              onClick={closeOverlay}
              className="py-1.5 px-3 text-xs tracking-widest"
              style={{
                background: 'transparent',
                color,
                border: `1px solid ${color}`,
                cursor: 'pointer',
              }}
            >
              CLOSE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Main HUD export ──────────────────────────────────────────────── */
export default function GameHUD() {
  const { nearbyTarget, openOverlay } = useGameStore();

  // Start background sci-fi ambience on first interaction
  useEffect(() => {
    const startAudio = () => {
      sound.startAmbience();
      window.removeEventListener('pointerdown', startAudio);
      window.removeEventListener('keydown', startAudio);
    };
    window.addEventListener('pointerdown', startAudio);
    window.addEventListener('keydown', startAudio);
    return () => {
      window.removeEventListener('pointerdown', startAudio);
      window.removeEventListener('keydown', startAudio);
    };
  }, []);

  // Global E key handler for interaction
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'KeyE' && nearbyTarget) {
        openOverlay(nearbyTarget.id);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [nearbyTarget, openOverlay]);

  return (
    <>
      <Scanlines />
      <Vignette />
      <NotificationBanner />
      <DistrictBadge />
      <InteractionPrompt />
      <Minimap />
      <ControlsLegend />
      <DistrictOverlay />
      <DialogPanel />
      <TacticalMapModal />
      <TouchControls />
    </>
  );
}
