import React, { useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { ExternalLink, Play, Disc3 } from 'lucide-react';
import { SmartImage, ImageCategory } from '@/components/ui/smart-image';
import { usePortfolioTheme } from '@/themes/usePortfolioTheme';

export interface MediaCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  imageUrl?: string;
  fallbackImageUrl?: string;
  category?: ImageCategory;
  badge?: string;
  badgeColor?: string;
  aspectRatio?: 'square' | 'portrait' | 'video';
  primaryActionLabel?: string;
  primaryActionUrl?: string;
  onPlayClick?: () => void;
  isActive?: boolean;
  enableVinylReveal?: boolean;
  children?: React.ReactNode;
}

export const MediaCard: React.FC<MediaCardProps> = ({
  title,
  subtitle,
  imageUrl,
  fallbackImageUrl,
  category = 'music',
  badge,
  badgeColor = 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
  aspectRatio = 'square',
  primaryActionLabel,
  primaryActionUrl,
  onPlayClick,
  isActive = false,
  enableVinylReveal = true,
  children,
  className = '',
  ...props
}) => {
  const { theme } = usePortfolioTheme();
  const shouldTilt = theme === 'default' || theme === 'liquid' || theme === 'play';
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, gx: 50, gy: 50, hovered: false });

  const aspectClass = {
    square: 'aspect-square',
    portrait: 'aspect-[3/4]',
    video: 'aspect-video',
  }[aspectRatio];

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!shouldTilt || !cardRef.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const tiltStrength = theme === 'liquid' ? 3 : theme === 'play' ? 4 : 8;
    setTilt({
      rx: (0.5 - y) * tiltStrength,
      ry: (x - 0.5) * tiltStrength,
      gx: x * 100,
      gy: y * 100,
      hovered: true,
    });
  };

  const handlePointerLeave = () => {
    setTilt({ rx: 0, ry: 0, gx: 50, gy: 50, hovered: false });
  };

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{
        transform: shouldTilt
          ? tilt.hovered
            ? `perspective(900px) rotateX(${tilt.rx.toFixed(2)}deg) rotateY(${tilt.ry.toFixed(2)}deg) translateY(-4px)${theme === 'play' ? ' scale(1.025)' : ''}`
            : 'perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0px)'
          : undefined,
        transition: theme === 'play'
          ? 'transform 420ms cubic-bezier(0.34, 1.56, 0.64, 1), border-color 250ms ease, box-shadow 250ms ease'
          : tilt.hovered
            ? 'transform 120ms ease-out, border-color 250ms ease, box-shadow 250ms ease'
            : 'transform 400ms cubic-bezier(0.22, 1, 0.36, 1), border-color 250ms ease, box-shadow 250ms ease',
      }}
      className={cn(
        'group relative rounded-2xl bg-[#0b0e18]/90 border overflow-hidden flex flex-col justify-between shadow-xl',
        isActive
          ? 'border-emerald-400/70 shadow-[0_0_32px_rgba(16,185,129,0.28)] ring-1 ring-emerald-400/40'
          : 'border-white/10 hover:border-emerald-400/40 hover:shadow-[0_20px_50px_rgba(0,0,0,0.75)]',
        className
      )}
      data-portfolio-card="media"
      {...props}
    >
      {/* Artwork Sleeve Container */}
      <div className={cn('relative w-full overflow-hidden bg-[#060810]', aspectClass)}>
        
        {/* Subtle Vinyl Disc Peek on Hover or Active (Music Variant) */}
        {enableVinylReveal && category === 'music' && (
          <div
            aria-hidden="true"
            className={cn(
              'absolute right-3 top-1/2 -translate-y-1/2 size-[76%] rounded-full bg-gradient-to-br from-neutral-900 via-black to-neutral-800 border-2 border-white/15 shadow-2xl flex items-center justify-center transition-all duration-500 pointer-events-none z-0',
              isActive
                ? 'translate-x-5 opacity-95 animate-[spin_14s_linear_infinite]'
                : 'translate-x-0 opacity-0 group-hover:translate-x-4 group-hover:opacity-90'
            )}
          >
            <div className="size-[86%] rounded-full border border-white/10 flex items-center justify-center">
              <div className="size-[64%] rounded-full border border-white/10 flex items-center justify-center">
                <div className="size-8 rounded-full bg-emerald-500/30 border border-emerald-400/50 flex items-center justify-center">
                  <Disc3 className="size-4 text-emerald-300" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Album Cover Sleeve */}
        <div
          className={cn(
            'relative z-10 size-full overflow-hidden transition-transform duration-500 ease-out shadow-2xl',
            enableVinylReveal && category === 'music'
              ? isActive
                ? 'w-[90%] rounded-r-xl'
                : 'w-full group-hover:w-[92%] group-hover:rounded-r-xl'
              : 'w-full'
          )}
        >
          <SmartImage
            src={imageUrl}
            fallbackSrc={fallbackImageUrl}
            alt={title}
            category={category}
            fallbackLabel={title}
            containerClassName="size-full"
            className="size-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />

          {/* Pointer-reactive Soft Glare */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-300"
            style={{
              opacity: tilt.hovered ? 0.28 : 0,
              background: `radial-gradient(circle at ${tilt.gx}% ${tilt.gy}%, rgba(255,255,255,0.45), transparent 60%)`,
            }}
          />

          {/* Ambient Dark Bottom Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e18]/90 via-transparent to-black/25 pointer-events-none" />
        </div>

        {/* Top Badges */}
        <div className="absolute top-3 inset-x-3 z-20 flex items-center justify-between gap-2 pointer-events-none">
          {badge && (
            <span
              className={cn(
                'text-[10px] font-mono px-2.5 py-0.5 rounded-full border backdrop-blur-md font-semibold shadow-md',
                badgeColor
              )}
            >
              {badge}
            </span>
          )}

          {isActive && (
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/25 border border-emerald-400/50 text-[10px] font-mono text-emerald-200 backdrop-blur-md shadow-md">
              {/* Restrained 3-bar Equalizer Indicator */}
              <span className="flex items-end gap-0.5 h-2.5">
                <span className="w-0.5 h-2 bg-emerald-400 animate-pulse" />
                <span className="w-0.5 h-2.5 bg-emerald-300 animate-bounce" />
                <span className="w-0.5 h-1.5 bg-emerald-400 animate-pulse" />
              </span>
              <span className="font-bold">Playing</span>
            </div>
          )}
        </div>

        {/* Hover Quick Play Overlay Action */}
        {onPlayClick && (
          <div className="absolute inset-0 z-20 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center pointer-events-auto">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPlayClick();
              }}
              className="size-12 rounded-full bg-[#1DB954] hover:bg-[#1ed760] text-black flex items-center justify-center shadow-[0_0_25px_rgba(29,185,84,0.6)] hover:scale-110 active:scale-95 transition-all cursor-pointer"
              title={`Load & Play ${title}`}
            >
              <Play className="size-5 fill-black ml-0.5" />
            </button>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="p-4 flex flex-col justify-between flex-1 gap-3 relative z-10 bg-[#0b0e18]">
        <div>
          <h4 className="text-sm font-bold text-white tracking-tight line-clamp-1 group-hover:text-emerald-300 transition-colors">
            {title}
          </h4>
          {subtitle && (
            <p className="text-xs text-neutral-400 mt-1 line-clamp-1 font-mono">
              {subtitle}
            </p>
          )}
        </div>

        {children}

        {/* Action Button Bar */}
        {primaryActionUrl && (
          <div className="pt-2.5 border-t border-white/[0.07] flex items-center justify-between text-xs">
            <a
              href={primaryActionUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 font-semibold text-neutral-400 hover:text-white transition group/link"
            >
              <span>{primaryActionLabel || 'Open link'}</span>
              <ExternalLink className="size-3 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
            </a>

            {onPlayClick && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onPlayClick();
                }}
                className={cn(
                  'text-[11px] font-mono font-semibold cursor-pointer px-2 py-0.5 rounded-md transition',
                  isActive
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'text-cyan-400 hover:text-cyan-300 hover:bg-white/5'
                )}
              >
                {isActive ? '● Active' : 'Load Player'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaCard;
