/**
 * IslandVillage.tsx — Roblox Bloxburg / Brookhaven Inspired Starting Village
 *
 * Features:
 * - Central Village Plaza with stone fountain
 * - 4 Charming colorful houses with pitched roofs, porches, and chimneys
 * - Island General Store with awning
 * - Directional signposts to future districts
 * - Distant coastal lighthouse with lantern beacon
 */
import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';
import { Text, Billboard } from '@react-three/drei';
import { useIslandStore } from './useIslandStore';
import EnterableCottage from './EnterableCottage';
import EnterableStore from './EnterableStore';
import IslandNPCs from './IslandNPCs';
import IslandCollectibles from './IslandCollectibles';
import * as THREE from 'three';

/* ─── Modular Roblox-Style House Component ─────────────────────────── */
interface HouseProps {
  position: [number, number, number];
  rotation?: number;
  wallColor: string;
  roofColor: string;
  hasChimney?: boolean;
  nameTag?: string;
  width?: number;
  depth?: number;
  height?: number;
}

function StylizedHouse({
  position,
  rotation = 0,
  wallColor,
  roofColor,
  hasChimney = true,
  nameTag,
  width = 5.2,
  depth = 4.4,
  height = 3.2,
}: HouseProps) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* House Body (Collidable) */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[width, height, depth]} />
          <meshStandardMaterial color={wallColor} roughness={0.7} />
        </mesh>
      </RigidBody>

      {/* Pitched Roof (Collidable) */}
      <RigidBody type="fixed" colliders="hull">
        <mesh position={[0, height + 0.9, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
          <coneGeometry args={[Math.max(width, depth) * 0.76, 1.8, 4]} />
          <meshStandardMaterial color={roofColor} roughness={0.6} />
        </mesh>
      </RigidBody>

      {/* Front Door */}
      <mesh position={[0, 1.1, depth / 2 + 0.02]}>
        <boxGeometry args={[1.1, 2.1, 0.08]} />
        <meshStandardMaterial color="#78350f" roughness={0.8} /> {/* Dark wood door */}
      </mesh>
      {/* Brass Doorknob */}
      <mesh position={[0.4, 1.05, depth / 2 + 0.08]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Windows with white frame */}
      {[-width * 0.28, width * 0.28].map((x, i) => (
        <group key={i} position={[x, 1.8, depth / 2 + 0.02]}>
          {/* Frame */}
          <mesh>
            <boxGeometry args={[1.0, 1.0, 0.06]} />
            <meshStandardMaterial color="#ffffff" roughness={0.5} />
          </mesh>
          {/* Glass */}
          <mesh position={[0, 0, 0.02]}>
            <planeGeometry args={[0.82, 0.82]} />
            <meshStandardMaterial color="#7dd3fc" roughness={0.1} metalness={0.1} />
          </mesh>
        </group>
      ))}

      {/* Front Porch Floor */}
      <mesh position={[0, 0.08, depth / 2 + 0.9]} receiveShadow>
        <boxGeometry args={[width * 0.7, 0.16, 1.6]} />
        <meshStandardMaterial color="#b45309" roughness={0.8} />
      </mesh>
      {/* Porch Pillars */}
      {[-width * 0.3, width * 0.3].map((x, i) => (
        <mesh key={i} position={[x, 1.2, depth / 2 + 1.6]} castShadow>
          <boxGeometry args={[0.16, 2.3, 0.16]} />
          <meshStandardMaterial color="#ffffff" roughness={0.5} />
        </mesh>
      ))}

      {/* Chimney */}
      {hasChimney && (
        <group position={[width * 0.3, height + 1.2, -depth * 0.2]}>
          <mesh castShadow>
            <boxGeometry args={[0.65, 1.8, 0.65]} />
            <meshStandardMaterial color="#b91c1c" roughness={0.9} /> {/* Brick red */}
          </mesh>
          {/* Chimney top rim */}
          <mesh position={[0, 0.95, 0]}>
            <boxGeometry args={[0.78, 0.12, 0.78]} />
            <meshStandardMaterial color="#78716c" roughness={0.7} />
          </mesh>
        </group>
      )}

      {/* Optional Name Tag */}
      {nameTag && (
        <Billboard position={[0, height + 2.4, 0]}>
          <Text
            fontSize={0.35}
            color="#1e293b"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.03}
            outlineColor="#ffffff"
          >
            {nameTag}
          </Text>
        </Billboard>
      )}
    </group>
  );
}

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
      {/* Outer Stone Pool Basin (Collidable) */}
      <RigidBody type="fixed" colliders="hull">
        <mesh position={[0, 0.3, 0]} receiveShadow castShadow>
          <cylinderGeometry args={[2.8, 3.1, 0.6, 16]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.7} flatShading />
        </mesh>
      </RigidBody>

      {/* Inner Basin Hollow */}
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
        <meshStandardMaterial color="#7dd3fc" roughness={0.1} emissive="#38bdf8" emissiveIntensity={0.5} />
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
  const SIGN_POS = [3.2, 0, 3.2] as const;

  useFrame(() => {
    const [px, , pz] = playerPosition;
    const dist = Math.hypot(px - SIGN_POS[0], pz - SIGN_POS[2]);
    if (dist < 2.5) {
      if (!nearbyTarget || nearbyTarget.id !== 'signpost') {
        setNearbyTarget({
          id: 'signpost',
          title: 'ISLAND DIRECTORY & ABOUT',
          subtitle: 'Press [E] to read island guide & about Ayushman',
        });
      }
    } else if (nearbyTarget?.id === 'signpost') {
      setNearbyTarget(null);
    }
  });

  const inspectDirectory = () => {
    openInspect({
      title: 'SUNSHINE ISLAND // AYUSHMAN DIRECTORY',
      subtitle: 'Central Hub · About Ayushman & Island Navigation',
      badge: 'ABOUT AYUSHMAN',
      sections: [
        {
          heading: 'Who is Ayushman?',
          body: 'Ayushman Pathak is a software engineer and distributed systems builder from Jaipur, India.\nHe designs scalable web applications, real-time 3D environments, agentic AI workflows, and high-performance developer tools.',
        },
        {
          heading: 'Island World Navigation',
          body: '• Northwest: Sunshine Cottage (Developer workstation & bio)\n• West: Developer Village (Interactive project kiosks & GitHub builds)\n• East: University Town (Academics, algorithms & transcripts)\n• South: Arcade Bay (Gaming stats, Chess.com rank & Spotify lo-fi tunes)\n• Southwest: Social Harbour (Communication beacon & links)\n• North: Discovery Forest (Exploration & hidden golden stars)',
        },
      ],
      actions: [
        {
          label: 'VIEW CLASSIC PORTFOLIO / ABOUT',
          route: '/landing',
          emoji: '🌴',
          variant: 'primary',
        },
        {
          label: 'OPEN DEVELOPER PROJECTS',
          route: '/developer',
          emoji: '💻',
          variant: 'secondary',
        },
        {
          label: 'OPEN SOCIAL HUB',
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

      {/* Sign 1: North */}
      <group position={[0, 1.8, 0]} rotation={[0, 0, 0.05]}>
        <mesh castShadow>
          <boxGeometry args={[1.4, 0.28, 0.06]} />
          <meshStandardMaterial color="#fef08a" roughness={0.7} />
        </mesh>
        <Text fontSize={0.11} color="#78350f" position={[0, 0, 0.04]} anchorX="center" anchorY="middle">
          ▲ DISCOVERY FOREST
        </Text>
      </group>

      {/* Sign 2: East */}
      <group position={[0, 1.45, 0]} rotation={[0, Math.PI / 2, -0.05]}>
        <mesh castShadow>
          <boxGeometry args={[1.4, 0.28, 0.06]} />
          <meshStandardMaterial color="#fed7aa" roughness={0.7} />
        </mesh>
        <Text fontSize={0.11} color="#78350f" position={[0, 0, 0.04]} anchorX="center" anchorY="middle">
          ▶ UNIVERSITY TOWN
        </Text>
      </group>

      {/* Sign 3: West */}
      <group position={[0, 1.1, 0]} rotation={[0, -Math.PI / 2, 0.04]}>
        <mesh castShadow>
          <boxGeometry args={[1.4, 0.28, 0.06]} />
          <meshStandardMaterial color="#bbf7d0" roughness={0.7} />
        </mesh>
        <Text fontSize={0.11} color="#14532d" position={[0, 0, 0.04]} anchorX="center" anchorY="middle">
          ◀ DEVELOPER VILLAGE
        </Text>
      </group>

      {/* Sign 4: South */}
      <group position={[0, 0.75, 0]} rotation={[0, Math.PI, -0.04]}>
        <mesh castShadow>
          <boxGeometry args={[1.4, 0.28, 0.06]} />
          <meshStandardMaterial color="#bae6fd" roughness={0.7} />
        </mesh>
        <Text fontSize={0.11} color="#0369a1" position={[0, 0, 0.04]} anchorX="center" anchorY="middle">
          ▼ ARCADE BAY & PIER
        </Text>
      </group>
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

/* ─── Wardrobe & Dressing Mirror Booth ────────────────────────────── */
function WardrobeMirrorBooth() {
  const { playerPosition, setNearbyTarget, setCustomizerOpen, nearbyTarget } = useIslandStore();
  const iconRef = useRef<THREE.Group>(null);
  const boothX = -4.2;
  const boothZ = -3.8;

  useFrame(({ clock }) => {
    if (iconRef.current) {
      iconRef.current.rotation.y = clock.getElapsedTime() * 1.5;
      iconRef.current.position.y = 2.7 + Math.sin(clock.getElapsedTime() * 3) * 0.08;
    }

    const [px, , pz] = playerPosition;
    const dist = Math.hypot(px - boothX, pz - boothZ);

    if (dist < 3.2) {
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
        if (dist < 3.2) {
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
      rotation={[0, 0.35, 0]}
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

      {/* Enterable Building 1: Sunshine Cottage (North-West) */}
      <EnterableCottage />

      {/* House 2: Coastal Archive (North-East) */}
      <StylizedHouse
        position={[9, 0, -8]}
        rotation={-0.2}
        wallColor="#e0f2fe" // Sky blue
        roofColor="#0284c7" // Deep ocean blue
        nameTag="EAST LODGE"
      />

      {/* Enterable Building 3: Village Archive & Store (South-West) */}
      <EnterableStore />

      {/* House 4: Baker's Lodge (South-East) */}
      <StylizedHouse
        position={[10, 0, 6]}
        rotation={-0.4}
        wallColor="#dcfce7" // Soft mint green
        roofColor="#b45309" // Warm cedar brown
        nameTag="MEADOW LODGE"
      />

      {/* Distant Landmark: Coastal Lighthouse */}
      <DistantLighthouse />
    </group>
  );
}
