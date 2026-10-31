/**
 * IslandTerrain.tsx — Roblox-Style Stylized Island Terrain & Intentional District Pathways
 *
 * Layout:
 * - Lush green main island plateau (R=48m) with gentle sandy beach ring (R=64m)
 * - Central Sunshine Plaza circular paving with stone border
 * - 5 Deliberate Cobblestone Avenues connecting:
 *   1. West Avenue -> Developer Village [-24, 0, 0]
 *   2. East Avenue -> University Town Quad [24, 0, -15]
 *   3. South Avenue -> Arcade Bay & Pier [0, 0, 24]
 *   4. Southwest Coastal Walk -> Social Harbour [-22, 0, 20]
 *   5. North Forest Trail -> Discovery Forest [0, 0, -26]
 * - Inland Pond with pebble bank, lily pads and wooden footbridge
 */
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';
import * as THREE from 'three';

export default function IslandTerrain() {
  const oceanRef = useRef<THREE.Mesh>(null);

  // Gentle wave ripple
  useFrame(({ clock }) => {
    if (oceanRef.current) {
      oceanRef.current.position.y = -0.6 + Math.sin(clock.getElapsedTime() * 0.8) * 0.08;
    }
  });

  return (
    <group>
      {/* ── Main Island Grassland (Flat central walkable terrain) ──── */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[0, -0.2, 0]} receiveShadow>
          <cylinderGeometry args={[48, 54, 1.2, 32]} />
          <meshStandardMaterial
            color="#4ade80" // Vibrant stylized Roblox grass green
            roughness={0.8}
            metalness={0.05}
            flatShading
          />
        </mesh>
      </RigidBody>

      {/* ── Beach Shoreline (Golden Sand Perimeter Ring) ──────────── */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[0, -0.5, 0]} receiveShadow>
          <cylinderGeometry args={[58, 64, 0.8, 32]} />
          <meshStandardMaterial
            color="#fef08a" // Warm golden beach sand
            roughness={0.9}
            flatShading
          />
        </mesh>
      </RigidBody>

      {/* ── Ocean Water (Expansive Turquoise Water Plane) ─────────── */}
      <mesh ref={oceanRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.6, 0]}>
        <planeGeometry args={[400, 400, 1, 1]} />
        <meshStandardMaterial
          color="#0284c7"
          emissive="#0369a1"
          emissiveIntensity={0.25}
          roughness={0.1}
          metalness={0.2}
          transparent
          opacity={0.88}
        />
      </mesh>

      {/* ── Shallow Water Shore Foam Ring ─────────────────────────── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.55, 0]}>
        <ringGeometry args={[56, 68, 32]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.45} />
      </mesh>

      {/* ── Rolling Hills & Coastal Cliffs (Carefully Sited) ───────── */}
      {/* North-East Distant Mountain Backdrop */}
      <RigidBody type="fixed" colliders="hull">
        <mesh position={[38, 4, -36]} castShadow receiveShadow>
          <coneGeometry args={[14, 10, 7]} />
          <meshStandardMaterial color="#22c55e" roughness={0.9} flatShading />
        </mesh>
        <mesh position={[38, 8.5, -36]} castShadow receiveShadow>
          <coneGeometry args={[6, 4, 6]} />
          <meshStandardMaterial color="#86efac" roughness={0.8} flatShading />
        </mesh>
      </RigidBody>

      {/* North-West Hill with Lookout */}
      <RigidBody type="fixed" colliders="hull">
        <mesh position={[-32, 2.8, -26]} castShadow receiveShadow>
          <coneGeometry args={[11, 6.5, 6]} />
          <meshStandardMaterial color="#16a34a" roughness={0.9} flatShading />
        </mesh>
      </RigidBody>

      {/* South-East Coastal Cliff */}
      <RigidBody type="fixed" colliders="hull">
        <mesh position={[36, 1.8, 24]} castShadow receiveShadow>
          <cylinderGeometry args={[8, 11, 4, 6]} />
          <meshStandardMaterial color="#64748b" roughness={0.85} flatShading />
        </mesh>
      </RigidBody>

      {/* ── Central Village Cobblestone Paths & Plaza ──────────────── */}
      {/* Central Plaza Round Paving */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
        <circleGeometry args={[7.8, 32]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.85} />
      </mesh>
      {/* Plaza Outer Stone Ring / Curb */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.025, 0]}>
        <ringGeometry args={[7.5, 8.2, 32]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.7} />
      </mesh>

      {/* 1. South Avenue -> Arcade Bay & Southern Pier [0, 0, 24] */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 14]} receiveShadow>
        <planeGeometry args={[3.4, 15]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.85} />
      </mesh>

      {/* 2. West Avenue -> Developer Village [-24, 0, 0] */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-15, 0.02, 0]} receiveShadow>
        <planeGeometry args={[17, 3.2]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.85} />
      </mesh>

      {/* 3. East Avenue -> University Town Quad [24, 0, -15] */}
      <mesh rotation={[-Math.PI / 2, 0, -0.55]} position={[13, 0.02, -7.5]} receiveShadow>
        <planeGeometry args={[3.2, 18]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.85} />
      </mesh>

      {/* 4. North Trail -> Discovery Forest [0, 0, -26] */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, -15]} receiveShadow>
        <planeGeometry args={[3.0, 16]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.85} />
      </mesh>

      {/* 5. Southwest Coastal Trail -> Social Harbour [-22, 0, 20] */}
      <mesh rotation={[-Math.PI / 2, 0, 0.78]} position={[-12, 0.02, 11]} receiveShadow>
        <planeGeometry args={[3.0, 16]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.85} />
      </mesh>

      {/* ── Inland Village Pond & Scenic Footbridge ────────────────── */}
      <group position={[-13, 0, 13]}>
        {/* Pond Water */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
          <circleGeometry args={[4.8, 20]} />
          <meshStandardMaterial color="#38bdf8" roughness={0.2} transparent opacity={0.85} />
        </mesh>
        {/* Pond Pebble/Sand Shore Ring */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.025, 0]}>
          <ringGeometry args={[4.6, 5.4, 20]} />
          <meshStandardMaterial color="#fef08a" roughness={0.9} />
        </mesh>

        {/* Scenic Wooden Footbridge across pond edge */}
        <group position={[3.2, 0.15, -1.8]} rotation={[0, 0.6, 0]}>
          <mesh receiveShadow castShadow>
            <boxGeometry args={[1.6, 0.14, 3.8]} />
            <meshStandardMaterial color="#92400e" roughness={0.8} />
          </mesh>
          {/* Bridge handrails */}
          {[-0.75, 0.75].map((x, i) => (
            <mesh key={i} position={[x, 0.5, 0]} castShadow>
              <boxGeometry args={[0.08, 0.75, 3.8]} />
              <meshStandardMaterial color="#78350f" roughness={0.8} />
            </mesh>
          ))}
        </group>

        {/* Lilypads */}
        <mesh position={[1, 0.04, 1]} rotation={[-Math.PI / 2, 0, 0.4]}>
          <circleGeometry args={[0.55, 8]} />
          <meshBasicMaterial color="#15803d" />
        </mesh>
        <mesh position={[-1.4, 0.04, -0.6]} rotation={[-Math.PI / 2, 0, 1.2]}>
          <circleGeometry args={[0.45, 8]} />
          <meshBasicMaterial color="#15803d" />
        </mesh>
      </group>
    </group>
  );
}