/**
 * SocialHarbour.tsx — Identity, Social Links & Direct Contact Beacon
 *
 * Location: South-West Coast [-24, 0, 22]
 * Features:
 * - Coastal dock pier with anchored boat and ocean lampposts
 * - Interactive Social Telegraph Hub (GitHub, Instagram, Spotify, Email)
 * - Interactive Guestbook / Contact Message Beacon
 */
import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';
import { Text, Billboard } from '@react-three/drei';
import { useIslandStore } from '../useIslandStore';
import { islandAudio } from '../islandAudio';
import * as THREE from 'three';

const SOCIAL_LINKS = [
  {
    name: 'GitHub',
    handle: '@Aayushman-debug',
    url: 'https://github.com/Aayushman-debug',
    emoji: '🐙',
    color: '#0f172a',
  },
  {
    name: 'Instagram',
    handle: '@wtfk1yo',
    url: 'https://www.instagram.com/wtfk1yo/',
    emoji: '📸',
    color: '#e11d48',
  },
  {
    name: 'Spotify',
    handle: 'AYushMan',
    url: 'https://open.spotify.com/user/31r367fhbny2hd3bdbyo5q3vvjlu',
    emoji: '🎧',
    color: '#10b981',
  },
  {
    name: 'Email & Inquiries',
    handle: 'pathakaayushman57@gmail.com',
    url: 'mailto:pathakaayushman57@gmail.com',
    emoji: '✉️',
    color: '#0284c7',
  },
];

