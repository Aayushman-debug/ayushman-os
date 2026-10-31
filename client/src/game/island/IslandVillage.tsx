/**
 * IslandVillage.tsx — Cohesive, Life-Simulation Walkable Island Village
 *
 * Surrounds Sunshine Plaza [0, 0, 0] with 7 Real, Enterable Buildings:
 * 1. Sunshine Cottage (My Home) [-12, 0, -10]
 * 2. Developer Studio [-16, 0, 4]
 * 3. Anime & Manga Lounge [0, 0, -18]
 * 4. Academics Library [14, 0, -11]
 * 5. Community Hall [17, 0, 4]
 * 6. Music Café [12, 0, 15]
 * 7. Gaming Arcade [-12, 0, 15]
 *
 * Plus central plaza fountain, 4-way signpost, wardrobe mirror booth,
 * NPCs, and distant coastal lighthouse landmark.
 */
import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';
import { Text, Billboard } from '@react-three/drei';
import { useIslandStore } from './useIslandStore';
import EnterableCottage from './EnterableCottage';
import DeveloperStudio from './DeveloperStudio';
import AnimeHouse from './AnimeHouse';
import AcademicsLibrary from './AcademicsLibrary';
import CommunityHall from './CommunityHall';
import MusicCafe from './MusicCafe';
import GamingArcade from './GamingArcade';
import IslandNPCs from './IslandNPCs';
import IslandCollectibles from './IslandCollectibles';
import * as THREE from 'three';

/* ─── Central Plaza Fountain ───────────────────────────────────────── */
function VillageFountain() {
  const waterRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (waterRef.current) {
      waterRef.current.rotation.z = clock.getElapsedTime() * 0.3;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Outer Stone Pool Basin */}
      <RigidBody type="fixed" colliders="hull">
        <mesh position={[0, 0.3, 0]} receiveShadow castShadow>
          <cylinderGeometry args={[2.8, 3.1, 0.6, 16]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.7} flatShading />
        </mesh>
      </RigidBody>

      {/* Inner Basin Water */}
      <mesh position={[0, 0.45, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2.5, 16]} />
        <meshStandardMaterial color="#0284c7" roughness={0.2} />
      </mesh>

      {/* Water Surface */}
      <mesh ref={waterRef} position={[0, 0.52, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2.45, 16]} />
        <meshStandardMaterial
          color="#38bdf8"
          roughness={0.1}
          metalness={0.1}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Center Pillar */}
      <mesh position={[0, 1.1, 0]} castShadow>
        <cylinderGeometry args={[0.55, 0.75, 1.4, 12]} />
        <meshStandardMaterial color="#64748b" roughness={0.6} flatShading />
      </mesh>

      {/* Center Water Spout Orb */}
      <mesh position={[0, 1.9, 0]}>
        <sphereGeometry args={[0.35, 12, 12]} />
        <meshStandardMaterial
          color="#7dd3fc"
          roughness={0.1}
          emissive="#38bdf8"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Fountain Label */}
      <Billboard position={[0, 2.7, 0]}>
        <Text
          fontSize={0.28}
          color="#0369a1"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.03}
          outlineColor="#ffffff"
        >
          SUNSHINE PLAZA // SPAWN
        </Text>
      </Billboard>
    </group>
  );
}

