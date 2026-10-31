/**
 * TerminalBuilding.tsx — Interactive holographic terminal buildings.
 *
 * An upgraded building that, when entered (E key near), shows a
 * full-screen immersive data terminal overlay with real portfolio content
 * instead of just navigating away.
 *
 * Different from the district overlay — this one renders the actual
 * page content INSIDE a cyberpunk terminal frame.
 */
import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Billboard, Text } from '@react-three/drei';
import { RigidBody } from '@react-three/rapier';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/useGameStore';
import * as THREE from 'three';

interface TerminalBuildingProps {
  id: string;
  label: string;
  sublabel: string;
  position: [number, number, number];
  color: string;
  width?: number;
  height?: number;
  depth?: number;
  route: string;
  terminalContent: React.ReactNode;
}

const ENTER_RADIUS = 5.5;

/* ─── Full-screen terminal overlay ─────────────────────────────────── */
function TerminalOverlay({
  label, color, content, onClose, route
}: {
  label: string; color: string;
  content: React.ReactNode;
  onClose: () => void;
  route: string;
}) {
  const navigate = useNavigate();
  const [scanLine, setScanLine] = React.useState(0);

  useEffect(() => {
    const t = setInterval(() => setScanLine((v) => (v + 1) % 100), 30);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[80]"
      style={{ background: 'rgba(5,8,16,0.97)', fontFamily: 'monospace' }}
    >
      {/* Moving scan line */}
      <div
        style={{
          position: 'absolute',
          top: `${scanLine}%`,
          left: 0, right: 0,
          height: 2,
          background: `linear-gradient(90deg, transparent, ${color}44, transparent)`,
          pointerEvents: 'none',
          zIndex: 1,
          transition: 'top 0.03s linear',
        }}
      />

      {/* Terminal frame */}
      <div
        className="absolute inset-4 flex flex-col"
        style={{
          border: `1px solid ${color}`,
          boxShadow: `0 0 40px ${color}33`,
        }}
      >
        {/* Header bar */}
        <div
          className="flex items-center justify-between px-5 py-2.5 shrink-0"
          style={{
            borderBottom: `1px solid ${color}33`,
            background: `${color}0a`,
          }}
        >
          <div className="flex items-center gap-3">
            <div
              style={{
                width: 8, height: 8, borderRadius: '50%',
                background: color, boxShadow: `0 0 8px ${color}`,
              }}
            />
            <span style={{ color, fontSize: '0.6rem', letterSpacing: '0.25em' }}>
              ◈ {label} · TERMINAL ONLINE
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => { onClose(); navigate(route); }}
              style={{
                fontSize: '0.6rem', letterSpacing: '0.15em',
                color, border: `1px solid ${color}`,
                background: 'transparent', padding: '2px 10px', cursor: 'pointer',
              }}
            >
              FULL VIEW ↗
            </button>
            <button
              onClick={onClose}
              style={{
                fontSize: '0.6rem', color: '#4a6080',
                background: 'transparent', border: 'none', cursor: 'pointer',
                letterSpacing: '0.1em',
              }}
            >
              ✕ ESC
            </button>
          </div>
        </div>

        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto p-5" style={{ color: '#c8d8e8' }}>
          {content}
        </div>

        {/* Footer */}
        <div
          className="px-5 py-2 shrink-0 flex justify-between"
          style={{
            borderTop: `1px solid ${color}22`,
            fontSize: '0.55rem',
            color: '#2a3a50',
            letterSpacing: '0.1em',
          }}
        >
          <span>NEON DISTRICT · AYUSHMAN OS · v1.0</span>
          <span>ESC to exit · FULL VIEW for expanded mode</span>
        </div>
      </div>
    </div>
  );
}

/* ─── TerminalBuilding component ──────────────────────────────────── */
export default function TerminalBuilding({
  id, label, sublabel, position, color,
  width = 8, height = 14, depth = 6,
  route, terminalContent,
}: TerminalBuildingProps) {
  const bodyRef = useRef<THREE.Mesh>(null);
  const t = useRef(Math.random() * Math.PI * 2);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [nearPlayer, setNearPlayer] = useState(false);
  const { playerPosition, setControlsLocked } = useGameStore();

  useFrame((_, delta) => {
    t.current += delta;
    if (bodyRef.current) {
      (bodyRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
        nearPlayer
          ? 0.7 + Math.sin(t.current * 3) * 0.2
          : 0.35 + Math.sin(t.current * 1.2) * 0.1;
    }

    const dx = playerPosition[0] - position[0];
    const dz = playerPosition[2] - position[2];
    setNearPlayer(Math.sqrt(dx * dx + dz * dz) < ENTER_RADIUS);
  });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'KeyE' && nearPlayer && !terminalOpen) {
        setTerminalOpen(true);
        setControlsLocked(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [nearPlayer, terminalOpen, setControlsLocked]);

  const handleClose = () => {
    setTerminalOpen(false);
    setControlsLocked(false);
  };

  return (
    <>
      <group position={position}>
        <RigidBody type="fixed" colliders="cuboid">
          <mesh ref={bodyRef} position={[0, height / 2, 0]} castShadow receiveShadow>
            <boxGeometry args={[width, height, depth]} />
            <meshStandardMaterial
              color="#0d1825"
              emissive={color}
              emissiveIntensity={0.35}
              roughness={0.6}
              metalness={0.4}
              flatShading
            />
          </mesh>
        </RigidBody>

        {/* Roof neon */}
        <mesh position={[0, height + 0.06, 0]}>
          <boxGeometry args={[width + 0.3, 0.15, depth + 0.3]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={nearPlayer ? 4 : 2.5} />
        </mesh>

        {/* Edge strips */}
        {[-width / 2, width / 2].map((x, i) => (
          <mesh key={i} position={[x, height / 2, 0]}>
            <boxGeometry args={[0.1, height, 0.1]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={nearPlayer ? 3 : 1.5} />
          </mesh>
        ))}

        {/* Holographic front panel — only when near */}
        {nearPlayer && (
          <mesh position={[0, height * 0.4, depth / 2 + 0.05]}>
            <planeGeometry args={[width * 0.7, height * 0.4]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={0.8}
              transparent
              opacity={0.12 + Math.sin(Date.now() * 0.003) * 0.05}
              side={THREE.DoubleSide}
            />
          </mesh>
        )}

        {/* Label */}
        <Billboard position={[0, height + 2.8, 0]}>
          <Text
            fontSize={0.55}
            color={nearPlayer ? '#ffffff' : color}
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.04}
            outlineColor="#000000"
          >
            {label}
          </Text>
          <Text
            fontSize={0.26}
            color={nearPlayer ? '#aaaacc' : '#4a6080'}
            anchorX="center"
            anchorY="middle"
            position={[0, -0.85, 0]}
          >
            {nearPlayer ? '[E] ENTER TERMINAL' : sublabel}
          </Text>
        </Billboard>
      </group>

      {/* Terminal overlay (rendered outside 3D scene) */}
      {terminalOpen && (
        <TerminalOverlay
          label={label}
          color={color}
          content={terminalContent}
          onClose={handleClose}
          route={route}
        />
      )}
    </>
  );
}
