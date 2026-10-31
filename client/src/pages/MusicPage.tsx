import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Music, 
  Play, 
  Pause, 
  ExternalLink, 
  Headphones, 
  Radio, 
  Sparkles, 
  Plus, 
  UserCheck, 
  Disc3,
  ListMusic,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  X,
  Pencil,
  Trash2
} from 'lucide-react';
import { MediaCard, BorderBeamCard } from '@/components/ui/cards';
import { PageTransition } from '@/components/ui/page-transition';
import { useAuth } from '@/context/AuthContext';

declare global {
  interface Window {
    onSpotifyIframeApiReady?: (IFrameAPI: any) => void;
    SpotifyIframeApi?: any;
  }
}

interface PlaylistTrack {
  index: number;
  uri: string;
  trackId: string;
  title: string;
  artist: string;
  durationMs: number;
  isExplicit: boolean;
  isPlayable: boolean;
  audioPreviewUrl: string | null;
  externalTrackUrl: string;
}

function formatDuration(ms: number): string {
  if (!ms || ms <= 0) return '0:00';
  const totalSec = Math.floor(ms / 1000);
  const mins = Math.floor(totalSec / 60);
  const secs = totalSec % 60;
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

const FALLBACK_MUSIC_COLLECTIONS = [
  {
    id: 1,
    title: 'जीवन',
    provider: 'spotify',
    externalUrl: 'https://open.spotify.com/playlist/3kVexA5RqiZJA1hrzv1eNH',
    embedId: '3kVexA5RqiZJA1hrzv1eNH',
    coverUrl: '/assets/music/3kVexA5RqiZJA1hrzv1eNH.jpg',
    mood: 'Soulful & Deep',
    trackCount: 12,
    isFavorite: true,
  },
  {
    id: 2,
    title: '"PEAK"',
    provider: 'spotify',
    externalUrl: 'https://open.spotify.com/playlist/1ObWCzwKcT96QEqiKbFR5U',
    embedId: '1ObWCzwKcT96QEqiKbFR5U',
    coverUrl: '/assets/music/1ObWCzwKcT96QEqiKbFR5U.jpg',
    mood: 'High Energy & Anthems',
    trackCount: 35,
    isFavorite: true,
  },
  {
    id: 3,
    title: 'puhNjabi',
    provider: 'spotify',
    externalUrl: 'https://open.spotify.com/playlist/6TsUQwBFT8TMKBN72Mo7Zb',
    embedId: '6TsUQwBFT8TMKBN72Mo7Zb',
    coverUrl: '/assets/music/6TsUQwBFT8TMKBN72Mo7Zb.jpg',
    mood: 'Punjabi & Folk Beats',
    trackCount: 15,
    isFavorite: true,
  },
  {
    id: 4,
    title: 'एफ',
    provider: 'spotify',
    externalUrl: 'https://open.spotify.com/playlist/3z97vIfs40HVfqovsgSbGn',
    embedId: '3z97vIfs40HVfqovsgSbGn',
    coverUrl: '/assets/music/3z97vIfs40HVfqovsgSbGn.jpg',
    mood: 'Chill & Atmosphere',
    trackCount: 19,
    isFavorite: false,
  },
  {
    id: 5,
    title: '´⁠ε⁠｀',
    provider: 'spotify',
    externalUrl: 'https://open.spotify.com/playlist/6Vpr16RnIxYihzjjqcJWqc',
    embedId: '6Vpr16RnIxYihzjjqcJWqc',
    coverUrl: '/assets/music/6Vpr16RnIxYihzjjqcJWqc.jpg',
    mood: 'Lo-Fi & Comfort',
    trackCount: 13,
    isFavorite: false,
  },
  {
    id: 6,
    title: '￣⁠ ³⁠ ￣',
    provider: 'spotify',
    externalUrl: 'https://open.spotify.com/playlist/75X05MAHQtndSlg17jC3dU',
    embedId: '75X05MAHQtndSlg17jC3dU',
    coverUrl: '/assets/music/75X05MAHQtndSlg17jC3dU.jpg',
    mood: 'Vibes & Ambient',
    trackCount: 19,
    isFavorite: false,
  },
  {
    id: 7,
    title: 'ई',
    provider: 'spotify',
    externalUrl: 'https://open.spotify.com/playlist/4YfKMO0RFIMJuvx9BYEuHx',
    embedId: '4YfKMO0RFIMJuvx9BYEuHx',
    coverUrl: '/assets/music/4YfKMO0RFIMJuvx9BYEuHx.jpg',
    mood: 'Late Night Flow',
    trackCount: 11,
    isFavorite: false,
  },
  {
    id: 8,
    title: 'Synthwave & Retrowave Highway',
    provider: 'youtube',
    externalUrl: 'https://music.youtube.com/playlist?list=PLFgquLnL59alW3xmYiWRaoz0oM3HTr0e7',
    embedId: 'PLFgquLnL59alW3xmYiWRaoz0oM3HTr0e7',
    coverUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&auto=format&fit=crop',
    mood: 'Atmospheric Retrowave',
    trackCount: 26,
    isFavorite: true,
  },
  {
    id: 9,
    title: 'Lofi Hip Hop / Focus Beats',
    provider: 'youtube',
    externalUrl: 'https://music.youtube.com/@wtfk1y0',
    embedId: 'jfKfPfyJRdk',
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop',
    mood: 'Coding & Study Sessions',
    trackCount: 35,
    isFavorite: false,
  },
];

const FALLBACK_SPOTIFY_PROFILE = {
  displayName: 'आयुष्मान (AYushMan)',
  avatarUrl: '/assets/music/3kVexA5RqiZJA1hrzv1eNH.jpg',
};

const FALLBACK_YT_PROFILE = {
  displayName: 'YouTube Music',
};

export const MusicPage: React.FC = () => {
  const { isAdmin } = useAuth();
  const [collections, setCollections] = useState<any[]>(FALLBACK_MUSIC_COLLECTIONS);
  const [userProfile, setUserProfile] = useState<any>(FALLBACK_SPOTIFY_PROFILE);
  const [ytMusicProfile, setYtMusicProfile] = useState<any>(FALLBACK_YT_PROFILE);

  // Active playlist & track state
  const [activePlaylistId, setActivePlaylistId] = useState<string>('3kVexA5RqiZJA1hrzv1eNH'); // जीवन
  const [activeTitle, setActiveTitle] = useState<string>('जीवन');
  const [activeProvider, setActiveProvider] = useState<'spotify' | 'youtube'>('spotify');
  const [activeUri, setActiveUri] = useState<string>('spotify:playlist:3kVexA5RqiZJA1hrzv1eNH');
  const [selectedTrack, setSelectedTrack] = useState<PlaylistTrack | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'spotify' | 'youtube'>('all');
  const [isLoadingCollections, setIsLoadingCollections] = useState<boolean>(true);
  const [collectionsError, setCollectionsError] = useState<string | null>(null);

  // Real tracks fetched from Spotify embed state for the active playlist
  const [playlistTracks, setPlaylistTracks] = useState<PlaylistTrack[]>([]);
  const [loadingTracks, setLoadingTracks] = useState<boolean>(false);
  const [trackSearch, setTrackSearch] = useState<string>('');

  // Spotify Official iFrame API state
  const spotifyMountRef = useRef<HTMLDivElement | null>(null);
  const spotifyControllerRef = useRef<any>(null);
  const [controllerReady, setControllerReady] = useState<boolean>(false);
  const [playbackState, setPlaybackState] = useState<{
    isPaused: boolean;
    position: number;
    duration: number;
  }>({ isPaused: true, position: 0, duration: 0 });

  // Add Playlist Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUrl, setNewUrl] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newMood, setNewMood] = useState('Curated');
  const [sharePlaylistPublicly, setSharePlaylistPublicly] = useState(false);
  const [editingPlaylist, setEditingPlaylist] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch initial music collections & profiles with loading and error states
  const loadMusicCollections = useCallback(async () => {
    setIsLoadingCollections(true);
    setCollectionsError(null);
    try {
      const r = await fetch('/api/entertainment/music');
      if (!r.ok) {
        throw new Error(`Failed to load music collections (status ${r.status})`);
      }
      const d = await r.json();
      if (d.success && Array.isArray(d.collections)) {
        setCollections(d.collections);
        if (d.collections.length > 0) {
          const first = d.collections.find((c: any) => c.provider === 'spotify') || d.collections[0];
          setActivePlaylistId((prev) => {
            const stillExists = d.collections.some((c: any) => c.embedId === prev);
            if (stillExists) return prev;
            setActiveTitle(first.title);
            setActiveProvider(first.provider);
            if (first.provider === 'spotify') {
              setActiveUri(`spotify:playlist:${first.embedId}`);
            }
            return first.embedId;
          });
        }
      } else {
        throw new Error(d.message || 'Could not parse playlist collection');
      }
      if (d.userProfile) setUserProfile(d.userProfile);
    } catch (err: any) {
      console.error('Failed to fetch music collections:', err);
      setCollectionsError(err.message || 'Failed to load music playlists.');
    } finally {
      setIsLoadingCollections(false);
    }
  }, []);

  useEffect(() => {
    loadMusicCollections();
  }, [loadMusicCollections]);

  // Fetch real tracks whenever active Spotify playlist changes (with race condition prevention)
  useEffect(() => {
    if (activeProvider !== 'spotify' || !activePlaylistId) {
      setPlaylistTracks([]);
      setLoadingTracks(false);
      return;
    }

    let isSubscribed = true;
    setLoadingTracks(true);

    fetch(`/api/entertainment/music/playlist/${activePlaylistId}/tracks`)
      .then(r => r.json())
      .then(d => {
        if (!isSubscribed) return;
        if (d.tracks && Array.isArray(d.tracks)) {
          setPlaylistTracks(d.tracks);
        } else {
          setPlaylistTracks([]);
        }
      })
      .catch((err) => {
        if (!isSubscribed) return;
        console.warn('Track loading error:', err);
        setPlaylistTracks([]);
      })
      .finally(() => {
        if (isSubscribed) setLoadingTracks(false);
      });

    return () => {
      isSubscribed = false;
    };
  }, [activePlaylistId, activeProvider]);

  // Load Official Spotify iFrame API
  useEffect(() => {
    if (activeProvider !== 'spotify') return;

    const initController = (IFrameAPI: any) => {
      if (!spotifyMountRef.current || spotifyControllerRef.current) return;
      const options = {
        uri: activeUri,
        width: '100%',
        height: 500,
      };
      IFrameAPI.createController(spotifyMountRef.current, options, (EmbedController: any) => {
        spotifyControllerRef.current = EmbedController;
        EmbedController.addListener('ready', () => {
          setControllerReady(true);
        });
        EmbedController.addListener('playback_update', (e: any) => {
          if (e && e.data) {
            setPlaybackState({
              isPaused: Boolean(e.data.isPaused),
              position: Number(e.data.position || 0),
              duration: Number(e.data.duration || 0),
            });
          }
        });
      });
    };

    if (window.SpotifyIframeApi) {
      initController(window.SpotifyIframeApi);
    } else {
      window.onSpotifyIframeApiReady = (IFrameAPI: any) => {
        window.SpotifyIframeApi = IFrameAPI;
        initController(IFrameAPI);
      };
      if (!document.getElementById('spotify-iframe-api-script')) {
        const script = document.createElement('script');
        script.id = 'spotify-iframe-api-script';
        script.src = 'https://open.spotify.com/embed/iframe-api/v1';
        script.async = true;
        document.body.appendChild(script);
      }
    }
  }, [activeProvider]);

  // Update Spotify controller URI when activeUri changes
  useEffect(() => {
    if (activeProvider === 'spotify' && spotifyControllerRef.current && controllerReady) {
      try {
        spotifyControllerRef.current.loadUri(activeUri);
      } catch (err) {
        console.warn('Spotify loadUri error:', err);
      }
    }
  }, [activeUri, activeProvider, controllerReady]);

  const handleSelectPlaylist = useCallback((item: any, autoPlay = false) => {
    setSelectedTrack(null);
    setTrackSearch('');
    setActivePlaylistId(item.embedId);
    setActiveTitle(item.title);
    setActiveProvider(item.provider);

    if (item.provider === 'spotify') {
      const nextUri = `spotify:playlist:${item.embedId}`;
      setActiveUri(nextUri);
      if (spotifyControllerRef.current && controllerReady) {
        spotifyControllerRef.current.loadUri(nextUri);
        if (autoPlay) {
          setTimeout(() => {
            try {
              spotifyControllerRef.current?.play();
            } catch {}
          }, 250);
        }
      }
    }
  }, [controllerReady]);

  const handlePlaySpecificTrack = useCallback((track: PlaylistTrack) => {
    setSelectedTrack(track);
    if (track.uri) {
      setActiveUri(track.uri);
      if (spotifyControllerRef.current && controllerReady) {
        try {
          spotifyControllerRef.current.loadUri(track.uri);
          setTimeout(() => {
            try {
              spotifyControllerRef.current?.play();
            } catch {}
          }, 200);
        } catch (e) {
          console.warn('Error playing track in Spotify controller:', e);
        }
      }
    }
  }, [controllerReady]);

  const handleReturnToFullPlaylist = useCallback(() => {
    setSelectedTrack(null);
    const playlistUri = `spotify:playlist:${activePlaylistId}`;
    setActiveUri(playlistUri);
    if (spotifyControllerRef.current && controllerReady) {
      try {
        spotifyControllerRef.current.loadUri(playlistUri);
      } catch {}
    }
  }, [activePlaylistId, controllerReady]);

  const handleTogglePlay = useCallback(() => {
    if (spotifyControllerRef.current && controllerReady) {
      try {
        spotifyControllerRef.current.togglePlay();
      } catch {}
    }
  }, [controllerReady]);

  const handleAddPlaylistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlaylist && !newUrl.trim()) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(
        editingPlaylist
          ? `/api/entertainment/music/playlists/${editingPlaylist.id}`
          : '/api/entertainment/music/playlists',
        {
        method: editingPlaylist ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: newUrl,
          title: newTitle,
          mood: newMood,
          provider: newUrl.includes('spotify.com') ? 'spotify' : 'youtube',
          isPublic: sharePlaylistPublicly,
        })
      });
      const data = await res.json();
      if (data.success && data.collections) {
        setCollections(data.collections);
        if (data.playlist) handleSelectPlaylist(data.playlist, false);
        setShowAddModal(false);
        setEditingPlaylist(null);
        setNewUrl('');
        setNewTitle('');
        setNewMood('Curated');
        setSharePlaylistPublicly(false);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePlaylist = async (id: number) => {
    try {
      const response = await fetch(`/api/entertainment/music/playlists/${id}`, { method: 'DELETE' });
      const data = await response.json();
      if (response.ok && data.success && Array.isArray(data.collections)) {
        setCollections(data.collections);
        if (!data.collections.some((item: any) => item.embedId === activePlaylistId)) {
          setSelectedTrack(null);
        }
      } else {
        console.error(data.message || 'Failed to remove playlist.');
      }
    } catch (error) {
      console.error('Failed to remove playlist:', error);
    }
  };

  const openPlaylistEditor = (playlist: any) => {
    setEditingPlaylist(playlist);
    setNewUrl(playlist.externalUrl || '');
    setNewTitle(playlist.title || '');
    setNewMood(playlist.mood || '');
    setSharePlaylistPublicly(Boolean(playlist.isPublic));
    setShowAddModal(true);
  };

  const spotifyPlaylists = collections.filter(c => c.provider === 'spotify');
  const youtubePlaylists = collections.filter(c => c.provider === 'youtube');
  const displayedPlaylists =
    activeTab === 'all'
      ? collections
      : activeTab === 'spotify'
      ? spotifyPlaylists
      : youtubePlaylists;

  const filteredTracks = trackSearch.trim() === ''
    ? playlistTracks
    : playlistTracks.filter(
        t =>
          t.title.toLowerCase().includes(trackSearch.toLowerCase()) ||
          t.artist.toLowerCase().includes(trackSearch.toLowerCase())
      );

  const currentPlaylistExternalUrl = activeProvider === 'spotify'
    ? `https://open.spotify.com/playlist/${activePlaylistId}`
    : (collections.find(c => c.embedId === activePlaylistId)?.externalUrl || 'https://music.youtube.com/@wtfk1y0');

  return (
    <PageTransition>
      <div className="space-y-8 animate-in fade-in duration-300">
        
        {/* Header Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white/[0.02] border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl backdrop-blur-md">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono mb-3">
              <Headphones className="size-3.5" />
              <span>Official Spotify iFrame API & YouTube Music</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Music & Soundtracks
            </h1>
            <p className="text-neutral-400 text-sm mt-1">
              7 real Spotify playlists, interactive song-level playback, and YouTube Music (@wtfk1y0).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {isAdmin && <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-white text-xs font-semibold transition cursor-pointer"
            >
              <Plus className="size-3.5" />
              <span>Add Playlist / Track</span>
            </button>}

            <a
              href="https://open.spotify.com/user/31r367fhbny2hd3bdbyo5q3vvjlu"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1db954] hover:bg-[#1ed760] text-black font-bold text-xs transition shadow-lg shadow-emerald-950/50"
            >
              <Music className="size-4 fill-black" />
              <span>Open Spotify Profile</span>
            </a>

            <a
              href="https://music.youtube.com/@wtfk1y0"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition shadow-lg shadow-red-950/50"
            >
              <Radio className="size-4" />
              <span>YT Music (@wtfk1y0)</span>
            </a>
          </div>
        </div>

        {/* Dual Profile Strip: Real Spotify Profile + Real YouTube Music Profile */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 1. Spotify Profile Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/35 via-[#0b0e18] to-[#0b0e18] border border-emerald-500/25 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-5 backdrop-blur-md">
            <div className="flex items-center gap-4">
              <div className="relative size-16 rounded-2xl overflow-hidden bg-black/60 border border-emerald-400/30 shrink-0 shadow-lg">
                <img
                  src="/assets/music/3kVexA5RqiZJA1hrzv1eNH.jpg"
                  onError={(e) => {
                    if (userProfile?.avatarUrl && e.currentTarget.src !== userProfile.avatarUrl) {
                      e.currentTarget.src = userProfile.avatarUrl;
                    }
                  }}
                  alt="Spotify Avatar"
                  className="size-full object-cover"
                />
                <div className="absolute bottom-1 right-1 size-4 rounded-full bg-[#1db954] border-2 border-black flex items-center justify-center">
                  <Music className="size-2.5 text-black fill-black" />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                    {userProfile?.displayName || 'आयुष्मान (AYushMan)'}
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-semibold flex items-center gap-1">
                    <UserCheck className="size-3" />
                    <span>Spotify Verified</span>
                  </span>
                </div>
                <p className="text-xs text-neutral-400 font-mono mt-1">
                  ID: <span className="text-neutral-300">31r367fhbny2hd3bdbyo5q3vvjlu</span> · 7 Public Playlists
                </p>
              </div>
            </div>

            <a
              href="https://open.spotify.com/user/31r367fhbny2hd3bdbyo5q3vvjlu"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-semibold text-xs transition shrink-0"
            >
              <span>Open Spotify</span>
              <ExternalLink className="size-3.5" />
            </a>
          </div>

          {/* 2. YouTube Music Profile Card (@wtfk1y0) */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-red-950/35 via-[#0b0e18] to-[#0b0e18] border border-red-500/25 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-5 backdrop-blur-md">
            <div className="flex items-center gap-4">
              <div className="relative size-16 rounded-2xl overflow-hidden bg-gradient-to-br from-red-600 to-neutral-900 border border-red-400/30 shrink-0 shadow-lg flex items-center justify-center">
                <Radio className="size-8 text-white" />
                <div className="absolute bottom-1 right-1 size-4 rounded-full bg-red-500 border-2 border-black flex items-center justify-center">
                  <Play className="size-2 text-white fill-white" />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                    {ytMusicProfile?.displayName || 'YouTube Music'}
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-red-500/15 border border-red-500/30 text-red-300 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="size-3" />
                    <span>YouTube Music</span>
                  </span>
                </div>
                <p className="text-xs text-neutral-400 font-mono mt-1">
                  Handle: <span className="text-red-300 font-semibold">@wtfk1y0</span> · Canonical Profile Link
                </p>
              </div>
            </div>

            <a
              href="https://music.youtube.com/@wtfk1y0"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-300 font-semibold text-xs transition shrink-0"
            >
              <span>Open YouTube Music</span>
              <ExternalLink className="size-3.5" />
            </a>
          </div>
        </div>

        {/* Tabs: All vs Spotify vs YouTube Music */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('all')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-white text-black shadow-lg shadow-white/20'
                  : 'bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white border border-white/5'
              }`}
            >
              <Headphones className="size-4" />
              <span>All ({collections.length})</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('spotify');
                const firstSpotify = spotifyPlaylists[0];
                if (firstSpotify && activeProvider !== 'spotify') {
                  handleSelectPlaylist(firstSpotify, false);
                }
              }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
                activeTab === 'spotify'
                  ? 'bg-[#1db954] text-black shadow-lg shadow-emerald-500/20'
                  : 'bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white border border-white/5'
              }`}
            >
              <Music className="size-4" />
              <span>Spotify ({spotifyPlaylists.length})</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('youtube');
                const firstYt = youtubePlaylists[0];
                if (firstYt) {
                  handleSelectPlaylist(firstYt, false);
                }
              }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
                activeTab === 'youtube'
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                  : 'bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white border border-white/5'
              }`}
            >
              <Radio className="size-4" />
              <span>YouTube Music ({youtubePlaylists.length})</span>
            </button>
          </div>

          {/* Real-time Spotify Controller Status Pill */}
          {activeProvider === 'spotify' && (
            <div className="flex items-center gap-3">
              {controllerReady && (
                <button
                  onClick={handleTogglePlay}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-semibold transition cursor-pointer"
                >
                  {playbackState.isPaused ? <Play className="size-3.5 fill-current" /> : <Pause className="size-3.5 fill-current" />}
                  <span>{playbackState.isPaused ? 'Play / Resume' : 'Pause Player'}</span>
                  {playbackState.duration > 0 && (
                    <span className="text-neutral-400 ml-1">
                      ({formatDuration(playbackState.position)} / {formatDuration(playbackState.duration)})
                    </span>
                  )}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Master Player + Interactive Song Tracklist Browser */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
          
          {/* Left 7 Cols: Official Embedded Player */}
          <div className="lg:col-span-7 space-y-4">
            <BorderBeamCard duration={10} className="w-full">
              <div className="p-5 sm:p-6">
                {/* Top Action Bar for Currently Loaded Playlist or Track */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="size-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                      <Disc3 className={`size-5 ${!playbackState.isPaused ? 'animate-spin' : ''}`} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-white tracking-tight truncate">
                          {selectedTrack ? selectedTrack.title : activeTitle}
                        </h3>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                          {selectedTrack ? 'Single Track Mode' : 'Full Playlist'}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-400 font-mono truncate">
                        {selectedTrack
                          ? `${selectedTrack.artist} · From playlist "${activeTitle}"`
                          : activeProvider === 'spotify'
                            ? 'Official Spotify iFrame API Player · Select any track below or inside the player'
                            : 'Official YouTube Embed'}
                      </p>
                    </div>
                  </div>

                  {/* Distinct External Actions: Open Playlist vs Open Track */}
                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    {selectedTrack && (
                      <>
                        <button
                          onClick={handleReturnToFullPlaylist}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-neutral-300 hover:text-white transition cursor-pointer"
                          title="Return player to full playlist view"
                        >
                          <RotateCcw className="size-3.5 text-cyan-400" />
                          <span>Full Playlist</span>
                        </button>

                        <a
                          href={selectedTrack.externalTrackUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1db954]/20 hover:bg-[#1db954]/30 border border-[#1db954]/40 text-xs font-semibold text-emerald-300 transition"
                        >
                          <span>Open Track in Spotify</span>
                          <ExternalLink className="size-3" />
                        </a>
                      </>
                    )}

                    <a
                      href={currentPlaylistExternalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-neutral-300 hover:text-white transition"
                    >
                      <span>{activeProvider === 'spotify' ? 'Open Playlist in Spotify' : 'Open in YT Music'}</span>
                      <ExternalLink className="size-3" />
                    </a>
                  </div>
                </div>

                {/* Official Embedded Frame Container */}
                <div className="w-full rounded-2xl overflow-hidden border border-white/10 bg-[#121212] shadow-2xl min-h-[500px] relative">
                  <div
                    ref={spotifyMountRef}
                    className={activeProvider === 'spotify' ? 'w-full min-h-[500px]' : 'hidden'}
                  />

                  {activeProvider === 'spotify' && !controllerReady && (
                    <iframe
                      key={activeUri}
                      title={`Spotify Player - ${activeTitle}`}
                      src={
                        activeUri.startsWith('spotify:track:')
                          ? `https://open.spotify.com/embed/track/${activeUri.replace('spotify:track:', '')}?utm_source=generator&theme=0`
                          : `https://open.spotify.com/embed/playlist/${activePlaylistId}?utm_source=generator&theme=0`
                      }
                      width="100%"
                      height="500"
                      frameBorder="0"
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                      className="rounded-2xl"
                    />
                  )}

                  {activeProvider === 'youtube' && (
                    <iframe
                      key={activePlaylistId}
                      title={`YouTube Player - ${activeTitle}`}
                      src={
                        activePlaylistId.startsWith('PL')
                          ? `https://www.youtube.com/embed/videoseries?list=${activePlaylistId}`
                          : `https://www.youtube.com/embed/${activePlaylistId}`
                      }
                      width="100%"
                      height="500"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="rounded-2xl"
                    />
                  )}
                </div>

                {/* Helpful Playback Note */}
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-neutral-400 bg-white/[0.02] px-3.5 py-2 rounded-xl border border-white/5">
                  <span className="flex items-center gap-1.5">
                    <AlertCircle className="size-3.5 text-emerald-400 shrink-0" />
                    <span>
                      Click any track row inside the Spotify player or in the <strong>Tracklist Browser</strong> on the right to play that specific song.
                    </span>
                  </span>
                  <span className="font-mono text-neutral-500">
                    {controllerReady ? 'iFrame API Connected' : 'Standard Embed Active'}
                  </span>
                </div>
              </div>
            </BorderBeamCard>
          </div>

          {/* Right 5 Cols: Interactive Tracklist Browser + Quick Playlist Switcher */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            
            {activeProvider === 'spotify' ? (
              <div className="p-5 rounded-2xl bg-[#0b0e18]/90 border border-white/10 shadow-xl flex flex-col h-[615px]">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <ListMusic className="size-4 text-emerald-400" />
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                      Playlist Tracks ({playlistTracks.length})
                    </h3>
                  </div>
                  <span className="text-xs font-mono text-emerald-400 truncate max-w-[140px]">
                    {activeTitle}
                  </span>
                </div>

                {/* Search within playlist tracks */}
                <div className="mb-3">
                  <input
                    type="text"
                    value={trackSearch}
                    onChange={(e) => setTrackSearch(e.target.value)}
                    placeholder={`Filter ${playlistTracks.length} songs in "${activeTitle}"...`}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Scrollable Real Tracklist */}
                <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                  {loadingTracks ? (
                    <div className="h-full flex flex-col items-center justify-center text-neutral-400 text-xs gap-2">
                      <Disc3 className="size-6 text-emerald-400 animate-spin" />
                      <span>Loading authentic tracklist from Spotify...</span>
                    </div>
                  ) : filteredTracks.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-neutral-500 text-xs text-center p-4">
                      No matching tracks found in this playlist.
                    </div>
                  ) : (
                    filteredTracks.map((track) => {
                      const isCurrentTrack = selectedTrack?.trackId === track.trackId;
                      return (
                        <div
                          key={track.uri || track.index}
                          onClick={() => handlePlaySpecificTrack(track)}
                          className={`p-3 rounded-xl border transition-all duration-150 cursor-pointer flex items-center justify-between gap-3 group ${
                            isCurrentTrack
                              ? 'bg-emerald-950/40 border-emerald-500/60 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                              : 'bg-white/[0.02] hover:bg-white/[0.06] border-white/5 hover:border-white/15'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePlaySpecificTrack(track);
                              }}
                              className={`size-8 rounded-lg flex items-center justify-center shrink-0 transition ${
                                isCurrentTrack
                                  ? 'bg-[#1db954] text-black font-bold'
                                  : 'bg-white/5 group-hover:bg-[#1db954] text-neutral-400 group-hover:text-black'
                              }`}
                              title={`Play "${track.title}" in embedded player`}
                            >
                              <Play className="size-3.5 fill-current ml-0.5" />
                            </button>

                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className={`text-xs font-bold truncate ${isCurrentTrack ? 'text-emerald-300' : 'text-white'}`}>
                                  {track.title}
                                </span>
                                {track.isExplicit && (
                                  <span className="text-[9px] font-mono px-1 rounded bg-white/10 text-neutral-300 shrink-0">
                                    E
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-neutral-400 truncate mt-0.5">
                                {track.artist}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[11px] font-mono text-neutral-400">
                              {formatDuration(track.durationMs)}
                            </span>

                            <a
                              href={track.externalTrackUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-[#1db954]/20 text-neutral-400 hover:text-emerald-300 border border-transparent hover:border-emerald-500/30 transition"
                              title={`Open "${track.title}" directly in Spotify`}
                            >
                              <ExternalLink className="size-3.5" />
                            </a>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Footer of Tracklist Browser */}
                <div className="pt-3 mt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-neutral-400">
                  <span>Click any song to load & play it</span>
                  <span className="font-mono text-emerald-400">↗ opens song on Spotify</span>
                </div>
              </div>
            ) : (
              /* YouTube Music Stream Selector & Profile Info */
              <div className="p-5 rounded-2xl bg-[#0b0e18]/90 border border-white/10 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                    <Radio className="size-4 text-red-400" />
                    <span>YouTube Music Streams</span>
                  </h3>
                  <a
                    href="https://music.youtube.com/@wtfk1y0"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-mono text-red-400 hover:underline flex items-center gap-1"
                  >
                    <span>@wtfk1y0</span>
                    <ExternalLink className="size-3" />
                  </a>
                </div>

                <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20 text-xs text-neutral-300 leading-relaxed">
                  Your canonical YouTube Music profile (<strong className="text-white">music.youtube.com/@wtfk1y0</strong>) is linked above. Below are embeddable YouTube audio streams; you can also add any public YouTube video or playlist URL using the <strong>Add Playlist / Track</strong> button.
                </div>

                <div className="space-y-2.5">
                  {youtubePlaylists.map((item) => {
                    const isSelected = activePlaylistId === item.embedId;
                    return (
                      <div
                        key={item.id}
                        onClick={() => handleSelectPlaylist(item, true)}
                        className={`p-3.5 rounded-xl border transition cursor-pointer flex items-center justify-between gap-3 ${
                          isSelected
                            ? 'bg-red-950/30 border-red-500/50'
                            : 'bg-white/[0.02] border-white/10 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img src={item.coverUrl} alt={item.title} className="size-12 rounded-lg object-cover shrink-0" />
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-white truncate">{item.title}</div>
                            <div className="text-[11px] text-neutral-400 font-mono">{item.mood}</div>
                          </div>
                        </div>
                        <a
                          href={item.externalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300"
                        >
                          <ExternalLink className="size-3.5" />
                        </a>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>

        </div>

        {/* Curated Playlists Grid */}
        <div className="space-y-5 pt-6 border-t border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
                <span>
                  {activeTab === 'all'
                    ? 'All Curated Playlists'
                    : activeTab === 'spotify'
                    ? 'Spotify Playlists'
                    : 'YouTube Music Streams'}
                </span>
                <span className="text-xs font-mono text-emerald-400 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  {displayedPlaylists.length} Available
                </span>
              </h2>
              <p className="text-xs text-neutral-400 mt-1">
                Click any playlist card to load its songs into the interactive player and tracklist browser above.
              </p>
            </div>
            {collectionsError && (
              <button
                onClick={() => loadMusicCollections()}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-medium transition cursor-pointer w-fit"
              >
                <RotateCcw className="size-3.5" />
                <span>Retry Loading Playlists</span>
              </button>
            )}
          </div>

          {collectionsError && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <AlertCircle className="size-4 text-rose-400 shrink-0" />
                <span>{collectionsError}</span>
              </div>
              <button
                onClick={() => loadMusicCollections()}
                className="px-3 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-white font-medium text-xs transition cursor-pointer"
              >
                Try Again
              </button>
            </div>
          )}

          {isLoadingCollections && (
            <div className="p-12 rounded-3xl bg-white/[0.02] border border-white/10 text-center space-y-3">
              <Disc3 className="size-8 text-emerald-400 animate-spin mx-auto" />
              <div className="text-sm font-bold text-white">Loading Music Playlists...</div>
              <p className="text-xs text-neutral-400">Fetching curated Spotify and YouTube Music collections</p>
            </div>
          )}

          {!isLoadingCollections && displayedPlaylists.length === 0 && (
            <div className="p-12 rounded-3xl bg-white/[0.02] border border-white/10 text-center space-y-3">
              <Music className="size-10 text-neutral-500 mx-auto" />
              <div className="text-base font-bold text-white">No playlists found</div>
              <p className="text-xs text-neutral-400 max-w-md mx-auto">
                No music playlists are currently available in this section.
              </p>
            </div>
          )}

          {!isLoadingCollections && displayedPlaylists.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {displayedPlaylists.map((pl) => {
                const localSpotifyCover =
                  pl.provider === 'spotify' && pl.embedId
                    ? `/assets/music/${pl.embedId}.jpg`
                    : undefined;
                return (
                  <MediaCard
                    key={pl.id}
                    title={pl.title}
                    subtitle={`${pl.mood} · ${pl.trackCount ? `${pl.trackCount} tracks` : 'Stream'}`}
                    imageUrl={localSpotifyCover || pl.coverUrl}
                    fallbackImageUrl={pl.coverUrl}
                    category="music"
                    enableVinylReveal={true}
                    badge={pl.provider === 'spotify' ? 'Spotify' : 'YT Music'}
                    badgeColor={pl.provider === 'spotify' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-red-400 bg-red-500/10 border-red-500/20'}
                    aspectRatio="square"
                    primaryActionLabel={pl.provider === 'spotify' ? 'Open Playlist in Spotify' : 'Open in YT Music'}
                    primaryActionUrl={pl.externalUrl}
                    onPlayClick={() => handleSelectPlaylist(pl, true)}
                    isActive={activePlaylistId === pl.embedId}
                    onClick={() => handleSelectPlaylist(pl, false)}
                    className="cursor-pointer"
                  >
                    {isAdmin && (
                      <div className="flex items-center gap-2 mt-3" onClick={(event) => event.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => openPlaylistEditor(pl)}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 px-2 py-1.5 text-[11px] text-neutral-200"
                        >
                          <Pencil className="size-3" />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleDeletePlaylist(pl.id)}
                          className="inline-flex items-center justify-center rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 px-2 py-1.5 text-rose-300"
                          aria-label={`Delete ${pl.title}`}
                        >
                          <Trash2 className="size-3" />
                        </button>
                      </div>
                    )}
                  </MediaCard>
                );
              })}
            </div>
          )}
        </div>

        {/* Add Playlist Modal */}
        {isAdmin && showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
            <div className="w-full max-w-md rounded-2xl bg-[#0c101d] border border-white/15 p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-white">
                  {editingPlaylist ? 'Edit Playlist' : 'Add Spotify or YouTube Playlist'}
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1 rounded-lg text-neutral-400 hover:text-white cursor-pointer"
                >
                  <X className="size-4" />
                </button>
              </div>

              <form onSubmit={handleAddPlaylistSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-neutral-300 font-medium mb-1">
                    Spotify Playlist or YouTube Video/Playlist URL {editingPlaylist ? '' : '*'}
                  </label>
                  <input
                    type="url"
                    required={!editingPlaylist}
                    disabled={Boolean(editingPlaylist)}
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    placeholder="https://open.spotify.com/playlist/... or https://www.youtube.com/watch?v=..."
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
                  />
                  <p className="text-[11px] text-neutral-500 mt-1">
                    Title and cover art are automatically resolved via official oEmbed.
                  </p>
                </div>

                <div>
                  <label className="block text-neutral-300 font-medium mb-1">Custom Title (Optional)</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Leave empty to use official playlist title"
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <label className="flex items-center gap-2 text-neutral-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sharePlaylistPublicly}
                    onChange={(event) => setSharePlaylistPublicly(event.target.checked)}
                  />
                  Share this playlist publicly
                </label>

                <div>
                  <label className="block text-neutral-300 font-medium mb-1">Mood / Tag</label>
                  <input
                    type="text"
                    value={newMood}
                    onChange={(e) => setNewMood(e.target.value)}
                    placeholder="e.g. Focus, Coding, High Energy..."
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingPlaylist(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 font-medium cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold shadow-lg cursor-pointer"
                  >
                    {isSubmitting ? 'Saving...' : editingPlaylist ? 'Save Changes' : 'Save Playlist'}
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

export default MusicPage;
