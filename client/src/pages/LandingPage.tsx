import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  Variants,
  useReducedMotion,
} from 'framer-motion';
import { usePortfolioTheme } from '@/themes/usePortfolioTheme';
import { WorksWheel, WorksWheelItem } from '../components/ui/works-wheel';
import { CinematicFooter } from '../components/ui/motion-footer';
import { SmartImage } from '../components/ui/smart-image';
import { GalaxyBackground } from '../components/landing/GalaxyBackground';
import {
  GraduationCap,
  Code2,
  Gamepad2,
  Film,
  Music,
  BookOpen,
  Lock,
  Sparkles,
  ArrowUpRight,
  Compass,
  Trophy,
  Disc3,
  Share2,
  Flame,
} from 'lucide-react';

// ============================================================================
// SINGLE EXPLICIT NAVIGATION-DATA ARRAY FOR THE 21st.dev CIRCULAR 3D WHEEL
// Every card maps 1:1 to a real, existing route in App.tsx with unique artwork
// ============================================================================
const WHEEL_NAVIGATION_ITEMS: WorksWheelItem[] = [
  {
    title: 'Projects & Software',
    category: 'Selected work',
    description:
      'Full-stack builds crafted with React 19, TypeScript, Three.js, Node.js, and MySQL.',
    href: '/developer',
    image: '/assets/projects/ayushman-os.svg',
  },
  {
    title: 'Gaming',
    category: 'Games & public profiles',
    description: 'A read-only collection of gaming interests and public profiles.',
    href: '/gaming',
    image: '/assets/games/clash-royale.svg',
  },
  {
    title: 'Anime & Movies',
    category: 'Shared collections',
    description: 'Anime and movie collections selected for public sharing.',
    href: '/entertainment',
    image: '/assets/sections/anime-preview.svg',
  },
  {
    title: 'Music',
    category: 'Playlists & listening',
    description: 'Browse playlists that have been selected for public sharing.',
    href: '/music',
    image: '/assets/music/3kVexA5RqiZJA1hrzv1eNH.jpg',
  },
  {
    title: 'Social & Platforms',
    category: 'Public profile links',
    description: 'Public links to social, creative, and developer platforms.',
    href: '/social',
    image: '/assets/sections/social-preview.svg',
  },
];

// 3 Floating Hero Preview Cards (positioned around and below the central hero content)
interface HeroFloatingCardData {
  id: string;
  category: string;
  title: string;
  metric: string;
  route: string;
  image: string;
  fallbackImage?: string;
  accentColor: string;
  icon: React.ReactNode;
  floatDuration: number;
  floatDelay: number;
  floatAmplitude: number;
  baseRotation: string;
  positionClass: string;
}

interface PublicAnimePreview {
  id: number;
  title: string;
  posterUrl: string;
  status: string;
  episodesWatched?: number;
  totalEpisodes?: number;
}

const HERO_FLOATING_CARDS: HeroFloatingCardData[] = [
  {
    id: 'hero-music',
    category: 'Music',
    title: 'Public Playlists',
    metric: 'Music & listening',
    route: '/music',
    image: '/assets/music/3kVexA5RqiZJA1hrzv1eNH.jpg',
    fallbackImage: '/assets/sections/music-preview.svg',
    accentColor: '#34d399',
    icon: <Music className="w-3.5 h-3.5 text-emerald-300" />,
    floatDuration: 6.4,
    floatDelay: 0,
    floatAmplitude: -8,
    baseRotation: 'lg:-rotate-[3.5deg] lg:-translate-y-2',
    positionClass: 'lg:justify-self-start',
  },
  {
    id: 'hero-projects',
    category: 'Projects',
    title: 'Selected Projects',
    metric: 'Software & creative work',
    route: '/developer',
    image: '/assets/projects/ayushman-os.svg',
    accentColor: '#818cf8',
    icon: <Code2 className="w-3.5 h-3.5 text-indigo-300" />,
    floatDuration: 7.2,
    floatDelay: 0.9,
    floatAmplitude: -10,
    baseRotation: 'lg:rotate-[1.2deg] lg:translate-y-3 lg:scale-[1.02]',
    positionClass: 'lg:justify-self-center',
  },
  {
    id: 'hero-social',
    category: 'Social & Platforms',
    title: 'Social & Platforms',
    metric: 'Public profile links',
    route: '/social',
    image: '/assets/sections/social-preview.svg',
    accentColor: '#60a5fa',
    icon: <Share2 className="w-3.5 h-3.5 text-sky-300" />,
    floatDuration: 6.8,
    floatDelay: 1.7,
    floatAmplitude: -8,
    baseRotation: 'lg:rotate-[3.5deg] lg:-translate-y-2',
    positionClass: 'lg:justify-self-end',
  },
];

// Coordinated, smooth entrance animation variants for the connected zigzag groups
const zigzagGroupVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.04,
    },
  },
};

