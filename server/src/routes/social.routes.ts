import { Router, Request, Response } from 'express';
import { appStore, savePersistedStore } from '../database/persistence';
import { requireAdmin } from '../middleware/authorization';

const router = Router();

// GET all social & platform profiles
router.get('/profiles', (_req: Request, res: Response) => {
  const socialProfiles = appStore.socialProfiles.filter((profile) => profile.visible === true);
  const publicProfiles = socialProfiles.map((profile) => {
    const isGamingProfile = profile.category === 'gaming';
    return {
      id: profile.id,
      platform: profile.platform,
      category: profile.category,
      displayName: isGamingProfile ? profile.platform : profile.displayName,
      username: isGamingProfile ? '' : profile.username,
      profileUrl: profile.profileUrl,
      avatarUrl: profile.avatarUrl,
      bio: isGamingProfile ? 'View publicly shared gaming profiles.' : profile.bio,
      status: profile.status,
      integrationLevel: profile.integrationLevel,
      isVerified: profile.isVerified,
      order: profile.order,
    };
  });
  return res.json({
    success: true,
    profiles: publicProfiles.sort((a, b) => a.order - b.order),
    categories: [
      { id: 'all', label: 'All Platforms' },
      { id: 'social', label: 'Social & Media' },
      { id: 'music', label: 'Music & Audio' },
      { id: 'developer', label: 'Engineering & Code' },
      { id: 'gaming', label: 'Gaming Identities' },
      { id: 'community', label: 'Community & Chat' },
    ],
    integrationLevels: {
      A: {
        label: 'Level A: Canonical Links',
        description: 'Direct HTTPS verified link to public profile or community without requiring API credentials.',
        count: publicProfiles.filter(p => p.integrationLevel === 'A' && p.status === 'configured').length
      },
      B: {
        label: 'Level B: Embeds & Content',
        description: 'Official interactive embedded player or public content stream (e.g., Spotify, YouTube).',
        count: publicProfiles.filter(p => p.integrationLevel === 'B' && p.status === 'configured').length
      },
      C: {
        label: 'Level C: Authenticated API',
        description: 'Requires OAuth app registration, credentials, and token refresh on backend. Private data isolated.',
        count: publicProfiles.filter(p => p.integrationLevel === 'C').length
      }
    }
  });
});

// POST: Add or update a platform profile
router.post('/profiles', requireAdmin, (req: Request, res: Response) => {
  const { platform, category, displayName, username, profileUrl, avatarUrl, bio, integrationLevel } = req.body;

  if (!platform || !profileUrl) {
    return res.status(400).json({ success: false, message: 'Platform name and Profile URL are required.' });
  }

  try {
    const parsed = new URL(profileUrl);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return res.status(400).json({ success: false, message: 'Invalid URL protocol. HTTPS required.' });
    }
  } catch {
    return res.status(400).json({ success: false, message: 'Invalid URL format.' });
  }

  const existingIndex = appStore.socialProfiles.findIndex(p => p.id === platform.toLowerCase().replace(/[^a-z0-9]/g, '-'));

  const newProfile = {
    id: platform.toLowerCase().replace(/[^a-z0-9]/g, '-'),
    platform,
    category: category || 'social',
    displayName: displayName || 'AYushMan',
    username: username || '',
    profileUrl,
    avatarUrl: avatarUrl || '',
    bio: bio || '',
    status: 'configured',
    integrationLevel: integrationLevel || 'A',
    isVerified: true,
    visible: true,
    order: appStore.socialProfiles.length + 1
  };

  if (existingIndex >= 0) {
    appStore.socialProfiles[existingIndex] = { ...appStore.socialProfiles[existingIndex], ...newProfile };
    if (!savePersistedStore(appStore)) {
      return res.status(500).json({ success: false, message: 'Failed to save social profile.' });
    }
    return res.json({ success: true, profile: appStore.socialProfiles[existingIndex], action: 'updated' });
  } else {
    appStore.socialProfiles.push(newProfile);
    if (!savePersistedStore(appStore)) {
      return res.status(500).json({ success: false, message: 'Failed to save social profile.' });
    }
    return res.json({ success: true, profile: newProfile, action: 'created' });
  }
});

// PATCH: Toggle visibility or edit single profile
router.patch('/profiles/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const target = appStore.socialProfiles.find(p => p.id === id);

  if (!target) {
    return res.status(404).json({ success: false, message: 'Profile not found' });
  }

  Object.assign(target, req.body);
  if (!savePersistedStore(appStore)) {
    return res.status(500).json({ success: false, message: 'Failed to save social profile.' });
  }
  return res.json({ success: true, profile: target });
});

// DELETE: Remove a profile
router.delete('/profiles/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  appStore.socialProfiles = appStore.socialProfiles.filter(p => p.id !== id);
  if (!savePersistedStore(appStore)) {
    return res.status(500).json({ success: false, message: 'Failed to save social profile.' });
  }
  return res.json({ success: true, message: 'Profile removed' });
});

export default router;
