/**
 * AvatarCreatorModal.tsx — Roblox Bloxburg / Brookhaven Inspired Avatar Customizer
 *
 * Provides a live 3D character turntable preview and responsive controls:
 * - Ready-to-wear Presets (AYushMan Dev, Explorer, Gamer, Ronin, Musician)
 * - Skin Tones & Face Expressions
 * - Hairstyles & Hair Colors
 * - Top Styles & Custom Colors
 * - Bottom Styles & Custom Colors
 * - Wearable Accessories (Headphones, Backpack, Katana)
 * - Single source of truth with draft vs saved state
 * - Full localStorage persistence and in-world real-time updates
 */
import React, { useState, useEffect, Suspense, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useIslandStore } from './useIslandStore';
import {
  AvatarConfig,
  AVATAR_PRESETS,
  DEFAULT_AVATAR,
  SkinTone,
  Hairstyle,
  HairColor,
  FaceExpression,
  TopOutfit,
  BottomOutfit,
  Accessory,
} from './avatarTypes';
import RobloxAvatarMesh from './RobloxAvatarMesh';
import { islandAudio } from './islandAudio';
import {
  Sparkles,
  Smile,
  Scissors,
  Shirt,
  Footprints,
  Shield,
  Check,
  RotateCcw,
  X,
} from 'lucide-react';

/* ─── 3D Avatar Turntable Preview ─────────────────────────────────── */
function AvatarPreviewScene({ avatar }: { avatar: AvatarConfig }) {
  return (
    <>
      <ambientLight intensity={0.95} />
      <directionalLight position={[3, 5, 4]} intensity={1.4} castShadow />
      <directionalLight position={[-3, 2, -2]} intensity={0.5} />

      {/* Orbit controls allow free 360 degree drag review without moving the world */}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={1.5}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 1.75}
        target={[0, 0.95, 0]}
      />

      <group position={[0, -0.05, 0]}>
        <RobloxAvatarMesh avatar={avatar} />

        {/* Soft Circular Ground Pedestal */}
        <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <circleGeometry args={[1.1, 32]} />
          <meshBasicMaterial color="#0284c7" opacity={0.18} transparent />
        </mesh>
        <mesh position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <circleGeometry args={[1.18, 32]} />
          <meshBasicMaterial color="#ffffff" opacity={0.4} transparent />
        </mesh>
      </group>
    </>
  );
}

/* ─── Options Data ─────────────────────────────────────────────────── */
const SKIN_TONES: { color: SkinTone; label: string }[] = [
  { color: '#fcd34d', label: 'Classic Yellow' },
  { color: '#fed7aa', label: 'Warm Fair' },
  { color: '#d97706', label: 'Golden Bronze' },
  { color: '#78350f', label: 'Deep Amber' },
  { color: '#6ee7b7', label: 'Minty Neon' },
  { color: '#e0e7ff', label: 'Cloud Lilac' },
];

const HAIRSTYLES: { id: Hairstyle; label: string; icon: string }[] = [
  { id: 'parted', label: 'Side Part', icon: '🧑' },
  { id: 'spiky', label: 'Anime Spikes', icon: '⚡' },
  { id: 'beanie', label: 'Cozy Beanie', icon: '🧢' },
  { id: 'cap', label: 'Snapback Cap', icon: '🧢' },
  { id: 'clean', label: 'Clean Buzz', icon: '✂️' },
];

const HAIR_COLORS: { color: HairColor; label: string }[] = [
  { color: '#3e2723', label: 'Cocoa Brown' },
  { color: '#0f172a', label: 'Midnight Black' },
  { color: '#fef08a', label: 'Golden Blonde' },
  { color: '#dc2626', label: 'Crimson Red' },
  { color: '#06b6d4', label: 'Ocean Cyan' },
  { color: '#e2e8f0', label: 'Platinum Silver' },
];

const FACES: { id: FaceExpression; label: string; emoji: string }[] = [
  { id: 'smile', label: 'Cheerful Smile', emoji: '😊' },
  { id: 'shades', label: 'Cool Shades', emoji: '😎' },
  { id: 'wink', label: 'Playful Wink', emoji: '😉' },
  { id: 'smirk', label: 'Sharp Smirk', emoji: '😏' },
  { id: 'chill', label: 'Cozy Chill', emoji: '😌' },
];

