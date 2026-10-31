/**
 * IslandNPCs.tsx — Interactive Village NPCs with Bloxburg Stylized Avatars
 *
 * 1. Oliver — Sunshine Plaza Guide [2.2, 0, -2.2]
 * 2. Pip — Village Archivist & Merchant [-10, 0, 4.8]
 * 3. Barnaby — Beach Pier Fisherman [0, 0, 31.5]
 */
import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Billboard } from '@react-three/drei';
import { useIslandStore } from './useIslandStore';
import * as THREE from 'three';

interface NPCData {
  id: string;
  name: string;
  role: string;
  pos: [number, number, number];
  rotY: number;
  emoji: string;
  hatColor: string;
  shirtColor: string;
  pantsColor: string;
  dialogue: string[];
}

const NPCS: NPCData[] = [
  {
    id: 'oliver',
    name: 'Oliver',
    role: 'Island Plaza Guide',
    pos: [2.4, 0, -2.0],
    rotY: -2.3,
    emoji: '🌴',
    hatColor: '#fef08a', // Straw/yellow hat
    shirtColor: '#f97316', // Orange explorer polo
    pantsColor: '#78350f', // Khaki shorts
    dialogue: [
      'Welcome to Sunshine Island! 🌴 This whole world is the playable digital universe of Ayushman.',
      'Take a walk around the plaza! You can customize your look anytime at the Wardrobe Mirror or by pressing [C].',
      'To the northwest is Sunshine Cottage — step right inside to inspect Ayushman’s dev workstation and story!',
      'To the east lies University Town, and south is Arcade Bay and the fishing pier. Have fun exploring!',
    ],
  },
  {
    id: 'pip',
    name: 'Archivist Pip',
    role: 'Village Curator & Merchant',
    pos: [-10.5, 0, 4.8],
    rotY: 0.2,
    emoji: '📚',
    hatColor: '#0284c7', // Blue beret/cap
    shirtColor: '#0d9488', // Emerald knit sweater
    pantsColor: '#1e293b', // Dark trousers
    dialogue: [
      'Greetings, traveler! Welcome to the Island Archive & Village Emporium.',
      'Ayushman is a software engineer passionate about scalable full-stack architectures, real-time 3D, and AI agent systems.',
      'Feel free to explore the shelves and check the Visitor Terminal on my counter to view technical highlights!',
      'Did you know? Four rare golden stars are hidden across the island. Try to find them all!',
    ],
  },
  {
    id: 'barnaby',
    name: 'Captain Barnaby',
    role: 'Pier Fisherman & Sailor',
    pos: [0, 0, 31.5],
    rotY: Math.PI,
    emoji: '🎣',
    hatColor: '#dc2626', // Red beanie
    shirtColor: '#1e3a8a', // Navy sailor sweater
    pantsColor: '#334155', // Slate pants
    dialogue: [
      'Ahoy there! 🎣 The ocean breeze is crisp and the waves are rolling in smoothly today.',
      'I spend my days fishing off this southern pier, watching the horizon where Arcade Bay meets the open waters.',
      'If you look closely near the water and around the lighthouse, you might catch the glint of ancient sea stars!',
      'Press [M] anytime to open your world map and check the districts or fast travel across the coast!',
    ],
  },
];

