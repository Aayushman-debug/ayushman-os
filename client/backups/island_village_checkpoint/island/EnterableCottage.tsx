/**
 * EnterableCottage.tsx — Bloxburg-Style Physically Enterable Sunshine Cottage
 *
 * Position: [-9, 0, -8]
 * Features:
 * - Open walk-in doorway with welcome mat (no loading screens)
 * - Hardwood floor and warm interior lighting
 * - Interactive Stone Fireplace with flickering firelight
 * - Interactive Developer Workstation with dual monitors & inspectable profile
 * - Cozy lounge sofa and wall certificates
 */
import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import { Text, Billboard } from '@react-three/drei';
import { useIslandStore } from './useIslandStore';
import * as THREE from 'three';

export default function EnterableCottage() {
  const { playerPosition, setNearbyTarget, nearbyTarget, openInspect, setCurrentArea } =
    useIslandStore();
  const fireLightRef = useRef<THREE.PointLight>(null);

  const COTTAGE_POS = [-9, 0, -8] as const;
  const ROT_Y = 0.2;

  // Cottage interior dimensions
  const W = 6.6;
  const H = 3.4;
  const D = 5.8;

  // Local positions inside cottage
  const DESK_LOCAL: [number, number, number] = [1.8, 0, -1.6];
  const FIRE_LOCAL: [number, number, number] = [-1.6, 0, -2.0];

  // Convert local cottage coordinate to world coordinate
  const getDeskWorld = (): [number, number, number] => [
    COTTAGE_POS[0] + DESK_LOCAL[0] * Math.cos(ROT_Y) + DESK_LOCAL[2] * Math.sin(ROT_Y),
    0,
    COTTAGE_POS[2] - DESK_LOCAL[0] * Math.sin(ROT_Y) + DESK_LOCAL[2] * Math.cos(ROT_Y),
  ];

  const getFireWorld = (): [number, number, number] => [
    COTTAGE_POS[0] + FIRE_LOCAL[0] * Math.cos(ROT_Y) + FIRE_LOCAL[2] * Math.sin(ROT_Y),
    0,
    COTTAGE_POS[2] - FIRE_LOCAL[0] * Math.sin(ROT_Y) + FIRE_LOCAL[2] * Math.cos(ROT_Y),
  ];

  useFrame(({ clock }) => {
    // Fireplace light subtle flicker
    if (fireLightRef.current) {
      fireLightRef.current.intensity = 1.2 + Math.sin(clock.getElapsedTime() * 10) * 0.2;
    }

    const [px, , pz] = playerPosition;
    const distToCenter = Math.hypot(px - COTTAGE_POS[0], pz - COTTAGE_POS[2]);

    // Update location area tag when inside cottage
    if (distToCenter < 2.8) {
      setCurrentArea('SUNSHINE COTTAGE');
    }

    // Proximity to Developer Desk
    const dw = getDeskWorld();
    const distToDesk = Math.hypot(px - dw[0], pz - dw[2]);

    // Proximity to Fireplace
    const fw = getFireWorld();
    const distToFire = Math.hypot(px - fw[0], pz - fw[2]);

    if (distToDesk < 2.0) {
      if (!nearbyTarget || nearbyTarget.id !== 'cottage_desk') {
        setNearbyTarget({
          id: 'cottage_desk',
          title: 'AYUSHMAN’S WORKSTATION',
          subtitle: 'Press [E] to read developer bio & engineering notes',
        });
      }
    } else if (distToFire < 2.0) {
      if (!nearbyTarget || nearbyTarget.id !== 'cottage_hearth') {
        setNearbyTarget({
          id: 'cottage_hearth',
          title: 'COZY FIREPLACE',
          subtitle: 'Press [E] to inspect cottage hearth',
        });
      }
    } else if (
      nearbyTarget?.id === 'cottage_desk' ||
      nearbyTarget?.id === 'cottage_hearth'
    ) {
      setNearbyTarget(null);
    }
  });

  // Handle [E] key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'KeyE') {
        const [px, , pz] = playerPosition;
        const dw = getDeskWorld();
        if (Math.hypot(px - dw[0], pz - dw[2]) < 2.0) {
          openInspect({
            title: 'AYUSHMAN · DEVELOPER WORKSTATION',
            subtitle: 'Full-Stack Engineer · Real-Time 3D & AI Systems',
            badge: 'ABOUT AYUSHMAN',
            sections: [
              {
                heading: 'Who I Am',
                body: 'I am a builder dedicated to engineering expressive, high-performance digital experiences. Rather than conventional static web pages, I view digital presence as an explorable, living universe.',
              },
              {
                heading: 'Engineering Philosophy',
                body: 'Obsessed with clean modular architecture, reactive state, physical systems, and delightful micro-interactions. Every pixel, collider, and endpoint is crafted with care.',
              },
              {
                heading: 'Core Technical Arsenal',
                body: '• Frontend: React, Vite, Three.js, React Three Fiber, Rapier Physics, Tailwind CSS\n• Backend: Node.js, Express, TypeScript, RESTful APIs, WebSockets\n• Systems & AI: Agentic workflows, autonomous tools, full-stack persistence',
              },
              {
                heading: 'Life Beyond Code',
                body: 'When stepping away from the keyboard, you can find me immersing in rich game worlds, listening to lo-fi beats in Arcade Bay, or analyzing modern anime narrative craft.',
              },
            ],
            actions: [
              {
                label: 'OPEN DEVELOPER PAGE',
                route: '/developer',
                emoji: '💻',
                variant: 'primary',
              },
              {
                label: 'VIEW CLASSIC PORTFOLIO',
                route: '/landing',
                emoji: '📄',
                variant: 'secondary',
              },
              {
                label: 'GITHUB REPOSITORY',
                externalUrl: 'https://github.com/Aayushman-debug/ayushman-os',
                emoji: '🐙',
                variant: 'accent',
              },
            ],
          });
        }

        const fw = getFireWorld();
        if (Math.hypot(px - fw[0], pz - fw[2]) < 2.0) {
          openInspect({
            title: 'COZY STONE HEARTH',
            subtitle: 'Warmth, Reflection & Late-Night Coding',
            badge: 'ISLAND MEMORY',
            sections: [
              {
                heading: 'Midnight Focus',
                body: 'The hearth has always been Ayushman’s spot for tackling the trickiest architectural hurdles. There is something grounding about a warm fire when refactoring thousands of lines of code.',
              },
              {
                heading: 'Traveler’s Log',
                body: '“The best software is not just functional — it feels alive, inviting, and memorable to everyone who visits.”',
              },
            ],
            actions: [
              {
                label: 'RETURN TO CLASSIC WEBSITE',
                route: '/landing',
                emoji: '🏠',
                variant: 'primary',
              },
            ],
          });
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [playerPosition, openInspect]);

  return (
    <group position={COTTAGE_POS} rotation={[0, ROT_Y, 0]}>
      {/* ── Outer & Inner Floor ────────────────────────────────────── */}
      {/* Hardwood Interior Floor */}
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <boxGeometry args={[W - 0.2, 0.1, D - 0.2]} />
        <meshStandardMaterial color="#92400e" roughness={0.7} />
      </mesh>

      {/* Front Porch Deck */}
      <mesh position={[0, 0.05, D / 2 + 0.9]} receiveShadow>
        <boxGeometry args={[4.2, 0.1, 1.8]} />
        <meshStandardMaterial color="#b45309" roughness={0.8} />
      </mesh>

      {/* Welcome Mat */}
      <mesh position={[0, 0.11, D / 2 + 0.5]}>
        <boxGeometry args={[1.5, 0.02, 0.8]} />
        <meshStandardMaterial color="#0284c7" roughness={0.9} />
      </mesh>
      <Billboard position={[0, 0.45, D / 2 + 0.5]}>
        <Text fontSize={0.14} color="#ffffff" anchorX="center" anchorY="middle">
          WELCOME HOME
        </Text>
      </Billboard>

      {/* ── Collidable Wall Enclosure with Truly Open Walk-In Doorway ─ */}
      <RigidBody type="fixed" colliders={false}>
        {/* Back Wall */}
        <CuboidCollider args={[W / 2, H / 2, 0.15]} position={[0, H / 2, -D / 2]} />
        <mesh position={[0, H / 2, -D / 2]} castShadow receiveShadow>
          <boxGeometry args={[W, H, 0.22]} />
          <meshStandardMaterial color="#ffedd5" roughness={0.7} />
        </mesh>

        {/* Left Wall */}
        <CuboidCollider args={[0.15, H / 2, D / 2]} position={[-W / 2, H / 2, 0]} />
        <mesh position={[-W / 2, H / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.22, H, D]} />
          <meshStandardMaterial color="#ffedd5" roughness={0.7} />
        </mesh>

        {/* Right Wall */}
        <CuboidCollider args={[0.15, H / 2, D / 2]} position={[W / 2, H / 2, 0]} />
        <mesh position={[W / 2, H / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.22, H, D]} />
          <meshStandardMaterial color="#ffedd5" roughness={0.7} />
        </mesh>

        {/* Front Wall Left Segment */}
        <CuboidCollider args={[(W / 2 - 0.9) / 2, H / 2, 0.15]} position={[-W / 4 - 0.45, H / 2, D / 2]} />
        <mesh position={[-W / 4 - 0.45, H / 2, D / 2]} castShadow receiveShadow>
          <boxGeometry args={[W / 2 - 0.9, H, 0.22]} />
          <meshStandardMaterial color="#ffedd5" roughness={0.7} />
        </mesh>

        {/* Front Wall Right Segment */}
        <CuboidCollider args={[(W / 2 - 0.9) / 2, H / 2, 0.15]} position={[W / 4 + 0.45, H / 2, D / 2]} />
        <mesh position={[W / 4 + 0.45, H / 2, D / 2]} castShadow receiveShadow>
          <boxGeometry args={[W / 2 - 0.9, H, 0.22]} />
          <meshStandardMaterial color="#ffedd5" roughness={0.7} />
        </mesh>

        {/* Front Doorway Lintel / Arch Above Open Door (at height H - 0.4) */}
        <CuboidCollider args={[0.9, 0.4, 0.15]} position={[0, H - 0.4, D / 2]} />
        <mesh position={[0, H - 0.4, D / 2]} castShadow>
          <boxGeometry args={[1.8, 0.8, 0.22]} />
          <meshStandardMaterial color="#ea580c" roughness={0.6} />
        </mesh>
      </RigidBody>

      {/* ── Roof with Overhang ──────────────────────────────────────── */}
      <RigidBody type="fixed" colliders="hull">
        <mesh position={[0, H + 0.9, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
          <coneGeometry args={[Math.max(W, D) * 0.76, 1.8, 4]} />
          <meshStandardMaterial color="#ea580c" roughness={0.6} />
        </mesh>
      </RigidBody>

      {/* Porch Pillars */}
      {[-1.8, 1.8].map((x, i) => (
        <mesh key={i} position={[x, 1.2, D / 2 + 1.6]} castShadow>
          <boxGeometry args={[0.18, 2.3, 0.18]} />
          <meshStandardMaterial color="#ffffff" roughness={0.5} />
        </mesh>
      ))}

      {/* ── Warm Interior Lighting ─────────────────────────────────── */}
      <pointLight position={[0, H - 0.6, 0]} color="#fef08a" intensity={0.9} distance={7} />

      {/* ── Fireplace Feature (Rear Left) ───────────────────────────── */}
      <group position={FIRE_LOCAL}>
        {/* Stone Mantel */}
        <mesh position={[0, 1.1, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.5, 2.2, 0.7]} />
          <meshStandardMaterial color="#64748b" roughness={0.9} />
        </mesh>

        {/* Firebox Recess */}
        <mesh position={[0, 0.5, 0.1]}>
          <boxGeometry args={[0.9, 0.9, 0.6]} />
          <meshStandardMaterial color="#1e293b" roughness={0.9} />
        </mesh>

        {/* Glowing Logs */}
        <mesh position={[0, 0.2, 0.15]}>
          <boxGeometry args={[0.6, 0.14, 0.25]} />
          <meshStandardMaterial
            color="#ef4444"
            emissive="#f97316"
            emissiveIntensity={1.2}
            roughness={0.4}
          />
        </mesh>

        {/* Dynamic Flickering Firelight */}
        <pointLight
          ref={fireLightRef}
          position={[0, 0.5, 0.4]}
          color="#f97316"
          intensity={1.2}
          distance={4.5}
        />

        {/* Chimney Pipe */}
        <mesh position={[0, 2.6, 0]} castShadow>
          <boxGeometry args={[0.7, 1.4, 0.6]} />
          <meshStandardMaterial color="#dc2626" roughness={0.8} />
        </mesh>

        {/* Prompt Billboard */}
        <Billboard position={[0, 2.4, 0]}>
          <Text
            fontSize={0.16}
            color="#ea580c"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.02}
            outlineColor="#ffffff"
          >
            [E] COZY HEARTH
          </Text>
        </Billboard>
      </group>

      {/* ── Developer Workstation Desk (Right Side) ──────────────────── */}
      <group position={DESK_LOCAL} rotation={[0, -Math.PI / 2, 0]}>
        {/* Modern Wooden Desk Tabletop */}
        <mesh position={[0, 0.8, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.8, 0.08, 0.85]} />
          <meshStandardMaterial color="#451a03" roughness={0.7} />
        </mesh>

        {/* Desk Legs */}
        {[-0.8, 0.8].map((x, i) =>
          [-0.35, 0.35].map((z, j) => (
            <mesh key={`${i}-${j}`} position={[x, 0.4, z]} castShadow>
              <boxGeometry args={[0.08, 0.76, 0.08]} />
              <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.3} />
            </mesh>
          ))
        )}

        {/* Dual Curved Ultra-Wide Monitors */}
        {[-0.45, 0.45].map((x, i) => (
          <group key={i} position={[x, 1.25, -0.1]} rotation={[0, (i === 0 ? 0.15 : -0.15), 0]}>
            {/* Monitor Stand */}
            <mesh position={[0, -0.28, 0]}>
              <boxGeometry args={[0.16, 0.28, 0.12]} />
              <meshStandardMaterial color="#334155" metalness={0.9} />
            </mesh>
            {/* Bezel & Screen */}
            <mesh castShadow>
              <boxGeometry args={[0.82, 0.5, 0.05]} />
              <meshStandardMaterial color="#0f172a" roughness={0.3} />
            </mesh>
            {/* Glowing Code Screen */}
            <mesh position={[0, 0, 0.028]}>
              <planeGeometry args={[0.78, 0.46]} />
              <meshBasicMaterial color={i === 0 ? '#0284c7' : '#059669'} />
            </mesh>
          </group>
        ))}

        {/* RGB Keyboard & Mousepad */}
        <mesh position={[0, 0.85, 0.15]}>
          <boxGeometry args={[0.7, 0.02, 0.35]} />
          <meshStandardMaterial
            color="#0f172a"
            emissive="#0284c7"
            emissiveIntensity={0.2}
          />
        </mesh>

        {/* Ergonomic Office Chair */}
        <group position={[0, 0.45, 0.65]}>
          {/* Seat Cushion */}
          <mesh castShadow>
            <boxGeometry args={[0.6, 0.1, 0.55]} />
            <meshStandardMaterial color="#1e293b" roughness={0.5} />
          </mesh>
          {/* Backrest */}
          <mesh position={[0, 0.38, 0.24]} castShadow>
            <boxGeometry args={[0.56, 0.68, 0.08]} />
            <meshStandardMaterial color="#0284c7" roughness={0.6} />
          </mesh>
          {/* Stand */}
          <mesh position={[0, -0.22, 0]}>
            <cylinderGeometry args={[0.06, 0.22, 0.4, 8]} />
            <meshStandardMaterial color="#64748b" metalness={0.9} />
          </mesh>
        </group>

        {/* Prompt Billboard */}
        <Billboard position={[0, 1.85, 0]}>
          <Text
            fontSize={0.16}
            color="#0284c7"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.02}
            outlineColor="#ffffff"
          >
            [E] DEV WORKSTATION
          </Text>
        </Billboard>
      </group>

      {/* ── Cozy Sofa Lounge (Front Left) ──────────────────────────── */}
      <group position={[-1.7, 0, 0.8]} rotation={[0, Math.PI / 2, 0]}>
        {/* Sofa Base */}
        <mesh position={[0, 0.3, 0]} castShadow>
          <boxGeometry args={[1.6, 0.35, 0.7]} />
          <meshStandardMaterial color="#0284c7" roughness={0.8} />
        </mesh>
        {/* Sofa Backrest */}
        <mesh position={[0, 0.6, -0.28]} castShadow>
          <boxGeometry args={[1.6, 0.5, 0.2]} />
          <meshStandardMaterial color="#0369a1" roughness={0.8} />
        </mesh>
        {/* Armrests */}
        {[-0.75, 0.75].map((x, i) => (
          <mesh key={i} position={[x, 0.45, 0]} castShadow>
            <boxGeometry args={[0.18, 0.35, 0.7]} />
            <meshStandardMaterial color="#0369a1" roughness={0.8} />
          </mesh>
        ))}
      </group>

      {/* ── Wall Framed Artwork / Diplomas ─────────────────────────── */}
      <group position={[0, 2.1, -D / 2 + 0.12]}>
        {/* Frame 1 */}
        <mesh position={[-1.2, 0, 0]}>
          <boxGeometry args={[0.9, 0.6, 0.04]} />
          <meshStandardMaterial color="#b45309" roughness={0.7} />
        </mesh>
        <mesh position={[-1.2, 0, 0.022]}>
          <planeGeometry args={[0.82, 0.52]} />
          <meshBasicMaterial color="#fef08a" />
        </mesh>

        {/* Frame 2 */}
        <mesh position={[1.2, 0, 0]}>
          <boxGeometry args={[0.9, 0.6, 0.04]} />
          <meshStandardMaterial color="#b45309" roughness={0.7} />
        </mesh>
        <mesh position={[1.2, 0, 0.022]}>
          <planeGeometry args={[0.82, 0.52]} />
          <meshBasicMaterial color="#bae6fd" />
        </mesh>
      </group>
    </group>
  );
}
