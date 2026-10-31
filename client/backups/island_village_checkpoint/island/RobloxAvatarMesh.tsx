/**
 * RobloxAvatarMesh.tsx — Stylized Roblox-Inspired Avatar Mesh
 *
 * Reusable 3D character mesh supporting:
 * - Dynamic skin tones
 * - 5 Modular hairstyles & 6 hair colors
 * - 5 Expressive facial styles (Smile, Shades, Wink, Smirk, Chill)
 * - 5 Outfits / Tops (Hoodie, Polo, Varsity Jacket, Tech Tee, Formal Suit)
 * - 5 Bottoms (Navy, Jeans, Cargo, Beach Shorts, Trackpants)
 * - 3 Accessories (Gaming Headphones, Traveler Backpack, Island Katana)
 * - Procedural limb swinging for walk/run animations
 */
import React from 'react';
import { AvatarConfig } from './avatarTypes';

interface AvatarMeshProps {
  avatar: AvatarConfig;
  armSwingLeft?: number;
  armSwingRight?: number;
  legSwingLeft?: number;
  legSwingRight?: number;
  torsoBob?: number;
  leftArmRef?: React.RefObject<any>;
  rightArmRef?: React.RefObject<any>;
  leftLegRef?: React.RefObject<any>;
  rightLegRef?: React.RefObject<any>;
  torsoRef?: React.RefObject<any>;
}

