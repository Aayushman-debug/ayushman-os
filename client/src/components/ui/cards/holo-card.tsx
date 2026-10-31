import React, { useRef, useState, useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { usePortfolioTheme } from '@/themes/usePortfolioTheme';

export interface HoloCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  holoColor?: string;
  accentColor?: string;
  isSelected?: boolean;
}

export const HoloCard: React.FC<HoloCardProps> = ({
  children,
  className = '',
  maxTilt = 8,
  holoColor = 'rgba(6, 182, 212, 0.24)',
  accentColor = '#06b6d4',
  isSelected = false,
  ...props
}) => {
  const { theme } = usePortfolioTheme();
  const shouldTilt = theme === 'default' || theme === 'liquid' || theme === 'play';
  const activeMaxTilt = theme === 'liquid' ? Math.min(maxTilt, 3) : theme === 'play' ? Math.min(maxTilt, 4) : maxTilt;
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [glare, setGlare] = useState<{ x: number; y: number; opacity: number }>({ x: 50, y: 50, opacity: 0 });
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || !shouldTilt || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -activeMaxTilt;
    const rotateY = ((x - centerX) / centerX) * activeMaxTilt;

    setTilt({ x: rotateX, y: rotateY });
    setGlare({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.72
    });
  }, [activeMaxTilt, prefersReducedMotion, shouldTilt]);

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
    setGlare(prev => ({ ...prev, opacity: 0 }));
  }, []);

  const handleTouchStart = useCallback(() => {
    if (prefersReducedMotion) return;
    setGlare(prev => ({ ...prev, opacity: prev.opacity > 0 ? 0 : 0.55 }));
  }, [prefersReducedMotion]);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      className={cn(
        "relative rounded-2xl border bg-[#0b0e18]/95 overflow-hidden transition-all duration-300 group select-none",
        isSelected
          ? "border-white/45 shadow-[0_14px_40px_-10px_rgba(168,85,247,0.35)] ring-1 ring-white/25"
          : "border-white/10 hover:border-white/25 shadow-2xl",
        className
      )}
      data-portfolio-card="holo"
      style={{
        transform: prefersReducedMotion
          ? 'none'
          : shouldTilt
            ? `perspective(1150px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(0)`
            : undefined,
        transformStyle: 'preserve-3d',
        transition:
          tilt.x === 0 && tilt.y === 0
            ? 'transform 0.55s cubic-bezier(0.22, 1, 0.36, 1), border-color 0.3s ease, box-shadow 0.3s ease'
            : 'border-color 0.3s ease, box-shadow 0.3s ease',
        willChange: prefersReducedMotion ? 'auto' : 'transform',
      }}
      {...props}
    >
      {/* 1. Card Content Layer (Crisp & Unobstructed) */}
      <div className="relative z-10 size-full">
        {children}
      </div>

      {/* 2. Collectible Holographic Prismatic Foil Sheen (Subtle over artwork on hover) */}
      <div
        className="pointer-events-none absolute -inset-full opacity-0 group-hover:opacity-90 transition-opacity duration-500 z-20 mix-blend-screen"
        style={{
          background: `linear-gradient(
            ${118 + tilt.y * 4}deg,
            transparent 20%,
            rgba(255, 0, 128, 0.11) 34%,
            rgba(0, 230, 255, 0.14) 46%,
            rgba(120, 255, 140, 0.10) 56%,
            rgba(255, 220, 0, 0.12) 68%,
            rgba(168, 85, 247, 0.13) 78%,
            transparent 88%
          )`,
          transform: `translate(${tilt.y * 5}px, ${tilt.x * 5}px)`,
        }}
      />

      {/* 3. Collectible Foil Micro-Sparkle Matrix */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-25 transition-opacity duration-500 z-20"
        style={{
          backgroundImage: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.28) 1px, transparent 1px)`,
          backgroundSize: '16px 16px',
        }}
      />

      {/* 4. Focused Radial Specular Glare & Game Accent Aura */}
      <div
        className="pointer-events-none absolute inset-0 z-20 transition-opacity duration-300 rounded-2xl"
        style={{
          opacity: glare.opacity,
          background: `radial-gradient(circle 260px at ${glare.x}% ${glare.y}%, rgba(255, 255, 255, 0.12), ${holoColor} 40%, transparent 75%)`,
        }}
      />

      {/* 5. Top & Bottom Metallic Collector Rim */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[2px] z-30 opacity-70 group-hover:opacity-100 transition-opacity"
        style={{
          background: `linear-gradient(90deg, transparent, ${accentColor}, #ffffff90, ${accentColor}, transparent)`,
        }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[1px] z-30 opacity-30 group-hover:opacity-80 transition-opacity"
        style={{
          background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
        }}
      />
    </div>
  );
};

export default HoloCard;
