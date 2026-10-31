import React, { useEffect, useRef, useState, useCallback } from 'react';

export type AsciiRenderMode = 
  | 'dots' 
  | 'characters' 
  | 'pixel' 
  | 'matrix' 
  | 'braille' 
  | 'rings' 
  | 'stars' 
  | 'hearts' 
  | 'triangles' 
  | 'lines';

export type AsciiTheme = 
  | 'sunset' 
  | 'moonlight' 
  | 'starry_night' 
  | 'cyberpunk' 
  | 'galaxy';

export type AsciiAnimStyle = 
  | 'pulse' 
  | 'wave' 
  | 'shimmer' 
  | 'ripple' 
  | 'flicker';

export interface AsciiArtCanvasProps {
  theme?: AsciiTheme;
  renderMode?: AsciiRenderMode;
  cellSize?: number;
  coverage?: number; // 0 - 100%
  invert?: boolean;
  contrast?: number; // 50 - 200
  brightness?: number; // -100 - 100
  saturation?: number; // 0 - 200
  grayscale?: number; // 0 - 100
  tint?: string;
  tintOpacity?: number; // 0 - 100
  animStyle?: AsciiAnimStyle;
  animSpeed?: number;
  animIntensity?: number;
  vignette?: boolean;
  scanLines?: boolean;
  bloom?: boolean;
  filmGrain?: boolean;
  imageUrl?: string;
  interactive?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const CHAR_SETS = {
  standard: [' ', '.', ':', '-', '=', '+', '*', '#', '%', '@'],
  matrix: ['0', '1', 'Z', 'X', '7', '9', 'T', 'K', 'M', '#'],
  braille: [' ', '⠁', '⠃', '⠇', '⠋', '⠓', '⠗', '⠟', '⠿', '⣿'],
};

export const AsciiArtCanvas: React.FC<AsciiArtCanvasProps> = ({
  theme = 'sunset',
  renderMode = 'dots',
  cellSize = 10,
  coverage = 100,
  invert = false,
  contrast = 115,
  brightness = 0,
  saturation = 100,
  grayscale = 0,
  tint,
  tintOpacity = 25,
  animStyle = 'pulse',
  animSpeed = 1,
  animIntensity = 50,
  vignette = true,
  scanLines = false,
  bloom = true,
  filmGrain = false,
  imageUrl,
  interactive = false,
  className = '',
  style,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const offscreenRef = useRef<HTMLCanvasElement | null>(null);
  const frameRef = useRef<number>(0);
  const startTimeRef = useRef<number>(performance.now());
  const mouseRef = useRef<{ x: number; y: number }>({ x: -1, y: -1 });
  const [loadedImage, setLoadedImage] = useState<HTMLImageElement | null>(null);

  // Load custom image if supplied
  useEffect(() => {
    if (!imageUrl) {
      setLoadedImage(null);
      return;
    }
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageUrl;
    img.onload = () => setLoadedImage(img);
    img.onerror = () => setLoadedImage(null);
  }, [imageUrl]);

  // Handle interaction tracking
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!interactive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }, [interactive]);

