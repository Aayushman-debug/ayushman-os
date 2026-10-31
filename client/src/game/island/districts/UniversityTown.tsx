/**
 * UniversityTown.tsx — Academics, Engineering Transcripts & Campus Quad
 *
 * Location: North-East [26, 0, -20]
 * Features:
 * - Grand Neoclassical Academic Hall with white columns and clock tower
 * - Interactive Transcript Podium (RTU CSE B.Tech Records, SGPAs & Labs)
 * - Graduation Cap Monument and collegiate courtyard benches
 */
import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';
import { Text, Billboard } from '@react-three/drei';
import { useIslandStore } from '../useIslandStore';
import * as THREE from 'three';

export default function UniversityTown() {
  const { setCurrentArea, playerPosition, setNearbyTarget, nearbyTarget, openInspect } =
    useIslandStore();
  const capRef = useRef<THREE.Group>(null);

  const CAMPUS_POS = [26, 0, -20] as const;
  const PODIUM_POS = [26, 0, -15] as const;

  useFrame(({ clock }) => {
    // Gentle rotation of the graduation cap monument
    if (capRef.current) {
      capRef.current.rotation.y = clock.getElapsedTime() * 0.8;
      capRef.current.position.y = 2.4 + Math.sin(clock.getElapsedTime() * 2) * 0.08;
    }

    const [px, , pz] = playerPosition;
    if (Math.hypot(px - CAMPUS_POS[0], pz - CAMPUS_POS[2]) < 11) {
      setCurrentArea('UNIVERSITY TOWN');
    }

    // Proximity to Transcript Podium
    const distToPodium = Math.hypot(px - PODIUM_POS[0], pz - PODIUM_POS[2]);
    if (distToPodium < 2.5) {
      if (!nearbyTarget || nearbyTarget.id !== 'academic_podium') {
        setNearbyTarget({
          id: 'academic_podium',
          title: 'ACADEMIC TRANSCRIPTS',
          subtitle: 'Press [E] to view RTU B.Tech CSE performance & courses',
        });
      }
    } else if (nearbyTarget?.id === 'academic_podium') {
      setNearbyTarget(null);
    }
  });

  // Handle [E] key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'KeyE') {
        const [px, , pz] = playerPosition;
        if (Math.hypot(px - PODIUM_POS[0], pz - PODIUM_POS[2]) < 2.5) {
          openInspect({
            title: 'RAJASTHAN TECHNICAL UNIVERSITY (RTU)',
            subtitle: 'Arya College of Engineering & IT · B.Tech in CSE',
            badge: 'ACADEMIC RECORD',
            sections: [
              {
                heading: 'Institution & Degree Profile',
                body: '• Degree: Bachelor of Technology (B.Tech)\n• Department: Computer Science & Engineering (CSE)\n• University: Rajasthan Technical University, Kota\n• College: Arya College of Engineering & Information Technology, Jaipur\n• University Roll No: 24EARCS003 · Enrollment: 24E1ARCSM40P003',
              },
              {
                heading: 'Semester Academic Performance',
                body: '• Semester 1: SGPA 8.42 (PASS - First Class Distinction)\n• Semester 2: SGPA 8.55 (PASS - First Class Distinction)\n• Semester 3 & 4: Core Engineering Labs & DS/Algo distinction\n• Semester 5 (Current): Active Workspace',
              },
              {
                heading: 'Secondary & High School Foundations',
                body: '• Class 10 (Secondary): St. Xavier High School (CBSE) — 92.40%\n• Class 12 (Senior Secondary): Senior Secondary Public School (CBSE) — 88.60%',
              },
              {
                heading: 'Core Computer Science Disciplines',
                body: '• Systems: Operating Systems, Computer Networks, Linux Shell\n• Software: Compiler Design, DBMS, OOP in Java, Information Theory\n• Algorithmic: Data Structures & Algorithms, Programming for Problem Solving',
              },
            ],
            actions: [
              {
                label: 'OPEN ACADEMICS PAGE',
                route: '/academics',
                emoji: '🎓',
                variant: 'primary',
              },
              {
                label: 'RETURN TO CLASSIC PORTFOLIO',
                route: '/landing',
                emoji: '🏠',
                variant: 'secondary',
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
    <group position={CAMPUS_POS}>
      {/* ── Grand University Academic Hall ─────────────────────────── */}
      <group position={[0, 0, -5]}>
        {/* Main Brick Hall */}
        <RigidBody type="fixed" colliders="cuboid">
          <mesh position={[0, 3.2, 0]} castShadow receiveShadow>
            <boxGeometry args={[11.5, 6.4, 5.2]} />
            <meshStandardMaterial color="#991b1b" roughness={0.7} />
          </mesh>
        </RigidBody>

        {/* Grand Portico / Pediment Roof */}
        <mesh position={[0, 6.8, 1.2]} rotation={[0, Math.PI / 4, 0]} castShadow>
          <coneGeometry args={[4.2, 2.0, 4]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.4} />
        </mesh>

        {/* Neoclassical White Stone Pillars */}
        {[-3.6, -1.8, 0, 1.8, 3.6].map((x, i) => (
          <mesh key={i} position={[x, 2.8, 2.8]} castShadow>
            <cylinderGeometry args={[0.3, 0.35, 5.6, 12]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.3} />
          </mesh>
        ))}

        {/* Central Clock Tower on Roof */}
        <mesh position={[0, 7.8, 0]} castShadow>
          <boxGeometry args={[2.4, 2.8, 2.4]} />
          <meshStandardMaterial color="#7f1d1d" roughness={0.6} />
        </mesh>
        {/* Clock Face */}
        <mesh position={[0, 7.8, 1.22]}>
          <circleGeometry args={[0.7, 16]} />
          <meshStandardMaterial color="#ffffff" roughness={0.2} />
        </mesh>
        {/* Clock Tower Roof Cap */}
        <mesh position={[0, 9.8, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
          <coneGeometry args={[2.0, 1.6, 4]} />
          <meshStandardMaterial color="#0284c7" roughness={0.4} />
        </mesh>

        {/* Hall Banner */}
        <Billboard position={[0, 5.2, 2.9]}>
          <Text fontSize={0.32} color="#0f172a" anchorX="center" anchorY="middle">
            RTU CSE // ACADEMIC HALL
          </Text>
        </Billboard>
      </group>

      {/* ── Collegiate Courtyard Quad ──────────────────────────────── */}
      <mesh position={[0, 0.04, 5]} receiveShadow>
        <boxGeometry args={[14, 0.08, 14]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.8} />
      </mesh>

      {/* Courtyard Lawn Ring */}
      <mesh position={[0, 0.05, 5]} receiveShadow>
        <ringGeometry args={[2.2, 5.2, 16]} />
        <meshStandardMaterial color="#4ade80" roughness={0.9} />
      </mesh>

      {/* Collegiate Campus Benches */}
      {[-5.4, 5.4].map((x, i) => (
        <group key={`quad-bench-${i}`} position={[x, 0, 5]} rotation={[0, i === 0 ? Math.PI / 2 : -Math.PI / 2, 0]}>
          <mesh position={[0, 0.45, 0]} castShadow>
            <boxGeometry args={[1.6, 0.08, 0.55]} />
            <meshStandardMaterial color="#78350f" roughness={0.8} />
          </mesh>
          <mesh position={[0, 0.85, -0.24]} rotation={[0.15, 0, 0]} castShadow>
            <boxGeometry args={[1.6, 0.55, 0.06]} />
            <meshStandardMaterial color="#78350f" roughness={0.8} />
          </mesh>
          {[-0.7, 0.7].map((lx, li) => (
            <mesh key={li} position={[lx, 0.22, 0]}>
              <boxGeometry args={[0.08, 0.44, 0.48]} />
              <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.3} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Campus Classical Lampposts */}
      {[-5.6, 5.6].map((x, i) => (
        <group key={`quad-lamp-${i}`} position={[x, 0, 10.5]}>
          <mesh position={[0, 1.4, 0]} castShadow>
            <cylinderGeometry args={[0.06, 0.08, 2.8, 6]} />
            <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.3} />
          </mesh>
          <mesh position={[0, 2.9, 0]} castShadow>
            <boxGeometry args={[0.38, 0.48, 0.38]} />
            <meshStandardMaterial color="#0f172a" metalness={0.8} />
          </mesh>
          <mesh position={[0, 2.9, 0]}>
            <sphereGeometry args={[0.16, 8, 8]} />
            <meshStandardMaterial color="#fef08a" emissive="#fbbf24" emissiveIntensity={1.4} />
          </mesh>
        </group>
      ))}

      {/* ── Interactive Transcript Podium in Quad Center ───────────── */}
      <group
        position={[0, 0, 5]}
        onClick={() => {
          openInspect({
            title: 'RAJASTHAN TECHNICAL UNIVERSITY (RTU)',
            subtitle: 'Arya College of Engineering & IT · B.Tech in CSE',
            badge: 'ACADEMIC RECORD',
            sections: [
              {
                heading: 'Institution & Degree Profile',
                body: '• Degree: Bachelor of Technology (B.Tech)\n• Department: Computer Science & Engineering (CSE)\n• University: Rajasthan Technical University, Kota\n• College: Arya College of Engineering & IT, Jaipur\n• University Roll No: 24EARCS003 · Enrollment: 24E1ARCSM40P003',
              },
              {
                heading: 'Semester Academic Performance',
                body: '• Semester 1: SGPA 8.42 (PASS - First Class Distinction)\n• Semester 2: SGPA 8.55 (PASS - First Class Distinction)\n• Semester 3 & 4: Core Engineering Labs & DS/Algo distinction\n• Semester 5 (Current): Active Workspace',
              },
              {
                heading: 'Secondary & High School Foundations',
                body: '• Class 10: St. Xavier High School (CBSE) — 92.40%\n• Class 12: Senior Secondary Public School (CBSE) — 88.60%',
              },
              {
                heading: 'Core Computer Science Disciplines',
                body: '• Systems: Operating Systems, Computer Networks, Linux Shell\n• Software: Compiler Design, DBMS, OOP in Java, Information Theory\n• Algorithmic: Data Structures & Algorithms, Programming for Problem Solving',
              },
            ],
            actions: [
              {
                label: 'OPEN ACADEMICS PAGE',
                route: '/academics',
                emoji: '🎓',
                variant: 'primary',
              },
              {
                label: 'RETURN TO CLASSIC PORTFOLIO',
                route: '/landing',
                emoji: '🏠',
                variant: 'secondary',
              },
            ],
          });
        }}
      >
        {/* Stone Pedestal */}
        <RigidBody type="fixed" colliders="cuboid">
          <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.7, 0.85, 1.0, 8]} />
            <meshStandardMaterial color="#334155" roughness={0.7} />
          </mesh>
        </RigidBody>

        {/* Open Golden Book / Diploma Plaque on Top */}
        <mesh position={[0, 1.05, 0]} rotation={[-0.3, 0, 0]} castShadow>
          <boxGeometry args={[0.9, 0.08, 0.65]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.6} roughness={0.3} />
        </mesh>

        {/* Floating Graduation Cap Monument */}
        <group ref={capRef} position={[0, 2.4, 0]}>
          {/* Cap Diamond Top */}
          <mesh rotation={[0, Math.PI / 4, 0]} castShadow>
            <boxGeometry args={[0.85, 0.05, 0.85]} />
            <meshStandardMaterial color="#1e293b" roughness={0.4} />
          </mesh>
          {/* Cap Skull Cup */}
          <mesh position={[0, -0.15, 0]} castShadow>
            <cylinderGeometry args={[0.26, 0.28, 0.3, 12]} />
            <meshStandardMaterial color="#1e293b" roughness={0.4} />
          </mesh>
          {/* Tassel */}
          <mesh position={[0.3, -0.22, 0.3]}>
            <cylinderGeometry args={[0.03, 0.05, 0.35, 6]} />
            <meshStandardMaterial color="#f59e0b" roughness={0.6} />
          </mesh>
        </group>

        {/* Billboard Prompt */}
        <Billboard position={[0, 3.2, 0]}>
          <Text
            fontSize={0.2}
            color="#991b1b"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.03}
            outlineColor="#ffffff"
          >
            🎓 RTU CSE TRANSCRIPTS
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
            [E] VIEW COURSEWORK & GRADES
          </Text>
        </Billboard>
      </group>
    </group>
  );
}
