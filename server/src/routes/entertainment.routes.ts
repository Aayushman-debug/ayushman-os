import { Router, Request, Response } from 'express';
import { spotifyUserProfile } from '../data/initialData';
import { appStore, savePersistedStore } from '../database/persistence';
import { query, isDbConnected } from '../database/db';
import { requireAdmin } from '../middleware/authorization';
import { ADMIN_EMAIL } from '../middleware/authorization';
import { initialMusic } from '../data/initialData';

const router = Router();

function isAdminRequest(req: Request): boolean {
  return Boolean(
    req.user &&
    req.user.role === 'admin' &&
    req.user.email.toLowerCase() === ADMIN_EMAIL
  );
}

function publicAnimeEntry(entry: any) {
  const { notes, ...publicData } = entry;
  return publicData;
}

function publicMovieEntry(entry: any) {
  const { notes, privateNotes, ...publicData } = entry;
  return publicData;
}

function isPublicMusicEntry(entry: any): boolean {
  return entry.isPublic !== false;
}

function publicMusicEntry(entry: any) {
  const { id, title, provider, externalUrl, embedId, coverUrl, mood, trackCount, isFavorite } = entry;
  return { id, title, provider, externalUrl, embedId, coverUrl, mood, trackCount, isFavorite };
}

// --- ANIME ---
router.get('/anime', async (req: Request, res: Response) => {
  let list = [...appStore.anime];
  if (isDbConnected()) {
    try {
      const [rows] = await query('SELECT * FROM anime_entries ORDER BY id DESC');
      if (Array.isArray(rows) && rows.length > 0) {
        const existingTitles = new Set(list.map((a: any) => String(a.title).toLowerCase()));
        for (const r of rows as any[]) {
          const title = String(r.title || '').trim();
          if (title && !existingTitles.has(title.toLowerCase())) {
            list.push({
              id: r.id,
              title: r.title,
              anilistId: r.anilist_id,
              posterUrl: r.poster_url,
              bannerUrl: r.poster_url,
              format: r.format || 'TV',
              totalEpisodes: r.total_episodes || 12,
              episodesWatched: r.episodes_watched || 0,
              status: r.status === 'paused' ? 'on_hold' : r.status,
              score: Number(r.score) || 9.0,
              favoriteCharacter: r.favorite_character,
              notes: r.notes,
              isFavorite: false,
              genres: ['Anime'],
              isPublic: true,
            });
            existingTitles.add(title.toLowerCase());
          }
        }
      }
    } catch (e) {
      console.warn('[MySQL Anime Fetch Notice]:', e);
    }
  }

  const isAdmin = isAdminRequest(req);
  const anime = isAdmin
    ? list
    : list.filter((entry) => entry.isPublic !== false).map(publicAnimeEntry);

  return res.json({ success: true, anime });
});

