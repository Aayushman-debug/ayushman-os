/**
 * DeveloperVillage.tsx — Software Studio & Interactive Project Kiosks
 *
 * Location: West of Sunshine Plaza [-26, 0, -2]
 * Features:
 * - Modern Software Studio Building with pitched glass roof and tech signs
 * - 3 Interactive 3D Project Terminals (AYushMan, Mithila Art, CampusConnect)
 * - Tech Stack Totems (C++, Python, React, TypeScript, Node.js, MySQL)
 * - Proximity detection triggering detailed project modals
 */
import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';
import { Text, Billboard } from '@react-three/drei';
import { useIslandStore } from '../useIslandStore';
import * as THREE from 'three';

export interface ProjectData {
  id: string;
  title: string;
  tag: string;
  emoji: string;
  color: string;
  pos: [number, number, number];
  description: string;
  technologies: string[];
  githubUrl: string;
  liveUrl: string;
  features: string[];
}

export const PORTFOLIO_PROJECTS: ProjectData[] = [
  {
    id: 'proj_ayushman_os',
    title: 'AYushMan: ISLAND LIFE',
    tag: 'Playable 3D Universe & Portfolio',
    emoji: '🌴',
    color: '#0284c7',
    pos: [-24, 0, -6],
    description:
      'A full-fledged Roblox-inspired 3D open world web platform. Replaces traditional static developer portfolios with spatial exploration, customizable blocky avatars, procedural Web Audio synthesizer, and Rapier physics while maintaining full RESTful API persistence.',
    technologies: ['React Three Fiber', 'Rapier Physics', 'TypeScript', 'Zustand', 'Node.js', 'Express', 'Tailwind CSS'],
    githubUrl: 'https://github.com/Aayushman-debug/ayushman-os',
    liveUrl: '/world',
    features: [
      'Authentic blocky Roblox avatar customization with live 3D turntable preview',
      'Physically enterable Bloxburg buildings with collision bounds & no loading screens',
      'Synthesized Web Audio engine delivering ocean waves, footsteps, and musical chimes',
      'Seamless multi-route architecture isolating /world from classic /landing',
    ],
  },
  {
    id: 'proj_mithila',
    title: 'Mithila Art Heritage Platform',
    tag: 'Cultural Marketplace & Archive',
    emoji: '🎨',
    color: '#ea580c',
    pos: [-27, 0, -2],
    description:
      'An interactive cultural marketplace exhibiting authentic Madhubani hand-painted artworks, artist biographies, master craft storytelling, and secure transaction workflows.',
    technologies: ['React', 'Node.js', 'Express', 'Tailwind CSS', 'Render', 'Vercel'],
    githubUrl: 'https://github.com/Aayushman-debug/mithila-art',
    liveUrl: 'https://mithila-art.vercel.app',
    features: [
      'Comprehensive cultural repository showcasing traditional Madhubani motifs',
      'Frictionless e-commerce checkout and artist commission workflow',
      'Responsive gallery design preserving high-fidelity canvas detail',
    ],
  },
  {
    id: 'proj_campus',
    title: 'CampusConnect Portal',
    tag: 'Academic Management & Community',
    emoji: '🏫',
    color: '#10b981',
    pos: [-24, 0, 2],
    description:
      'Comprehensive academic management platform enabling timetable scheduling, syllabus progress tracking, peer note exchanges, and event notifications for college cohorts.',
    technologies: ['React', 'TypeScript', 'Node.js', 'Express', 'MySQL', 'Tailwind CSS'],
    githubUrl: 'https://github.com/Aayushman-debug/CampusConnect',
    liveUrl: '#',
    features: [
      'Real-time lecture timetable and semester exam countdown',
      'Centralized course notes and digital study resources repository',
      'Cohort event broadcasting and peer study group networking',
    ],
  },
];

const SKILL_TOTEMS = [
  { name: 'C++ & STL', color: '#00599C', emoji: '⚡', pos: [-29, 0, -7] as const },
  { name: 'React & TS', color: '#61DAFB', emoji: '⚛️', pos: [-30.5, 0, -3] as const },
  { name: 'Node & APIs', color: '#68A063', emoji: '🟢', pos: [-30.5, 0, 1] as const },
  { name: 'Python & AI', color: '#3776AB', emoji: '🐍', pos: [-29, 0, 5] as const },
];

