import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  GraduationCap, 
  CheckCircle2, 
  Film, 
  Music, 
  Gamepad2, 
  Code2, 
  Globe2,
  Bookmark, 
  Settings,
  Menu,
  X,
  Sparkles,
  Lock
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { usePortfolioTheme } from '@/themes/usePortfolioTheme';

export interface NavItem {
  name: string;
  path: string;
  icon: any;
  group: 'core' | 'media' | 'system';
  badge?: string;
  accent?: string;
}

export const navItems: NavItem[] = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, group: 'core', accent: '#06b6d4' },
  { name: 'Academics', path: '/academics', icon: GraduationCap, group: 'core', badge: 'Sem V', accent: '#a855f7' },
  { name: 'Journal', path: '/productivity', icon: CheckCircle2, group: 'core', accent: '#f59e0b' },
  { name: 'Projects', path: '/developer', icon: Code2, group: 'core', badge: '3 Repos', accent: '#6366f1' },
  { name: 'Gaming', path: '/gaming', icon: Gamepad2, group: 'media', badge: '7 IDs', accent: '#10b981' },
  { name: 'Anime & Movies', path: '/entertainment', icon: Film, group: 'media', accent: '#f43f5e' },
  { name: 'Music', path: '/music', icon: Music, group: 'media', badge: '7 Lists', accent: '#1DB954' },
  { name: 'Social & Platforms', path: '/social', icon: Globe2, group: 'system', accent: '#38bdf8' },
  { name: 'Memories', path: '/vault', icon: Bookmark, group: 'system', accent: '#eab308' },
  { name: 'Settings', path: '/settings', icon: Settings, group: 'system', accent: '#94a3b8' },
];

const GROUPS = [
  { key: 'core', label: 'Core Workspace' },
  { key: 'media', label: 'Media & Identity' },
  { key: 'system', label: 'Archive & Links' },
] as const;

const PRIVATE_PATHS = new Set(['/dashboard', '/academics', '/productivity', '/vault', '/settings']);