export default function RobloxAvatarMesh({
  avatar,
  leftArmRef,
  rightArmRef,
  leftLegRef,
  rightLegRef,
  torsoRef,
}: AvatarMeshProps) {
  const {
    skinTone,
    hairstyle,
    hairColor,
    face,
    top,
    topColor,
    bottom,
    bottomColor,
    accessory,
  } = avatar;

  return (
    <group>
      {/* ── Head Group ─────────────────────────────────────────────── */}
      <group position={[0, 1.65, 0]}>
        {/* Head Block */}
        <mesh castShadow>
          <boxGeometry args={[0.55, 0.55, 0.55]} />
          <meshStandardMaterial color={skinTone} roughness={0.4} />
        </mesh>

        {/* ── Hairstyles ──────────────────────────────────────────── */}
        {hairstyle === 'parted' && (
          <group>
            {/* Main Cap */}
            <mesh position={[0, 0.24, -0.02]} castShadow>
              <boxGeometry args={[0.59, 0.22, 0.6]} />
              <meshStandardMaterial color={hairColor} roughness={0.7} />
            </mesh>
            {/* Back Hair */}
            <mesh position={[0, 0.14, -0.26]} castShadow>
              <boxGeometry args={[0.59, 0.36, 0.14]} />
              <meshStandardMaterial color={hairColor} roughness={0.7} />
            </mesh>
            {/* Side Bangs */}
            <mesh position={[-0.26, 0.1, 0.1]} castShadow>
              <boxGeometry args={[0.12, 0.32, 0.38]} />
              <meshStandardMaterial color={hairColor} roughness={0.7} />
            </mesh>
          </group>
        )}

        {hairstyle === 'spiky' && (
          <group>
            {/* Base Cap */}
            <mesh position={[0, 0.24, 0]} castShadow>
              <boxGeometry args={[0.58, 0.2, 0.58]} />
              <meshStandardMaterial color={hairColor} roughness={0.8} />
            </mesh>
            {/* Spikes on Top */}
            {[-0.16, 0, 0.16].map((x, i) => (
              <mesh key={i} position={[x, 0.44, -0.05]} rotation={[0.2, 0, (i - 1) * 0.2]} castShadow>
                <coneGeometry args={[0.14, 0.4, 4]} />
                <meshStandardMaterial color={hairColor} roughness={0.8} flatShading />
              </mesh>
            ))}
          </group>
        )}

        {hairstyle === 'beanie' && (
          <group>
            {/* Beanie Dome */}
            <mesh position={[0, 0.3, -0.02]} castShadow>
              <sphereGeometry args={[0.34, 12, 10]} />
              <meshStandardMaterial color={hairColor} roughness={0.9} />
            </mesh>
            {/* Beanie Fold Rim */}
            <mesh position={[0, 0.22, -0.02]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.31, 0.08, 8, 20]} />
              <meshStandardMaterial color={hairColor} roughness={0.9} />
            </mesh>
          </group>
        )}

        {hairstyle === 'cap' && (
          <group>
            {/* Cap Dome */}
            <mesh position={[0, 0.24, -0.02]} castShadow>
              <boxGeometry args={[0.58, 0.22, 0.58]} />
              <meshStandardMaterial color={hairColor} roughness={0.7} />
            </mesh>
            {/* Cap Forward Visor / Bill */}
            <mesh position={[0, 0.16, 0.38]} rotation={[-0.1, 0, 0]} castShadow>
              <boxGeometry args={[0.56, 0.05, 0.28]} />
              <meshStandardMaterial color={hairColor} roughness={0.7} />
            </mesh>
          </group>
        )}

        {hairstyle === 'clean' && (
          /* Subtle close buzz cut texture */
          <mesh position={[0, 0.2, -0.02]}>
            <boxGeometry args={[0.57, 0.18, 0.57]} />
            <meshStandardMaterial color={hairColor} roughness={0.9} />
          </mesh>
        )}

        {/* ── Facial Expressions ──────────────────────────────────── */}
        {face === 'smile' && (
          <group>
            {/* Eyes */}
            <mesh position={[-0.14, 0.04, 0.285]}>
              <planeGeometry args={[0.09, 0.12]} />
              <meshBasicMaterial color="#1e293b" />
            </mesh>
            <mesh position={[0.14, 0.04, 0.285]}>
              <planeGeometry args={[0.09, 0.12]} />
              <meshBasicMaterial color="#1e293b" />
            </mesh>
            {/* Eye Sparkles */}
            <mesh position={[-0.12, 0.07, 0.288]}>
              <planeGeometry args={[0.03, 0.03]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
            <mesh position={[0.16, 0.07, 0.288]}>
              <planeGeometry args={[0.03, 0.03]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
            {/* Smile */}
            <mesh position={[0, -0.12, 0.285]}>
              <planeGeometry args={[0.18, 0.06]} />
              <meshBasicMaterial color="#b45309" />
            </mesh>
          </group>
        )}

        {face === 'shades' && (
          <group>
            {/* Dark Aviator Sunglasses Frame */}
            <mesh position={[0, 0.04, 0.29]}>
              <boxGeometry args={[0.44, 0.15, 0.04]} />
              <meshStandardMaterial color="#0f172a" roughness={0.2} metalness={0.8} />
            </mesh>
            {/* White Glare Line */}
            <mesh position={[-0.08, 0.06, 0.315]} rotation={[0, 0, -0.3]}>
              <planeGeometry args={[0.12, 0.02]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
            {/* Cool Smirk */}
            <mesh position={[0.05, -0.12, 0.285]} rotation={[0, 0, 0.1]}>
              <planeGeometry args={[0.14, 0.04]} />
              <meshBasicMaterial color="#78350f" />
            </mesh>
          </group>
        )}

        {face === 'wink' && (
          <group>
            {/* Left Eye: Open Sparkle */}
            <mesh position={[-0.14, 0.04, 0.285]}>
              <planeGeometry args={[0.09, 0.12]} />
              <meshBasicMaterial color="#1e293b" />
            </mesh>
            <mesh position={[-0.12, 0.07, 0.288]}>
              <planeGeometry args={[0.035, 0.035]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
            {/* Right Eye: Cute Wink Curve */}
            <mesh position={[0.14, 0.04, 0.285]}>
              <planeGeometry args={[0.12, 0.03]} />
              <meshBasicMaterial color="#1e293b" />
            </mesh>
            {/* Playful Open Smile */}
            <mesh position={[0, -0.12, 0.285]}>
              <planeGeometry args={[0.16, 0.08]} />
              <meshBasicMaterial color="#dc2626" />
            </mesh>
          </group>
        )}

        {face === 'smirk' && (
          <group>
            {/* Arched Eyebrow */}
            <mesh position={[0.14, 0.14, 0.285]} rotation={[0, 0, 0.2]}>
              <planeGeometry args={[0.12, 0.025]} />
              <meshBasicMaterial color="#78350f" />
            </mesh>
            {/* Confident Eyes */}
            <mesh position={[-0.14, 0.04, 0.285]}>
              <planeGeometry args={[0.08, 0.1]} />
              <meshBasicMaterial color="#1e293b" />
            </mesh>
            <mesh position={[0.14, 0.04, 0.285]}>
              <planeGeometry args={[0.08, 0.1]} />
              <meshBasicMaterial color="#1e293b" />
            </mesh>
            {/* Side Smirk */}
            <mesh position={[0.06, -0.11, 0.285]} rotation={[0, 0, 0.15]}>
              <planeGeometry args={[0.15, 0.05]} />
              <meshBasicMaterial color="#9a3412" />
            </mesh>
          </group>
        )}

        {face === 'chill' && (
          <group>
            {/* Relaxed Curved Eyes */}
            <mesh position={[-0.14, 0.04, 0.285]} rotation={[0, 0, -0.1]}>
              <planeGeometry args={[0.11, 0.03]} />
              <meshBasicMaterial color="#334155" />
            </mesh>
            <mesh position={[0.14, 0.04, 0.285]} rotation={[0, 0, 0.1]}>
              <planeGeometry args={[0.11, 0.03]} />
              <meshBasicMaterial color="#334155" />
            </mesh>
            {/* Soft Content Mouth */}
            <mesh position={[0, -0.11, 0.285]}>
              <planeGeometry args={[0.14, 0.04]} />
              <meshBasicMaterial color="#78350f" />
            </mesh>
          </group>
        )}

        {/* ── Accessory: Headphones ───────────────────────────────── */}
        {accessory === 'headphones' && (
          <group>
            {/* Headband Arc */}
            <mesh position={[0, 0.28, 0]}>
              <torusGeometry args={[0.3, 0.035, 8, 16, Math.PI]} />
              <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.7} />
            </mesh>
            {/* Left Earcup */}
            <mesh position={[-0.31, 0.04, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
              <cylinderGeometry args={[0.14, 0.14, 0.08, 12]} />
              <meshStandardMaterial color="#38bdf8" roughness={0.4} metalness={0.4} />
            </mesh>
            {/* Right Earcup */}
            <mesh position={[0.31, 0.04, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
              <cylinderGeometry args={[0.14, 0.14, 0.08, 12]} />
              <meshStandardMaterial color="#38bdf8" roughness={0.4} metalness={0.4} />
            </mesh>
          </group>
        )}
      </group>

      {/* ── Torso Group ────────────────────────────────────────────── */}
      <group ref={torsoRef} position={[0, 0.75, 0]}>
        {/* Main Torso Block */}
        <mesh castShadow>
          <boxGeometry args={[0.65, 0.75, 0.36]} />
          <meshStandardMaterial color={topColor} roughness={0.6} />
        </mesh>

        {/* ── Top Details ─────────────────────────────────────────── */}
        {top === 'hoodie' && (
          <group>
            {/* Kangaroo Pouch Pocket */}
            <mesh position={[0, -0.18, 0.185]}>
              <boxGeometry args={[0.38, 0.22, 0.03]} />
              <meshStandardMaterial color={topColor} roughness={0.7} />
            </mesh>
            {/* Hood Back Collar */}
            <mesh position={[0, 0.32, -0.19]}>
              <boxGeometry args={[0.42, 0.16, 0.06]} />
              <meshStandardMaterial color={topColor} roughness={0.7} />
            </mesh>
            {/* White Drawstrings */}
            <mesh position={[-0.06, 0.18, 0.185]}>
              <planeGeometry args={[0.02, 0.14]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
            <mesh position={[0.06, 0.18, 0.185]}>
              <planeGeometry args={[0.02, 0.14]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
          </group>
        )}

        {top === 'polo' && (
          <group>
            {/* White Collar */}
            <mesh position={[0, 0.28, 0.185]}>
              <planeGeometry args={[0.26, 0.12]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
            {/* Pocket */}
            <mesh position={[-0.18, 0.08, 0.185]}>
              <planeGeometry args={[0.1, 0.12]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
          </group>
        )}

        {top === 'varsity' && (
          <group>
            {/* White Torso Center Strip */}
            <mesh position={[0, 0, 0.185]}>
              <planeGeometry args={[0.08, 0.7]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
            {/* Chest Letter "A" */}
            <mesh position={[-0.16, 0.14, 0.186]}>
              <planeGeometry args={[0.12, 0.14]} />
              <meshBasicMaterial color="#fbbf24" />
            </mesh>
          </group>
        )}

        {top === 'tee' && (
          /* Tech Code Graphic </> */
          <mesh position={[0, 0.08, 0.185]}>
            <planeGeometry args={[0.24, 0.16]} />
            <meshBasicMaterial color="#38bdf8" />
          </mesh>
        )}

        {top === 'suit' && (
          <group>
            {/* White Dress Shirt V */}
            <mesh position={[0, 0.22, 0.185]}>
              <planeGeometry args={[0.22, 0.26]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
            {/* Red Silk Necktie */}
            <mesh position={[0, 0.05, 0.188]}>
              <planeGeometry args={[0.06, 0.38]} />
              <meshBasicMaterial color="#dc2626" />
            </mesh>
          </group>
        )}

        {/* ── Accessory: Backpack ─────────────────────────────────── */}
        {accessory === 'backpack' && (
          <group position={[0, 0.04, -0.28]}>
            <mesh castShadow>
              <boxGeometry args={[0.48, 0.54, 0.22]} />
              <meshStandardMaterial color="#b45309" roughness={0.8} />
            </mesh>
            {/* Front Zip Pocket */}
            <mesh position={[0, -0.1, -0.12]}>
              <boxGeometry args={[0.38, 0.26, 0.08]} />
              <meshStandardMaterial color="#92400e" roughness={0.8} />
            </mesh>
          </group>
        )}

        {/* ── Accessory: Island Katana ────────────────────────────── */}
        {accessory === 'sword' && (
          <group position={[0, 0.1, -0.25]} rotation={[0, 0, 0.55]}>
            {/* Scabbard / Sheath */}
            <mesh castShadow>
              <boxGeometry args={[0.07, 1.25, 0.07]} />
              <meshStandardMaterial color="#1e293b" roughness={0.3} metalness={0.6} />
            </mesh>
            {/* Gold Tsuba / Guard */}
            <mesh position={[0, 0.44, 0]}>
              <cylinderGeometry args={[0.12, 0.12, 0.04, 8]} />
              <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.2} />
            </mesh>
            {/* Handle Hilt */}
            <mesh position={[0, 0.62, 0]}>
              <boxGeometry args={[0.06, 0.32, 0.06]} />
              <meshStandardMaterial color="#dc2626" roughness={0.8} />
            </mesh>
          </group>
        )}
      </group>

      {/* ── Left Arm ───────────────────────────────────────────────── */}
      <group ref={leftArmRef} position={[-0.48, 1.05, 0]}>
        {/* Sleeve */}
        <mesh position={[0, -0.32, 0]} castShadow>
          <boxGeometry args={[0.26, 0.68, 0.3]} />
          <meshStandardMaterial
            color={top === 'varsity' ? '#ffffff' : topColor}
            roughness={0.6}
          />
        </mesh>
        {/* Hand in Skin Tone */}
        <mesh position={[0, -0.68, 0]} castShadow>
          <boxGeometry args={[0.24, 0.18, 0.28]} />
          <meshStandardMaterial color={skinTone} roughness={0.4} />
        </mesh>
      </group>

      {/* ── Right Arm ──────────────────────────────────────────────── */}
      <group ref={rightArmRef} position={[0.48, 1.05, 0]}>
        {/* Sleeve */}
        <mesh position={[0, -0.32, 0]} castShadow>
          <boxGeometry args={[0.26, 0.68, 0.3]} />
          <meshStandardMaterial
            color={top === 'varsity' ? '#ffffff' : topColor}
            roughness={0.6}
          />
        </mesh>
        {/* Hand in Skin Tone */}
        <mesh position={[0, -0.68, 0]} castShadow>
          <boxGeometry args={[0.24, 0.18, 0.28]} />
          <meshStandardMaterial color={skinTone} roughness={0.4} />
        </mesh>
      </group>

      {/* ── Left Leg ───────────────────────────────────────────────── */}
      <group ref={leftLegRef} position={[-0.17, 0.38, 0]}>
        {/* Pants / Shorts */}
        {bottom === 'shorts' ? (
          <group>
            {/* Shorts Fabric */}
            <mesh position={[0, -0.18, 0]} castShadow>
              <boxGeometry args={[0.3, 0.36, 0.34]} />
              <meshStandardMaterial color={bottomColor} roughness={0.7} />
            </mesh>
            {/* Exposed Skin Above Shoe */}
            <mesh position={[0, -0.5, 0]} castShadow>
              <boxGeometry args={[0.26, 0.32, 0.3]} />
              <meshStandardMaterial color={skinTone} roughness={0.4} />
            </mesh>
          </group>
        ) : (
          <mesh position={[0, -0.36, 0]} castShadow>
            <boxGeometry args={[0.3, 0.72, 0.34]} />
            <meshStandardMaterial color={bottomColor} roughness={0.7} />
          </mesh>
        )}

        {/* White Track Stripe Detail */}
        {bottom === 'trackpants' && (
          <mesh position={[-0.155, -0.36, 0]}>
            <planeGeometry args={[0.04, 0.68]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        )}

        {/* Sneaker Shoe */}
        <mesh position={[0, -0.74, 0.04]} castShadow>
          <boxGeometry args={[0.3, 0.14, 0.42]} />
          <meshStandardMaterial color="#ffffff" roughness={0.3} />
        </mesh>
      </group>

      {/* ── Right Leg ──────────────────────────────────────────────── */}
      <group ref={rightLegRef} position={[0.17, 0.38, 0]}>
        {bottom === 'shorts' ? (
          <group>
            <mesh position={[0, -0.18, 0]} castShadow>
              <boxGeometry args={[0.3, 0.36, 0.34]} />
              <meshStandardMaterial color={bottomColor} roughness={0.7} />
            </mesh>
            <mesh position={[0, -0.5, 0]} castShadow>
              <boxGeometry args={[0.26, 0.32, 0.3]} />
              <meshStandardMaterial color={skinTone} roughness={0.4} />
            </mesh>
          </group>
        ) : (
          <mesh position={[0, -0.36, 0]} castShadow>
            <boxGeometry args={[0.3, 0.72, 0.34]} />
            <meshStandardMaterial color={bottomColor} roughness={0.7} />
          </mesh>
        )}

        {bottom === 'trackpants' && (
          <mesh position={[0.155, -0.36, 0]}>
            <planeGeometry args={[0.04, 0.68]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        )}

        <mesh position={[0, -0.74, 0.04]} castShadow>
          <boxGeometry args={[0.3, 0.14, 0.42]} />
          <meshStandardMaterial color="#ffffff" roughness={0.3} />
        </mesh>
      </group>
    </group>
  );
}