  const handleMouseLeave = useCallback(() => {
    mouseRef.current = { x: -1, y: -1 };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Set up offscreen canvas
    if (!offscreenRef.current) {
      offscreenRef.current = document.createElement('canvas');
    }
    const offscreen = offscreenRef.current;
    const offCtx = offscreen.getContext('2d', { willReadFrequently: true });
    if (!offCtx) return;

    let isRunning = true;

    // Draw procedural thematic scene onto offscreen canvas
    const drawProceduralScene = (width: number, height: number, time: number) => {
      offCtx.clearRect(0, 0, width, height);

      if (loadedImage) {
        // Draw image cover
        const hRatio = width / loadedImage.width;
        const vRatio = height / loadedImage.height;
        const ratio = Math.max(hRatio, vRatio);
        const centerShiftX = (width - loadedImage.width * ratio) / 2;
        const centerShiftY = (height - loadedImage.height * ratio) / 2;
        offCtx.drawImage(
          loadedImage,
          0,
          0,
          loadedImage.width,
          loadedImage.height,
          centerShiftX,
          centerShiftY,
          loadedImage.width * ratio,
          loadedImage.height * ratio
        );
        return;
      }

      switch (theme) {
        case 'sunset': {
          // Sunset: Warm glowing gradient with setting sun and mountain ridges
          const skyGrad = offCtx.createLinearGradient(0, 0, 0, height);
          skyGrad.addColorStop(0, '#1a0526');
          skyGrad.addColorStop(0.35, '#58102e');
          skyGrad.addColorStop(0.6, '#b91c1c');
          skyGrad.addColorStop(0.78, '#f97316');
          skyGrad.addColorStop(0.92, '#fde047');
          skyGrad.addColorStop(1, '#ffedd5');
          offCtx.fillStyle = skyGrad;
          offCtx.fillRect(0, 0, width, height);

          // Glowing Sun
          const sunY = height * 0.72 + Math.sin(time * 0.4) * 6;
          const sunX = width * 0.5;
          const sunRadius = Math.min(width, height) * 0.16;

          const sunGlow = offCtx.createRadialGradient(sunX, sunY, sunRadius * 0.2, sunX, sunY, sunRadius * 2.5);
          sunGlow.addColorStop(0, '#fffbeb');
          sunGlow.addColorStop(0.2, '#fef08a');
          sunGlow.addColorStop(0.5, 'rgba(249, 115, 22, 0.7)');
          sunGlow.addColorStop(1, 'rgba(239, 68, 68, 0)');
          offCtx.fillStyle = sunGlow;
          offCtx.beginPath();
          offCtx.arc(sunX, sunY, sunRadius * 2.5, 0, Math.PI * 2);
          offCtx.fill();

          offCtx.fillStyle = '#fffbeb';
          offCtx.beginPath();
          offCtx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
          offCtx.fill();

          // Distant mountains silhouette
          offCtx.fillStyle = '#170624';
          offCtx.beginPath();
          offCtx.moveTo(0, height);
          for (let x = 0; x <= width; x += 15) {
            const mY = height * 0.82 + Math.sin(x * 0.008) * 25 + Math.sin(x * 0.02) * 15;
            offCtx.lineTo(x, mY);
          }
          offCtx.lineTo(width, height);
          offCtx.closePath();
          offCtx.fill();
          break;
        }

        case 'moonlight': {
          // Moonlight: Deep midnight blues, luminous full moon, and ethereal clouds
          const moonGrad = offCtx.createLinearGradient(0, 0, 0, height);
          moonGrad.addColorStop(0, '#030712');
          moonGrad.addColorStop(0.4, '#0c1228');
          moonGrad.addColorStop(0.7, '#1e1b4b');
          moonGrad.addColorStop(1, '#090d1f');
          offCtx.fillStyle = moonGrad;
          offCtx.fillRect(0, 0, width, height);

          // Full Moon
          const moonX = width * 0.65;
          const moonY = height * 0.35 + Math.sin(time * 0.3) * 4;
          const moonR = Math.min(width, height) * 0.14;

          const moonGlow = offCtx.createRadialGradient(moonX, moonY, moonR * 0.5, moonX, moonY, moonR * 2.2);
          moonGlow.addColorStop(0, '#f0f9ff');
          moonGlow.addColorStop(0.3, 'rgba(186, 230, 253, 0.8)');
          moonGlow.addColorStop(0.7, 'rgba(56, 189, 248, 0.25)');
          moonGlow.addColorStop(1, 'transparent');
          offCtx.fillStyle = moonGlow;
          offCtx.beginPath();
          offCtx.arc(moonX, moonY, moonR * 2.2, 0, Math.PI * 2);
          offCtx.fill();

          offCtx.fillStyle = '#f8fafc';
          offCtx.beginPath();
          offCtx.arc(moonX, moonY, moonR, 0, Math.PI * 2);
          offCtx.fill();

          // Night ocean horizon / subtle reflection
          offCtx.fillStyle = '#060a17';
          offCtx.fillRect(0, height * 0.78, width, height * 0.22);

          // Water shimmer
          const shimGrad = offCtx.createLinearGradient(moonX - 70, height * 0.78, moonX + 70, height);
          shimGrad.addColorStop(0, 'rgba(186, 230, 253, 0.45)');
          shimGrad.addColorStop(1, 'rgba(56, 189, 248, 0.05)');
          offCtx.fillStyle = shimGrad;
          offCtx.fillRect(moonX - 50, height * 0.78, 100, height * 0.22);
          break;
        }

        case 'starry_night': {
          // Starry Night: Deep cosmic field with clustered stars and radiant nebula
          offCtx.fillStyle = '#03050c';
          offCtx.fillRect(0, 0, width, height);

          // Nebula clouds
          const nebula1 = offCtx.createRadialGradient(width * 0.3, height * 0.4, 20, width * 0.3, height * 0.4, width * 0.45);
          nebula1.addColorStop(0, 'rgba(168, 85, 247, 0.35)');
          nebula1.addColorStop(0.5, 'rgba(99, 102, 241, 0.18)');
          nebula1.addColorStop(1, 'transparent');
          offCtx.fillStyle = nebula1;
          offCtx.fillRect(0, 0, width, height);

          const nebula2 = offCtx.createRadialGradient(width * 0.75, height * 0.65, 30, width * 0.75, height * 0.65, width * 0.4);
          nebula2.addColorStop(0, 'rgba(6, 182, 212, 0.3)');
          nebula2.addColorStop(0.6, 'rgba(59, 130, 246, 0.15)');
          nebula2.addColorStop(1, 'transparent');
          offCtx.fillStyle = nebula2;
          offCtx.fillRect(0, 0, width, height);

          // Twinkling Star Points
          offCtx.fillStyle = '#ffffff';
          const seed = Math.floor(time * 2);
          for (let i = 0; i < 90; i++) {
            const sx = ((i * 127 + 43) % width);
            const sy = ((i * 311 + 97) % height);
            const twinkle = 0.5 + 0.5 * Math.sin(time * 2 + i);
            const r = (1 + (i % 3)) * twinkle;
            offCtx.beginPath();
            offCtx.arc(sx, sy, r, 0, Math.PI * 2);
            offCtx.fill();
          }
          break;
        }

        case 'cyberpunk': {
          // Cyberpunk: Neon grid, synthwave sun, electric magenta & cyan
          const cyberGrad = offCtx.createLinearGradient(0, 0, 0, height);
          cyberGrad.addColorStop(0, '#090117');
          cyberGrad.addColorStop(0.45, '#2b0638');
          cyberGrad.addColorStop(0.7, '#f43f5e');
          cyberGrad.addColorStop(0.72, '#06b6d4');
          cyberGrad.addColorStop(1, '#050a18');
          offCtx.fillStyle = cyberGrad;
          offCtx.fillRect(0, 0, width, height);

          // Segmented Neon Sun
          const cSunX = width * 0.5;
          const cSunY = height * 0.52;
          const cSunR = Math.min(width, height) * 0.18;

          const cGlow = offCtx.createRadialGradient(cSunX, cSunY, 10, cSunX, cSunY, cSunR * 1.8);
          cGlow.addColorStop(0, '#fde047');
          cGlow.addColorStop(0.4, '#f43f5e');
          cGlow.addColorStop(1, 'transparent');
          offCtx.fillStyle = cGlow;
          offCtx.beginPath();
          offCtx.arc(cSunX, cSunY, cSunR * 1.8, 0, Math.PI * 2);
          offCtx.fill();

          offCtx.fillStyle = '#f43f5e';
          offCtx.beginPath();
          offCtx.arc(cSunX, cSunY, cSunR, 0, Math.PI * 2);
          offCtx.fill();

          // Floor grid perspective
          offCtx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
          offCtx.lineWidth = 1.5;
          for (let gx = 0; gx <= width; gx += width / 12) {
            offCtx.beginPath();
            offCtx.moveTo(cSunX, cSunY);
            offCtx.lineTo(gx, height);
            offCtx.stroke();
          }
          break;
        }

        case 'galaxy': {
          // Galaxy: Deep cosmic spiral nebula
          offCtx.fillStyle = '#020208';
          offCtx.fillRect(0, 0, width, height);

          const centerX = width * 0.5;
          const centerY = height * 0.5;

          // Spiral arms
          for (let arm = 0; arm < 3; arm++) {
            const armOffset = (arm * Math.PI * 2) / 3;
            for (let d = 20; d < Math.min(width, height) * 0.45; d += 8) {
              const angle = armOffset + (d * 0.02) + time * 0.3;
              const px = centerX + Math.cos(angle) * d;
              const py = centerY + Math.sin(angle) * (d * 0.65);
              
              const particleGrad = offCtx.createRadialGradient(px, py, 1, px, py, 18);
              particleGrad.addColorStop(0, arm === 0 ? 'rgba(236, 72, 153, 0.6)' : arm === 1 ? 'rgba(168, 85, 247, 0.6)' : 'rgba(56, 189, 248, 0.6)');
              particleGrad.addColorStop(1, 'transparent');
              offCtx.fillStyle = particleGrad;
              offCtx.beginPath();
              offCtx.arc(px, py, 18, 0, Math.PI * 2);
              offCtx.fill();
            }
          }

          // Galaxy core
          const coreGlow = offCtx.createRadialGradient(centerX, centerY, 5, centerX, centerY, 70);
          coreGlow.addColorStop(0, '#ffffff');
          coreGlow.addColorStop(0.3, '#fbcfe8');
          coreGlow.addColorStop(0.7, '#c084fc');
          coreGlow.addColorStop(1, 'transparent');
          offCtx.fillStyle = coreGlow;
          offCtx.beginPath();
          offCtx.arc(centerX, centerY, 70, 0, Math.PI * 2);
          offCtx.fill();
          break;
        }
      }
    };

    const render = () => {
      if (!isRunning) return;

      const rect = canvas.getBoundingClientRect();
      const displayWidth = Math.floor(rect.width);
      const displayHeight = Math.floor(rect.height);

      if (displayWidth === 0 || displayHeight === 0) {
        frameRef.current = requestAnimationFrame(render);
        return;
      }

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const targetWidth = Math.floor(displayWidth * dpr);
      const targetHeight = Math.floor(displayHeight * dpr);

      if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        offscreen.width = targetWidth;
        offscreen.height = targetHeight;
      }

      const time = prefersReducedMotion ? 0 : ((performance.now() - startTimeRef.current) / 1000) * animSpeed;

      // 1. Draw scene to offscreen buffer
      drawProceduralScene(targetWidth, targetHeight, time);

      // 2. Read cell pixel data from offscreen canvas
      let imgData: ImageData;
      try {
        imgData = offCtx.getImageData(0, 0, targetWidth, targetHeight);
      } catch (e) {
        frameRef.current = requestAnimationFrame(render);
        return;
      }

      const pixels = imgData.data;

      // 3. Clear display canvas with dark backdrop
      ctx.fillStyle = '#07090e';
      ctx.fillRect(0, 0, targetWidth, targetHeight);

      const actualCellSize = Math.max(4, Math.floor(cellSize * dpr));
      const cols = Math.floor(targetWidth / actualCellSize);
      const rows = Math.floor(targetHeight / actualCellSize);

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = `bold ${Math.floor(actualCellSize * 0.95)}px monospace`;

      const coverageRatio = coverage / 100;
      const contrastMultiplier = contrast / 100;
      const intensityFactor = animIntensity / 100;

      // Mouse effect coordinate in target canvas scale
      const mouseActive = interactive && mouseRef.current.x >= 0;
      const mx = mouseRef.current.x * dpr;
      const my = mouseRef.current.y * dpr;

      // 4. Sample and draw each grid cell
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (coverageRatio < 1 && ((c * 17 + r * 31) % 100) / 100 > coverageRatio) {
            continue;
          }

          const centerX = Math.floor((c + 0.5) * actualCellSize);
          const centerY = Math.floor((r + 0.5) * actualCellSize);

          // Sample pixel color at center of cell
          const pixelIndex = (centerY * targetWidth + centerX) * 4;
          let red = pixels[pixelIndex] ?? 0;
          let green = pixels[pixelIndex + 1] ?? 0;
          let blue = pixels[pixelIndex + 2] ?? 0;

          // Luminance formula
          let lum = 0.299 * red + 0.587 * green + 0.114 * blue;

          // Contrast adjustment
          lum = ((lum - 128) * contrastMultiplier) + 128 + brightness;
          lum = Math.max(0, Math.min(255, lum));

          if (invert) {
            lum = 255 - lum;
            red = 255 - red;
            green = 255 - green;
            blue = 255 - blue;
          }

          // Dynamic animation offset
          let animOffset = 0;
          if (!prefersReducedMotion) {
            switch (animStyle) {
              case 'wave':
                animOffset = Math.sin((c * 0.12 + r * 0.08) + time * 2.5) * 35 * intensityFactor;
                break;
              case 'pulse':
                animOffset = Math.sin(time * 2.2) * 28 * intensityFactor;
                break;
              case 'shimmer':
                animOffset = (Math.sin(c * 9 + r * 13 + time * 4) > 0.6 ? 40 : -10) * intensityFactor;
                break;
              case 'ripple': {
                const dist = Math.hypot(c - cols / 2, r - rows / 2);
                animOffset = Math.sin(dist * 0.25 - time * 3) * 35 * intensityFactor;
                break;
              }
              case 'flicker':
                animOffset = ((Math.sin(time * 18 + r * 3) * Math.cos(time * 24 + c * 2)) * 30) * intensityFactor;
                break;
            }
          }

          // Interactive mouse distortion
          if (mouseActive) {
            const mDist = Math.hypot(centerX - mx, centerY - my);
            if (mDist < actualCellSize * 8) {
              const push = (1 - mDist / (actualCellSize * 8)) * 60;
              animOffset += push;
            }
          }

          const effectiveLum = Math.max(0, Math.min(255, lum + animOffset));
          const lumNormalized = effectiveLum / 255;

          if (effectiveLum < 12) continue; // Skip darkest background cells

          // Tint blending
          let finalColor: string;
          if (tint) {
            const tOp = tintOpacity / 100;
            finalColor = `rgba(${red}, ${green}, ${blue}, ${0.85 + 0.15 * lumNormalized})`;
          } else {
            finalColor = `rgb(${red}, ${green}, ${blue})`;
          }

          ctx.fillStyle = finalColor;
          ctx.strokeStyle = finalColor;

          // Draw shape according to renderMode
          switch (renderMode) {
            case 'dots': {
              const maxRadius = (actualCellSize / 2) * 0.92;
              const radius = Math.max(1, maxRadius * lumNormalized);
              ctx.beginPath();
              ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
              ctx.fill();
              break;
            }

            case 'characters': {
              const chars = CHAR_SETS.standard;
              const charIdx = Math.floor(lumNormalized * (chars.length - 1));
              ctx.fillText(chars[charIdx] || '.', centerX, centerY);
              break;
            }

            case 'matrix': {
              const chars = CHAR_SETS.matrix;
              const streamSeed = Math.floor((r + time * 6) % chars.length);
              ctx.fillStyle = `rgba(34, 197, 94, ${0.4 + 0.6 * lumNormalized})`;
              ctx.fillText(chars[streamSeed] || '0', centerX, centerY);
              break;
            }

            case 'braille': {
              const chars = CHAR_SETS.braille;
              const bIdx = Math.floor(lumNormalized * (chars.length - 1));
              ctx.fillText(chars[bIdx] || '⠄', centerX, centerY);
              break;
            }

            case 'pixel': {
              const pSize = actualCellSize * 0.95;
              ctx.fillRect(centerX - pSize / 2, centerY - pSize / 2, pSize, pSize);
              break;
            }

            case 'rings': {
              const rRadius = Math.max(2, (actualCellSize / 2) * lumNormalized);
              ctx.lineWidth = Math.max(1, actualCellSize * 0.15);
              ctx.beginPath();
              ctx.arc(centerX, centerY, rRadius, 0, Math.PI * 2);
              ctx.stroke();
              break;
            }

            case 'stars': {
              const starSize = (actualCellSize / 2) * lumNormalized;
              ctx.beginPath();
              ctx.moveTo(centerX, centerY - starSize);
              ctx.lineTo(centerX + starSize * 0.35, centerY);
              ctx.lineTo(centerX + starSize, centerY);
              ctx.lineTo(centerX + starSize * 0.45, centerY + starSize * 0.45);
              ctx.lineTo(centerX + starSize * 0.7, centerY + starSize);
              ctx.lineTo(centerX, centerY + starSize * 0.65);
              ctx.lineTo(centerX - starSize * 0.7, centerY + starSize);
              ctx.lineTo(centerX - starSize * 0.45, centerY + starSize * 0.45);
              ctx.lineTo(centerX - starSize, centerY);
              ctx.lineTo(centerX - starSize * 0.35, centerY);
              ctx.closePath();
              ctx.fill();
              break;
            }

            case 'hearts': {
              const hSize = (actualCellSize / 2) * lumNormalized;
              ctx.beginPath();
              ctx.arc(centerX - hSize * 0.35, centerY - hSize * 0.2, hSize * 0.4, Math.PI, 0, false);
              ctx.arc(centerX + hSize * 0.35, centerY - hSize * 0.2, hSize * 0.4, Math.PI, 0, false);
              ctx.lineTo(centerX, centerY + hSize * 0.7);
              ctx.closePath();
              ctx.fill();
              break;
            }

            case 'triangles': {
              const tSize = (actualCellSize / 2) * lumNormalized;
              ctx.beginPath();
              ctx.moveTo(centerX, centerY - tSize);
              ctx.lineTo(centerX + tSize, centerY + tSize);
              ctx.lineTo(centerX - tSize, centerY + tSize);
              ctx.closePath();
              ctx.fill();
              break;
            }

            case 'lines': {
              const lineLength = actualCellSize * lumNormalized;
              ctx.lineWidth = Math.max(1, actualCellSize * 0.2);
              ctx.beginPath();
              ctx.moveTo(centerX - lineLength / 2, centerY);
              ctx.lineTo(centerX + lineLength / 2, centerY);
              ctx.stroke();
              break;
            }
          }
        }
      }

