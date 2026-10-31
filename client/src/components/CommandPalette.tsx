import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, GraduationCap, CheckCircle2, Film, Music, Gamepad2, Code2, Globe2, Bookmark, LayoutDashboard, X, ArrowRight } from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const commands = [
    { title: 'Dashboard', category: 'Navigation', icon: LayoutDashboard, path: '/dashboard', keywords: 'home overview clock stats' },
    { title: 'Academics', category: 'Education', icon: GraduationCap, path: '/academics', keywords: 'marksheet grades rtu cse marks sem 5 syllabus compiler os dsa' },
    { title: 'Semester 5 Workspace', category: 'Education', icon: GraduationCap, path: '/academics?sem=5', keywords: 'sem 5 compiler design operating systems algorithms units' },
    { title: 'Journal & Tasks', category: 'Productivity', icon: CheckCircle2, path: '/productivity', keywords: 'tasks kanban streaks study hours heatmap journal' },
    { title: 'Anime & Movies', category: 'Entertainment', icon: Film, path: '/entertainment', keywords: 'anime anilist movies interstellar attack on titan jujutsu kaisen' },
    { title: 'Music', category: 'Entertainment', icon: Music, path: '/music', keywords: 'playlists spotify youtube music songs beats जीवन peak' },
    { title: 'Gaming', category: 'Gaming', icon: Gamepad2, path: '/gaming', keywords: 'bgmi valorant ranks stats uid clan minecraft' },
    { title: 'Projects', category: 'Development', icon: Code2, path: '/developer', keywords: 'skills c++ python react projects github' },
    { title: 'Social & Platforms', category: 'Identity', icon: Globe2, path: '/social', keywords: 'instagram wtfk1yo spotify discord github profiles social links' },
    { title: 'Memories', category: 'Archive', icon: Bookmark, path: '/vault', keywords: 'milestones certificates notes' },
    { title: 'Settings', category: 'System', icon: LayoutDashboard, path: '/settings', keywords: 'mysql database export backup config' },
  ];

  const filtered = query.trim() === '' 
    ? commands 
    : commands.filter(c => 
        c.title.toLowerCase().includes(query.toLowerCase()) || 
        c.keywords.toLowerCase().includes(query.toLowerCase()) ||
        c.category.toLowerCase().includes(query.toLowerCase())
      );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0d101b] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header Search input */}
        <div className="flex items-center px-4 py-3.5 border-b border-white/5 bg-white/[0.02]">
          <Search className="size-4 text-neutral-400 mr-3" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a section name or keyword (e.g. 'Academics', 'Spotify', 'Gaming')..."
            className="w-full bg-transparent text-white text-sm placeholder-neutral-500 focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-neutral-400 hover:text-white mr-2">
              <X className="size-4" />
            </button>
          )}
          <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-white/10 text-neutral-400 border border-white/10">
            ESC
          </span>
        </div>

        {/* Results list */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-neutral-400 text-sm">
              No matching sections found for "{query}"
            </div>
          ) : (
            filtered.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    navigate(item.path);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/[0.04] text-neutral-300 hover:text-white transition group border border-transparent text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white/5 text-neutral-400 group-hover:text-white transition">
                      <Icon className="size-4" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">{item.title}</div>
                      <div className="text-xs text-neutral-500">{item.category}</div>
                    </div>
                  </div>
                  <ArrowRight className="size-4 text-neutral-600 group-hover:text-neutral-300 transform group-hover:translate-x-1 transition" />
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-black/40 border-t border-white/5 text-xs text-neutral-500">
          <div className="flex items-center gap-3">
            <span>Navigation: <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-neutral-300">↑</kbd> <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-neutral-300">↓</kbd></span>
            <span>Select: <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-neutral-300">↵</kbd></span>
          </div>
          <span className="text-neutral-400 font-medium">AYushMan</span>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
