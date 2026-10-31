/**
 * CommunityHall.tsx — Physically Enterable Village Town Hall & Social Hub
 *
 * Location: East [17, 0, 4] (facing West toward Sunshine Plaza)
 * Features:
 * - Colonial town hall architecture with timber clapboard, terracotta roof & bell cupola
 * - Open walk-in double doorway with wide porch
 * - Warm honey-oak timber interior, chandelier and reception counter
 * - Interactive Social Telegraph & Broadcast Console (Instagram, GitHub, Spotify, Email)
 * - Interactive Visitor Guestbook
 * - Interactive Community Notice Board
 */
import React, { useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import { Text, Billboard } from '@react-three/drei';
import { useIslandStore } from './useIslandStore';
import * as THREE from 'three';

export default function CommunityHall() {
  const { playerPosition, setNearbyTarget, nearbyTarget, openInspect, setCurrentArea } =
    useIslandStore();

  const HALL_POS = [17, 0, 4] as const;
  const ROT_Y = -Math.PI / 2; // Facing West toward central plaza

  const W = 7.2;
  const H = 3.6;
  const D = 6.2;

  // Local positions inside Community Hall
  const TELEGRAPH_LOCAL: [number, number, number] = [0, 0, -1.8];
  const GUESTBOOK_LOCAL: [number, number, number] = [-2.0, 0, 0.4];
  const BULLETIN_LOCAL: [number, number, number] = [2.2, 0, 0.4];

  const toWorld = (local: [number, number, number]): [number, number, number] => [
    HALL_POS[0] + local[0] * Math.cos(ROT_Y) + local[2] * Math.sin(ROT_Y),
    0,
    HALL_POS[2] - local[0] * Math.sin(ROT_Y) + local[2] * Math.cos(ROT_Y),
  ];

  useFrame(() => {
    const [px, , pz] = playerPosition;
    const distToCenter = Math.hypot(px - HALL_POS[0], pz - HALL_POS[2]);

    if (distToCenter < 3.4) {
      setCurrentArea('COMMUNITY HALL');
    }

    const tPos = toWorld(TELEGRAPH_LOCAL);
    const gPos = toWorld(GUESTBOOK_LOCAL);
    const bPos = toWorld(BULLETIN_LOCAL);

    if (Math.hypot(px - tPos[0], pz - tPos[2]) < 2.8) {
      if (!nearbyTarget || nearbyTarget.id !== 'comm_telegraph') {
        setNearbyTarget({
          id: 'comm_telegraph',
          title: 'SOCIAL TELEGRAPH & PROFILES',
          subtitle: 'Press [E] to connect on Instagram, GitHub, Spotify & Email',
        });
      }
    } else if (Math.hypot(px - gPos[0], pz - gPos[2]) < 2.8) {
      if (!nearbyTarget || nearbyTarget.id !== 'comm_guestbook') {
        setNearbyTarget({
          id: 'comm_guestbook',
          title: 'VISITOR GUESTBOOK',
          subtitle: 'Press [E] to sign the island memory ledger',
        });
      }
    } else if (Math.hypot(px - bPos[0], pz - bPos[2]) < 2.8) {
      if (!nearbyTarget || nearbyTarget.id !== 'comm_bulletin') {
        setNearbyTarget({
          id: 'comm_bulletin',
          title: 'COMMUNITY NOTICE BOARD',
          subtitle: 'Press [E] to read island events & announcements',
        });
      }
    } else if (
      nearbyTarget?.id === 'comm_telegraph' ||
      nearbyTarget?.id === 'comm_guestbook' ||
      nearbyTarget?.id === 'comm_bulletin'
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

        if (target.id === 'comm_telegraph') {
          openInspect({
            title: 'AYUSHMAN’S SOCIAL & COMMUNITY TELEGRAPH',
            subtitle: 'Direct Channels & Verified Digital Profiles',
            badge: 'VERIFIED PROFILES',
            sections: [
              {
                heading: 'Instagram — @wtfk1yo',
                body: '• Handle: @wtfk1yo\n• Profile: https://www.instagram.com/wtfk1yo/\n• Bio: "hey there! i am using instagram."\n• 17 posts · 72 followers · Daily updates & stories',
              },
              {
                heading: 'GitHub — @Aayushman-debug',
                body: '• Profile: https://github.com/Aayushman-debug\n• Public Repositories: ayushman-os, mithila-art, CampusConnect\n• Contributions: Full-stack applications, 3D systems & tools',
              },
              {
                heading: 'Spotify & YouTube Music',
                body: '• Spotify Profile: AYushMan (User: 31r367fhbny2hd3bdbyo5q3vvjlu)\n• YouTube Music Handle: @wtfk1y0\n• 7 Public Curated Playlists',
              },
              {
                heading: 'Direct Email & Collaboration',
                body: '• Email: pathakaayushman57@gmail.com\n• Welcoming discussions regarding real-time 3D web engineering, agentic architecture, and software design.',
              },
            ],
            actions: [
              {
                label: 'INSTAGRAM (@wtfk1yo)',
                externalUrl: 'https://www.instagram.com/wtfk1yo/',
                emoji: '📸',
                variant: 'accent',
              },
              {
                label: 'GITHUB (@Aayushman-debug)',
                externalUrl: 'https://github.com/Aayushman-debug',
                emoji: '🐙',
                variant: 'primary',
              },
              { label: 'OPEN SOCIAL HUB', route: '/social', emoji: '🌐', variant: 'secondary' },
            ],
          });
        } else if (target.id === 'comm_guestbook') {
          openInspect({
            title: 'ISLAND VISITOR GUESTBOOK',
            subtitle: 'The Ledger of Explorers & Travelers',
            badge: 'COMMUNITY LEDGER',
            sections: [
              {
                heading: 'Welcome to Ayushman Island',
                body: 'Every traveler who sets foot on Sunshine Plaza and visits the Town Hall leaves an indelible spark on the island.',
              },
              {
                heading: 'Sign Your Name',
                body: 'Drop a message or feedback to connect directly with Ayushman Pathak.',
              },
            ],
            actions: [
              { label: 'CONTACT VIA SOCIAL HUB', route: '/social', emoji: '✉️', variant: 'primary' },
              { label: 'HOMEPAGE', route: '/', emoji: '🏠', variant: 'secondary' },
            ],
          });
        } else if (target.id === 'comm_bulletin') {
          openInspect({
            title: 'COMMUNITY NOTICE BOARD',
            subtitle: 'Island News, Project Milestones & Roadmap',
            badge: 'BULLETIN',
            sections: [
              {
                heading: 'Latest Island News',
                body: '• Village Overhaul: 7 fully furnished, enterable buildings constructed!\n• Symmetrical cobblestone avenues now seamlessly connect all districts.\n• Secret Golden Stars are hidden across scenic island vantage points.',
              },
            ],
            actions: [
              { label: 'VIEW ALL PROJECTS', route: '/developer', emoji: '📂', variant: 'primary' },
            ],
          });
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [openInspect]);

  return (
    <group position={HALL_POS} rotation={[0, ROT_Y, 0]}>
      {/* ── Floor & Porch ─────────────────────────────────────────── */}
      {/* Honey-Oak Interior Floor */}
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <boxGeometry args={[W - 0.2, 0.1, D - 0.2]} />
        <meshStandardMaterial color="#b45309" roughness={0.7} />
      </mesh>

      {/* Front Timber Porch Deck (facing West toward plaza) */}
      <mesh position={[0, 0.05, D / 2 + 0.9]} receiveShadow>
        <boxGeometry args={[4.6, 0.1, 1.8]} />
        <meshStandardMaterial color="#92400e" roughness={0.8} />
      </mesh>

      {/* Front Plaque Sign */}
      <Billboard position={[0, H + 0.4, D / 2 + 0.2]}>
        <Text
          fontSize={0.24}
          color="#b45309"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.03}
          outlineColor="#ffffff"
        >
          COMMUNITY HALL
        </Text>
      </Billboard>

      {/* ── Collidable Wall Enclosure with Open Doorway ───────────── */}
      <RigidBody type="fixed" colliders={false}>
        {/* Back Wall */}
        <CuboidCollider args={[W / 2, H / 2, 0.15]} position={[0, H / 2, -D / 2]} />
        <mesh position={[0, H / 2, -D / 2]} castShadow receiveShadow>
          <boxGeometry args={[W, H, 0.22]} />
          <meshStandardMaterial color="#fef3c7" roughness={0.7} />
        </mesh>

        {/* Left Wall */}
        <CuboidCollider args={[0.15, H / 2, D / 2]} position={[-W / 2, H / 2, 0]} />
        <mesh position={[-W / 2, H / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.22, H, D]} />
          <meshStandardMaterial color="#fef3c7" roughness={0.7} />
        </mesh>

        {/* Right Wall */}
        <CuboidCollider args={[0.15, H / 2, D / 2]} position={[W / 2, H / 2, 0]} />
        <mesh position={[W / 2, H / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.22, H, D]} />
          <meshStandardMaterial color="#fef3c7" roughness={0.7} />
        </mesh>

        {/* Front Wall Left Segment */}
        <CuboidCollider args={[(W / 2 - 1.0) / 2, H / 2, 0.15]} position={[-W / 4 - 0.5, H / 2, D / 2]} />
        <mesh position={[-W / 4 - 0.5, H / 2, D / 2]} castShadow receiveShadow>
          <boxGeometry args={[W / 2 - 1.0, H, 0.22]} />
          <meshStandardMaterial color="#fef3c7" roughness={0.7} />
        </mesh>

        {/* Front Wall Right Segment */}
        <CuboidCollider args={[(W / 2 - 1.0) / 2, H / 2, 0.15]} position={[W / 4 + 0.5, H / 2, D / 2]} />
        <mesh position={[W / 4 + 0.5, H / 2, D / 2]} castShadow receiveShadow>
          <boxGeometry args={[W / 2 - 1.0, H, 0.22]} />
          <meshStandardMaterial color="#fef3c7" roughness={0.7} />
        </mesh>

        {/* Front Doorway Arch / Lintel */}
        <CuboidCollider args={[1.0, 0.4, 0.15]} position={[0, H - 0.4, D / 2]} />
        <mesh position={[0, H - 0.4, D / 2]} castShadow>
          <boxGeometry args={[2.0, 0.8, 0.22]} />
          <meshStandardMaterial color="#ea580c" roughness={0.6} />
        </mesh>
      </RigidBody>

      {/* ── Terracotta Roof with Bell Gable Cupola ─────────────────── */}
      <RigidBody type="fixed" colliders="hull">
        <mesh position={[0, H + 0.8, 0]} castShadow>
          <boxGeometry args={[W + 0.8, 0.5, D + 0.8]} />
          <meshStandardMaterial color="#ea580c" roughness={0.6} />
        </mesh>
      </RigidBody>
      {/* Bell Cupola */}
      <mesh position={[0, H + 1.5, 0]} castShadow>
        <boxGeometry args={[1.2, 1.2, 1.2]} />
        <meshStandardMaterial color="#ffffff" roughness={0.4} />
      </mesh>
      {/* Bell Cupola Roof */}
      <mesh position={[0, H + 2.3, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[1.1, 0.8, 4]} />
        <meshStandardMaterial color="#ea580c" roughness={0.6} />
      </mesh>

      {/* Porch Pillars */}
      {[-1.9, 1.9].map((x, i) => (
        <mesh key={i} position={[x, 1.2, D / 2 + 1.6]} castShadow>
          <boxGeometry args={[0.18, 2.3, 0.18]} />
          <meshStandardMaterial color="#ffffff" roughness={0.5} />
        </mesh>
      ))}

      {/* ── Interior Lighting ─────────────────────────────────────── */}
      <pointLight position={[0, H - 0.6, 0]} color="#fef08a" intensity={1.1} distance={7.5} />

      {/* ── Central Social Telegraph & Broadcast Console ──────────── */}
      <group position={TELEGRAPH_LOCAL}>
        <mesh position={[0, 0.6, 0]} castShadow>
          <boxGeometry args={[1.8, 1.0, 0.8]} />
          <meshStandardMaterial color="#451a03" roughness={0.7} />
        </mesh>
        {/* Telegraph Radio Transmitter Mesh */}
        <mesh position={[0, 1.3, 0]} castShadow>
          <boxGeometry args={[1.0, 0.5, 0.4]} />
          <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Glowing Dial */}
        <mesh position={[0, 1.3, 0.22]}>
          <circleGeometry args={[0.15, 16]} />
          <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={0.8} />
        </mesh>
        <Billboard position={[0, 1.9, 0]}>
          <Text fontSize={0.15} color="#ea580c" outlineWidth={0.02} outlineColor="#ffffff">
            [E] SOCIAL TELEGRAPH
          </Text>
        </Billboard>
      </group>

      {/* ── Visitor Guestbook Table (Left Side) ────────────────────── */}
      <group position={GUESTBOOK_LOCAL}>
        <mesh position={[0, 0.75, 0]} castShadow>
          <boxGeometry args={[1.2, 0.08, 0.7]} />
          <meshStandardMaterial color="#78350f" roughness={0.7} />
        </mesh>
        {/* Guestbook Ledger */}
        <mesh position={[0, 0.82, 0]} rotation={[0, 0.2, 0]}>
          <boxGeometry args={[0.5, 0.06, 0.4]} />
          <meshStandardMaterial color="#fef08a" roughness={0.5} />
        </mesh>
        <Billboard position={[0, 1.4, 0]}>
          <Text fontSize={0.14} color="#0284c7" outlineWidth={0.02} outlineColor="#ffffff">
            [E] GUESTBOOK
          </Text>
        </Billboard>
      </group>

      {/* ── Notice Bulletin Board (Right Wall) ─────────────────────── */}
      <group position={BULLETIN_LOCAL} rotation={[0, -Math.PI / 2, 0]}>
        <mesh position={[0, 1.6, 0]} castShadow>
          <boxGeometry args={[1.8, 1.4, 0.08]} />
          <meshStandardMaterial color="#b45309" roughness={0.9} />
        </mesh>
        {/* Pinned Note Papers */}
        {[-0.5, 0, 0.5].map((nx, ni) => (
          <mesh key={ni} position={[nx, 1.6 + (ni % 2 === 0 ? 0.1 : -0.1), 0.05]}>
            <planeGeometry args={[0.35, 0.45]} />
            <meshStandardMaterial color={['#fef08a', '#e0f2fe', '#fed7aa'][ni]} />
          </mesh>
        ))}
        <Billboard position={[0, 2.5, 0]}>
          <Text fontSize={0.14} color="#b45309" outlineWidth={0.02} outlineColor="#ffffff">
            [E] NOTICE BOARD
          </Text>
        </Billboard>
      </group>
    </group>
  );
}