const leftCardVariants: Variants = {
  hidden: { opacity: 0, x: -28, y: 18 },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const rightCardVariants: Variants = {
  hidden: { opacity: 0, x: 28, y: 18 },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

/**
 * Interactive 3D-tilting wrapper with pointer spotlight (uses motion values to avoid React rerenders)
 */
const TiltSurface: React.FC<{
  children: React.ReactNode;
  className?: string;
  accentColor?: string;
  onClick?: () => void;
  maxTilt?: number;
}> = ({
  children,
  className = '',
  accentColor = '#818cf8',
  onClick,
  maxTilt = 4.5,
}) => {
  const { theme } = usePortfolioTheme();
  const reducedMotion = useReducedMotion();
  const tiltStrength = theme === 'liquid' ? Math.min(maxTilt, 3) : theme === 'play' ? Math.min(maxTilt, 4) : theme === 'default' ? maxTilt : 0;
  const ref = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(my, [0, 1], [tiltStrength, -tiltStrength]), {
    stiffness: 240,
    damping: 26,
  });
  const rotateY = useSpring(useTransform(mx, [0, 1], [-tiltStrength, tiltStrength]), {
    stiffness: 240,
    damping: 26,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current || reducedMotion || !tiltStrength) return;
    const rect = ref.current.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / Math.max(rect.width, 1);
    const ny = (e.clientY - rect.top) / Math.max(rect.height, 1);
    mx.set(nx);
    my.set(ny);
    if (spotlightRef.current) {
      spotlightRef.current.style.opacity = '1';
      spotlightRef.current.style.background = `radial-gradient(460px circle at ${(
        nx * 100
      ).toFixed(1)}% ${(ny * 100).toFixed(
        1
      )}%, ${accentColor}22, transparent 65%)`;
    }
  };

  const handleMouseLeave = () => {
    mx.set(0.5);
    my.set(0.5);
    if (spotlightRef.current) {
      spotlightRef.current.style.opacity = '0';
    }
  };

  return (
    <motion.div
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: reducedMotion ? 0 : rotateX,
        rotateY: reducedMotion ? 0 : rotateY,
        transformStyle: 'preserve-3d',
      }}
      whileHover={reducedMotion ? undefined : theme === 'default' ? { y: -4 } : theme === 'experimental' ? { x: 4, y: -3 } : theme === 'liquid' ? { y: -4, scale: 1.01 } : theme === 'editorial' ? { y: -5 } : theme === 'terminal' ? { x: 3 } : { y: -5, scale: 1.025, rotateZ: -0.5 }}
      transition={theme === 'play' ? { type: 'spring', stiffness: 260, damping: 16 } : { duration: theme === 'default' ? 0.25 : 0.2, ease: 'easeOut' }}
      className={`group relative overflow-hidden rounded-[26px] border border-white/[0.11] bg-[#080c18]/85 backdrop-blur-2xl shadow-[0_22px_60px_-16px_rgba(0,0,0,0.85)] transition-colors duration-300 hover:border-white/[0.24] ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
      data-portfolio-card="spotlight"
    >
      {/* Pointer-following radial spotlight updated via DOM ref for zero React rerenders */}
      <div
        ref={spotlightRef}
        className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300"
      />
      {/* Top specular hairline */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[1px] z-20 opacity-65 group-hover:opacity-100 transition-opacity"
        style={{
          background: `linear-gradient(90deg, transparent 10%, ${accentColor}90 50%, transparent 90%)`,
        }}
      />
      {children}
    </motion.div>
  );
};

/**
 * Floating Hero Feature Card (1 of 3 cards floating below & around the hero center)
 */
const HeroFloatingCard: React.FC<{
  card: HeroFloatingCardData;
  index: number;
  onNavigate: (route: string) => void;
}> = ({ card, index, onNavigate }) => {
  const { theme } = usePortfolioTheme();
  const isVillage = theme === 'village';
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: 28, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: prefersReducedMotion ? 0 : 0.75,
        delay: prefersReducedMotion ? 0 : 0.3 + index * 0.12,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`w-full max-w-[350px] ${card.positionClass} ${card.baseRotation}`}
      style={{ perspective: 1100 }}
    >
      <motion.div
        animate={prefersReducedMotion ? undefined : { y: [0, card.floatAmplitude, 0] }}
        transition={{
          duration: card.floatDuration,
          delay: card.floatDelay,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <TiltSurface
          accentColor={card.accentColor}
          onClick={() => onNavigate(card.route)}
          maxTilt={6}
          className="p-3.5"
        >
          <div className="relative flex items-center gap-3.5 z-20">
            <div className="relative w-20 h-20 rounded-2xl overflow-hidden shrink-0 border border-white/15 bg-[#060913]">
              <SmartImage
                src={card.image}
                fallbackSrc={card.fallbackImage}
                alt={card.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-[#05070f]/60 via-transparent to-transparent" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-[0.14em] bg-white/[0.06] border border-white/10 text-slate-200">
                  {card.icon}
                  {card.category}
                </span>
                <span className="w-6 h-6 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center text-slate-400 group-hover:text-white group-hover:bg-white/15 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>

              <h3 className="text-sm font-bold text-white truncate group-hover:text-indigo-100 transition-colors">
                {card.title}
              </h3>

              <p
                className="text-[11px] font-mono mt-1 truncate"
                style={{ color: card.accentColor }}
              >
                {card.metric}
              </p>
            </div>
          </div>
        </TiltSurface>
      </motion.div>
    </motion.div>
  );
};

export const LandingPage: React.FC = () => {
  const { theme } = usePortfolioTheme();
  const isVillage = theme === 'village';
  const navigate = useNavigate();
  const [liveClock, setLiveClock] = useState<string>('');
  const [heroHovered, setHeroHovered] = useState(false);
  const [activeProjectIdx, setActiveProjectIdx] = useState(0);
  const [animePosters, setAnimePosters] = useState<PublicAnimePreview[]>([]);
  const [animeLoadError, setAnimeLoadError] = useState(false);

  // Live IST clock
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setLiveClock(
        now.toLocaleTimeString('en-IN', {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let active = true;
    fetch('/api/entertainment/anime')
      .then((response) => {
        if (!response.ok) throw new Error('Unable to load publicly shared anime.');
        return response.json();
      })
      .then((data) => {
        if (!data.success || !Array.isArray(data.anime)) {
          throw new Error('Invalid public anime response.');
        }
        if (active) setAnimePosters(data.anime);
      })
      .catch((error: Error) => {
        console.error(error);
        if (active) setAnimeLoadError(true);
      });
    return () => {
      active = false;
    };
  }, []);

  const PROJECTS_DATA = [
    {
      title: 'AYushMan Digital Workspace',
      tag: 'FLAGSHIP ARCHITECTURE',
      tech: 'React 19 · TypeScript · Three.js · Express · MySQL',
      summary:
        'A personal website and workspace built with a modern React and TypeScript stack.',
      image: '/assets/projects/ayushman-os.svg',
      accent: '#818cf8',
    },
    {
      title: 'Mithila Art Heritage Platform',
      tag: 'CULTURAL ARCHIVE & E-GALLERY',
      tech: 'React · Node.js · Tailwind CSS · Curated Storytelling',
      summary:
        'Interactive digital showcase preserving traditional Madhubani & Mithila folk artistry, regional motifs, and direct artisan narratives.',
      image: '/assets/projects/mithila-art.svg',
      accent: '#f59e0b',
    },
    {
      title: 'CampusConnect Portal',
      tag: 'ACADEMIC COLLABORATION',
      tech: 'TypeScript · Express · MySQL · REST API',
      summary:
      'A campus collaboration portal for sharing resources and coordinating student events.',
      image: '/assets/projects/campus-connect.svg',
      accent: '#38bdf8',
    },
  ];

  const PLAYLISTS_PREVIEW = [
    {
      name: 'जीवन',
      id: '3kVexA5RqiZJA1hrzv1eNH',
      vibe: 'Late Night Introspection',
      cover: '/assets/music/3kVexA5RqiZJA1hrzv1eNH.jpg',
    },
    {
      name: '"PEAK"',
      id: '1ObWCzwKcT96QEqiKbFR5U',
      vibe: 'High-Tempo Momentum',
      cover: '/assets/music/1ObWCzwKcT96QEqiKbFR5U.jpg',
    },
    {
      name: 'puhNjabi',
      id: '6TsUQwBFT8TMKBN72Mo7Zb',
      vibe: 'Desi Bass & Drive',
      cover: '/assets/music/6TsUQwBFT8TMKBN72Mo7Zb.jpg',
    },
    {
      name: 'एफ',
      id: '3z97vIfs40HVfqovsgSbGn',
      vibe: 'Deep Focus Session',
      cover: '/assets/music/3z97vIfs40HVfqovsgSbGn.jpg',
    },
    {
      name: '´ε｀',
      id: '6Vpr16RnIxYihzjjba292p',
      vibe: 'Midnight Lo-Fi & Chill',
      cover: '/assets/music/6Vpr16RnIxYihzjjba292p.jpg',
    },
    {
      name: '￣ ³ ￣',
      id: '23bd1303fN27I8672y85Ha',
      vibe: 'Alt & Indie Melodies',
      cover: '/assets/music/23bd1303fN27I8672y85Ha.jpg',
    },
    {
      name: 'ई',
      id: '6fn362s2fV2dAWv2yC2p4e',
      vibe: 'Ambient Horizon',
      cover: '/assets/music/6fn362s2fV2dAWv2yC2p4e.jpg',
    },
  ];

  return (
    <div className={`min-h-screen ${isVillage ? 'bg-[#fcf9f2] text-[#2c251e]' : 'bg-[#02030a] text-white'} selection:bg-indigo-500/30 selection:text-indigo-200 overflow-x-hidden relative`}>
      {/* =====================================================================
          1. LIVE THREE.JS SPIRAL GALAXY HERO + AYushMan WORDMARK / VILLAGE ATMOSPHERE
         ===================================================================== */}
      <section className="relative min-h-[92vh] w-full flex flex-col justify-between pt-5 pb-12 md:py-10 overflow-hidden">
        {/* Continuous Full-Width Background: Three.js Spiral Galaxy Canvas or Peaceful Village Pastoral Atmosphere */}
        {!isVillage ? (
          <GalaxyBackground
            className="absolute inset-0 z-0"
            interactiveBoost={heroHovered}
          />
        ) : (
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            {/* Pastoral sky gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#e8f4f8] via-[#fcf9f2] to-[#f5efe6]" />
            {/* Morning sun & meadow light orbs */}
            <div className="absolute -top-20 left-1/4 w-[36rem] h-[36rem] rounded-full bg-gradient-to-br from-[#8ecae6]/25 to-[#d8f3dc]/30 blur-3xl" />
            <div className="absolute top-1/4 -right-16 w-[40rem] h-[40rem] rounded-full bg-gradient-to-bl from-[#fef3c7]/35 to-[#e07a5f]/15 blur-3xl" />
            {/* Gentle rolling hill silhouette at horizon */}
            <svg className="absolute bottom-0 w-full h-28 opacity-20 text-[#2d6a4f]" viewBox="0 0 1440 320" preserveAspectRatio="none" fill="currentColor">
              <path d="M0,192L48,181.3C96,171,192,149,288,160C384,171,480,213,576,213.3C672,213,768,171,864,165.3C960,160,1056,192,1152,192C1248,192,1344,160,1392,144L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
            </svg>
          </div>
        )}

        {/* Hero Foreground Content */}
        <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 flex-1 flex flex-col justify-between">
          {/* Top Personal Workspace Descriptor Pill */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: 'easeOut' }}
            className="flex flex-wrap items-center justify-center gap-2.5 pt-2"
          >
            <div className={`inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full ${
              isVillage
                ? 'bg-[#fffdfa] border border-[#78350f]/15 shadow-sm'
                : 'bg-[#070a16]/75 border border-white/15 backdrop-blur-xl shadow-[0_0_30px_rgba(155,103,255,0.18)]'
            }`}>
              <span className={`w-2 h-2 rounded-full ${
                isVillage ? 'bg-[#2d6a4f] shadow-[0_0_8px_#52b788]' : 'bg-amber-300 animate-pulse shadow-[0_0_10px_#fde68a]'
              }`} />
              <span className={`text-[11px] sm:text-xs font-mono uppercase tracking-[0.22em] ${
                isVillage ? 'text-[#2d6a4f] font-semibold' : 'text-slate-200'
              }`}>
                {isVillage ? '🌱 Village Studio · Crafts · Systems' : 'Projects · Platforms · Media'}
              </span>
            </div>

            {liveClock && (
              <div className={`hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full ${
                isVillage
                  ? 'bg-[#fffdfa] border border-[#78350f]/15 text-[#685e52]'
                  : 'bg-[#070a16]/70 border border-white/10 backdrop-blur-xl text-slate-300'
              } text-[11px] font-mono`}>
                <span className={isVillage ? 'text-[#78350f] font-medium' : 'text-indigo-300'}>{liveClock} IST</span>
                <span className={isVillage ? 'text-[#78350f]/30' : 'text-white/20'}>•</span>
                <span className={isVillage ? 'text-[#2d6a4f] font-medium' : 'text-amber-200/90'}>Public Portfolio</span>
              </div>
            )}
          </motion.div>

          {/* Center Monumental AYushMan Wordmark + Description + Primary Actions */}
          <div className="my-auto py-8 sm:py-12 flex flex-col items-center text-center relative">
            {/* Faint oversized depth-offset outline wordmark behind main title */}
            <div
              aria-hidden="true"
              className="pointer-events-none select-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[62%] font-black tracking-[-0.06em] whitespace-nowrap opacity-25"
              style={{
                fontSize: 'clamp(4.8rem, 17vw, 15.5rem)',
                WebkitTextStroke: isVillage ? '1.5px rgba(120, 53, 15, 0.16)' : '1.5px rgba(255, 235, 200, 0.22)',
                color: 'transparent',
                filter: 'blur(0.5px)',
              }}
            >
              AYushMan
            </div>

            {/* Primary Monumental AYushMan Wordmark positioned over the luminous galaxy core */}
            <motion.h1
              initial={{ opacity: 0, scale: 0.94, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
              onMouseEnter={() => setHeroHovered(true)}
              onMouseLeave={() => setHeroHovered(false)}
              className="relative font-black tracking-[-0.045em] leading-[0.92] select-none cursor-default"
              style={{
                fontSize: 'clamp(3.75rem, 12.8vw, 10.75rem)',
                textShadow: isVillage
                  ? '0 10px 30px rgba(120, 53, 15, 0.12), 0 0 60px rgba(45, 106, 79, 0.12)'
                  : '0 10px 48px rgba(2, 3, 10, 0.92), 0 0 70px rgba(255, 231, 194, 0.28), 0 0 120px rgba(155, 103, 255, 0.25)',
              }}
            >
              <span className={
                isVillage
                  ? 'bg-gradient-to-b from-[#2d6a4f] via-[#78350f] to-[#c86d51] bg-clip-text text-transparent'
                  : 'bg-gradient-to-b from-white via-[#fff7e8] to-[#d8c7ff] bg-clip-text text-transparent'
              }>
                AYushMan
              </span>
            </motion.h1>

            {/* Concise, personal description */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.14, ease: 'easeOut' }}
              className={`mt-5 max-w-2xl text-sm sm:text-base md:text-lg font-normal leading-relaxed px-4 py-2 rounded-2xl ${
                isVillage
                  ? 'bg-[#fffdfa]/95 text-[#453c35] border border-[#78350f]/15 shadow-sm'
                  : 'text-slate-200/95 bg-[#02030a]/45 backdrop-blur-md border border-white/[0.06] shadow-[0_12px_40px_rgba(0,0,0,0.6)]'
              }`}
            >
              A personal portfolio of selected projects, public platforms,
              gaming profiles, music, and media collections.
            </motion.p>

            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => navigate('/social')}
                className={`rounded-xl px-5 py-3 text-sm font-bold transition shadow-sm ${
                  isVillage
                    ? 'bg-[#c86d51] text-white hover:bg-[#b85d43] shadow-[0_4px_14px_rgba(200,109,81,0.25)]'
                    : 'bg-white text-slate-950 hover:bg-slate-200'
                }`}
              >
                Explore portfolio
              </button>
              <button
                type="button"
                onClick={() => navigate('/developer')}
                className={`rounded-xl px-5 py-3 text-sm font-semibold transition ${
                  isVillage
                    ? 'border border-[#2d6a4f]/30 bg-[#d8f3dc]/60 text-[#2d6a4f] hover:bg-[#d8f3dc]'
                    : 'border border-white/20 bg-white/5 text-white hover:bg-white/10'
                }`}
              >
                View projects
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 pb-2 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {HERO_FLOATING_CARDS.map((card, index) => (
              <HeroFloatingCard
                key={card.id}
                card={card}
                index={index}
                onNavigate={navigate}
              />
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="works-wheel-title" className="relative py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-mono uppercase tracking-[0.2em] text-cyan-300">Explore</p>
              <h2 id="works-wheel-title" className="mt-1 text-2xl font-black text-white sm:text-3xl">
                Works &amp; worlds
              </h2>
            </div>
            <p className="max-w-xl text-sm text-slate-400">
              Rotate the 3D wheel, choose a section from its index, or open a card directly.
            </p>
          </div>
          <div className="h-[min(75vh,44rem)] min-h-[26rem] overflow-hidden rounded-3xl border border-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.45)]">
            <WorksWheel
              items={WHEEL_NAVIGATION_ITEMS}
              label="AYushMan portfolio navigation"
              action="Open"
              className="h-full"
            />
          </div>
        </div>
      </section>

      <section className="relative py-14 sm:py-20">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {/* Public profile overview */}
          <motion.div
            variants={zigzagGroupVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.18 }}
            className="relative grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-7 items-stretch"
          >
            <motion.div variants={leftCardVariants} className="lg:col-span-12">
              <TiltSurface
                accentColor="#38bdf8"
                onClick={() => navigate('/social')}
                className="h-full p-6 sm:p-7"
              >
                <div className="relative z-20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/15 border border-sky-400/30 text-sky-200">
                      <Share2 className="w-3.5 h-3.5 text-sky-300" />
                      PUBLIC PROFILE
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-white mt-3">
                      About &amp; public platforms
                    </h3>
                    <p className="text-sm text-slate-300 mt-2 max-w-2xl">
                      Explore public links, interests, and selected work. Private workspace records are not shown here.
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-300">
                    Open profile <ArrowUpRight className="w-4 h-4" />
                  </span>
                </div>
              </TiltSurface>
            </motion.div>
          </motion.div>

          {/* -----------------------------------------------------------------
              GROUP 02 (RIGHT-ALIGNED PRIMARY) — PROJECTS & SOFTWARE (/developer)
             ----------------------------------------------------------------- */}
          <motion.div
            variants={zigzagGroupVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.18 }}
            className="relative grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-7 items-stretch"
          >
            {/* Left Companion Card: Interactive Build Switcher (4 cols) */}
            <motion.div
              variants={leftCardVariants}
              className="lg:col-span-4 order-2 lg:order-1"
            >
              <TiltSurface accentColor="#818cf8" className="h-full p-5 sm:p-6">
                <div className="relative z-20 flex flex-col h-full justify-between space-y-3">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono uppercase tracking-[0.16em] text-indigo-300 font-semibold">
                        SELECT ARCHITECTURE
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">
                        @Aayushman-debug
                      </span>
                    </div>

                    {PROJECTS_DATA.map((proj, idx) => {
                      const active = idx === activeProjectIdx;
                      return (
                        <button
                          key={proj.title}
                          type="button"
                          onClick={() => setActiveProjectIdx(idx)}
                          className={`w-full text-left p-3 rounded-2xl border transition-all flex items-center gap-3 cursor-pointer ${
                            active
                              ? 'bg-indigo-500/15 border-indigo-400/50 shadow-[0_0_24px_rgba(129,140,248,0.2)]'
                              : 'bg-white/[0.02] border-white/[0.07] hover:bg-white/[0.05]'
                          }`}
                        >
                          <div className="w-14 h-12 rounded-xl overflow-hidden shrink-0 border border-white/10 bg-[#050813]">
                            <SmartImage
                              src={proj.image}
                              alt={proj.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-[10px] font-mono uppercase tracking-wider text-indigo-300 truncate">
                              {proj.tag}
                            </div>
                            <div className="text-xs sm:text-sm font-bold text-white truncate">
                              {proj.title}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate('/developer')}
                    className="w-full py-2.5 px-4 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs font-semibold text-indigo-200 flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <span>View All Repositories & Stack</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </TiltSurface>
            </motion.div>

            {/* Right Primary Feature Card: Active Project Showcase (8 cols) */}
            <motion.div
              variants={rightCardVariants}
              className="lg:col-span-8 order-1 lg:order-2"
            >
              <TiltSurface
                accentColor={PROJECTS_DATA[activeProjectIdx].accent}
                onClick={() => navigate('/developer')}
                className="h-full p-6 sm:p-7"
              >
                <div className="relative z-20">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/15 border border-indigo-400/30 text-indigo-200">
                      <Code2 className="w-3.5 h-3.5 text-indigo-300" />
                      02 · PROJECTS & FULL-STACK ENGINEERING
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-300 group-hover:translate-x-1 transition-transform">
                      Open Developer Hub <ArrowUpRight className="w-4 h-4" />
                    </span>
                  </div>

                  <div className="relative h-48 sm:h-56 rounded-2xl overflow-hidden border border-white/15 bg-[#050814] mb-4">
                    <SmartImage
                      src={PROJECTS_DATA[activeProjectIdx].image}
                      alt={PROJECTS_DATA[activeProjectIdx].title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#060916] via-[#060916]/25 to-transparent" />
                    <div className="absolute bottom-3 left-3.5 right-3.5 flex flex-wrap items-center justify-between gap-2">
                      <span className="px-3 py-1 rounded-full text-[11px] font-mono bg-[#060916]/85 border border-white/15 text-indigo-200 backdrop-blur-md">
                        {PROJECTS_DATA[activeProjectIdx].tech}
                      </span>
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-mono bg-indigo-500/20 border border-indigo-400/40 text-white">
                        {activeProjectIdx + 1} / {PROJECTS_DATA.length}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-white">
                    {PROJECTS_DATA[activeProjectIdx].title}
                  </h3>
                  <p className="mt-1.5 text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {PROJECTS_DATA[activeProjectIdx].summary}
                  </p>
                </div>
              </TiltSurface>
            </motion.div>
          </motion.div>

          {/* -----------------------------------------------------------------
              GROUP 03 (LEFT-ALIGNED PRIMARY) — COMPETITIVE GAMING (/gaming)
             ----------------------------------------------------------------- */}
          <motion.div
            variants={zigzagGroupVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.18 }}
            className="relative grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-7 items-stretch"
          >
            {/* Left Primary Cluster: 4 Flagship Game Profiles (7 cols) */}
            <motion.div variants={leftCardVariants} className="lg:col-span-7">
              <TiltSurface
                accentColor="#f59e0b"
                onClick={() => navigate('/gaming')}
                className="h-full p-6 sm:p-7"
              >
                <div className="relative z-20">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/15 border border-amber-400/30 text-amber-200">
                      <Gamepad2 className="w-3.5 h-3.5 text-amber-300" />
                      03 · COMPETITIVE GAMING ROSTER
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 group-hover:translate-x-1 transition-transform">
                      Open Gaming Arena <ArrowUpRight className="w-4 h-4" />
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-white mb-1.5">
                    Games & public profiles
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 mb-5">
                    A selection of games and player profiles available to view.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      {
                        game: 'Clash Royale',
                        handle: 'Strategy',
                        stat: 'Public profile',
                        art: '/assets/games/clash-royale.svg',
                        color: 'text-amber-300',
                      },
                      {
                        game: 'BGMI',
                        handle: 'Battle Royale',
                        stat: 'Public profile',
                        art: '/assets/games/bgmi.svg',
                        color: 'text-orange-300',
                      },
                      {
                        game: 'Chess.com',
                        handle: 'Chess',
                        stat: 'Public profile',
                        art: '/assets/games/chess-com.svg',
                        color: 'text-emerald-300',
                      },
                      {
                        game: 'Clash of Clans',
                        handle: 'Strategy',
                        stat: 'Public profile',
                        art: '/assets/games/clash-of-clans.svg',
                        color: 'text-yellow-300',
                      },
                    ].map((g) => (
                      <div
                        key={g.game}
                        className="group/game relative flex items-center gap-3 p-3 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-amber-400/40 transition-all"
                      >
                        <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-white/10 bg-[#050814]">
                          <SmartImage
                            src={g.art}
                            alt={g.game}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover/game:scale-110"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-bold text-white truncate">
                            {g.game}
                          </div>
                          <div className="text-[11px] text-slate-400 truncate">
                            {g.handle}
                          </div>
                          <div
                            className={`text-[11px] font-mono font-semibold mt-0.5 truncate ${g.color}`}
                          >
                            {g.stat}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TiltSurface>
            </motion.div>

            {/* Right Companion Card: Action & RPG Favorites (5 cols) */}
            <motion.div variants={rightCardVariants} className="lg:col-span-5">
              <TiltSurface
                accentColor="#f59e0b"
                onClick={() => navigate('/gaming')}
                className="h-full p-5 sm:p-6"
              >
                <div className="relative z-20 flex flex-col h-full justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-[0.16em] text-amber-300 font-semibold">
                        <Trophy className="w-3.5 h-3.5" />
                        ACTION & COMBAT ARCHIVE
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">
                        3D Coverflow Deck
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed mb-4">
                      High-tempo hack-and-slash mastery and open-world combat
                      rosters featured on the dedicated Gaming page.
                    </p>

                    <div className="grid grid-cols-3 gap-2.5">
                      {[
                        {
                          title: 'Devil May Cry',
                          sub: 'Action',
                          img: '/assets/games/devil-may-cry.svg',
                        },
                        {
                          title: 'Genshin Impact',
                          sub: 'Open-world RPG',
                          img: '/assets/games/genshin-impact.svg',
                        },
                        {
                          title: 'Wuthering Waves',
                          sub: 'Action RPG',
                          img: '/assets/games/wuthering-waves.svg',
                        },
                      ].map((item) => (
                        <div
                          key={item.title}
                          className="rounded-xl overflow-hidden border border-white/10 bg-[#050814]"
                        >
                          <div className="h-24 sm:h-28 overflow-hidden">
                            <SmartImage
                              src={item.img}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="p-2">
                            <div className="text-[11px] font-bold text-white truncate">
                              {item.title}
                            </div>
                            <div className="text-[9px] font-mono text-amber-200/80 truncate">
                              {item.sub}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                    <span>Public game profiles</span>
                    <span className="font-mono text-amber-300">Open /gaming →</span>
                  </div>
                </div>
              </TiltSurface>
            </motion.div>
          </motion.div>

          {/* -----------------------------------------------------------------
              GROUP 04 (RIGHT-ALIGNED PRIMARY) — ANIME & MOVIES (/entertainment)
             ----------------------------------------------------------------- */}
          <motion.div
            variants={zigzagGroupVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.18 }}
            className="relative grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-7 items-stretch"
          >
            {/* Left Companion Card: Big Three Completion Summary (5 cols) */}
            <motion.div
              variants={leftCardVariants}
              className="lg:col-span-5 order-2 lg:order-1"
            >
              <TiltSurface
                accentColor="#e879f9"
                onClick={() => navigate('/entertainment')}
                className="h-full p-5 sm:p-6"
              >
                <div className="relative z-20 flex flex-col h-full justify-between space-y-4">
                  <div className="space-y-3.5">
                    <div className="relative h-40 rounded-2xl overflow-hidden border border-white/10">
                      <SmartImage
                        src="/assets/sections/anime-preview.svg"
                        alt="Anime Sanctuary Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono uppercase tracking-wider text-fuchsia-300 font-semibold">
                        PUBLICLY SHARED COLLECTIONS
                      </span>
                      <span className="text-xs font-mono text-slate-300">
                        Anime & movies
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Browse anime and movie selections shared on the public entertainment page.
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                    <span>Public entertainment</span>
                    <span className="font-mono text-fuchsia-300">
                      Open /entertainment →
                    </span>
                  </div>
                </div>
              </TiltSurface>
            </motion.div>

            {/* Right Primary Cluster: Anime Poster Showcase (7 cols) */}
            <motion.div
              variants={rightCardVariants}
              className="lg:col-span-7 order-1 lg:order-2"
            >
              <TiltSurface
                accentColor="#e879f9"
                onClick={() => navigate('/entertainment')}
                className="h-full p-6 sm:p-7"
              >
                <div className="relative z-20">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-fuchsia-500/15 border border-fuchsia-400/30 text-fuchsia-200">
                      <Film className="w-3.5 h-3.5 text-fuchsia-300" />
                      04 · ANIME & MOVIES
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-fuchsia-300 group-hover:translate-x-1 transition-transform">
                      Browse collections <ArrowUpRight className="w-4 h-4" />
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-white mb-1.5">
                    Shared watchlists
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 mb-5">
                    Only items selected for public sharing appear here.
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {animePosters.map((anime) => (
                      <div
                        key={anime.id}
                        className="group/poster relative h-40 sm:h-44 rounded-2xl overflow-hidden border border-white/15 bg-[#060916]"
                      >
                        <SmartImage
                          src={anime.posterUrl}
                          fallbackSrc="/assets/sections/anime-preview.svg"
                          alt={anime.title}
                          category="anime"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover/poster:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#04060f] via-[#04060f]/25 to-transparent" />
                        <div className="absolute bottom-2.5 left-2.5 right-2.5">
                          <div className="text-xs font-bold text-white truncate">
                            {anime.title}
                          </div>
                          <div className="text-[10px] font-mono text-fuchsia-200 truncate">
                            {anime.status.replace(/_/g, ' ')}
                            {anime.totalEpisodes
                              ? ` · ${anime.episodesWatched || 0}/${anime.totalEpisodes} eps`
                              : ''}
                          </div>
                        </div>
                      </div>
                    ))}
                    {animePosters.length === 0 && (
                      <p className="col-span-full text-sm text-slate-400">
                        {animeLoadError
                          ? 'Shared anime could not be loaded right now.'
                          : 'No anime has been selected for public sharing yet.'}
                      </p>
                    )}
                  </div>
                </div>
              </TiltSurface>
            </motion.div>
          </motion.div>

          {/* -----------------------------------------------------------------
              GROUP 05 (LEFT-ALIGNED PRIMARY) — MUSIC & SOUNDSCAPE (/music)
             ----------------------------------------------------------------- */}
          <motion.div
            variants={zigzagGroupVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.18 }}
            className="relative grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-7 items-stretch"
          >
            {/* Left Primary Cluster: 7 Real Spotify Playlists (8 cols) */}
            <motion.div variants={leftCardVariants} className="lg:col-span-8">
              <TiltSurface
                accentColor="#34d399"
                onClick={() => navigate('/music')}
                className="h-full p-6 sm:p-7"
              >
                <div className="relative z-20">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 border border-emerald-400/30 text-emerald-200">
                      <Disc3
                        className="w-3.5 h-3.5 text-emerald-300 animate-spin"
                        style={{ animationDuration: '9s' }}
                      />
                      05 · MUSIC & SOUNDSCAPE
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-300 group-hover:translate-x-1 transition-transform">
                      Open Interactive Player <ArrowUpRight className="w-4 h-4" />
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-white mb-1.5">
                    Public playlists & music
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 mb-5">
                    Browse selected public playlists and music on the dedicated page.
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {PLAYLISTS_PREVIEW.slice(0, 4).map((pl) => (
                      <div
                        key={pl.id}
                        className="group/pl rounded-2xl overflow-hidden border border-white/10 bg-white/[0.03] p-2.5 hover:border-emerald-400/40 transition-all"
                      >
                        <div className="aspect-square rounded-xl overflow-hidden mb-2 border border-white/10 bg-[#050814]">
                          <SmartImage
                            src={pl.cover}
                            fallbackSrc="/assets/sections/music-preview.svg"
                            alt={pl.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover/pl:scale-110"
                          />
                        </div>
                        <div className="text-xs font-bold text-white truncate">
                          {pl.name}
                        </div>
                        <div className="text-[10px] font-mono text-emerald-300 truncate">
                          {pl.vibe}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-3">
                    {PLAYLISTS_PREVIEW.slice(4).map((pl) => (
                      <div
                        key={pl.id}
                        className="flex items-center gap-2.5 p-2 rounded-xl bg-white/[0.03] border border-white/[0.08]"
                      >
                        <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-white/10">
                          <SmartImage
                            src={pl.cover}
                            fallbackSrc="/assets/sections/music-preview.svg"
                            alt={pl.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-white truncate">
                            {pl.name}
                          </div>
                          <div className="text-[10px] font-mono text-slate-400 truncate">
                            {pl.vibe}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TiltSurface>
            </motion.div>

            {/* Right Companion Card: Dual Streaming Identity (4 cols) */}
            <motion.div variants={rightCardVariants} className="lg:col-span-4">
              <TiltSurface
                accentColor="#34d399"
                onClick={() => navigate('/music')}
                className="h-full p-5 sm:p-6"
              >
                <div className="relative z-20 flex flex-col h-full justify-between space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono uppercase tracking-[0.16em] text-emerald-300 font-semibold">
                        STREAMING PROFILES
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/15 text-emerald-200 border border-emerald-400/30">
                        Verified
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10">
                        <div className="h-24 rounded-xl overflow-hidden mb-2 border border-white/10">
                          <SmartImage
                            src="/assets/social/spotify.svg"
                            alt="Spotify Profile"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="text-xs font-bold text-white">
                          Spotify Profile
                        </div>
                        <div className="text-[10px] font-mono text-emerald-300 truncate">
                          Public playlists
                        </div>
                      </div>

                      <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10">
                        <div className="h-24 rounded-xl overflow-hidden mb-2 border border-white/10">
                          <SmartImage
                            src="/assets/social/youtube-music.svg"
                            alt="YouTube Music Profile"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="text-xs font-bold text-white">
                          YouTube Music
                        </div>
                        <div className="text-[10px] font-mono text-rose-300 truncate">
                          Public profile
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                    <span>Embedded Track Player</span>
                    <span className="font-mono text-emerald-300">Open /music →</span>
                  </div>
                </div>
              </TiltSurface>
            </motion.div>
          </motion.div>

          {/* -----------------------------------------------------------------
              GROUP 06 (RIGHT-ALIGNED PRIMARY) — JOURNAL, SOCIAL & VAULT
             ----------------------------------------------------------------- */}
          <motion.div
            variants={zigzagGroupVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.18 }}
            className="relative grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-7 items-stretch"
          >
            {/* Left Companion Card: Personal Vault (/vault) (4 cols) */}
            <motion.div
              variants={leftCardVariants}
              className="lg:col-span-4 order-2 lg:order-1"
            >
              <TiltSurface
                accentColor="#fbbf24"
                onClick={() => navigate('/developer')}
                className="h-full p-5 sm:p-6"
              >
                <div className="relative z-20 flex flex-col h-full justify-between space-y-4">
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-[0.16em] text-amber-300 font-semibold">
                        <Code2 className="w-3.5 h-3.5" />
                        SELECTED WORK
                      </span>
                      <ArrowUpRight className="w-4 h-4 text-amber-300" />
                    </div>

                    <div className="h-36 rounded-2xl overflow-hidden border border-white/10">
                      <SmartImage
                        src="/assets/projects/ayushman-os.svg"
                        alt="Selected project"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      A showcase of public projects and creative work.
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                    <span>Public project information</span>
                    <span className="font-mono text-amber-300">Open projects →</span>
                  </div>
                </div>
              </TiltSurface>
            </motion.div>

            {/* Right Primary Cluster: Daily Journal & Social Hub (8 cols) */}
            <motion.div
              variants={rightCardVariants}
              className="lg:col-span-8 order-1 lg:order-2"
            >
              <TiltSurface accentColor="#c084fc" className="h-full p-6 sm:p-7">
                <div className="relative z-20 flex flex-col h-full justify-between">
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/15 border border-purple-400/30 text-purple-200">
                        <Flame className="w-3.5 h-3.5 text-purple-300" />
                        06 · PUBLIC PLATFORMS
                      </span>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => navigate('/social')}
                          className="text-xs font-bold text-purple-300 hover:text-white inline-flex items-center gap-1 cursor-pointer"
                        >
                          Social Hub <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-white/20">•</span>
                        <button
                          type="button"
                          onClick={() => navigate('/developer')}
                          className="text-xs font-bold text-sky-300 hover:text-white inline-flex items-center gap-1 cursor-pointer"
                        >
                          Projects <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Public profile card */}
                      <div
                        onClick={() => navigate('/developer')}
                        className="cursor-pointer group/sub rounded-2xl p-4 bg-white/[0.03] border border-white/10 hover:border-purple-400/40 transition-all"
                      >
                        <div className="h-36 rounded-xl overflow-hidden mb-3 border border-white/10">
                          <SmartImage
                            src="/assets/projects/mithila-art.svg"
                            alt="Public projects"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover/sub:scale-105"
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-white">
                            Public projects
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">
                          Browse selected software and creative work.
                        </p>
                      </div>

                      {/* Social & Platforms Card */}
                      <div
                        onClick={() => navigate('/social')}
                        className="cursor-pointer group/sub rounded-2xl p-4 bg-white/[0.03] border border-white/10 hover:border-sky-400/40 transition-all"
                      >
                        <div className="h-36 rounded-xl overflow-hidden mb-3 border border-white/10">
                          <SmartImage
                            src="/assets/sections/social-preview.svg"
                            alt="Social & Platforms"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover/sub:scale-105"
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-white">
                            Social & Platforms
                          </span>
                          <span className="text-[11px] font-mono text-sky-300">
                            View profile
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">
                          Publicly selected social and platform links.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </TiltSurface>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* =====================================================================
          CINEMATIC FOOTER
         ===================================================================== */}
      <CinematicFooter />
    </div>
  );
};

export default LandingPage;
