/**
 * Player.tsx — Third-person capsule player with physics, WASD movement,
 * camera follow, and interaction ray-cast trigger.
 *
 * Uses @react-three/rapier for physics, @react-three/drei for orbital camera.
 */
import React, { useRef, useEffect, useCallback } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { RigidBody, CapsuleCollider, RapierRigidBody } from '@react-three/rapier';
import { usePlayerControls } from './usePlayerControls';
import { useGameStore } from '../store/useGameStore';
import { sound } from '../audio/soundEngine';
import * as THREE from 'three';

const WALK_SPEED = 5;
const SPRINT_MULTIPLIER = 1.8;
const JUMP_IMPULSE = 8;
const CAM_DISTANCE = 6;
const CAM_HEIGHT = 3;
const CAM_LERP = 0.1;

// Horizontal camera yaw controlled by mouse drag
const yaw = { current: 0 };
let isPointerDown = false;
let lastX = 0;

export default function Player() {
  const rb = useRef<RapierRigidBody>(null);
  const mesh = useRef<THREE.Group>(null);
  const keys = usePlayerControls();
  const { camera } = useThree();
  const {
    controlsLocked,
    setPlayerPosition,
    teleportTarget,
    setTeleportTarget,
    cameraMode,
    cycleCameraMode,
    touchInput,
    collectedShards,
  } = useGameStore();
  const onGround = useRef(true);
  const camTarget = useRef(new THREE.Vector3());
  const footstepTimer = useRef(0);

  // Mouse drag for camera yaw & [V] key for camera mode
  useEffect(() => {
    const onDown = (e: MouseEvent) => { isPointerDown = true; lastX = e.clientX; };
    const onUp = () => { isPointerDown = false; };
    const onMove = (e: MouseEvent) => {
      if (!isPointerDown) return;
      const dx = e.clientX - lastX;
      yaw.current -= dx * 0.004;
      lastX = e.clientX;
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'KeyV') cycleCameraMode();
    };

    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('keydown', onKey);
    };
  }, [cycleCameraMode]);

  useFrame((_state, delta) => {
    if (!rb.current) return;

    // Fast travel teleport handler
    if (teleportTarget) {
      rb.current.setTranslation(
        { x: teleportTarget[0], y: teleportTarget[1] + 1.2, z: teleportTarget[2] },
        true
      );
      rb.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
      setTeleportTarget(null);
    }

    if (controlsLocked) return;

    const k = keys.current;
    const isSprint = k.sprint || touchInput.sprint;
    const speed = isSprint ? WALK_SPEED * SPRINT_MULTIPLIER : WALK_SPEED;

    // Merge keyboard + touch input
    const isFwd = k.forward || touchInput.forward;
    const isBwd = k.backward || touchInput.backward;
    const isLeft = k.left || touchInput.left;
    const isRight = k.right || touchInput.right;
    const isJump = k.jump || touchInput.jump;

    // Build move direction relative to camera yaw
    const dir = new THREE.Vector3();
    if (isFwd)   dir.z -= 1;
    if (isBwd)  dir.z += 1;
    if (isLeft)  dir.x -= 1;
    if (isRight) dir.x += 1;

    if (dir.lengthSq() > 0) {
      dir.normalize();
      dir.applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw.current);

      // Footstep sound when moving on ground
      if (onGround.current) {
        footstepTimer.current += delta;
        const stepInterval = isSprint ? 0.28 : 0.42;
        if (footstepTimer.current >= stepInterval) {
          sound.playFootstep();
          footstepTimer.current = 0;
        }
      }
    } else {
      footstepTimer.current = 0;
    }

    const vel = rb.current.linvel();
    rb.current.setLinvel(
      { x: dir.x * speed, y: vel.y, z: dir.z * speed },
      true
    );

    // Jump
    if (isJump && onGround.current) {
      rb.current.applyImpulse({ x: 0, y: JUMP_IMPULSE, z: 0 }, true);
      onGround.current = false;
      sound.playClick(500);
    }

    // Face movement direction
    if (dir.lengthSq() > 0 && mesh.current) {
      const angle = Math.atan2(dir.x, dir.z);
      mesh.current.rotation.y = THREE.MathUtils.lerp(
        mesh.current.rotation.y,
        angle,
        0.15
      );
    }

    // Camera follow based on cameraMode
    const pos = rb.current.translation();
    const playerVec = new THREE.Vector3(pos.x, pos.y, pos.z);
    setPlayerPosition([pos.x, pos.y, pos.z]);

    const camDist =
      cameraMode === 'close' ? 3.4 : cameraMode === 'tactical' ? 14 : CAM_DISTANCE;
    const camHeight =
      cameraMode === 'close' ? 1.8 : cameraMode === 'tactical' ? 10 : CAM_HEIGHT;

    const offset = new THREE.Vector3(
      Math.sin(yaw.current) * camDist,
      camHeight,
      Math.cos(yaw.current) * camDist
    );
    const desiredCam = playerVec.clone().add(offset);
    camera.position.lerp(desiredCam, CAM_LERP);

    camTarget.current.lerp(
      playerVec.clone().add(new THREE.Vector3(0, cameraMode === 'close' ? 0.9 : 1.2, 0)),
      CAM_LERP
    );
    camera.lookAt(camTarget.current);
  });

  return (
    <RigidBody
      ref={rb}
      colliders={false}
      mass={1}
      lockRotations
      onCollisionEnter={() => { onGround.current = true; }}
      position={[0, 2, 0]}
    >
      <CapsuleCollider args={[0.5, 0.4]} />
      {/* Low-poly character stand-in: cylinder body + sphere head */}
      <group ref={mesh}>
        {/* Body */}
        <mesh position={[0, 0, 0]} castShadow>
          <capsuleGeometry args={[0.35, 0.9, 4, 8]} />
          <meshStandardMaterial
            color="#00f5ff"
            emissive="#00f5ff"
            emissiveIntensity={0.3}
            roughness={0.4}
            metalness={0.6}
          />
        </mesh>
        {/* Head */}
        <mesh position={[0, 0.85, 0]} castShadow>
          <dodecahedronGeometry args={[0.28, 0]} />
          <meshStandardMaterial
            color="#ff006e"
            emissive="#ff006e"
            emissiveIntensity={0.5}
            roughness={0.3}
            metalness={0.7}
          />
        </mesh>
        {/* Neon glow ring */}
        <mesh position={[0, -0.6, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.38, 0.04, 8, 20]} />
          <meshStandardMaterial
            color={collectedShards.length === 5 ? '#ffb700' : '#00f5ff'}
            emissive={collectedShards.length === 5 ? '#ffb700' : '#00f5ff'}
            emissiveIntensity={collectedShards.length === 5 ? 4 : 2}
          />
        </mesh>

        {/* Easter egg: Cyber Overclock halo when all 5 shards collected */}
        {collectedShards.length === 5 && (
          <mesh position={[0, 1.25, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.22, 0.03, 6, 16]} />
            <meshStandardMaterial color="#ffb700" emissive="#ffb700" emissiveIntensity={5} />
          </mesh>
        )}
      </group>
    </RigidBody>
  );
}
