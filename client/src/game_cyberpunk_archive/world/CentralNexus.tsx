/**
 * CentralNexus.tsx — The first playable district: Central Nexus
 *
 * Low-poly cyberpunk city block with:
 * - Neon grid ground
 * - 6 district buildings (holographic terminals)
 * - Proximity interaction zones
 * - Flat-shaded geometry — no textures, pure material color
 *
 * Color palette:
 *   Cyan    #00f5ff  — primary neon
 *   Magenta #ff006e  — accent
 *   Amber   #ffb700  — warm highlight
 *   Base    #050810  — near-black void
 *   Slate   #1a2035  — building faces
 */
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';
import { Text, Billboard } from '@react-three/drei';
import { useGameStore } from '../store/useGameStore';
import * as THREE from 'three';
import NPC from '../npcs/NPC';
import { ghostDialog, cipherDialog, raviDialog, veraDialog } from '../npcs/npcDialogs';
import DataShards from './DataShards';

/* ─── District building definitions ──────────────────────────────────── */
const DISTRICTS = [
  {
    id: 'central_nexus',
    label: 'CENTRAL NEXUS',
    hint: 'Home · Your Digital Identity',
    pos: [0, 0, -18] as [number, number, number],
    color: '#00f5ff',
    emissive: '#00f5ff',
    width: 8, height: 14, depth: 6,
    route: '/',
  },
  {
    id: 'memory_lane',
    label: 'MEMORY LANE',
    hint: 'About · Origin Story',
    pos: [-22, 0, -8] as [number, number, number],
    color: '#ff006e',
    emissive: '#ff006e',
    width: 6, height: 10, depth: 5,
    route: '/social',
  },
  {
    id: 'academia',
    label: 'ACADEMIA',
    hint: 'Education · Degrees & Certs',
    pos: [22, 0, -8] as [number, number, number],
    color: '#ffb700',
    emissive: '#ffb700',
    width: 6, height: 12, depth: 5,
    route: '/academics',
  },
  {
    id: 'tech_core',
    label: 'TECH CORE',
    hint: 'Projects & Skills',
    pos: [-16, 0, 14] as [number, number, number],
    color: '#00f5ff',
    emissive: '#00f5ff',
    width: 7, height: 11, depth: 5,
    route: '/developer',
  },
  {
    id: 'arcade_99',
    label: 'ARCADE 99',
    hint: 'Music · Anime · Gaming',
    pos: [16, 0, 14] as [number, number, number],
    color: '#ff006e',
    emissive: '#ff006e',
    width: 7, height: 9, depth: 5,
    route: '/entertainment',
  },
  {
    id: 'skyport',
    label: 'SKYPORT',
    hint: 'Contact & Socials',
    pos: [0, 0, 20] as [number, number, number],
    color: '#ffb700',
    emissive: '#ffb700',
    width: 5, height: 8, depth: 5,
    route: '/social',
  },
];

/* ─── Interaction radius (world units) ─────────────────────────────── */
const INTERACT_RADIUS = 5;

