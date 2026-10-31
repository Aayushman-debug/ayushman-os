/**
 * RobloxPlayer.tsx — Authentic Blocky Stylized Roblox-Inspired Avatar
 *
 * Proportions:
 * - Blocky Head with face features and stylish hair
 * - Blocky Torso with colorful shirt/hoodie
 * - Articulated Arms and Legs with procedural walk/run swing animation
 * - Rapier physics capsule, WASD movement, Space jump, Shift sprint
 * - Third-person smooth follow camera with mouse orbit
 */
import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { RigidBody, CapsuleCollider, RapierRigidBody } from '@react-three/rapier';
import { usePlayerControls } from '../player/usePlayerControls';
import { useIslandStore } from './useIslandStore';
import { islandAudio } from './islandAudio';
import RobloxAvatarMesh from './RobloxAvatarMesh';
import * as THREE from 'three';

const WALK_SPEED = 6;
const SPRINT_MULTIPLIER = 1.7;
const JUMP_IMPULSE = 9;
const CAM_DISTANCE = 7.5;
const CAM_HEIGHT = 3.8;
const CAM_LERP = 0.12;

// Camera yaw & pitch controlled by mouse drag
const camYaw = { current: 0 };
const camPitch = { current: 0.25 };
let isPointerDown = false;
let lastX = 0;
let lastY = 0;

