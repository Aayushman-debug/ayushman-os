import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Gamepad2, Film, Disc3, Code2, GraduationCap, Share2, Sparkles } from 'lucide-react';

export type ImageCategory = 'gaming' | 'anime' | 'music' | 'project' | 'academic' | 'social' | 'general';
export type SmartImageCategory = ImageCategory;

export interface SmartImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  fallbackSrc?: string;
  alt: string;
  category?: ImageCategory;
  fallbackLabel?: string;
  accentColor?: string;
  containerClassName?: string;
  fit?: 'cover' | 'contain';
}

const CATEGORY_CONFIG: Record<
  ImageCategory,
  { gradient: string; border: string; icon: React.ComponentType<{ className?: string }>; tag: string }
> = {
  gaming: {
    gradient: 'from-[#0c1428] via-[#13112c] to-[#1f1209]',
    border: 'border-amber-500/20',
    icon: Gamepad2,
    tag: 'GAME ARTWORK',
  },
  anime: {
    gradient: 'from-[#1a0b1e] via-[#0d1021] to-[#081a24]',
    border: 'border-pink-500/20',
    icon: Film,
    tag: 'KEY VISUAL',
  },
  music: {
    gradient: 'from-[#061c14] via-[#0b131e] to-[#170d26]',
    border: 'border-emerald-500/20',
    icon: Disc3,
    tag: 'AUDIO COVER',
  },
  project: {
    gradient: 'from-[#071120] via-[#0d172a] to-[#130f26]',
    border: 'border-cyan-500/20',
    icon: Code2,
    tag: 'SYSTEM BUILD',
  },
  academic: {
    gradient: 'from-[#071521] via-[#0a1929] to-[#0b111e]',
    border: 'border-cyan-500/20',
    icon: GraduationCap,
    tag: 'RTU ARCHIVE',
  },
  social: {
    gradient: 'from-[#110a1f] via-[#0c1224] to-[#080d18]',
    border: 'border-purple-500/20',
    icon: Share2,
    tag: 'PLATFORM PROFILE',
  },
  general: {
    gradient: 'from-[#0a0d18] via-[#111526] to-[#070910]',
    border: 'border-white/10',
    icon: Sparkles,
    tag: 'AYUSHMAN',
  },
};

export const SmartImage: React.FC<SmartImageProps> = ({
  src,
  fallbackSrc,
  alt,
  category = 'general',
  fallbackLabel,
  accentColor,
  className = '',
  containerClassName = '',
  fit = 'cover',
  loading = 'eager',
  ...rest
}) => {
  const [failedPrimary, setFailedPrimary] = useState<string | null>(null);
  const [failedFallback, setFailedFallback] = useState<string | null>(null);

  const cleanSrc = src?.trim() || '';
  const cleanFallback = fallbackSrc?.trim() || '';

  const usePrimary = Boolean(cleanSrc && failedPrimary !== cleanSrc);
  const useSecondary = !usePrimary && Boolean(cleanFallback && failedFallback !== cleanFallback);
  const activeUrl = usePrimary ? cleanSrc : useSecondary ? cleanFallback : '';

  const cfg = CATEGORY_CONFIG[category] || CATEGORY_CONFIG.general;
  const Icon = cfg.icon;

  return (
    <div className={cn('relative overflow-hidden bg-[#080b14]', containerClassName)}>
      {activeUrl ? (
        <img
          key={activeUrl}
          src={activeUrl}
          alt={alt}
          loading={loading}
          decoding="async"
          onError={() => {
            if (usePrimary) {
              setFailedPrimary(cleanSrc);
            } else if (useSecondary) {
              setFailedFallback(cleanFallback);
            }
          }}
          className={cn(
            'w-full h-full block opacity-100 transition-transform duration-500',
            fit === 'contain' ? 'object-contain' : 'object-cover',
            className
          )}
          {...rest}
        />
      ) : (
        /* Designed Category-Specific Fallback — only rendered if both primary & fallbackSrc fail or are empty */
        <div
          role="img"
          aria-label={alt}
          className={cn(
            'w-full h-full flex flex-col items-center justify-center p-4 text-center bg-gradient-to-br select-none relative',
            cfg.gradient
          )}
        >
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage:
                'radial-gradient(rgba(255,255,255,0.18) 1px, transparent 1px)',
              backgroundSize: '14px 14px',
            }}
          />
          <div
            className="size-10 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center mb-2 shadow-inner"
            style={accentColor ? { borderColor: `${accentColor}40`, color: accentColor } : undefined}
          >
            <Icon className="size-5 text-neutral-300" />
          </div>
          <span className="text-xs font-bold text-white/90 line-clamp-1 max-w-[90%]">
            {fallbackLabel || alt}
          </span>
          <span className="text-[9px] font-mono tracking-widest uppercase text-neutral-400 mt-0.5">
            {cfg.tag}
          </span>
        </div>
      )}
    </div>
  );
};

export default SmartImage;
