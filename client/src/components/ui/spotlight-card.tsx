import React, { useRef, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { usePortfolioTheme } from '@/themes/usePortfolioTheme';

export interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
  enableTilt?: boolean;
  maxTilt?: number;
}

export const SpotlightCard: React.FC<SpotlightCardProps> = ({
  children,
  className = '',
  spotlightColor = 'rgba(168, 85, 247, 0.15)',
  enableTilt = true,
  maxTilt = 7,
  ...props
}) => {
  const { theme } = usePortfolioTheme();
  const shouldTilt = enableTilt && (theme === 'default' || theme === 'liquid');
  const activeMaxTilt = theme === 'liquid' ? Math.min(maxTilt, 3.5) : maxTilt;
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState<number>(0);
  const [tilt, setTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setPosition({ x, y });
    setOpacity(1);

    if (shouldTilt && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -activeMaxTilt;
      const rotateY = ((x - centerX) / centerX) * activeMaxTilt;
      setTilt({ x: rotateX, y: rotateY });
    }
  }, [shouldTilt, activeMaxTilt]);

  const handleMouseEnter = useCallback(() => {
    setOpacity(1);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setOpacity(0);
    setTilt({ x: 0, y: 0 });
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative rounded-2xl border border-white/10 bg-[#0b0e18] overflow-hidden transition-all duration-300 group",
        className
      )}
      data-portfolio-card="spotlight"
      style={{
        transform: shouldTilt
          ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(0)`
          : undefined,
        transition: tilt.x === 0 && tilt.y === 0 ? 'transform 0.5s ease-out, border-color 0.3s ease' : 'border-color 0.3s ease',
        willChange: shouldTilt ? 'transform' : undefined,
      }}
      {...props}
    >
      {/* Dynamic Cursor Spotlight Border illumination */}
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 z-10"
        style={{
          opacity,
          background: `radial-gradient(350px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 70%)`,
        }}
      />

      {/* Surface glow layer */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 z-0"
        style={{
          opacity: opacity * 0.4,
          background: `radial-gradient(280px circle at ${position.x}px ${position.y}px, rgba(6, 182, 212, 0.12), transparent 70%)`,
        }}
      />

      {/* Card Content */}
      <div className="relative z-20 size-full">
        {children}
      </div>
    </div>
  );
};

export default SpotlightCard;
