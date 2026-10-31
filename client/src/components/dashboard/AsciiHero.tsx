import React, { useState, useEffect } from 'react';
import { 
  Sun, 
  Moon, 
  Sparkles, 
  Zap, 
  Orbit, 
  Clock, 
  Palette,
  Sliders
} from 'lucide-react';
import { AsciiArtCanvas, AsciiTheme, AsciiRenderMode, AsciiAnimStyle } from '../ui/ascii-art-canvas';

interface AsciiHeroProps {
  greeting: string;
  userName: string;
  currentTime: string;
}

const THEMES: { id: AsciiTheme; label: string; icon: any; anim: AsciiAnimStyle }[] = [
  { id: 'sunset', label: 'Sunset', icon: Sun, anim: 'pulse' },
  { id: 'moonlight', label: 'Moonlight', icon: Moon, anim: 'wave' },
  { id: 'starry_night', label: 'Starry Night', icon: Sparkles, anim: 'shimmer' },
  { id: 'cyberpunk', label: 'Cyberpunk', icon: Zap, anim: 'flicker' },
  { id: 'galaxy', label: 'Galaxy', icon: Orbit, anim: 'ripple' },
];

const MODES: { id: AsciiRenderMode; label: string }[] = [
  { id: 'dots', label: 'Dots' },
  { id: 'characters', label: 'Chars' },
  { id: 'pixel', label: 'Pixel' },
  { id: 'matrix', label: 'Matrix' },
  { id: 'braille', label: 'Braille' },
  { id: 'rings', label: 'Rings' },
];

export const AsciiHero: React.FC<AsciiHeroProps> = ({
  greeting,
  userName,
  currentTime,
}) => {
  const [theme, setTheme] = useState<AsciiTheme>(() => {
    return (localStorage.getItem('ayushman_ascii_theme') as AsciiTheme) || 'sunset';
  });

  const [renderMode, setRenderMode] = useState<AsciiRenderMode>(() => {
    return (localStorage.getItem('ayushman_ascii_mode') as AsciiRenderMode) || 'dots';
  });

  const [showStyleMenu, setShowStyleMenu] = useState(false);

  const handleSelectTheme = (t: AsciiTheme) => {
    setTheme(t);
    localStorage.setItem('ayushman_ascii_theme', t);
  };

  const handleSelectMode = (m: AsciiRenderMode) => {
    setRenderMode(m);
    localStorage.setItem('ayushman_ascii_mode', m);
  };

  const currentThemeObj = THEMES.find((t) => t.id === theme) || THEMES[0];

  return (
    <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-[#07090e] h-[280px] sm:h-[320px] flex flex-col justify-between p-6 sm:p-8 transition-all duration-500 group">
      
      {/* Background Animated ASCII Canvas */}
      <div className="absolute inset-0 z-0 opacity-80 group-hover:opacity-95 transition-opacity duration-700">
        <AsciiArtCanvas
          theme={theme}
          renderMode={renderMode}
          animStyle={currentThemeObj.anim}
          cellSize={10}
          contrast={120}
          bloom={true}
          vignette={true}
          interactive={true}
          animSpeed={1}
          animIntensity={50}
        />
      </div>

      {/* Subtle overlay gradient to keep text crisp and legible */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-t from-[#07090e]/90 via-[#07090e]/40 to-transparent pointer-events-none" />

      {/* Top Bar: Time and Compact Theme Pills */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
        {/* Live Clock Pill */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs font-mono text-neutral-300">
          <Clock className="size-3.5 text-neutral-400" />
          <span>{currentTime || '18:00:00'} IST</span>
        </div>

        {/* Minimalist Theme Selector Pills */}
        <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md p-1 rounded-full border border-white/10">
          {THEMES.map((t) => {
            const Icon = t.icon;
            const isSelected = theme === t.id;
            return (
              <button
                key={t.id}
                onClick={() => handleSelectTheme(t.id)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition cursor-pointer ${
                  isSelected
                    ? 'bg-white text-black shadow-md font-semibold'
                    : 'text-neutral-400 hover:text-white hover:bg-white/10'
                }`}
                title={`Switch to ${t.label} theme`}
              >
                <Icon className="size-3.5" />
                <span className="hidden sm:inline">{t.label}</span>
              </button>
            );
          })}

          {/* Render Style Toggle */}
          <div className="relative ml-1">
            <button
              onClick={() => setShowStyleMenu(!showStyleMenu)}
              className={`p-1.5 rounded-full border transition cursor-pointer ${
                showStyleMenu 
                  ? 'bg-purple-600 border-purple-400 text-white' 
                  : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white hover:bg-white/10'
              }`}
              title="Change rendering style"
            >
              <Palette className="size-3.5" />
            </button>

            {/* Dropdown for render modes */}
            {showStyleMenu && (
              <div 
                className="absolute right-0 top-9 z-30 w-36 rounded-2xl bg-[#0b0e18] border border-white/15 p-1.5 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-2.5 py-1 text-[10px] font-mono uppercase text-neutral-500 tracking-wider">
                  Render Style
                </div>
                {MODES.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      handleSelectMode(m.id);
                      setShowStyleMenu(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs transition cursor-pointer flex items-center justify-between ${
                      renderMode === m.id
                        ? 'bg-purple-600/30 text-purple-300 font-semibold'
                        : 'text-neutral-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span>{m.label}</span>
                    {renderMode === m.id && (
                      <span className="size-1.5 rounded-full bg-purple-400" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Content: Personal Heading with Avatar Photo */}
      <div className="relative z-10 max-w-xl flex items-center gap-4">
        <div className="relative size-14 sm:size-16 rounded-2xl overflow-hidden ring-2 ring-purple-500/30 shadow-2xl shrink-0 border border-white/20 bg-black/40">
          <img
            src="/assets/profile/ayushman.jpg"
            alt="AYushMan"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLElement).style.display = 'none';
            }}
          />
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight drop-shadow-md">
              {greeting}, {userName}
            </h1>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-500/20 border border-purple-500/30 text-[10px] font-mono text-purple-300 font-semibold">
              RTU CSE · Sem V
            </span>
          </div>
          <p className="text-xs sm:text-sm text-neutral-300 mt-1 font-normal leading-relaxed drop-shadow">
            Daily command center, syllabus tracking, and engineering workspace.
          </p>
        </div>
      </div>

    </div>
  );
};

export default AsciiHero;
