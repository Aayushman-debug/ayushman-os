/**
 * Scene.tsx — Root 3D scene with lighting, physics world, player, and first district.
 */
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import { Sky, Stars, Preload } from '@react-three/drei';
import Player from '../player/Player';
import CentralNexus from './CentralNexus';

function Lights() {
  return (
    <>
      {/* Deep blue ambient — the void of night */}
      <ambientLight intensity={0.15} color="#0a1040" />

      {/* Main directional — dim moonlight */}
      <directionalLight
        castShadow
        position={[20, 40, 20]}
        intensity={0.5}
        color="#c0d8ff"
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={200}
        shadow-camera-left={-60}
        shadow-camera-right={60}
        shadow-camera-top={60}
        shadow-camera-bottom={-60}
      />

      {/* Cyan fill from below — neon street bounce */}
      <pointLight position={[0, 1, 0]} intensity={3} color="#00f5ff" distance={30} decay={2} />

      {/* Magenta accent */}
      <pointLight position={[-20, 5, 10]} intensity={4} color="#ff006e" distance={40} decay={2} />

      {/* Amber warmth on right */}
      <pointLight position={[20, 5, -5]} intensity={3} color="#ffb700" distance={35} decay={2} />
    </>
  );
}

function NightSky() {
  return (
    <>
      <Stars
        radius={120}
        depth={50}
        count={3000}
        factor={4}
        saturation={0.8}
        fade
        speed={0.3}
      />
      {/* Fog to fake atmospheric depth */}
      <fog attach="fog" args={['#050810', 40, 120]} />
    </>
  );
}

export default function Scene() {
  return (
    <Canvas
      shadows
      camera={{ fov: 70, near: 0.1, far: 200, position: [0, 4, 8] }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      style={{ width: '100%', height: '100%', background: '#050810' }}
    >
      <Suspense fallback={null}>
        <NightSky />
        <Lights />
        <Physics gravity={[0, -20, 0]} timeStep="vary">
          <Player />
          <CentralNexus />
        </Physics>
        <Preload all />
      </Suspense>
    </Canvas>
  );
}
