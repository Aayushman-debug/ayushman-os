import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion';
import {
  Star,
  Heart,
  CheckCircle2,
  Play,
  Bookmark,
  Plus,
  Minus,
  Edit3,
  ExternalLink,
  Trash2,
  Flame,
  Sparkles,
  PauseCircle
} from 'lucide-react';
import { SmartImage } from '@/components/ui/smart-image';
import { usePortfolioTheme } from '@/themes/usePortfolioTheme';


export interface AnimeEntry {
  id: number;
  anilistId?: number;
  title: string;
  japaneseTitle?: string;
  posterUrl: string;
  bannerUrl?: string;
  format: string;
  totalEpisodes: number;
  episodesWatched: number;
  status: 'completed' | 'watching' | 'plan_to_watch' | 'on_hold' | 'dropped';
  score: number;
  isFavorite?: boolean;
  priority?: 'High' | 'Medium' | 'Low';
  genres?: string[];
  studio?: string;
  seasonYear?: number;
  favoriteCharacter?: string;
  completedDate?: string;
  notes?: string;
  isPublic?: boolean;
}

interface CinematicAnimeCardProps {
  anime: AnimeEntry;
  onUpdateAnime: (id: number, patch: Partial<AnimeEntry>) => void;
  onEditModal: (anime: AnimeEntry) => void;
  onDeleteAnime?: (id: number) => void;
  readOnly?: boolean;
}

const STATUS_META: Record<
  AnimeEntry['status'],
  { label: string; color: string; bg: string; border: string }
> = {
  completed: {
    label: 'WATCHED',
    color: 'text-emerald-300',
    bg: 'bg-emerald-950/85',
    border: 'border-emerald-500/40',
  },
  watching: {
    label: 'WATCHING',
    color: 'text-cyan-300',
    bg: 'bg-cyan-950/85',
    border: 'border-cyan-500/40',
  },
  plan_to_watch: {
    label: 'WATCHLIST',
    color: 'text-amber-300',
    bg: 'bg-amber-950/85',
    border: 'border-amber-500/40',
  },
  on_hold: {
    label: 'ON HOLD',
    color: 'text-purple-300',
    bg: 'bg-purple-950/85',
    border: 'border-purple-500/40',
  },
  dropped: {
    label: 'DROPPED',
    color: 'text-rose-300',
    bg: 'bg-rose-950/85',
    border: 'border-rose-500/40',
  },
};

const PRIORITY_BADGE: Record<string, string> = {
  High: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
  Medium: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
  Low: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
};

