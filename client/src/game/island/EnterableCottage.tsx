/**
 * EnterableCottage.tsx — Ayushman's Personal Home Base & Sanctuary
 *
 * Location: Secluded Hillside Grove [-42, 1.0, -30]
 * Emotional Center of AYushMan Island Life:
 * - Private fenced residential property with stone gate & lanterns
 * - Flower garden & flagstone pathway
 * - Front covered porch with wooden steps & rocking chair
 * - Rear sunset deck overlooking the western ocean horizon
 * - Ground floor interior:
 *   • Developer Workstation (dual glowing monitors, code snippets, engineering notes)
 *   • Cozy stone hearth fireplace with flickering firelight
 *   • Bedroom alcove with cozy bed & nightstand
 *   • Bookshelf library with transcripts & anime figurines
 *   • Wardrobe vanity mirror for styling avatar
 * - Seamless walk-in physics doorway (uncollided 1.8m opening)
 */
import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import { Text, Billboard } from '@react-three/drei';
import { useIslandStore } from './useIslandStore';
import * as THREE from 'three';

export default function EnterableCottage() {
  const { playerPosition, setNearbyTarget, nearbyTarget, openInspect, setCurrentArea, setCustomizerOpen } =
    useIslandStore();
  const fireLightRef = useRef<THREE.PointLight>(null);

  const COTTAGE_POS = [-42, 1.0, -30] as const;
  const ROT_Y = 0.25;

  // Cottage interior dimensions
  const W = 8.2;
  const H = 3.6;
  const D = 7.4;

  // Local positions inside home
  const DESK_LOCAL: [number, number, number] = [2.2, 0, -1.8];
  const FIRE_LOCAL: [number, number, number] = [-2.2, 0, -1.8];
  const BED_LOCAL: [number, number, number] = [-2.4, 0, 1.6];
  const MIRROR_LOCAL: [number, number, number] = [2.6, 0, 1.6];

  // Convert local coordinate to world coordinate
  const toWorld = (local: [number, number, number]): [number, number, number] => [
    COTTAGE_POS[0] + local[0] * Math.cos(ROT_Y) + local[2] * Math.sin(ROT_Y),
    COTTAGE_POS[1] + local[1],
    COTTAGE_POS[2] - local[0] * Math.sin(ROT_Y) + local[2] * Math.cos(ROT_Y),
  ];

  const deskWorld = toWorld(DESK_LOCAL);
  const fireWorld = toWorld(FIRE_LOCAL);
  const bedWorld = toWorld(BED_LOCAL);
  const mirrorWorld = toWorld(MIRROR_LOCAL);

  useFrame(({ clock }) => {
    // Hearth light subtle flicker
    if (fireLightRef.current) {
      fireLightRef.current.intensity = 1.4 + Math.sin(clock.getElapsedTime() * 10) * 0.25;
    }

    const [px, , pz] = playerPosition;
    const distToCenter = Math.hypot(px - COTTAGE_POS[0], pz - COTTAGE_POS[2]);

    // Update location area tag when inside property
    if (distToCenter < 6.5) {
      setCurrentArea("AYUSHMAN'S HOME");
    }

    // Proximity checks
    const distToDesk = Math.hypot(px - deskWorld[0], pz - deskWorld[2]);
    const distToFire = Math.hypot(px - fireWorld[0], pz - fireWorld[2]);
    const distToBed = Math.hypot(px - bedWorld[0], pz - bedWorld[2]);
    const distToMirror = Math.hypot(px - mirrorWorld[0], pz - mirrorWorld[2]);

    if (distToDesk < 2.5) {
      if (!nearbyTarget || nearbyTarget.id !== 'cottage_desk') {
        setNearbyTarget({
          id: 'cottage_desk',
          title: 'AYUSHMAN’S WORKSTATION',
          subtitle: 'Press [E] to read developer bio & engineering notes',
        });
      }
    } else if (distToFire < 2.5) {
      if (!nearbyTarget || nearbyTarget.id !== 'cottage_hearth') {
        setNearbyTarget({
          id: 'cottage_hearth',
          title: 'COZY FIREPLACE',
          subtitle: 'Press [E] to warm up by the hearth',
        });
      }
    } else if (distToBed < 2.5) {
      if (!nearbyTarget || nearbyTarget.id !== 'cottage_bed') {
        setNearbyTarget({
          id: 'cottage_bed',
          title: 'RESTING NOOK',
          subtitle: 'Press [E] to view resting diary & daily habits',
        });
      }
    } else if (distToMirror < 2.5) {
      if (!nearbyTarget || nearbyTarget.id !== 'cottage_mirror') {
        setNearbyTarget({
          id: 'cottage_mirror',
          title: 'WARDROBE MIRROR',
          subtitle: 'Press [E] to customize avatar appearance',
        });
      }
    } else if (
      nearbyTarget?.id === 'cottage_desk' ||
      nearbyTarget?.id === 'cottage_hearth' ||
      nearbyTarget?.id === 'cottage_bed' ||
      nearbyTarget?.id === 'cottage_mirror'
    ) {
      setNearbyTarget(null);
    }
  });

  // Handle [E] key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'KeyE') {
        const target = useIslandStore.getState().nearbyTarget;
        if (!target) return;

        if (target.id === 'cottage_desk') {
          openInspect({
            title: 'Ayushman Pathak — Developer Workstation',
            subtitle: 'Computer Science & Engineering • Web Architect & Systems Builder',
            badge: 'FOUNDER & ENGINEER',
            sections: [
              {
                heading: 'Engineering Philosophy',
                body: 'Dedicated full-stack software engineer crafting immersive interactive systems, robust scalable backends, and elegant user experiences. Proficient in React, Three.js, TypeScript, Node.js, and relational database systems.',
              },
              {
                heading: 'Current Focus & Research',
                body: 'Architecting high-performance spatial web applications, algorithmic game theory systems, and AI-assisted engineering workflows. Maintaining RTU Kota CSE academic honors (Sem 1: 8.42 SGPA, Sem 2: 8.55 SGPA).',
              },
              {
                heading: 'Hardware & Workstation Setup',
                body: '• Primary Rig: Custom AMD Ryzen 7, 32GB DDR5, RTX 4070\n• Displays: Dual 27-inch 165Hz IPS Displays\n• Keyboard: Keychron Q1 Custom Mechanical (Gateron Oil Kings)\n• OS Environment: Arch Linux + Windows 11 Pro',
              },
            ],
            actions: [
              { label: 'View Developer Matrix', route: '/developer', variant: 'primary', emoji: '💻' },
              { label: 'Website Homepage', route: '/', variant: 'secondary', emoji: '🏠' },
              { label: 'GitHub Profile', externalUrl: 'https://github.com/Aayushman-debug', variant: 'accent', emoji: '🐙' },
            ],
          });
        } else if (target.id === 'cottage_hearth') {
          openInspect({
            title: 'Stone Hearth & Fireside Lounge',
            subtitle: 'The warm center of Sunshine Cottage',
            badge: 'COMFORT & LEISURE',
            sections: [
              {
                heading: 'Fireside Reflections',
                body: 'A crackling stone fireplace constructed with river cobble and timber mantels. Even during the coldest rainstorms over the island, the hearth keeps the living room warm and cozy.',
              },
              {
                heading: 'Favorite Tea & Beverages',
                body: '• Kashmiri Kahwa with crushed almonds & saffron\n• Freshly pulled double espresso from the Music Café\n• Mountain chamomile tea during late-night programming sessions',
              },
            ],
            actions: [
              { label: 'Visit Music Café', route: '/world', variant: 'secondary', emoji: '☕' },
            ],
          });
        } else if (target.id === 'cottage_bed') {
          openInspect({
            title: 'Ayushman’s Resting Nook',
            subtitle: 'Personal quarters overlooking the flower garden',
            badge: 'DAILY ROUTINE',
            sections: [
              {
                heading: 'Daily Schedule & Productivity',
                body: '• 06:30 — Morning exercise & green tea\n• 08:30 — Algorithmic problem solving & engineering\n• 14:00 — University academic coursework & lab research\n• 20:00 — Open source projects, anime & gaming\n• 00:00 — Rest & reading',
              },
            ],
          });
        } else if (target.id === 'cottage_mirror') {
          setCustomizerOpen(true);
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [openInspect, setCustomizerOpen]);

  return (
    <group position={COTTAGE_POS} rotation={[0, ROT_Y, 0]}>
      {/* ── 1. Property Perimeter: Picket Fence & Stone Gate ───────── */}
      {/* Front Entrance Stone Pillars */}
      {[-2.8, 2.8].map((px, i) => (
        <group key={i} position={[px, 0, 7.2]}>
          <RigidBody type="fixed" colliders="cuboid">
            <mesh position={[0, 0.9, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.7, 1.8, 0.7]} />
              <meshStandardMaterial color="#64748b" roughness={0.8} />
            </mesh>
          </RigidBody>
          {/* Pillar Lantern */}
          <mesh position={[0, 1.95, 0]}>
            <sphereGeometry args={[0.18, 10, 10]} />
            <meshStandardMaterial color="#fef08a" emissive="#fbbf24" emissiveIntensity={1.2} />
          </mesh>
          <pointLight position={[0, 1.95, 0]} color="#fde047" intensity={0.6} distance={6} />
        </group>
      ))}

      {/* Front Garden Wooden Picket Fence */}
      <RigidBody type="fixed" colliders="cuboid">
        {/* Left Fence Run */}
        <mesh position={[-5.4, 0.6, 7.2]} castShadow receiveShadow>
          <boxGeometry args={[4.4, 1.1, 0.14]} />
          <meshStandardMaterial color="#fef3c7" roughness={0.7} />
        </mesh>
        {/* Right Fence Run */}
        <mesh position={[5.4, 0.6, 7.2]} castShadow receiveShadow>
          <boxGeometry args={[4.4, 1.1, 0.14]} />
          <meshStandardMaterial color="#fef3c7" roughness={0.7} />
        </mesh>
        {/* Side Fence Runs */}
        <mesh position={[-7.5, 0.6, 2.0]} rotation={[0, Math.PI / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[10.5, 1.1, 0.14]} />
          <meshStandardMaterial color="#fef3c7" roughness={0.7} />
        </mesh>
        <mesh position={[7.5, 0.6, 2.0]} rotation={[0, Math.PI / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[10.5, 1.1, 0.14]} />
          <meshStandardMaterial color="#fef3c7" roughness={0.7} />
        </mesh>
      </RigidBody>

      {/* Flagstone Garden Walkway */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 5.6]} receiveShadow>
        <planeGeometry args={[2.2, 3.4]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.88} />
      </mesh>

      {/* Lush Flower Beds in Front Yard */}
      {[-4.2, 4.2].map((fx, i) => (
        <group key={i} position={[fx, 0.05, 5.8]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[2.8, 2.2]} />
            <meshStandardMaterial color="#15803d" roughness={0.9} />
          </mesh>
          {/* Flower Blobs */}
          {[-0.8, 0, 0.8].map((bx, j) => (
            <mesh key={j} position={[bx, 0.25, (j % 2) * 0.4 - 0.2]} castShadow>
              <sphereGeometry args={[0.26, 8, 8]} />
              <meshStandardMaterial
                color={j === 0 ? '#ef4444' : j === 1 ? '#eab308' : '#ec4899'}
                roughness={0.6}
              />
            </mesh>
          ))}
        </group>
      ))}

      {/* ── 2. Front Covered Porch ─────────────────────────────────── */}
      <group position={[0, 0, D / 2 + 0.9]}>
        {/* Porch Deck Floor */}
        <RigidBody type="fixed" colliders="cuboid">
          <mesh position={[0, 0.18, 0]} receiveShadow castShadow>
            <boxGeometry args={[4.8, 0.36, 1.8]} />
            <meshStandardMaterial color="#b45309" roughness={0.75} />
          </mesh>
          {/* Porch Columns */}
          {[-2.1, 2.1].map((cx, i) => (
            <mesh key={i} position={[cx, 1.6, 0.7]} castShadow>
              <cylinderGeometry args={[0.12, 0.14, 2.6, 8]} />
              <meshStandardMaterial color="#fef3c7" roughness={0.7} />
            </mesh>
          ))}
          {/* Porch Eave Roof */}
          <mesh position={[0, 2.95, 0.1]} castShadow>
            <boxGeometry args={[5.2, 0.3, 2.2]} />
            <meshStandardMaterial color="#991b1b" roughness={0.7} />
          </mesh>
        </RigidBody>

        {/* Porch Hanging Lantern */}
        <group position={[0, 2.5, 0.4]}>
          <mesh>
            <sphereGeometry args={[0.15, 8, 8]} />
            <meshStandardMaterial color="#fef08a" emissive="#fbbf24" emissiveIntensity={1.5} />
          </mesh>
          <pointLight color="#fde047" intensity={0.9} distance={7} />
        </group>

        {/* Rocking Chair on Porch */}
        <group position={[1.4, 0.36, 0.2]} rotation={[0, -0.4, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.55, 0.08, 0.55]} />
            <meshStandardMaterial color="#78350f" roughness={0.8} />
          </mesh>
          <mesh position={[0, 0.35, -0.24]} castShadow>
            <boxGeometry args={[0.55, 0.6, 0.06]} />
            <meshStandardMaterial color="#78350f" roughness={0.8} />
          </mesh>
        </group>
      </group>

      {/* ── 3. Rear Sunset Balcony Overlook ────────────────────────── */}
      <group position={[0, 0, -D / 2 - 1.2]}>
        <RigidBody type="fixed" colliders="cuboid">
          {/* Balcony Deck Floor */}
          <mesh position={[0, 0.2, 0]} receiveShadow castShadow>
            <boxGeometry args={[6.2, 0.38, 2.4]} />
            <meshStandardMaterial color="#78350f" roughness={0.8} />
          </mesh>
          {/* Balcony Railings */}
          <mesh position={[0, 0.8, -1.15]} castShadow>
            <boxGeometry args={[6.2, 0.85, 0.1]} />
            <meshStandardMaterial color="#b45309" roughness={0.7} />
          </mesh>
          {[-3.05, 3.05].map((sx, i) => (
            <mesh key={i} position={[sx, 0.8, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
              <boxGeometry args={[2.3, 0.85, 0.1]} />
              <meshStandardMaterial color="#b45309" roughness={0.7} />
            </mesh>
          ))}
        </RigidBody>

        {/* Two Sunset Lounge Chairs facing west/ocean */}
        {[-1.2, 1.2].map((cx, i) => (
          <group key={i} position={[cx, 0.4, -0.2]} rotation={[0, Math.PI, 0]}>
            <mesh castShadow>
              <boxGeometry args={[0.7, 0.1, 0.9]} />
              <meshStandardMaterial color="#0284c7" roughness={0.7} />
            </mesh>
            <mesh position={[0, 0.35, -0.4]} rotation={[-0.2, 0, 0]} castShadow>
              <boxGeometry args={[0.7, 0.7, 0.08]} />
              <meshStandardMaterial color="#0284c7" roughness={0.7} />
            </mesh>
          </group>
        ))}
      </group>

      {/* ── 4. Main House Structure (Walls, Roof, Hardwood Floor) ──── */}
      {/* Hardwood Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]} receiveShadow>
        <planeGeometry args={[W - 0.4, D - 0.4]} />
        <meshStandardMaterial color="#b45309" roughness={0.7} />
      </mesh>

      {/* Ceiling & Rafters */}
      <mesh position={[0, H, 0]} receiveShadow>
        <boxGeometry args={[W, 0.2, D]} />
        <meshStandardMaterial color="#78350f" roughness={0.8} />
      </mesh>

      {/* Steep Pitched Terracotta Roof */}
      <RigidBody type="fixed" colliders="hull">
        <mesh position={[0, H + 1.3, 0]} castShadow>
          <coneGeometry args={[W * 0.75, 2.5, 4]} />
          <meshStandardMaterial color="#dc2626" roughness={0.75} />
        </mesh>
      </RigidBody>

      {/* Stone Chimney */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[-W / 2 + 0.9, H + 1.2, -D / 4]} castShadow>
          <boxGeometry args={[1.2, 3.8, 1.2]} />
          <meshStandardMaterial color="#64748b" roughness={0.9} />
        </mesh>
      </RigidBody>

      {/* ── 5. Segmented Walls with Open Walk-In Doorways ──────────── */}
      <RigidBody type="fixed" colliders={false}>
        {/* Back Wall (with French Doors to Balcony) */}
        <CuboidCollider args={[1.6, H / 2, 0.15]} position={[-2.4, H / 2, -D / 2]} />
        <CuboidCollider args={[1.6, H / 2, 0.15]} position={[2.4, H / 2, -D / 2]} />
        <CuboidCollider args={[W / 2, 0.4, 0.15]} position={[0, H - 0.4, -D / 2]} />

        {/* Left Solid Wall */}
        <CuboidCollider args={[0.15, H / 2, D / 2]} position={[-W / 2, H / 2, 0]} />
        {/* Right Solid Wall */}
        <CuboidCollider args={[0.15, H / 2, D / 2]} position={[W / 2, H / 2, 0]} />

        {/* Front Wall flanking open entrance */}
        <CuboidCollider args={[1.5, H / 2, 0.15]} position={[-W / 2 + 1.5, H / 2, D / 2]} />
        <CuboidCollider args={[1.5, H / 2, 0.15]} position={[W / 2 - 1.5, H / 2, D / 2]} />
        <CuboidCollider args={[W / 2, 0.4, 0.15]} position={[0, H - 0.4, D / 2]} />
      </RigidBody>

      {/* Visual Rendered Wall Meshes */}
      {/* Front Left Wall */}
      <mesh position={[-W / 2 + 1.5, H / 2, D / 2]} castShadow receiveShadow>
        <boxGeometry args={[3.0, H, 0.3]} />
        <meshStandardMaterial color="#fef3c7" roughness={0.8} />
      </mesh>
      {/* Front Right Wall */}
      <mesh position={[W / 2 - 1.5, H / 2, D / 2]} castShadow receiveShadow>
        <boxGeometry args={[3.0, H, 0.3]} />
        <meshStandardMaterial color="#fef3c7" roughness={0.8} />
      </mesh>
      {/* Front Lintel Over Doorway */}
      <mesh position={[0, H - 0.4, D / 2]} castShadow>
        <boxGeometry args={[W, 0.8, 0.3]} />
        <meshStandardMaterial color="#fef3c7" roughness={0.8} />
      </mesh>

      {/* Left Wall */}
      <mesh position={[-W / 2, H / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.3, H, D]} />
        <meshStandardMaterial color="#fef3c7" roughness={0.8} />
      </mesh>
      {/* Right Wall */}
      <mesh position={[W / 2, H / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.3, H, D]} />
        <meshStandardMaterial color="#fef3c7" roughness={0.8} />
      </mesh>

      {/* Back Wall Left */}
      <mesh position={[-2.4, H / 2, -D / 2]} castShadow receiveShadow>
        <boxGeometry args={[3.2, H, 0.3]} />
        <meshStandardMaterial color="#fef3c7" roughness={0.8} />
      </mesh>
      {/* Back Wall Right */}
      <mesh position={[2.4, H / 2, -D / 2]} castShadow receiveShadow>
        <boxGeometry args={[3.2, H, 0.3]} />
        <meshStandardMaterial color="#fef3c7" roughness={0.8} />
      </mesh>
      {/* Back Wall Lintel */}
      <mesh position={[0, H - 0.4, -D / 2]} castShadow>
        <boxGeometry args={[W, 0.8, 0.3]} />
        <meshStandardMaterial color="#fef3c7" roughness={0.8} />
      </mesh>

      {/* Front Doorway Welcome Mat */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, D / 2 - 0.4]}>
        <planeGeometry args={[1.7, 0.9]} />
        <meshStandardMaterial color="#0284c7" roughness={0.9} />
      </mesh>

      {/* Entrance Overhead Welcome Signboard */}
      <Billboard position={[0, H + 0.3, D / 2 + 0.2]}>
        <Text
          fontSize={0.34}
          color="#991b1b"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.03}
          outlineColor="#ffffff"
        >
          AYUSHMAN’S HOME BASE
        </Text>
      </Billboard>

      {/* ── 6. Interior Furnishings ─────────────────────────────────── */}
      {/* Warm Ambient Ceiling Chandelier */}
      <pointLight position={[0, H - 0.5, 0]} color="#ffedd5" intensity={1.8} distance={14} />

      {/* A. Developer Workstation Setup [DESK_LOCAL] */}
      <group position={DESK_LOCAL}>
        {/* Solid Oak Desk Surface */}
        <RigidBody type="fixed" colliders="cuboid">
          <mesh position={[0, 0.72, 0]} castShadow receiveShadow>
            <boxGeometry args={[2.2, 0.08, 1.1]} />
            <meshStandardMaterial color="#78350f" roughness={0.7} />
          </mesh>
          {/* Desk Legs */}
          {[-0.95, 0.95].map((lx, i) => (
            <mesh key={i} position={[lx, 0.34, 0]} castShadow>
              <boxGeometry args={[0.08, 0.68, 0.9]} />
              <meshStandardMaterial color="#334155" roughness={0.5} />
            </mesh>
          ))}
        </RigidBody>

        {/* Dual Ultrawide Glowing Monitors */}
        {[-0.55, 0.55].map((mx, i) => (
          <group key={i} position={[mx, 1.15, -0.32]} rotation={[0, (i === 0 ? 0.15 : -0.15), 0]}>
            {/* Bezel */}
            <mesh castShadow>
              <boxGeometry args={[0.95, 0.56, 0.04]} />
              <meshStandardMaterial color="#0f172a" roughness={0.3} />
            </mesh>
            {/* Glowing Screen */}
            <mesh position={[0, 0, 0.025]}>
              <planeGeometry args={[0.9, 0.51]} />
              <meshStandardMaterial
                color="#0284c7"
                emissive="#38bdf8"
                emissiveIntensity={0.8}
                roughness={0.2}
              />
            </mesh>
            {/* Monitor Stand */}
            <mesh position={[0, -0.32, -0.05]} castShadow>
              <cylinderGeometry args={[0.04, 0.04, 0.25, 8]} />
              <meshStandardMaterial color="#334155" roughness={0.4} />
            </mesh>
          </group>
        ))}

        {/* Mechanical Keyboard & Mouse */}
        <mesh position={[0, 0.78, 0.18]} castShadow>
          <boxGeometry args={[0.65, 0.02, 0.22]} />
          <meshStandardMaterial color="#1e293b" roughness={0.5} />
        </mesh>
        <mesh position={[0.45, 0.78, 0.18]} castShadow>
          <boxGeometry args={[0.1, 0.02, 0.15]} />
          <meshStandardMaterial color="#0284c7" roughness={0.4} />
        </mesh>

        {/* Executive Swivel Chair */}
        <group position={[0, 0.45, 0.65]} rotation={[0, Math.PI, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.65, 0.1, 0.6]} />
            <meshStandardMaterial color="#0f172a" roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.45, -0.26]} castShadow>
            <boxGeometry args={[0.65, 0.75, 0.1]} />
            <meshStandardMaterial color="#0f172a" roughness={0.5} />
          </mesh>
        </group>

        {/* Floating Billboard Prompt */}
        <Billboard position={[0, 1.8, 0]}>
          <Text
            fontSize={0.24}
            color="#0284c7"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.03}
            outlineColor="#ffffff"
          >
            AYUSHMAN’S WORKSTATION [E]
          </Text>
        </Billboard>
      </group>

      {/* B. Cozy Stone Fireplace & Armchair [FIRE_LOCAL] */}
      <group position={FIRE_LOCAL}>
        <RigidBody type="fixed" colliders="cuboid">
          {/* Stone Hearth Mantle */}
          <mesh position={[0, 1.1, -0.4]} castShadow receiveShadow>
            <boxGeometry args={[1.8, 2.2, 0.7]} />
            <meshStandardMaterial color="#64748b" roughness={0.9} />
          </mesh>
          {/* Fire Cavity Interior */}
          <mesh position={[0, 0.5, -0.3]}>
            <boxGeometry args={[1.1, 0.9, 0.5]} />
            <meshStandardMaterial color="#0f172a" roughness={0.95} />
          </mesh>
        </RigidBody>

        {/* Glowing Fire Embers */}
        <mesh position={[0, 0.25, -0.2]}>
          <sphereGeometry args={[0.26, 8, 8]} />
          <meshStandardMaterial
            color="#ef4444"
            emissive="#f97316"
            emissiveIntensity={2.5}
            roughness={0.2}
          />
        </mesh>
        <pointLight
          ref={fireLightRef}
          position={[0, 0.5, 0]}
          color="#f97316"
          intensity={1.4}
          distance={6}
        />

        {/* Cozy Fireside Armchair */}
        <group position={[0, 0.35, 1.1]} rotation={[0, 0, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.9, 0.4, 0.85]} />
            <meshStandardMaterial color="#991b1b" roughness={0.8} />
          </mesh>
          <mesh position={[0, 0.5, -0.32]} castShadow>
            <boxGeometry args={[0.9, 0.7, 0.2]} />
            <meshStandardMaterial color="#991b1b" roughness={0.8} />
          </mesh>
        </group>

        {/* Floating Hearth Prompt */}
        <Billboard position={[0, 1.8, 0]}>
          <Text
            fontSize={0.22}
            color="#f97316"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.03}
            outlineColor="#ffffff"
          >
            COZY HEARTH [E]
          </Text>
        </Billboard>
      </group>

      {/* C. Bedroom Sleeping Alcove [BED_LOCAL] */}
      <group position={BED_LOCAL}>
        <RigidBody type="fixed" colliders="cuboid">
          {/* Bed Base & Mattress */}
          <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.5, 0.5, 2.2]} />
            <meshStandardMaterial color="#475569" roughness={0.8} />
          </mesh>
          {/* Wooden Headboard */}
          <mesh position={[0, 0.75, -1.05]} castShadow>
            <boxGeometry args={[1.5, 0.9, 0.12]} />
            <meshStandardMaterial color="#78350f" roughness={0.7} />
          </mesh>
        </RigidBody>

        {/* Plaid Blanket Cover */}
        <mesh position={[0, 0.62, 0.15]} castShadow>
          <boxGeometry args={[1.42, 0.1, 1.6]} />
          <meshStandardMaterial color="#0284c7" roughness={0.75} />
        </mesh>
        {/* Soft Pillows */}
        <mesh position={[0, 0.68, -0.75]} castShadow>
          <boxGeometry args={[1.1, 0.14, 0.45]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.6} />
        </mesh>

        {/* Floating Bed Prompt */}
        <Billboard position={[0, 1.5, 0]}>
          <Text
            fontSize={0.2}
            color="#38bdf8"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.03}
            outlineColor="#ffffff"
          >
            RESTING NOOK [E]
          </Text>
        </Billboard>
      </group>

      {/* D. Wardrobe Mirror Nook [MIRROR_LOCAL] */}
      <group position={MIRROR_LOCAL}>
        <RigidBody type="fixed" colliders="cuboid">
          {/* Vanity Table */}
          <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.2, 0.8, 0.6]} />
            <meshStandardMaterial color="#78350f" roughness={0.7} />
          </mesh>
          {/* Mirror Frame */}
          <mesh position={[0, 1.5, -0.25]} castShadow>
            <boxGeometry args={[1.1, 1.3, 0.08]} />
            <meshStandardMaterial color="#fef3c7" roughness={0.6} />
          </mesh>
        </RigidBody>

        {/* Reflective Mirror Pane */}
        <mesh position={[0, 1.5, -0.2]}>
          <planeGeometry args={[0.95, 1.15]} />
          <meshStandardMaterial
            color="#e0f2fe"
            metalness={0.85}
            roughness={0.1}
            emissive="#bae6fd"
            emissiveIntensity={0.2}
          />
        </mesh>

        {/* Floating Mirror Prompt */}
        <Billboard position={[0, 2.3, 0]}>
          <Text
            fontSize={0.2}
            color="#ec4899"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.03}
            outlineColor="#ffffff"
          >
            WARDROBE MIRROR [E]
          </Text>
        </Billboard>
      </group>
    </group>
  );
}