/* ─── Directional Village Signpost ─────────────────────────────────── */
function VillageSignpost() {
  const { playerPosition, setNearbyTarget, nearbyTarget, openInspect } = useIslandStore();
  const SIGN_POS = [2.2, 0, 2.2] as const;

  useFrame(() => {
    const [px, , pz] = playerPosition;
    const dist = Math.hypot(px - SIGN_POS[0], pz - SIGN_POS[2]);
    if (dist < 2.5) {
      if (!nearbyTarget || nearbyTarget.id !== 'signpost') {
        setNearbyTarget({
          id: 'signpost',
          title: 'VILLAGE DIRECTORY SIGNPOST',
          subtitle: 'Press [E] to read island guide & building directions',
        });
      }
    } else if (nearbyTarget?.id === 'signpost') {
      setNearbyTarget(null);
    }
  });

  const inspectDirectory = () => {
    openInspect({
      title: 'SUNSHINE VILLAGE // ISLAND DIRECTORY',
      subtitle: 'Walkable 3D Interface to AYushMan OS',
      badge: 'VILLAGE MAP',
      sections: [
        {
          heading: 'Welcome to Ayushman Island',
          body: 'This village is a fully walkable life-simulation interface. Every building can be entered on foot and contains real website content, verified records, and live links.',
        },
        {
          heading: 'Building Navigation Guide',
          body: '• ↖ Sunshine Cottage: My personal home, dev workstation, and engineering bio\n• ◀ Developer Studio: AYushMan OS, Mithila Art, CampusConnect & tech stack\n• ▲ Anime House: Curated anime watchlist (AoT, One Piece, Naruto) & manga\n• ↗ Academics Library: RTU Kota B.Tech CSE performance, SGPAs & labs\n• ▶ Community Hall: Social telegraph (Instagram @wtfk1yo, GitHub, Spotify)\n• ↘ Music Café: 7 authentic Spotify playlists and interactive lo-fi jukebox\n• ↙ Gaming Arcade: Competitive rankings (Chess.com 2100 Elo, Clash Royale 10.2K)\n• ▼ Southern Boardwalk Pier: Scenic coastal walk into the ocean horizon',
        },
      ],
      actions: [
        {
          label: 'OPEN DEVELOPER PROJECTS',
          route: '/developer',
          emoji: '💻',
          variant: 'primary',
        },
        {
          label: 'VIEW ACADEMIC TRANSCRIPTS',
          route: '/academics',
          emoji: '🎓',
          variant: 'secondary',
        },
        {
          label: 'SOCIAL HUB',
          route: '/social',
          emoji: '🌐',
          variant: 'accent',
        },
      ],
    });
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'KeyE') {
        const [px, , pz] = playerPosition;
        if (Math.hypot(px - SIGN_POS[0], pz - SIGN_POS[2]) < 2.5) {
          inspectDirectory();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [playerPosition, openInspect]);

  return (
    <group position={SIGN_POS} rotation={[0, -Math.PI / 4, 0]} onClick={inspectDirectory}>
      {/* Wooden Post */}
      <mesh position={[0, 1.1, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.1, 2.2, 6]} />
        <meshStandardMaterial color="#78350f" roughness={0.9} />
      </mesh>

      {/* Sign 1: North -> Anime House */}
      <group position={[0, 1.85, 0]} rotation={[0, 0, 0.05]}>
        <mesh castShadow>
          <boxGeometry args={[1.5, 0.26, 0.06]} />
          <meshStandardMaterial color="#fef08a" roughness={0.7} />
        </mesh>
        <Text fontSize={0.11} color="#78350f" position={[0, 0, 0.04]} anchorX="center" anchorY="middle">
          ▲ ANIME HOUSE
        </Text>
      </group>

      {/* Sign 2: East -> Community Hall & Library */}
      <group position={[0, 1.5, 0]} rotation={[0, Math.PI / 2, -0.05]}>
        <mesh castShadow>
          <boxGeometry args={[1.5, 0.26, 0.06]} />
          <meshStandardMaterial color="#fed7aa" roughness={0.7} />
        </mesh>
        <Text fontSize={0.11} color="#78350f" position={[0, 0, 0.04]} anchorX="center" anchorY="middle">
          ▶ TOWN HALL & LIBRARY
        </Text>
      </group>

      {/* Sign 3: West -> Dev Studio & Cottage */}
      <group position={[0, 1.15, 0]} rotation={[0, -Math.PI / 2, 0.04]}>
        <mesh castShadow>
          <boxGeometry args={[1.5, 0.26, 0.06]} />
          <meshStandardMaterial color="#bbf7d0" roughness={0.7} />
        </mesh>
        <Text fontSize={0.11} color="#14532d" position={[0, 0, 0.04]} anchorX="center" anchorY="middle">
          ◀ DEV STUDIO & HOME
        </Text>
      </group>

      {/* Sign 4: South -> Arcade & Café */}
      <group position={[0, 0.8, 0]} rotation={[0, Math.PI, -0.04]}>
        <mesh castShadow>
          <boxGeometry args={[1.5, 0.26, 0.06]} />
          <meshStandardMaterial color="#bae6fd" roughness={0.7} />
        </mesh>
        <Text fontSize={0.11} color="#0369a1" position={[0, 0, 0.04]} anchorX="center" anchorY="middle">
          ▼ ARCADE & MUSIC CAFÉ
        </Text>
      </group>
    </group>
  );
}

/* ─── Wardrobe & Dressing Mirror Booth ────────────────────────────── */
function WardrobeMirrorBooth() {
  const { playerPosition, setNearbyTarget, setCustomizerOpen, nearbyTarget } = useIslandStore();
  const iconRef = useRef<THREE.Group>(null);
  const boothX = -3.2;
  const boothZ = 3.2;

  useFrame(({ clock }) => {
    if (iconRef.current) {
      iconRef.current.rotation.y = clock.getElapsedTime() * 1.5;
      iconRef.current.position.y = 2.7 + Math.sin(clock.getElapsedTime() * 3) * 0.08;
    }

    const [px, , pz] = playerPosition;
    const dist = Math.hypot(px - boothX, pz - boothZ);

    if (dist < 3.0) {
      if (!nearbyTarget || nearbyTarget.id !== 'wardrobe') {
        setNearbyTarget({
          id: 'wardrobe',
          title: 'WARDROBE & MIRROR',
          subtitle: 'Press [E] or [C] to customize avatar',
        });
      }
    } else if (nearbyTarget?.id === 'wardrobe') {
      setNearbyTarget(null);
    }
  });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'KeyE') {
        const [px, , pz] = playerPosition;
        const dist = Math.hypot(px - boothX, pz - boothZ);
        if (dist < 3.0) {
          setCustomizerOpen(true);
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [playerPosition, setCustomizerOpen]);

  return (
    <group
      position={[boothX, 0, boothZ]}
      rotation={[0, Math.PI / 4, 0]}
      onClick={() => setCustomizerOpen(true)}
    >
      {/* Wooden Platform Floor */}
      <mesh position={[0, 0.06, 0]} receiveShadow>
        <boxGeometry args={[2.2, 0.12, 1.8]} />
        <meshStandardMaterial color="#b45309" roughness={0.8} />
      </mesh>

      {/* Booth Back Wall & Frame */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[0, 1.3, -0.6]} castShadow>
          <boxGeometry args={[1.9, 2.5, 0.16]} />
          <meshStandardMaterial color="#fed7aa" roughness={0.7} />
        </mesh>
      </RigidBody>

      {/* Dressing Mirror Glass */}
      <mesh position={[0, 1.35, -0.51]}>
        <planeGeometry args={[1.4, 2.0]} />
        <meshStandardMaterial
          color="#e0f2fe"
          roughness={0.05}
          metalness={0.85}
        />
      </mesh>

      {/* Golden Hollywood Mirror Bulbs */}
      {[-0.65, 0.65].map((x, colIdx) =>
        [-0.8, -0.4, 0, 0.4, 0.8].map((y, rowIdx) => (
          <mesh key={`${colIdx}-${rowIdx}`} position={[x, 1.35 + y, -0.48]}>
            <sphereGeometry args={[0.045, 8, 8]} />
            <meshStandardMaterial
              color="#fef08a"
              emissive="#f59e0b"
              emissiveIntensity={0.8}
            />
          </mesh>
        ))
      )}

      {/* Colorful Striped Awning Canopy */}
      <group position={[0, 2.45, -0.05]}>
        <mesh position={[0, 0.15, 0]} rotation={[0.2, 0, 0]} castShadow>
          <boxGeometry args={[2.1, 0.1, 1.2]} />
          <meshStandardMaterial color="#f59e0b" roughness={0.6} />
        </mesh>
        {/* Striped Fringe */}
        {[-0.8, -0.4, 0, 0.4, 0.8].map((x, i) => (
          <mesh key={i} position={[x, 0.02, 0.55]} castShadow>
            <boxGeometry args={[0.3, 0.18, 0.04]} />
            <meshStandardMaterial color={i % 2 === 0 ? '#ef4444' : '#ffffff'} />
          </mesh>
        ))}
      </group>

      {/* Rotating Floating Golden Shirt / Hanger Icon above */}
      <group ref={iconRef} position={[0, 2.7, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.35, 0.35, 0.12]} />
          <meshStandardMaterial
            color="#fbbf24"
            metalness={0.6}
            roughness={0.2}
            emissive="#f59e0b"
            emissiveIntensity={0.5}
          />
        </mesh>
      </group>

      {/* Floating 3D Proximity Prompt Billboard */}
      <Billboard position={[0, 3.25, 0]}>
        <Text
          fontSize={0.22}
          color="#92400e"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.03}
          outlineColor="#ffffff"
        >
          [E] WARDROBE & MIRROR
        </Text>
      </Billboard>
    </group>
  );
}