export const CinematicAnimeCard: React.FC<CinematicAnimeCardProps> = ({
  anime,
  onUpdateAnime,
  onEditModal,
  onDeleteAnime,
  readOnly = false,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { theme } = usePortfolioTheme();
  const isVillage = theme === 'village';
  const tiltStrength = theme === 'liquid' ? 3 : theme === 'play' ? 4 : theme === 'default' ? 8 : 0;
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const springConfig = theme === 'play'
    ? { damping: 16, stiffness: 260, mass: 0.55 }
    : theme === 'liquid'
      ? { damping: 30, stiffness: 170, mass: 0.6 }
      : { damping: 24, stiffness: 240, mass: 0.5 };
  const rotateX = useSpring(useTransform(mouseY, [0, 1], [tiltStrength, -tiltStrength]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-tiltStrength, tiltStrength]), springConfig);
  const bgParallaxX = useSpring(useTransform(mouseX, [0, 1], [-10, 10]), springConfig);
  const bgParallaxY = useSpring(useTransform(mouseY, [0, 1], [-10, 10]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || prefersReducedMotion || !tiltStrength) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  const statusMeta = STATUS_META[anime.status] || STATUS_META.completed;
  const totalEps = anime.totalEpisodes || 12;
  const watchedEps = anime.episodesWatched || 0;
  const progressPercent = Math.min(100, Math.round((watchedEps / Math.max(1, totalEps)) * 100));

  const handleIncrementEp = (e: React.MouseEvent, delta: number) => {
    e.stopPropagation();
    const nextEps = Math.max(0, Math.min(totalEps, watchedEps + delta));
    const nextStatus =
      nextEps >= totalEps
        ? 'completed'
        : nextEps > 0 && anime.status === 'plan_to_watch'
        ? 'watching'
        : anime.status;
    onUpdateAnime(anime.id, {
      episodesWatched: nextEps,
      status: nextStatus,
    });
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdateAnime(anime.id, { isFavorite: !anime.isFavorite });
  };

  const handleQuickStatus = (e: React.MouseEvent, newStatus: AnimeEntry['status']) => {
    e.stopPropagation();
    const nextEps = newStatus === 'completed' ? totalEps : anime.episodesWatched;
    onUpdateAnime(anime.id, {
      status: newStatus,
      episodesWatched: nextEps,
    });
  };

  return (
    <div style={{ perspective: '1100px' }} className="h-full">
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX: prefersReducedMotion || !tiltStrength ? 0 : rotateX,
          rotateY: prefersReducedMotion || !tiltStrength ? 0 : rotateY,
          transformStyle: 'preserve-3d',
        }}
        whileHover={prefersReducedMotion ? undefined : theme === 'default' ? undefined : theme === 'experimental' ? { x: 4, y: -3 } : theme === 'liquid' ? { y: -4, scale: 1.01 } : theme === 'editorial' ? { y: -5 } : theme === 'terminal' ? { x: 3 } : { y: -5, scale: 1.015, rotateZ: -0.5 }}
        transition={theme === 'play' ? { type: 'spring', stiffness: 250, damping: 17 } : { duration: 0.22, ease: 'easeOut' }}
        className={`group relative h-[440px] rounded-2xl overflow-hidden bg-[#080a12] border transition-colors duration-300 shadow-[0_18px_40px_-15px_rgba(0,0,0,0.85)] select-none flex flex-col justify-between ${
          isVillage
            ? 'border-[#78350f]/20 hover:border-[#c86d51] shadow-[0_12px_30px_rgba(120,53,15,0.15)]'
            : 'border-white/10 hover:border-pink-500/50'
        }`}
        data-portfolio-card="cinematic"
      >
        {/* Layer 1: Parallax Key Visual Poster */}
        <motion.div
          style={{
            x: prefersReducedMotion ? 0 : bgParallaxX,
            y: prefersReducedMotion ? 0 : bgParallaxY,
            scale: isHovered && !prefersReducedMotion ? 1.09 : 1.02,
          }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="absolute inset-0 pointer-events-none"
        >
          <SmartImage
            src={anime.posterUrl}
            alt={anime.title}
            category="anime"
            fallbackLabel={anime.title}
            containerClassName="w-full h-full"
            className="w-full h-full object-cover object-center brightness-[0.88] contrast-[1.08] group-hover:brightness-[0.45] transition-all duration-500"
          />
        </motion.div>

        {/* Layer 2: Manga Screen-Tone / Pixel Matrix Halftone Overlay on Hover */}
        <div
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-35 transition-opacity duration-500 mix-blend-overlay"
          style={{
            backgroundImage: `radial-gradient(rgba(244, 114, 182, 0.75) 1px, transparent 1px), radial-gradient(rgba(56, 189, 248, 0.5) 1px, #080a12 1px)`,
            backgroundSize: '6px 6px',
            backgroundPosition: '0 0, 3px 3px',
          }}
        />

        {/* Layer 3: Widescreen Banner Slice Reveal at Top on Hover */}
        {anime.bannerUrl && (
          <div className="absolute top-0 inset-x-0 h-24 overflow-hidden opacity-0 group-hover:opacity-45 transition-opacity duration-500 pointer-events-none">
            <img
              src={anime.bannerUrl}
              alt=""
              className="w-full h-full object-cover scale-110 blur-[1px]"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#080a12]" />
          </div>
        )}

        {/* Layer 4: Cinematic Dark Vignette Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#060810] via-[#060810]/70 to-black/25 pointer-events-none" />

        {/* Top Bar: Status Badge, Priority Badge, Score & Favorite Heart */}
        <div
          className="relative z-20 p-4 flex items-start justify-between gap-2"
          style={{ transform: 'translateZ(24px)' }}
        >
          <div className="flex flex-wrap items-center gap-1.5">
            <span
              className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold tracking-wider uppercase border backdrop-blur-md shadow-md ${statusMeta.bg} ${statusMeta.color} ${statusMeta.border}`}
            >
              {statusMeta.label}
            </span>

            {anime.status === 'plan_to_watch' && anime.priority && (
              <span
                className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold border backdrop-blur-md ${
                  PRIORITY_BADGE[anime.priority] || PRIORITY_BADGE.Medium
                }`}
              >
                {anime.priority} Priority
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {anime.score > 0 && (
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/75 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold backdrop-blur-md shadow">
                <Star className="size-3 fill-amber-400 text-amber-400" />
                <span>{Number(anime.score).toFixed(1)}</span>
              </div>
            )}

            {!readOnly && <button
              type="button"
              onClick={handleToggleFavorite}
              title={anime.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
              className={`p-1.5 rounded-lg border backdrop-blur-md transition cursor-pointer ${
                anime.isFavorite
                  ? (isVillage
                      ? 'bg-[#c86d51]/30 border-[#c86d51]/60 text-[#c86d51] shadow-[0_0_12px_rgba(200,109,81,0.4)]'
                      : 'bg-pink-500/25 border-pink-400/50 text-pink-400 shadow-[0_0_12px_rgba(236,72,153,0.4)]')
                  : (isVillage
                      ? 'bg-black/60 border-white/10 text-neutral-400 hover:text-[#c86d51] hover:border-[#c86d51]/40'
                      : 'bg-black/60 border-white/10 text-neutral-400 hover:text-pink-300 hover:border-pink-500/30')
              }`}
            >
              <Heart className={`size-3.5 ${anime.isFavorite ? (isVillage ? 'fill-[#c86d51]' : 'fill-pink-400') : ''}`} />
            </button>}
          </div>
        </div>

        {/* Bottom Content & Hover Reveal Drawer */}
        <div
          className="relative z-20 p-4 pt-0 mt-auto flex flex-col justify-end"
          style={{ transform: 'translateZ(30px)' }}
        >
          {/* Studio & Season pill */}
          <div className={`flex items-center gap-2 text-[10px] font-mono mb-1 ${
            isVillage ? 'text-[#d8f3dc]' : 'text-pink-300/90'
          }`}>
            <span>{anime.format || 'TV'}</span>
            {anime.studio && (
              <>
                <span>•</span>
                <span className="truncate max-w-[130px]">{anime.studio}</span>
              </>
            )}
            {anime.seasonYear && (
              <>
                <span>•</span>
                <span>{anime.seasonYear}</span>
              </>
            )}
          </div>

          {/* Anime Title & Japanese Subtitle */}
          <h3 className={`text-lg font-extrabold text-white leading-snug tracking-tight transition-colors line-clamp-2 ${
            isVillage ? 'group-hover:text-[#d8f3dc]' : 'group-hover:text-pink-200'
          }`}>
            {anime.title}
          </h3>
          {anime.japaneseTitle && (
            <div className="text-[11px] text-neutral-400 font-mono truncate mb-2">
              {anime.japaneseTitle}
            </div>
          )}

          {/* Genre Pills */}
          {anime.genres && anime.genres.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {anime.genres.slice(0, 3).map((genre) => (
                <span
                  key={genre}
                  className="px-2 py-0.5 rounded-md bg-white/[0.06] border border-white/10 text-[10px] text-neutral-300 font-medium"
                >
                  {genre}
                </span>
              ))}
            </div>
          )}

          {/* Episode Progress Tracker Bar */}
          <div className="p-2.5 rounded-xl bg-black/65 border border-white/10 backdrop-blur-md mb-2">
            <div className="flex items-center justify-between text-[11px] font-mono mb-1.5">
              <span className="text-neutral-300 font-semibold">
                EP <span className="text-white font-bold">{watchedEps}</span> / {totalEps}
              </span>
              <div className="flex items-center gap-1">
                {!readOnly && <button
                  type="button"
                  onClick={(e) => handleIncrementEp(e, -1)}
                  disabled={watchedEps <= 0}
                  className="p-1 rounded bg-white/5 hover:bg-white/15 disabled:opacity-30 text-neutral-300 hover:text-white transition cursor-pointer"
                  title="-1 Episode"
                >
                  <Minus className="size-3" />
                </button>}
                {!readOnly && <button
                  type="button"
                  onClick={(e) => handleIncrementEp(e, 1)}
                  disabled={watchedEps >= totalEps}
                  className={`px-1.5 py-0.5 rounded disabled:opacity-30 border text-[10px] font-bold transition cursor-pointer flex items-center gap-0.5 ${
                    isVillage
                      ? 'bg-[#2d6a4f]/40 hover:bg-[#2d6a4f]/60 border-[#2d6a4f]/50 text-emerald-200'
                      : 'bg-pink-500/25 hover:bg-pink-500/40 border-pink-500/30 text-pink-200'
                  }`}
                  title="+1 Episode"
                >
                  <Plus className="size-2.5" />
                  <span>1 EP</span>
                </button>}
              </div>
            </div>
            <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  isVillage
                    ? 'bg-gradient-to-r from-[#2d6a4f] via-[#52b788] to-[#c86d51]'
                    : 'bg-gradient-to-r from-pink-500 via-fuchsia-500 to-cyan-400'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Expandable Manga Lore & Actions Drawer on Hover */}
          <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-300 ease-out">
            <div className="overflow-hidden">
              <div className="pt-2 space-y-2.5 border-t border-white/10 mt-1">
                {anime.favoriteCharacter && (
                  <div className="text-[11px] font-mono text-cyan-300 flex items-center gap-1.5 truncate">
                    <Sparkles className="size-3 shrink-0 text-pink-400" />
                    <span className="text-neutral-400">Fav Character:</span>
                    <span className="text-white font-semibold truncate">{anime.favoriteCharacter}</span>
                  </div>
                )}

                {anime.notes && (
                  <p className="text-[11px] text-neutral-300 line-clamp-2 italic leading-relaxed">
                    "{anime.notes}"
                  </p>
                )}

                {/* Quick Status Switch Buttons */}
                <div className="flex items-center justify-between gap-1.5 pt-1">
                  <div className="flex items-center gap-1">
                    {anime.status !== 'completed' && (
                      <button
                        type="button"
                        onClick={(e) => handleQuickStatus(e, 'completed')}
                        className="px-2 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/35 border border-emerald-500/30 text-emerald-300 text-[10px] font-mono font-bold flex items-center gap-1 transition cursor-pointer"
                        title="Mark as Watched"
                      >
                        <CheckCircle2 className="size-3" />
                        <span>Watched</span>
                      </button>
                    )}

                    {anime.status !== 'watching' && (
                      <button
                        type="button"
                        onClick={(e) => handleQuickStatus(e, 'watching')}
                        className="px-2 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/35 border border-cyan-500/30 text-cyan-300 text-[10px] font-mono font-bold flex items-center gap-1 transition cursor-pointer"
                        title="Move to Watching"
                      >
                        <Play className="size-3" />
                        <span>Watch</span>
                      </button>
                    )}

                    {anime.status !== 'plan_to_watch' && (
                      <button
                        type="button"
                        onClick={(e) => handleQuickStatus(e, 'plan_to_watch')}
                        className="px-2 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/35 border border-amber-500/30 text-amber-300 text-[10px] font-mono font-bold flex items-center gap-1 transition cursor-pointer"
                        title="Move to Watchlist"
                      >
                        <Bookmark className="size-3" />
                        <span>Plan</span>
                      </button>
                    )}
                  </div>
                </div>

                  <div className="flex items-center gap-1">
                    {!readOnly && <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditModal(anime);
                      }}
                      className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-neutral-200 transition cursor-pointer"
                      title="Edit Anime Notes & Details"
                    >
                      <Edit3 className="size-3.5" />
                    </button>}

                    <a
                      href={
                        anime.anilistId
                          ? `https://anilist.co/anime/${anime.anilistId}`
                          : `https://anilist.co/search/anime?search=${encodeURIComponent(anime.title)}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="p-1.5 rounded-lg bg-pink-500/20 hover:bg-pink-500/40 text-pink-300 transition"
                      title="Open on AniList"
                    >
                      <ExternalLink className="size-3.5" />
                    </a>

                    {onDeleteAnime && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteAnime(anime.id);
                        }}
                        className="p-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/35 text-rose-300 transition cursor-pointer"
                        title="Remove from Library"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
        </div>

        {/* Neon Bottom Accent Line */}
        <div className="absolute bottom-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-pink-500 to-cyan-400 opacity-50 group-hover:opacity-100 transition-opacity" />
      </motion.div>
    </div>
  );
};

export default CinematicAnimeCard;
