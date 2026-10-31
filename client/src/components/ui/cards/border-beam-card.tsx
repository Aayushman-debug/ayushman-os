import React from 'react';
import { cn } from '@/lib/utils';

export interface BorderBeamCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  duration?: number;
  borderWidth?: number;
  beamColor?: string;
}

export const BorderBeamCard: React.FC<BorderBeamCardProps> = ({
  children,
  className = '',
  duration = 8,
  borderWidth = 1.5,
  beamColor = 'from-transparent via-cyan-400 to-purple-500',
  ...props
}) => {
  return (
    <div
      className={cn(
        "relative rounded-2xl p-[1px] overflow-hidden group shadow-2xl",
        className
      )}
      {...props}
    >
      {/* Animated Rotating Conic Luminous Border Beam */}
      <div
        className="pointer-events-none absolute inset-[-100%] animate-[spin_8s_linear_infinite]"
        style={{
          background: `conic-gradient(from 0deg at 50% 50%, transparent 0deg, rgba(6,182,212,0.8) 60deg, rgba(168,85,247,0.9) 110deg, transparent 180deg)`,
          animationDuration: `${duration}s`,
        }}
      />

      {/* Subtle border backdrop glow */}
      <div className="absolute inset-0 rounded-2xl border border-white/10 pointer-events-none" />

      {/* Inner Solid Card Body */}
      <div className="relative size-full rounded-[calc(1rem-1px)] bg-[#0b0e18] z-10">
        {children}
      </div>
    </div>
  );
};

export default BorderBeamCard;
