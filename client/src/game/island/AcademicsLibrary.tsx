/**
 * AcademicsLibrary.tsx — Physically Enterable Neoclassical Academics Library
 *
 * Location: North-East [14, 0, -11] (facing South-West toward Sunshine Plaza)
 * Features:
 * - Neoclassical marble columns, pediment and green copper hipped roof
 * - Open walk-in grand entrance with stone steps
 * - Checkerboard marble floor, grand brass chandelier & study desks
 * - Interactive RTU B.Tech CSE Transcript Podium (Real Roll No, SGPAs & Labs)
 * - Interactive CS Core Curriculum Archive
 * - Floor-to-ceiling mahogany bookshelves
 */
import React, { useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import { Text, Billboard } from '@react-three/drei';
import { useIslandStore } from './useIslandStore';
import * as THREE from 'three';

export default function AcademicsLibrary() {
  const { playerPosition, setNearbyTarget, nearbyTarget, openInspect, setCurrentArea } =
    useIslandStore();

  const LIB_POS = [14, 0, -11] as const;
  const ROT_Y = -0.6; // Facing South-West toward central plaza

  const W = 7.6;
  const H = 3.8;
  const D = 6.4;

  // Local positions inside library
  const PODIUM_LOCAL: [number, number, number] = [0, 0, -1.8];
  const STUDY_LOCAL: [number, number, number] = [-2.0, 0, 0.4];
  const SHELF_LOCAL: [number, number, number] = [2.2, 0, 0.4];

  const toWorld = (local: [number, number, number]): [number, number, number] => [
    LIB_POS[0] + local[0] * Math.cos(ROT_Y) + local[2] * Math.sin(ROT_Y),
    0,
    LIB_POS[2] - local[0] * Math.sin(ROT_Y) + local[2] * Math.cos(ROT_Y),
  ];

  useFrame(() => {
    const [px, , pz] = playerPosition;
    const distToCenter = Math.hypot(px - LIB_POS[0], pz - LIB_POS[2]);

    if (distToCenter < 3.4) {
      setCurrentArea('ACADEMICS LIBRARY');
    }

    const pPos = toWorld(PODIUM_LOCAL);
    const sPos = toWorld(STUDY_LOCAL);
    const shPos = toWorld(SHELF_LOCAL);

    if (Math.hypot(px - pPos[0], pz - pPos[2]) < 2.8) {
      if (!nearbyTarget || nearbyTarget.id !== 'lib_podium') {
        setNearbyTarget({
          id: 'lib_podium',
          title: 'RTU B.TECH CSE TRANSCRIPTS',
          subtitle: 'Press [E] to inspect verified grades, SGPAs & roll number',
        });
      }
    } else if (Math.hypot(px - sPos[0], pz - sPos[2]) < 2.8) {
      if (!nearbyTarget || nearbyTarget.id !== 'lib_study') {
        setNearbyTarget({
          id: 'lib_study',
          title: 'CS CURRICULUM ARCHIVE',
          subtitle: 'Press [E] to review core algorithms, OOP & systems notes',
        });
      }
    } else if (Math.hypot(px - shPos[0], pz - shPos[2]) < 2.8) {
      if (!nearbyTarget || nearbyTarget.id !== 'lib_shelves') {
        setNearbyTarget({
          id: 'lib_shelves',
          title: 'ENGINEERING BOOKSHELVES',
          subtitle: 'Press [E] to inspect academic reference texts',
        });
      }
    } else if (
      nearbyTarget?.id === 'lib_podium' ||
      nearbyTarget?.id === 'lib_study' ||
      nearbyTarget?.id === 'lib_shelves'
    ) {
      setNearbyTarget(null);
    }
  });

  // Handle [E] key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'KeyE') {
        const [px, , pz] = playerPosition;
        const pPos = toWorld(PODIUM_LOCAL);
        const sPos = toWorld(STUDY_LOCAL);
        const shPos = toWorld(SHELF_LOCAL);

        if (Math.hypot(px - pPos[0], pz - pPos[2]) < 2.8) {
          openInspect({
            title: 'RAJASTHAN TECHNICAL UNIVERSITY (RTU)',
            subtitle: 'Arya College of Engineering & IT · B.Tech Computer Science & Engineering',
            badge: 'OFFICIAL ACADEMIC RECORD',
            sections: [
              {
                heading: 'Student Credentials',
                body: '• Full Name: AYushMan (Ayushman Pathak)\n• University Roll No: 24EARCS003\n• Enrollment No: 24E1ARCSM40P003\n• Branch: Computer Science & Engineering\n• College: Arya College of Engg. & IT, Jaipur (Kukas)',
              },
              {
                heading: 'Semester 1 Results (SGPA 8.42 - PASS)',
                body: '• Total Credits: 21 | Status: PASS\n• Programming For Problem Solving: Grade A+\n• Computer Programming Lab: Grade A++\n• Engineering Physics Lab: Grade A++\n• Basic Electrical Engineering Lab: Grade A++\n• Machine Drawing Lab: Grade A++',
              },
              {
                heading: 'Semester 2 Results (SGPA 8.55 - PASS)',
                body: '• Total Credits: 21 | Status: PASS\n• Manufacturing Practices Workshop: Grade A++\n• Basic Civil Engineering Lab: Grade A++\n• Human Values Activities & Sports: Grade A++\n• Computer Aided Engineering Graphics: Grade A+\n• Engineering Chemistry Lab: Grade A+',
              },
              {
                heading: 'Semester 3 Highlights (SGPA 8.28 - PASS)',
                body: '• Total Credits: 24 | Status: PASS\n• Object Oriented Programming: Grade A++\n• OOP Lab & DSA Lab: Grade A+\n• Data Structures & Algorithms: Grade C\n• Software Engineering: Grade B\n• Industrial Training: Grade A',
              },
            ],
            actions: [
              { label: 'OPEN ACADEMICS PAGE', route: '/academics', emoji: '🎓', variant: 'primary' },
              { label: 'VIEW ALL COURSES & LABS', route: '/academics', emoji: '📜', variant: 'secondary' },
            ],
          });
        } else if (Math.hypot(px - sPos[0], pz - sPos[2]) < 1.8) {
          openInspect({
            title: 'COMPUTER SCIENCE CORE CURRICULUM',
            subtitle: 'Key Theoretical Concepts & Lab Implementations',
            badge: 'ENGINEERING STUDY',
            sections: [
              {
                heading: 'Core Subjects Mastered',
                body: '• Data Structures & Algorithms: Trees, Graphs, Hash Tables, Dynamic Programming\n• Object-Oriented Programming: Inheritance, Encapsulation, Polymorphism in C++\n• Database Systems: SQL Schema Normalization, Indexes, ACID Transactions\n• Operating Systems & Compilers: Concurrency, Virtual Memory, Process Trees',
              },
            ],
            actions: [
              { label: 'OPEN ACADEMICS PAGE', route: '/academics', emoji: '📚', variant: 'primary' },
            ],
          });
        } else if (Math.hypot(px - shPos[0], pz - shPos[2]) < 1.8) {
          openInspect({
            title: 'REFERENCE TEXT ARCHIVE',
            subtitle: 'Foundational Engineering Literature',
            badge: 'LIBRARY ARCHIVE',
            sections: [
              {
                heading: 'Recommended Textbooks',
                body: '• Introduction to Algorithms (CLRS)\n• Operating System Concepts (Silberschatz)\n• Designing Data-Intensive Applications (Kleppmann)\n• Computer Systems: A Programmer’s Perspective (Bryant & O’Hallaron)',
              },
            ],
            actions: [
              { label: 'ACADEMICS HUB', route: '/academics', emoji: '📖', variant: 'primary' },
            ],
          });
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [playerPosition, openInspect]);

  return (
    <group position={LIB_POS} rotation={[0, ROT_Y, 0]}>
      {/* ── Floor & Classical Porch ───────────────────────────────── */}
      {/* Marble Interior Floor */}
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <boxGeometry args={[W - 0.2, 0.1, D - 0.2]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.4} />
      </mesh>

      {/* Front Stone Steps & Porch (facing South-West toward plaza) */}
      <mesh position={[0, 0.05, D / 2 + 1.0]} receiveShadow>
        <boxGeometry args={[5.0, 0.1, 2.0]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.7} />
      </mesh>

      {/* Front Plaque Sign */}
      <Billboard position={[0, H + 0.4, D / 2 + 0.2]}>
        <Text
          fontSize={0.24}
          color="#0f766e"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.03}
          outlineColor="#ffffff"
        >
          ACADEMICS LIBRARY
        </Text>
      </Billboard>

      {/* ── Collidable Wall Enclosure with Open Doorway ───────────── */}
      <RigidBody type="fixed" colliders={false}>
        {/* Back Wall */}
        <CuboidCollider args={[W / 2, H / 2, 0.15]} position={[0, H / 2, -D / 2]} />
        <mesh position={[0, H / 2, -D / 2]} castShadow receiveShadow>
          <boxGeometry args={[W, H, 0.22]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.5} />
        </mesh>

        {/* Left Wall */}
        <CuboidCollider args={[0.15, H / 2, D / 2]} position={[-W / 2, H / 2, 0]} />
        <mesh position={[-W / 2, H / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.22, H, D]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.5} />
        </mesh>

        {/* Right Wall */}
        <CuboidCollider args={[0.15, H / 2, D / 2]} position={[W / 2, H / 2, 0]} />
        <mesh position={[W / 2, H / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.22, H, D]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.5} />
        </mesh>

        {/* Front Wall Left Segment */}
        <CuboidCollider args={[(W / 2 - 1.0) / 2, H / 2, 0.15]} position={[-W / 4 - 0.5, H / 2, D / 2]} />
        <mesh position={[-W / 4 - 0.5, H / 2, D / 2]} castShadow receiveShadow>
          <boxGeometry args={[W / 2 - 1.0, H, 0.22]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.5} />
        </mesh>

        {/* Front Wall Right Segment */}
        <CuboidCollider args={[(W / 2 - 1.0) / 2, H / 2, 0.15]} position={[W / 4 + 0.5, H / 2, D / 2]} />
        <mesh position={[W / 4 + 0.5, H / 2, D / 2]} castShadow receiveShadow>
          <boxGeometry args={[W / 2 - 1.0, H, 0.22]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.5} />
        </mesh>

        {/* Front Doorway Arch / Lintel */}
        <CuboidCollider args={[1.0, 0.4, 0.15]} position={[0, H - 0.4, D / 2]} />
        <mesh position={[0, H - 0.4, D / 2]} castShadow>
          <boxGeometry args={[2.0, 0.8, 0.22]} />
          <meshStandardMaterial color="#0f766e" roughness={0.5} />
        </mesh>
      </RigidBody>

      {/* ── 4 Classical Marble Columns at Front Porch ─────────────── */}
      {[-2.0, -0.7, 0.7, 2.0].map((cx, i) => (
        <mesh key={i} position={[cx, 1.4, D / 2 + 1.6]} castShadow>
          <cylinderGeometry args={[0.18, 0.22, 2.8, 12]} />
          <meshStandardMaterial color="#f1f5f9" roughness={0.4} />
        </mesh>
      ))}

      {/* Pediment Triangular Roof Trim */}
      <RigidBody type="fixed" colliders="hull">
        <mesh position={[0, H + 0.8, 0]} castShadow>
          <boxGeometry args={[W + 0.8, 0.6, D + 0.8]} />
          <meshStandardMaterial color="#0f766e" roughness={0.6} />
        </mesh>
      </RigidBody>

      {/* ── Interior Lighting (Grand Brass Chandelier) ───────────── */}
      <pointLight position={[0, H - 0.6, 0]} color="#fef08a" intensity={1.2} distance={8} />

      {/* ── Center Stage: RTU Transcript Podium ──────────────────── */}
      <group position={PODIUM_LOCAL}>
        <mesh position={[0, 0.65, 0]} castShadow>
          <cylinderGeometry args={[0.45, 0.55, 1.3, 12]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.4} />
        </mesh>
        {/* Glowing Parchment Transcript */}
        <mesh position={[0, 1.35, 0]} rotation={[-0.3, 0, 0]}>
          <boxGeometry args={[0.9, 0.6, 0.06]} />
          <meshStandardMaterial
            color="#fef08a"
            emissive="#fef08a"
            emissiveIntensity={0.6}
            roughness={0.3}
          />
        </mesh>
        <Billboard position={[0, 2.0, 0]}>
          <Text fontSize={0.16} color="#0f766e" outlineWidth={0.02} outlineColor="#ffffff">
            [E] RTU CSE TRANSCRIPTS
          </Text>
        </Billboard>
      </group>

      {/* ── Study Desk with Banker's Lamp (Left Side) ─────────────── */}
      <group position={STUDY_LOCAL}>
        <mesh position={[0, 0.75, 0]} castShadow>
          <boxGeometry args={[1.6, 0.08, 0.8]} />
          <meshStandardMaterial color="#78350f" roughness={0.6} />
        </mesh>
        {/* Desk Legs */}
        {[-0.7, 0.7].map((dx, di) => (
          <mesh key={di} position={[dx, 0.37, 0]}>
            <boxGeometry args={[0.08, 0.74, 0.7]} />
            <meshStandardMaterial color="#334155" />
          </mesh>
        ))}
        {/* Emerald Banker Lamp */}
        <mesh position={[0.5, 0.95, -0.2]}>
          <cylinderGeometry args={[0.06, 0.1, 0.3, 8]} />
          <meshStandardMaterial color="#059669" emissive="#059669" emissiveIntensity={0.8} />
        </mesh>
        <Billboard position={[0, 1.45, 0]}>
          <Text fontSize={0.14} color="#059669" outlineWidth={0.02} outlineColor="#ffffff">
            [E] CS CURRICULUM
          </Text>
        </Billboard>
      </group>

      {/* ── Floor-to-Ceiling Bookshelves (Right Wall) ──────────────── */}
      <group position={SHELF_LOCAL} rotation={[0, -Math.PI / 2, 0]}>
        <mesh position={[0, 1.5, 0]} castShadow>
          <boxGeometry args={[2.2, 2.8, 0.45]} />
          <meshStandardMaterial color="#451a03" roughness={0.7} />
        </mesh>
        {/* Book stacks */}
        {[-0.8, -0.3, 0.2, 0.7].map((bx, bi) => (
          <mesh key={bi} position={[bx, 1.5, 0.12]}>
            <boxGeometry args={[0.35, 2.2, 0.22]} />
            <meshStandardMaterial color={['#0f766e', '#b45309', '#1e293b', '#dc2626'][bi]} />
          </mesh>
        ))}
        <Billboard position={[0, 3.1, 0]}>
          <Text fontSize={0.14} color="#38bdf8" outlineWidth={0.02} outlineColor="#000000">
            [E] BOOKSHELVES
          </Text>
        </Billboard>
      </group>
    </group>
  );
}
