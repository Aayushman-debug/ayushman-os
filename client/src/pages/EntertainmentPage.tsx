import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Film,
  Tv,
  Star,
  Search,
  Plus,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  Flame,
  Clapperboard,
  Heart,
  Bookmark,
  Play,
  Layers,
  ListPlus,
  X,
  Save,
  Filter,
  PauseCircle,
  Loader2,
  RotateCcw,
  AlertCircle
} from 'lucide-react';
import { AsciiArtCanvas } from '@/components/ui/ascii-art-canvas';
import { MediaCard, CinematicAnimeCard, AnimeEntry } from '@/components/ui/cards';
import { PageTransition } from '@/components/ui/page-transition';
import { useAuth } from '@/context/AuthContext';
import { usePortfolioTheme } from '@/themes/usePortfolioTheme';
import { FALLBACK_ANIME, FALLBACK_MOVIES } from '@/data/fallbackEntertainment';

type AnimeSectionFilter =
  | 'all'
  | 'completed'
  | 'watching'
  | 'plan_to_watch'
  | 'on_hold_dropped'
  | 'favorites';

export const EntertainmentPage: React.FC = () => {
  const { isAdmin } = useAuth();
  const { theme } = usePortfolioTheme();
  const isVillage = theme === 'village';

  const [activeTab, setActiveTab] = useState<'anime' | 'movies'>('anime');
  const [animeList, setAnimeList] = useState<AnimeEntry[]>(FALLBACK_ANIME);
  const [movieList, setMovieList] = useState<any[]>(FALLBACK_MOVIES);
  const [isLoadingAnime, setIsLoadingAnime] = useState<boolean>(false);
  const [animeError, setAnimeError] = useState<string | null>(null);
  const [isLoadingMovies, setIsLoadingMovies] = useState<boolean>(false);
  const [moviesError, setMoviesError] = useState<string | null>(null);
  const [sectionFilter, setSectionFilter] = useState<AnimeSectionFilter>('all');
  const [expandedHeroId, setExpandedHeroId] = useState<number | null>(1);

  // Search state for AniList
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [defaultAddStatus, setDefaultAddStatus] = useState<'plan_to_watch' | 'completed' | 'watching'>('plan_to_watch');
  const [defaultAddPriority, setDefaultAddPriority] = useState<'High' | 'Medium' | 'Low'>('High');

  // Batch Import Modal state
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [batchText, setBatchText] = useState('');
  const [batchStatus, setBatchStatus] = useState<'completed' | 'plan_to_watch' | 'watching'>('completed');
  const [batchIsPublic, setBatchIsPublic] = useState(false);
  const [isBatchImporting, setIsBatchImporting] = useState(false);

  // Edit Anime Modal state
  const [editingAnime, setEditingAnime] = useState<AnimeEntry | null>(null);
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  const loadAnime = useCallback(async () => {
    setIsLoadingAnime(true);
    try {
      const r = await fetch('/api/entertainment/anime');
      if (!r.ok) throw new Error(`Live sync notice (status ${r.status})`);
      const d = await r.json();
      if (d.anime && Array.isArray(d.anime) && d.anime.length > 0) {
        setAnimeList(d.anime);
        setAnimeError(null);
        const firstFav = d.anime.find((a: AnimeEntry) => a.isFavorite) || d.anime[0];
        if (firstFav) setExpandedHeroId(firstFav.id);
      }
    } catch (err: any) {
      console.warn('[Anime Sync Notice]:', err.message);
      // Retain existing collection, provide non-disruptive feedback
      setAnimeError('Offline / Cached Mode — showing verified library');
    } finally {
      setIsLoadingAnime(false);
    }
  }, []);

  const loadMovies = useCallback(async () => {
    setIsLoadingMovies(true);
    try {
      const r = await fetch('/api/entertainment/movies');
      if (!r.ok) throw new Error(`Live sync notice (status ${r.status})`);
      const d = await r.json();
      if (d.movies && Array.isArray(d.movies) && d.movies.length > 0) {
        setMovieList(d.movies);
        setMoviesError(null);
      }
    } catch (err: any) {
      console.warn('[Movies Sync Notice]:', err.message);
      // Retain existing movies, provide non-disruptive feedback
      setMoviesError('Offline / Cached Mode — showing verified cinema');
    } finally {
      setIsLoadingMovies(false);
    }
  }, []);

  useEffect(() => {
    loadAnime();
    loadMovies();
  }, [loadAnime, loadMovies]);

  // Featured row for public favorites
  const featuredGalleryAnime = useMemo(() => {
    const favs = animeList.filter((a) => a.isFavorite);
    return (favs.length >= 4 ? favs : animeList).slice(0, 6);
  }, [animeList]);

  // Filtered anime list by active section tab
  const filteredAnime = useMemo(() => {
    switch (sectionFilter) {
      case 'completed':
        return animeList.filter((a) => a.status === 'completed');
      case 'watching':
        return animeList.filter((a) => a.status === 'watching');
      case 'plan_to_watch':
        return animeList.filter((a) => a.status === 'plan_to_watch');
      case 'on_hold_dropped':
        return animeList.filter((a) => a.status === 'on_hold' || a.status === 'dropped');
      case 'favorites':
        return animeList.filter((a) => a.isFavorite);
      default:
        return animeList;
    }
  }, [animeList, sectionFilter]);

  // Stats counters
  const stats = useMemo(() => {
    const completed = animeList.filter((a) => a.status === 'completed').length;
    const watching = animeList.filter((a) => a.status === 'watching').length;
    const watchlist = animeList.filter((a) => a.status === 'plan_to_watch').length;
    const favorites = animeList.filter((a) => a.isFavorite).length;
    const totalEpisodesWatched = animeList.reduce((acc, a) => acc + (Number(a.episodesWatched) || 0), 0);
    return { completed, watching, watchlist, favorites, totalEpisodesWatched };
  }, [animeList]);

  const handleAniListSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const res = await fetch(`/api/entertainment/anime/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      if (data.results) {
        setSearchResults(data.results);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddFromAniList = async (
    result: any,
    targetStatus: 'plan_to_watch' | 'completed' | 'watching' = defaultAddStatus
  ) => {
    const title = result.title?.english || result.title?.romaji || 'Anime';
    const totalEpisodes = result.episodes || 12;
    const payload = {
      anilistId: result.id,
      title,
      japaneseTitle: result.title?.romaji || '',
      posterUrl:
        result.coverImage?.extraLarge ||
        result.coverImage?.large ||
        'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop',
      bannerUrl: result.bannerImage || result.coverImage?.extraLarge || '',
      format: result.format || 'TV',
      totalEpisodes,
      episodesWatched: targetStatus === 'completed' ? totalEpisodes : 0,
      status: targetStatus,
      score: result.averageScore ? Number((result.averageScore / 10).toFixed(1)) : 8.5,
      isFavorite: false,
      priority: defaultAddPriority,
      genres: result.genres || [],
      studio: result.studios?.nodes?.[0]?.name || '',
      seasonYear: result.seasonYear || undefined,
      favoriteCharacter: '',
      notes: result.description ? result.description.replace(/<[^>]*>/g, '').slice(0, 180) : '',
    };

    try {
      const res = await fetch('/api/entertainment/anime', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      const nextList = Array.isArray(data.list)
        ? data.list
        : Array.isArray(data.anime)
        ? data.anime
        : null;
      if (nextList) {
        setAnimeList(nextList);
      }
    } catch (err) {
      console.error('Failed to add anime:', err);
    }
  };

  const handleUpdateAnime = async (id: number, patch: Partial<AnimeEntry>) => {
    // Optimistic update
    setAnimeList((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
    try {
      const res = await fetch(`/api/entertainment/anime/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      });
      const data = await res.json();
      const nextList = Array.isArray(data.list)
        ? data.list
        : Array.isArray(data.anime)
        ? data.anime
        : null;
      if (nextList) {
        setAnimeList(nextList);
      }
    } catch (err) {
      console.error('Failed to update anime:', err);
    }
  };

  const handleDeleteAnime = async (id: number) => {
    setAnimeList((prev) => prev.filter((item) => item.id !== id));
    try {
      const res = await fetch(`/api/entertainment/anime/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      const nextList = Array.isArray(data.list)
        ? data.list
        : Array.isArray(data.anime)
        ? data.anime
        : null;
      if (nextList) {
        setAnimeList(nextList);
      }
    } catch (err) {
      console.error('Failed to delete anime:', err);
    }
  };

  const handleSaveEditModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAnime) return;
    setIsSavingEdit(true);
    try {
      await handleUpdateAnime(editingAnime.id, editingAnime);
      setEditingAnime(null);
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleBatchImport = async (e: React.FormEvent) => {
    e.preventDefault();
    const titles = batchText
      .split(/[\n,]+/)
      .map((t) => t.trim())
      .filter(Boolean);
    if (titles.length === 0) return;

    setIsBatchImporting(true);
    try {
      const res = await fetch('/api/entertainment/anime/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titles,
          status: batchStatus,
          priority: 'High',
          isPublic: batchIsPublic,
        }),
      });
      const data = await res.json();
      if (data.anime) {
        setAnimeList(data.anime);
      }
      setBatchText('');
      setIsBatchModalOpen(false);
    } catch (err) {
      console.error('Batch import failed:', err);
    } finally {
      setIsBatchImporting(false);
    }
  };

  return (
    <PageTransition>
      <div className="space-y-8 animate-in fade-in duration-300">
        {/* Header Banner */}
        <div className={`relative overflow-hidden p-6 sm:p-8 rounded-3xl border flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-xl backdrop-blur-md ${
          isVillage
            ? 'bg-[#fffdfa] border-[#78350f]/15 shadow-sm'
            : 'bg-white/[0.02] border-white/10'
        }`}>
          <div className="absolute inset-0 pointer-events-none opacity-25">
            <AsciiArtCanvas
              theme={isVillage ? 'amber' : 'moonlight'}
              renderMode="dots"
              animStyle="wave"
              cellSize={14}
              contrast={115}
              bloom={!isVillage}
              vignette={true}
              animSpeed={0.6}
              animIntensity={isVillage ? 15 : 35}
            />
          </div>

          <div className="relative z-10 max-w-2xl">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono mb-3 border ${
              isVillage
                ? 'bg-[#c86d51]/10 border-[#c86d51]/30 text-[#c86d51]'
                : 'bg-pink-500/10 border-pink-500/20 text-pink-400'
            }`}>
              <Film className="size-3.5" />
              <span>AYushMan Anime & Cinema Archive</span>
            </div>
            <h1 className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${
              isVillage ? 'text-[#2c251e]' : 'text-white'
            }`}>
              Anime Sanctuary & Watchlist
            </h1>
            <p className={`text-sm mt-1.5 leading-relaxed ${
              isVillage ? 'text-[#685e52]' : 'text-neutral-400'
            }`}>
              Featuring the Big Three (<span className={`${isVillage ? 'text-[#c86d51]' : 'text-pink-300'} font-semibold`}>One Piece</span>,{' '}
              <span className={`${isVillage ? 'text-[#b45309]' : 'text-amber-300'} font-semibold`}>Naruto: Shippuden</span>,{' '}
              <span className={`${isVillage ? 'text-[#2d6a4f]' : 'text-cyan-300'} font-semibold`}>Bleach</span>), confirmed completed series, interactive Watchlist priority queue, and live AniList GraphQL sync.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 relative z-10">
            <div className={`p-3.5 rounded-2xl text-center shadow-sm backdrop-blur-md border ${
              isVillage ? 'bg-[#fffdfa] border-[#78350f]/15' : 'bg-black/50 border-emerald-500/25 shadow-lg'
            }`}>
              <div className={`text-2xl font-extrabold ${isVillage ? 'text-[#2d6a4f]' : 'text-emerald-400'}`}>{stats.completed}</div>
              <div className={`text-[10px] font-mono uppercase tracking-wider mt-0.5 ${isVillage ? 'text-[#685e52]' : 'text-neutral-400'}`}>
                Watched
              </div>
            </div>
            <div className={`p-3.5 rounded-2xl text-center shadow-sm backdrop-blur-md border ${
              isVillage ? 'bg-[#fffdfa] border-[#78350f]/15' : 'bg-black/50 border-amber-500/25 shadow-lg'
            }`}>
              <div className={`text-2xl font-extrabold ${isVillage ? 'text-[#b45309]' : 'text-amber-400'}`}>{stats.watchlist}</div>
              <div className={`text-[10px] font-mono uppercase tracking-wider mt-0.5 ${isVillage ? 'text-[#685e52]' : 'text-neutral-400'}`}>
                Watchlist
              </div>
            </div>
            <div className={`p-3.5 rounded-2xl text-center shadow-sm backdrop-blur-md border ${
              isVillage ? 'bg-[#fffdfa] border-[#78350f]/15' : 'bg-black/50 border-pink-500/25 shadow-lg'
            }`}>
              <div className={`text-2xl font-extrabold ${isVillage ? 'text-[#c86d51]' : 'text-pink-400'}`}>{stats.favorites}</div>
              <div className={`text-[10px] font-mono uppercase tracking-wider mt-0.5 ${isVillage ? 'text-[#685e52]' : 'text-neutral-400'}`}>
                Favorites
              </div>
            </div>
            <div className={`p-3.5 rounded-2xl text-center shadow-sm backdrop-blur-md border ${
              isVillage ? 'bg-[#fffdfa] border-[#78350f]/15' : 'bg-black/50 border-cyan-500/25 shadow-lg'
            }`}>
              <div className={`text-2xl font-extrabold ${isVillage ? 'text-[#0284c7]' : 'text-cyan-400'}`}>
                {stats.totalEpisodesWatched.toLocaleString()}
              </div>
              <div className={`text-[10px] font-mono uppercase tracking-wider mt-0.5 ${isVillage ? 'text-[#685e52]' : 'text-neutral-400'}`}>
                Episodes Seen
              </div>
            </div>
          </div>
        </div>

        {/* Top-level Mode Switcher (Anime vs Movies) + Batch Import Action */}
        <div className={`flex flex-wrap items-center justify-between gap-4 border-b pb-4 ${isVillage ? 'border-[#78350f]/15' : 'border-white/10'}`}>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('anime')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
                activeTab === 'anime'
                  ? (isVillage
                      ? 'bg-[#c86d51] text-white shadow-md border border-[#b85d43]'
                      : 'bg-pink-600 text-white shadow-lg shadow-pink-600/30 border border-pink-400/40')
                  : (isVillage
                      ? 'bg-[#f5efe6] text-[#685e52] hover:bg-[#eee7dc] border border-[#78350f]/15'
                      : 'bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white border border-white/5')
              }`}
            >
              <Tv className="size-4" />
              <span>Anime Collection ({animeList.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('movies')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
                activeTab === 'movies'
                  ? (isVillage
                      ? 'bg-[#2d6a4f] text-white shadow-md border border-[#235841]'
                      : 'bg-purple-600 text-white shadow-lg shadow-purple-600/30 border border-purple-400/40')
                  : (isVillage
                      ? 'bg-[#f5efe6] text-[#685e52] hover:bg-[#eee7dc] border border-[#78350f]/15'
                      : 'bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white border border-white/5')
              }`}
            >
              <Clapperboard className="size-4" />
              <span>Movies & Cinema ({movieList.length})</span>
            </button>
          </div>

          {isAdmin && activeTab === 'anime' && (
            <button
              type="button"
              onClick={() => setIsBatchModalOpen(true)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-mono font-bold transition cursor-pointer shadow-sm ${
                isVillage
                  ? 'bg-[#f5efe6] hover:bg-[#ede5d8] border-[#78350f]/25 text-[#78350f]'
                  : 'bg-gradient-to-r from-pink-600/25 to-purple-600/25 hover:from-pink-600/40 hover:to-purple-600/40 border-pink-500/35 text-pink-200'
              }`}
            >
              <ListPlus className={`size-4 ${isVillage ? 'text-[#78350f]' : 'text-pink-400'}`} />
              <span>Batch Import Anime Titles</span>
            </button>
          )}
        </div>

        {activeTab === 'anime' ? (
          <div className="space-y-8">
            {/* 21st.dev Hover-Expand Poster Gallery for Featured / Big Three / Favorites */}
            {featuredGalleryAnime.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className={`flex items-center gap-2 text-xs font-mono uppercase tracking-widest ${
                    isVillage ? 'text-[#c86d51]' : 'text-pink-400'
                  }`}>
                    <Flame className={`size-4 ${isVillage ? 'text-[#c86d51]' : 'text-pink-500'}`} />
                    <span>Hall of Fame — Hover-Expand Anime Showcase</span>
                  </div>
                  <span className={`text-[11px] font-mono hidden sm:inline ${
                    isVillage ? 'text-[#8c8275]' : 'text-neutral-500'
                  }`}>
                    Hover or tap any pillar to expand key visual & lore
                  </span>
                </div>

                <div className="flex flex-col md:flex-row gap-3 h-auto md:h-[340px] w-full">
                  {featuredGalleryAnime.map((anime) => {
                    const isExpanded = expandedHeroId === anime.id;
                    return (
                      <div
                        key={anime.id}
                        onMouseEnter={() => setExpandedHeroId(anime.id)}
                        onClick={() => setExpandedHeroId(anime.id)}
                        className={`relative rounded-2xl overflow-hidden border transition-all duration-500 ease-out cursor-pointer select-none ${
                          isExpanded
                            ? (isVillage
                                ? 'md:flex-[3.6] h-[280px] md:h-full border-[#c86d51] shadow-[0_12px_30px_rgba(200,109,81,0.25)]'
                                : 'md:flex-[3.6] h-[280px] md:h-full border-pink-500/60 shadow-[0_15px_45px_-10px_rgba(236,72,153,0.35)]')
                            : (isVillage
                                ? 'md:flex-1 h-[90px] md:h-full border-[#78350f]/20 hover:border-[#c86d51]/50 opacity-80 hover:opacity-100'
                                : 'md:flex-1 h-[90px] md:h-full border-white/10 hover:border-white/25 opacity-75 hover:opacity-95')
                        }`}
                      >
                        <img
                          src={isExpanded && anime.bannerUrl ? anime.bannerUrl : anime.posterUrl}
                          alt={anime.title}
                          className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#05070e] via-[#05070e]/55 to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#05070e]/85 via-transparent to-transparent" />

                        <div className="relative z-10 h-full p-5 flex flex-col justify-end">
                          {isExpanded ? (
                            <div className="space-y-2 max-w-lg animate-in fade-in duration-300">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="px-2.5 py-0.5 rounded-full bg-pink-500/25 border border-pink-400/40 text-pink-200 text-[10px] font-mono font-bold uppercase">
                                  {anime.status === 'completed' ? 'COMPLETED' : anime.status.toUpperCase()}
                                </span>
                                <span className="px-2.5 py-0.5 rounded-full bg-black/70 border border-amber-400/40 text-amber-300 text-xs font-mono font-bold flex items-center gap-1">
                                  <Star className="size-3 fill-amber-400 text-amber-400" />
                                  {Number(anime.score).toFixed(1)}
                                </span>
                                {anime.studio && (
                                  <span className="text-xs font-mono text-neutral-300">
                                    {anime.studio}
                                  </span>
                                )}
                              </div>

                              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-none">
                                {anime.title}
                              </h2>
                              {anime.japaneseTitle && (
                                <div className="text-xs font-mono text-pink-300/90">
                                  {anime.japaneseTitle} • {anime.episodesWatched}/{anime.totalEpisodes} EPS
                                </div>
                              )}

                              {anime.favoriteCharacter && (
                                <div className="text-xs text-cyan-300 font-mono">
                                  Signature Character:{' '}
                                  <span className="text-white font-bold">{anime.favoriteCharacter}</span>
                                </div>
                              )}

                              {anime.notes && (
                                <p className="text-xs text-neutral-300 line-clamp-2 italic max-w-md">
                                  "{anime.notes}"
                                </p>
                              )}
                            </div>
                          ) : (
                            <div className="flex md:flex-col items-center md:items-start justify-between gap-2">
                              <span className="px-2 py-0.5 rounded bg-black/75 border border-white/15 text-[10px] font-mono font-bold text-amber-300">
                                ★ {Number(anime.score).toFixed(1)}
                              </span>
                              <h3 className="text-sm font-bold text-white md:[writing-mode:vertical-rl] md:rotate-180 tracking-wider truncate max-h-[200px]">
                                {anime.title}
                              </h3>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* AniList Live Search & Quick Add Bar */}
            <div className={`p-6 rounded-2xl border space-y-4 ${
              isVillage
                ? 'bg-[#fffdfa] border-[#78350f]/15 shadow-sm text-[#2c251e]'
                : 'bg-[#0b0e18]/90 border-white/10 shadow-xl backdrop-blur-md'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className={`text-xs font-mono uppercase tracking-wider flex items-center gap-2 ${
                    isVillage ? 'text-[#c86d51]' : 'text-pink-400'
                  }`}>
                    <Search className="size-3.5" />
                    <span>AniList Live Search & Watchlist Adder</span>
                  </h3>
                  <p className={`text-xs mt-0.5 ${isVillage ? 'text-[#685e52]' : 'text-neutral-400'}`}>
                    Search any anime from AniList GraphQL and add it directly to your Watchlist or Watched archive.
                  </p>
                </div>

                {/* Default Target Status & Priority Controls */}
                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={defaultAddStatus}
                    onChange={(e) => setDefaultAddStatus(e.target.value as any)}
                    className={`rounded-xl px-3 py-1.5 text-xs font-mono focus:outline-none border ${
                      isVillage
                        ? 'bg-[#f5efe6] border-[#78350f]/20 text-[#2c251e] focus:border-[#2d6a4f]'
                        : 'bg-black/60 border-white/15 text-white focus:border-pink-500'
                    }`}
                  >
                    <option value="plan_to_watch">Target: Watchlist</option>
                    <option value="completed">Target: Watched (Completed)</option>
                    <option value="watching">Target: Currently Watching</option>
                  </select>

                  {defaultAddStatus === 'plan_to_watch' && (
                    <select
                      value={defaultAddPriority}
                      onChange={(e) => setDefaultAddPriority(e.target.value as any)}
                      className={`rounded-xl px-3 py-1.5 text-xs font-mono focus:outline-none border ${
                        isVillage
                          ? 'bg-[#fef3c7] border-[#78350f]/30 text-[#78350f] focus:border-[#c86d51]'
                          : 'bg-black/60 border-amber-500/30 text-amber-300 focus:border-amber-400'
                      }`}
                    >
                      <option value="High">High Priority</option>
                      <option value="Medium">Medium Priority</option>
                      <option value="Low">Low Priority</option>
                    </select>
                  )}
                </div>
              </div>

              <form onSubmit={handleAniListSearch} className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search anime on AniList (e.g. 'Monster', 'Cyberpunk: Edgerunners', 'Vinland Saga', 'Death Note')..."
                  className={`flex-1 rounded-xl px-4 py-2.5 text-xs sm:text-sm border outline-none transition ${
                    isVillage
                      ? 'bg-[#f5efe6] border-[#78350f]/20 text-[#2c251e] placeholder-[#8c8275] focus:border-[#2d6a4f]'
                      : 'bg-black/50 border-white/10 text-white placeholder-neutral-500 focus:border-pink-500'
                  }`}
                />
                <button
                  type="submit"
                  disabled={isSearching}
                  className={`px-6 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2 cursor-pointer shrink-0 ${
                    isVillage
                      ? 'bg-[#2d6a4f] text-white hover:bg-[#235841] shadow-sm'
                      : 'bg-pink-600 hover:bg-pink-500 text-white shadow-lg shadow-pink-600/30'
                  }`}
                >
                  {isSearching ? (
                    <>
                      <Loader2 className="size-3.5 animate-spin" />
                      <span>Searching...</span>
                    </>
                  ) : (
                    <>
                      <Search className="size-3.5" />
                      <span>Search AniList</span>
                    </>
                  )}
                </button>
              </form>

              {/* Search Results Grid */}
              {searchResults.length > 0 && (
                <div className={`pt-4 border-t space-y-3 ${isVillage ? 'border-[#78350f]/15' : 'border-white/10'}`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-mono ${isVillage ? 'text-[#685e52]' : 'text-neutral-400'}`}>
                      Showing {searchResults.length} results from AniList
                    </span>
                    <button
                      type="button"
                      onClick={() => setSearchResults([])}
                      className={`text-xs font-mono cursor-pointer ${isVillage ? 'text-[#78350f] hover:text-[#2c251e]' : 'text-neutral-400 hover:text-white'}`}
                    >
                      Clear results
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {searchResults.map((result) => {
                      const title = result.title?.english || result.title?.romaji;
                      const alreadyInLibrary = animeList.some(
                        (a) =>
                          a.anilistId === result.id ||
                          a.title.toLowerCase() === String(title).toLowerCase()
                      );

                      return (
                        <div
                          key={result.id}
                          className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition ${
                            isVillage
                              ? 'bg-[#f5efe6] border-[#78350f]/15 hover:border-[#2d6a4f]/50'
                              : 'bg-white/[0.04] border-white/10 hover:border-pink-500/40'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={result.coverImage?.large}
                              alt={title}
                              className={`w-12 h-16 rounded-lg object-cover shrink-0 border ${isVillage ? 'border-[#78350f]/20' : 'border-white/10'}`}
                            />
                            <div className="min-w-0">
                              <div className={`text-xs font-bold truncate ${isVillage ? 'text-[#2c251e]' : 'text-white'}`}>{title}</div>
                              <div className={`text-[11px] font-mono mt-0.5 ${isVillage ? 'text-[#685e52]' : 'text-neutral-400'}`}>
                                {result.format} · {result.episodes || '?'} eps ·{' '}
                                {result.averageScore ? `${(result.averageScore / 10).toFixed(1)} ★` : 'N/A'}
                              </div>
                              {result.studios?.nodes?.[0]?.name && (
                                <div className={`text-[10px] font-mono truncate ${isVillage ? 'text-[#78350f]' : 'text-pink-300/80'}`}>
                                  {result.studios.nodes[0].name}
                                </div>
                              )}
                            </div>
                          </div>

                          {alreadyInLibrary ? (
                            <span className={`px-2.5 py-1 rounded-lg border text-[10px] font-mono font-bold shrink-0 ${
                              isVillage
                                ? 'bg-[#d8f3dc] border-[#2d6a4f]/30 text-[#2d6a4f]'
                                : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                            }`}>
                              In Library
                            </span>
                          ) : (
                            <div className="flex flex-col gap-1.5 shrink-0">
                              {isAdmin && (
                                <button
                                  type="button"
                                  onClick={() => handleAddFromAniList(result, 'plan_to_watch')}
                                  className={`px-2.5 py-1 rounded-lg font-mono font-bold text-[10px] transition flex items-center gap-1 cursor-pointer ${
                                    isVillage
                                      ? 'bg-[#fef3c7] text-[#78350f] hover:bg-[#fde68a] border border-[#78350f]/20'
                                      : 'bg-amber-500/20 hover:bg-amber-500 text-amber-200 hover:text-black'
                                  }`}
                                  title="Add to Watchlist"
                                >
                                  <Bookmark className="size-3" />
                                  <span>+ Watchlist</span>
                                </button>
                              )}
                              {isAdmin && (
                                <button
                                  type="button"
                                  onClick={() => handleAddFromAniList(result, 'completed')}
                                  className={`px-2.5 py-1 rounded-lg font-mono font-bold text-[10px] transition flex items-center gap-1 cursor-pointer ${
                                    isVillage
                                      ? 'bg-[#d8f3dc] text-[#2d6a4f] hover:bg-[#b7e4c7] border border-[#2d6a4f]/30'
                                      : 'bg-emerald-500/20 hover:bg-emerald-500 text-emerald-200 hover:text-black'
                                  }`}
                                  title="Add as Watched"
                                >
                                  <CheckCircle2 className="size-3" />
                                  <span>+ Watched</span>
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Section Filter Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                {(
                  [
                    { id: 'all', label: 'All Anime', count: animeList.length, icon: Layers },
                    { id: 'completed', label: 'Watched', count: stats.completed, icon: CheckCircle2 },
                    { id: 'watching', label: 'Currently Watching', count: stats.watching, icon: Play },
                    { id: 'plan_to_watch', label: 'Watchlist Queue', count: stats.watchlist, icon: Bookmark },
                    { id: 'favorites', label: 'Favorites', count: stats.favorites, icon: Heart },
                    {
                      id: 'on_hold_dropped',
                      label: 'On Hold / Dropped',
                      count: animeList.filter((a) => a.status === 'on_hold' || a.status === 'dropped').length,
                      icon: PauseCircle,
                    },
                  ] as const
                ).map((tab) => {
                  const Icon = tab.icon;
                  const active = sectionFilter === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setSectionFilter(tab.id)}
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition cursor-pointer border ${
                        active
                          ? (isVillage
                              ? 'bg-[#2d6a4f] border-[#2d6a4f] text-white shadow-sm'
                              : 'bg-pink-500/20 border-pink-500/50 text-pink-200 shadow-[0_0_20px_rgba(236,72,153,0.25)]')
                          : (isVillage
                              ? 'bg-[#f5efe6] border-[#78350f]/15 text-[#685e52] hover:bg-[#eee7dc] hover:text-[#2c251e]'
                              : 'bg-white/[0.03] border-white/10 text-neutral-400 hover:text-white hover:bg-white/[0.07]')
                      }`}
                    >
                      <Icon className="size-3.5" />
                      <span>{tab.label}</span>
                      <span className={`px-1.5 py-0.2 rounded-md text-[10px] ${
                        isVillage
                          ? (active ? 'bg-black/20 text-white' : 'bg-[#e8decb] text-[#78350f]')
                          : 'bg-black/50 text-neutral-300'
                      }`}>
                        {tab.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Anime Non-Disruptive Error / Sync Notice State */}
            {animeError && (
              <div className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-3 ${
                isVillage
                  ? 'bg-[#fff5f2] border-[#c86d51]/30 text-[#b85d43]'
                  : 'bg-rose-500/10 border-rose-500/20 text-rose-300'
              }`}>
                <div className="flex items-center gap-2">
                  <AlertCircle className="size-4 shrink-0 text-[#c86d51]" />
                  <span>{animeError}</span>
                </div>
                <button
                  type="button"
                  onClick={() => loadAnime()}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition ${
                    isVillage
                      ? 'bg-[#c86d51] text-white hover:bg-[#b85d43]'
                      : 'bg-rose-500/20 hover:bg-rose-500/30 text-white'
                  }`}
                >
                  <RotateCcw className="size-3" />
                  <span>Retry</span>
                </button>
              </div>
            )}

            {/* Anime Loading State */}
            {isLoadingAnime && (
              <div className={`p-12 rounded-3xl border text-center space-y-3 ${
                isVillage ? 'bg-[#fffdfa] border-[#78350f]/15' : 'bg-white/[0.02] border-white/10'
              }`}>
                <Loader2 className={`size-8 animate-spin mx-auto ${isVillage ? 'text-[#2d6a4f]' : 'text-pink-400'}`} />
                <div className={`text-sm font-bold ${isVillage ? 'text-[#2c251e]' : 'text-white'}`}>Loading Anime Collection...</div>
                <p className={`text-xs ${isVillage ? 'text-[#685e52]' : 'text-neutral-400'}`}>Fetching your anime watchlist and ratings</p>
              </div>
            )}

            {/* Anime Cards Grid using CinematicAnimeCard */}
            {!isLoadingAnime && filteredAnime.length === 0 ? (
              <div className={`p-12 rounded-3xl border text-center space-y-3 ${
                isVillage ? 'bg-[#fffdfa] border-[#78350f]/15' : 'bg-white/[0.02] border-white/10'
              }`}>
                <Tv className={`size-10 mx-auto ${isVillage ? 'text-[#78350f]/50' : 'text-pink-400/50'}`} />
                <div className={`text-base font-bold ${isVillage ? 'text-[#2c251e]' : 'text-white'}`}>No anime in this section yet</div>
                <p className={`text-xs max-w-md mx-auto ${isVillage ? 'text-[#685e52]' : 'text-neutral-400'}`}>
                  {isAdmin
                    ? 'Use the AniList search or batch import to add titles to your collection.'
                    : 'There are no publicly shared titles in this collection yet.'}
                </p>
              </div>
            ) : !isLoadingAnime && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredAnime.map((anime) => (
                  <CinematicAnimeCard
                    key={anime.id}
                    anime={anime}
                    onUpdateAnime={handleUpdateAnime}
                    onEditModal={(item) => setEditingAnime({ ...item })}
                    onDeleteAnime={handleDeleteAnime}
                    readOnly={!isAdmin}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Cinema Universe using MediaCard */
          <div className="space-y-6">
            {moviesError && (
              <div className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-3 ${
                isVillage
                  ? 'bg-[#fff5f2] border-[#c86d51]/30 text-[#b85d43]'
                  : 'bg-rose-500/10 border-rose-500/20 text-rose-300'
              }`}>
                <div className="flex items-center gap-2">
                  <AlertCircle className="size-4 shrink-0 text-[#c86d51]" />
                  <span>{moviesError}</span>
                </div>
                <button
                  type="button"
                  onClick={() => loadMovies()}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition ${
                    isVillage
                      ? 'bg-[#c86d51] text-white hover:bg-[#b85d43]'
                      : 'bg-rose-500/20 hover:bg-rose-500/30 text-white'
                  }`}
                >
                  <RotateCcw className="size-3" />
                  <span>Retry</span>
                </button>
              </div>
            )}

            {isLoadingMovies && (
              <div className={`p-12 rounded-3xl border text-center space-y-3 ${
                isVillage ? 'bg-[#fffdfa] border-[#78350f]/15' : 'bg-white/[0.02] border-white/10'
              }`}>
                <Loader2 className={`size-8 animate-spin mx-auto ${isVillage ? 'text-[#2d6a4f]' : 'text-purple-400'}`} />
                <div className={`text-sm font-bold ${isVillage ? 'text-[#2c251e]' : 'text-white'}`}>Loading Movies & Cinema...</div>
                <p className={`text-xs ${isVillage ? 'text-[#685e52]' : 'text-neutral-400'}`}>Fetching curated films and reviews</p>
              </div>
            )}

            {!isLoadingMovies && movieList.length === 0 && (
              <div className={`p-12 rounded-3xl border text-center space-y-3 ${
                isVillage ? 'bg-[#fffdfa] border-[#78350f]/15' : 'bg-white/[0.02] border-white/10'
              }`}>
                <Clapperboard className={`size-10 mx-auto ${isVillage ? 'text-[#78350f]/50' : 'text-neutral-500'}`} />
                <div className={`text-base font-bold ${isVillage ? 'text-[#2c251e]' : 'text-white'}`}>No cinema entries yet</div>
                <p className={`text-xs max-w-md mx-auto ${isVillage ? 'text-[#685e52]' : 'text-neutral-400'}`}>
                  {isAdmin ? 'Add movie reviews and ratings in the dashboard.' : 'No movies have been added to the public collection yet.'}
                </p>
              </div>
            )}

            {!isLoadingMovies && movieList.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {movieList.map((movie) => (
                  <MediaCard
                    key={movie.id}
                    title={movie.title}
                    subtitle={`Released ${movie.releaseYear}`}
                    imageUrl={movie.posterUrl}
                    aspectRatio="video"
                    badge={`${movie.rating} ★`}
                    badgeColor="text-amber-300 bg-black/75 border-amber-500/30"
                    primaryActionLabel="Letterboxd / IMDb"
                    primaryActionUrl={`https://letterboxd.com/search/${encodeURIComponent(movie.title)}/`}
                  >
                    {movie.review && <p className="text-xs text-neutral-400 leading-relaxed italic">"{movie.review}"</p>}
                  </MediaCard>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Batch Import Modal */}
        {isAdmin && isBatchModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
            <div className={`w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-5 border ${
              isVillage
                ? 'bg-[#fffdfa] border-[#78350f]/20 text-[#2c251e]'
                : 'bg-[#0b0e18] border-pink-500/30 text-white'
            }`}>
              <div className={`flex items-center justify-between border-b pb-4 ${
                isVillage ? 'border-[#78350f]/15' : 'border-white/10'
              }`}>
                <div>
                  <h3 className={`text-lg font-bold flex items-center gap-2 ${
                    isVillage ? 'text-[#2c251e]' : 'text-white'
                  }`}>
                    <ListPlus className={`size-5 ${isVillage ? 'text-[#c86d51]' : 'text-pink-400'}`} />
                    <span>Batch Import Anime via AniList</span>
                  </h3>
                  <p className={`text-xs mt-0.5 ${isVillage ? 'text-[#685e52]' : 'text-neutral-400'}`}>
                    Enter multiple anime titles (one per line or comma-separated). Official posters, episode counts, and metadata will be fetched automatically.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsBatchModalOpen(false)}
                  className={`p-1.5 rounded-lg cursor-pointer ${
                    isVillage ? 'bg-[#f5efe6] text-[#685e52] hover:text-[#2c251e]' : 'bg-white/5 hover:bg-white/15 text-neutral-400 hover:text-white'
                  }`}
                >
                  <X className="size-4" />
                </button>
              </div>

              <form onSubmit={handleBatchImport} className="space-y-4">
                <div>
                  <label className={`block text-xs font-mono uppercase mb-1.5 ${
                    isVillage ? 'text-[#78350f]' : 'text-neutral-400'
                  }`}>
                    Target Section
                  </label>
                  <label className={`flex items-center gap-2 text-xs font-mono cursor-pointer mb-2 ${
                    isVillage ? 'text-[#2d6a4f]' : 'text-cyan-300'
                  }`}>
                    <input
                      type="checkbox"
                      checked={batchIsPublic}
                      onChange={(e) => setBatchIsPublic(e.target.checked)}
                      className="rounded"
                    />
                    <span>Share publicly</span>
                  </label>
                  <select
                    value={batchStatus}
                    onChange={(e) => setBatchStatus(e.target.value as any)}
                    className={`w-full rounded-xl px-3.5 py-2.5 text-xs font-mono focus:outline-none border ${
                      isVillage
                        ? 'bg-[#f5efe6] border-[#78350f]/20 text-[#2c251e] focus:border-[#2d6a4f]'
                        : 'bg-black/60 border-white/15 text-white focus:border-pink-500'
                    }`}
                  >
                    <option value="completed">Watched (Completed)</option>
                    <option value="plan_to_watch">Watchlist (Plan to Watch)</option>
                    <option value="watching">Currently Watching</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-xs font-mono uppercase mb-1.5 ${
                    isVillage ? 'text-[#78350f]' : 'text-neutral-400'
                  }`}>
                    Anime Titles (One per line or comma-separated)
                  </label>
                  <textarea
                    rows={5}
                    value={batchText}
                    onChange={(e) => setBatchText(e.target.value)}
                    placeholder={`Death Note\nHunter x Hunter\nFullmetal Alchemist: Brotherhood\nCode Geass\nSteins;Gate`}
                    className={`w-full rounded-xl p-3.5 text-xs font-mono focus:outline-none border ${
                      isVillage
                        ? 'bg-[#f5efe6] border-[#78350f]/20 text-[#2c251e] placeholder-[#8c8275] focus:border-[#2d6a4f]'
                        : 'bg-black/60 border-white/15 text-white placeholder-neutral-600 focus:border-pink-500'
                    }`}
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsBatchModalOpen(false)}
                    className={`px-4 py-2 rounded-xl text-xs font-mono cursor-pointer ${
                      isVillage ? 'bg-[#f5efe6] text-[#685e52] hover:bg-[#eee7dc]' : 'bg-white/5 hover:bg-white/10 text-neutral-300'
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isBatchImporting || !batchText.trim()}
                    className={`px-5 py-2 rounded-xl disabled:opacity-40 text-xs font-mono font-bold flex items-center gap-2 cursor-pointer shadow-md ${
                      isVillage
                        ? 'bg-[#2d6a4f] text-white hover:bg-[#235841]'
                        : 'bg-pink-600 hover:bg-pink-500 text-white shadow-pink-600/30'
                    }`}
                  >
                    {isBatchImporting ? (
                      <>
                        <Loader2 className="size-3.5 animate-spin" />
                        <span>Fetching from AniList...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="size-3.5" />
                        <span>Import All Titles</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Anime Modal */}
        {isAdmin && editingAnime && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
            <div className={`w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-5 border ${
              isVillage
                ? 'bg-[#fffdfa] border-[#78350f]/20 text-[#2c251e]'
                : 'bg-[#0b0e18] border-pink-500/30 text-white'
            }`}>
              <div className={`flex items-center justify-between border-b pb-4 ${
                isVillage ? 'border-[#78350f]/15' : 'border-white/10'
              }`}>
                <div>
                  <h3 className={`text-lg font-bold ${isVillage ? 'text-[#2c251e]' : 'text-white'}`}>{editingAnime.title}</h3>
                  <p className={`text-xs font-mono ${isVillage ? 'text-[#685e52]' : 'text-neutral-400'}`}>
                    Update status, episode progress, rating, or personal notes
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingAnime(null)}
                  className={`p-1.5 rounded-lg cursor-pointer ${
                    isVillage ? 'bg-[#f5efe6] text-[#685e52] hover:text-[#2c251e]' : 'bg-white/5 hover:bg-white/15 text-neutral-400 hover:text-white'
                  }`}
                >
                  <X className="size-4" />
                </button>
              </div>

              <form onSubmit={handleSaveEditModal} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={`block text-[11px] font-mono uppercase mb-1 ${
                      isVillage ? 'text-[#78350f]' : 'text-neutral-400'
                    }`}>
                      Status
                    </label>
                    <select
                      value={editingAnime.status}
                      onChange={(e) =>
                        setEditingAnime({
                          ...editingAnime,
                          status: e.target.value as AnimeEntry['status'],
                          episodesWatched:
                            e.target.value === 'completed'
                              ? editingAnime.totalEpisodes
                              : editingAnime.episodesWatched,
                        })
                      }
                      className={`w-full rounded-xl px-3 py-2 text-xs font-mono border focus:outline-none ${
                        isVillage
                          ? 'bg-[#f5efe6] border-[#78350f]/20 text-[#2c251e] focus:border-[#2d6a4f]'
                          : 'bg-black/60 border-white/15 text-white focus:border-pink-500'
                      }`}
                    >
                      <option value="completed">Watched (Completed)</option>
                      <option value="watching">Currently Watching</option>
                      <option value="plan_to_watch">Watchlist</option>
                      <option value="on_hold">On Hold</option>
                      <option value="dropped">Dropped</option>
                    </select>
                  </div>

                  <div>
                    <label className={`block text-[11px] font-mono uppercase mb-1 ${
                      isVillage ? 'text-[#78350f]' : 'text-neutral-400'
                    }`}>
                      Watchlist Priority
                    </label>
                    <select
                      value={editingAnime.priority || 'High'}
                      onChange={(e) =>
                        setEditingAnime({
                          ...editingAnime,
                          priority: e.target.value as 'High' | 'Medium' | 'Low',
                        })
                      }
                      className={`w-full rounded-xl px-3 py-2 text-xs font-mono border focus:outline-none ${
                        isVillage
                          ? 'bg-[#f5efe6] border-[#78350f]/20 text-[#2c251e] focus:border-[#2d6a4f]'
                          : 'bg-black/60 border-white/15 text-white focus:border-pink-500'
                      }`}
                    >
                      <option value="High">High Priority</option>
                      <option value="Medium">Medium Priority</option>
                      <option value="Low">Low Priority</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className={`block text-[11px] font-mono uppercase mb-1 ${
                      isVillage ? 'text-[#78350f]' : 'text-neutral-400'
                    }`}>
                      Episodes Watched
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={editingAnime.totalEpisodes || 2000}
                      value={editingAnime.episodesWatched}
                      onChange={(e) =>
                        setEditingAnime({
                          ...editingAnime,
                          episodesWatched: Number(e.target.value),
                        })
                      }
                      className={`w-full rounded-xl px-3 py-2 text-xs font-mono border focus:outline-none ${
                        isVillage
                          ? 'bg-[#f5efe6] border-[#78350f]/20 text-[#2c251e] focus:border-[#2d6a4f]'
                          : 'bg-black/60 border-white/15 text-white focus:border-pink-500'
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block text-[11px] font-mono uppercase mb-1 ${
                      isVillage ? 'text-[#78350f]' : 'text-neutral-400'
                    }`}>
                      Total Episodes
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={editingAnime.totalEpisodes}
                      onChange={(e) =>
                        setEditingAnime({
                          ...editingAnime,
                          totalEpisodes: Number(e.target.value),
                        })
                      }
                      className={`w-full rounded-xl px-3 py-2 text-xs font-mono border focus:outline-none ${
                        isVillage
                          ? 'bg-[#f5efe6] border-[#78350f]/20 text-[#2c251e] focus:border-[#2d6a4f]'
                          : 'bg-black/60 border-white/15 text-white focus:border-pink-500'
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block text-[11px] font-mono uppercase mb-1 ${
                      isVillage ? 'text-[#78350f]' : 'text-neutral-400'
                    }`}>
                      Your Score (0-10)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min={0}
                      max={10}
                      value={editingAnime.score}
                      onChange={(e) =>
                        setEditingAnime({
                          ...editingAnime,
                          score: Number(e.target.value),
                        })
                      }
                      className={`w-full rounded-xl px-3 py-2 text-xs font-mono border focus:outline-none ${
                        isVillage
                          ? 'bg-[#f5efe6] border-[#78350f]/20 text-[#2c251e] focus:border-[#2d6a4f]'
                          : 'bg-black/60 border-white/15 text-white focus:border-pink-500'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-[11px] font-mono uppercase mb-1 ${
                    isVillage ? 'text-[#78350f]' : 'text-neutral-400'
                  }`}>
                    Favorite Character
                  </label>
                  <input
                    type="text"
                    value={editingAnime.favoriteCharacter || ''}
                    onChange={(e) =>
                      setEditingAnime({
                        ...editingAnime,
                        favoriteCharacter: e.target.value,
                      })
                    }
                    placeholder="e.g. Roronoa Zoro, Sosuke Aizen, Eren Yeager..."
                    className={`w-full rounded-xl px-3 py-2 text-xs border focus:outline-none ${
                      isVillage
                        ? 'bg-[#f5efe6] border-[#78350f]/20 text-[#2c251e] placeholder-[#8c8275] focus:border-[#2d6a4f]'
                        : 'bg-black/60 border-white/15 text-white focus:border-pink-500'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-[11px] font-mono uppercase mb-1 ${
                    isVillage ? 'text-[#78350f]' : 'text-neutral-400'
                  }`}>
                    Personal Notes / Review
                  </label>
                  <textarea
                    rows={3}
                    value={editingAnime.notes || ''}
                    onChange={(e) =>
                      setEditingAnime({
                        ...editingAnime,
                        notes: e.target.value,
                      })
                    }
                    className={`w-full rounded-xl p-3 text-xs border focus:outline-none ${
                      isVillage
                        ? 'bg-[#f5efe6] border-[#78350f]/20 text-[#2c251e] placeholder-[#8c8275] focus:border-[#2d6a4f]'
                        : 'bg-black/60 border-white/15 text-white focus:border-pink-500'
                    }`}
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <label className={`flex items-center gap-2 text-xs font-mono cursor-pointer ${
                    isVillage ? 'text-[#c86d51]' : 'text-pink-300'
                  }`}>
                    <input
                      type="checkbox"
                      checked={Boolean(editingAnime.isFavorite)}
                      onChange={(e) =>
                        setEditingAnime({
                          ...editingAnime,
                          isFavorite: e.target.checked,
                        })
                      }
                      className="rounded"
                    />
                    <span>Feature in Hall of Fame (Favorites)</span>
                  </label>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingAnime(null)}
                      className={`px-4 py-2 rounded-xl text-xs font-mono cursor-pointer ${
                        isVillage ? 'bg-[#f5efe6] text-[#685e52] hover:bg-[#ede5d8]' : 'bg-white/5 hover:bg-white/10 text-neutral-300'
                      }`}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSavingEdit}
                      className={`px-5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer shadow-md ${
                        isVillage
                          ? 'bg-[#c86d51] text-white hover:bg-[#b85d43]'
                          : 'bg-pink-600 hover:bg-pink-500 text-white shadow-pink-600/30'
                      }`}
                    >
                      <Save className="size-3.5" />
                      <span>{isSavingEdit ? 'Saving...' : 'Save Changes'}</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
};
export default EntertainmentPage;