function StylizedNPC({ npc }: { npc: NPCData }) {
  const armRef = useRef<THREE.Group>(null);
  const rodRef = useRef<THREE.Group>(null);
  const { playerPosition, setNearbyTarget, nearbyTarget, startDialogue, activeDialogue } =
    useIslandStore();

  const isInteracting = nearbyTarget?.id === npc.id;

  useFrame(({ clock }) => {
    // Gentle idle animation
    if (armRef.current && npc.id === 'oliver') {
      // Friendly waving arm
      armRef.current.rotation.z = Math.sin(clock.getElapsedTime() * 4) * 0.25 + 0.3;
      armRef.current.rotation.x = -1.2;
    }
    if (rodRef.current && npc.id === 'barnaby') {
      // Gentle rod bob
      rodRef.current.rotation.x = -0.6 + Math.sin(clock.getElapsedTime() * 2) * 0.05;
    }

    // Proximity detection
    const [px, , pz] = playerPosition;
    const dist = Math.hypot(px - npc.pos[0], pz - npc.pos[2]);

    if (dist < 3.0 && !activeDialogue) {
      if (!nearbyTarget || nearbyTarget.id !== npc.id) {
        setNearbyTarget({
          id: npc.id,
          title: `TALK TO ${npc.name.toUpperCase()}`,
          subtitle: `Press [E] to speak with the ${npc.role}`,
        });
      }
    } else if (nearbyTarget?.id === npc.id && dist >= 3.0) {
      setNearbyTarget(null);
    }
  });

  // Key listener for [E]
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'KeyE') {
        const [px, , pz] = playerPosition;
        const dist = Math.hypot(px - npc.pos[0], pz - npc.pos[2]);
        if (dist < 3.0 && !activeDialogue) {
          startDialogue(npc.name, npc.role, npc.dialogue, npc.emoji);
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [playerPosition, activeDialogue, npc, startDialogue]);

  return (
    <group
      position={npc.pos}
      rotation={[0, npc.rotY, 0]}
      onClick={() => {
        if (!activeDialogue) {
          startDialogue(npc.name, npc.role, npc.dialogue, npc.emoji);
        }
      }}
    >
      {/* ── Blocky Stylized Character Model ─────────────────────────── */}
      <group position={[0, 0, 0]}>
        {/* Head */}
        <group position={[0, 1.65, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.54, 0.54, 0.54]} />
            <meshStandardMaterial color="#fed7aa" roughness={0.5} />
          </mesh>

          {/* Hat / Hair */}
          <mesh position={[0, 0.22, 0]} castShadow>
            <boxGeometry args={[0.58, 0.18, 0.58]} />
            <meshStandardMaterial color={npc.hatColor} roughness={0.7} />
          </mesh>
          <mesh position={[0, 0.32, 0]} castShadow>
            <boxGeometry args={[0.42, 0.14, 0.42]} />
            <meshStandardMaterial color={npc.hatColor} roughness={0.7} />
          </mesh>

          {/* Eyes */}
          <mesh position={[-0.13, 0.04, 0.275]}>
            <planeGeometry args={[0.08, 0.1]} />
            <meshBasicMaterial color="#0f172a" />
          </mesh>
          <mesh position={[0.13, 0.04, 0.275]}>
            <planeGeometry args={[0.08, 0.1]} />
            <meshBasicMaterial color="#0f172a" />
          </mesh>

          {/* Smile */}
          <mesh position={[0, -0.1, 0.275]}>
            <planeGeometry args={[0.16, 0.05]} />
            <meshBasicMaterial color="#b45309" />
          </mesh>
        </group>

        {/* Torso */}
        <group position={[0, 0.75, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.64, 0.75, 0.35]} />
            <meshStandardMaterial color={npc.shirtColor} roughness={0.6} />
          </mesh>
          {/* Collar / Tie detail */}
          <mesh position={[0, 0.26, 0.18]}>
            <planeGeometry args={[0.2, 0.12]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </group>

        {/* Left Arm (Waving for Oliver) */}
        <group ref={armRef} position={[-0.46, 1.05, 0]}>
          <mesh position={[0, -0.32, 0]} castShadow>
            <boxGeometry args={[0.24, 0.68, 0.28]} />
            <meshStandardMaterial color={npc.shirtColor} roughness={0.6} />
          </mesh>
          <mesh position={[0, -0.66, 0]} castShadow>
            <boxGeometry args={[0.22, 0.16, 0.26]} />
            <meshStandardMaterial color="#fed7aa" roughness={0.5} />
          </mesh>
        </group>

        {/* Right Arm */}
        <group position={[0.46, 1.05, 0]}>
          <mesh position={[0, -0.32, 0]} castShadow>
            <boxGeometry args={[0.24, 0.68, 0.28]} />
            <meshStandardMaterial color={npc.shirtColor} roughness={0.6} />
          </mesh>
          <mesh position={[0, -0.66, 0]} castShadow>
            <boxGeometry args={[0.22, 0.16, 0.26]} />
            <meshStandardMaterial color="#fed7aa" roughness={0.5} />
          </mesh>
        </group>

        {/* Barnaby's Fishing Rod */}
        {npc.id === 'barnaby' && (
          <group ref={rodRef} position={[0.45, 0.5, 0.3]}>
            {/* Pole */}
            <mesh position={[0, 0.9, 0.6]} rotation={[0.4, 0, 0]} castShadow>
              <cylinderGeometry args={[0.02, 0.04, 2.4, 6]} />
              <meshStandardMaterial color="#d97706" roughness={0.8} />
            </mesh>
            {/* Reel */}
            <mesh position={[0, 0.1, 0.2]}>
              <cylinderGeometry args={[0.06, 0.06, 0.08, 8]} />
              <meshStandardMaterial color="#475569" metalness={0.8} />
            </mesh>
          </group>
        )}

        {/* Legs */}
        <group position={[-0.16, 0.38, 0]}>
          <mesh position={[0, -0.36, 0]} castShadow>
            <boxGeometry args={[0.28, 0.72, 0.32]} />
            <meshStandardMaterial color={npc.pantsColor} roughness={0.7} />
          </mesh>
          <mesh position={[0, -0.74, 0.03]} castShadow>
            <boxGeometry args={[0.28, 0.14, 0.38]} />
            <meshStandardMaterial color="#1e293b" roughness={0.4} />
          </mesh>
        </group>
        <group position={[0.16, 0.38, 0]}>
          <mesh position={[0, -0.36, 0]} castShadow>
            <boxGeometry args={[0.28, 0.72, 0.32]} />
            <meshStandardMaterial color={npc.pantsColor} roughness={0.7} />
          </mesh>
          <mesh position={[0, -0.74, 0.03]} castShadow>
            <boxGeometry args={[0.28, 0.14, 0.38]} />
            <meshStandardMaterial color="#1e293b" roughness={0.4} />
          </mesh>
        </group>
      </group>

      {/* ── 3D Overhead Nameplate Billboard ─────────────────────────── */}
      <Billboard position={[0, 2.45, 0]}>
        <Text
          fontSize={0.2}
          color="#0f172a"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.03}
          outlineColor="#ffffff"
        >
          {`${npc.emoji} ${npc.name}`}
        </Text>
        <Text
          position={[0, -0.18, 0]}
          fontSize={0.12}
          color="#64748b"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#ffffff"
        >
          {npc.role}
        </Text>
      </Billboard>
    </group>
  );
}

export default function IslandNPCs() {
  return (
    <group>
      {NPCS.map((npc) => (
        <StylizedNPC key={npc.id} npc={npc} />
      ))}
    </group>
  );
}