/* ─── Distant Coastal Lighthouse Landmark ─────────────────────────── */
function DistantLighthouse() {
  const beaconRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (beaconRef.current) {
      beaconRef.current.rotation.y = clock.getElapsedTime() * 0.9;
    }
  });

  return (
    <group position={[34, 3, 30]}>
      {/* Stone Foundation */}
      <RigidBody type="fixed" colliders="hull">
        <mesh position={[0, 1, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[3.2, 4.0, 2.5, 8]} />
          <meshStandardMaterial color="#475569" roughness={0.9} flatShading />
        </mesh>

        {/* Tapered White/Red Tower */}
        <mesh position={[0, 6.5, 0]} castShadow>
          <cylinderGeometry args={[1.6, 2.6, 9, 10]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.6} />
        </mesh>

        {/* Red Band 1 */}
        <mesh position={[0, 5, 0]}>
          <cylinderGeometry args={[2.08, 2.34, 2.2, 10]} />
          <meshStandardMaterial color="#dc2626" roughness={0.6} />
        </mesh>

        {/* Red Band 2 */}
        <mesh position={[0, 9.2, 0]}>
          <cylinderGeometry args={[1.62, 1.84, 1.8, 10]} />
          <meshStandardMaterial color="#dc2626" roughness={0.6} />
        </mesh>

        {/* Lantern Gallery Balcony */}
        <mesh position={[0, 11.2, 0]}>
          <cylinderGeometry args={[2.0, 2.0, 0.4, 10]} />
          <meshStandardMaterial color="#1e293b" roughness={0.5} />
        </mesh>

        {/* Lantern Room Glass */}
        <mesh position={[0, 12.1, 0]}>
          <cylinderGeometry args={[1.5, 1.5, 1.5, 10]} />
          <meshStandardMaterial color="#fef08a" emissive="#fbbf24" emissiveIntensity={1.2} />
        </mesh>

        {/* Domed Roof */}
        <mesh position={[0, 13.2, 0]}>
          <coneGeometry args={[1.6, 0.9, 10]} />
          <meshStandardMaterial color="#dc2626" roughness={0.5} />
        </mesh>
      </RigidBody>

      {/* Rotating Light Beam Group */}
      <group ref={beaconRef} position={[0, 12.1, 0]}>
        <mesh position={[0, 0, 7]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[2.2, 14, 8, 1, true]} />
          <meshBasicMaterial color="#fef08a" transparent opacity={0.18} side={THREE.DoubleSide} />
        </mesh>
      </group>
    </group>
  );
}

