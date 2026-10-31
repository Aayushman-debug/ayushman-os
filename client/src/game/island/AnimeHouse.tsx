/**
 * AnimeHouse.tsx — Physically Enterable Japanese-Modern Anime & Manga Lounge
 *
 * Location: North [0, 0, -18] (facing South toward Sunshine Plaza)
 * Features:
 * - Traditional & modern Japanese aesthetic with dark cedar beams & shoji walls
 * - Open walk-in doorway with red paper lanterns and wooden engawa porch
 * - Tatami-style floor and warm paper lantern interior light
 * - Interactive Anime Vault (Attack on Titan, One Piece, Naruto, Steins;Gate)
 * - Interactive Manga & Light Novel Archive
 * - Low tea table with cushions and aesthetic scrolls
 */
import React, { useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import { Text, Billboard } from '@react-three/drei';
import { useIslandStore } from './useIslandStore';
import * as THREE from 'three';

export default function AnimeHouse() {
  const { playerPosition, setNearbyTarget, nearbyTarget, openInspect, setCurrentArea } =
    useIslandStore();

  const HOUSE_POS = [0, 0, -18] as const;
  const ROT_Y = 0; // Facing South toward central plaza

  const W = 7.2;
  const H = 3.4;
  const D = 6.2;

  // Local positions inside Anime House
  const VAULT_LOCAL: [number, number, number] = [0, 0, -1.8];
  const MANGA_LOCAL: [number, number, number] = [2.2, 0, 0.4];
  const TEA_LOCAL: [number, number, number] = [-1.8, 0, 0.4];

  const toWorld = (local: [number, number, number]): [number, number, number] => [
    HOUSE_POS[0] + local[0] * Math.cos(ROT_Y) + local[2] * Math.sin(ROT_Y),
    0,
    HOUSE_POS[2] - local[0] * Math.sin(ROT_Y) + local[2] * Math.cos(ROT_Y),
  ];

  useFrame(() => {
    const [px, , pz] = playerPosition;
    const distToCenter = Math.hypot(px - HOUSE_POS[0], pz - HOUSE_POS[2]);

    if (distToCenter < 3.4) {
      setCurrentArea('ANIME & MANGA LOUNGE');
    }

    const vPos = toWorld(VAULT_LOCAL);
    const mPos = toWorld(MANGA_LOCAL);
    const tPos = toWorld(TEA_LOCAL);

    if (Math.hypot(px - vPos[0], pz - vPos[2]) < 2.8) {
      if (!nearbyTarget || nearbyTarget.id !== 'anime_vault') {
        setNearbyTarget({
          id: 'anime_vault',
          title: 'ANIME WATCHLIST & REVIEWS',
          subtitle: 'Press [E] to browse curated anime ratings & favorites',
        });
      }
    } else if (Math.hypot(px - mPos[0], pz - mPos[2]) < 2.8) {
      if (!nearbyTarget || nearbyTarget.id !== 'anime_manga') {
        setNearbyTarget({
          id: 'anime_manga',
          title: 'MANGA & LIGHT NOVEL ARCHIVE',
          subtitle: 'Press [E] to inspect manga library & ongoing reads',
        });
      }
    } else if (Math.hypot(px - tPos[0], pz - tPos[2]) < 2.8) {
      if (!nearbyTarget || nearbyTarget.id !== 'anime_tea') {
        setNearbyTarget({
          id: 'anime_tea',
          title: 'TEA TABLE & ZEN SPOT',
          subtitle: 'Press [E] to sit down & reflect on narrative art',
        });
      }
    } else if (
      nearbyTarget?.id === 'anime_vault' ||
      nearbyTarget?.id === 'anime_manga' ||
      nearbyTarget?.id === 'anime_tea'
    ) {
      setNearbyTarget(null);
    }
  });

  // Handle [E] key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'KeyE') {
        const [px, , pz] = playerPosition;
        const vPos = toWorld(VAULT_LOCAL);
        const mPos = toWorld(MANGA_LOCAL);
        const tPos = toWorld(TEA_LOCAL);

        if (Math.hypot(px - vPos[0], pz - vPos[2]) < 2.8) {
          openInspect({
            title: 'AYUSHMAN’S ANIME VAULT',
            subtitle: 'Curated Masterpieces · Critical Narrative Reviews & Favorites',
            badge: 'TOP RATINGS (10/10)',
            sections: [
              {
                heading: 'Attack on Titan (Shingeki no Kyojin) — 10/10',
                body: '• Format: TV Series (89/89 episodes completed)\n• Genres: Action, Drama, Mystery, Psychological\n• Favorite Characters: Levi Ackerman & Eren Yeager\n• Notes: The peak of narrative storytelling, foreshadowing, and character arcs. Tatakae!',
              },
              {
                heading: 'One Piece — 10/10',
                body: '• Format: TV Series (Big Three, 1122+ episodes completed)\n• Genres: Action, Adventure, Fantasy\n• Favorite Characters: Monkey D. Luffy & Roronoa Zoro\n• Notes: Unmatched world-building, emotional peaks from Marineford to Wano & Egghead.',
              },
              {
                heading: 'Naruto: Shippuden — 9.7/10',
                body: '• Format: TV Series (500/500 episodes completed)\n• Genres: Action, Martial Arts, Shonen\n• Favorite Characters: Itachi Uchiha & Kakashi Hatake\n• Notes: Masterclass in philosophy of peace vs hatred and emotional payoff.',
              },
              {
                heading: 'Steins;Gate & Jujutsu Kaisen — 9.6/10',
                body: '• Steins;Gate: Masterpiece of causality, time loops, and psychological weight.\n• Jujutsu Kaisen: Bleeding-edge MAPPA animation, domain expansions, and Gojo Satoru.',
              },
            ],
            actions: [
              { label: 'OPEN ENTERTAINMENT HUB', route: '/entertainment', emoji: '🍿', variant: 'primary' },
              {
                label: 'ANILIST COMMUNITY',
                externalUrl: 'https://anilist.co',
                emoji: '✨',
                variant: 'secondary',
              },
            ],
          });
        } else if (Math.hypot(px - mPos[0], pz - mPos[2]) < 1.8) {
          openInspect({
            title: 'MANGA & LIGHT NOVEL ARCHIVE',
            subtitle: 'Original Source Material & Ongoing Series',
            badge: 'COLLECTION',
            sections: [
              {
                heading: 'Ongoing Reads',
                body: '• Vinland Saga (Farmland & Baltic Sea arcs)\n• Jujutsu Kaisen (Shinjuku Showdown)\n• Berserk (Kentaro Miura’s legacy)\n• Vagabond (Takehiko Inoue’s philosophy of the sword)',
              },
              {
                heading: 'Reading Philosophy',
                body: 'Appreciating panel composition, pacing, cross-hatching detail, and character psychological depth beyond simple action tropes.',
              },
            ],
            actions: [
              { label: 'ENTERTAINMENT PAGE', route: '/entertainment', emoji: '📖', variant: 'primary' },
            ],
          });
        } else if (Math.hypot(px - tPos[0], pz - tPos[2]) < 1.8) {
          openInspect({
            title: 'TEA TABLE & ZEN CORNER',
            subtitle: 'Peaceful Reflection & Storytelling Craft',
            badge: 'LOUNGE',
            sections: [
              {
                heading: 'Narrative Craft',
                body: '“The best stories leave you changed. Whether it is Eren’s struggle for freedom or Luffy’s boundless joy, great fiction fuels great engineering.”',
              },
            ],
            actions: [
              { label: 'RETURN TO PLAZA', route: '/world', emoji: '⛲', variant: 'primary' },
            ],
          });
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [playerPosition, openInspect]);

  return (
    <group position={HOUSE_POS} rotation={[0, ROT_Y, 0]}>
      {/* ── Floor & Engawa Porch ──────────────────────────────────── */}
      {/* Tatami-Style Interior Floor */}
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <boxGeometry args={[W - 0.2, 0.1, D - 0.2]} />
        <meshStandardMaterial color="#d4d4aa" roughness={0.8} />
      </mesh>

      {/* Front Wooden Engawa Porch (facing South toward plaza) */}
      <mesh position={[0, 0.05, D / 2 + 0.9]} receiveShadow>
        <boxGeometry args={[4.6, 0.1, 1.8]} />
        <meshStandardMaterial color="#78350f" roughness={0.7} />
      </mesh>

      {/* Front Plaque Sign */}
      <Billboard position={[0, H + 0.35, D / 2 + 0.2]}>
        <Text
          fontSize={0.24}
          color="#ea580c"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.03}
          outlineColor="#ffffff"
        >
          ANIME & MANGA LOUNGE
        </Text>
      </Billboard>

      {/* Red Paper Lanterns Flanking Entrance */}
      {[-1.6, 1.6].map((lx, i) => (
        <group key={i} position={[lx, 2.4, D / 2 + 0.8]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.2, 0.24, 0.55, 8]} />
            <meshStandardMaterial
              color="#dc2626"
              emissive="#ef4444"
              emissiveIntensity={0.8}
              roughness={0.5}
            />
          </mesh>
          <pointLight color="#f87171" intensity={0.8} distance={3.5} />
        </group>
      ))}

      {/* ── Collidable Wall Enclosure with Open Doorway ───────────── */}
      <RigidBody type="fixed" colliders={false}>
        {/* Back Wall */}
        <CuboidCollider args={[W / 2, H / 2, 0.15]} position={[0, H / 2, -D / 2]} />
        <mesh position={[0, H / 2, -D / 2]} castShadow receiveShadow>
          <boxGeometry args={[W, H, 0.22]} />
          <meshStandardMaterial color="#fef3c7" roughness={0.8} />
        </mesh>

        {/* Left Wall */}
        <CuboidCollider args={[0.15, H / 2, D / 2]} position={[-W / 2, H / 2, 0]} />
        <mesh position={[-W / 2, H / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.22, H, D]} />
          <meshStandardMaterial color="#fef3c7" roughness={0.8} />
        </mesh>

        {/* Right Wall */}
        <CuboidCollider args={[0.15, H / 2, D / 2]} position={[W / 2, H / 2, 0]} />
        <mesh position={[W / 2, H / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.22, H, D]} />
          <meshStandardMaterial color="#fef3c7" roughness={0.8} />
        </mesh>

        {/* Front Wall Left Segment */}
        <CuboidCollider args={[(W / 2 - 1.0) / 2, H / 2, 0.15]} position={[-W / 4 - 0.5, H / 2, D / 2]} />
        <mesh position={[-W / 4 - 0.5, H / 2, D / 2]} castShadow receiveShadow>
          <boxGeometry args={[W / 2 - 1.0, H, 0.22]} />
          <meshStandardMaterial color="#fef3c7" roughness={0.8} />
        </mesh>

        {/* Front Wall Right Segment */}
        <CuboidCollider args={[(W / 2 - 1.0) / 2, H / 2, 0.15]} position={[W / 4 + 0.5, H / 2, D / 2]} />
        <mesh position={[W / 4 + 0.5, H / 2, D / 2]} castShadow receiveShadow>
          <boxGeometry args={[W / 2 - 1.0, H, 0.22]} />
          <meshStandardMaterial color="#fef3c7" roughness={0.8} />
        </mesh>

        {/* Front Doorway Torii Lintel */}
        <CuboidCollider args={[1.0, 0.4, 0.15]} position={[0, H - 0.4, D / 2]} />
        <mesh position={[0, H - 0.4, D / 2]} castShadow>
          <boxGeometry args={[2.0, 0.8, 0.22]} />
          <meshStandardMaterial color="#991b1b" roughness={0.6} />
        </mesh>
      </RigidBody>

      {/* ── Japanese Curved Hip Roof ───────────────────────────────── */}
      <RigidBody type="fixed" colliders="hull">
        <mesh position={[0, H + 0.8, 0]} castShadow>
          <boxGeometry args={[W + 0.8, 0.5, D + 0.8]} />
          <meshStandardMaterial color="#1e293b" roughness={0.6} />
        </mesh>
      </RigidBody>

      {/* ── Warm Paper Shoji Ceiling Lantern ───────────────────────── */}
      <pointLight position={[0, H - 0.6, 0]} color="#fef08a" intensity={1.1} distance={7.5} />

      {/* ── Center Anime Showcase Kiosk ────────────────────────────── */}
      <group position={VAULT_LOCAL}>
        <mesh position={[0, 0.55, 0]} castShadow>
          <boxGeometry args={[1.6, 1.1, 0.7]} />
          <meshStandardMaterial color="#451a03" roughness={0.6} />
        </mesh>
        {/* Glowing Scroll Display */}
        <mesh position={[0, 1.3, 0]}>
          <boxGeometry args={[1.3, 0.7, 0.08]} />
          <meshStandardMaterial
            color="#ef4444"
            emissive="#ef4444"
            emissiveIntensity={0.5}
            roughness={0.3}
          />
        </mesh>
        <Billboard position={[0, 1.9, 0]}>
          <Text fontSize={0.15} color="#ea580c" outlineWidth={0.02} outlineColor="#ffffff">
            [E] ANIME VAULT
          </Text>
        </Billboard>
      </group>

      {/* ── Manga Archive Bookshelf (Right Wall) ───────────────────── */}
      <group position={MANGA_LOCAL} rotation={[0, -Math.PI / 2, 0]}>
        <mesh position={[0, 1.3, 0]} castShadow>
          <boxGeometry args={[1.8, 2.4, 0.45]} />
          <meshStandardMaterial color="#451a03" roughness={0.7} />
        </mesh>
        {/* Colorful Manga Spines */}
        {[-0.6, -0.2, 0.2, 0.6].map((bx, bi) => (
          <mesh key={bi} position={[bx, 1.3, 0.15]}>
            <boxGeometry args={[0.3, 1.8, 0.2]} />
            <meshStandardMaterial color={['#f87171', '#60a5fa', '#34d399', '#fbbf24'][bi]} />
          </mesh>
        ))}
        <Billboard position={[0, 2.7, 0]}>
          <Text fontSize={0.15} color="#38bdf8" outlineWidth={0.02} outlineColor="#000000">
            [E] MANGA SHELVES
          </Text>
        </Billboard>
      </group>

      {/* ── Low Tea Table & Zabuton Cushions (Left Side) ──────────── */}
      <group position={TEA_LOCAL}>
        {/* Low Table */}
        <mesh position={[0, 0.35, 0]} castShadow>
          <boxGeometry args={[1.2, 0.08, 0.8]} />
          <meshStandardMaterial color="#78350f" roughness={0.6} />
        </mesh>
        {/* Cushions */}
        {[-0.65, 0.65].map((cx, ci) => (
          <mesh key={ci} position={[cx, 0.08, 0]} castShadow>
            <boxGeometry args={[0.45, 0.12, 0.45]} />
            <meshStandardMaterial color="#0284c7" roughness={0.7} />
          </mesh>
        ))}
        <Billboard position={[0, 0.9, 0]}>
          <Text fontSize={0.13} color="#94a3b8" outlineWidth={0.02} outlineColor="#ffffff">
            [E] ZEN TABLE
          </Text>
        </Billboard>
      </group>
    </group>
  );
}
