/**
 * IslandScene.tsx — Roblox Island Life 3D Root Scene
 *
 * Lighting, Sky & Atmosphere:
 * - Natural daylight, golden sunset, and realistic cool twilight night
 * - Tone-mapped ambient and directional celestial lighting (sun & moon)
 * - Cohesive material integration: avatar shades naturally at night without glow artifacts
 * - Dynamic weather effects (rain, fog, wind, clear)
 * - Rapier physics simulation
 */
import React, { Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import { Sky } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import RobloxPlayer from './RobloxPlayer';
import IslandTerrain from './IslandTerrain';
import IslandVillage from './IslandVillage';
import IslandVegetation from './IslandVegetation';
import { useIslandStore } from './useIslandStore';
import * as THREE from 'three';

function SkyAtmosphere() {
  const worldPhase = useIslandStore((state) => state.worldPhase);

  if (worldPhase === 'night') {
    return (
      <Sky
        distance={450000}
        sunPosition={[-35, -55, -25]}
        inclination={0.9}
        azimuth={0.75}
        turbidity={10}
        rayleigh={0.1}
      />
    );
  }

  return (
    <Sky
      distance={450000}
      sunPosition={worldPhase === 'sunset' ? [65, 12, 10] : [35, 55, 25]}
      inclination={worldPhase === 'sunset' ? 0.35 : 0.6}
      azimuth={0.25}
      turbidity={worldPhase === 'sunset' ? 8 : 6}
      rayleigh={worldPhase === 'sunset' ? 1.2 : 0.5}
    />
  );
}

function Daylight() {
  const worldPhase = useIslandStore((state) => state.worldPhase);
  const setWorldPhase = useIslandStore((state) => state.setWorldPhase);
  const weather = useIslandStore((state) => state.weather);
  const { scene } = useThree();

  useEffect(() => {
    const updatePhase = () => {
      const hour = new Date().getHours();
      if (hour >= 5 && hour < 8) setWorldPhase('morning');
      else if (hour >= 8 && hour < 17) setWorldPhase('day');
      else if (hour >= 17 && hour < 20) setWorldPhase('sunset');
      else setWorldPhase('night');
    };
    updatePhase();
    const timer = window.setInterval(updatePhase, 60_000);
    return () => window.clearInterval(timer);
  }, [setWorldPhase]);

  const palette = {
    morning: { ambient: '#fff7ed', sun: '#ffd9a8', bounce: '#bbf7d0', fog: '#fde68a', intensity: 0.82 },
    day: { ambient: '#bae6fd', sun: '#fffbeb', bounce: '#86efac', fog: '#e0f2fe', intensity: 1.25 },
    sunset: { ambient: '#fdba74', sun: '#fb923c', bounce: '#fde047', fog: '#fed7aa', intensity: 0.95 },
    night: { ambient: '#1e293b', sun: '#93c5fd', bounce: '#0f172a', fog: '#090d16', intensity: 0.45 },
  }[worldPhase];

  useEffect(() => {
    if (worldPhase === 'night') scene.background = new THREE.Color('#070d18');
    else if (weather === 'fog') scene.background = new THREE.Color(palette.fog);
    else scene.background = null;
  }, [palette.fog, scene, weather, worldPhase]);

  return (
    <>
      {/* Ambient Celestial Light */}
      <ambientLight
        intensity={worldPhase === 'night' ? 0.42 : 0.65}
        color={palette.ambient}
      />

      {/* Sun / Moon Directional Light with Shadows */}
      <directionalLight
        castShadow
        position={worldPhase === 'night' ? [25, 45, 15] : [35, 55, 25]}
        intensity={weather === 'fog' ? palette.intensity * 0.55 : palette.intensity}
        color={palette.sun}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={180}
        shadow-camera-left={-75}
        shadow-camera-right={75}
        shadow-camera-top={75}
        shadow-camera-bottom={-75}
        shadow-bias={-0.0005}
      />

      {/* Ground Bounce Fill Light */}
      <directionalLight
        position={[-20, -10, -20]}
        intensity={worldPhase === 'night' ? 0.18 : 0.25}
        color={palette.bounce}
      />

      {/* Atmospheric Fog */}
      <fog
        attach="fog"
        args={[
          palette.fog,
          weather === 'fog' ? 18 : weather === 'rain' ? 45 : worldPhase === 'night' ? 35 : 60,
          weather === 'fog' ? 115 : 240,
        ]}
      />
    </>
  );
}

function WeatherEffects() {
  const weather = useIslandStore((state) => state.weather);
  const points = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const values = new Float32Array(360 * 3);
    for (let i = 0; i < 360 * 3; i += 3) {
      values[i] = (Math.random() - 0.5) * 80;
      values[i + 1] = Math.random() * 30;
      values[i + 2] = (Math.random() - 0.5) * 80;
    }
    return values;
  }, []);

  useFrame((_state, delta) => {
    if (!points.current || weather !== 'rain') return;
    points.current.position.y -= delta * 7;
    points.current.position.x -= delta * 1.5;
    if (points.current.position.y < -12) {
      points.current.position.y = 0;
      points.current.position.x = 0;
    }
  });

  if (weather !== 'rain') return null;
  return (
    <points ref={points} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#dbeafe" size={0.09} transparent opacity={0.75} depthWrite={false} />
    </points>
  );
}

export default function IslandScene() {
  const worldPhase = useIslandStore((state) => state.worldPhase);

  return (
    <Canvas
      shadows
      camera={{ fov: 60, near: 0.1, far: 350, position: [-42, 5, -20] }}
      gl={{
        antialias: true,
        powerPreference: 'high-performance',
      }}
      style={{
        width: '100%',
        height: '100%',
        background: worldPhase === 'night' ? '#070d18' : '#bae6fd',
      }}
    >
      <Suspense fallback={null}>
        <SkyAtmosphere />
        <Daylight />
        <WeatherEffects />

        <Physics gravity={[0, -22, 0]} timeStep="vary">
          <RobloxPlayer />
          <IslandTerrain />
          <IslandVillage />
          <IslandVegetation />
        </Physics>
      </Suspense>
    </Canvas>
  );
}
