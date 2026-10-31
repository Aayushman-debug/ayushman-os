import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export interface GalaxyBackgroundProps {
  className?: string;
  /** Optional subtle pulse multiplier when hovering primary hero elements */
  interactiveBoost?: boolean;
}

export const GalaxyBackground: React.FC<GalaxyBackgroundProps> = ({
  className = '',
  interactiveBoost = false,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const boostRef = useRef(interactiveBoost);
  const [webglFailed, setWebglFailed] = useState(false);

  useEffect(() => {
    boostRef.current = interactiveBoost;
  }, [interactiveBoost]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Respect prefers-reduced-motion
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        powerPreference: 'high-performance',
        alpha: true,
      });
      if (!renderer || !renderer.getContext()) {
        throw new Error('WebGL context unavailable');
      }
    } catch {
      setWebglFailed(true);
      return;
    }

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x02030a, 0.006);

    const camera = new THREE.PerspectiveCamera(52, width / height, 0.1, 400);
    // Position the camera so the luminous galaxy core aligns cleanly behind the AYushMan hero wordmark
    camera.position.set(0, 8.2, 22.5);
    camera.lookAt(0, -1.1, 0);

    const galaxyGroup = new THREE.Group();
    galaxyGroup.rotation.x = 0.24;
    galaxyGroup.rotation.z = -0.08;
    scene.add(galaxyGroup);

    // Adaptive particle count based on viewport / device capability
    const isMobile = width < 768;
    const isLowConcurrency =
      typeof navigator !== 'undefined' &&
      navigator.hardwareConcurrency &&
      navigator.hardwareConcurrency <= 4;
    const STAR_COUNT = isMobile ? 8500 : isLowConcurrency ? 12000 : 18000;
    const ARMS = 5;
    const RADIUS = 17;

    const positions = new Float32Array(STAR_COUNT * 3);
    const colors = new Float32Array(STAR_COUNT * 3);
    const scales = new Float32Array(STAR_COUNT);

    const insideColor = new THREE.Color('#ffe7c2');
    const armColors = [
      new THREE.Color('#9b67ff'),
      new THREE.Color('#64baff'),
      new THREE.Color('#ff76c8'),
      new THREE.Color('#fff3d1'),
    ];

    for (let i = 0; i < STAR_COUNT; i++) {
      const i3 = i * 3;
      const radius = Math.pow(Math.random(), 1.55) * RADIUS;
      const armIndex = i % ARMS;
      const baseAngle = (armIndex / ARMS) * Math.PI * 2;
      const spinAngle = radius * 0.62;

      const spread = (0.18 + radius / RADIUS) * 1.35;
      const randomX =
        Math.pow(Math.random(), 2.2) * (Math.random() < 0.5 ? 1 : -1) * spread;
      const randomY =
        Math.pow(Math.random(), 2.8) * (Math.random() < 0.5 ? 1 : -1) * (spread * 0.34);
      const randomZ =
        Math.pow(Math.random(), 2.2) * (Math.random() < 0.5 ? 1 : -1) * spread;

      const angle = baseAngle + spinAngle;
      positions[i3] = Math.cos(angle) * radius + randomX;
      positions[i3 + 1] = randomY;
      positions[i3 + 2] = Math.sin(angle) * radius + randomZ;

      const targetColor = armColors[armIndex % armColors.length].clone();
      const mixedColor = insideColor.clone().lerp(targetColor, radius / RADIUS);
      mixedColor.offsetHSL(
        (Math.random() - 0.5) * 0.05,
        0.05,
        (Math.random() - 0.5) * 0.08
      );

      colors[i3] = mixedColor.r;
      colors[i3 + 1] = mixedColor.g;
      colors[i3 + 2] = mixedColor.b;
      scales[i] = Math.random() * 2.2 + 0.4;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));

    const pixelRatio = renderer.getPixelRatio();
    const starMaterial = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: 26 * pixelRatio },
        uPulse: { value: 0 },
      },
      vertexShader: `
        uniform float uTime;
        uniform float uSize;
        uniform float uPulse;
        attribute float aScale;
        varying vec3 vColor;

        void main() {
          vColor = color;
          vec3 pos = position;
          float dist = length(pos.xz);
          float wave = sin(dist * 1.4 - uTime * 2.2) * 0.12 * uPulse;
          pos.y += wave;
          pos.xz *= 1.0 + uPulse * 0.045 * sin(dist - uTime * 3.0);

          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = uSize * aScale * (1.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;

        void main() {
          float d = distance(gl_PointCoord, vec2(0.5));
          float strength = smoothstep(0.5, 0.0, d);
          strength = pow(strength, 2.2);
          gl_FragColor = vec4(vColor, strength);
        }
      `,
    });

    const galaxy = new THREE.Points(geometry, starMaterial);
    galaxyGroup.add(galaxy);

    // Warm luminous central core glow sprite + core sphere
    const makeGlowTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const gradient = ctx.createRadialGradient(128, 128, 6, 128, 128, 128);
        gradient.addColorStop(0, 'rgba(255, 247, 222, 1)');
        gradient.addColorStop(0.24, 'rgba(255, 198, 132, 0.85)');
        gradient.addColorStop(0.55, 'rgba(146, 102, 255, 0.34)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 256, 256);
      }
      return new THREE.CanvasTexture(canvas);
    };

    const glowTexture = makeGlowTexture();
    const coreGlowMaterial = new THREE.SpriteMaterial({
      map: glowTexture,
      color: 0xffffff,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const coreGlow = new THREE.Sprite(coreGlowMaterial);
    coreGlow.scale.set(9.5, 9.5, 1);
    galaxyGroup.add(coreGlow);

    const coreGeometry = new THREE.SphereGeometry(0.62, 32, 32);
    const coreMaterial = new THREE.MeshBasicMaterial({
      color: 0xfff0c4,
      transparent: true,
      opacity: 0.95,
    });
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    galaxyGroup.add(core);

    // Distant ambient background starfield
    const bgCount = isMobile ? 1800 : 3500;
    const bgPos = new Float32Array(bgCount * 3);
    for (let i = 0; i < bgCount; i++) {
      const i3 = i * 3;
      const r = 45 + Math.random() * 140;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      bgPos[i3] = r * Math.sin(phi) * Math.cos(theta);
      bgPos[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      bgPos[i3 + 2] = r * Math.cos(phi);
    }

    const bgGeo = new THREE.BufferGeometry();
    bgGeo.setAttribute('position', new THREE.BufferAttribute(bgPos, 3));
    const bgMat = new THREE.PointsMaterial({
      color: 0xdce7ff,
      size: 0.35,
      transparent: true,
      opacity: 0.65,
      depthWrite: false,
    });
    const backgroundStars = new THREE.Points(bgGeo, bgMat);
    scene.add(backgroundStars);

    // Subtle pointer and scroll parallax state
    let targetPointerX = 0;
    let targetPointerY = 0;
    let currentPointerX = 0;
    let currentPointerY = 0;
    let targetScrollY = 0;
    let currentScrollY = 0;
    let pulseStrength = 0;

    const handlePointerMove = (e: PointerEvent) => {
      if (prefersReducedMotion) return;
      const nx = (e.clientX / Math.max(window.innerWidth, 1)) * 2 - 1;
      const ny = (e.clientY / Math.max(window.innerHeight, 1)) * 2 - 1;
      targetPointerX = nx;
      targetPointerY = ny;
    };

    const handleScroll = () => {
      targetScrollY = window.scrollY || 0;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    let isTabHidden = document.hidden;
    const handleVisibilityChange = () => {
      isTabHidden = document.hidden;
      if (!isTabHidden) {
        clock.getDelta(); // reset delta spike after tab switch
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const handleResize = () => {
      if (!container || !renderer) return;
      const newW = container.clientWidth || window.innerWidth;
      const newH = container.clientHeight || window.innerHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(newW, newH);
      starMaterial.uniforms.uSize.value = 26 * renderer.getPixelRatio();
    };
    window.addEventListener('resize', handleResize);

    const clock = new THREE.Clock();
    let elapsed = 0;
    let frameId = 0;

    const animate = () => {
      frameId = window.requestAnimationFrame(animate);
      if (isTabHidden || !renderer) return;

      const dt = Math.min(clock.getDelta(), 0.05);
      elapsed += dt;

      const rotationSpeed = prefersReducedMotion ? 0.01 : 0.045;
      galaxy.rotation.y += dt * rotationSpeed;
      backgroundStars.rotation.y -= dt * (prefersReducedMotion ? 0.001 : 0.004);

      const targetBoost = boostRef.current ? 0.65 : 0;
      pulseStrength = THREE.MathUtils.lerp(pulseStrength, targetBoost, dt * 2.4);

      const breathe =
        1 + Math.sin(elapsed * 1.7) * 0.06 + pulseStrength * 0.22;
      coreGlow.scale.set(9.5 * breathe, 9.5 * breathe, 1);

      currentPointerX = THREE.MathUtils.lerp(currentPointerX, targetPointerX, dt * 2.5);
      currentPointerY = THREE.MathUtils.lerp(currentPointerY, targetPointerY, dt * 2.5);
      currentScrollY = THREE.MathUtils.lerp(currentScrollY, targetScrollY, dt * 4.0);

      const scrollFactor = Math.min(currentScrollY / 900, 1.4);

      // Gentle pointer & scroll parallax on galaxy orientation and camera
      galaxyGroup.rotation.x = 0.24 + currentPointerY * 0.08 + scrollFactor * 0.14;
      galaxyGroup.rotation.z = -0.08 - currentPointerX * 0.06;

      camera.position.x = currentPointerX * 1.35;
      camera.position.y = 8.2 - currentPointerY * 0.9 + scrollFactor * 1.8;
      camera.position.z = 22.5 + scrollFactor * 4.2;
      camera.lookAt(0, -1.1 - scrollFactor * 0.8, 0);

      starMaterial.uniforms.uTime.value = elapsed;
      starMaterial.uniforms.uPulse.value = pulseStrength;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);

      geometry.dispose();
      starMaterial.dispose();
      glowTexture.dispose();
      coreGlowMaterial.dispose();
      coreGeometry.dispose();
      coreMaterial.dispose();
      bgGeo.dispose();
      bgMat.dispose();
      renderer?.dispose();
      if (renderer?.domElement && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      className={`pointer-events-none select-none overflow-hidden bg-[#02030a] ${className}`}
      aria-hidden="true"
    >
      {/* Fallback CSS Starfield & Nebula when WebGL is unavailable */}
      {webglFailed ? (
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 50% 44%, rgba(255, 224, 178, 0.28) 0%, rgba(155, 103, 255, 0.22) 24%, rgba(100, 186, 255, 0.12) 45%, #02030a 78%)',
          }}
        />
      ) : (
        <div ref={mountRef} className="absolute inset-0 w-full h-full" />
      )}

      {/* Subtle radial vignette and vertical readability falloff */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 42%, rgba(2, 3, 10, 0.12) 0%, rgba(2, 3, 10, 0.42) 56%, rgba(2, 3, 10, 0.88) 100%)',
        }}
      />
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#02030a]/80 via-[#02030a]/30 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-[#02030a] via-[#02030a]/80 to-transparent" />
    </div>
  );
};

export default GalaxyBackground;