/* ─── Main Island Village Export ───────────────────────────────────── */
export default function IslandVillage() {
  return (
    <group>
      {/* Central Plaza Features */}
      <VillageFountain />
      <VillageSignpost />
      <WardrobeMirrorBooth />

      {/* Village NPCs (Oliver, Pip, Barnaby) */}
      <IslandNPCs />

      {/* Hidden Golden Stars Collectibles */}
      <IslandCollectibles />

      {/* ── 7 Physically Enterable Buildings (Walkable Life-Sim Village) ─ */}
      {/* 1. Sunshine Cottage (My Home) [-12, 0, -10] */}
      <EnterableCottage />

      {/* 2. Developer Studio [-16, 0, 4] */}
      <DeveloperStudio />

      {/* 3. Anime & Manga Lounge [0, 0, -18] */}
      <AnimeHouse />

      {/* 4. Academics Library [14, 0, -11] */}
      <AcademicsLibrary />

      {/* 5. Community Hall [17, 0, 4] */}
      <CommunityHall />

      {/* 6. Music Café [12, 0, 15] */}
      <MusicCafe />

      {/* 7. Gaming Arcade [-12, 0, 15] */}
      <GamingArcade />

      {/* Distant Landmark: Coastal Lighthouse */}
      <DistantLighthouse />
    </group>
  );
}