export const Sidebar: React.FC = () => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const { isAdmin } = useAuth();
  const { theme } = usePortfolioTheme();
  const isVillage = theme === 'village';

  const getItemAccent = (item: NavItem) => {
    if (isVillage) {
      if (item.path === '/entertainment') return '#c86d51';
      if (item.path === '/gaming' || item.path === '/music') return '#2d6a4f';
      if (item.path === '/developer' || item.path === '/dashboard') return '#78350f';
      return '#2d6a4f';
    }
    return item.accent || '#06b6d4';
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-60 flex-col fixed top-16 bottom-0 left-0 border-r border-white/[0.07] bg-[#060811]/95 backdrop-blur-xl px-3 py-4 z-30 overflow-y-auto">
        <div className="space-y-5 flex-1">
          {GROUPS.map((group) => {
            const items = navItems.filter((item) => item.group === group.key);
            return (
              <div key={group.key} className="space-y-1">
                <div className="px-3 pb-1 text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-500">
                  {group.label}
                </div>
                {items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={({ isActive }) =>
                        `group relative flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 ${
                          isActive
                            ? 'bg-white/[0.09] text-white font-semibold shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] border border-white/10'
                            : 'text-neutral-400 hover:text-white hover:bg-white/[0.04] border border-transparent'
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          {isActive && (
                            <span
                              className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full"
                              style={{ backgroundColor: getItemAccent(item) }}
                            />
                          )}
                          <div className="flex items-center gap-3 min-w-0">
                            <Icon
                              className="size-4 shrink-0 transition-colors"
                              style={{ color: isActive ? getItemAccent(item) : undefined }}
                            />
                            <span className="truncate">{item.name}</span>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            {item.badge && (
                              <span
                                className={`text-[9px] font-mono px-1.5 py-0.5 rounded-md border ${
                                  isActive
                                    ? 'bg-white/10 text-white border-white/20'
                                    : 'bg-white/[0.03] text-neutral-500 border-white/5 group-hover:text-neutral-300'
                                }`}
                              >
                                {item.badge}
                              </span>
                            )}
                            {!isAdmin && PRIVATE_PATHS.has(item.path) && (
                              <span
                                className="p-1 rounded bg-purple-500/10 text-purple-300/80 border border-purple-500/20"
                                title="Administrator Area"
                              >
                                <Lock className="size-2.5" />
                              </span>
                            )}
                          </div>
                        </>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Bottom Identity Status Card */}
        <div className="pt-3 border-t border-white/[0.07]">
          <NavLink
            to="/settings"
            className="p-2.5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] hover:border-purple-500/30 transition flex items-center justify-between group"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative size-8 rounded-xl overflow-hidden ring-1 ring-white/10 group-hover:ring-purple-400/50 transition shrink-0">
                <img
                  src="/assets/profile/ayushman.jpg"
                  alt="AYushMan"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-white tracking-tight flex items-center gap-1.5 truncate">
                  <span>AYushMan</span>
                  <span className={`size-1.5 rounded-full ${isAdmin ? 'bg-emerald-400 animate-pulse' : 'bg-cyan-400'} shrink-0`} />
                </div>
                <div className="text-[10px] font-mono text-neutral-400 truncate">
                  {isAdmin ? 'Admin Mode · RTU CSE' : 'Visitor Mode · Portfolio'}
                </div>
              </div>
            </div>
            <Sparkles className="size-3.5 text-cyan-400/70 group-hover:text-cyan-300 shrink-0" />
          </NavLink>
        </div>
      </aside>

      {/* Mobile Bottom Dock */}
      <nav className="lg:hidden fixed bottom-3 left-3 right-3 z-40 bg-[#090c16]/95 backdrop-blur-2xl border border-white/15 rounded-2xl px-2 py-1.5 shadow-[0_16px_40px_rgba(0,0,0,0.8)] flex items-center justify-around">
        {navItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setMobileDrawerOpen(false)}
              className={({ isActive }) =>
                `px-2.5 py-2 rounded-xl flex flex-col items-center gap-1 text-[10px] font-medium transition ${
                  isActive ? 'text-white bg-white/10' : 'text-neutral-400 hover:text-white'
                }`
              }
            >
              <Icon className="size-4" />
              <span className="truncate max-w-[56px]">{item.name.split(' ')[0]}</span>
            </NavLink>
          );
        })}
        <button
          type="button"
          onClick={() => setMobileDrawerOpen((prev) => !prev)}
          className={`px-2.5 py-2 rounded-xl flex flex-col items-center gap-1 text-[10px] font-medium transition cursor-pointer ${
            mobileDrawerOpen ? 'text-cyan-400 bg-cyan-500/15' : 'text-neutral-400 hover:text-white'
          }`}
          aria-label="More navigation sections"
        >
          {mobileDrawerOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          <span>More</span>
        </button>
      </nav>

      {/* Mobile Full Navigation Drawer */}
      {mobileDrawerOpen && (
        <div className="lg:hidden fixed inset-0 z-30 bg-black/75 backdrop-blur-md flex flex-col justify-end pb-24 px-3">
          <div className="p-4 rounded-2xl bg-[#0b0e18] border border-white/15 shadow-2xl space-y-3 max-h-[70vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="text-xs font-mono uppercase tracking-widest text-neutral-400">
                All Sections · AYushMan
              </span>
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(false)}
                className="p-1 rounded-lg bg-white/5 text-neutral-400 hover:text-white"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileDrawerOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-2.5 p-3 rounded-xl text-xs font-medium border transition ${
                        isActive
                          ? 'bg-white/10 text-white border-cyan-500/40 font-semibold'
                          : 'bg-white/[0.03] text-neutral-300 border-white/5 hover:bg-white/[0.06]'
                      }`
                    }
                  >
                    <Icon className="size-4 shrink-0" style={{ color: item.accent }} />
                    <span className="truncate">{item.name}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