      // 5. Post-processing effects
      // Bloom: soft ambient glow pass
      if (bloom) {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = 0.18;
        ctx.drawImage(canvas, 0, 0);
        ctx.restore();
      }

      // Scanlines effect
      if (scanLines) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
        for (let y = 0; y < targetHeight; y += 4 * dpr) {
          ctx.fillRect(0, y, targetWidth, 1.5 * dpr);
        }
      }

      // Vignette effect
      if (vignette) {
        const vGrad = ctx.createRadialGradient(
          targetWidth / 2,
          targetHeight / 2,
          Math.min(targetWidth, targetHeight) * 0.35,
          targetWidth / 2,
          targetHeight / 2,
          Math.max(targetWidth, targetHeight) * 0.75
        );
        vGrad.addColorStop(0, 'transparent');
        vGrad.addColorStop(1, 'rgba(7, 9, 14, 0.9)');
        ctx.fillStyle = vGrad;
        ctx.fillRect(0, 0, targetWidth, targetHeight);
      }

      // Film Grain
      if (filmGrain) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
        for (let i = 0; i < 400; i++) {
          const gx = Math.random() * targetWidth;
          const gy = Math.random() * targetHeight;
          ctx.fillRect(gx, gy, 1.5, 1.5);
        }
      }

      if (!prefersReducedMotion) {
        frameRef.current = requestAnimationFrame(render);
      }
    };

    frameRef.current = requestAnimationFrame(render);

    return () => {
      isRunning = false;
      cancelAnimationFrame(frameRef.current);
    };
  }, [
    theme,
    renderMode,
    cellSize,
    coverage,
    invert,
    contrast,
    brightness,
    saturation,
    grayscale,
    tint,
    tintOpacity,
    animStyle,
    animSpeed,
    animIntensity,
    vignette,
    scanLines,
    bloom,
    filmGrain,
    loadedImage,
    interactive,
  ]);

  return (
    <canvas
      ref={canvasRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`block w-full h-full ${className}`}
      style={style}
    />
  );
};

export default AsciiArtCanvas;