const TOPS: { id: TopOutfit; label: string; desc: string }[] = [
  { id: 'hoodie', label: 'Island Hoodie', desc: 'Relaxed comfy pullover' },
  { id: 'polo', label: 'Summer Polo', desc: 'Crisp buttoned collar' },
  { id: 'varsity', label: 'Varsity Jacket', desc: 'Sporty dual-tone stripes' },
  { id: 'tee', label: 'Graphic Tee', desc: 'Minimal clean block fit' },
  { id: 'suit', label: 'Blazer Suit', desc: 'Sharp formal lapel' },
];

const TOP_COLORS = [
  { color: '#0284c7', label: 'Ocean Blue' },
  { color: '#ea580c', label: 'Sunset Orange' },
  { color: '#10b981', label: 'Palm Emerald' },
  { color: '#7c3aed', label: 'Royal Purple' },
  { color: '#dc2626', label: 'Crimson Red' },
  { color: '#0f172a', label: 'Jet Black' },
  { color: '#f8fafc', label: 'Clean White' },
  { color: '#f59e0b', label: 'Warm Amber' },
];

const BOTTOMS: { id: BottomOutfit; label: string; desc: string }[] = [
  { id: 'navy', label: 'Classic Slacks', desc: 'Clean straight-cut slacks' },
  { id: 'jeans', label: 'Denim Jeans', desc: 'Rugged washed blue denim' },
  { id: 'cargo', label: 'Expedition Cargo', desc: 'Tactical pockets fit' },
  { id: 'shorts', label: 'Beach Shorts', desc: 'Sunny tropical knee shorts' },
  { id: 'trackpants', label: 'Track Pants', desc: 'Athletic white side stripe' },
];

const BOTTOM_COLORS = [
  { color: '#1e3a8a', label: 'Deep Navy' },
  { color: '#1e40af', label: 'Denim Blue' },
  { color: '#334155', label: 'Slate Grey' },
  { color: '#78350f', label: 'Khaki Brown' },
  { color: '#0f172a', label: 'Midnight Black' },
  { color: '#f8fafc', label: 'Snow White' },
];

const ACCESSORIES: { id: Accessory; label: string; emoji: string; desc: string }[] = [
  { id: 'none', label: 'None', emoji: '✨', desc: 'No active gear' },
  { id: 'headphones', label: 'Pro Headphones', emoji: '🎧', desc: 'Studio audio headset' },
  { id: 'backpack', label: 'Island Backpack', emoji: '🎒', desc: 'Explorer hiking bag' },
  { id: 'sword', label: 'Ronin Katana', emoji: '⚔️', desc: 'Back-sheathed curved blade' },
];

type TabId = 'presets' | 'face' | 'hair' | 'top' | 'bottom' | 'accessories';