function ProjectKiosk({ project }: { project: ProjectData }) {
  const iconRef = useRef<THREE.Group>(null);
  const { playerPosition, setNearbyTarget, nearbyTarget, openInspect } = useIslandStore();

  useFrame(({ clock }) => {
    if (iconRef.current) {
      iconRef.current.rotation.y = clock.getElapsedTime() * 1.6;
      iconRef.current.position.y = 1.9 + Math.sin(clock.getElapsedTime() * 2.5 + project.pos[0]) * 0.08;
    }

    const [px, , pz] = playerPosition;
    const dist = Math.hypot(px - project.pos[0], pz - project.pos[2]);

    if (dist < 2.5) {
      if (!nearbyTarget || nearbyTarget.id !== project.id) {
        setNearbyTarget({
          id: project.id,
          title: `PROJECT // ${project.title.toUpperCase()}`,
          subtitle: `Press [E] to inspect architecture & live demo`,
        });
      }
    } else if (nearbyTarget?.id === project.id) {
      setNearbyTarget(null);
    }
  });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'KeyE') {
        const [px, , pz] = playerPosition;
        const dist = Math.hypot(px - project.pos[0], pz - project.pos[2]);
        if (dist < 2.5) {
          openInspect({
            title: project.title,
            subtitle: `${project.tag} · Tech Showcase`,
            badge: 'FEATURED PROJECT',
            sections: [
              {
                heading: 'Project Overview',
                body: project.description,
              },
              {
                heading: 'Core Technologies',
                body: project.technologies.join(' · '),
              },
              {
                heading: 'Key Architectural Highlights',
                body: project.features.map((f) => `• ${f}`).join('\n'),
              },
              {
                heading: 'Links & Source Code',
                body: `GitHub Repository: ${project.githubUrl}\nLive Demo / World: ${project.liveUrl}`,
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
                label: 'GITHUB SOURCE',
                externalUrl: project.githubUrl,
                emoji: '🐙',
                variant: 'secondary',
              },
              ...(project.liveUrl && project.liveUrl !== '#'
                ? [
                    {
                      label: 'LAUNCH DEMO',
                      externalUrl: project.liveUrl,
                      emoji: '🚀' as const,
                      variant: 'accent' as const,
                    },
                  ]
                : []),
            ],
          });
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [playerPosition, project, openInspect]);

  return (
    <group
      position={project.pos}
      onClick={() => {
        openInspect({
          title: project.title,
          subtitle: `${project.tag} · Tech Showcase`,
          badge: 'FEATURED PROJECT',
          sections: [
            { heading: 'Project Overview', body: project.description },
            { heading: 'Core Technologies', body: project.technologies.join(' · ') },
            { heading: 'Key Architectural Highlights', body: project.features.map((f) => `• ${f}`).join('\n') },
            { heading: 'Links & Source Code', body: `GitHub Repository: ${project.githubUrl}\nLive Demo: ${project.liveUrl}` },
          ],
          actions: [
            {
              label: 'OPEN DEVELOPER PAGE',
              route: '/developer',
              emoji: '💻',
              variant: 'primary',
            },
            {
              label: 'GITHUB SOURCE',
              externalUrl: project.githubUrl,
              emoji: '🐙',
              variant: 'secondary',
            },
            ...(project.liveUrl && project.liveUrl !== '#'
              ? [
                  {
                    label: 'LAUNCH DEMO',
                    externalUrl: project.liveUrl,
                    emoji: '🚀' as const,
                    variant: 'accent' as const,
                  },
                ]
              : []),
          ],
        });
      }}
    >
      {/* Kiosk Pedestal Base */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.65, 0.8, 0.9, 8]} />
          <meshStandardMaterial color="#1e293b" roughness={0.6} />
        </mesh>
      </RigidBody>

      {/* Glowing Ring Rim */}
      <mesh position={[0, 0.92, 0]}>
        <cylinderGeometry args={[0.68, 0.68, 0.08, 16]} />
        <meshStandardMaterial
          color={project.color}
          emissive={project.color}
          emissiveIntensity={0.8}
        />
      </mesh>

      {/* Floating Holographic 3D Icon */}
      <group ref={iconRef} position={[0, 1.9, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          <meshStandardMaterial
            color={project.color}
            emissive={project.color}
            emissiveIntensity={0.5}
            roughness={0.2}
          />
        </mesh>
        <mesh rotation={[0.4, 0.4, 0]}>
          <octahedronGeometry args={[0.38, 0]} />
          <meshStandardMaterial color="#ffffff" roughness={0.1} transparent opacity={0.6} />
        </mesh>
      </group>

      {/* Overhead Billboard Label */}
      <Billboard position={[0, 2.7, 0]}>
        <Text
          fontSize={0.2}
          color="#0f172a"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.03}
          outlineColor="#ffffff"
        >
          {`${project.emoji} ${project.title}`}
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
          [E] INSPECT PROJECT
        </Text>
      </Billboard>
    </group>
  );
}