export default function SocialHarbour() {
  const { setCurrentArea, playerPosition, setNearbyTarget, nearbyTarget, openInspect } =
    useIslandStore();
  const buoyRef = useRef<THREE.Group>(null);
  const HARBOUR_POS = [-24, 0, 22] as const;
  const BEACON_POS = [-24, 0, 20] as const;

  useFrame(({ clock }) => {
    // Gentle floating buoy bob
    if (buoyRef.current) {
      buoyRef.current.position.y = 0.4 + Math.sin(clock.getElapsedTime() * 2) * 0.08;
      buoyRef.current.rotation.z = Math.sin(clock.getElapsedTime() * 1.5) * 0.1;
    }

    const [px, , pz] = playerPosition;
    if (Math.hypot(px - HARBOUR_POS[0], pz - HARBOUR_POS[2]) < 10) {
      setCurrentArea('SOCIAL HARBOUR');
    }

    const distToBeacon = Math.hypot(px - BEACON_POS[0], pz - BEACON_POS[2]);
    if (distToBeacon < 2.5) {
      if (!nearbyTarget || nearbyTarget.id !== 'social_beacon') {
        setNearbyTarget({
          id: 'social_beacon',
          title: 'COMMUNICATIONS HARBOUR',
          subtitle: 'Press [E] to connect on GitHub, socials or send a message',
        });
      }
    } else if (nearbyTarget?.id === 'social_beacon') {
      setNearbyTarget(null);
    }
  });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'KeyE') {
        const [px, , pz] = playerPosition;
        if (Math.hypot(px - BEACON_POS[0], pz - BEACON_POS[2]) < 2.5) {
          islandAudio.playChime(660);
          openInspect({
            title: 'SOCIAL HARBOUR & IDENTITY',
            subtitle: 'Direct Channels, Developer Networks & Contacts',
            badge: 'COMMUNICATION BEACON',
            sections: [
              {
                heading: 'Social Profiles & Developer Networks',
                body: SOCIAL_LINKS.map(
                  (s) => `${s.emoji} ${s.name}: ${s.handle}\n   ${s.url}`
                ).join('\n\n'),
              },
              {
                heading: 'Direct Email & Collaboration',
                body: '• Primary Inquiries: pathakaayushman57@gmail.com\n• Location: Jaipur, Rajasthan, India\n• Open for: Real-time 3D web engineering, distributed systems, full-stack development, and agentic workflows.',
              },
            ],
            actions: [
              {
                label: 'OPEN SOCIAL HUB',
                route: '/social',
                emoji: '🌐',
                variant: 'primary',
              },
              {
                label: 'GITHUB PROFILE',
                externalUrl: 'https://github.com/Aayushman-debug',
                emoji: '🐙',
                variant: 'secondary',
              },
              {
                label: 'INSTAGRAM PROFILE',
                externalUrl: 'https://www.instagram.com/wtfk1yo/',
                emoji: '📸',
                variant: 'secondary',
              },
              {
                label: 'SEND EMAIL',
                externalUrl: 'mailto:pathakaayushman57@gmail.com',
                emoji: '✉️',
                variant: 'accent',
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
    <group position={HARBOUR_POS}>
      {/* ── Wooden Harbour Pier ────────────────────────────────────── */}
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <boxGeometry args={[6.5, 0.1, 9.5]} />
        <meshStandardMaterial color="#92400e" roughness={0.8} />
      </mesh>

      {/* Mooring Posts */}
      {[-3.0, 3.0].map((x, i) =>
        [-4.2, -1.4, 1.4, 4.2].map((z, j) => (
          <mesh key={`${i}-${j}`} position={[x, 0.5, z]} castShadow>
            <cylinderGeometry args={[0.12, 0.14, 0.9, 8]} />
            <meshStandardMaterial color="#451a03" roughness={0.9} />
          </mesh>
        ))
      )}

      {/* ── Floating Bloxburg Dinghy / Boat ────────────────────────── */}
      <group position={[4.6, 0.1, 0]} rotation={[0, 0.2, 0]}>
        {/* Boat Hull */}
        <mesh castShadow>
          <boxGeometry args={[1.6, 0.65, 3.6]} />
          <meshStandardMaterial color="#0284c7" roughness={0.5} />
        </mesh>
        {/* White Trim */}
        <mesh position={[0, 0.35, 0]}>
          <boxGeometry args={[1.7, 0.12, 3.7]} />
          <meshStandardMaterial color="#ffffff" roughness={0.4} />
        </mesh>
        {/* Wooden Seat Bench */}
        <mesh position={[0, 0.2, 0]}>
          <boxGeometry args={[1.4, 0.08, 0.6]} />
          <meshStandardMaterial color="#78350f" roughness={0.8} />
        </mesh>
      </group>

      {/* ── Harbour Master Shed / Boathouse ───────────────────────── */}
      <group position={[-3.6, 0, -4.5]}>
        <RigidBody type="fixed" colliders="cuboid">
          <mesh position={[0, 1.4, 0]} castShadow receiveShadow>
            <boxGeometry args={[3.2, 2.8, 3.2]} />
            <meshStandardMaterial color="#0369a1" roughness={0.6} />
          </mesh>
        </RigidBody>
        {/* Pitched Roof */}
        <mesh position={[0, 3.2, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
          <coneGeometry args={[2.6, 1.2, 4]} />
          <meshStandardMaterial color="#b45309" roughness={0.7} />
        </mesh>
        {/* Sign */}
        <Billboard position={[0, 2.3, 1.65]}>
          <Text fontSize={0.18} color="#ffffff" anchorX="center" anchorY="middle">
            ⚓ HARBOUR OFFICE
          </Text>
        </Billboard>
      </group>

      {/* Dock Cargo Crates */}
      <group position={[2.4, 0.4, -3.2]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.8, 0.8, 0.8]} />
          <meshStandardMaterial color="#78350f" roughness={0.8} />
        </mesh>
        <mesh position={[0.4, 0.8, 0]} rotation={[0, 0.3, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.7, 0.7, 0.7]} />
          <meshStandardMaterial color="#92400e" roughness={0.8} />
        </mesh>
      </group>

      {/* ── Communication Beacon Terminal in Harbour Center ─────────── */}
      <group
        position={[0, 0, -2]}
        onClick={() => {
          islandAudio.playChime(660);
          openInspect({
            title: 'SOCIAL HARBOUR & IDENTITY',
            subtitle: 'Direct Channels, Developer Networks & Contacts',
            badge: 'COMMUNICATION BEACON',
            sections: [
              {
                heading: 'Social Profiles & Developer Networks',
                body: SOCIAL_LINKS.map(
                  (s) => `${s.emoji} ${s.name}: ${s.handle}\n   ${s.url}`
                ).join('\n\n'),
              },
              {
                heading: 'Direct Email & Collaboration',
                body: '• Primary Inquiries: pathakaayushman57@gmail.com\n• Location: Jaipur, Rajasthan, India\n• Open for: Real-time 3D web engineering, distributed systems, and agentic workflows.',
              },
            ],
            actions: [
              {
                label: 'OPEN SOCIAL HUB',
                route: '/social',
                emoji: '🌐',
                variant: 'primary',
              },
              {
                label: 'GITHUB PROFILE',
                externalUrl: 'https://github.com/Aayushman-debug',
                emoji: '🐙',
                variant: 'secondary',
              },
              {
                label: 'INSTAGRAM PROFILE',
                externalUrl: 'https://www.instagram.com/wtfk1yo/',
                emoji: '📸',
                variant: 'secondary',
              },
              {
                label: 'SEND EMAIL',
                externalUrl: 'mailto:pathakaayushman57@gmail.com',
                emoji: '✉️',
                variant: 'accent',
              },
            ],
          });
        }}
      >
        {/* Stone Pedestal */}
        <RigidBody type="fixed" colliders="cuboid">
          <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.4, 1.2, 0.8]} />
            <meshStandardMaterial color="#1e293b" roughness={0.6} />
          </mesh>
        </RigidBody>

        {/* Holographic Radio Mast */}
        <mesh position={[0, 1.8, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.06, 1.4, 6]} />
          <meshStandardMaterial color="#64748b" metalness={0.8} />
        </mesh>

        {/* Glowing Beacon Orb on Top */}
        <mesh position={[0, 2.5, 0]}>
          <sphereGeometry args={[0.22, 12, 12]} />
          <meshStandardMaterial
            color="#38bdf8"
            emissive="#0284c7"
            emissiveIntensity={0.8}
            roughness={0.2}
          />
        </mesh>

        {/* Billboard Prompt */}
        <Billboard position={[0, 3.1, 0]}>
          <Text
            fontSize={0.2}
            color="#0284c7"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.03}
            outlineColor="#ffffff"
          >
            📡 SOCIAL BEACON
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
            [E] GITHUB, SOCIALS & EMAIL
          </Text>
        </Billboard>
      </group>
    </group>
  );
}
