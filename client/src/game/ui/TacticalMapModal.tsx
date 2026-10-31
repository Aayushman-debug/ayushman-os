/**
 * TacticalMapModal.tsx — Cybernetic District Fast-Travel & Radar Grid
 *
 * Opened with [M] or by clicking the minimap.
 * Features:
 * - Interactive holographic grid showing all 6 districts
 * - Discovery status indicators
 * - One-click "FAST TRAVEL // TRANSMIT" avatar teleportation
 * - Cyberpunk radar scanline and coordinate readouts
 */
import React, { useEffect } from 'react';
import { useGameStore } from '../store/useGameStore';
import { sound } from '../audio/soundEngine';

export interface MapDistrictNode {
  id: string;
  label: string;
  desc: string;
  pos: [number, number, number];
  color: string;
  theme: string;
}

export const MAP_DISTRICTS: MapDistrictNode[] = [
  {
    id: 'central_nexus',
    label: 'CENTRAL NEXUS',
    desc: 'The heart of NEON DISTRICT. Identity core and central plaza.',
    pos: [0, 0, -12],
    color: '#00f5ff',
    theme: 'CORE IDENTITY',
  },
  {
    id: 'tech_core',
    label: 'TECH CORE',
    desc: 'Engine of modern web & systems engineering. Projects and stack matrix.',
    pos: [-14, 0, 10],
    color: '#00f5ff',
    theme: 'ENGINEERING',
  },
  {
    id: 'memory_lane',
    label: 'MEMORY LANE',
    desc: 'Temporal archive of origin stories, key milestones, and growth.',
    pos: [-18, 0, -6],
    color: '#ff006e',
    theme: 'ORIGIN ARCHIVE',
  },
  {
    id: 'academia',
    label: 'ACADEMIA',
    desc: 'B.Tech CS Engineering foundations, certifications, and research.',
    pos: [18, 0, -6],
    color: '#ffb700',
    theme: 'CREDENTIALS',
  },
  {
    id: 'arcade_99',
    label: 'ARCADE 99',
    desc: 'Cyber lounge featuring curated Spotify music streams and anime history.',
    pos: [14, 0, 10],
    color: '#ff006e',
    theme: 'MEDIA & SOUND',
  },
  {
    id: 'skyport',
    label: 'SKYPORT',
    desc: 'Outbound communications hub, social relays, and direct verified contacts.',
    pos: [0, 0, 16],
    color: '#ffb700',
    theme: 'COMMS ARRAY',
  },
];

export default function TacticalMapModal() {
  const {
    tacticalMapOpen,
    setTacticalMapOpen,
    setTeleportTarget,
    visitedDistricts,
    playerPosition,
  } = useGameStore();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'KeyM') {
        setTacticalMapOpen(!tacticalMapOpen);
      }
      if (e.code === 'Escape' && tacticalMapOpen) {
        setTacticalMapOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [tacticalMapOpen, setTacticalMapOpen]);

  if (!tacticalMapOpen) return null;

  const handleTransmit = (pos: [number, number, number]) => {
    sound.playTerminalOpen();
    setTeleportTarget(pos);
    setTacticalMapOpen(false);
  };

  return (
    <div
      className="fixed inset-0 z-[85] flex items-center justify-center p-4"
      style={{
        background: 'rgba(5, 8, 16, 0.94)',
        backdropFilter: 'blur(10px)',
        fontFamily: 'monospace',
      }}
    >
      <div
        className="relative max-w-4xl w-full max-h-[90vh] flex flex-col p-6 rounded-sm"
        style={{
          border: '1px solid #00f5ff',
          boxShadow: '0 0 50px rgba(0, 245, 255, 0.25), inset 0 0 30px rgba(0, 245, 255, 0.05)',
          background: 'rgba(5, 8, 16, 0.98)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#1a2a40] shrink-0">
          <div>
            <div style={{ color: '#00f5ff', fontSize: '0.65rem', letterSpacing: '0.25em' }}>
              ◈ TACTICAL OVERVIEW // FAST-TRAVEL ARRAY
            </div>
            <div className="text-xl font-bold text-white tracking-widest mt-0.5">
              NEON DISTRICT GRID
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span style={{ color: '#4a6080', fontSize: '0.7rem' }}>
              COORDS: {Math.round(playerPosition[0])} · {Math.round(playerPosition[2])}
            </span>
            <button
              onClick={() => {
                sound.playTerminalClose();
                setTacticalMapOpen(false);
              }}
              style={{
                color: '#00f5ff',
                border: '1px solid rgba(0,245,255,0.4)',
                background: 'transparent',
                padding: '4px 12px',
                fontSize: '0.75rem',
                cursor: 'pointer',
              }}
            >
              ✕ CLOSE [M / ESC]
            </button>
          </div>
        </div>

        {/* District Grid Cards */}
        <div className="flex-1 overflow-y-auto py-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {MAP_DISTRICTS.map((district) => {
            const isVisited = visitedDistricts.includes(district.id);
            const dx = playerPosition[0] - district.pos[0];
            const dz = playerPosition[2] - district.pos[2];
            const distance = Math.round(Math.sqrt(dx * dx + dz * dz));

            return (
              <div
                key={district.id}
                className="p-4 flex flex-col justify-between transition-all"
                style={{
                  background: 'rgba(10, 16, 30, 0.7)',
                  border: `1px solid ${district.color}44`,
                  borderLeft: `3px solid ${district.color}`,
                }}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      style={{
                        fontSize: '0.6rem',
                        color: district.color,
                        letterSpacing: '0.15em',
                      }}
                    >
                      {district.theme}
                    </span>
                    <span
                      className="px-1.5 py-0.5 rounded text-[0.6rem]"
                      style={{
                        background: isVisited ? `${district.color}22` : 'rgba(255,255,255,0.05)',
                        color: isVisited ? district.color : '#4a6080',
                        border: `1px solid ${isVisited ? district.color : '#2a3a50'}`,
                      }}
                    >
                      {isVisited ? 'ARCHIVED' : 'UNEXPLORED'}
                    </span>
                  </div>

                  <div className="text-white font-bold text-sm tracking-wider mb-1">
                    {district.label}
                  </div>
                  <div style={{ color: '#8899aa', fontSize: '0.72rem', lineHeight: 1.5 }}>
                    {district.desc}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#1a2538] flex items-center justify-between">
                  <span style={{ fontSize: '0.65rem', color: '#4a6080' }}>
                    DIST: {distance}m
                  </span>
                  <button
                    onClick={() => handleTransmit(district.pos)}
                    className="py-1 px-3 text-xs font-bold tracking-widest transition-all hover:scale-105"
                    style={{
                      background: district.color,
                      color: '#050810',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    TRANSMIT ▶
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="pt-4 border-t border-[#1a2a40] flex items-center justify-between text-xs text-[#4a6080] shrink-0">
          <div>
            TOTAL ARCHIVES UNLOCKED: {visitedDistricts.length} / 6
          </div>
          <div>
            PRESS [M] TO TOGGLE MAP ANYTIME
          </div>
        </div>
      </div>
    </div>
  );
}