export default function DeveloperVillage() {
  const { setCurrentArea, playerPosition } = useIslandStore();

  useFrame(() => {
    const [px, , pz] = playerPosition;
    if (Math.hypot(px - (-26), pz - (-2)) < 9) {
      setCurrentArea('DEVELOPER VILLAGE');
    }
  });

  return (
    <group>
      {/* ── Dedicated Entrance Archway at Village Gateway ─────────── */}
      <group position={[-18, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        {/* Arch Pillars */}
        {[-2.2, 2.2].map((x, i) => (
          <mesh key={i} position={[x, 1.8, 0]} castShadow>
            <cylinderGeometry args={[0.2, 0.24, 3.6, 8]} />
            <meshStandardMaterial color="#1e293b" roughness={0.7} />
          </mesh>
        ))}
        {/* Overhead Crossbeam */}
        <mesh position={[0, 3.6, 0]} castShadow>
          <boxGeometry args={[4.8, 0.4, 0.45]} />
          <meshStandardMaterial color="#0284c7" roughness={0.5} />
        </mesh>
        {/* Billboard Welcome Sign */}
        <Billboard position={[0, 4.15, 0]}>
          <Text
            fontSize={0.24}
            color="#0284c7"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.03}
            outlineColor="#ffffff"
          >
            💻 DEVELOPER VILLAGE // STUDIO
          </Text>
        </Billboard>
      </group>

      {/* ── Studio Building Backbone ──────────────────────────────── */}
      <group position={[-26, 0, -8]}>
        <RigidBody type="fixed" colliders="cuboid">
          <mesh position={[0, 2.2, 0]} castShadow receiveShadow>
            <boxGeometry args={[7.2, 4.4, 4.6]} />
            <meshStandardMaterial color="#0f172a" roughness={0.5} />
          </mesh>
        </RigidBody>

        {/* Glowing Studio Sign */}
        <mesh position={[0, 4.6, 2.32]} castShadow>
          <boxGeometry args={[4.2, 0.7, 0.1]} />
          <meshStandardMaterial color="#0284c7" emissive="#38bdf8" emissiveIntensity={0.4} />
        </mesh>
        <Billboard position={[0, 4.6, 2.45]}>
          <Text fontSize={0.28} color="#ffffff" anchorX="center" anchorY="middle">
            SOFTWARE STUDIO // LABS
          </Text>
        </Billboard>

        {/* Modern Cyan Glass Front Windows */}
        {[-2.2, 0, 2.2].map((x, i) => (
          <mesh key={i} position={[x, 2.2, 2.32]}>
            <planeGeometry args={[1.6, 2.4]} />
            <meshStandardMaterial
              color="#38bdf8"
              roughness={0.1}
              metalness={0.9}
              emissive="#0284c7"
              emissiveIntensity={0.2}
            />
          </mesh>
        ))}
      </group>

      {/* ── Cobblestone Courtyard Plaza ────────────────────────────── */}
      <mesh position={[-26, 0.04, -2]} receiveShadow>
        <cylinderGeometry args={[6.8, 6.8, 0.08, 16]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.8} />
      </mesh>

      {/* ── 3 Interactive Project Kiosks ───────────────────────────── */}
      {PORTFOLIO_PROJECTS.map((proj) => (
        <ProjectKiosk key={proj.id} project={proj} />
      ))}

      {/* ── Skill Totem Columns ────────────────────────────────────── */}
      {SKILL_TOTEMS.map((totem, i) => (
        <group key={i} position={totem.pos}>
          <RigidBody type="fixed" colliders="cuboid">
            <mesh position={[0, 1.0, 0]} castShadow>
              <cylinderGeometry args={[0.35, 0.45, 2.0, 6]} />
              <meshStandardMaterial color="#334155" roughness={0.7} />
            </mesh>
          </RigidBody>
          <mesh position={[0, 2.2, 0]}>
            <sphereGeometry args={[0.26, 8, 8]} />
            <meshStandardMaterial
              color={totem.color}
              emissive={totem.color}
              emissiveIntensity={0.6}
            />
          </mesh>
          <Billboard position={[0, 2.7, 0]}>
            <Text fontSize={0.16} color="#0f172a" anchorX="center" anchorY="middle">
              {`${totem.emoji} ${totem.name}`}
            </Text>
          </Billboard>
        </group>
      ))}
    </group>
  );
}
