/**
 * EnterableStore.tsx — Bloxburg-Style Physically Enterable Village Store & Archive
 *
 * Position: [-10, 0, 6]
 * Features:
 * - Open walk-in doorway with striped emerald awning
 * - Interior shop counter with interactive Visitor Terminal
 * - Display shelves with books, retro gadgets, and glowing island crystals
 * - Connects to inspectable technical directory & guestbook
 */
import React, { useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import { Text, Billboard } from '@react-three/drei';
import { useIslandStore } from './useIslandStore';

export default function EnterableStore() {
  const { playerPosition, setNearbyTarget, nearbyTarget, openInspect, setCurrentArea } =
    useIslandStore();

  const STORE_POS = [-10, 0, 6] as const;
  const ROT_Y = 0.4;

  const W = 5.8;
  const H = 3.2;
  const D = 5.0;

  // Local counter / terminal position
  const TERMINAL_LOCAL: [number, number, number] = [0.8, 0, -0.6];

  const getTerminalWorld = (): [number, number, number] => [
    STORE_POS[0] + TERMINAL_LOCAL[0] * Math.cos(ROT_Y) + TERMINAL_LOCAL[2] * Math.sin(ROT_Y),
    0,
    STORE_POS[2] - TERMINAL_LOCAL[0] * Math.sin(ROT_Y) + TERMINAL_LOCAL[2] * Math.cos(ROT_Y),
  ];

  useFrame(() => {
    const [px, , pz] = playerPosition;
    const distToCenter = Math.hypot(px - STORE_POS[0], pz - STORE_POS[2]);

    if (distToCenter < 2.5) {
      setCurrentArea('VILLAGE ARCHIVE');
    }

    const tw = getTerminalWorld();
    const distToTerm = Math.hypot(px - tw[0], pz - tw[2]);

    if (distToTerm < 2.0) {
      if (!nearbyTarget || nearbyTarget.id !== 'archive_term') {
        setNearbyTarget({
          id: 'archive_term',
          title: 'ISLAND ARCHIVE TERMINAL',
          subtitle: 'Press [E] to access visitor knowledge base & directory',
        });
      }
    } else if (nearbyTarget?.id === 'archive_term') {
      setNearbyTarget(null);
    }
  });

  // Handle [E] key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'KeyE') {
        const [px, , pz] = playerPosition;
        const tw = getTerminalWorld();
        if (Math.hypot(px - tw[0], pz - tw[2]) < 2.0) {
          openInspect({
            title: 'ISLAND ARCHIVE & TECH DIRECTORY',
            subtitle: 'Sunshine Island Knowledge Repository · Version 1.0',
            badge: 'VISITOR TERMINAL',
            sections: [
              {
                heading: 'The Island Architecture',
                body: 'AYushMan Island is engineered with React Three Fiber, Rapier Physics, Zustand, and TypeScript. It replaces standard web navigation with spatial exploration while keeping all REST APIs intact.',
              },
              {
                heading: 'District Guide',
                body: '• Sunshine Plaza: Spawning & Wardrobe Mirror\n• Sunshine Cottage: About Ayushman & Dev Workstation\n• Village Archive: Technical Specs & Island Lore\n• University Town: Academic records & Algorithms\n• Developer Village: Interactive project displays & GitHub links\n• Arcade Bay & Pier: Lo-Fi music, anime collectibles & entertainment',
              },
              {
                heading: 'Secrets & Hidden Stars',
                body: 'There are 4 secret golden stars scattered throughout the island:\n1. Behind the Sunshine Plaza fountain\n2. At the coastal lighthouse observation deck\n3. At the end of the beach fishing pier\n4. Floating over the quiet village pond stones',
              },
            ],
            actions: [
              {
                label: 'OPEN DEVELOPER PAGE',
                route: '/developer',
                emoji: '💻',
                variant: 'primary',
              },
              {
                label: 'OPEN SOCIAL HUB',
                route: '/social',
                emoji: '🌐',
                variant: 'secondary',
              },
              {
                label: 'RETURN TO CLASSIC WEBSITE',
                route: '/landing',
                emoji: '📄',
                variant: 'accent',
              },
            ],
          });
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [playerPosition, openInspect]);

  return (
    <group position={STORE_POS} rotation={[0, ROT_Y, 0]}>
      {/* ── Floor ──────────────────────────────────────────────────── */}
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <boxGeometry args={[W - 0.2, 0.1, D - 0.2]} />
        <meshStandardMaterial color="#fef08a" roughness={0.7} />
      </mesh>

      {/* Porch / Front Entry */}
      <mesh position={[0, 0.05, D / 2 + 0.8]} receiveShadow>
        <boxGeometry args={[3.6, 0.1, 1.6]} />
        <meshStandardMaterial color="#b45309" roughness={0.8} />
      </mesh>

      {/* ── Collidable Wall Enclosure with Open Walk-In Doorway ─────── */}
      <RigidBody type="fixed" colliders={false}>
        {/* Back Wall */}
        <CuboidCollider args={[W / 2, H / 2, 0.15]} position={[0, H / 2, -D / 2]} />
        <mesh position={[0, H / 2, -D / 2]} castShadow receiveShadow>
          <boxGeometry args={[W, H, 0.22]} />
          <meshStandardMaterial color="#fef9c3" roughness={0.7} />
        </mesh>

        {/* Left Wall */}
        <CuboidCollider args={[0.15, H / 2, D / 2]} position={[-W / 2, H / 2, 0]} />
        <mesh position={[-W / 2, H / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.22, H, D]} />
          <meshStandardMaterial color="#fef9c3" roughness={0.7} />
        </mesh>

        {/* Right Wall */}
        <CuboidCollider args={[0.15, H / 2, D / 2]} position={[W / 2, H / 2, 0]} />
        <mesh position={[W / 2, H / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.22, H, D]} />
          <meshStandardMaterial color="#fef9c3" roughness={0.7} />
        </mesh>

        {/* Front Left Wall Segment */}
        <CuboidCollider args={[(W / 2 - 0.75) / 2, H / 2, 0.15]} position={[-W / 4 - 0.38, H / 2, D / 2]} />
        <mesh position={[-W / 4 - 0.38, H / 2, D / 2]} castShadow receiveShadow>
          <boxGeometry args={[W / 2 - 0.75, H, 0.22]} />
          <meshStandardMaterial color="#fef9c3" roughness={0.7} />
        </mesh>

        {/* Front Right Wall Segment */}
        <CuboidCollider args={[(W / 2 - 0.75) / 2, H / 2, 0.15]} position={[W / 4 + 0.38, H / 2, D / 2]} />
        <mesh position={[W / 4 + 0.38, H / 2, D / 2]} castShadow receiveShadow>
          <boxGeometry args={[W / 2 - 0.75, H, 0.22]} />
          <meshStandardMaterial color="#fef9c3" roughness={0.7} />
        </mesh>

        {/* Front Doorway Lintel Above Open Door */}
        <CuboidCollider args={[0.8, 0.35, 0.15]} position={[0, H - 0.35, D / 2]} />
        <mesh position={[0, H - 0.35, D / 2]} castShadow>
          <boxGeometry args={[1.6, 0.7, 0.22]} />
          <meshStandardMaterial color="#0d9488" roughness={0.6} />
        </mesh>
      </RigidBody>

      {/* ── Pitched Roof ────────────────────────────────────────────── */}
      <RigidBody type="fixed" colliders="hull">
        <mesh position={[0, H + 0.85, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
          <coneGeometry args={[Math.max(W, D) * 0.76, 1.7, 4]} />
          <meshStandardMaterial color="#0d9488" roughness={0.6} />
        </mesh>
      </RigidBody>

      {/* Front Awning */}
      <group position={[0, 2.3, D / 2 + 0.45]}>
        <mesh position={[0, 0, 0]} rotation={[0.25, 0, 0]} castShadow>
          <boxGeometry args={[3.4, 0.08, 1.1]} />
          <meshStandardMaterial color="#0d9488" roughness={0.6} />
        </mesh>
        <Billboard position={[0, 0.4, 0.1]}>
          <Text fontSize={0.2} color="#0f766e" anchorX="center" anchorY="middle">
            VILLAGE ARCHIVE & STORE
          </Text>
        </Billboard>
      </group>

      {/* Interior Warm Light */}
      <pointLight position={[0, H - 0.5, 0]} color="#fed7aa" intensity={0.9} distance={6} />

      {/* ── Shop Counter & Interactive Terminal ────────────────────── */}
      <group position={TERMINAL_LOCAL}>
        {/* Wooden Counter */}
        <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.6, 1.1, 0.7]} />
          <meshStandardMaterial color="#78350f" roughness={0.8} />
        </mesh>

        {/* Countertop */}
        <mesh position={[0, 1.12, 0]} receiveShadow>
          <boxGeometry args={[1.7, 0.06, 0.8]} />
          <meshStandardMaterial color="#b45309" roughness={0.6} />
        </mesh>

        {/* Holographic Terminal Base */}
        <mesh position={[0, 1.25, 0]} castShadow>
          <boxGeometry args={[0.5, 0.2, 0.35]} />
          <meshStandardMaterial color="#0f172a" metalness={0.8} />
        </mesh>

        {/* Terminal Glowing Screen */}
        <mesh position={[0, 1.5, -0.05]} rotation={[-0.2, 0, 0]}>
          <boxGeometry args={[0.65, 0.42, 0.04]} />
          <meshStandardMaterial
            color="#0d9488"
            emissive="#14b8a6"
            emissiveIntensity={0.6}
            roughness={0.2}
          />
        </mesh>

        {/* Prompt Billboard */}
        <Billboard position={[0, 2.0, 0]}>
          <Text
            fontSize={0.16}
            color="#0d9488"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.02}
            outlineColor="#ffffff"
          >
            [E] ARCHIVE TERMINAL
          </Text>
        </Billboard>
      </group>

      {/* ── Display Shelves on Left Wall ────────────────────────────── */}
      <group position={[-W / 2 + 0.45, 1.1, 0]} rotation={[0, Math.PI / 2, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[2.2, 2.0, 0.45]} />
          <meshStandardMaterial color="#451a03" roughness={0.8} />
        </mesh>
        {/* Shelf items / books */}
        {[-0.6, 0, 0.6].map((x, i) => (
          <mesh key={i} position={[x, 0.2, 0.1]} castShadow>
            <boxGeometry args={[0.3, 0.45, 0.22]} />
            <meshStandardMaterial color={['#0284c7', '#ea580c', '#10b981'][i]} roughness={0.6} />
          </mesh>
        ))}
        {/* Glowing Island Crystal on top shelf */}
        <mesh position={[0, 0.8, 0.1]}>
          <octahedronGeometry args={[0.18, 0]} />
          <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={0.8} />
        </mesh>
      </group>
    </group>
  );
}
