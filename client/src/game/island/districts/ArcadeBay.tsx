/**
 * ArcadeBay.tsx — Gaming, Music & Entertainment Beach Pavilion
 *
 * Location: South Coast [0, 0, 26]
 * Features:
 * - Beachside Arcade Pavilion with party string lights & sun canopy
 * - 3 Inspectable Arcade Cabinets (Chess.com, Clash Royale, BGMI)
 * - Interactive Island Jukebox (Curated Spotify & YouTube playlists)
 */
import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';
import { Text, Billboard } from '@react-three/drei';
import { useIslandStore } from '../useIslandStore';
import { islandAudio } from '../islandAudio';
import * as THREE from 'three';

interface CabinetData {
  id: string;
  game: string;
  emoji: string;
  handle: string;
  rank: string;
  color: string;
  pos: [number, number, number];
  rotY: number;
  details: string[];
}

const CABINETS: CabinetData[] = [
  {
    id: 'game_chess',
    game: 'Chess.com',
    emoji: '♟️',
    handle: 'nerfedAYushhhMaN',
    rank: 'Rapid: 2035 · Bullet: 2100',
    color: '#81B64C',
    pos: [-3.2, 0, 25.5],
    rotY: 0.3,
    details: [
      'Player Handle: nerfedAYushhhMaN',
      'Bullet Peak: 2100 Elo',
      'Blitz Peak: 2053 Elo',
      'Rapid Peak: 2035 Elo',
      'Profile: https://www.chess.com/member/nerfedayushhhman',
    ],
  },
  {
    id: 'game_clash',
    game: 'Clash Royale',
    emoji: '👑',
    handle: 'Slur',
    rank: '10,200 Trophies',
    color: '#3b82f6',
    pos: [-1.1, 0, 24.5],
    rotY: 0.05,
    details: [
      'In-Game Name: Slur',
      'Current & Peak Rank: 10,200 Trophies',
      'League: Path of Legends Ultimate Champion',
      'Preferred Style: High-tempo cycle & micro-placements',
    ],
  },
  {
    id: 'game_bgmi',
    game: 'BGMI',
    emoji: '🎯',
    handle: 'Rish Ke Papa',
    rank: '5.63 KD · Clan HOMIES',
    color: '#f59e0b',
    pos: [1.1, 0, 24.5],
    rotY: -0.05,
    details: [
      'In-Game Name: Rish Ke Papa',
      'Account UID: 55528652768',
      'Clan: HOMIES',
      'Combat Performance: 5.63 Kill/Death Ratio',
      'Role: Entry Fragger & Assault Lead',
    ],
  },
];

