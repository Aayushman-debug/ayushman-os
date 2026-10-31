/**
 * IslandTerrain.tsx — Living World 180m Stylized Island Terrain & Geography
 *
 * Konoha-Inspired Architecture & Geography:
 * - Expansive 180m landmass with natural elevation tiers
 * - South-West Grand Village Entrance Gate [-55, 0, 42] with twin watchtowers & timber ramparts
 * - Perimeter defensive palisades & stone walls encircling the forest boundary
 * - North Summit Bluff Viewpoint [0, 14, -65] with panoramic vista over the valley
 * - Winding main highway from Grand Gate to Central Sunshine Plaza [0, 0, 0]
 * - Radiating scenic stone avenues to all distinct neighborhoods
 * - River stream flowing from north mountains into scenic pond and southern bay
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
      {/* ── Main Island Grassland (Expansive 180m Walking Plateau) ─── */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[0, -0.25, 0]} receiveShadow>
          <cylinderGeometry args={[86, 94, 1.4, 48]} />
          <meshStandardMaterial
            color="#4ade80" // Vibrant stylized grass green
            roughness={0.82}
            metalness={0.04}
            flatShading
          />
        </mesh>
      </RigidBody>

      {/* ── Residential Hillside Terrace (Elevated West Plateau) ───── */}
      <RigidBody type="fixed" colliders="hull">
        <mesh position={[-42, 0.7, -30]} receiveShadow>
          <cylinderGeometry args={[22, 26, 2.0, 24]} />
          <meshStandardMaterial color="#3cc973" roughness={0.85} flatShading />
        </mesh>
      </RigidBody>

      {/* ── Anime Enclave Hillside Terrace (North Terrace) ─────────── */}
      <RigidBody type="fixed" colliders="hull">
        <mesh position={[10, 0.6, -46]} receiveShadow>
          <cylinderGeometry args={[18, 22, 1.8, 24]} />
          <meshStandardMaterial color="#3cc973" roughness={0.85} flatShading />
        </mesh>
      </RigidBody>

      {/* ── Academics Grove Terrace (North-East Terrace) ───────────── */}
      <RigidBody type="fixed" colliders="hull">
        <mesh position={[38, 0.5, -26]} receiveShadow>
          <cylinderGeometry args={[19, 23, 1.6, 24]} />
          <meshStandardMaterial color="#3cc973" roughness={0.85} flatShading />
        </mesh>
      </RigidBody>

      {/* ── Beach Shoreline (Golden Sand Ring R=94 to 108m) ────────── */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[0, -0.55, 0]} receiveShadow>
          <cylinderGeometry args={[94, 108, 0.9, 48]} />
          <meshStandardMaterial
            color="#fef08a" // Warm golden beach sand
            roughness={0.92}
            flatShading
          />
        </mesh>
      </RigidBody>

      {/* ── Expansive Ocean Water Plane (600m x 600m) ─────────────── */}
      <mesh ref={oceanRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.6, 0]}>
        <planeGeometry args={[650, 650, 1, 1]} />
        <meshStandardMaterial
          color="#0284c7"
          emissive="#0369a1"
          emissiveIntensity={0.22}
          roughness={0.12}
          metalness={0.18}
          transparent
          opacity={0.88}
        />
      </mesh>

      {/* ── Shallow Water Shore Foam Ring ─────────────────────────── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.54, 0]}>
        <ringGeometry args={[92, 114, 48]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.4} />
      </mesh>

      {/* ── North Summit Bluff / Hokage Cliff Viewpoint [0, 14, -65] ─ */}
      <group position={[0, 0, -65]}>
        {/* Massive Rocky Mountain Base */}
        <RigidBody type="fixed" colliders="hull">
          <mesh position={[0, 6.5, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[18, 26, 14, 10]} />
            <meshStandardMaterial color="#64748b" roughness={0.9} flatShading />
          </mesh>
          {/* Upper Overlook Plateau */}
          <mesh position={[0, 13.8, 2]} castShadow receiveShadow>
            <cylinderGeometry args={[11, 14, 2.5, 12]} />
            <meshStandardMaterial color="#4ade80" roughness={0.8} flatShading />
          </mesh>
        </RigidBody>

        {/* Summit Overlook Wooden Railing */}
        <group position={[0, 15.2, 8]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[12, 0.9, 0.2]} />
            <meshStandardMaterial color="#78350f" roughness={0.8} />
          </mesh>
          {[-5, -2.5, 0, 2.5, 5].map((x, i) => (
            <mesh key={i} position={[x, -0.4, 0]} castShadow>
              <cylinderGeometry args={[0.08, 0.08, 0.9, 8]} />
              <meshStandardMaterial color="#451a03" roughness={0.8} />
            </mesh>
          ))}
        </group>

        {/* Scenic Summit Viewing Bench */}
        <group position={[0, 15.2, 5]} rotation={[0, Math.PI, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[2.2, 0.12, 0.6]} />
            <meshStandardMaterial color="#92400e" roughness={0.7} />
          </mesh>
          <mesh position={[0, 0.45, -0.28]} castShadow>
            <boxGeometry args={[2.2, 0.7, 0.08]} />
            <meshStandardMaterial color="#92400e" roughness={0.7} />
          </mesh>
          {[-0.9, 0.9].map((bx, i) => (
            <mesh key={i} position={[bx, -0.25, 0]} castShadow>
              <boxGeometry args={[0.1, 0.5, 0.5]} />
              <meshStandardMaterial color="#334155" roughness={0.6} />
            </mesh>
          ))}
        </group>

        {/* Summit Beacon Lantern */}
        <group position={[4.5, 15.2, 6]}>
          <mesh position={[0, 1.2, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.1, 2.4, 8]} />
            <meshStandardMaterial color="#334155" roughness={0.5} />
          </mesh>
          <mesh position={[0, 2.4, 0]}>
            <sphereGeometry args={[0.22, 10, 10]} />
            <meshStandardMaterial color="#fef08a" emissive="#fbbf24" emissiveIntensity={1.2} />
          </mesh>
          <pointLight position={[0, 2.4, 0]} color="#fde047" intensity={1.5} distance={12} />
        </group>
      </group>

      {/* ── Grand Village Entrance Gate [-55, 0, 42] ───────────────── */}
      <group position={[-55, 0, 42]} rotation={[0, 0.65, 0]}>
        {/* Left Watchtower */}
        <RigidBody type="fixed" colliders="hull">
          <group position={[-6.5, 0, 0]}>
            {/* Stone Base */}
            <mesh position={[0, 2.0, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[2.4, 2.8, 4.0, 8]} />
              <meshStandardMaterial color="#64748b" roughness={0.85} flatShading />
            </mesh>
            {/* Timber Body */}
            <mesh position={[0, 5.5, 0]} castShadow receiveShadow>
              <boxGeometry args={[3.6, 3.2, 3.6]} />
              <meshStandardMaterial color="#78350f" roughness={0.75} />
            </mesh>
            {/* Observation Deck Railing */}
            <mesh position={[0, 7.3, 0]} castShadow>
              <boxGeometry args={[4.2, 0.8, 4.2]} />
              <meshStandardMaterial color="#92400e" roughness={0.7} />
            </mesh>
            {/* Pagoda Eaves Roof */}
            <mesh position={[0, 8.8, 0]} castShadow>
              <coneGeometry args={[3.2, 2.0, 4]} />
              <meshStandardMaterial color="#1e293b" roughness={0.7} />
            </mesh>
            {/* Watchtower Lantern */}
            <pointLight position={[0, 6.8, 0]} color="#fde047" intensity={0.9} distance={10} />
          </group>
        </RigidBody>

        {/* Right Watchtower */}
        <RigidBody type="fixed" colliders="hull">
          <group position={[6.5, 0, 0]}>
            <mesh position={[0, 2.0, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[2.4, 2.8, 4.0, 8]} />
              <meshStandardMaterial color="#64748b" roughness={0.85} flatShading />
            </mesh>
            <mesh position={[0, 5.5, 0]} castShadow receiveShadow>
              <boxGeometry args={[3.6, 3.2, 3.6]} />
              <meshStandardMaterial color="#78350f" roughness={0.75} />
            </mesh>
            <mesh position={[0, 7.3, 0]} castShadow>
              <boxGeometry args={[4.2, 0.8, 4.2]} />
              <meshStandardMaterial color="#92400e" roughness={0.7} />
            </mesh>
            <mesh position={[0, 8.8, 0]} castShadow>
              <coneGeometry args={[3.2, 2.0, 4]} />
              <meshStandardMaterial color="#1e293b" roughness={0.7} />
            </mesh>
            <pointLight position={[0, 6.8, 0]} color="#fde047" intensity={0.9} distance={10} />
          </group>
        </RigidBody>

        {/* Monumental Gate Arch & Crossbeams */}
        <RigidBody type="fixed" colliders="cuboid">
          {/* Main Crossbeam */}
          <mesh position={[0, 6.2, 0]} castShadow>
            <boxGeometry args={[11, 0.9, 1.2]} />
            <meshStandardMaterial color="#78350f" roughness={0.8} />
          </mesh>
          {/* Upper Gate Roof Tile Eaves */}
          <mesh position={[0, 7.2, 0]} castShadow>
            <boxGeometry args={[12.6, 0.6, 2.0]} />
            <meshStandardMaterial color="#1e293b" roughness={0.7} />
          </mesh>
        </RigidBody>

        {/* Propped-Open Timber Double Gates */}
        <group position={[-3.6, 2.4, -0.6]} rotation={[0, -0.7, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[3.4, 4.8, 0.25]} />
            <meshStandardMaterial color="#451a03" roughness={0.85} />
          </mesh>
          {/* Iron Reinforcement Straps */}
          {[-1.6, 0, 1.6].map((sy, i) => (
            <mesh key={i} position={[0, sy, 0.14]}>
              <boxGeometry args={[3.3, 0.16, 0.05]} />
              <meshStandardMaterial color="#334155" roughness={0.5} />
            </mesh>
          ))}
        </group>
        <group position={[3.6, 2.4, -0.6]} rotation={[0, 0.7, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[3.4, 4.8, 0.25]} />
            <meshStandardMaterial color="#451a03" roughness={0.85} />
          </mesh>
          {[-1.6, 0, 1.6].map((sy, i) => (
            <mesh key={i} position={[0, sy, 0.14]}>
              <boxGeometry args={[3.3, 0.16, 0.05]} />
              <meshStandardMaterial color="#334155" roughness={0.5} />
            </mesh>
          ))}
        </group>

        {/* Welcoming Gate Lanterns */}
        {[-3.8, 3.8].map((lx, i) => (
          <group key={i} position={[lx, 4.8, 0.8]}>
            <mesh>
              <sphereGeometry args={[0.22, 10, 10]} />
              <meshStandardMaterial color="#fef08a" emissive="#f59e0b" emissiveIntensity={1.0} />
            </mesh>
            <pointLight color="#fde047" intensity={0.8} distance={8} />
          </group>
        ))}
      </group>

      {/* ── Perimeter Palisade Timber Walls ────────────────────────── */}
      {/* West Forest Wall Segments */}
      {[-72, -62, -50, -38, -26].map((pz, i) => (
        <RigidBody key={i} type="fixed" colliders="cuboid">
          <group position={[-68 + (i % 2) * 2, 2.2, pz]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[1.2, 4.4, 11]} />
              <meshStandardMaterial color="#573618" roughness={0.88} />
            </mesh>
            {/* Pointed Timber Log Tops */}
            {[-4, -2, 0, 2, 4].map((lx, j) => (
              <mesh key={j} position={[0, 2.6, lx]} castShadow>
                <coneGeometry args={[0.55, 0.8, 6]} />
                <meshStandardMaterial color="#451a03" roughness={0.9} />
              </mesh>
            ))}
          </group>
        </RigidBody>
      ))}

      {/* East Coastal Cliffs & Rock Bluffs */}
      <RigidBody type="fixed" colliders="hull">
        <mesh position={[68, 3.5, 12]} castShadow receiveShadow>
          <cylinderGeometry args={[14, 18, 7, 8]} />
          <meshStandardMaterial color="#64748b" roughness={0.9} flatShading />
        </mesh>
        <mesh position={[62, 5.0, -32]} castShadow receiveShadow>
          <coneGeometry args={[16, 10, 7]} />
          <meshStandardMaterial color="#16a34a" roughness={0.9} flatShading />
        </mesh>
      </RigidBody>

      {/* ── Central Village Cobblestone Roads & Squares ────────────── */}
      {/* Central Plaza Round Paving */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
        <circleGeometry args={[8.8, 36]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.85} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.025, 0]}>
        <ringGeometry args={[8.5, 9.2, 36]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.7} />
      </mesh>

      {/* ── Main Entrance Highway: Grand Gate [-55, 0, 42] -> Plaza [0, 0, 0] ── */}
      {/* Segment 1: From Gate into Village Foothills */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0.62]}
        position={[-42, 0.02, 32]}
        receiveShadow
      >
        <planeGeometry args={[4.2, 28]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.85} />
      </mesh>
      {/* Segment 2: Approaching Central Plaza */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0.35]}
        position={[-18, 0.02, 14]}
        receiveShadow
      >
        <planeGeometry args={[4.0, 32]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.85} />
      </mesh>

      {/* ── West Avenue -> Developer Studio [-36, 0, 8] ──────────── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-20, 0.02, 6]} receiveShadow>
        <planeGeometry args={[26, 3.6]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.85} />
      </mesh>

      {/* ── Quiet Residential Footpath -> Home Base [-42, 2, -30] ─── */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0.45]}
        position={[-36, 0.03, -12]}
        receiveShadow
      >
        <planeGeometry args={[2.8, 34]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.9} />
      </mesh>

      {/* ── North Avenue -> Anime Enclave & Summit Mountain Trail ─── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, -22]} receiveShadow>
        <planeGeometry args={[3.6, 32]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.85} />
      </mesh>
      {/* Mountain Trail ascending to Summit Bluff */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 6.8, -50]} receiveShadow>
        <planeGeometry args={[3.2, 24]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.9} />
      </mesh>

      {/* ── North-East Campus Walkway -> Academics Library [38, 2, -26] ── */}
      <mesh
        rotation={[-Math.PI / 2, 0, -0.58]}
        position={[22, 0.02, -14]}
        receiveShadow
      >
        <planeGeometry args={[3.4, 38]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.85} />
      </mesh>

      {/* ── East Civic Way -> Community Hall [18, 0, 0] ───────────── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[10, 0.02, 0]} receiveShadow>
        <planeGeometry args={[14, 3.6]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.85} />
      </mesh>

      {/* ── South-East Harbor Promenade -> Seaside Café & Pier [28, 0, 36] ── */}
      <mesh
        rotation={[-Math.PI / 2, 0, -0.65]}
        position={[15, 0.02, 20]}
        receiveShadow
      >
        <planeGeometry args={[3.8, 38]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.85} />
      </mesh>

      {/* ── South-West Neon Alley -> Gaming Arcade [-18, 0, 38] ───── */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0.52]}
        position={[-10, 0.02, 20]}
        receiveShadow
      >
        <planeGeometry args={[3.4, 34]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.85} />
      </mesh>

      {/* ── Scenic Stream & Mountain Brook ─────────────────────────── */}
      <group position={[-18, 0, -18]}>
        {/* Tranquil Brook Water */}
        <mesh rotation={[-Math.PI / 2, 0, 0.2]} position={[0, 0.03, 0]}>
          <planeGeometry args={[3.2, 24]} />
          <meshStandardMaterial color="#38bdf8" roughness={0.2} transparent opacity={0.85} />
        </mesh>
        {/* Pebble Stream Shore */}
        <mesh rotation={[-Math.PI / 2, 0, 0.2]} position={[0, 0.025, 0]}>
          <planeGeometry args={[4.2, 24]} />
          <meshStandardMaterial color="#fef08a" roughness={0.9} />
        </mesh>

        {/* Scenic Arched Wooden Footbridge across the stream */}
        <group position={[0, 0.25, 0]} rotation={[0, 0.2, 0]}>
          <RigidBody type="fixed" colliders="cuboid">
            <mesh receiveShadow castShadow>
              <boxGeometry args={[2.0, 0.18, 4.4]} />
              <meshStandardMaterial color="#92400e" roughness={0.8} />
            </mesh>
          </RigidBody>
          {[-0.95, 0.95].map((x, i) => (
            <mesh key={i} position={[x, 0.55, 0]} castShadow>
              <boxGeometry args={[0.08, 0.8, 4.4]} />
              <meshStandardMaterial color="#78350f" roughness={0.8} />
            </mesh>
          ))}
        </group>
      </group>
    </group>
  );
}
