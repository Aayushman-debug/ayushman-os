import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  Award, 
  Calendar, 
  FileText, 
  Download, 
  Sparkles, 
  ShieldCheck,
  Tag,
  Archive
} from 'lucide-react';
import { ArchiveCard } from '@/components/ui/cards';
import { PageTransition } from '@/components/ui/page-transition';

export const VaultPage: React.FC = () => {
  const [entries, setEntries] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/vault').then(r => r.json()).then(d => d.entries && setEntries(d.entries));
  }, []);

  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(entries, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `ayushman_vault_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <PageTransition>
      <div className="space-y-8 animate-in fade-in duration-300">
        
        {/* Header Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white/[0.02] border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl backdrop-blur-md">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-mono mb-3">
              <Archive className="size-3.5" />
              <span>Personal Vault & Archive</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Milestones & Memories
            </h1>
            <p className="text-neutral-400 text-sm mt-1">
              Official certificates, academic verifications, and milestone reflections.
            </p>
          </div>

          <button
            onClick={handleExportData}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs transition shadow-lg cursor-pointer hover:border-cyan-400/50"
          >
            <Download className="size-4" />
            <span>Export JSON Archive</span>
          </button>
        </div>

        {/* Entries Grid with Stacked Archival Glass Cards */}
        <div className="space-y-5">
          {entries.map((entry) => (
            <ArchiveCard
              key={entry.id}
              title={entry.title}
              category={entry.category}
              dateOccurred={entry.dateOccurred}
              content={entry.content}
              tags={entry.tags || []}
              isPrivate={entry.isPrivate}
            />
          ))}
        </div>

      </div>
    </PageTransition>
  );
};
export default VaultPage;
