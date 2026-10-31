import React, { useState, useEffect } from 'react';
import { 
  Share2, 
  ExternalLink, 
  Copy, 
  Check, 
  Plus, 
  ShieldCheck, 
  AlertCircle, 
  Sparkles, 
  Eye, 
  EyeOff, 
  Edit3, 
  Lock,
  Globe,
  Radio,
  Music,
  Code2,
  Gamepad2,
  MessageSquare,
  Users,
  Layers,
  HelpCircle,
  X
} from 'lucide-react';
import { SpotlightCard } from '@/components/ui/spotlight-card';
import { HoloCard, BorderBeamCard, SharedHoverGrid } from '@/components/ui/cards';
import { PageTransition } from '@/components/ui/page-transition';
import { SmartImage } from '@/components/ui/smart-image';
import { CoverflowCarousel, CoverflowSlide } from '@/components/ui/coverflow-carousel';
import { useAuth } from '@/context/AuthContext';

// Custom Brand SVGs
const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

const DiscordIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.894.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
  </svg>
);

const GithubIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

function resolveSocialGraphic(profile: any): string {
  const id = (profile?.id || '').toLowerCase();
  const platform = (profile?.platform || '').toLowerCase();
  if (id === 'instagram' || platform.includes('instagram')) return '/assets/social/instagram.svg';
  if (id === 'spotify' || platform.includes('spotify')) return '/assets/social/spotify.svg';
  if (id === 'youtube-music' || platform.includes('youtube')) return '/assets/social/youtube-music.svg';
  if (id === 'github' || platform.includes('github')) return '/assets/social/github.svg';
  if (id === 'chess' || platform.includes('chess')) return '/assets/games/chess-com.svg';
  if (id === 'bgmi' || platform.includes('bgmi')) return '/assets/games/bgmi.svg';
  if (id === 'discord' || platform.includes('discord')) return '/assets/social/discord.svg';
  if (profile?.avatarUrl && profile.avatarUrl.startsWith('/assets/')) return profile.avatarUrl;
  return '/assets/sections/social-preview.svg';
}