function ArcadeCabinet({ cabinet }: { cabinet: CabinetData }) {
  const { playerPosition, setNearbyTarget, nearbyTarget, openInspect } = useIslandStore();

  useFrame(() => {
    const [px, , pz] = playerPosition;
    const dist = Math.hypot(px - cabinet.pos[0], pz - cabinet.pos[2]);

    if (dist < 2.0) {
      if (!nearbyTarget || nearbyTarget.id !== cabinet.id) {
        setNearbyTarget({
          id: cabinet.id,
          title: `ARCADE // ${cabinet.game.toUpperCase()}`,
          subtitle: `Press [E] to view gaming stats & rankings`,
        });
      }
    } else if (nearbyTarget?.id === cabinet.id) {
      setNearbyTarget(null);
    }
  });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'KeyE') {
        const [px, , pz] = playerPosition;
        if (Math.hypot(px - cabinet.pos[0], pz - cabinet.pos[2]) < 2.0) {
          openInspect({
            title: `${cabinet.game} · Arena Cabinet`,
            subtitle: `${cabinet.handle} · ${cabinet.rank}`,
            badge: 'GAMING RECORD',
            sections: [
              {
                heading: 'Competitive Statistics',
                body: cabinet.details.join('\n'),
              },
              {
                heading: 'Gamer Philosophy',
                body: 'Strategic discipline from high-level chess and rapid decision-making in competitive games translate directly into software design and system architecture under pressure.',
              },
            ],
            actions: [
              {
                label: 'OPEN GAMING PAGE',
                route: '/gaming',
                emoji: '🎮',
                variant: 'primary',
              },
              ...(cabinet.id === 'game_chess'
                ? [
                    {
                      label: 'CHESS.COM PROFILE',
                      externalUrl: 'https://www.chess.com/member/nerfedayushhhman',
                      emoji: '♟️' as const,
                      variant: 'secondary' as const,
                    },
                  ]
                : []),
            ],
          });
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [playerPosition, cabinet, openInspect]);

  return (
    <group
      position={cabinet.pos}
      rotation={[0, cabinet.rotY, 0]}
      onClick={() => {
        openInspect({
          title: `${cabinet.game} · Arena Cabinet`,
          subtitle: `${cabinet.handle} · ${cabinet.rank}`,
          badge: 'GAMING RECORD',
          sections: [
            { heading: 'Competitive Statistics', body: cabinet.details.join('\n') },
            {
              heading: 'Gamer Philosophy',
              body: 'Strategic discipline from high-level chess and rapid decision-making in competitive games translate directly into software design and system architecture under pressure.',
            },
          ],
          actions: [
            {
              label: 'OPEN GAMING PAGE',
              route: '/gaming',
              emoji: '🎮',
              variant: 'primary',
            },
            ...(cabinet.id === 'game_chess'
              ? [
                  {
                    label: 'CHESS.COM PROFILE',
                    externalUrl: 'https://www.chess.com/member/nerfedayushhhman',
                    emoji: '♟️' as const,
                    variant: 'secondary' as const,
                  },
                ]
              : []),
          ],
        });
      }}
    >
      {/* Cabinet Body */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[0, 1.1, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.85, 2.2, 0.75]} />
          <meshStandardMaterial color="#0f172a" roughness={0.6} />
        </mesh>
      </RigidBody>

      {/* Marquee Top Banner */}
      <mesh position={[0, 2.05, 0.12]}>
        <boxGeometry args={[0.78, 0.28, 0.45]} />
        <meshStandardMaterial
          color={cabinet.color}
          emissive={cabinet.color}
          emissiveIntensity={0.6}
        />
      </mesh>

      {/* Arcade CRT Screen */}
      <mesh position={[0, 1.35, 0.24]} rotation={[-0.3, 0, 0]}>
        <planeGeometry args={[0.65, 0.5]} />
        <meshStandardMaterial
          color="#1e293b"
          emissive={cabinet.color}
          emissiveIntensity={0.3}
          roughness={0.2}
        />
      </mesh>

      {/* Control Panel Deck & Joystick */}
      <mesh position={[0, 0.95, 0.36]} rotation={[0.2, 0, 0]}>
        <boxGeometry args={[0.75, 0.08, 0.3]} />
        <meshStandardMaterial color="#334155" roughness={0.4} />
      </mesh>
      {/* Joystick Ball */}
      <mesh position={[-0.18, 1.05, 0.36]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="#ef4444" roughness={0.2} />
      </mesh>

      {/* Billboard Overhead */}
      <Billboard position={[0, 2.55, 0]}>
        <Text
          fontSize={0.16}
          color="#0f172a"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.03}
          outlineColor="#ffffff"
        >
          {`${cabinet.emoji} ${cabinet.game}`}
        </Text>
      </Billboard>
    </group>
  );
}

