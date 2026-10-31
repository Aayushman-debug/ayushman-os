import React, { useEffect, useRef, useState } from 'react';

export const CursorSpotlight: React.FC = () => {
  const spotlightRef = useRef<HTMLDivElement | null>(null);
  const dotRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isHoveringClickable, setIsHoveringClickable] = useState(false);

  useEffect(() => {
    // Disable on touch devices or reduced motion
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isTouch || prefersReducedMotion) return;

    let mouseX = -100;
    let mouseY = -100;
    let spotlightX = -100;
    let spotlightY = -100;
    let dotX = -100;
    let dotY = -100;
    let animId = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isVisible) setIsVisible(true);

      // Check if hovering clickable element
      const target = e.target as HTMLElement | null;
      if (target) {
        const isClickable = !!target.closest('button, a, input, select, textarea, [role="button"], [role="option"], .cursor-pointer');
        setIsHoveringClickable(isClickable);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const loop = () => {
      // Smooth interpolation for the large spotlight
      spotlightX += (mouseX - spotlightX) * 0.12;
      spotlightY += (mouseY - spotlightY) * 0.12;

      // Faster interpolation for the precision cursor dot
      dotX += (mouseX - dotX) * 0.45;
      dotY += (mouseY - dotY) * 0.45;

      if (spotlightRef.current) {
        spotlightRef.current.style.transform = `translate3d(${spotlightX}px, ${spotlightY}px, 0)`;
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${dotX}px, ${dotY}px, 0)`;
      }

      animId = requestAnimationFrame(loop);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    animId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animId);
    };
  }, [isVisible]);

  return (
    <>
      {/* Ambient Large Cursor Spotlight Glow */}
      <div
        ref={spotlightRef}
        aria-hidden="true"
        className={`pointer-events-none fixed top-0 left-0 -ml-[250px] -mt-[250px] size-[500px] rounded-full z-40 transition-opacity duration-500 ease-out ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.08) 0%, rgba(6, 182, 212, 0.04) 35%, transparent 70%)',
          filter: 'blur(35px)',
          willChange: 'transform',
        }}
      />

      {/* Sleek Precision Cursor Follower Ring */}
      <div
        ref={dotRef}
        aria-hidden="true"
        className={`pointer-events-none fixed top-0 left-0 -ml-2 -mt-2 size-4 rounded-full border border-purple-400/50 z-50 transition-all duration-150 ease-out ${
          isVisible ? 'opacity-70' : 'opacity-0'
        } ${
          isHoveringClickable 
            ? 'scale-[2.4] border-cyan-400 bg-cyan-400/10 shadow-[0_0_15px_rgba(6,182,212,0.5)]' 
            : 'scale-100 bg-white/20 shadow-[0_0_10px_rgba(168,85,247,0.3)]'
        }`}
        style={{
          willChange: 'transform',
        }}
      />
    </>
  );
};

export default CursorSpotlight;