export const SocialPage: React.FC = () => {
  const { isAdmin } = useAuth();
  const [profiles, setProfiles] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedProfileId, setSelectedProfileId] = useState<string>('instagram');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Profile Management Modal state
  const [showManageModal, setShowManageModal] = useState(false);
  const [formPlatform, setFormPlatform] = useState('');
  const [formCategory, setFormCategory] = useState('social');
  const [formUsername, setFormUsername] = useState('');
  const [formUrl, setFormUrl] = useState('');
  const [formBio, setFormBio] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetch('/api/social/profiles')
      .then(r => r.json())
      .then(d => {
        if (Array.isArray(d.profiles)) setProfiles(d.profiles);
        if (d.categories) setCategories(d.categories);
      })
      .catch(console.error);
  }, []);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAddOrEditProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formPlatform.trim() || !formUrl.trim()) return;
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/social/profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform: formPlatform,
          category: formCategory,
          username: formUsername,
          profileUrl: formUrl,
          bio: formBio,
          integrationLevel: 'A'
        })
      });
      const data = await res.json();
      if (data.success) {
        const refresh = await fetch('/api/social/profiles').then(r => r.json());
        if (refresh.profiles) setProfiles(refresh.profiles);
        setShowManageModal(false);
        setFormPlatform('');
        setFormUrl('');
        setFormUsername('');
        setFormBio('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleVisibility = async (id: string, currentVisible: boolean) => {
    if (!isAdmin) return;
    try {
      await fetch(`/api/social/profiles/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visible: !currentVisible })
      });
      setProfiles(profiles.map(p => p.id === id ? { ...p, visible: !p.visible } : p));
    } catch (err) {
      console.error(err);
    }
  };

  const filteredProfiles = profiles.filter(p => {
    if (activeCategory === 'all') return true;
    return p.category === activeCategory;
  });

  const activeProfile =
    filteredProfiles.find(p => p.id === selectedProfileId) ||
    filteredProfiles[0] ||
    profiles[0];

  const selectedSocialIndex = Math.max(
    0,
    filteredProfiles.findIndex(p => p.id === activeProfile?.id),
  );

  const socialCoverflowSlides: CoverflowSlide[] = filteredProfiles.map((p) => ({
    id: p.id,
    src: resolveSocialGraphic(p),
    fallbackSrc: '/assets/sections/social-preview.svg',
    alt: `${p.platform} (${p.username})`,
    title: p.platform,
    subtitle: String(p.username || '').startsWith('@') || String(p.username || '').startsWith('UID')
      ? p.username
      : `@${p.username}`,
    badge: p.isVerified ? `Level ${p.integrationLevel || 'A'}` : 'Configurable',
    accentColor: p.accentColor || '#a855f7',
    category: 'social',
  }));

  return (
    <PageTransition>
      <div className="space-y-8 animate-in fade-in duration-300">
        
        {/* Header Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white/[0.02] border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl backdrop-blur-md">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-mono mb-3">
              <Share2 className="size-3.5" />
              <span>Digital Footprint & Connections</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Social & Platforms
            </h1>
            <p className="text-neutral-400 text-sm mt-1">
              Explore my authentic profiles, developer repositories, Spotify playlists, and gaming identities.
            </p>
          </div>

          {isAdmin && (
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setShowManageModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-white text-xs font-semibold transition cursor-pointer"
              >
                <Plus className="size-3.5" />
                <span>Manage Profiles</span>
              </button>
            </div>
          )}
        </div>

        {/* Integration Levels Legend Pill Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-[#0b0e18]/80 border border-white/10 shadow-lg flex items-start gap-3">
            <div className="size-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
              <ShieldCheck className="size-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Level A · Canonical Links</div>
              <p className="text-[11px] text-neutral-400 mt-0.5 leading-relaxed">
                Direct verified HTTPS destination without credentials. Safe new-tab routing.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#0b0e18]/80 border border-white/10 shadow-lg flex items-start gap-3">
            <div className="size-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
              <Sparkles className="size-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Level B · Public Embeds</div>
              <p className="text-[11px] text-neutral-400 mt-0.5 leading-relaxed">
                Official interactive Spotify playlists & YouTube players embedded directly.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#0b0e18]/80 border border-white/10 shadow-lg flex items-start gap-3">
            <div className="size-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0 mt-0.5">
              <Lock className="size-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Level C · OAuth Status</div>
              <p className="text-[11px] text-neutral-400 mt-0.5 leading-relaxed">
                Private personal feeds isolated. Token refresh isolated on backend.
              </p>
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-4">
          {[
            { id: 'all', label: 'All Platforms', icon: Layers },
            { id: 'social', label: 'Social', icon: Share2 },
            { id: 'music', label: 'Music', icon: Music },
            { id: 'developer', label: 'Developer', icon: Code2 },
            { id: 'gaming', label: 'Gaming', icon: Gamepad2 },
            { id: 'community', label: 'Community', icon: Users },
          ].map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30 border border-purple-400/40'
                    : 'bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white border border-white/5'
                }`}
              >
                <Icon className="size-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Social & Platforms Coverflow Carousel (Distinct Softer Variant) + Compact Selected-Profile Detail Panel */}
        {activeProfile && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center p-5 sm:p-6 rounded-3xl bg-[#080b14]/90 border border-white/10 shadow-xl relative overflow-hidden">
            <div
              className="pointer-events-none absolute -top-24 left-1/4 w-[360px] h-[180px] rounded-full blur-3xl opacity-15 transition-colors duration-500"
              style={{ backgroundColor: activeProfile.accentColor || '#a855f7' }}
            />

            {/* Left 7 Cols: Softer, Cleaner Social Coverflow */}
            <div className="lg:col-span-7">
              <div className="flex items-center justify-between mb-1 px-1">
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                    <Share2 className="size-4 text-purple-400" />
                    <span>Platform Identity Carousel</span>
                  </h2>
                  <p className="text-[11px] text-neutral-400">
                    Click a platform card, drag, or use arrow keys to inspect profile details
                  </p>
                </div>
                <span className="text-[11px] font-mono text-neutral-400">
                  {filteredProfiles.length} {filteredProfiles.length === 1 ? 'Platform' : 'Platforms'}
                </span>
              </div>

              <CoverflowCarousel
                slides={socialCoverflowSlides}
                selectedIndex={selectedSocialIndex}
                onSelect={(idx) => {
                  if (filteredProfiles[idx]) {
                    setSelectedProfileId(filteredProfiles[idx].id);
                  }
                }}
                variant="social"
                rotate={24}
                depth={0.36}
                perspective={4.2}
                falloff={0.68}
                fade={0.12}
                cardWidth="clamp(150px, 18vw, 210px)"
                gap={0.14}
                loop={filteredProfiles.length > 2}
                showNavigation={filteredProfiles.length > 1}
                showPagination={filteredProfiles.length > 1}
                showCardOverlay={true}
                label="Social and platform profiles carousel"
              />
            </div>

            {/* Right 5 Cols: Compact Selected-Profile Detail Panel */}
            <div className="lg:col-span-5">
              <div
                className="p-5 sm:p-6 rounded-2xl bg-[#0c101d]/95 border transition-colors duration-300 space-y-4 shadow-lg"
                style={{
                  borderColor: `${activeProfile.accentColor || '#a855f7'}45`,
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="size-12 rounded-xl overflow-hidden border shrink-0 bg-black/50"
                      style={{ borderColor: `${activeProfile.accentColor || '#a855f7'}60` }}
                    >
                      <SmartImage
                        src={resolveSocialGraphic(activeProfile)}
                        fallbackSrc="/assets/sections/social-preview.svg"
                        alt={activeProfile.platform}
                        category="social"
                        accentColor={activeProfile.accentColor}
                        containerClassName="size-full"
                        className="size-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-black text-white truncate">
                          {activeProfile.platform}
                        </h3>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded-full border font-semibold ${
                            activeProfile.isVerified
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                              : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                          }`}
                        >
                          {activeProfile.isVerified ? 'Verified' : 'Unverified'}
                        </span>
                      </div>
                      <div className="text-xs font-mono text-neutral-300 truncate mt-0.5">
                        {activeProfile.displayName} ·{' '}
                        <span className="text-cyan-300">{activeProfile.username}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-neutral-300 leading-relaxed">
                  {activeProfile.bio}
                </p>

                {activeProfile.historicalStats &&
                  Object.keys(activeProfile.historicalStats).length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                      {Object.entries(activeProfile.historicalStats).map(([k, v]: any) => (
                        <div
                          key={k}
                          className="p-2.5 rounded-xl bg-black/50 border border-white/10 text-center"
                        >
                          <div className="text-xs font-bold text-white font-mono truncate">
                            {String(v)}
                          </div>
                          <div className="text-[10px] font-mono text-neutral-400 uppercase truncate mt-0.5">
                            {k}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2.5 text-xs">
                  <button
                    type="button"
                    onClick={() =>
                      handleCopy(
                        activeProfile.profileUrl && activeProfile.profileUrl !== '#'
                          ? activeProfile.profileUrl
                          : activeProfile.username,
                        `sel-${activeProfile.id}`,
                      )
                    }
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white font-mono transition cursor-pointer"
                  >
                    {copiedId === `sel-${activeProfile.id}` ? (
                      <>
                        <Check className="size-3.5 text-emerald-400" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="size-3.5" />
                        <span>Copy Handle / Link</span>
                      </>
                    )}
                  </button>

                  {activeProfile.profileUrl &&
                  activeProfile.profileUrl.startsWith('http') ? (
                    <a
                      href={activeProfile.profileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-white transition shadow-lg hover:brightness-110"
                      style={{
                        backgroundColor: activeProfile.accentColor || '#7c3aed',
                      }}
                    >
                      <span>Open {activeProfile.platform}</span>
                      <ExternalLink className="size-3.5" />
                    </a>
                  ) : activeProfile.profileUrl &&
                    activeProfile.profileUrl.startsWith('/') ? (
                    <a
                      href={activeProfile.profileUrl}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold transition shadow-lg"
                    >
                      <span>Open {activeProfile.platform} Deck</span>
                      <ExternalLink className="size-3.5" />
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowManageModal(true)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/40 text-indigo-300 hover:text-white font-bold transition cursor-pointer"
                    >
                      <span>Configure Profile</span>
                      <Edit3 className="size-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Platform Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* 1. INSTAGRAM PROFILE CARD */}
          {(activeCategory === 'all' || activeCategory === 'social') && (
            <BorderBeamCard duration={12} className="h-full">
              <div className="p-6 h-full flex flex-col justify-between space-y-5">
                <div>
                  {/* Header: Platform + Level Pill */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-xl bg-gradient-to-tr from-[#fd5949] via-[#d6249f] to-[#285AEB] p-[2px] shadow-[0_0_15px_rgba(225,48,108,0.3)]">
                        <div className="size-full bg-black/90 rounded-[10px] flex items-center justify-center text-white">
                          <InstagramIcon className="size-5" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white tracking-tight">Instagram</h3>
                        <span className="text-[10px] font-mono text-pink-400 uppercase">Social Profile</span>
                      </div>
                    </div>

                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 font-medium">
                      Level A
                    </span>
                  </div>

                  {/* Profile Identity */}
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2 mb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-bold text-white flex items-center gap-1.5">
                          <span>आयुष्मान</span>
                          <span className="text-xs text-neutral-400 font-mono">(@wtfk1yo)</span>
                        </div>
                        <p className="text-xs text-neutral-300 mt-1 italic">
                          "hey there! i am using instagram."
                        </p>
                      </div>
                    </div>

                    {/* Screenshot Historical Reference Stat Strip */}
                    <div className="pt-3 border-t border-white/5 grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="p-1.5 rounded-lg bg-black/40 border border-white/5">
                        <div className="text-white font-bold font-mono">17</div>
                        <div className="text-[10px] text-neutral-500 uppercase">Posts</div>
                      </div>
                      <div className="p-1.5 rounded-lg bg-black/40 border border-white/5">
                        <div className="text-white font-bold font-mono">72</div>
                        <div className="text-[10px] text-neutral-500 uppercase">Followers</div>
                      </div>
                      <div className="p-1.5 rounded-lg bg-black/40 border border-white/5">
                        <div className="text-white font-bold font-mono">41</div>
                        <div className="text-[10px] text-neutral-500 uppercase">Following</div>
                      </div>
                    </div>
                    <div className="text-[10px] text-neutral-500 font-mono text-center pt-1">
                      Historical reference from captured profile
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between gap-3 border-t border-white/5 text-xs">
                  <button
                    onClick={() => handleCopy('https://www.instagram.com/wtfk1yo/', 'instagram')}
                    className="flex items-center gap-1.5 text-neutral-400 hover:text-white transition font-mono"
                  >
                    {copiedId === 'instagram' ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
                    <span>{copiedId === 'instagram' ? 'Copied' : 'Copy URL'}</span>
                  </button>

                  <a
                    href="https://www.instagram.com/wtfk1yo/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#d6249f] to-[#fd5949] text-white font-bold transition shadow-lg hover:brightness-110"
                  >
                    <span>Open Instagram</span>
                    <ExternalLink className="size-3" />
                  </a>
                </div>
              </div>
            </BorderBeamCard>
          )}

          {/* 2. SPOTIFY PROFILE CARD */}
          {(activeCategory === 'all' || activeCategory === 'music') && (
            <SpotlightCard
              enableTilt={true}
              maxTilt={5}
              spotlightColor="rgba(34, 197, 94, 0.22)"
              className="p-6 h-full flex flex-col justify-between space-y-5 bg-[#0b0e18]/85 border-white/10 shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-[#1db954]/20 border border-[#1db954]/40 flex items-center justify-center text-[#1db954] shadow-[0_0_15px_rgba(29,185,84,0.3)]">
                      <Music className="size-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white tracking-tight">Spotify</h3>
                      <span className="text-[10px] font-mono text-emerald-400 uppercase">Music & Audio</span>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 font-medium">
                    Level B (Embeds)
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="size-9 rounded-full overflow-hidden border border-emerald-500/40 shrink-0">
                        <SmartImage
                          src="/assets/music/3kVexA5RqiZJA1hrzv1eNH.jpg"
                          alt="AYushMan Spotify"
                          category="music"
                          containerClassName="size-full"
                          className="size-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">AYushMan</div>
                        <div className="text-[11px] font-mono text-neutral-400">ID: 31r367fhbny2hd3bdbyo5q3vvjlu</div>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-emerald-400 font-bold">7 Playlists</span>
                  </div>

                  <div className="grid grid-cols-4 gap-1.5 pt-1">
                    {[
                      { id: '3kVexA5RqiZJA1hrzv1eNH', title: 'जीवन' },
                      { id: '1ObWCzwKcT96QEqiKbFR5U', title: '"PEAK"' },
                      { id: '6TsUQwBFT8TMKBN72Mo7Zb', title: 'puhNjabi' },
                      { id: '3z97vIfs40HVfqovsgSbGn', title: 'एफ' },
                    ].map((pl) => (
                      <div key={pl.id} className="aspect-square rounded-lg overflow-hidden border border-white/10" title={pl.title}>
                        <SmartImage
                          src={`/assets/music/${pl.id}.jpg`}
                          alt={pl.title}
                          category="music"
                          containerClassName="size-full"
                          className="size-full object-cover"
                        />
                      </div>
                    ))}
                  </div>

                  <p className="text-xs text-neutral-300">
                    Real Spotify playlists: <strong>जीवन</strong>, <strong>"PEAK"</strong>, <strong>puhNjabi</strong>, <strong>एफ</strong>, and focus anthologies.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between gap-3 border-t border-white/5 text-xs">
                <a
                  href="/music"
                  className="text-neutral-400 hover:text-white transition font-semibold"
                >
                  <span>Explore Music Page →</span>
                </a>

                <a
                  href="https://open.spotify.com/user/31r367fhbny2hd3bdbyo5q3vvjlu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1db954] hover:bg-[#1ed760] text-black font-bold transition shadow-lg shadow-emerald-950/40"
                >
                  <span>Open Spotify</span>
                  <ExternalLink className="size-3" />
                </a>
              </div>
            </SpotlightCard>
          )}

          {/* 2B. YOUTUBE MUSIC PROFILE CARD */}
          {(activeCategory === 'all' || activeCategory === 'music') && (
            <SpotlightCard
              enableTilt={true}
              maxTilt={5}
              spotlightColor="rgba(239, 68, 68, 0.22)"
              className="p-6 h-full flex flex-col justify-between space-y-5 bg-[#0b0e18]/85 border-white/10 shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.3)]">
                      <Radio className="size-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white tracking-tight">YouTube Music</h3>
                      <span className="text-[10px] font-mono text-red-400 uppercase">Music Channel & Library</span>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 font-medium">
                    Level A · Verified
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2.5 mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-bold text-white">AYushMan</div>
                      <div className="text-xs font-mono text-red-300">@wtfk1y0</div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-500/15 text-red-300 border border-red-500/30">
                      Official Handle
                    </span>
                  </div>

                  <p className="text-xs text-neutral-300">
                    Official YouTube Music profile for curated mixes, live acoustic sessions, and soundtrack rotation.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between gap-3 border-t border-white/5 text-xs">
                <button
                  onClick={() => handleCopy('https://music.youtube.com/@wtfk1y0', 'yt-music')}
                  className="flex items-center gap-1.5 text-neutral-400 hover:text-white transition font-mono cursor-pointer"
                >
                  {copiedId === 'yt-music' ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
                  <span>{copiedId === 'yt-music' ? 'Copied' : 'Copy URL'}</span>
                </button>

                <a
                  href="https://music.youtube.com/@wtfk1y0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold transition shadow-lg shadow-red-950/40"
                >
                  <span>Open YouTube Music</span>
                  <ExternalLink className="size-3" />
                </a>
              </div>
            </SpotlightCard>
          )}

          {/* 3. DISCORD PROFILE CARD (CONFIGURABLE & UNVERIFIED CLEAR STATUS) */}
          {(activeCategory === 'all' || activeCategory === 'community') && (
            <SpotlightCard
              enableTilt={true}
              maxTilt={5}
              spotlightColor="rgba(88, 101, 242, 0.22)"
              className="p-6 h-full flex flex-col justify-between space-y-5 bg-[#0b0e18]/85 border-white/10 shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-[#5865F2]/20 border border-[#5865F2]/40 flex items-center justify-center text-[#5865F2] shadow-[0_0_15px_rgba(88,101,242,0.3)]">
                      <DiscordIcon className="size-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white tracking-tight">Discord</h3>
                      <span className="text-[10px] font-mono text-indigo-400 uppercase">Community Hub</span>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 font-medium">
                    Unverified
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2.5 mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-neutral-400 font-mono">Reference Display:</div>
                      <div className="text-sm font-bold text-white font-mono">pareshamatcroyar</div>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-amber-950/20 border border-amber-500/25 flex items-start gap-2 text-xs text-amber-200">
                    <AlertCircle className="size-4 shrink-0 mt-0.5 text-amber-400" />
                    <span>Missing account confirmation. Supply Discord User ID / Tag or permanent Server Invite link to verify.</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between gap-3 border-t border-white/5 text-xs">
                <button
                  onClick={() => handleCopy('pareshamatcroyar', 'discord')}
                  className="flex items-center gap-1.5 text-neutral-400 hover:text-white transition font-mono"
                >
                  {copiedId === 'discord' ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
                  <span>{copiedId === 'discord' ? 'Copied' : 'Copy Tag'}</span>
                </button>

                <button
                  onClick={() => setShowManageModal(true)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#5865F2]/20 hover:bg-[#5865F2]/30 border border-[#5865F2]/40 text-[#5865F2] hover:text-white font-bold transition"
                >
                  <span>Configure Account</span>
                  <Edit3 className="size-3" />
                </button>
              </div>
            </SpotlightCard>
          )}

          {/* 4. GITHUB DEVELOPER PROFILE */}
          {(activeCategory === 'all' || activeCategory === 'developer') && (
            <SpotlightCard
              enableTilt={true}
              maxTilt={5}
              spotlightColor="rgba(255, 255, 255, 0.15)"
              className="p-6 h-full flex flex-col justify-between space-y-5 bg-[#0b0e18]/85 border-white/10 shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white">
                      <GithubIcon className="size-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white tracking-tight">GitHub</h3>
                      <span className="text-[10px] font-mono text-neutral-400 uppercase">Code & Systems</span>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 font-medium">
                    Level A
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2 mb-4">
                  <div className="text-sm font-bold text-white">@Aayushman-debug</div>
                  <p className="text-xs text-neutral-300">
                    Full-Stack systems, algorithmic C++ toolsets, and open-source software repositories.
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {['C++', 'TypeScript', 'React', 'Node.js', 'Express', 'MySQL'].map((tech) => (
                      <span key={tech} className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-neutral-300 border border-white/5">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between gap-3 border-t border-white/5 text-xs">
                <a
                  href="/developer"
                  className="text-neutral-400 hover:text-white transition font-semibold"
                >
                  <span>View Projects →</span>
                </a>

                <a
                  href="https://github.com/Aayushman-debug"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-black font-bold transition hover:bg-neutral-200"
                >
                  <span>Open GitHub</span>
                  <ExternalLink className="size-3" />
                </a>
              </div>
            </SpotlightCard>
          )}

          {/* 5. GAMING IDENTITIES (BGMI, CHESS.COM, CLASH ROYALE, COC) */}
          {(activeCategory === 'all' || activeCategory === 'gaming') && (
            <HoloCard
              maxTilt={6}
              holoColor="rgba(245, 158, 11, 0.25)"
              className="p-6 h-full flex flex-col justify-between space-y-5"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                      <Gamepad2 className="size-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white tracking-tight">Gaming Profiles</h3>
                      <span className="text-[10px] font-mono text-amber-400 uppercase">Public profiles</span>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 font-medium">
                    Verified Stats
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between text-xs gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="size-9 rounded-lg overflow-hidden border border-amber-500/30 shrink-0">
                        <SmartImage
                          src="/assets/games/bgmi.svg"
                          alt="BGMI"
                          category="gaming"
                          containerClassName="size-full"
                          className="size-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-white truncate">BGMI</div>
                        <div className="text-[11px] font-mono text-cyan-300 truncate">Public gaming profile</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded font-bold shrink-0">
                      View
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between text-xs gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="size-9 rounded-lg overflow-hidden border border-emerald-500/30 shrink-0">
                        <SmartImage
                          src="/assets/games/chess-com.svg"
                          alt="Chess.com"
                          category="gaming"
                          containerClassName="size-full"
                          className="size-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-white truncate">Chess.com</div>
                        <div className="text-[11px] font-mono text-emerald-300 truncate">Public gaming profile</div>
                      </div>
                    </div>
                    <a
                      href="https://www.chess.com/member/nerfedayushhhman"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/25 px-2 py-0.5 rounded shrink-0"
                    >
                      Profile ↗
                    </a>
                  </div>

                  <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between text-xs gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="size-9 rounded-lg overflow-hidden border border-blue-500/30 shrink-0">
                        <SmartImage
                          src="/assets/games/clash-royale.svg"
                          alt="Clash Royale"
                          category="gaming"
                          containerClassName="size-full"
                          className="size-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-white truncate">Clash Royale &amp; Clash of Clans</div>
                        <div className="text-[11px] font-mono text-sky-300 truncate">Public gaming profiles</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded shrink-0">
                      Explore
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between gap-3 border-t border-white/5 text-xs">
                <span className="text-neutral-400">Public gaming profiles</span>

                <a
                  href="/gaming"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 hover:text-white font-bold transition"
                >
                  <span>Holo Card Deck</span>
                  <ExternalLink className="size-3" />
                </a>
              </div>
            </HoloCard>
          )}

          {/* 6. EXTENSIBLE CONFIGURABLE SLOTS (LINKEDIN, X, ETC) */}
          {(activeCategory === 'all' || activeCategory === 'developer') && (
            <div className="p-6 rounded-2xl bg-white/[0.015] border border-dashed border-white/15 flex flex-col justify-between space-y-5">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                      <Globe className="size-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white tracking-tight">LinkedIn & More</h3>
                      <span className="text-[10px] font-mono text-neutral-500 uppercase">Configurable Slot</span>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-neutral-400 font-medium">
                    Awaiting URL
                  </span>
                </div>

                <p className="text-xs text-neutral-400 leading-relaxed mb-4">
                  Add professional LinkedIn profile, YouTube channels, X/Twitter, Steam, or Telegram to expand this hub anytime.
                </p>
              </div>

              <button
                onClick={() => setShowManageModal(true)}
                className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <Plus className="size-3.5" />
                <span>Configure Additional Profile</span>
              </button>
            </div>
          )}

        </div>

        {/* Profile Management Interface Modal */}
        {showManageModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
            <div className="w-full max-w-lg rounded-2xl bg-[#0c101d] border border-white/15 p-6 shadow-2xl space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Profile Management Hub</h3>
                  <p className="text-xs text-neutral-400">Configure canonical URLs and visibility</p>
                </div>
                <button
                  onClick={() => setShowManageModal(false)}
                  className="p-1 rounded-lg text-neutral-400 hover:text-white"
                >
                  <X className="size-4" />
                </button>
              </div>

              <form onSubmit={handleAddOrEditProfile} className="space-y-4 text-xs">
                <div>
                  <label className="block text-neutral-300 font-medium mb-1">Platform Name *</label>
                  <input
                    type="text"
                    required
                    value={formPlatform}
                    onChange={(e) => setFormPlatform(e.target.value)}
                    placeholder="e.g. LinkedIn, Twitter / X, YouTube..."
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-neutral-300 font-medium mb-1">Category</label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none"
                    >
                      <option value="social">Social</option>
                      <option value="developer">Developer</option>
                      <option value="music">Music</option>
                      <option value="gaming">Gaming</option>
                      <option value="community">Community</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-neutral-300 font-medium mb-1">Username / Handle</label>
                    <input
                      type="text"
                      value={formUsername}
                      onChange={(e) => setFormUsername(e.target.value)}
                      placeholder="@username or handle"
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-neutral-300 font-medium mb-1">Canonical Profile URL *</label>
                  <input
                    type="url"
                    required
                    value={formUrl}
                    onChange={(e) => setFormUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-neutral-300 font-medium mb-1">Bio / Role Description</label>
                  <textarea
                    rows={2}
                    value={formBio}
                    onChange={(e) => setFormBio(e.target.value)}
                    placeholder="Brief description or focus..."
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowManageModal(false)}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 font-medium cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold shadow-lg shadow-purple-600/30 cursor-pointer"
                  >
                    {isSubmitting ? 'Saving...' : 'Save Profile'}
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

export default SocialPage;
