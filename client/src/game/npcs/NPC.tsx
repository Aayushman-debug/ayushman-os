/**
 * NPC.tsx — In-world NPC character with proximity trigger and hover effect.
 *
 * Each NPC:
 * - Has a unique low-poly shape + color identity
 * - Floats gently (sine wave)
 * - Shows a talk prompt when player is near
 * - Triggers dialog tree on [E] press
 */
import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Billboard, Text } from '@react-three/drei';
import { useDialogStore, DialogTree } from '../store/useDialogStore';
import { useGameStore } from '../store/useGameStore';
import * as THREE from 'three';

interface NPCProps {
  id: string;
  name: string;
  position: [number, number, number];
  color: string;
  dialog: DialogTree;
  shape?: 'octahedron' | 'icosahedron' | 'dodecahedron' | 'tetrahedron';
}

const TALK_RADIUS = 4;

export default function NPC({
  id, name, position, color, dialog, shape = 'octahedron'
}: NPCProps) {
  const groupRef = useRef<THREE.Group>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const t = useRef(Math.random() * Math.PI * 2);
  const [nearPlayer, setNearPlayer] = React.useState(false);
  const [hovered, setHovered] = React.useState(false);

  const { playerPosition } = useGameStore();
  const { openDialog, active: dialogActive } = useDialogStore();

  // Proximity check each frame
  useFrame((_, delta) => {
    t.current += delta;

    // Float
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + 1.6 + Math.sin(t.current * 1.2) * 0.25;
    }
    // Spin inner gem
    if (innerRef.current) {
      innerRef.current.rotation.y += delta * 1.5;
      innerRef.current.rotation.x += delta * 0.4;
      (innerRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
        hovered || nearPlayer ? 1.2 : 0.6 + Math.sin(t.current * 2) * 0.2;
    }

    // Proximity
    const dx = playerPosition[0] - position[0];
    const dz = playerPosition[2] - position[2];
    const dist = Math.sqrt(dx * dx + dz * dz);
    setNearPlayer(dist < TALK_RADIUS);
  });

  // E key handler
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'KeyE' && nearPlayer && !dialogActive) {
        openDialog(dialog);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [nearPlayer, dialogActive, dialog, openDialog]);

  return (
    <group
      ref={groupRef}
      position={[position[0], position[1] + 1.6, position[2]]}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      {/* Outer glow ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.65, 0.04, 8, 24]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={nearPlayer ? 3 : 1.5}
          transparent
          opacity={nearPlayer ? 1 : 0.6}
        />
      </mesh>

      {/* Core gem */}
      <mesh ref={innerRef}>
        {shape === 'octahedron' && <octahedronGeometry args={[0.5, 0]} />}
        {shape === 'icosahedron' && <icosahedronGeometry args={[0.5, 0]} />}
        {shape === 'dodecahedron' && <dodecahedronGeometry args={[0.45, 0]} />}
        {shape === 'tetrahedron' && <tetrahedronGeometry args={[0.55, 0]} />}
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.7}
          roughness={0.15}
          metalness={0.8}
          flatShading
        />
      </mesh>

      {/* Name tag */}
      <Billboard position={[0, 1.1, 0]}>
        <Text
          fontSize={0.28}
          color={color}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.03}
          outlineColor="#000000"
        >
          {name}
        </Text>

        {/* Talk prompt */}
        {nearPlayer && !dialogActive && (
          <Text
            fontSize={0.22}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            position={[0, -0.38, 0]}
            outlineWidth={0.02}
            outlineColor="#000000"
          >
            [E] Talk
          </Text>
        )}
      </Billboard>
    </group>
  );
}