export default function AvatarCreatorModal() {
  const {
    isCustomizerOpen,
    setCustomizerOpen,
    avatar,
    saveAvatar,
  } = useIslandStore();

  const [activeTab, setActiveTab] = useState<TabId>('presets');
  // Local draft avatar: changes preview immediately, but committed only on Save & Spawn
  const [draftAvatar, setDraftAvatar] = useState<AvatarConfig>(avatar);

  // Sync draft with current saved store avatar whenever opened
  useEffect(() => {
    if (isCustomizerOpen) {
      setDraftAvatar(avatar);
    }
  }, [isCustomizerOpen, avatar]);

  // Reliable cancel / close handler: discards pending draft and closes modal
  const handleCancel = useCallback(() => {
    islandAudio.playFootstep();
    setCustomizerOpen(false);
  }, [setCustomizerOpen]);

  // Reliable save handler: validates and persists draft avatar
  const handleSaveAndSpawn = useCallback(() => {
    saveAvatar(draftAvatar);
  }, [draftAvatar, saveAvatar]);

  // Reset handler: resets draft to default appearance
  const handleReset = useCallback(() => {
    setDraftAvatar({ ...DEFAULT_AVATAR });
    islandAudio.playChime(440);
  }, []);

  // Update a single draft property
  const updateDraft = (patch: Partial<AvatarConfig>) => {
    setDraftAvatar((prev) => ({ ...prev, ...patch }));
  };

  // Keyboard shortcut listener for Escape
  useEffect(() => {
    if (!isCustomizerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        handleCancel();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isCustomizerOpen, handleCancel]);

  if (!isCustomizerOpen) return null;

  return (
    <div
      onClick={handleCancel}
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/65 backdrop-blur-md p-3 sm:p-6 font-sans select-none pointer-events-auto animate-fadeIn"
    >
      {/* Outer Modal Container */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white rounded-3xl shadow-2xl border-4 border-amber-300 max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden text-slate-800 pointer-events-auto"
      >
        {/* ── Header ─────────────────────────────────────────────── */}
        <div className="px-6 py-3.5 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-300 flex items-center justify-between border-b-2 border-amber-200">
          <div className="flex items-center gap-3">
            <span className="text-2xl p-1.5 bg-white/70 rounded-xl shadow-sm">👕</span>
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-wide flex items-center gap-2">
                AVATAR CREATOR // WARDROBE
              </h2>
              <p className="text-xs font-semibold text-amber-900/80">
                Customize your blocky Roblox identity in Sunshine Island
              </p>
            </div>
          </div>

          <button
            onClick={handleCancel}
            className="w-9 h-9 rounded-full bg-white/80 hover:bg-white text-slate-800 flex items-center justify-center font-bold text-lg shadow-sm transition-transform active:scale-90"
            title="Close Customizer [ESC]"
          >
            <X className="w-5 h-5 text-slate-700" />
          </button>
        </div>

        {/* ── Main Split Content ─────────────────────────────────── */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
          {/* Left Column: 3D Turntable Preview (md: 5 cols) */}
          <div className="md:col-span-5 bg-gradient-to-b from-sky-100 via-sky-50 to-amber-50 relative flex flex-col items-center justify-center p-3 border-b md:border-b-0 md:border-r border-slate-200 min-h-[250px] md:min-h-0">
            <div className="w-full h-full relative">
              <Suspense
                fallback={
                  <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs font-bold animate-pulse">
                    GENERATING 3D AVATAR...
                  </div>
                }
              >
                <Canvas
                  camera={{ position: [0, 1.1, 2.7], fov: 36 }}
                  shadows
                  gl={{ antialias: true }}
                >
                  <AvatarPreviewScene avatar={draftAvatar} />
                </Canvas>
              </Suspense>

              {/* Drag instruction overlay */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[0.68rem] font-bold text-slate-600 shadow-sm border border-slate-200 pointer-events-none flex items-center gap-1.5">
                <span>🔄</span>
                <span>Drag to rotate 360°</span>
              </div>
            </div>
          </div>

          {/* Right Column: Customizer Controls (md: 7 cols) */}
          <div className="md:col-span-7 flex flex-col overflow-hidden bg-slate-50">
            {/* Category Navigation Tabs */}
            <div className="flex overflow-x-auto p-2 bg-slate-100/80 border-b border-slate-200 gap-1.5 scrollbar-none">
              <TabButton
                active={activeTab === 'presets'}
                onClick={() => setActiveTab('presets')}
                icon={<Sparkles className="w-3.5 h-3.5" />}
                label="Presets"
              />
              <TabButton
                active={activeTab === 'face'}
                onClick={() => setActiveTab('face')}
                icon={<Smile className="w-3.5 h-3.5" />}
                label="Skin & Face"
              />
              <TabButton
                active={activeTab === 'hair'}
                onClick={() => setActiveTab('hair')}
                icon={<Scissors className="w-3.5 h-3.5" />}
                label="Hair"
              />
              <TabButton
                active={activeTab === 'top'}
                onClick={() => setActiveTab('top')}
                icon={<Shirt className="w-3.5 h-3.5" />}
                label="Top"
              />
              <TabButton
                active={activeTab === 'bottom'}
                onClick={() => setActiveTab('bottom')}
                icon={<Footprints className="w-3.5 h-3.5" />}
                label="Bottom"
              />
              <TabButton
                active={activeTab === 'accessories'}
                onClick={() => setActiveTab('accessories')}
                icon={<Shield className="w-3.5 h-3.5" />}
                label="Gear"
              />
            </div>

            {/* Tab Body Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* TAB 1: PRESETS */}
              {activeTab === 'presets' && (
                <div className="space-y-3">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Instant Outfits & Personas
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {AVATAR_PRESETS.map((preset) => {
                      const isSelected =
                        draftAvatar.top === preset.config.top &&
                        draftAvatar.hairColor === preset.config.hairColor &&
                        draftAvatar.skinTone === preset.config.skinTone &&
                        draftAvatar.accessory === preset.config.accessory;

                      return (
                        <button
                          key={preset.id}
                          onClick={() => {
                            setDraftAvatar({ ...preset.config });
                            islandAudio.playChime(659);
                          }}
                          className={`p-3 rounded-2xl text-left border-2 transition-all flex items-center gap-3 ${
                            isSelected
                              ? 'border-amber-400 bg-amber-50 shadow-md ring-2 ring-amber-300'
                              : 'border-slate-200 bg-white hover:border-slate-300 shadow-sm'
                          }`}
                        >
                          <span className="text-2xl p-2 bg-slate-100 rounded-xl">{preset.emoji}</span>
                          <div className="flex-1">
                            <div className="text-xs font-black text-slate-800">{preset.name}</div>
                            <div className="text-[0.68rem] text-slate-500 font-medium">
                              {preset.config.top.toUpperCase()} · {preset.config.accessory.toUpperCase()}
                            </div>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-amber-600" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 2: SKIN & FACE */}
              {activeTab === 'face' && (
                <div className="space-y-4">
                  {/* Skin Tone */}
                  <div>
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-2">
                      Skin Tone
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {SKIN_TONES.map((item) => (
                        <button
                          key={item.color}
                          onClick={() => {
                            updateDraft({ skinTone: item.color });
                            islandAudio.playChime(600);
                          }}
                          className={`flex flex-col items-center p-2 rounded-xl border-2 transition-all ${
                            draftAvatar.skinTone === item.color
                              ? 'border-amber-500 bg-amber-50 ring-2 ring-amber-300'
                              : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                        >
                          <div
                            className="w-7 h-7 rounded-full shadow-inner border border-black/15"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="text-[0.62rem] font-bold text-slate-700 mt-1.5 text-center leading-tight">
                            {item.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Face Expression */}
                  <div>
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-2">
                      Face Expression
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {FACES.map((f) => (
                        <button
                          key={f.id}
                          onClick={() => {
                            updateDraft({ face: f.id });
                            islandAudio.playChime(620);
                          }}
                          className={`p-3 rounded-xl border-2 text-left flex items-center gap-2.5 transition-all ${
                            draftAvatar.face === f.id
                              ? 'border-amber-500 bg-amber-50 ring-2 ring-amber-300'
                              : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                        >
                          <span className="text-2xl">{f.emoji}</span>
                          <span className="text-xs font-bold text-slate-800">{f.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: HAIR */}
              {activeTab === 'hair' && (
                <div className="space-y-4">
                  {/* Hairstyle */}
                  <div>
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-2">
                      Hairstyle
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {HAIRSTYLES.map((h) => (
                        <button
                          key={h.id}
                          onClick={() => {
                            updateDraft({ hairstyle: h.id });
                            islandAudio.playChime(640);
                          }}
                          className={`p-3 rounded-xl border-2 text-left flex items-center gap-2.5 transition-all ${
                            draftAvatar.hairstyle === h.id
                              ? 'border-amber-500 bg-amber-50 ring-2 ring-amber-300'
                              : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                        >
                          <span className="text-xl">{h.icon}</span>
                          <span className="text-xs font-bold text-slate-800">{h.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Hair Color */}
                  <div>
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-2">
                      Hair Color
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {HAIR_COLORS.map((hc) => (
                        <button
                          key={hc.color}
                          onClick={() => {
                            updateDraft({ hairColor: hc.color });
                            islandAudio.playChime(660);
                          }}
                          className={`flex flex-col items-center p-2 rounded-xl border-2 transition-all ${
                            draftAvatar.hairColor === hc.color
                              ? 'border-amber-500 bg-amber-50 ring-2 ring-amber-300'
                              : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                        >
                          <div
                            className="w-7 h-7 rounded-full shadow-inner border border-black/20"
                            style={{ backgroundColor: hc.color }}
                          />
                          <span className="text-[0.62rem] font-bold text-slate-700 mt-1.5 text-center leading-tight">
                            {hc.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: TOP OUTFIT */}
              {activeTab === 'top' && (
                <div className="space-y-4">
                  {/* Style */}
                  <div>
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-2">
                      Top Style
                    </label>
                    <div className="space-y-2">
                      {TOPS.map((t) => (
                        <button
                          key={t.id}
                          onClick={() => {
                            updateDraft({ top: t.id });
                            islandAudio.playChime(680);
                          }}
                          className={`w-full p-2.5 px-3 rounded-xl border-2 text-left flex items-center justify-between transition-all ${
                            draftAvatar.top === t.id
                              ? 'border-amber-500 bg-amber-50 ring-2 ring-amber-300'
                              : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                        >
                          <div>
                            <div className="text-xs font-bold text-slate-800">{t.label}</div>
                            <div className="text-[0.68rem] text-slate-500 font-medium">{t.desc}</div>
                          </div>
                          {draftAvatar.top === t.id && <Check className="w-4 h-4 text-amber-600" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Color */}
                  <div>
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-2">
                      Top Color
                    </label>
                    <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                      {TOP_COLORS.map((tc) => (
                        <button
                          key={tc.color}
                          onClick={() => {
                            updateDraft({ topColor: tc.color });
                            islandAudio.playChime(700);
                          }}
                          title={tc.label}
                          className={`w-9 h-9 rounded-xl border-2 flex items-center justify-center transition-transform active:scale-90 ${
                            draftAvatar.topColor === tc.color
                              ? 'border-amber-500 ring-2 ring-amber-300 scale-105'
                              : 'border-slate-300 hover:border-slate-400'
                          }`}
                          style={{ backgroundColor: tc.color }}
                        >
                          {draftAvatar.topColor === tc.color && (
                            <Check className="w-4 h-4 text-white drop-shadow-md" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: BOTTOM OUTFIT */}
              {activeTab === 'bottom' && (
                <div className="space-y-4">
                  {/* Style */}
                  <div>
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-2">
                      Bottom Style
                    </label>
                    <div className="space-y-2">
                      {BOTTOMS.map((b) => (
                        <button
                          key={b.id}
                          onClick={() => {
                            updateDraft({ bottom: b.id });
                            islandAudio.playChime(720);
                          }}
                          className={`w-full p-2.5 px-3 rounded-xl border-2 text-left flex items-center justify-between transition-all ${
                            draftAvatar.bottom === b.id
                              ? 'border-amber-500 bg-amber-50 ring-2 ring-amber-300'
                              : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                        >
                          <div>
                            <div className="text-xs font-bold text-slate-800">{b.label}</div>
                            <div className="text-[0.68rem] text-slate-500 font-medium">{b.desc}</div>
                          </div>
                          {draftAvatar.bottom === b.id && <Check className="w-4 h-4 text-amber-600" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Color */}
                  <div>
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-2">
                      Bottom Color
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {BOTTOM_COLORS.map((bc) => (
                        <button
                          key={bc.color}
                          onClick={() => {
                            updateDraft({ bottomColor: bc.color });
                            islandAudio.playChime(740);
                          }}
                          title={bc.label}
                          className={`w-9 h-9 rounded-xl border-2 flex items-center justify-center transition-transform active:scale-90 ${
                            draftAvatar.bottomColor === bc.color
                              ? 'border-amber-500 ring-2 ring-amber-300 scale-105'
                              : 'border-slate-300 hover:border-slate-400'
                          }`}
                          style={{ backgroundColor: bc.color }}
                        >
                          {draftAvatar.bottomColor === bc.color && (
                            <Check className="w-4 h-4 text-white drop-shadow-md" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: ACCESSORIES */}
              {activeTab === 'accessories' && (
                <div className="space-y-3">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Equip Island Accessories
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {ACCESSORIES.map((acc) => {
                      const isEquipped = draftAvatar.accessory === acc.id;
                      return (
                        <button
                          key={acc.id}
                          onClick={() => {
                            const nextAcc = isEquipped && acc.id !== 'none' ? 'none' : acc.id;
                            updateDraft({ accessory: nextAcc });
                            islandAudio.playChime(780);
                          }}
                          className={`p-3.5 rounded-2xl border-2 text-left flex items-center gap-3 transition-all ${
                            isEquipped
                              ? 'border-amber-500 bg-amber-50 ring-2 ring-amber-300 shadow-sm'
                              : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                        >
                          <span className="text-2xl p-2 bg-slate-100 rounded-xl">{acc.emoji}</span>
                          <div className="flex-1">
                            <div className="text-xs font-black text-slate-800">{acc.label}</div>
                            <div className="text-[0.68rem] text-slate-500 font-medium">{acc.desc}</div>
                          </div>
                          {isEquipped && <Check className="w-4 h-4 text-amber-600" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Bottom Actions */}
            <div className="p-3.5 bg-white border-t border-slate-200 flex items-center justify-between gap-3">
              <button
                onClick={handleReset}
                className="px-3 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1.5 transition-colors"
                title="Reset avatar to default"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-xs font-bold text-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveAndSpawn}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black text-xs shadow-md transition-transform active:scale-95 flex items-center gap-2"
                >
                  <span>SAVE & SPAWN</span>
                  <span>✨</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Nav Tab Helper Button ─────────────────────────────────────────── */
function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={() => {
        onClick();
        islandAudio.playFootstep();
      }}
      className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
        active
          ? 'bg-amber-400 text-slate-900 shadow-sm'
          : 'bg-white hover:bg-slate-200/80 text-slate-600'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}