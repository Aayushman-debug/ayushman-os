import { Router, Request, Response } from 'express';
import { appStore, savePersistedStore } from '../database/persistence';
import { query, isDbConnected } from '../database/db';
import { requireAdmin, ADMIN_EMAIL } from '../middleware/authorization';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  const isSoleAdmin = req.user && req.user.role === 'admin' && req.user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase();

  if (isSoleAdmin) {
    return res.json({
      success: true,
      profiles: appStore.gaming,
    });
  }

  // Sanitized view for visitors: omit private account identifiers (uid, inGameId, private notes)
  const sanitized = appStore.gaming
    .filter((profile) => profile.isPublic === true)
    .map((p) => ({
      id: p.id,
      slug: p.slug,
      gameName: p.gameName,
      publisher: p.publisher,
      genre: p.genre,
      currentRank: p.currentRank,
      peakRank: p.peakRank,
      profileUrl: p.profileUrl,
      clanTeam: p.clanTeam,
      role: p.role,
      artworkUrl: p.artworkUrl,
      accentColor: p.accentColor,
      holoColor: p.holoColor,
      badgeText: p.badgeText,
      status: p.status,
    }));

  return res.json({
    success: true,
    profiles: sanitized,
  });
});

router.post('/', requireAdmin, async (req: Request, res: Response) => {
  const {
    gameName,
    publisher,
    genre,
    inGameId,
    uid,
    profileUrl,
    serverRegion,
    currentRank,
    peakRank,
    clanTeam,
    role,
    artworkUrl,
    accentColor,
    holoColor,
    badgeText,
    statsSummary,
    notes
  } = req.body;

  const newProfile = {
    id: Date.now(),
    slug: (gameName || 'game').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    gameName: gameName || 'New Game',
    publisher: publisher || 'Game Studio',
    genre: genre || 'Competitive / Action',
    inGameId: inGameId || 'Editable Profile',
    uid: uid || '',
    profileUrl: profileUrl || '',
    serverRegion: serverRegion || 'Global',
    currentRank: currentRank || 'Configurable',
    peakRank: peakRank || 'Configurable',
    clanTeam: clanTeam || 'Solo',
    role: role || 'Player',
    artworkUrl: artworkUrl || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=900&auto=format&fit=crop',
    accentColor: accentColor || '#a855f7',
    holoColor: holoColor || 'rgba(168, 85, 247, 0.35)',
    gradient: 'from-purple-500/30 via-indigo-950/40 to-cyan-900/30',
    badgeText: badgeText || currentRank || 'Configured',
    status: 'verified',
    lastUpdated: new Date().toISOString().split('T')[0],
    statsSummary: statsSummary || {},
    notes: notes || '',
    isPublic: req.body.isPublic === true
  };

  appStore.gaming.push(newProfile);
  if (!savePersistedStore(appStore)) {
    return res.status(500).json({ success: false, message: 'Failed to save gaming profile.' });
  }

  if (isDbConnected()) {
    try {
      await query(
        `INSERT INTO gaming_profiles (user_id, game_name, in_game_id, uid, server_region, current_rank, peak_rank, clan_team, role, stats_summary, is_public)
         VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          newProfile.gameName,
          newProfile.inGameId,
          newProfile.uid,
          newProfile.serverRegion,
          newProfile.currentRank,
          newProfile.peakRank,
          newProfile.clanTeam,
          newProfile.role,
          JSON.stringify(newProfile.statsSummary),
          newProfile.isPublic
        ]
      );
    } catch (e) {
      console.warn('[MySQL Gaming Insert Notice]:', e);
    }
  }

  return res.json({ success: true, profile: newProfile, profiles: appStore.gaming });
});

router.patch('/:id', requireAdmin, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const idx = appStore.gaming.findIndex(p => Number(p.id) === id);
  if (idx === -1) {
    return res.status(404).json({ success: false, message: 'Gaming profile not found' });
  }

  const current = appStore.gaming[idx];
  const updates = req.body;

  const updated = {
    ...current,
    ...updates,
    statsSummary: updates.statsSummary ? { ...current.statsSummary, ...updates.statsSummary } : current.statsSummary,
    lastUpdated: updates.lastUpdated || new Date().toISOString().split('T')[0],
    status: updates.status || 'verified'
  };

  appStore.gaming[idx] = updated;
  if (!savePersistedStore(appStore)) {
    return res.status(500).json({ success: false, message: 'Failed to save gaming profile.' });
  }

  if (isDbConnected()) {
    try {
      await query(
        `UPDATE gaming_profiles SET in_game_id = ?, uid = ?, server_region = ?, current_rank = ?, peak_rank = ?, clan_team = ?, role = ?, stats_summary = ? WHERE id = ?`,
        [
          updated.inGameId,
          updated.uid,
          updated.serverRegion,
          updated.currentRank,
          updated.peakRank,
          updated.clanTeam,
          updated.role,
          JSON.stringify(updated.statsSummary),
          id
        ]
      );
    } catch (e) {
      console.warn('[MySQL Gaming Update Notice]:', e);
    }
  }

  return res.json({ success: true, profile: updated, profiles: appStore.gaming });
});

router.delete('/:id', requireAdmin, (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const index = appStore.gaming.findIndex((profile) => Number(profile.id) === id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Gaming profile not found.' });
  }

  appStore.gaming.splice(index, 1);
  if (!savePersistedStore(appStore)) {
    return res.status(500).json({ success: false, message: 'Failed to save gaming profile changes.' });
  }

  return res.json({ success: true, profiles: appStore.gaming });
});

export default router;
