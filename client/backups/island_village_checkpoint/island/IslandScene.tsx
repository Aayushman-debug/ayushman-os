/**
 * IslandScene.tsx — Roblox Island Life 3D Root Scene
 *
 * Setup:
 * - Natural sunny daylight lighting (sunlight, sky bounce, soft shadows)
 * - Atmospheric sky & gentle volumetric fog
 * - Rapier physics simulation
 * - Roblox avatar player, terrain, village, and tropical vegetation
 */
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import { Sky } from '@react-three/drei';
import RobloxPlayer from './RobloxPlayer';
import IslandTerrain from './IslandTerrain';
import IslandVillage from './IslandVillage';
import IslandVegetation from './IslandVegetation';
import DeveloperVillage from './districts/DeveloperVillage';
import UniversityTown from './districts/UniversityTown';
import ArcadeBay from './districts/ArcadeBay';
import SocialHarbour from './districts/SocialHarbour';

function Daylight() {
  return (
    <>
      {/* Sky Blue Ambient Light */}
      <ambientLight intensity={0.65} color="#bae6fd" />

      {/* Warm Golden Sun (Directional Light with Shadows) */}
      <directionalLight
        castShadow
        position={[35, 55, 25]}
        intensity={1.25}
        color="#fffbeb"
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={160}
        shadow-camera-left={-65}
        shadow-camera-right={65}
        shadow-camera-top={65}
        shadow-camera-bottom={-65}
        shadow-bias={-0.0005}
      />

      {/* Gentle Green Ground Bounce Fill Light */}
      <directionalLight
        position={[-20, -10, -20]}
        intensity={0.25}
        color="#bbf7d0"
      />

      {/* Atmosphere Fog */}
      <fog attach="fog" args={['#e0f2fe', 60, 220]} />
    </>
  );
}

export default function IslandScene() {
  return (
    <Canvas
      shadows
      camera={{ fov: 60, near: 0.1, far: 300, position: [0, 5, 10] }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      style={{ width: '100%', height: '100%', background: '#bae6fd' }}
    >
      <Suspense fallback={null}>
        {/* Sunny Blue Sky */}
        <Sky
          distance={450000}
          sunPosition={[35, 55, 25]}
          inclination={0.6}
          azimuth={0.25}
          turbidity={6}
          rayleigh={0.5}
        />

        <Daylight />

        <Physics gravity={[0, -22, 0]} timeStep="vary">
          <RobloxPlayer />
          <IslandTerrain />
          <IslandVillage />
          <IslandVegetation />
          <DeveloperVillage />
          <UniversityTown />
          <ArcadeBay />
          <SocialHarbour />
        </Physics>
      </Suspense>
    </Canvas>
  );
}
