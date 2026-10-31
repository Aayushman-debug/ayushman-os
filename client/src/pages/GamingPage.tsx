import React, { useState, useEffect } from 'react';
import { 
  Gamepad2, 
  Trophy, 
  Crosshair, 
  Shield, 
  Globe, 
  Flame,
  Copy,
  Check,
  ExternalLink,
  Edit3,
  Plus,
  Sparkles,
  Swords,
  Crown,
  Calendar,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { HoloCard, BorderBeamCard } from '@/components/ui/cards';
import { PageTransition } from '@/components/ui/page-transition';
import { SmartImage } from '@/components/ui/smart-image';
import { CoverflowCarousel, CoverflowSlide } from '@/components/ui/coverflow-carousel';
import { useAuth } from '@/context/AuthContext';

const GAME_ARTWORK_BY_SLUG: Record<string, string> = {
  'clash-royale': '/assets/games/clash-royale.svg',
  'bgmi': '/assets/games/bgmi.svg',
  'chess': '/assets/games/chess-com.svg',
  'clash-of-clans': '/assets/games/clash-of-clans.svg',
  'devil-may-cry': '/assets/games/devil-may-cry.svg',
  'genshin-impact': '/assets/games/genshin-impact.svg',
  'wuthering-waves': '/assets/games/wuthering-waves.svg',
};

function resolveGameArtwork(game: any): string {
  if (game?.slug && GAME_ARTWORK_BY_SLUG[game.slug]) {
    return GAME_ARTWORK_BY_SLUG[game.slug];
  }
  if (game?.artworkUrl && game.artworkUrl.startsWith('/assets/games/')) {
    return game.artworkUrl;
  }
  return '';
}

export const GamingPage: React.FC = () => {
  const { isAdmin } = useAuth();
  const [profiles, setProfiles] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<number>(1);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [loadError, setLoadError] = useState('');
  const [saveError, setSaveError] = useState('');

  // Edit Modal State
  const [editingProfile, setEditingProfile] = useState<any | null>(null);
  const [formGameName, setFormGameName] = useState('');
  const [formPublisher, setFormPublisher] = useState('');
  const [formGenre, setFormGenre] = useState('');
  const [formInGameId, setFormInGameId] = useState('');
  const [formUid, setFormUid] = useState('');
  const [formProfileUrl, setFormProfileUrl] = useState('');
  const [formArtworkUrl, setFormArtworkUrl] = useState('');
  const [formCurrentRank, setFormCurrentRank] = useState('');
  const [formClanTeam, setFormClanTeam] = useState('');
  const [formServerRegion, setFormServerRegion] = useState('');
  const [formIsPublic, setFormIsPublic] = useState(false);
  const [formLastUpdated, setFormLastUpdated] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [formStats, setFormStats] = useState<Record<string, string>>({});
  const [newStatKey, setNewStatKey] = useState('');
  const [newStatVal, setNewStatVal] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetch('/api/gaming')
      .then((response) => {
        if (!response.ok) throw new Error('Unable to load public gaming profiles.');
        return response.json();
      })
      .then(d => {
        if (!Array.isArray(d.profiles)) throw new Error('Invalid gaming profiles response.');
        setProfiles(d.profiles);
      })
      .catch((error: Error) => {
        console.error(error);
        setLoadError(error.message);
      });
  }, []);

  const selectedGame = profiles.find(p => p.id === selectedId) || profiles[0];
  const selectedIndex = Math.max(0, profiles.findIndex(p => p.id === selectedGame?.id));

  const coverflowSlides: CoverflowSlide[] = profiles.map((g) => ({
    id: g.id,
    src: resolveGameArtwork(g),
    alt: g.gameName,
    title: g.gameName.split(' (')[0],
    subtitle: g.role || g.genre,
    badge: g.badgeText || g.currentRank,
    accentColor: g.accentColor || '#a855f7',
    category: 'gaming',
  }));

  const handleCopy = (text: string, key: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const openEditModal = (game: any) => {
    setSaveError('');
    setEditingProfile(game);
    setFormGameName(game.gameName || '');
    setFormPublisher(game.publisher || '');
    setFormGenre(game.genre || '');
    setFormInGameId(game.inGameId || '');
    setFormUid(game.uid || '');
    setFormProfileUrl(game.profileUrl || '');
    setFormArtworkUrl(game.artworkUrl || '');
    setFormCurrentRank(game.currentRank || '');
    setFormClanTeam(game.clanTeam || '');
    setFormServerRegion(game.serverRegion || '');
    setFormIsPublic(game.isPublic === true);
    setFormLastUpdated(game.lastUpdated || new Date().toISOString().split('T')[0]);
    setFormNotes(game.notes || '');
    setFormStats({ ...(game.statsSummary || {}) });
    setNewStatKey('');
    setNewStatVal('');
  };

  const openAddModal = () => {
    setSaveError('');
    setEditingProfile({ id: 0, artworkUrl: '/assets/games/clash-royale.svg' });
    setFormGameName('');
    setFormPublisher('');
    setFormGenre('');
    setFormInGameId('');
    setFormUid('');
    setFormProfileUrl('');
    setFormArtworkUrl('/assets/games/clash-royale.svg');
    setFormCurrentRank('');
    setFormClanTeam('');
    setFormServerRegion('');
    setFormIsPublic(false);
    setFormLastUpdated(new Date().toISOString().split('T')[0]);
    setFormNotes('');
    setFormStats({});
    setNewStatKey('');
    setNewStatVal('');
  };

  const handleAddCustomStat = () => {
    if (!newStatKey.trim() || !newStatVal.trim()) return;
    setFormStats(prev => ({ ...prev, [newStatKey.trim()]: newStatVal.trim() }));
    setNewStatKey('');
    setNewStatVal('');
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProfile) return;
    setIsSaving(true);
    setSaveError('');
    try {
      const isNewProfile = !editingProfile.id;
      const res = await fetch(isNewProfile ? '/api/gaming' : `/api/gaming/${editingProfile.id}`, {
        method: isNewProfile ? 'POST' : 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameName: formGameName,
          publisher: formPublisher,
          genre: formGenre,
          inGameId: formInGameId,
          uid: formUid,
          profileUrl: formProfileUrl,
          artworkUrl: formArtworkUrl || editingProfile.artworkUrl,
          currentRank: formCurrentRank,
          clanTeam: formClanTeam,
          serverRegion: formServerRegion,
          isPublic: formIsPublic,
          lastUpdated: formLastUpdated,
          notes: formNotes,
          statsSummary: formStats,
          status: 'verified'
        })
      });
      const data = await res.json();
      if (!res.ok || !data.success || !Array.isArray(data.profiles)) {
        throw new Error(data.message || 'Unable to save gaming profile.');
      }
      setProfiles(data.profiles);
      if (isNewProfile && data.profile) setSelectedId(data.profile.id);
      setEditingProfile(null);
    } catch (err) {
      console.error(err);
      setSaveError(err instanceof Error ? err.message : 'Unable to save gaming profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProfile = async (profile: any) => {
    setSaveError('');
    try {
      const response = await fetch(`/api/gaming/${profile.id}`, { method: 'DELETE' });
      const data = await response.json();
      if (!response.ok || !data.success || !Array.isArray(data.profiles)) {
        throw new Error(data.message || 'Unable to delete gaming profile.');
      }
      setProfiles(data.profiles);
      setSelectedId(data.profiles[0]?.id ?? 0);
    } catch (error) {
      console.error(error);
      setSaveError(error instanceof Error ? error.message : 'Unable to delete gaming profile.');
    }
  };

  return (
    <PageTransition>
      <div className="space-y-8 animate-in fade-in duration-300">
        
        {/* Top Header & Quick Highlights */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white/[0.02] border border-white/10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-xl backdrop-blur-md">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-mono mb-3">
              <Gamepad2 className="size-3.5" />
              <span>3D Coverflow &amp; Holographic Deck · Public profiles</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Gaming Roster &amp; Stats
            </h1>
            <p className="text-neutral-400 text-sm mt-1">
              Explore publicly shared gaming profiles and interests.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-neutral-400">
              {profiles.length} public {profiles.length === 1 ? 'profile' : 'profiles'}
            </span>
            {isAdmin && (
              <button
                type="button"
                onClick={openAddModal}
                className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-black hover:bg-amber-400"
              >
                <Plus className="size-4" />
                Add profile
              </button>
            )}
          </div>
        </div>

        {/* Interactive 3D Coverflow Stage & Selected Account Detail Panel */}
        {selectedGame && (
          <div className="space-y-5">
            {/* 3D Coverflow Stage */}
            <div className="p-5 sm:p-6 rounded-3xl bg-[#070a14]/90 border border-white/10 shadow-2xl relative overflow-hidden">
              <div
                className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[520px] h-[220px] rounded-full blur-3xl opacity-25 transition-colors duration-500"
                style={{ backgroundColor: selectedGame.accentColor || '#a855f7' }}
              />

              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    <Crown className="size-4 text-amber-400" />
                    <span>Interactive 3D Game Coverflow</span>
                  </h2>
                  <p className="text-xs text-neutral-400">
                    Drag horizontally, use arrow keys, or click any neighboring game card to center it
                  </p>
                </div>

                {/* Horizontal Deck Quick-Selector Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                  {profiles.map((g) => {
                    const active = g.id === selectedGame.id;
                    return (
                      <button
                        key={g.id}
                        type="button"
                        onClick={() => setSelectedId(g.id)}
                        className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
                          active
                            ? 'bg-white text-black shadow-lg'
                            : 'bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/10'
                        }`}
                      >
                        <span
                          className="size-2 rounded-full"
                          style={{ backgroundColor: g.accentColor || '#a855f7' }}
                        />
                        <span>{g.gameName.split(' (')[0]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <CoverflowCarousel
                slides={coverflowSlides}
                selectedIndex={selectedIndex}
                onSelect={(idx) => {
                  if (profiles[idx]) {
                    setSelectedId(profiles[idx].id);
                  }
                }}
                variant="gaming"
                rotate={42}
                depth={0.58}
                perspective={2.9}
                falloff={0.56}
                fade={0.09}
                cardWidth="clamp(200px, 25vw, 300px)"
                gap={0.06}
                loop={true}
                showNavigation={true}
                showPagination={true}
                showCardOverlay={true}
                label="Gaming profiles 3D coverflow carousel"
              />
            </div>

            {/* Featured Selected Game Detail Panel */}
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedGame.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
              >
                <BorderBeamCard duration={12}>
                  <div className="relative overflow-hidden rounded-2xl p-6 sm:p-8 bg-[#0b0e18]">
                    {/* Background Artwork Layer with Dark Vignette */}
                    <div className="absolute inset-0 pointer-events-none opacity-35">
                      <SmartImage
                        src={resolveGameArtwork(selectedGame)}
                        alt={selectedGame.gameName}
                        category="gaming"
                        accentColor={selectedGame.accentColor}
                        containerClassName="size-full"
                        className="size-full object-cover object-center"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-[#0b0e18] via-[#0b0e18]/85 to-[#0b0e18]/40" />
                    </div>

                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                      <div className="lg:col-span-7 space-y-4">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <span
                            className="text-[11px] font-mono px-3 py-1 rounded-full border font-bold uppercase tracking-wider"
                            style={{
                              borderColor: `${selectedGame.accentColor}50`,
                              backgroundColor: `${selectedGame.accentColor}20`,
                              color: '#fff'
                            }}
                          >
                            {selectedGame.publisher} · {selectedGame.genre}
                          </span>
                          <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-neutral-300 flex items-center gap-1">
                            <Calendar className="size-3 text-cyan-400" />
                            {selectedGame.lastUpdated && <span>Updated: {selectedGame.lastUpdated}</span>}
                          </span>
                        </div>

                        <div>
                          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                            {selectedGame.gameName}
                          </h2>
                          <div className="flex flex-wrap items-center gap-4 mt-2 text-sm">
                            {isAdmin && selectedGame.inGameId && <span className="text-neutral-300">
                              Displayed Name: <strong className="text-white font-mono">{selectedGame.inGameId}</strong>
                            </span>}
                            {isAdmin && selectedGame.uid && (
                              <button
                                onClick={() => handleCopy(selectedGame.uid, `spot-${selectedGame.id}`)}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-cyan-300 transition cursor-pointer"
                              >
                                <span>UID / ID: {selectedGame.uid}</span>
                                {copiedKey === `spot-${selectedGame.id}` ? (
                                  <Check className="size-3.5 text-emerald-400" />
                                ) : (
                                  <Copy className="size-3.5 text-neutral-400" />
                                )}
                              </button>
                            )}
                          </div>
                        </div>

                        {isAdmin && selectedGame.notes && (
                          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed max-w-2xl">
                            {selectedGame.notes}
                          </p>
                        )}

                        <div className="flex flex-wrap items-center gap-3 pt-1">
                          {selectedGame.profileUrl && selectedGame.profileUrl.startsWith('http') && (
                            <a
                              href={selectedGame.profileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs transition shadow-lg"
                            >
                              <span>Open Verified {selectedGame.gameName} Profile</span>
                              <ExternalLink className="size-3.5" />
                            </a>
                          )}

                          {isAdmin && <button
                            onClick={() => openEditModal(selectedGame)}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-semibold text-xs transition cursor-pointer"
                          >
                            <Edit3 className="size-3.5 text-cyan-400" />
                            <span>Edit Account / Stats</span>
                          </button>}
                          {isAdmin && (
                            <button
                              type="button"
                              onClick={() => handleDeleteProfile(selectedGame)}
                              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-300 font-semibold text-xs transition"
                            >
                              Delete profile
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Right 5 Cols: Artwork Preview + Structured Stats Grid */}
                      <div className="lg:col-span-5 space-y-3">
                        <div className="h-36 w-full rounded-xl overflow-hidden border border-white/15 shadow-lg">
                          <SmartImage
                            src={resolveGameArtwork(selectedGame)}
                            fallbackSrc="/assets/games/clash-royale.svg"
                            alt={selectedGame.gameName}
                            category="gaming"
                            accentColor={selectedGame.accentColor}
                            containerClassName="size-full"
                            className="size-full object-cover"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2.5">
                          {Object.entries(selectedGame.statsSummary || {}).map(([k, v]: any) => (
                            <div
                              key={k}
                              className="p-3 rounded-xl bg-black/60 border border-white/10 backdrop-blur-md"
                            >
                              <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                                {k}
                              </div>
                              <div className="text-xs sm:text-sm font-black text-white font-mono mt-1 break-words">
                                {v}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </BorderBeamCard>
              </motion.div>
            </AnimatePresence>
          </div>
        )}

        {loadError && <p role="alert" className="text-sm text-red-300">{loadError}</p>}
        {saveError && <p role="alert" className="text-sm text-red-300">{saveError}</p>}

        {!loadError && profiles.length === 0 && (
          <p className="rounded-2xl border border-white/10 p-6 text-sm text-neutral-400">
            No gaming profiles have been selected for public sharing.
          </p>
        )}

        {/* Publicly shared gaming profiles */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <Sparkles className="size-5 text-amber-400" />
              <span>Collectible Holographic Cards</span>
            </h2>
            {isAdmin && (
              <span className="text-xs font-mono text-neutral-400">
                Hover or tap cards for 3D foil · Use Edit to update stats
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profiles.map((game) => {
              const isSelected = selectedGame?.id === game.id;
              const hasExternalProfile = Boolean(game.profileUrl && game.profileUrl.startsWith('http'));

              return (
                <HoloCard
                  key={game.id}
                  maxTilt={7}
                  holoColor={game.holoColor || 'rgba(6, 182, 212, 0.3)'}
                  accentColor={game.accentColor || '#06b6d4'}
                  isSelected={isSelected}
                  onClick={() => setSelectedId(game.id)}
                  className="flex flex-col justify-between cursor-pointer"
                >
                  <div>
                    {/* Card Top Banner Artwork — Properly Sized 16:9 Header */}
                    <div className="relative h-48 w-full overflow-hidden bg-[#060913] border-b border-white/10">
                      <SmartImage
                        src={resolveGameArtwork(game)}
                        alt={game.gameName}
                        category="gaming"
                        accentColor={game.accentColor}
                        containerClassName="size-full"
                        className="size-full object-cover group-hover:scale-[1.06] transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e18] via-[#0b0e18]/20 to-black/20 pointer-events-none" />

                      {/* Top Left Publisher / Game Badge */}
                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        <span
                          className="text-[10px] font-mono px-2.5 py-0.5 rounded-full backdrop-blur-md border font-bold uppercase shadow-md"
                          style={{
                            borderColor: `${game.accentColor}70`,
                            backgroundColor: 'rgba(6, 9, 18, 0.82)',
                            color: '#fff'
                          }}
                        >
                          {game.publisher || 'Gaming'}
                        </span>
                      </div>

                      {/* Top Right Highlight Pill */}
                      <div className="absolute top-3 right-3">
                        <span
                          className={`text-[10px] font-mono px-2.5 py-1 rounded-full backdrop-blur-md border font-bold flex items-center gap-1 shadow-md ${
                            game.status === 'verified'
                              ? 'bg-emerald-950/90 border-emerald-500/45 text-emerald-300'
                              : 'bg-amber-950/90 border-amber-500/45 text-amber-300'
                          }`}
                        >
                          {game.status === 'verified' ? (
                            <Trophy className="size-3 text-amber-400" />
                          ) : (
                            <Edit3 className="size-3 text-amber-300" />
                          )}
                          <span>{game.badgeText || game.currentRank}</span>
                        </span>
                      </div>

                      {/* Game Title & Genre Overlay */}
                      <div className="absolute bottom-3 inset-x-5">
                        <h3 className="text-lg font-black text-white tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
                          {game.gameName}
                        </h3>
                        <div className="text-[10px] font-mono text-neutral-300 truncate">
                          {game.genre}
                        </div>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-5 space-y-4">
                      {/* Private account identifiers are only shown in the admin view. */}
                      {isAdmin && (
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/10">
                          <div className="min-w-0">
                            <div className="text-[10px] font-mono uppercase text-neutral-400">
                              Displayed Name / Account
                            </div>
                            <div
                              className="text-base font-black text-white break-words mt-0.5"
                              title={game.inGameId}
                            >
                              {game.inGameId}
                            </div>
                          </div>

                          {game.uid ? (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopy(game.uid, `uid-${game.id}`);
                              }}
                              className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-mono text-cyan-300 flex items-center gap-1.5 shrink-0 cursor-pointer"
                              title={`Copy UID / Tag: ${game.uid}`}
                            >
                              <span>{game.uid}</span>
                              {copiedKey === `uid-${game.id}` ? (
                                <Check className="size-3 text-emerald-400" />
                              ) : (
                                <Copy className="size-3 text-neutral-400" />
                              )}
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                openEditModal(game);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-dashed border-white/20 text-[10px] font-mono text-neutral-400 hover:text-white shrink-0 cursor-pointer"
                            >
                              + Add UID/Tag
                            </button>
                          )}
                        </div>
                      )}

                      {/* Structured Stats Matrix — No Clipped Values */}
                      {game.statsSummary && Object.keys(game.statsSummary).length > 0 && (
                        <div className="grid grid-cols-2 gap-2">
                          {Object.entries(game.statsSummary).map(([key, val]: any) => (
                            <div
                              key={key}
                              title={`${key}: ${val}`}
                              className="p-2.5 rounded-xl bg-black/50 border border-white/[0.06] flex flex-col justify-between"
                            >
                              <span className="text-[10px] font-mono text-neutral-400 uppercase">
                                {key}
                              </span>
                              <span className="text-xs font-bold text-white font-mono mt-0.5 break-words leading-snug">
                                {val}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Clan & Server Metadata */}
                      <div className="space-y-1.5 text-xs text-neutral-300 pt-1">
                        {game.clanTeam && game.clanTeam !== 'Configurable' && (
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-neutral-400 flex items-center gap-1.5 shrink-0">
                              <Shield className="size-3.5 text-cyan-400" /> Clan / Affiliation
                            </span>
                            <span className="font-bold text-white font-mono text-right">{game.clanTeam}</span>
                          </div>
                        )}
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-neutral-400 flex items-center gap-1.5 shrink-0">
                            <Globe className="size-3.5 text-emerald-400" /> Region / Platform
                          </span>
                          <span className="font-mono text-neutral-200 text-right">{game.serverRegion}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="px-5 py-3.5 border-t border-white/10 bg-black/30 flex items-center justify-between gap-2">
                    {isAdmin && <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditModal(game);
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-300 hover:text-cyan-300 transition cursor-pointer"
                    >
                      <Edit3 className="size-3.5" />
                      <span>Edit Profile</span>
                    </button>}

                    {hasExternalProfile ? (
                      <a
                        href={game.profileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-bold transition"
                      >
                        <span>Open Profile</span>
                        <ExternalLink className="size-3" />
                      </a>
                    ) : (
                      <span className="text-[10px] font-mono text-neutral-500">
                        Public profile
                      </span>
                    )}
                  </div>
                </HoloCard>
              );
            })}
          </div>
        </div>

        {/* Edit Gaming Profile Modal */}
        {isAdmin && editingProfile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
            <div className="w-full max-w-lg rounded-2xl bg-[#0c101d] border border-white/15 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-white">
                    {editingProfile.id ? `Edit ${editingProfile.gameName} Profile` : 'Add Gaming Profile'}
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Update your in-game name, UID, profile link, or stats. Saved to backend storage.
                  </p>
                </div>
                <button
                  onClick={() => setEditingProfile(null)}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-white cursor-pointer"
                >
                  <X className="size-4" />
                </button>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
                {!editingProfile.id && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-neutral-300 font-medium mb-1">Game name</label>
                      <input
                        type="text"
                        required
                        value={formGameName}
                        onChange={(e) => setFormGameName(e.target.value)}
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-300 font-medium mb-1">Publisher</label>
                      <input
                        type="text"
                        value={formPublisher}
                        onChange={(e) => setFormPublisher(e.target.value)}
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-300 font-medium mb-1">Genre</label>
                      <input
                        type="text"
                        value={formGenre}
                        onChange={(e) => setFormGenre(e.target.value)}
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2 text-white"
                      />
                    </div>
                  </div>
                )}
                <label className="flex items-center gap-2 text-cyan-300">
                  <input
                    type="checkbox"
                    checked={formIsPublic}
                    onChange={(e) => setFormIsPublic(e.target.checked)}
                    className="rounded border-cyan-500"
                  />
                  Share this gaming profile publicly
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-neutral-300 font-medium mb-1">Displayed Name / IGN</label>
                    <input
                      type="text"
                      value={formInGameId}
                      onChange={(e) => setFormInGameId(e.target.value)}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-300 font-medium mb-1">Account UID / Player Tag</label>
                    <input
                      type="text"
                      value={formUid}
                      onChange={(e) => setFormUid(e.target.value)}
                      placeholder="Player tag or identifier"
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-neutral-300 font-medium mb-1">Headline Rank / Trophies / Level</label>
                    <input
                      type="text"
                      value={formCurrentRank}
                      onChange={(e) => setFormCurrentRank(e.target.value)}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-300 font-medium mb-1">Clan / Guild / Affiliation</label>
                    <input
                      type="text"
                      value={formClanTeam}
                      onChange={(e) => setFormClanTeam(e.target.value)}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-neutral-300 font-medium mb-1">Server / Region</label>
                    <input
                      type="text"
                      value={formServerRegion}
                      onChange={(e) => setFormServerRegion(e.target.value)}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-300 font-medium mb-1">Last Updated Date</label>
                    <input
                      type="date"
                      value={formLastUpdated}
                      onChange={(e) => setFormLastUpdated(e.target.value)}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-neutral-300 font-medium mb-1">Public Profile Link (Optional HTTPS URL)</label>
                    <input
                      type="url"
                      value={formProfileUrl}
                      onChange={(e) => setFormProfileUrl(e.target.value)}
                      placeholder="https://www.chess.com/member/... or https://royaleapi.com/..."
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-300 font-medium mb-1">Card Artwork Banner Path / URL</label>
                    <input
                      type="text"
                      value={formArtworkUrl}
                      onChange={(e) => setFormArtworkUrl(e.target.value)}
                      placeholder="/assets/games/clash-royale.svg"
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                {/* Editable Stat Key-Value Fields */}
                <div className="space-y-2 pt-2 border-t border-white/10">
                  <label className="block text-neutral-300 font-bold">Profile Stats & Build Details</label>
                  {Object.entries(formStats).map(([k, v]) => (
                    <div key={k} className="flex items-center gap-2">
                      <span className="w-1/3 text-neutral-400 font-mono truncate">{k}:</span>
                      <input
                        type="text"
                        value={v}
                        onChange={(e) => setFormStats(prev => ({ ...prev, [k]: e.target.value }))}
                        className="flex-1 bg-black/50 border border-white/10 rounded-lg px-3 py-1.5 text-white"
                      />
                    </div>
                  ))}

                  {/* Add new custom stat field */}
                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="text"
                      value={newStatKey}
                      onChange={(e) => setNewStatKey(e.target.value)}
                      placeholder="New stat label (e.g. Main Character)"
                      className="w-1/3 bg-black/40 border border-white/10 rounded-lg px-2.5 py-1.5 text-white placeholder-neutral-500"
                    />
                    <input
                      type="text"
                      value={newStatVal}
                      onChange={(e) => setNewStatVal(e.target.value)}
                      placeholder="Value (e.g. Vergil / Raiden)"
                      className="flex-1 bg-black/40 border border-white/10 rounded-lg px-2.5 py-1.5 text-white placeholder-neutral-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomStat}
                      className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white font-semibold cursor-pointer"
                    >
                      + Add
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-neutral-300 font-medium mb-1">Notes / Build Summary</label>
                  <textarea
                    rows={2}
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setEditingProfile(null)}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 font-medium cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold shadow-lg cursor-pointer"
                  >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </PageTransition>
  );
};

export default GamingPage;