export default function ArcadeBay() {
  const { setCurrentArea, playerPosition, setNearbyTarget, nearbyTarget, openInspect } =
    useIslandStore();
  const jukeIconRef = useRef<THREE.Group>(null);
  const JUKE_POS = [3.2, 0, 25.5] as const;

  useFrame(({ clock }) => {
    if (jukeIconRef.current) {
      jukeIconRef.current.rotation.y = clock.getElapsedTime() * 1.5;
      jukeIconRef.current.position.y = 2.1 + Math.sin(clock.getElapsedTime() * 3) * 0.07;
    }

    const [px, , pz] = playerPosition;
    if (Math.hypot(px - 0, pz - 26) < 9) {
      setCurrentArea('ARCADE BAY');
    }

    const distToJuke = Math.hypot(px - JUKE_POS[0], pz - JUKE_POS[2]);
    if (distToJuke < 2.2) {
      if (!nearbyTarget || nearbyTarget.id !== 'island_jukebox') {
        setNearbyTarget({
          id: 'island_jukebox',
          title: 'ISLAND JUKEBOX & PLAYLISTS',
          subtitle: 'Press [E] to inspect Spotify & Lo-Fi collections',
        });
      }
    } else if (nearbyTarget?.id === 'island_jukebox') {
      setNearbyTarget(null);
    }
  });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'KeyE') {
        const [px, , pz] = playerPosition;
        if (Math.hypot(px - JUKE_POS[0], pz - JUKE_POS[2]) < 2.2) {
          islandAudio.playChime(880);
          openInspect({
            title: 'ISLAND JUKEBOX & PLAYLISTS',
            subtitle: 'Spotify Curations · Lo-Fi Beats & Synthwave',
            badge: 'MUSIC VAULT',
            sections: [
              {
                heading: 'Spotify Public Curations',
                body: '• जीवन (Life & Nostalgia) — 18 tracks\n• "PEAK" (Intense & Focus Beats) — 18 tracks\n• puhNjabi (Punjabi & Folk Beats) — 15 tracks\n• एफ (Chill & Atmospheric) — 19 tracks\n• ´⁠ε⁠｀ & ￣⁠ ³⁠ ￣ (Lo-Fi Comfort & Late Night Flow)\n• Profile: https://open.spotify.com/user/31r367fhbny2hd3bdbyo5q3vvjlu',
              },
              {
                heading: 'YouTube Music Radio',
                body: '• Synthwave & Retrowave Highway (Coding sprints)\n• Lofi Hip Hop / Focus Beats (@wtfk1y0)\n• Profile: https://music.youtube.com/@wtfk1y0',
              },
              {
                heading: 'Soundtrack to Engineering',
                body: 'Music is an essential companion to flow state. Every major feature and architectural milestone in AYushMan was coded with these playlists.',
              },
            ],
            actions: [
              {
                label: 'OPEN MUSIC LOUNGE',
                route: '/music',
                emoji: '🎵',
                variant: 'primary',
              },
              {
                label: 'OPEN ENTERTAINMENT',
                route: '/entertainment',
                emoji: '🎬',
                variant: 'secondary',
              },
              {
                label: 'SPOTIFY PROFILE',
                externalUrl: 'https://open.spotify.com/user/31r367fhbny2hd3bdbyo5q3vvjlu',
                emoji: '🎧',
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
    <group>
      {/* ── Boardwalk Deck Platform ────────────────────────────────── */}
      <mesh position={[0, 0.05, 25.5]} receiveShadow>
        <boxGeometry args={[9.5, 0.1, 5.5]} />
        <meshStandardMaterial color="#b45309" roughness={0.8} />
      </mesh>

      {/* Beach Sun Parasols & Loungers on the sand beside the deck */}
      {[-6.2, 6.2].map((x, i) => (
        <group key={`beach-lounge-${i}`} position={[x, 0, 24.5]} rotation={[0, i === 0 ? 0.3 : -0.3, 0]}>
          {/* Parasol Pole */}
          <mesh position={[0, 1.4, 0]} castShadow>
            <cylinderGeometry args={[0.04, 0.05, 2.8, 6]} />
            <meshStandardMaterial color="#ffffff" roughness={0.3} />
          </mesh>
          {/* Parasol Canopy Cone */}
          <mesh position={[0, 2.6, 0]} castShadow>
            <coneGeometry args={[1.5, 0.6, 8]} />
            <meshStandardMaterial color={i === 0 ? '#ef4444' : '#0284c7'} roughness={0.6} />
          </mesh>
          {/* Sun Lounger Chair */}
          <group position={[0.4, 0.15, -0.2]} rotation={[-0.2, 0, 0]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[0.7, 0.1, 1.8]} />
              <meshStandardMaterial color="#38bdf8" roughness={0.5} />
            </mesh>
          </group>
        </group>
      ))}

      {/* ── Colorful Striped Sun Awning ────────────────────────────── */}
      <group position={[0, 2.8, 25.5]}>
        <mesh rotation={[0.08, 0, 0]} castShadow>
          <boxGeometry args={[9.8, 0.1, 5.8]} />
          <meshStandardMaterial color="#f59e0b" roughness={0.6} />
        </mesh>
        {/* Palm corner posts */}
        {[-4.5, 4.5].map((x, i) =>
          [-2.5, 2.5].map((z, j) => (
            <mesh key={`${i}-${j}`} position={[x, -1.4, z]} castShadow>
              <cylinderGeometry args={[0.1, 0.12, 2.8, 8]} />
              <meshStandardMaterial color="#78350f" roughness={0.9} />
            </mesh>
          ))
        )}
        <Billboard position={[0, 0.7, 0]}>
          <Text fontSize={0.28} color="#0369a1" anchorX="center" anchorY="middle">
            ARCADE BAY // ENTERTAINMENT
          </Text>
        </Billboard>
      </group>

      {/* ── 3 Arcade Cabinets ──────────────────────────────────────── */}
      {CABINETS.map((cab) => (
        <ArcadeCabinet key={cab.id} cabinet={cab} />
      ))}

      {/* ── Interactive Beach Jukebox ──────────────────────────────── */}
      <group
        position={JUKE_POS}
        onClick={() => {
          islandAudio.playChime(880);
          openInspect({
            title: 'ISLAND JUKEBOX & PLAYLISTS',
            subtitle: 'Spotify Curations · Lo-Fi Beats & Synthwave',
            badge: 'MUSIC VAULT',
            sections: [
              {
                heading: 'Spotify Public Curations',
                body: '• जीवन (Life & Nostalgia) — 18 tracks\n• "PEAK" (Intense & Focus Beats) — 18 tracks\n• puhNjabi (Punjabi & Folk Beats) — 15 tracks\n• एफ (Chill & Atmospheric) — 19 tracks\n• ´⁠ε⁠｀ & ￣⁠ ³⁠ ￣ (Lo-Fi Comfort & Late Night Flow)\n• Profile: https://open.spotify.com/user/31r367fhbny2hd3bdbyo5q3vvjlu',
              },
              {
                heading: 'YouTube Music Radio',
                body: '• Synthwave & Retrowave Highway (Coding sprints)\n• Lofi Hip Hop / Focus Beats (@wtfk1y0)\n• Profile: https://music.youtube.com/@wtfk1y0',
              },
            ],
            actions: [
              {
                label: 'OPEN MUSIC LOUNGE',
                route: '/music',
                emoji: '🎵',
                variant: 'primary',
              },
              {
                label: 'OPEN ENTERTAINMENT',
                route: '/entertainment',
                emoji: '🎬',
                variant: 'secondary',
              },
              {
                label: 'SPOTIFY PROFILE',
                externalUrl: 'https://open.spotify.com/user/31r367fhbny2hd3bdbyo5q3vvjlu',
                emoji: '🎧',
                variant: 'accent',
              },
            ],
          });
        }}
      >
        {/* Jukebox Dome Body */}
        <RigidBody type="fixed" colliders="cuboid">
          <mesh position={[0, 0.8, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.5, 0.55, 1.6, 12]} />
            <meshStandardMaterial color="#7c3aed" roughness={0.5} />
          </mesh>
        </RigidBody>

        {/* Glowing Rainbow Arch Trim */}
        <mesh position={[0, 1.45, 0.25]}>
          <ringGeometry args={[0.3, 0.42, 16]} />
          <meshStandardMaterial
            color="#ec4899"
            emissive="#a855f7"
            emissiveIntensity={0.8}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Rotating Music Note Floating Icon */}
        <group ref={jukeIconRef} position={[0, 2.1, 0]}>
          <mesh castShadow>
            <octahedronGeometry args={[0.26, 0]} />
            <meshStandardMaterial
              color="#fbbf24"
              emissive="#f59e0b"
              emissiveIntensity={0.7}
              roughness={0.2}
            />
          </mesh>
        </group>

        {/* Billboard Prompt */}
        <Billboard position={[0, 2.7, 0]}>
          <Text
            fontSize={0.18}
            color="#7c3aed"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.03}
            outlineColor="#ffffff"
          >
            🎵 ISLAND JUKEBOX
          </Text>
          <Text
            position={[0, -0.16, 0]}
            fontSize={0.11}
            color="#64748b"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.02}
            outlineColor="#ffffff"
          >
            [E] SPOTIFY & LO-FI BEATS
          </Text>
        </Billboard>
      </group>
    </group>
  );
}
