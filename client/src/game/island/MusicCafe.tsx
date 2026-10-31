/**
 * MusicCafe.tsx — Physically Enterable French Bistro Café & Spotify Lounge
 *
 * Location: South-East [12, 0, 15] (facing North-West toward Sunshine Plaza)
 * Features:
 * - Coffeehouse architecture with striped awning, outdoor patio table & chalkboard sign
 * - Open walk-in doorway with warm timber threshold
 * - Parquet floor, Edison bulbs, barista espresso bar & vinyl record wall
 * - Interactive Island Jukebox featuring Ayushman's 7 Verified Spotify Playlists
 * - Plays procedural Web Audio melodies when activated
 */
import React, { useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import { Text, Billboard } from '@react-three/drei';
import { useIslandStore } from './useIslandStore';
import { islandAudio } from './islandAudio';
import * as THREE from 'three';

export default function MusicCafe() {
  const { playerPosition, setNearbyTarget, nearbyTarget, openInspect, setCurrentArea } =
    useIslandStore();

  const CAFE_POS = [12, 0, 15] as const;
  const ROT_Y = -2.4; // Facing North-West toward central plaza

  const W = 6.8;
  const H = 3.4;
  const D = 5.8;

  // Local positions inside Music Cafe
  const JUKEBOX_LOCAL: [number, number, number] = [1.8, 0, -1.6];
  const BARISTA_LOCAL: [number, number, number] = [-1.6, 0, -1.4];
  const VINYL_LOCAL: [number, number, number] = [2.0, 0, 0.8];

  const toWorld = (local: [number, number, number]): [number, number, number] => [
    CAFE_POS[0] + local[0] * Math.cos(ROT_Y) + local[2] * Math.sin(ROT_Y),
    0,
    CAFE_POS[2] - local[0] * Math.sin(ROT_Y) + local[2] * Math.cos(ROT_Y),
  ];

  useFrame(() => {
    const [px, , pz] = playerPosition;
    const distToCenter = Math.hypot(px - CAFE_POS[0], pz - CAFE_POS[2]);

    if (distToCenter < 3.2) {
      setCurrentArea('MUSIC CAFÉ');
    }

    const jPos = toWorld(JUKEBOX_LOCAL);
    const bPos = toWorld(BARISTA_LOCAL);
    const vPos = toWorld(VINYL_LOCAL);

    if (Math.hypot(px - jPos[0], pz - jPos[2]) < 2.8) {
      if (!nearbyTarget || nearbyTarget.id !== 'cafe_jukebox') {
        setNearbyTarget({
          id: 'cafe_jukebox',
          title: 'CAFÉ SPOTIFY JUKEBOX',
          subtitle: 'Press [E] to play music & inspect curated playlists',
        });
      }
    } else if (Math.hypot(px - bPos[0], pz - bPos[2]) < 2.8) {
      if (!nearbyTarget || nearbyTarget.id !== 'cafe_barista') {
        setNearbyTarget({
          id: 'cafe_barista',
          title: 'ESPRESSO BAR & CAFE COUNTER',
          subtitle: 'Press [E] to order fresh roast & see café vibes',
        });
      }
    } else if (Math.hypot(px - vPos[0], pz - vPos[2]) < 2.8) {
      if (!nearbyTarget || nearbyTarget.id !== 'cafe_vinyl') {
        setNearbyTarget({
          id: 'cafe_vinyl',
          title: 'VINYL RECORD WALL',
          subtitle: 'Press [E] to browse acoustic & indie inspirations',
        });
      }
    } else if (
      nearbyTarget?.id === 'cafe_jukebox' ||
      nearbyTarget?.id === 'cafe_barista' ||
      nearbyTarget?.id === 'cafe_vinyl'
    ) {
      setNearbyTarget(null);
    }
  });

  // Handle [E] key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'KeyE') {
        const [px, , pz] = playerPosition;
        const jPos = toWorld(JUKEBOX_LOCAL);
        const bPos = toWorld(BARISTA_LOCAL);
        const vPos = toWorld(VINYL_LOCAL);

        if (Math.hypot(px - jPos[0], pz - jPos[2]) < 2.8) {
          // Play pleasant musical sound
          islandAudio.playCollectible();

          openInspect({
            title: 'CAFÉ MELODY · SPOTIFY JUKEBOX',
            subtitle: '7 Curated Playlists by Ayushman (Spotify User: 31r367fhbny2hd3bdbyo5q3vvjlu)',
            badge: 'CURATED SPOTIFY PLAYLISTS',
            sections: [
              {
                heading: '1. जीवन (Soulful & Deep)',
                body: '• Track Count: 12 tracks\n• Mood: Soulful Hindi indie, profound acoustics, late-evening warmth\n• Spotify: https://open.spotify.com/playlist/3kVexA5RqiZJA1hrzv1eNH',
              },
              {
                heading: '2. "PEAK" (High Energy & Anthems)',
                body: '• Track Count: 35 tracks\n• Mood: Driving rhythms, gym bangers, workout peaks & motivation\n• Spotify: https://open.spotify.com/playlist/1ObWCzwKcT96QEqiKbFR5U',
              },
              {
                heading: '3. puhNjabi (Punjabi & Folk Beats)',
                body: '• Track Count: 15 tracks\n• Mood: Punjabi flow, 808 basslines & traditional melody\n• Spotify: https://open.spotify.com/playlist/6TsUQwBFT8TMKBN72Mo7Zb',
              },
              {
                heading: '4. एफ (Chill & Atmospheric)',
                body: '• Track Count: 19 tracks\n• Mood: Rainy day textures, ambient beats, late night reverbs\n• Spotify: https://open.spotify.com/playlist/3z97vIfs40HVfqovsgSbGn',
              },
              {
                heading: '5. ´⁠ε⁠｀ & ￣⁠ ³⁠ ￣ (Lo-Fi Study)',
                body: '• Track Count: 13 & 18 tracks\n• Mood: Comforting lo-fi melodies, coding focus, soft rhodes piano',
              },
            ],
            actions: [
              {
                label: 'OPEN SPOTIFY PROFILE',
                externalUrl: 'https://open.spotify.com/user/31r367fhbny2hd3bdbyo5q3vvjlu',
                emoji: '🟢',
                variant: 'primary',
              },
              {
                label: 'LISTEN TO "जीवन"',
                externalUrl: 'https://open.spotify.com/playlist/3kVexA5RqiZJA1hrzv1eNH',
                emoji: '🎵',
                variant: 'secondary',
              },
              {
                label: 'LISTEN TO "PEAK"',
                externalUrl: 'https://open.spotify.com/playlist/1ObWCzwKcT96QEqiKbFR5U',
                emoji: '⚡',
                variant: 'accent',
              },
            ],
          });
        } else if (Math.hypot(px - bPos[0], pz - bPos[2]) < 1.8) {
          openInspect({
            title: 'ESPRESSO BAR & ROASTS',
            subtitle: 'The Energy Behind Every Commit',
            badge: 'CAFE ROASTS',
            sections: [
              {
                heading: 'Barista’s Philosophy',
                body: '“Great software and rich coffee share one thing in common: attention to every single extraction and parameter.”',
              },
            ],
            actions: [
              { label: 'ENTERTAINMENT PAGE', route: '/entertainment', emoji: '☕', variant: 'primary' },
            ],
          });
        } else if (Math.hypot(px - vPos[0], pz - vPos[2]) < 1.8) {
          openInspect({
            title: 'VINYL RECORD ARCHIVE',
            subtitle: 'Physical Media & Sonic Aesthetics',
            badge: 'VINYL LOUNGE',
            sections: [
              {
                heading: 'Soundtrack to Creation',
                body: 'From traditional Indian classical flutes to 80s synthwave and modern bedroom lo-fi, sound is the emotional backbone of digital design.',
              },
            ],
            actions: [
              { label: 'DISCOVER MUSIC', route: '/entertainment', emoji: '💿', variant: 'primary' },
            ],
          });
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [playerPosition, openInspect]);

  return (
    <group position={CAFE_POS} rotation={[0, ROT_Y, 0]}>
      {/* ── Floor & Porch ─────────────────────────────────────────── */}
      {/* Parquet Hardwood Floor */}
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <boxGeometry args={[W - 0.2, 0.1, D - 0.2]} />
        <meshStandardMaterial color="#78350f" roughness={0.7} />
      </mesh>

      {/* Front Café Porch Deck */}
      <mesh position={[0, 0.05, D / 2 + 0.9]} receiveShadow>
        <boxGeometry args={[4.4, 0.1, 1.8]} />
        <meshStandardMaterial color="#92400e" roughness={0.8} />
      </mesh>

      {/* Front Plaque Sign */}
      <Billboard position={[0, H + 0.35, D / 2 + 0.2]}>
        <Text
          fontSize={0.24}
          color="#ea580c"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.03}
          outlineColor="#ffffff"
        >
          MUSIC CAFÉ
        </Text>
      </Billboard>

      {/* Striped Café Awning Above Door */}
      <mesh position={[0, 2.7, D / 2 + 0.6]} rotation={[0.3, 0, 0]} castShadow>
        <boxGeometry args={[3.2, 0.1, 1.2]} />
        <meshStandardMaterial color="#ea580c" roughness={0.6} />
      </mesh>

      {/* Outdoor Bistro Patio Table with Umbrella */}
      <group position={[1.8, 0, D / 2 + 1.2]}>
        {/* Table Top */}
        <mesh position={[0, 0.75, 0]} castShadow>
          <cylinderGeometry args={[0.45, 0.45, 0.05, 12]} />
          <meshStandardMaterial color="#ffffff" roughness={0.4} />
        </mesh>
        {/* Table Stand */}
        <mesh position={[0, 0.37, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.74, 8]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
        {/* Umbrella Pole & Canopy */}
        <mesh position={[0, 1.6, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 1.8, 8]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
        <mesh position={[0, 2.3, 0]} castShadow>
          <coneGeometry args={[1.1, 0.5, 8]} />
          <meshStandardMaterial color="#ea580c" roughness={0.6} />
        </mesh>
      </group>

      {/* ── Collidable Wall Enclosure with Open Doorway ───────────── */}
      <RigidBody type="fixed" colliders={false}>
        {/* Back Wall */}
        <CuboidCollider args={[W / 2, H / 2, 0.15]} position={[0, H / 2, -D / 2]} />
        <mesh position={[0, H / 2, -D / 2]} castShadow receiveShadow>
          <boxGeometry args={[W, H, 0.22]} />
          <meshStandardMaterial color="#ffedd5" roughness={0.7} />
        </mesh>

        {/* Left Wall */}
        <CuboidCollider args={[0.15, H / 2, D / 2]} position={[-W / 2, H / 2, 0]} />
        <mesh position={[-W / 2, H / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.22, H, D]} />
          <meshStandardMaterial color="#ffedd5" roughness={0.7} />
        </mesh>

        {/* Right Wall */}
        <CuboidCollider args={[0.15, H / 2, D / 2]} position={[W / 2, H / 2, 0]} />
        <mesh position={[W / 2, H / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.22, H, D]} />
          <meshStandardMaterial color="#ffedd5" roughness={0.7} />
        </mesh>

        {/* Front Wall Left Segment */}
        <CuboidCollider args={[(W / 2 - 0.9) / 2, H / 2, 0.15]} position={[-W / 4 - 0.45, H / 2, D / 2]} />
        <mesh position={[-W / 4 - 0.45, H / 2, D / 2]} castShadow receiveShadow>
          <boxGeometry args={[W / 2 - 0.9, H, 0.22]} />
          <meshStandardMaterial color="#ffedd5" roughness={0.7} />
        </mesh>

        {/* Front Wall Right Segment */}
        <CuboidCollider args={[(W / 2 - 0.9) / 2, H / 2, 0.15]} position={[W / 4 + 0.45, H / 2, D / 2]} />
        <mesh position={[W / 4 + 0.45, H / 2, D / 2]} castShadow receiveShadow>
          <boxGeometry args={[W / 2 - 0.9, H, 0.22]} />
          <meshStandardMaterial color="#ffedd5" roughness={0.7} />
        </mesh>

        {/* Front Doorway Lintel */}
        <CuboidCollider args={[0.9, 0.4, 0.15]} position={[0, H - 0.4, D / 2]} />
        <mesh position={[0, H - 0.4, D / 2]} castShadow>
          <boxGeometry args={[1.8, 0.8, 0.22]} />
          <meshStandardMaterial color="#ea580c" roughness={0.6} />
        </mesh>
      </RigidBody>

      {/* ── Terracotta Pitched Roof ────────────────────────────────── */}
      <RigidBody type="fixed" colliders="hull">
        <mesh position={[0, H + 0.8, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
          <coneGeometry args={[Math.max(W, D) * 0.76, 1.7, 4]} />
          <meshStandardMaterial color="#ea580c" roughness={0.6} />
        </mesh>
      </RigidBody>

      {/* ── Interior Amber Edison Bulb Lighting ───────────────────── */}
      <pointLight position={[0, H - 0.6, 0]} color="#f59e0b" intensity={1.1} distance={7.5} />

      {/* ── Corner Interactive Jukebox ────────────────────────────── */}
      <group position={JUKEBOX_LOCAL} rotation={[0, -0.4, 0]}>
        {/* Jukebox Body */}
        <mesh position={[0, 0.9, 0]} castShadow>
          <boxGeometry args={[0.9, 1.7, 0.65]} />
          <meshStandardMaterial color="#1e293b" roughness={0.4} />
        </mesh>
        {/* Glowing Chrome Arc */}
        <mesh position={[0, 1.45, 0.25]}>
          <boxGeometry args={[0.7, 0.4, 0.15]} />
          <meshStandardMaterial
            color="#fbbf24"
            emissive="#f59e0b"
            emissiveIntensity={0.8}
            metalness={0.8}
          />
        </mesh>
        <Billboard position={[0, 2.1, 0]}>
          <Text fontSize={0.16} color="#fbbf24" outlineWidth={0.02} outlineColor="#000000">
            [E] SPOTIFY JUKEBOX
          </Text>
        </Billboard>
      </group>

      {/* ── Barista Espresso Counter ───────────────────────────────── */}
      <group position={BARISTA_LOCAL}>
        <mesh position={[0, 0.55, 0]} castShadow>
          <boxGeometry args={[1.6, 1.0, 0.7]} />
          <meshStandardMaterial color="#451a03" roughness={0.7} />
        </mesh>
        {/* Espresso Machine */}
        <mesh position={[0.3, 1.25, 0]} castShadow>
          <boxGeometry args={[0.5, 0.4, 0.4]} />
          <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.3} />
        </mesh>
        <Billboard position={[0, 1.8, 0]}>
          <Text fontSize={0.14} color="#ea580c" outlineWidth={0.02} outlineColor="#ffffff">
            [E] ESPRESSO BAR
          </Text>
        </Billboard>
      </group>

      {/* ── Vinyl Record Wall (Right Wall) ─────────────────────────── */}
      <group position={VINYL_LOCAL} rotation={[0, -Math.PI / 2, 0]}>
        <mesh position={[0, 1.4, 0]} castShadow>
          <boxGeometry args={[1.6, 1.6, 0.08]} />
          <meshStandardMaterial color="#334155" roughness={0.8} />
        </mesh>
        {/* Vinyl Discs */}
        {[-0.4, 0.4].map((vx, vi) => (
          <mesh key={vi} position={[vx, 1.4, 0.05]} rotation={[0, 0, 0]}>
            <circleGeometry args={[0.26, 16]} />
            <meshStandardMaterial color="#0f172a" roughness={0.2} metalness={0.6} />
          </mesh>
        ))}
        <Billboard position={[0, 2.4, 0]}>
          <Text fontSize={0.14} color="#38bdf8" outlineWidth={0.02} outlineColor="#000000">
            [E] VINYL WALL
          </Text>
        </Billboard>
      </group>
    </group>
  );
}
