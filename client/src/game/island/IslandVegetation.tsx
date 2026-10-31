/**
 * IslandVegetation.tsx — Living World Stylized Foliage, Environmental Lighting & Benches
 *
 * Placed intentionally according to the 180m Konoha-inspired geography:
 * - Street lanterns lining the Grand Entrance Highway and Residential Pathway
 * - Pine & oak tree groves framing the outer perimeter palisades and residential grove
 * - Zero trees blocking avenues or walk-in building doorways
 * - Benches facing scenic vistas (Plaza fountain, Mountain brook, Home garden, Ocean pier)
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
          <meshStandardMaterial color="#854d0e" roughness={0.9} flatShading />
        </mesh>
      </RigidBody>

      {/* Palm Crown */}
      <group position={[0.35, 3.2, 0]}>
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <group key={i} rotation={[0.4, (i * Math.PI) / 3.5, 0]}>
            <mesh position={[0, 0.4, 1.1]} rotation={[0.3, 0, 0]} castShadow>
              <boxGeometry args={[0.45, 0.05, 1.8]} />
              <meshStandardMaterial color="#15803d" roughness={0.7} flatShading />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}

/* ─── Southern Ocean Wooden Pier ───────────────────────────────────── */
function WoodenBeachPier() {
  return (
    <group position={[0, 0, 27]}>
      <RigidBody type="fixed" colliders="cuboid">
        {/* Main Boardwalk Planks */}
        <mesh position={[0, -0.05, 0]} receiveShadow castShadow>
          <boxGeometry args={[3.2, 0.35, 14]} />
          <meshStandardMaterial color="#78350f" roughness={0.8} />
        </mesh>
        {/* Pier End Deck Platform */}
        <mesh position={[0, -0.05, 7.5]} receiveShadow castShadow>
          <boxGeometry args={[6.4, 0.35, 3.2]} />
          <meshStandardMaterial color="#78350f" roughness={0.8} />
        </mesh>
      </RigidBody>

      {/* Wooden Pilings underneath pier in the ocean */}
      {[-1.3, 1.3].map((x, xi) =>
        [-5, -1, 3, 7].map((z, zi) => (
          <mesh key={`${xi}-${zi}`} position={[x, -0.6, z]} castShadow>
            <cylinderGeometry args={[0.16, 0.18, 1.2, 8]} />
            <meshStandardMaterial color="#451a03" roughness={0.9} />
          </mesh>
        ))
      )}

      {/* Pier Handrail Posts & Ropes */}
      {[-1.45, 1.45].map((x, i) => (
        <group key={i}>
          {[-5, -2, 1, 4].map((z, j) => (
            <mesh key={j} position={[x, 0.5, z]} castShadow>
              <cylinderGeometry args={[0.07, 0.08, 0.9, 6]} />
              <meshStandardMaterial color="#451a03" roughness={0.8} />
            </mesh>
          ))}
          <mesh position={[x, 0.9, 0]} castShadow>
            <boxGeometry args={[0.08, 0.08, 11]} />
            <meshStandardMaterial color="#92400e" roughness={0.7} />
          </mesh>
        </group>
      ))}

      {/* Pier End Mooring Cleats */}
      {[-2.8, 2.8].map((x, i) => (
        <mesh key={i} position={[x, 0.25, 7.5]} castShadow>
          <boxGeometry args={[0.3, 0.15, 0.15]} />
          <meshStandardMaterial color="#334155" metalness={0.8} />
        </mesh>
      ))}

      {/* Pier End Lantern Posts */}
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
  const benches: [number, number, number, number][] = [
    [-4.8, 0, 3.8, Math.PI / 4], // Facing Plaza fountain
    [4.8, 0, 3.8, -Math.PI / 4], // Facing Plaza fountain
    [-16, 0, -14, 0.4], // Facing tranquil mountain brook
    [-38, 1.0, -24, -0.4], // Home Base front garden bench
    [0, 0, 31, 0], // Tip of Southern Pier facing ocean
  ];

  const lanterns: [number, number, number][] = [
    // Plaza Perimeter
    [-5.8, 0, -3.5],
    [5.8, 0, -3.5],
    [-5.8, 0, 3.5],
    [5.8, 0, 3.5],

    // Grand Entrance Highway
    [-48, 0, 36],
    [-38, 0, 28],
    [-28, 0, 20],
    [-18, 0, 12],

    // Residential Pathway to Home Base
    [-26, 0, -8],
    [-32, 0, -16],
    [-36, 0.5, -22],

    // Avenue Gateways
    [-2.2, 0, -7],
    [2.2, 0, -7],
    [-2.2, 0, 7],
    [2.2, 0, 7],

    // Building Porch Lanterns
    [-2.2, 0, -15], // Anime House
    [2.2, 0, -15],
    [12, 0, -8.5], // Academics Library
    [-13.5, 0, 2.2], // Dev Studio
    [-13.5, 0, 5.8],
    [14.5, 0, 2.2], // Community Hall
    [14.5, 0, 5.8],
    [10, 0, 12], // Music Café
    [-10, 0, 12], // Gaming Arcade
  ];

  return (
    <group>
      {/* Benches */}
      {benches.map(([x, y, z, rot], i) => (
        <group key={i} position={[x, y, z]} rotation={[0, rot, 0]}>
          <mesh position={[0, 0.45, 0]} castShadow>
            <boxGeometry args={[1.5, 0.08, 0.55]} />
            <meshStandardMaterial color="#92400e" roughness={0.8} />
          </mesh>
          <mesh position={[0, 0.85, -0.24]} rotation={[0.15, 0, 0]} castShadow>
            <boxGeometry args={[1.5, 0.55, 0.06]} />
            <meshStandardMaterial color="#92400e" roughness={0.8} />
          </mesh>
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
          <mesh position={[0, 1.4, 0]} castShadow>
            <cylinderGeometry args={[0.06, 0.08, 2.8, 6]} />
            <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.3} />
          </mesh>
          <mesh position={[0, 2.9, 0]} castShadow>
            <boxGeometry args={[0.38, 0.48, 0.38]} />
            <meshStandardMaterial color="#1e293b" metalness={0.8} />
          </mesh>
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
          <mesh receiveShadow>
            <boxGeometry args={[2.4, 0.12, 0.8]} />
            <meshStandardMaterial color="#78350f" roughness={0.9} />
          </mesh>
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
  const treePositions: [number, number, number, number][] = [
    // 1. Mountain Ridge Forest (North below Summit Bluff)
    [0, 0, -32, 1.25],
    [-8, 0, -32, 1.15],
    [8, 0, -32, 1.2],
    [-14, 0, -36, 1.1],
    [14, 0, -36, 1.1],
    [-6, 2, -45, 1.2],
    [6, 2, -45, 1.15],

    // 2. Residential Sanctuary Grove (Framing Home Base at [-42, 1, -30])
    [-48, 1, -38, 1.2],
    [-52, 1, -26, 1.15],
    [-34, 1, -38, 1.1],
    [-30, 0, -22, 1.25], // Ancient Willow beside mountain brook
    [-24, 0, -24, 1.05],

    // 3. Grand Gate Pine Flanking (South-West [-55, 0, 42])
    [-62, 0, 36, 1.3],
    [-48, 0, 48, 1.25],
    [-58, 0, 52, 1.2],

    // 4. Northeast Campus Grove (Behind Academics Library)
    [24, 0, -18, 1.15],
    [22, 0, -26, 1.2],
    [32, 0, -22, 1.1],

    // 5. West Perimeter (Behind Developer Studio)
    [-24, 0, 4, 1.1],
    [-22, 0, -3, 1.0],

    // 6. East Perimeter (Behind Community Hall)
    [25, 0, 4, 1.1],
    [23, 0, -3, 1.05],
  ];

  const palmPositions: [number, number, number, number][] = [
    [-34, -0.4, 14, 1.1],
    [-28, -0.4, 25, 1.05],
    [-15, -0.4, 33, 1.2],
    [14, -0.4, 33, 1.15],
    [27, -0.4, 25, 1.05],
    [36, -0.4, 12, 1.1],
    [-50, -0.4, 10, 1.1],
    [48, -0.4, -6, 1.1],
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
