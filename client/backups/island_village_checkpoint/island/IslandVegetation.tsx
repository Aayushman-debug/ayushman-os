/**
 * IslandVegetation.tsx — Stylized Roblox-Inspired Foliage, Lighting & Environmental Props
 *
 * Rules Followed:
 * - Intentional Tree Groves (Discovery Forest, Cottage Orchard, Campus Grove, Coastal Palms)
 * - Zero trees placed on roads or blocking entrances
 * - Street lanterns line all 5 major district avenues symmetrically
 * - Benches face scenic viewpoints (Plaza fountain, Pond, Ocean horizon)
 * - Colorful Roblox flowerbeds enhance the village ambiance
 */
import React from 'react';
import { RigidBody } from '@react-three/rapier';

/* ─── Roblox Deciduous Tree ────────────────────────────────────────── */
interface TreeProps {
  position: [number, number, number];
  scale?: number;
  rotationY?: number;
}

export function RobloxTree({ position, scale = 1, rotationY = 0 }: TreeProps) {
  return (
    <group position={position} scale={scale} rotation={[0, rotationY, 0]}>
      {/* Trunk (Collidable) */}
      <RigidBody type="fixed" colliders="hull">
        <mesh position={[0, 1.4, 0]} castShadow>
          <cylinderGeometry args={[0.26, 0.42, 2.8, 6]} />
          <meshStandardMaterial color="#78350f" roughness={0.9} flatShading />
        </mesh>
      </RigidBody>

      {/* Foliage Tier 1 (Lowest) */}
      <mesh position={[0, 3.1, 0]} castShadow>
        <dodecahedronGeometry args={[1.5, 0]} />
        <meshStandardMaterial color="#16a34a" roughness={0.8} flatShading />
      </mesh>

      {/* Foliage Tier 2 (Middle) */}
      <mesh position={[0, 4.3, 0]} castShadow>
        <dodecahedronGeometry args={[1.15, 0]} />
        <meshStandardMaterial color="#22c55e" roughness={0.8} flatShading />
      </mesh>

      {/* Foliage Tier 3 (Top) */}
      <mesh position={[0, 5.2, 0]} castShadow>
        <dodecahedronGeometry args={[0.75, 0]} />
        <meshStandardMaterial color="#4ade80" roughness={0.8} flatShading />
      </mesh>
    </group>
  );
}

