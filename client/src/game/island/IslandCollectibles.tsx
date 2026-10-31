/**
 * IslandCollectibles.tsx — Hidden Golden Stars & Badges Exploration System
 *
 * Scattered across Sunshine Island:
 * 1. star_plaza: Behind the village fountain [0, 1.4, -2.6]
 * 2. star_lighthouse: Coastal lighthouse balcony [34, 4.4, 29.5]
 * 3. star_pier: Edge of the southern wooden pier [0, 1.4, 34]
 * 4. star_pond: On the inland pond stepping stone [-20, 1.5, -16]
 */
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Billboard } from '@react-three/drei';
import { useIslandStore } from './useIslandStore';
import * as THREE from 'three';

interface StarLocation {
  id: string;
  name: string;
  pos: [number, number, number];
  hint: string;
}

const STAR_LOCATIONS: StarLocation[] = [
  {
    id: 'star_plaza',
    name: 'Plaza Fountain Secret',
    pos: [0, 1.35, -2.5],
    hint: 'Behind the Sunshine Plaza fountain',
  },
  {
    id: 'star_lighthouse',
    name: 'Beacon Keeper Star',
    pos: [34, 4.4, 29.5],
    hint: 'At the coastal lighthouse observation deck',
  },
  {
    id: 'star_pier',
    name: 'Seafarer Star',
    pos: [0, 1.35, 34],
    hint: 'At the end of the wooden beach pier',
  },
  {
    id: 'star_pond',
    name: 'Lilypad Pebble Star',
    pos: [-20, 1.4, -16],
    hint: 'Hovering over the quiet village pond',
  },
];

function CollectibleStar({ star }: { star: StarLocation }) {
  const meshRef = useRef<THREE.Group>(null);
  const { playerPosition, collectedStars, collectStar } = useIslandStore();
  const isCollected = collectedStars.includes(star.id);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.getElapsedTime() * 2.2;
      meshRef.current.position.y =
        star.pos[1] + Math.sin(clock.getElapsedTime() * 3 + star.pos[0]) * 0.12;
    }

    if (!isCollected) {
      const [px, , pz] = playerPosition;
      const dist = Math.hypot(px - star.pos[0], pz - star.pos[2]);
      if (dist < 1.7) {
        collectStar(star.id, star.name);
      }
    }
  });

  return (
    <group position={[star.pos[0], 0, star.pos[2]]}>
      <group ref={meshRef} position={[0, star.pos[1], 0]}>
        {/* Golden 3D Star Shape (Intersected octahedrons / boxes) */}
        <mesh castShadow>
          <octahedronGeometry args={[0.34, 0]} />
          <meshStandardMaterial
            color={isCollected ? '#94a3b8' : '#f59e0b'}
            emissive={isCollected ? '#475569' : '#fbbf24'}
            emissiveIntensity={isCollected ? 0.2 : 0.8}
            roughness={0.2}
            metalness={0.7}
            transparent={isCollected}
            opacity={isCollected ? 0.45 : 1}
          />
        </mesh>
        <mesh rotation={[0, Math.PI / 4, 0]} castShadow>
          <octahedronGeometry args={[0.34, 0]} />
          <meshStandardMaterial
            color={isCollected ? '#94a3b8' : '#f59e0b'}
            emissive={isCollected ? '#475569' : '#fbbf24'}
            emissiveIntensity={isCollected ? 0.2 : 0.8}
            roughness={0.2}
            metalness={0.7}
            transparent={isCollected}
            opacity={isCollected ? 0.45 : 1}
          />
        </mesh>

        {/* Inner Glowing Core */}
        <mesh>
          <sphereGeometry args={[0.16, 12, 12]} />
          <meshBasicMaterial
            color={isCollected ? '#cbd5e1' : '#ffffff'}
            transparent={isCollected}
            opacity={isCollected ? 0.4 : 1}
          />
        </mesh>
      </group>

      {/* Floating 3D Label */}
      <Billboard position={[0, star.pos[1] + 0.65, 0]}>
        <Text
          fontSize={0.16}
          color={isCollected ? '#94a3b8' : '#d97706'}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#ffffff"
        >
          {isCollected ? '✓ COLLECTED' : '★ SECRET STAR'}
        </Text>
      </Billboard>
    </group>
  );
}

export default function IslandCollectibles() {
  return (
    <group>
      {STAR_LOCATIONS.map((star) => (
        <CollectibleStar key={star.id} star={star} />
      ))}
    </group>
  );
}
