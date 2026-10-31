/**
 * DataShards.tsx — Collectible Cybernetic Memory Shards
 *
 * 5 hidden data fragments scattered across NEON DISTRICT.
 * When touched, unlocks hidden personal lore and developer quotes.
 */
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Billboard, Text } from '@react-three/drei';
import { useGameStore } from '../store/useGameStore';
import * as THREE from 'three';

export interface ShardData {
  id: string;
  title: string;
  pos: [number, number, number];
  color: string;
}

export const SHARDS: ShardData[] = [
  {
    id: 'shard_inception',
    title: 'INCEPTION // CRAFT',
    pos: [0, 0, -24],
    color: '#ffb700',
  },
  {
    id: 'shard_stack',
    title: 'TECH CORE // SHIP FAST',
    pos: [-20, 0, 18],
    color: '#00f5ff',
  },
  {
    id: 'shard_origin',
    title: 'ORIGIN // FIRST HELLO WORLD',
    pos: [-26, 0, -12],
    color: '#ff006e',
  },
  {
    id: 'shard_sound',
    title: 'ARCADE // SYNTH FUEL',
    pos: [20, 0, 18],
    color: '#ff006e',
  },
  {
    id: 'shard_signal',
    title: 'SKYPORT // THE HORIZON',
    pos: [4, 0, 24],
    color: '#ffb700',
  },
];

const COLLECT_RADIUS = 2.4;

function SingleShard({ shard }: { shard: ShardData }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const { playerPosition, collectedShards, collectShard } = useGameStore();
  const isCollected = collectedShards.includes(shard.id);

  useFrame(({ clock }) => {
    if (isCollected) return;

    const t = clock.getElapsedTime() * 1.5;
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 1.2;
      meshRef.current.rotation.x = Math.sin(t) * 0.5;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = -t * 0.8;
    }
    if (groupRef.current) {
      groupRef.current.position.y = shard.pos[1] + 1.2 + Math.sin(t * 1.8) * 0.2;
    }

    // Proximity check
    const dx = playerPosition[0] - shard.pos[0];
    const dz = playerPosition[2] - shard.pos[2];
    const dist = Math.sqrt(dx * dx + dz * dz);
    if (dist < COLLECT_RADIUS) {
      collectShard(shard.id, shard.title);
    }
  });

  if (isCollected) return null;

  return (
    <group ref={groupRef} position={[shard.pos[0], shard.pos[1] + 1.2, shard.pos[2]]}>
      {/* Outer energy ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[0.55, 0.03, 8, 20]} />
        <meshStandardMaterial
          color={shard.color}
          emissive={shard.color}
          emissiveIntensity={2.5}
        />
      </mesh>

      {/* Crystal core */}
      <mesh ref={meshRef}>
        <octahedronGeometry args={[0.35, 0]} />
        <meshStandardMaterial
          color={shard.color}
          emissive={shard.color}
          emissiveIntensity={1.2}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>

      {/* Label */}
      <Billboard position={[0, 0.9, 0]}>
        <Text
          fontSize={0.22}
          color={shard.color}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000000"
        >
          {shard.title}
        </Text>
      </Billboard>
    </group>
  );
}

export default function DataShards() {
  return (
    <>
      {SHARDS.map((shard) => (
        <SingleShard key={shard.id} shard={shard} />
      ))}
    </>
  );
}