/* ─── Single neon building ─────────────────────────────────────────── */
function NeonBuilding({
  id, label, hint, pos, color, emissive, width, height, depth
}: {
  id: string; label: string; hint: string;
  pos: [number, number, number];
  color: string; emissive: string;
  width: number; height: number; depth: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const t = useRef(Math.random() * Math.PI * 2); // phase offset

  useFrame((_, delta) => {
    t.current += delta;
    if (meshRef.current) {
      (meshRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
        0.4 + Math.sin(t.current * 1.5) * 0.15;
    }
  });

  const bPos: [number, number, number] = [pos[0], pos[1] + height / 2, pos[2]];

  return (
    <group position={pos}>
      {/* Main building body */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh ref={meshRef} position={[0, height / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[width, height, depth]} />
          <meshStandardMaterial
            color="#1a2035"
            emissive={emissive}
            emissiveIntensity={0.4}
            roughness={0.7}
            metalness={0.3}
            flatShading
          />
        </mesh>
      </RigidBody>

      {/* Neon roof trim */}
      <mesh position={[0, height + 0.05, 0]}>
        <boxGeometry args={[width + 0.2, 0.12, depth + 0.2]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={3} />
      </mesh>

      {/* Vertical neon strips on edges */}
      {[-width / 2, width / 2].map((x, i) => (
        <mesh key={i} position={[x, height / 2, 0]}>
          <boxGeometry args={[0.08, height, 0.08]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} />
        </mesh>
      ))}

      {/* Floating district label */}
      <Billboard position={[0, height + 2.5, 0]}>
        <Text
          fontSize={0.6}
          color={color}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.03}
          outlineColor="#000000"
        >
          {label}
        </Text>
        <Text
          fontSize={0.28}
          color="#aaaacc"
          anchorX="center"
          anchorY="middle"
          position={[0, -0.9, 0]}
          outlineWidth={0.02}
          outlineColor="#000000"
        >
          {hint}
        </Text>
      </Billboard>
    </group>
  );
}

/* ─── Interaction zone detector ───────────────────────────────────── */
function InteractionZones() {
  const { playerPosition, setNearbyTarget, nearbyTarget, openOverlay } = useGameStore();

  useFrame(() => {
    const px = playerPosition[0];
    const pz = playerPosition[2];

    let closest: typeof DISTRICTS[0] | null = null;
    let minDist = Infinity;

    for (const d of DISTRICTS) {
      const dx = px - d.pos[0];
      const dz = pz - d.pos[2];
      const dist = Math.sqrt(dx * dx + dz * dz);
      if (dist < INTERACT_RADIUS && dist < minDist) {
        minDist = dist;
        closest = d;
      }
    }

    if (closest) {
      if (!nearbyTarget || nearbyTarget.id !== closest.id) {
        setNearbyTarget({
          id: closest.id,
          label: closest.label,
          hint: closest.hint,
          district: closest.id as any,
        });
      }
    } else {
      if (nearbyTarget) setNearbyTarget(null);
    }
  });

  return null;
}

/* ─── Ground grid ─────────────────────────────────────────────────── */
function NeonGrid() {
  return (
    <>
      {/* Solid ground */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0, 0]}>
          <planeGeometry args={[200, 200]} />
          <meshStandardMaterial color="#050810" roughness={0.9} metalness={0.1} />
        </mesh>
      </RigidBody>

      {/* Neon grid lines using line segments */}
      <gridHelper
        args={[200, 40, '#00f5ff', '#0a1428']}
        position={[0, 0.01, 0]}
      />

      {/* Inner brighter grid */}
      <gridHelper
        args={[60, 12, '#ff006e', '#1a0a1a']}
        position={[0, 0.02, 0]}
      />
    </>
  );
}

/* ─── Ambient city particles (floating emissive dots) ──────────────── */
function CityParticles() {
  const particles = React.useMemo(() => {
    const count = 80;
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      pos: [
        (Math.random() - 0.5) * 80,
        Math.random() * 20 + 2,
        (Math.random() - 0.5) * 80,
      ] as [number, number, number],
      color: ['#00f5ff', '#ff006e', '#ffb700'][Math.floor(Math.random() * 3)],
      speed: 0.3 + Math.random() * 0.7,
      phase: Math.random() * Math.PI * 2,
    }));
  }, []);

  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = new THREE.Object3D();
  const t = useRef(0);

  useFrame((_, delta) => {
    t.current += delta;
    if (!meshRef.current) return;
    particles.forEach((p, i) => {
      dummy.position.set(
        p.pos[0],
        p.pos[1] + Math.sin(t.current * p.speed + p.phase) * 1.5,
        p.pos[2]
      );
      dummy.scale.setScalar(0.08 + Math.sin(t.current * p.speed * 2) * 0.03);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, particles.length]}>
      <dodecahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color="#00f5ff" emissive="#00f5ff" emissiveIntensity={2} />
    </instancedMesh>
  );
}

/* ─── Skyline background buildings ───────────────────────────────── */
function SkylineBuildings() {
  const buildings = React.useMemo(() => {
    const positions: Array<{
      pos: [number, number, number];
      w: number; h: number; d: number;
      color: string;
    }> = [];
    const colors = ['#00f5ff', '#ff006e', '#ffb700'];
    const ring = 55;
    for (let i = 0; i < 30; i++) {
      const angle = (i / 30) * Math.PI * 2;
      const r = ring + (Math.random() - 0.5) * 20;
      positions.push({
        pos: [Math.cos(angle) * r, 0, Math.sin(angle) * r],
        w: 3 + Math.random() * 5,
        h: 10 + Math.random() * 30,
        d: 3 + Math.random() * 5,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
    return positions;
  }, []);

  return (
    <>
      {buildings.map((b, i) => (
        <group key={i} position={b.pos}>
          <mesh position={[0, b.h / 2, 0]}>
            <boxGeometry args={[b.w, b.h, b.d]} />
            <meshStandardMaterial
              color="#0d1428"
              emissive={b.color}
              emissiveIntensity={0.15}
              roughness={0.8}
              flatShading
            />
          </mesh>
          {/* Roof neon */}
          <mesh position={[0, b.h + 0.05, 0]}>
            <boxGeometry args={[b.w, 0.1, b.d]} />
            <meshStandardMaterial color={b.color} emissive={b.color} emissiveIntensity={2} />
          </mesh>
        </group>
      ))}
    </>
  );
}

/* ─── Cyberpunk Street Lamps ───────────────────────────────────────── */
const LAMP_POSITIONS: [number, number, number][] = [
  [-6, 0, -4],
  [6, 0, -4],
  [-6, 0, 4],
  [6, 0, 4],
  [-12, 0, -2],
  [12, 0, -2],
  [-8, 0, 10],
  [8, 0, 10],
];

function StreetLamps() {
  return (
    <>
      {LAMP_POSITIONS.map((pos, i) => (
        <group key={i} position={pos}>
          {/* Post */}
          <mesh position={[0, 2, 0]}>
            <cylinderGeometry args={[0.07, 0.1, 4, 6]} />
            <meshStandardMaterial color="#111827" metalness={0.8} roughness={0.3} />
          </mesh>
          {/* Angled head */}
          <mesh position={[0, 4.05, 0.2]} rotation={[0.4, 0, 0]}>
            <boxGeometry args={[0.2, 0.1, 0.5]} />
            <meshStandardMaterial color="#1f293d" metalness={0.6} />
          </mesh>
          {/* Light bulb */}
          <mesh position={[0, 3.98, 0.3]}>
            <boxGeometry args={[0.16, 0.04, 0.35]} />
            <meshStandardMaterial color="#00f5ff" emissive="#00f5ff" emissiveIntensity={3} />
          </mesh>
        </group>
      ))}
    </>
  );
}

/* ─── Flying Patrol Drones ─────────────────────────────────────────── */
function PatrolDrones() {
  const drone1 = useRef<THREE.Group>(null);
  const drone2 = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * 0.4;
    if (drone1.current) {
      drone1.current.position.set(Math.sin(t) * 26, 6 + Math.sin(t * 2) * 0.8, Math.cos(t) * 26);
      drone1.current.rotation.y = t + Math.PI / 2;
    }
    if (drone2.current) {
      const t2 = t + Math.PI;
      drone2.current.position.set(Math.cos(t2) * 32, 8 + Math.cos(t2 * 2) * 1, Math.sin(t2) * 24);
      drone2.current.rotation.y = -t2;
    }
  });

  return (
    <>
      <group ref={drone1}>
        <mesh>
          <coneGeometry args={[0.6, 1.2, 3]} />
          <meshStandardMaterial color="#0b1329" metalness={0.9} roughness={0.2} flatShading />
        </mesh>
        <mesh position={[0, 0.6, 0]}>
          <sphereGeometry args={[0.15, 8, 8]} />
          <meshStandardMaterial color="#ff006e" emissive="#ff006e" emissiveIntensity={3} />
        </mesh>
      </group>

      <group ref={drone2}>
        <mesh>
          <coneGeometry args={[0.6, 1.2, 3]} />
          <meshStandardMaterial color="#0b1329" metalness={0.9} roughness={0.2} flatShading />
        </mesh>
        <mesh position={[0, 0.6, 0]}>
          <sphereGeometry args={[0.15, 8, 8]} />
          <meshStandardMaterial color="#00f5ff" emissive="#00f5ff" emissiveIntensity={3} />
        </mesh>
      </group>
    </>
  );
}

/* ─── Gateway Arch into Central Plaza ─────────────────────────────── */
function GatewayArch() {
  return (
    <group position={[0, 0, -2]}>
      {/* Left pillar */}
      <mesh position={[-4.5, 2.5, 0]}>
        <boxGeometry args={[0.4, 5, 0.4]} />
        <meshStandardMaterial color="#1a2035" emissive="#00f5ff" emissiveIntensity={0.5} />
      </mesh>
      {/* Right pillar */}
      <mesh position={[4.5, 2.5, 0]}>
        <boxGeometry args={[0.4, 5, 0.4]} />
        <meshStandardMaterial color="#1a2035" emissive="#00f5ff" emissiveIntensity={0.5} />
      </mesh>
      {/* Top lintel */}
      <mesh position={[0, 5, 0]}>
        <boxGeometry args={[9.4, 0.4, 0.5]} />
        <meshStandardMaterial color="#1a2035" emissive="#00f5ff" emissiveIntensity={0.8} />
      </mesh>
      {/* Neon beam under lintel */}
      <mesh position={[0, 4.75, 0]}>
        <boxGeometry args={[8.8, 0.08, 0.08]} />
        <meshStandardMaterial color="#00f5ff" emissive="#00f5ff" emissiveIntensity={3} />
      </mesh>
      {/* Sign */}
      <Billboard position={[0, 5.8, 0]}>
        <Text fontSize={0.35} color="#00f5ff" anchorX="center" anchorY="middle" outlineWidth={0.03} outlineColor="#000000">
          NEON DISTRICT // DIGITAL IDENTITY
        </Text>
      </Billboard>
    </group>
  );
}

/* ─── Main district export ─────────────────────────────────────── */
export default function CentralNexus() {
  return (
    <>
      <NeonGrid />
      <SkylineBuildings />
      <CityParticles />
      <StreetLamps />
      <PatrolDrones />
      <GatewayArch />
      {DISTRICTS.map((d) => (
        <NeonBuilding key={d.id} {...d} />
      ))}
      <InteractionZones />

      {/* Cyberpunk NPCs */}
      <NPC
        id="ghost"
        name="GHOST // NAVIGATOR"
        position={[0, 0, -8]}
        color="#00f5ff"
        dialog={ghostDialog}
        shape="octahedron"
      />
      <NPC
        id="cipher"
        name="CIPHER // TECH INTEL"
        position={[-10, 0, 8]}
        color="#ffb700"
        dialog={cipherDialog}
        shape="dodecahedron"
      />
      <NPC
        id="ravi"
        name="RAVI // ARCADE DJ"
        position={[10, 0, 8]}
        color="#ff006e"
        dialog={raviDialog}
        shape="icosahedron"
      />
      <NPC
        id="vera"
        name="VERA // COMMS OFFICER"
        position={[0, 0, 14]}
        color="#00f5ff"
        dialog={veraDialog}
        shape="tetrahedron"
      />

      {/* Cybernetic Memory Shards Collectibles */}
      <DataShards />
    </>
  );
}
