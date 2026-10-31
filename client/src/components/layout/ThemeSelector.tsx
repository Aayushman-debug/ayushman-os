import React, { useEffect, useRef, useState } from 'react';
import { Palette, Check } from 'lucide-react';
import { THEMES } from '@/themes/themeConfig';
import { usePortfolioTheme } from '@/themes/usePortfolioTheme';

export const ThemeSelector: React.FC = () => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const { theme, setTheme } = usePortfolioTheme();

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <div className="theme-selector relative" ref={rootRef}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={`Choose visual theme. Current theme: ${THEMES.find((item) => item.id === theme)?.name}`}
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-neutral-200 transition hover:border-white/25 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-400"
      >
        <Palette className="size-3.5" />
        <span className="hidden sm:inline">Theme</span>
      </button>

      {open && (
        <div
          className="theme-picker absolute right-0 top-[calc(100%+0.75rem)] z-[70] w-[min(21rem,calc(100vw-2rem))] rounded-2xl border border-white/10 bg-[#0b0e18] p-3 shadow-2xl"
          role="dialog"
          aria-label="Choose a theme"
        >
          <p className="px-2 pb-2 text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-500">Choose your experience</p>
          <div
            className="grid grid-cols-2 gap-2"
            role="radiogroup"
            aria-label="Portfolio themes"
            onKeyDown={(event) => {
              if (!['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp'].includes(event.key)) return;
              event.preventDefault();
              const options = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="radio"]'));
              const currentIndex = options.indexOf(document.activeElement as HTMLButtonElement);
              if (currentIndex < 0) return;
              const direction = event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1 : -1;
              const next = options[(currentIndex + direction + options.length) % options.length];
              const nextTheme = THEMES.find((item) => item.id === next.dataset.themeId);
              next.focus();
              if (nextTheme) setTheme(nextTheme.id);
            }}
          >
            {THEMES.map((item) => {
              const active = theme === item.id;
              return (
                <button
                  key={item.id}
                  data-theme-id={item.id}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => {
                    setTheme(item.id);
                    setOpen(false);
                    triggerRef.current?.focus();
                  }}
                  className={`theme-option group flex min-h-16 items-center gap-2.5 rounded-xl border p-2 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-400 ${
                    active ? 'border-purple-400/70 bg-purple-500/10' : 'border-white/5 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.05]'
                  }`}
                >
                  <span className="theme-preview flex h-10 w-10 shrink-0 flex-col justify-end gap-1 overflow-hidden rounded-lg border border-white/15 p-1.5" style={{ backgroundColor: item.preview[0] }}>
                    <span className="h-1.5 w-5 rounded-full" style={{ backgroundColor: item.preview[1] }} />
                    <span className="h-1.5 w-7 rounded-full" style={{ backgroundColor: item.preview[2], opacity: 0.85 }} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-xs font-semibold text-white">{item.name}</span>
                    <span className="mt-0.5 block text-[9px] font-mono uppercase tracking-wider text-neutral-500">{active ? 'Active' : 'Preview'}</span>
                  </span>
                  {active && <Check aria-hidden="true" className="size-4 shrink-0 text-purple-300" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeSelector;
