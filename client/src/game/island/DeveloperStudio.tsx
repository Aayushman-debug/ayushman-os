/**
 * DeveloperStudio.tsx — Physically Enterable Software Studio & Project Lab
 *
 * Location: West [-16, 0, 4] (facing East toward Sunshine Plaza)
 * Features:
 * - Industrial timber & slate architecture with clerestory windows
 * - Open walk-in doorway with deck porch and illuminated neon sign
 * - 3 Dedicated Interactive Project Terminals:
 *   1. AYushMan OS (Island Life 3D Universe & Platform)
 *   2. Mithila Art Heritage Platform (Madhubani E-Commerce)
 *   3. CampusConnect Portal (Academic & Cohort Hub)
 * - Interactive Tech Stack Totem Pedestals (React, Three.js, TS, Node, MySQL)
 * - Live GitHub Repository Kiosk
 */
import React, { useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import { Text, Billboard } from '@react-three/drei';
import { useIslandStore } from './useIslandStore';
import * as THREE from 'three';

export default function DeveloperStudio() {
  const { playerPosition, setNearbyTarget, nearbyTarget, openInspect, setCurrentArea } =
    useIslandStore();

  const STUDIO_POS = [-16, 0, 4] as const;
  const ROT_Y = Math.PI / 2; // Facing East toward central plaza

  const W = 7.4;
  const H = 3.6;
  const D = 6.4;

  // Local positions inside studio
  const AYUSHMAN_TERM_LOCAL: [number, number, number] = [-1.8, 0, -1.8];
  const MITHILA_TERM_LOCAL: [number, number, number] = [0, 0, -1.8];
  const CAMPUS_TERM_LOCAL: [number, number, number] = [1.8, 0, -1.8];
  const TOTEM_LOCAL: [number, number, number] = [-2.2, 0, 0.8];
  const GITHUB_LOCAL: [number, number, number] = [2.2, 0, 0.8];

  // Helper to convert local coords to world coordinates
  const toWorld = (local: [number, number, number]): [number, number, number] => [
    STUDIO_POS[0] + local[0] * Math.cos(ROT_Y) + local[2] * Math.sin(ROT_Y),
    0,
    STUDIO_POS[2] - local[0] * Math.sin(ROT_Y) + local[2] * Math.cos(ROT_Y),
  ];

  useFrame(() => {
    const [px, , pz] = playerPosition;
    const distToCenter = Math.hypot(px - STUDIO_POS[0], pz - STUDIO_POS[2]);

    if (distToCenter < 3.4) {
      setCurrentArea('DEVELOPER STUDIO');
    }

    // Proximity checks for interactive nodes
    const ayPos = toWorld(AYUSHMAN_TERM_LOCAL);
    const miPos = toWorld(MITHILA_TERM_LOCAL);
    const caPos = toWorld(CAMPUS_TERM_LOCAL);
    const toPos = toWorld(TOTEM_LOCAL);
    const ghPos = toWorld(GITHUB_LOCAL);

    if (Math.hypot(px - ayPos[0], pz - ayPos[2]) < 2.8) {
      if (!nearbyTarget || nearbyTarget.id !== 'studio_ayushman') {
        setNearbyTarget({
          id: 'studio_ayushman',
          title: 'AYUSHMAN OS TERMINAL',
          subtitle: 'Press [E] to inspect 3D Island platform architecture',
        });
      }
    } else if (Math.hypot(px - miPos[0], pz - miPos[2]) < 2.8) {
      if (!nearbyTarget || nearbyTarget.id !== 'studio_mithila') {
        setNearbyTarget({
          id: 'studio_mithila',
          title: 'MITHILA ART HERITAGE TERMINAL',
          subtitle: 'Press [E] to inspect Madhubani art platform & shop',
        });
      }
    } else if (Math.hypot(px - caPos[0], pz - caPos[2]) < 2.8) {
      if (!nearbyTarget || nearbyTarget.id !== 'studio_campus') {
        setNearbyTarget({
          id: 'studio_campus',
          title: 'CAMPUSCONNECT PORTAL',
          subtitle: 'Press [E] to inspect college management & timetable app',
        });
      }
    } else if (Math.hypot(px - toPos[0], pz - toPos[2]) < 2.8) {
      if (!nearbyTarget || nearbyTarget.id !== 'studio_totems') {
        setNearbyTarget({
          id: 'studio_totems',
          title: 'TECH STACK TOTEMS',
          subtitle: 'Press [E] to inspect full engineering arsenal',
        });
      }
    } else if (Math.hypot(px - ghPos[0], pz - ghPos[2]) < 2.8) {
      if (!nearbyTarget || nearbyTarget.id !== 'studio_github') {
        setNearbyTarget({
          id: 'studio_github',
          title: 'GITHUB REPOSITORY KIOSK',
          subtitle: 'Press [E] to open live source code repositories',
        });
      }
    } else if (
      nearbyTarget?.id === 'studio_ayushman' ||
      nearbyTarget?.id === 'studio_mithila' ||
      nearbyTarget?.id === 'studio_campus' ||
      nearbyTarget?.id === 'studio_totems' ||
      nearbyTarget?.id === 'studio_github'
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

        if (target.id === 'studio_ayushman') {
          openInspect({
            title: 'AYushMan OS · ISLAND LIFE & WEB PLATFORM',
            subtitle: 'Playable 3D Universe · React Three Fiber, Rapier & TypeScript',
            badge: 'CORE FLAGSHIP',
            sections: [
              {
                heading: 'System Vision',
                body: 'A full-fledged Roblox-inspired 3D open world web platform. Replaces traditional static developer portfolios with spatial exploration, customizable blocky avatars, procedural Web Audio synthesizer, and Rapier physics while maintaining full RESTful API persistence.',
              },
              {
                heading: 'Architecture & Stack',
                body: '• Frontend: React 18, Vite, Three.js, React Three Fiber, Tailwind CSS\n• Physics: @react-three/rapier custom rigid-body collision meshes\n• State Management: Zustand with localStorage persistence\n• Audio Engine: Web Audio API procedural sound synthesis\n• Backend: Node.js, Express, TypeScript, RESTful endpoints',
              },
              {
                heading: 'Key Gameplay Innovations',
                body: '• Authentic blocky Roblox avatar customization with live 3D turntable\n• Physically enterable Bloxburg-style buildings with walk-in collision doorways\n• Symmetrical avenues and circular central plaza with fast travel teleports',
              },
            ],
            actions: [
              { label: 'DEVELOPER MATRIX', route: '/developer', emoji: '💻', variant: 'primary' },
              { label: 'HOMEPAGE (VILLAGE THEME)', route: '/', emoji: '🏠', variant: 'secondary' },
              {
                label: 'GITHUB REPOSITORY',
                externalUrl: 'https://github.com/Aayushman-debug/ayushman-os',
                emoji: '🐙',
                variant: 'accent',
              },
            ],
          });
        } else if (target.id === 'studio_mithila') {
          openInspect({
            title: 'MITHILA ART HERITAGE PLATFORM',
            subtitle: 'E-Commerce & Cultural Archive for Traditional Madhubani Art',
            badge: 'CULTURAL COMMERCE',
            sections: [
              {
                heading: 'About the Platform',
                body: 'An interactive cultural marketplace exhibiting authentic Madhubani hand-painted artworks, artist biographies, master craft storytelling, and secure transaction workflows.',
              },
              {
                heading: 'Tech Stack & Production',
                body: '• Frontend: React, Tailwind CSS\n• Backend: Node.js, Express, REST APIs\n• Hosting: Render & Vercel\n• Features: High-resolution zoomable gallery, artisan bios, checkout flow',
              },
            ],
            actions: [
              {
                label: 'OPEN GITHUB REPO',
                externalUrl: 'https://github.com/Aayushman-debug/mithila-art',
                emoji: '🐙',
                variant: 'primary',
              },
              { label: 'VIEW PROJECTS PAGE', route: '/developer', emoji: '📂', variant: 'secondary' },
            ],
          });
        } else if (target.id === 'studio_campus') {
          openInspect({
            title: 'CAMPUSCONNECT ACADEMIC PORTAL',
            subtitle: 'University Management & Cohort Collaboration Hub',
            badge: 'COLLEGIATE PORTAL',
            sections: [
              {
                heading: 'About CampusConnect',
                body: 'Comprehensive academic portal enabling timetable management, syllabus tracking, note exchanges, and event notifications for college cohorts.',
              },
              {
                heading: 'Key Capabilities',
                body: '• Technologies: React, Node.js, MySQL, Tailwind CSS\n• Features: Real-time academic schedules, peer note sharing, syllabus completion trackers',
              },
            ],
            actions: [
              {
                label: 'OPEN GITHUB REPO',
                externalUrl: 'https://github.com/Aayushman-debug/CampusConnect',
                emoji: '🐙',
                variant: 'primary',
              },
              { label: 'VIEW PROJECTS PAGE', route: '/developer', emoji: '📂', variant: 'secondary' },
            ],
          });
        } else if (target.id === 'studio_totems') {
          openInspect({
            title: 'ENGINEERING TECH ARSENAL',
            subtitle: 'Languages, Frameworks, Physical Simulations & Backends',
            badge: 'TECH STACK',
            sections: [
              {
                heading: 'Frontend & 3D Web',
                body: '• React, Vite, TypeScript, JavaScript (ESNext)\n• Three.js, React Three Fiber, Drei, Rapier 3D Physics\n• Tailwind CSS, GSAP, Lucide Icons',
              },
              {
                heading: 'Backend & Databases',
                body: '• Node.js, Express, TypeScript\n• MySQL, Relational Database Modeling, RESTful APIs, WebSockets\n• Architecture: Clean MVC, modular controllers, type-safe models',
              },
              {
                heading: 'Systems & Algorithmic Foundations',
                body: '• C++ & Python for Competitive Programming & Algorithms\n• Git Version Control, Linux Shell, Docker',
              },
            ],
            actions: [
              { label: 'VIEW FULL MATRIX', route: '/developer', emoji: '⚡', variant: 'primary' },
              {
                label: 'GITHUB PROFILE',
                externalUrl: 'https://github.com/Aayushman-debug',
                emoji: '🐙',
                variant: 'secondary',
              },
            ],
          });
        } else if (target.id === 'studio_github') {
          openInspect({
            title: 'GITHUB REPOSITORY DIRECTORY',
            subtitle: 'Ayushman Pathak (@Aayushman-debug)',
            badge: 'OPEN SOURCE',
            sections: [
              {
                heading: 'Featured Repositories',
                body: '1. ayushman-os — Full-stack 3D portfolio & personal operating system\n2. mithila-art — Traditional Indian folk art e-commerce platform\n3. CampusConnect — College academic portal and cohort community',
              },
              {
                heading: 'Open Source Philosophy',
                body: 'Clean commits, well-documented architecture, reproducible environments, and genuine craftsmanship in every pull request.',
              },
            ],
            actions: [
              {
                label: 'VISIT GITHUB (@Aayushman-debug)',
                externalUrl: 'https://github.com/Aayushman-debug',
                emoji: '🐙',
                variant: 'primary',
              },
            ],
          });
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [openInspect]);

  return (
    <group position={STUDIO_POS} rotation={[0, ROT_Y, 0]}>
      {/* ── Floor & Porch ─────────────────────────────────────────── */}
      {/* Slate Interior Floor */}
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <boxGeometry args={[W - 0.2, 0.1, D - 0.2]} />
        <meshStandardMaterial color="#1e293b" roughness={0.6} />
      </mesh>

      {/* Front Timber Porch Deck (leading East toward plaza) */}
      <mesh position={[0, 0.05, D / 2 + 0.9]} receiveShadow>
        <boxGeometry args={[4.4, 0.1, 1.8]} />
        <meshStandardMaterial color="#b45309" roughness={0.8} />
      </mesh>

      {/* Front Plaque Sign */}
      <Billboard position={[0, H + 0.35, D / 2 + 0.2]}>
        <Text
          fontSize={0.24}
          color="#38bdf8"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.03}
          outlineColor="#0f172a"
        >
          DEVELOPER STUDIO
        </Text>
      </Billboard>

      {/* ── Collidable Wall Enclosure with Truly Open Walk-In Doorway ─ */}
      <RigidBody type="fixed" colliders={false}>
        {/* Back Wall */}
        <CuboidCollider args={[W / 2, H / 2, 0.15]} position={[0, H / 2, -D / 2]} />
        <mesh position={[0, H / 2, -D / 2]} castShadow receiveShadow>
          <boxGeometry args={[W, H, 0.22]} />
          <meshStandardMaterial color="#334155" roughness={0.7} />
        </mesh>

        {/* Left Wall */}
        <CuboidCollider args={[0.15, H / 2, D / 2]} position={[-W / 2, H / 2, 0]} />
        <mesh position={[-W / 2, H / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.22, H, D]} />
          <meshStandardMaterial color="#334155" roughness={0.7} />
        </mesh>

        {/* Right Wall */}
        <CuboidCollider args={[0.15, H / 2, D / 2]} position={[W / 2, H / 2, 0]} />
        <mesh position={[W / 2, H / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.22, H, D]} />
          <meshStandardMaterial color="#334155" roughness={0.7} />
        </mesh>

        {/* Front Wall Left Segment */}
        <CuboidCollider args={[(W / 2 - 0.9) / 2, H / 2, 0.15]} position={[-W / 4 - 0.45, H / 2, D / 2]} />
        <mesh position={[-W / 4 - 0.45, H / 2, D / 2]} castShadow receiveShadow>
          <boxGeometry args={[W / 2 - 0.9, H, 0.22]} />
          <meshStandardMaterial color="#334155" roughness={0.7} />
        </mesh>

        {/* Front Wall Right Segment */}
        <CuboidCollider args={[(W / 2 - 0.9) / 2, H / 2, 0.15]} position={[W / 4 + 0.45, H / 2, D / 2]} />
        <mesh position={[W / 4 + 0.45, H / 2, D / 2]} castShadow receiveShadow>
          <boxGeometry args={[W / 2 - 0.9, H, 0.22]} />
          <meshStandardMaterial color="#334155" roughness={0.7} />
        </mesh>

        {/* Front Doorway Lintel */}
        <CuboidCollider args={[0.9, 0.4, 0.15]} position={[0, H - 0.4, D / 2]} />
        <mesh position={[0, H - 0.4, D / 2]} castShadow>
          <boxGeometry args={[1.8, 0.8, 0.22]} />
          <meshStandardMaterial color="#0284c7" roughness={0.5} />
        </mesh>
      </RigidBody>

      {/* ── Studio Sloped Industrial Timber Roof ────────────────────── */}
      <RigidBody type="fixed" colliders="hull">
        <mesh position={[0, H + 0.7, 0]} castShadow>
          <boxGeometry args={[W + 0.6, 0.4, D + 0.6]} />
          <meshStandardMaterial color="#0f172a" roughness={0.6} />
        </mesh>
      </RigidBody>

      {/* Porch Pillars */}
      {[-1.9, 1.9].map((x, i) => (
        <mesh key={i} position={[x, 1.2, D / 2 + 1.6]} castShadow>
          <boxGeometry args={[0.18, 2.3, 0.18]} />
          <meshStandardMaterial color="#0284c7" roughness={0.5} />
        </mesh>
      ))}

      {/* ── Interior Studio Lighting ──────────────────────────────── */}
      <pointLight position={[0, H - 0.6, 0]} color="#bae6fd" intensity={1.1} distance={8} />

      {/* ── 3 Project Terminals along the Rear Wall ─────────────────── */}
      {/* 1. AYushMan OS Terminal */}
      <group position={AYUSHMAN_TERM_LOCAL}>
        <mesh position={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[1.2, 1.0, 0.8]} />
          <meshStandardMaterial color="#0f172a" roughness={0.4} />
        </mesh>
        <mesh position={[0, 1.2, 0]}>
          <boxGeometry args={[0.9, 0.55, 0.08]} />
          <meshStandardMaterial color="#0284c7" roughness={0.2} emissive="#0284c7" emissiveIntensity={0.6} />
        </mesh>
        <Billboard position={[0, 1.8, 0]}>
          <Text fontSize={0.15} color="#38bdf8" outlineWidth={0.02} outlineColor="#000000">
            [E] AYUSHMAN OS
          </Text>
        </Billboard>
      </group>

      {/* 2. Mithila Art Terminal */}
      <group position={MITHILA_TERM_LOCAL}>
        <mesh position={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[1.2, 1.0, 0.8]} />
          <meshStandardMaterial color="#0f172a" roughness={0.4} />
        </mesh>
        <mesh position={[0, 1.2, 0]}>
          <boxGeometry args={[0.9, 0.55, 0.08]} />
          <meshStandardMaterial color="#ea580c" roughness={0.2} emissive="#ea580c" emissiveIntensity={0.6} />
        </mesh>
        <Billboard position={[0, 1.8, 0]}>
          <Text fontSize={0.15} color="#fb923c" outlineWidth={0.02} outlineColor="#000000">
            [E] MITHILA ART
          </Text>
        </Billboard>
      </group>

      {/* 3. CampusConnect Terminal */}
      <group position={CAMPUS_TERM_LOCAL}>
        <mesh position={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[1.2, 1.0, 0.8]} />
          <meshStandardMaterial color="#0f172a" roughness={0.4} />
        </mesh>
        <mesh position={[0, 1.2, 0]}>
          <boxGeometry args={[0.9, 0.55, 0.08]} />
          <meshStandardMaterial color="#10b981" roughness={0.2} emissive="#10b981" emissiveIntensity={0.6} />
        </mesh>
        <Billboard position={[0, 1.8, 0]}>
          <Text fontSize={0.15} color="#34d399" outlineWidth={0.02} outlineColor="#000000">
            [E] CAMPUSCONNECT
          </Text>
        </Billboard>
      </group>

      {/* ── Tech Stack Totem Display (Left Wall) ───────────────────── */}
      <group position={TOTEM_LOCAL} rotation={[0, Math.PI / 2, 0]}>
        <mesh position={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[1.8, 0.9, 0.6]} />
          <meshStandardMaterial color="#1e293b" roughness={0.7} />
        </mesh>
        {/* Glowing Totem Pillars */}
        {[-0.6, -0.2, 0.2, 0.6].map((tx, idx) => (
          <mesh key={idx} position={[tx, 1.15, 0]} castShadow>
            <cylinderGeometry args={[0.09, 0.11, 0.5, 8]} />
            <meshStandardMaterial
              color={['#38bdf8', '#818cf8', '#34d399', '#fbbf24'][idx]}
              emissive={['#38bdf8', '#818cf8', '#34d399', '#fbbf24'][idx]}
              emissiveIntensity={0.5}
            />
          </mesh>
        ))}
        <Billboard position={[0, 1.8, 0]}>
          <Text fontSize={0.15} color="#38bdf8" outlineWidth={0.02} outlineColor="#000000">
            [E] TECH STACK
          </Text>
        </Billboard>
      </group>

      {/* ── Live GitHub Kiosk (Right Wall) ─────────────────────────── */}
      <group position={GITHUB_LOCAL} rotation={[0, -Math.PI / 2, 0]}>
        <mesh position={[0, 0.6, 0]} castShadow>
          <boxGeometry args={[1.2, 1.2, 0.6]} />
          <meshStandardMaterial color="#0f172a" roughness={0.5} />
        </mesh>
        <mesh position={[0, 1.35, 0]}>
          <boxGeometry args={[0.8, 0.5, 0.06]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.4} />
        </mesh>
        <Billboard position={[0, 1.85, 0]}>
          <Text fontSize={0.15} color="#ffffff" outlineWidth={0.02} outlineColor="#000000">
            [E] GITHUB KIOSK
          </Text>
        </Billboard>
      </group>
    </group>
  );
}