/* ─── Tropical Palm Tree ───────────────────────────────────────────── */
export function PalmTree({ position, scale = 1, rotationY = 0 }: TreeProps) {
  return (
    <group position={position} scale={scale} rotation={[0, rotationY, 0]}>
      {/* Curved Segmented Trunk (Collidable) */}
      <RigidBody type="fixed" colliders="hull">
        <mesh position={[0.2, 1.6, 0]} rotation={[0, 0, -0.1]} castShadow>
          <cylinderGeometry args={[0.2, 0.38, 3.2, 6]} />
          <meshStandardMaterial color="#a16207" roughness={0.9} flatShading />
        </mesh>
        <mesh position={[0.6, 4.4, 0]} rotation={[0, 0, -0.2]} castShadow>
          <cylinderGeometry args={[0.16, 0.22, 2.8, 6]} />
          <meshStandardMaterial color="#b45309" roughness={0.9} flatShading />
        </mesh>
      </RigidBody>

      {/* Coconuts */}
      {[0, Math.PI * 0.7, Math.PI * 1.4].map((ang, i) => (
        <mesh
          key={i}
          position={[0.9 + Math.cos(ang) * 0.25, 5.5, Math.sin(ang) * 0.25]}
          castShadow
        >
          <sphereGeometry args={[0.18, 6, 6]} />
          <meshStandardMaterial color="#451a03" roughness={0.9} />
        </mesh>
      ))}

      {/* Palm Leaves (Fronds) */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const ang = (i / 6) * Math.PI * 2;
        return (
          <group key={i} position={[0.9, 5.7, 0]} rotation={[0, ang, -0.45]}>
            <mesh position={[0, 0, 1.6]} rotation={[0.4, 0, 0]} castShadow>
              <boxGeometry args={[0.45, 0.04, 2.4]} />
              <meshStandardMaterial color="#15803d" roughness={0.7} flatShading />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

/* ─── Wooden Beach Pier ────────────────────────────────────────────── */
function WoodenBeachPier() {
  return (
    <group position={[0, 0, 27]}>
      {/* Main Boardwalk Deck */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[0, 0.2, 0]} receiveShadow>
          <boxGeometry args={[3.4, 0.24, 14]} />
          <meshStandardMaterial color="#b45309" roughness={0.8} />
        </mesh>
      </RigidBody>

      {/* Pier Pilings / Wooden Posts */}
      {[-1.5, 1.5].map((x, xi) =>
        [-5, -1, 3, 6].map((z, zi) => (
          <mesh key={`${xi}-${zi}`} position={[x, -0.5, z]} castShadow>
            <cylinderGeometry args={[0.14, 0.16, 1.8, 6]} />
            <meshStandardMaterial color="#78350f" roughness={0.9} />
          </mesh>
        ))
      )}

      {/* Mooring Post bollards at the tip */}
      {[-1.3, 1.3].map((x, i) => (
        <mesh key={i} position={[x, 0.55, 6.4]}>
          <cylinderGeometry args={[0.1, 0.12, 0.5, 6]} />
          <meshStandardMaterial color="#451a03" roughness={0.7} />
        </mesh>
      ))}
    </group>
  );
}

/* ─── Village Wooden Benches & Symmetrical Avenue Lanterns ─────────── */
function VillageDecor() {
  // Symmetrical, intentional bench locations facing scenic sights
  const benches: [number, number, number, number][] = [
    [-4.6, 0, 3.8, Math.PI / 4], // Facing Plaza fountain
    [4.6, 0, 3.8, -Math.PI / 4], // Facing Plaza fountain
    [-10, 0, 16.5, Math.PI * 0.75], // Facing scenic inland pond
    [0, 0, 31, 0], // Tip of Southern Pier facing endless ocean
  ];

  // Symmetrical street lanterns lining avenues and district gateways
  const lanterns: [number, number, number][] = [
    // Plaza Perimeter
    [-5.8, 0, 0],
    [5.8, 0, 0],
    [0, 0, -5.8],
    [0, 0, 6.2],

    // West Avenue (to Dev Village)
    [-15, 0, -2.2],
    [-15, 0, 2.2],

    // South Avenue (to Arcade Bay)
    [-2.2, 0, 16],
    [2.2, 0, 16],

    // East Avenue (to University Town)
    [11, 0, -4.5],
    [15, 0, -10.5],

    // Southwest Trail (to Social Harbour)
    [-9, 0, 9],
    [-15, 0, 15],
  ];

  return (
    <group>
      {/* Benches */}
      {benches.map(([x, y, z, rot], i) => (
        <group key={i} position={[x, y, z]} rotation={[0, rot, 0]}>
          {/* Seat */}
          <mesh position={[0, 0.45, 0]} castShadow>
            <boxGeometry args={[1.5, 0.08, 0.55]} />
            <meshStandardMaterial color="#92400e" roughness={0.8} />
          </mesh>
          {/* Backrest */}
          <mesh position={[0, 0.85, -0.24]} rotation={[0.15, 0, 0]} castShadow>
            <boxGeometry args={[1.5, 0.55, 0.06]} />
            <meshStandardMaterial color="#92400e" roughness={0.8} />
          </mesh>
          {/* Legs */}
          {[-0.65, 0.65].map((lx, li) => (
            <mesh key={li} position={[lx, 0.22, 0]}>
              <boxGeometry args={[0.08, 0.44, 0.48]} />
              <meshStandardMaterial color="#475569" metalness={0.7} roughness={0.3} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Street Lanterns */}
      {lanterns.map((pos, i) => (
        <group key={i} position={pos}>
          {/* Post */}
          <mesh position={[0, 1.4, 0]} castShadow>
            <cylinderGeometry args={[0.06, 0.08, 2.8, 6]} />
            <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.3} />
          </mesh>
          {/* Lantern Head */}
          <mesh position={[0, 2.9, 0]} castShadow>
            <boxGeometry args={[0.38, 0.48, 0.38]} />
            <meshStandardMaterial color="#1e293b" metalness={0.8} />
          </mesh>
          {/* Golden Warm Light Glow */}
          <mesh position={[0, 2.9, 0]}>
            <sphereGeometry args={[0.16, 8, 8]} />
            <meshStandardMaterial
              color="#fef08a"
              emissive="#fbbf24"
              emissiveIntensity={1.5}
            />
          </mesh>
        </group>
      ))}

      {/* Colorful Flowerbeds along Plaza rim */}
      {[-4.5, 4.5].map((x, xi) => (
        <group key={`flowerbed-${xi}`} position={[x, 0.06, -3.2]}>
          {/* Planter Soil Bed */}
          <mesh receiveShadow>
            <boxGeometry args={[2.4, 0.12, 0.8]} />
            <meshStandardMaterial color="#78350f" roughness={0.9} />
          </mesh>
          {/* Flowers */}
          {[-0.8, -0.4, 0, 0.4, 0.8].map((fx, fi) => (
            <mesh key={fi} position={[fx, 0.18, 0]} castShadow>
              <sphereGeometry args={[0.1, 6, 6]} />
              <meshStandardMaterial
                color={fi % 3 === 0 ? '#ef4444' : fi % 3 === 1 ? '#f59e0b' : '#ec4899'}
                roughness={0.6}
              />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

/* ─── Main Island Foliage Placement (Deliberate Natural Groves) ────── */
export default function IslandVegetation() {
  // Intentional Tree Groves
  const treePositions: [number, number, number, number][] = [
    // 1. Discovery Forest Cluster (North)
    [0, 0, -26, 1.25],
    [-7, 0, -25, 1.15],
    [7, 0, -25, 1.2],
    [-13, 0, -27, 1.05],
    [13, 0, -27, 1.1],
    [-4, 0, -32, 1.2],
    [5, 0, -33, 1.15],

    // 2. Sunshine Cottage Orchard (Northwest)
    [-16, 0, -11, 1.05],
    [-17, 0, -17, 1.1],
    [-23, 0, -13, 1.0],

    // 3. University Town Campus Grove (Northeast)
    [21, 0, -25, 1.15],
    [29, 0, -26, 1.2],
    [34, 0, -19, 1.05],

    // 4. Inland Pond Willows
    [-19, 0, 13, 1.1],
    [-8, 0, 19, 0.95],
  ];

  // Coastal Palms along beach perimeter
  const palmPositions: [number, number, number, number][] = [
    [-34, -0.4, 14, 1.1],
    [-28, -0.4, 25, 1.05],
    [-15, -0.4, 33, 1.2],
    [14, -0.4, 33, 1.15],
    [27, -0.4, 25, 1.05],
    [36, -0.4, 12, 1.1],
    [-38, -0.4, -6, 1.0],
    [38, -0.4, -6, 1.1],
  ];

  return (
    <group>
      {/* Deciduous Village Trees */}
      {treePositions.map(([x, y, z, sc], i) => (
        <RobloxTree key={`tree-${i}`} position={[x, y, z]} scale={sc} rotationY={i * 0.8} />
      ))}

      {/* Coastal Beach Palm Trees */}
      {palmPositions.map(([x, y, z, sc], i) => (
        <PalmTree key={`palm-${i}`} position={[x, y, z]} scale={sc} rotationY={i * 0.7} />
      ))}

      {/* Wooden Pier */}
      <WoodenBeachPier />

      {/* Village Benches, Lanterns & Flowerbeds */}
      <VillageDecor />
    </group>
  );
}