export default function RobloxPlayer() {
  const rb = useRef<RapierRigidBody>(null);
  const avatarGroup = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const torsoRef = useRef<THREE.Group>(null);

  const keys = usePlayerControls();
  const { camera } = useThree();
  const { controlsLocked, setPlayerPosition, avatar, consumeTeleport } = useIslandStore();
  const onGround = useRef(true);
  const camTarget = useRef(new THREE.Vector3());
  const walkTime = useRef(0);
  const footstepTimer = useRef(0);

  const controlsLockedRef = useRef(controlsLocked);
  controlsLockedRef.current = controlsLocked;

  // Mouse orbit controls (supporting both Left-Click and Roblox-style Right-Click drag)
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      // Don't drag if clicking UI or if controls are locked
      if (controlsLockedRef.current) return;
      if (e.button !== 0 && e.button !== 2) return;
      if ((e.target as HTMLElement).closest('button, a, input, [role="dialog"], .pointer-events-auto')) return;
      isPointerDown = true;
      lastX = e.clientX;
      lastY = e.clientY;
    };
    const onUp = () => { isPointerDown = false; };
    const onMove = (e: MouseEvent) => {
      if (!isPointerDown || controlsLockedRef.current) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      camYaw.current -= dx * 0.004;
      camPitch.current = Math.max(0.08, Math.min(1.05, camPitch.current + dy * 0.0028));
      lastX = e.clientX;
      lastY = e.clientY;
    };
    const onContextMenu = (e: MouseEvent) => {
      // Prevent default right-click context menu when in 3D game canvas
      if (!controlsLockedRef.current) {
        const target = e.target as HTMLElement;
        if (target.tagName.toLowerCase() === 'canvas' || !target.closest('button, a, input, [role="dialog"], .pointer-events-auto')) {
          e.preventDefault();
        }
      }
    };

    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('contextmenu', onContextMenu);
    return () => {
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('contextmenu', onContextMenu);
    };
  }, []);

  useFrame((_state, delta) => {
    if (!rb.current) return;

    // Handle instant teleport/fast travel
    const warp = consumeTeleport();
    if (warp) {
      rb.current.wakeUp();
      rb.current.setTranslation({ x: warp[0], y: warp[1], z: warp[2] }, true);
      rb.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
      onGround.current = true;

      const snapPlayerPos = new THREE.Vector3(warp[0], warp[1], warp[2]);
      const snapCamHoriz = Math.cos(camPitch.current) * CAM_DISTANCE;
      const snapCamVert = Math.sin(camPitch.current) * CAM_DISTANCE + CAM_HEIGHT;
      const snapCamPos = new THREE.Vector3(
        warp[0] + Math.sin(camYaw.current) * snapCamHoriz,
        warp[1] + snapCamVert,
        warp[2] + Math.cos(camYaw.current) * snapCamHoriz
      );
      camera.position.copy(snapCamPos);
      camTarget.current.copy(snapPlayerPos).add(new THREE.Vector3(0, 1.2, 0));
      camera.lookAt(camTarget.current);
    }

    const pos = rb.current.translation();

    // Fall rescue: respawn at plaza if falling off island into void
    if (pos.y < -3.0) {
      rb.current.wakeUp();
      rb.current.setTranslation({ x: 0, y: 2.0, z: 4.8 }, true);
      rb.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
      onGround.current = true;
      islandAudio.playJump();
      return;
    }

    const k = keys.current;
    const isMoving = (k.forward || k.backward || k.left || k.right) && !controlsLocked;
    const speed = (k.sprint ? WALK_SPEED * SPRINT_MULTIPLIER : WALK_SPEED);

    // Build move vector relative to camera yaw
    const dir = new THREE.Vector3();
    if (!controlsLocked) {
      if (k.forward)  dir.z -= 1;
      if (k.backward) dir.z += 1;
      if (k.left)     dir.x -= 1;
      if (k.right)    dir.x += 1;
    }

    if (dir.lengthSq() > 0) {
      dir.normalize();
      dir.applyAxisAngle(new THREE.Vector3(0, 1, 0), camYaw.current);
    }

    // Apply linear velocity
    const vel = rb.current.linvel();
    if (Math.abs(vel.y) < 0.25) {
      onGround.current = true;
    }

    rb.current.setLinvel(
      { x: dir.x * speed, y: vel.y, z: dir.z * speed },
      true
    );

    // Jump
    if (k.jump && onGround.current && !controlsLocked) {
      rb.current.applyImpulse({ x: 0, y: JUMP_IMPULSE, z: 0 }, true);
      onGround.current = false;
      islandAudio.playJump();
    }

    // Smoothly rotate character toward movement heading
    if (dir.lengthSq() > 0 && avatarGroup.current) {
      const targetAngle = Math.atan2(dir.x, dir.z);
      avatarGroup.current.rotation.y = THREE.MathUtils.lerp(
        avatarGroup.current.rotation.y,
        targetAngle,
        0.2
      );
    }

    // ── Procedural Limb Walk / Run Animation ─────────────────────────
    if (isMoving && onGround.current) {
      const animSpeed = k.sprint ? 14 : 9;
      walkTime.current += delta * animSpeed;

      const swing = Math.sin(walkTime.current) * 0.75;
      if (leftArmRef.current)  leftArmRef.current.rotation.x = -swing;
      if (rightArmRef.current) rightArmRef.current.rotation.x = swing;
      if (leftLegRef.current)  leftLegRef.current.rotation.x = swing;
      if (rightLegRef.current) rightLegRef.current.rotation.x = -swing;

      // Subtle torso bob
      if (torsoRef.current) {
        torsoRef.current.position.y = 0.75 + Math.abs(Math.sin(walkTime.current)) * 0.05;
      }

      // Footstep audio
      footstepTimer.current += delta;
      const stepRate = k.sprint ? 0.24 : 0.38;
      if (footstepTimer.current >= stepRate) {
        islandAudio.playFootstep();
        footstepTimer.current = 0;
      }
    } else if (!onGround.current) {
      // Jump / Air pose
      if (leftArmRef.current)  leftArmRef.current.rotation.x = THREE.MathUtils.lerp(leftArmRef.current.rotation.x, -1.2, 0.2);
      if (rightArmRef.current) rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, -1.2, 0.2);
      if (leftLegRef.current)  leftLegRef.current.rotation.x = THREE.MathUtils.lerp(leftLegRef.current.rotation.x, 0.4, 0.2);
      if (rightLegRef.current) rightLegRef.current.rotation.x = THREE.MathUtils.lerp(rightLegRef.current.rotation.x, -0.2, 0.2);
    } else {
      // Idle pose — smooth reset
      if (leftArmRef.current)  leftArmRef.current.rotation.x = THREE.MathUtils.lerp(leftArmRef.current.rotation.x, 0, 0.15);
      if (rightArmRef.current) rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, 0, 0.15);
      if (leftLegRef.current)  leftLegRef.current.rotation.x = THREE.MathUtils.lerp(leftLegRef.current.rotation.x, 0, 0.15);
      if (rightLegRef.current) rightLegRef.current.rotation.x = THREE.MathUtils.lerp(rightLegRef.current.rotation.x, 0, 0.15);
      if (torsoRef.current)    torsoRef.current.position.y = 0.75;
      footstepTimer.current = 0;
    }

    // ── Third-person camera follow ──────────────────────────────────
    const playerPos = new THREE.Vector3(pos.x, pos.y, pos.z);
    setPlayerPosition([pos.x, pos.y, pos.z]);

    const camHorizDist = Math.cos(camPitch.current) * CAM_DISTANCE;
    const camVertDist = Math.sin(camPitch.current) * CAM_DISTANCE + CAM_HEIGHT;

    const desiredCamPos = new THREE.Vector3(
      pos.x + Math.sin(camYaw.current) * camHorizDist,
      Math.max(pos.y + camVertDist, pos.y + 0.9, 1.2),
      pos.z + Math.cos(camYaw.current) * camHorizDist
    );

    camera.position.lerp(desiredCamPos, CAM_LERP);
    camTarget.current.lerp(playerPos.clone().add(new THREE.Vector3(0, 1.2, 0)), CAM_LERP);
    camera.lookAt(camTarget.current);
  });

  return (
    <RigidBody
      ref={rb}
      colliders={false}
      mass={1}
      lockRotations
      onCollisionEnter={() => { onGround.current = true; }}
      position={[0, 1.8, 4.8]}
    >
      <CapsuleCollider args={[0.6, 0.45]} />

      {/* ── Roblox Stylized Character Mesh ──────────────────────────── */}
      <group ref={avatarGroup}>
        <RobloxAvatarMesh
          avatar={avatar}
          leftArmRef={leftArmRef}
          rightArmRef={rightArmRef}
          leftLegRef={leftLegRef}
          rightLegRef={rightLegRef}
          torsoRef={torsoRef}
        />
      </group>
    </RigidBody>
  );
}