router.post('/anime', requireAdmin, async (req: Request, res: Response) => {
  const {
    title,
    anilistId,
    format,
    totalEpisodes,
    episodesWatched,
    status,
    score,
    favoriteCharacter,
    notes,
    posterUrl,
    bannerUrl,
    isFavorite,
    priority,
    completedDate,
    genres,
    isPublic,
  } = req.body;

  const resolvedStatus = status || 'plan_to_watch';
  const totalEps = parseInt(totalEpisodes, 10) || 12;
  const watchedEps = resolvedStatus === 'completed'
    ? totalEps
    : (parseInt(episodesWatched, 10) || 0);

  const newAnime = {
    id: Date.now(),
    title: title || 'Untitled Anime',
    anilistId: anilistId || null,
    posterUrl: posterUrl || 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx16498-buvcRTBx4NSm.jpg',
    bannerUrl: bannerUrl || posterUrl || '',
    format: format || 'TV Series',
    totalEpisodes: totalEps,
    episodesWatched: watchedEps,
    status: resolvedStatus,
    score: parseFloat(score) || 9.0,
    favoriteCharacter: favoriteCharacter || '',
    isFavorite: Boolean(isFavorite),
    priority: priority || 'Medium',
    completedDate: completedDate || (resolvedStatus === 'completed' ? new Date().getFullYear().toString() : ''),
    genres: Array.isArray(genres) ? genres : ['Anime'],
    notes: notes || '',
    isPublic: isPublic === true,
  };

  appStore.anime.unshift(newAnime);
  if (!savePersistedStore(appStore)) {
    return res.status(500).json({ success: false, message: 'Failed to save entertainment changes.' });
  }

  if (isDbConnected()) {
    try {
      await query(
        `INSERT INTO anime_entries (user_id, title, anilist_id, poster_url, format, total_episodes, episodes_watched, status, score, favorite_character, notes)
         VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          newAnime.title,
          newAnime.anilistId,
          newAnime.posterUrl,
          newAnime.format,
          newAnime.totalEpisodes,
          newAnime.episodesWatched,
          newAnime.status === 'on_hold' ? 'paused' : newAnime.status,
          newAnime.score,
          newAnime.favoriteCharacter,
          newAnime.notes
        ]
      );
    } catch (e) {
      console.warn('[MySQL Anime Insert Notice]:', e);
    }
  }

  return res.json({ success: true, anime: newAnime, list: appStore.anime });
});

// Batch import anime by searching AniList for each title
router.post('/anime/batch', requireAdmin, async (req: Request, res: Response) => {
  const { titles, status = 'completed', isFavorite = false, isPublic = false } = req.body;
  if (!Array.isArray(titles) || titles.length === 0) {
    return res.status(400).json({ success: false, message: 'Provide an array of anime titles' });
  }

  const added: any[] = [];
  const graphqlQuery = `
    query ($search: String) {
      Media(search: $search, type: ANIME, sort: POPULARITY_DESC) {
        id
        title {
          romaji
          english
        }
        coverImage {
          extraLarge
          large
        }
        bannerImage
        format
        episodes
        averageScore
        genres
      }
    }
  `;

  for (const rawTitle of titles.slice(0, 15)) {
    const cleanTitle = String(rawTitle).trim();
    if (!cleanTitle) continue;

    try {
      const response = await fetch('https://graphql.anilist.co', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ query: graphqlQuery, variables: { search: cleanTitle } })
      });

      if (response.ok) {
        const json = await response.json() as any;
        const media = json.data?.Media;
        if (media) {
          const resolvedTitle = media.title?.english || media.title?.romaji || cleanTitle;
          // Avoid duplicates
          const exists = appStore.anime.some(
            a => a.anilistId === media.id || a.title.toLowerCase() === resolvedTitle.toLowerCase()
          );
          if (!exists) {
            const eps = media.episodes || 24;
            const entry = {
              id: Date.now() + Math.floor(Math.random() * 10000),
              title: resolvedTitle,
              anilistId: media.id,
              posterUrl: media.coverImage?.extraLarge || media.coverImage?.large || '',
              bannerUrl: media.bannerImage || media.coverImage?.extraLarge || '',
              format: media.format || 'TV',
              totalEpisodes: eps,
              episodesWatched: status === 'completed' ? eps : 0,
              status,
              score: media.averageScore ? Number((media.averageScore / 10).toFixed(1)) : 9.0,
              favoriteCharacter: '',
              isFavorite: Boolean(isFavorite),
              priority: 'Medium',
              completedDate: status === 'completed' ? new Date().getFullYear().toString() : '',
              genres: media.genres?.slice(0, 4) || ['Anime'],
              notes: '',
              isPublic: isPublic === true,
            };
            appStore.anime.unshift(entry);
            added.push(entry);
          }
        }
      }
    } catch (e) {
      console.warn(`[AniList Batch Lookup] Failed for ${cleanTitle}:`, e);
    }
  }

  if (!savePersistedStore(appStore)) {
    return res.status(500).json({ success: false, message: 'Failed to save entertainment changes.' });
  }
  return res.json({ success: true, addedCount: added.length, added, anime: appStore.anime });
});

// Update anime status, episode progress, score, favorite, priority, or notes
router.patch('/anime/:id', requireAdmin, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const idx = appStore.anime.findIndex(a => Number(a.id) === id);
  if (idx === -1) {
    return res.status(404).json({ success: false, message: 'Anime entry not found' });
  }

  const current = appStore.anime[idx];
  const updates = req.body;

  const nextStatus = updates.status !== undefined ? updates.status : current.status;
  let nextEpisodesWatched = updates.episodesWatched !== undefined
    ? Number(updates.episodesWatched)
    : current.episodesWatched;

  if (nextStatus === 'completed' && updates.episodesWatched === undefined && current.totalEpisodes) {
    nextEpisodesWatched = current.totalEpisodes;
  }

  const updated = {
    ...current,
    ...updates,
    status: nextStatus,
    episodesWatched: Math.max(0, nextEpisodesWatched),
    score: updates.score !== undefined ? Number(updates.score) : current.score,
    isFavorite: updates.isFavorite !== undefined ? Boolean(updates.isFavorite) : current.isFavorite,
  };

  appStore.anime[idx] = updated;
  if (!savePersistedStore(appStore)) {
    return res.status(500).json({ success: false, message: 'Failed to save entertainment changes.' });
  }

  if (isDbConnected()) {
    try {
      await query(
        `UPDATE anime_entries SET status = ?, episodes_watched = ?, score = ?, favorite_character = ?, notes = ? WHERE id = ?`,
        [
          updated.status === 'on_hold' ? 'paused' : updated.status,
          updated.episodesWatched,
          updated.score,
          updated.favoriteCharacter || '',
          updated.notes || '',
          id
        ]
      );
    } catch (e) {
      console.warn('[MySQL Anime Update Notice]:', e);
    }
  }

  return res.json({ success: true, anime: updated, list: appStore.anime });
});

router.delete('/anime/:id', requireAdmin, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  appStore.anime = appStore.anime.filter(a => Number(a.id) !== id);
  if (!savePersistedStore(appStore)) {
    return res.status(500).json({ success: false, message: 'Failed to save entertainment changes.' });
  }

  if (isDbConnected()) {
    try {
      await query(`DELETE FROM anime_entries WHERE id = ?`, [id]);
    } catch (e) {
      console.warn('[MySQL Anime Delete Notice]:', e);
    }
  }

  return res.json({ success: true, list: appStore.anime });
});

// AniList Public GraphQL Search Proxy
router.get('/anime/search', async (req: Request, res: Response) => {
  const queryStr = (req.query.q as string) || 'Attack on Titan';
  const graphqlQuery = `
    query ($search: String) {
      Page(page: 1, perPage: 8) {
        media(search: $search, type: ANIME, sort: POPULARITY_DESC) {
          id
          title {
            romaji
            english
            native
          }
          coverImage {
            large
            extraLarge
          }
          bannerImage
          format
          episodes
          averageScore
          genres
          seasonYear
          description(asHtml: false)
        }
      }
    }
  `;

  try {
    const response = await fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query: graphqlQuery,
        variables: { search: queryStr }
      })
    });

    if (!response.ok) {
      throw new Error(`AniList returned status ${response.status}`);
    }

    const json = await response.json() as any;
    return res.json({ success: true, results: json.data?.Page?.media || [] });
  } catch (error: any) {
    return res.json({
      success: true,
      results: appStore.anime
        .filter((entry) => entry.isPublic === true && entry.title.toLowerCase().includes(queryStr.toLowerCase()))
        .map(publicAnimeEntry),
      fallback: true,
      error: error.message
    });
  }
});

// --- MOVIES & TV ---
router.get('/movies', async (req: Request, res: Response) => {
  let list = [...appStore.movies];
  if (isDbConnected()) {
    try {
      const [rows] = await query('SELECT * FROM movie_entries ORDER BY id DESC');
      if (Array.isArray(rows) && rows.length > 0) {
        const existingTitles = new Set(list.map((m: any) => String(m.title).toLowerCase()));
        for (const r of rows as any[]) {
          const title = String(r.title || '').trim();
          if (title && !existingTitles.has(title.toLowerCase())) {
            list.push({
              id: r.id,
              title: r.title,
              tmdbId: r.tmdb_id,
              mediaType: r.media_type || 'movie',
              posterUrl: r.poster_url,
              backdropUrl: r.backdrop_url,
              releaseYear: r.release_year || 2024,
              status: r.status || 'watched',
              rating: Number(r.rating) || 8.5,
              review: r.review,
              isPublic: true,
            });
            existingTitles.add(title.toLowerCase());
          }
        }
      }
    } catch (e) {
      console.warn('[MySQL Movie Fetch Notice]:', e);
    }
  }

  const isAdmin = isAdminRequest(req);
  const movies = isAdmin
    ? list
    : list.filter((entry) => entry.isPublic !== false).map(publicMovieEntry);

  return res.json({ success: true, movies });
});

router.post('/movies', requireAdmin, (req: Request, res: Response) => {
  const { title, mediaType, releaseYear, status, rating, review, posterUrl, isPublic } = req.body;
  const newMovie = {
    id: Date.now(),
    title: title || 'Untitled Film',
    tmdbId: null,
    mediaType: mediaType || 'movie',
    posterUrl: posterUrl || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop',
    releaseYear: parseInt(releaseYear, 10) || 2024,
    status: status || 'watched',
    rating: parseFloat(rating) || 8.5,
    review: review || '',
    isPublic: isPublic === true,
  };
  appStore.movies.unshift(newMovie);
  if (!savePersistedStore(appStore)) {
    return res.status(500).json({ success: false, message: 'Failed to save playlist cache.' });
  }
  return res.json({ success: true, movie: newMovie });
});

// --- MUSIC ---
router.get('/music', async (req: Request, res: Response) => {
  let list = [...appStore.music];
  if (isDbConnected()) {
    try {
      const [rows] = await query('SELECT * FROM music_collections ORDER BY id ASC');
      if (Array.isArray(rows) && rows.length > 0) {
        const existingKeys = new Set(list.map((m: any) => String(m.embedId || m.externalUrl || m.title).toLowerCase()));
        for (const r of rows as any[]) {
          const key = String(r.embed_id || r.external_url || r.title).toLowerCase();
          if (!existingKeys.has(key)) {
            list.push({
              id: r.id,
              title: r.title,
              provider: r.provider || 'spotify',
              externalUrl: r.external_url,
              embedId: r.embed_id,
              coverUrl: r.cover_url,
              mood: r.mood || 'Curated',
              trackCount: r.track_count || 20,
              isFavorite: Boolean(r.is_favorite),
              isPublic: true,
            });
            existingKeys.add(key);
          }
        }
      }
    } catch (e) {
      console.warn('[MySQL Music Fetch Notice]:', e);
    }
  }

  const isAdmin = isAdminRequest(req);
  const collections = isAdmin
    ? list
    : list.filter(isPublicMusicEntry).map(publicMusicEntry);

  return res.json({
    success: true,
    userProfile: isAdmin
      ? spotifyUserProfile
      : {
          displayName: spotifyUserProfile.displayName,
          avatarUrl: spotifyUserProfile.avatarUrl,
        },
    collections
  });
});

// Fetch real tracks of a Spotify playlist from Spotify's public embed state
router.get('/music/playlist/:embedId/tracks', async (req: Request, res: Response) => {
  const embedId = String(req.params.embedId || '').replace(/[^a-zA-Z0-9]/g, '');
  if (!embedId) {
    return res.status(400).json({ success: false, message: 'Invalid playlist ID' });
  }
  const isAdmin = isAdminRequest(req);
  const playlist = appStore.music.find((entry) => entry.embedId === embedId || entry.id === embedId);
  if (!isAdmin && (!playlist || !isPublicMusicEntry(playlist))) {
    return res.status(404).json({ success: false, message: 'Public playlist not found.' });
  }

  // Return cached tracks if already resolved
  if (appStore.playlistTracksCache[embedId] && appStore.playlistTracksCache[embedId].length > 0) {
    return res.json({
      success: true,
      embedId,
      tracks: appStore.playlistTracksCache[embedId],
      cached: true
    });
  }

  try {
    const embedUrl = `https://open.spotify.com/embed/playlist/${embedId}`;
    const response = await fetch(embedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`Spotify embed responded with status ${response.status}`);
    }

    const html = await response.text();
    const match = html.match(/<script id="__NEXT_DATA__" type="application\/json">([^<]+)<\/script>/);
    if (!match || !match[1]) {
      throw new Error('Could not locate __NEXT_DATA__ in Spotify embed');
    }

    const nextData = JSON.parse(match[1]);
    const entity = nextData?.props?.pageProps?.state?.data?.entity;
    const rawTracks: any[] = entity?.trackList || [];

    const tracks = rawTracks.map((t: any, idx: number) => {
      const uri: string = t.uri || '';
      const trackId = uri.startsWith('spotify:track:') ? uri.replace('spotify:track:', '') : '';
      return {
        index: idx + 1,
        uri,
        trackId,
        title: t.title || `Track ${idx + 1}`,
        artist: t.subtitle || 'Unknown Artist',
        durationMs: t.duration || 0,
        isExplicit: Boolean(t.isExplicit),
        isPlayable: t.isPlayable !== false,
        audioPreviewUrl: t.audioPreview?.url || null,
        externalTrackUrl: trackId ? `https://open.spotify.com/track/${trackId}` : `https://open.spotify.com/playlist/${embedId}`
      };
    });

    if (tracks.length > 0) {
      appStore.playlistTracksCache[embedId] = tracks;
      if (!savePersistedStore(appStore)) {
        return res.status(500).json({ success: false, message: 'Failed to save entertainment changes.' });
      }
    }

    return res.json({
      success: true,
      embedId,
      playlistName: entity?.name || '',
      ownerName: entity?.subtitle || '',
      tracks
    });
  } catch (error: any) {
    return res.json({
      success: false,
      embedId,
      tracks: [],
      error: error.message
    });
  }
});

// Add new playlist dynamically
router.post('/music/playlists', requireAdmin, async (req: Request, res: Response) => {
  const { url, title, provider, mood, isPublic } = req.body;
  if (!url) {
    return res.status(400).json({ success: false, message: 'URL is required' });
  }

  let embedId = '';
  let resolvedTitle = title || 'Custom Playlist';
  let coverUrl = 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop';
  const isSpotify = url.includes('spotify.com');

  if (isSpotify) {
    const match = url.match(/(?:playlist|track|album)\/([a-zA-Z0-9]+)/);
    if (match) {
      embedId = match[1];
    }
    try {
      const oembedRes = await fetch(`https://open.spotify.com/oembed?url=${encodeURIComponent(url)}`);
      if (oembedRes.ok) {
        const data = await oembedRes.json() as any;
        if (data.title && !title) resolvedTitle = data.title;
        if (data.thumbnail_url) coverUrl = data.thumbnail_url;
      }
    } catch {
      // Graceful fallback
    }
  } else {
    const listMatch = url.match(/[?&]list=([a-zA-Z0-9_-]+)/);
    const videoMatch = url.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/);
    embedId = listMatch ? listMatch[1] : (videoMatch ? videoMatch[1] : '');
  }

  const newPlaylist = {
    id: Date.now(),
    title: resolvedTitle,
    provider: isSpotify ? 'spotify' : (provider || 'youtube'),
    externalUrl: url,
    embedId: embedId || url,
    coverUrl,
    mood: mood || 'Curated',
    trackCount: 20,
    isFavorite: false,
    isPublic: isPublic === true,
  };

  appStore.music.push(newPlaylist);
  if (!savePersistedStore(appStore)) {
    return res.status(500).json({ success: false, message: 'Failed to save playlist.' });
  }
  return res.json({ success: true, playlist: newPlaylist, collections: appStore.music });
});

router.patch('/music/playlists/:id', requireAdmin, (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const playlist = appStore.music.find((item) => Number(item.id) === id);
  if (!playlist) {
    return res.status(404).json({ success: false, message: 'Playlist not found.' });
  }

  const { title, mood, isPublic } = req.body || {};
  if (title !== undefined) playlist.title = String(title).trim();
  if (mood !== undefined) playlist.mood = String(mood).trim();
  if (isPublic !== undefined) playlist.isPublic = isPublic === true;
  if (!savePersistedStore(appStore)) {
    return res.status(500).json({ success: false, message: 'Failed to save playlist.' });
  }
  return res.json({ success: true, playlist, collections: appStore.music });
});

router.delete('/music/playlists/:id', requireAdmin, (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const existingCount = appStore.music.length;
  appStore.music = appStore.music.filter((item) => Number(item.id) !== id);
  if (appStore.music.length === existingCount) {
    return res.status(404).json({ success: false, message: 'Playlist not found.' });
  }
  if (!savePersistedStore(appStore)) {
    return res.status(500).json({ success: false, message: 'Failed to remove playlist.' });
  }
  return res.json({ success: true, collections: appStore.music });
});

export default router;
