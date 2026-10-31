/**
 * GamingArcade.tsx — Physically Enterable Retro-Modern Arcade & Esports Hall
 *
 * Location: South-West [-12, 0, 15] (facing North-East toward Sunshine Plaza)
 * Features:
 * - Retro arcade architecture with neon marquee border & checkered entrance
 * - Open walk-in doorway with illuminated marquee sign
 * - Ultraviolet & neon blue interior lighting, 3 Custom Arcade Cabinets:
 *   1. Chess.com Cabinet (nerfedAYushhhMaN · 2100 Elo peak)
 *   2. Clash Royale Cabinet (Slur · 10,200 Trophies)
 *   3. BGMI Cabinet (Rish Ke Papa · UID 55528652768 · KD 5.63)
 * - Trophy Showcase & Hall of Fame Leaderboard
 */
import React, { useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import { Text, Billboard } from '@react-three/drei';
import { useIslandStore } from './useIslandStore';
import * as THREE from 'three';

export default function GamingArcade() {
  const { playerPosition, setNearbyTarget, nearbyTarget, openInspect, setCurrentArea } =
    useIslandStore();

  const ARCADE_POS = [-12, 0, 15] as const;
  const ROT_Y = 2.4; // Facing North-East toward central plaza

  const W = 7.2;
  const H = 3.6;
  const D = 6.2;

  // Local positions inside Arcade
  const CHESS_LOCAL: [number, number, number] = [-1.8, 0, -1.8];
  const CLASH_LOCAL: [number, number, number] = [0, 0, -1.8];
  const BGMI_LOCAL: [number, number, number] = [1.8, 0, -1.8];
  const TROPHY_LOCAL: [number, number, number] = [-2.2, 0, 0.4];

  const toWorld = (local: [number, number, number]): [number, number, number] => [
    ARCADE_POS[0] + local[0] * Math.cos(ROT_Y) + local[2] * Math.sin(ROT_Y),
    0,
    ARCADE_POS[2] - local[0] * Math.sin(ROT_Y) + local[2] * Math.cos(ROT_Y),
  ];

  useFrame(() => {
    const [px, , pz] = playerPosition;
    const distToCenter = Math.hypot(px - ARCADE_POS[0], pz - ARCADE_POS[2]);

    if (distToCenter < 3.4) {
      setCurrentArea('GAMING ARCADE');
    }

    const chPos = toWorld(CHESS_LOCAL);
    const clPos = toWorld(CLASH_LOCAL);
    const bgPos = toWorld(BGMI_LOCAL);
    const trPos = toWorld(TROPHY_LOCAL);

    if (Math.hypot(px - chPos[0], pz - chPos[2]) < 2.8) {
      if (!nearbyTarget || nearbyTarget.id !== 'arc_chess') {
        setNearbyTarget({
          id: 'arc_chess',
          title: 'CHESS.COM ARCADE CABINET',
          subtitle: 'Press [E] to inspect Chess.com stats (2100 Elo peak)',
        });
      }
    } else if (Math.hypot(px - clPos[0], pz - clPos[2]) < 2.8) {
      if (!nearbyTarget || nearbyTarget.id !== 'arc_clash') {
        setNearbyTarget({
          id: 'arc_clash',
          title: 'CLASH ROYALE CABINET',
          subtitle: 'Press [E] to inspect Clash Royale rank (10,200 trophies)',
        });
      }
    } else if (Math.hypot(px - bgPos[0], pz - bgPos[2]) < 2.8) {
      if (!nearbyTarget || nearbyTarget.id !== 'arc_bgmi') {
        setNearbyTarget({
          id: 'arc_bgmi',
          title: 'BGMI TACTICAL CABINET',
          subtitle: 'Press [E] to inspect BGMI squad stats (KD 5.63 · Assaulter)',
        });
      }
    } else if (Math.hypot(px - trPos[0], pz - trPos[2]) < 2.8) {
      if (!nearbyTarget || nearbyTarget.id !== 'arc_trophy') {
        setNearbyTarget({
          id: 'arc_trophy',
          title: 'TROPHY SHOWCASE',
          subtitle: 'Press [E] to review competitive gaming hall of fame',
        });
      }
    } else if (
      nearbyTarget?.id === 'arc_chess' ||
      nearbyTarget?.id === 'arc_clash' ||
      nearbyTarget?.id === 'arc_bgmi' ||
      nearbyTarget?.id === 'arc_trophy'
    ) {
      setNearbyTarget(null);
    }
  });

  // Handle [E] key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'KeyE') {
        const target = useIslandStore.getState().nearbyTarget;
        if (!target) return;

        if (target.id === 'arc_chess') {
          openInspect({
            title: 'CHESS.COM · COMPETITIVE STATS',
            subtitle: 'Handle: nerfedAYushhhMaN · 2100 Peak Elo',
            badge: 'TOP 1% GLOBAL',
            sections: [
              {
                heading: 'Rating Breakdown',
                body: '• Bullet Peak: 2100 Elo (Master level speed calculation)\n• Blitz Peak: 2053 Elo\n• Rapid Peak: 2035 Elo\n• Profile: https://www.chess.com/member/nerfedayushhhman',
              },
              {
                heading: 'Tactical Repertoire',
                body: 'Aggressive opening preparation featuring the Sicilian Dragon, King’s Indian Defense, and high-pressure tactical combinations in dynamic middlegames.',
              },
            ],
            actions: [
              {
                label: 'CHESS.COM PROFILE',
                externalUrl: 'https://www.chess.com/member/nerfedayushhhman',
                emoji: '♟️',
                variant: 'primary',
              },
              { label: 'OPEN GAMING HUB', route: '/gaming', emoji: '🎮', variant: 'secondary' },
            ],
          });
        } else if (target.id === 'arc_clash') {
          openInspect({
            title: 'CLASH ROYALE · 10,200 TROPHIES',
            subtitle: 'In-Game Name: Slur · Supercell',
            badge: 'ULTIMATE CHAMPION',
            sections: [
              {
                heading: 'Ladder Statistics',
                body: '• Trophy Count: 10,200 Trophies (Verified Profile)\n• League: Path of Legends Ultimate Champion\n• Role: High-ladder competitive battler\n• Status: Verified account',
              },
              {
                heading: 'Strategic Playstyle',
                body: 'Precision elixir management, surgical card counting, and devastating counter-pushes that punish opponent mistakes instantly.',
              },
            ],
            actions: [
              { label: 'OPEN GAMING PAGE', route: '/gaming', emoji: '👑', variant: 'primary' },
            ],
          });
        } else if (target.id === 'arc_bgmi') {
          openInspect({
            title: 'BGMI (BATTLEGROUNDS MOBILE INDIA)',
            subtitle: 'In-Game Name: Rish Ke Papa · UID: 55528652768',
            badge: 'KD 5.63 · SQUAD ASSAULTER',
            sections: [
              {
                heading: 'Account Telemetry',
                body: '• Displayed Name: Rish Ke Papa\n• Account UID: 55528652768\n• Clan: HOMIES\n• K/D Ratio: 5.63\n• Role: Assaulter / Entry Fragger',
              },
              {
                heading: 'Combat Characteristics',
                body: 'High-kill games, rapid close-quarters spray transfers, and tactical flank rotations in tier-1 squad lobbies.',
              },
            ],
            actions: [
              { label: 'OPEN GAMING PAGE', route: '/gaming', emoji: '🎯', variant: 'primary' },
            ],
          });
        } else if (target.id === 'arc_trophy') {
          openInspect({
            title: 'ARCADE TROPHY SHOWCASE',
            subtitle: 'Hall of Fame & High-Tier Rankings',
            badge: 'LEADERBOARD',
            sections: [
              {
                heading: 'Summary of Verified Ranks',
                body: '1. Chess.com: 2100 Elo (nerfedAYushhhMaN)\n2. Clash Royale: 10,200 Trophies (Slur)\n3. BGMI: 5.63 KD with Clan HOMIES (Rish Ke Papa)',
              },
            ],
            actions: [
              { label: 'VIEW FULL GAMING PORTFOLIO', route: '/gaming', emoji: '🏆', variant: 'primary' },
            ],
          });
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [openInspect]);

  return (
    <group position={ARCADE_POS} rotation={[0, ROT_Y, 0]}>
      {/* ── Floor & Checkered Porch ───────────────────────────────── */}
      {/* Dark Slate Interior Floor */}
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <boxGeometry args={[W - 0.2, 0.1, D - 0.2]} />
        <meshStandardMaterial color="#0f172a" roughness={0.5} />
      </mesh>

      {/* Neon Runner Carpet */}
      <mesh position={[0, 0.06, 0]}>
        <boxGeometry args={[1.6, 0.02, D - 0.4]} />
        <meshStandardMaterial color="#0284c7" emissive="#0284c7" emissiveIntensity={0.3} />
      </mesh>

      {/* Front Checkered Porch Deck */}
      <mesh position={[0, 0.05, D / 2 + 0.9]} receiveShadow>
        <boxGeometry args={[4.4, 0.1, 1.8]} />
        <meshStandardMaterial color="#1e293b" roughness={0.7} />
      </mesh>

      {/* Front Plaque Sign */}
      <Billboard position={[0, H + 0.35, D / 2 + 0.2]}>
        <Text
          fontSize={0.24}
          color="#d946ef"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.03}
          outlineColor="#000000"
        >
          GAMING ARCADE
        </Text>
      </Billboard>

      {/* ── Collidable Wall Enclosure with Open Doorway ───────────── */}
      <RigidBody type="fixed" colliders={false}>
        {/* Back Wall */}
        <CuboidCollider args={[W / 2, H / 2, 0.15]} position={[0, H / 2, -D / 2]} />
        <mesh position={[0, H / 2, -D / 2]} castShadow receiveShadow>
          <boxGeometry args={[W, H, 0.22]} />
          <meshStandardMaterial color="#1e1b4b" roughness={0.7} />
        </mesh>

        {/* Left Wall */}
        <CuboidCollider args={[0.15, H / 2, D / 2]} position={[-W / 2, H / 2, 0]} />
        <mesh position={[-W / 2, H / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.22, H, D]} />
          <meshStandardMaterial color="#1e1b4b" roughness={0.7} />
        </mesh>

        {/* Right Wall */}
        <CuboidCollider args={[0.15, H / 2, D / 2]} position={[W / 2, H / 2, 0]} />
        <mesh position={[W / 2, H / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.22, H, D]} />
          <meshStandardMaterial color="#1e1b4b" roughness={0.7} />
        </mesh>

        {/* Front Wall Left Segment */}
        <CuboidCollider args={[(W / 2 - 0.9) / 2, H / 2, 0.15]} position={[-W / 4 - 0.45, H / 2, D / 2]} />
        <mesh position={[-W / 4 - 0.45, H / 2, D / 2]} castShadow receiveShadow>
          <boxGeometry args={[W / 2 - 0.9, H, 0.22]} />
          <meshStandardMaterial color="#1e1b4b" roughness={0.7} />
        </mesh>

        {/* Front Wall Right Segment */}
        <CuboidCollider args={[(W / 2 - 0.9) / 2, H / 2, 0.15]} position={[W / 4 + 0.45, H / 2, D / 2]} />
        <mesh position={[W / 4 + 0.45, H / 2, D / 2]} castShadow receiveShadow>
          <boxGeometry args={[W / 2 - 0.9, H, 0.22]} />
          <meshStandardMaterial color="#1e1b4b" roughness={0.7} />
        </mesh>

        {/* Front Doorway Lintel */}
        <CuboidCollider args={[0.9, 0.4, 0.15]} position={[0, H - 0.4, D / 2]} />
        <mesh position={[0, H - 0.4, D / 2]} castShadow>
          <boxGeometry args={[1.8, 0.8, 0.22]} />
          <meshStandardMaterial color="#d946ef" roughness={0.5} />
        </mesh>
      </RigidBody>

      {/* ── Arcade Flat Roof with Neon Trim ─────────────────────────── */}
      <RigidBody type="fixed" colliders="hull">
        <mesh position={[0, H + 0.6, 0]} castShadow>
          <boxGeometry args={[W + 0.6, 0.4, D + 0.6]} />
          <meshStandardMaterial color="#0f172a" roughness={0.5} />
        </mesh>
      </RigidBody>

      {/* Neon Marquee Glow Trim */}
      <mesh position={[0, H + 0.6, D / 2 + 0.35]}>
        <boxGeometry args={[W + 0.6, 0.12, 0.1]} />
        <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={0.9} />
      </mesh>

      {/* ── Interior Ultraviolet Neon Lighting ─────────────────────── */}
      <pointLight position={[0, H - 0.6, 0]} color="#c084fc" intensity={1.2} distance={8} />

      {/* ── 3 Custom Arcade Cabinets along Rear Wall ────────────────── */}
      {/* 1. Chess.com Cabinet */}
      <group position={CHESS_LOCAL}>
        <mesh position={[0, 0.9, 0]} castShadow>
          <boxGeometry args={[0.9, 1.8, 0.7]} />
          <meshStandardMaterial color="#1e293b" roughness={0.5} />
        </mesh>
        <mesh position={[0, 1.35, 0.22]} rotation={[-0.2, 0, 0]}>
          <boxGeometry args={[0.7, 0.45, 0.05]} />
          <meshStandardMaterial color="#81B64C" emissive="#81B64C" emissiveIntensity={0.6} />
        </mesh>
        <Billboard position={[0, 2.1, 0]}>
          <Text fontSize={0.15} color="#86efac" outlineWidth={0.02} outlineColor="#000000">
            [E] CHESS.COM
          </Text>
        </Billboard>
      </group>

      {/* 2. Clash Royale Cabinet */}
      <group position={CLASH_LOCAL}>
        <mesh position={[0, 0.9, 0]} castShadow>
          <boxGeometry args={[0.9, 1.8, 0.7]} />
          <meshStandardMaterial color="#1e293b" roughness={0.5} />
        </mesh>
        <mesh position={[0, 1.35, 0.22]} rotation={[-0.2, 0, 0]}>
          <boxGeometry args={[0.7, 0.45, 0.05]} />
          <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={0.6} />
        </mesh>
        <Billboard position={[0, 2.1, 0]}>
          <Text fontSize={0.15} color="#60a5fa" outlineWidth={0.02} outlineColor="#000000">
            [E] CLASH ROYALE
          </Text>
        </Billboard>
      </group>

      {/* 3. BGMI Cabinet */}
      <group position={BGMI_LOCAL}>
        <mesh position={[0, 0.9, 0]} castShadow>
          <boxGeometry args={[0.9, 1.8, 0.7]} />
          <meshStandardMaterial color="#1e293b" roughness={0.5} />
        </mesh>
        <mesh position={[0, 1.35, 0.22]} rotation={[-0.2, 0, 0]}>
          <boxGeometry args={[0.7, 0.45, 0.05]} />
          <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0.6} />
        </mesh>
        <Billboard position={[0, 2.1, 0]}>
          <Text fontSize={0.15} color="#fbbf24" outlineWidth={0.02} outlineColor="#000000">
            [E] BGMI
          </Text>
        </Billboard>
      </group>

      {/* ── Trophy Showcase Wall (Left Wall) ───────────────────────── */}
      <group position={TROPHY_LOCAL} rotation={[0, Math.PI / 2, 0]}>
        <mesh position={[0, 0.9, 0]} castShadow>
          <boxGeometry args={[1.6, 1.8, 0.5]} />
          <meshStandardMaterial color="#0f172a" roughness={0.6} />
        </mesh>
        {/* Golden Trophies */}
        {[-0.4, 0, 0.4].map((tx, ti) => (
          <mesh key={ti} position={[tx, 1.15, 0.12]} castShadow>
            <cylinderGeometry args={[0.1, 0.14, 0.35, 8]} />
            <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.2} />
          </mesh>
        ))}
        <Billboard position={[0, 2.1, 0]}>
          <Text fontSize={0.15} color="#fbbf24" outlineWidth={0.02} outlineColor="#000000">
            [E] TROPHY CASE
          </Text>
        </Billboard>
      </group>
    </group>
  );
}
