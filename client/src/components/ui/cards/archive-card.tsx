import React from 'react';
import { cn } from '@/lib/utils';
import { ShieldCheck, Tag, Calendar, Lock } from 'lucide-react';

export interface ArchiveCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  category: string;
  dateOccurred: string;
  content: string;
  tags?: string[];
  isPrivate?: boolean;
}

export const ArchiveCard: React.FC<ArchiveCardProps> = ({
  title,
  category,
  dateOccurred,
  content,
  tags = [],
  isPrivate = false,
  className = '',
  ...props
}) => {
  return (
    <div className="relative group">
      {/* Background stacked shadow layer simulating physical archival paper stack */}
      <div className="absolute inset-0 translate-y-1.5 translate-x-1 rounded-2xl bg-white/[0.015] border border-white/5 pointer-events-none group-hover:translate-y-2 group-hover:translate-x-1.5 transition-transform duration-300" />

      {/* Main Archival Glass Card */}
      <div
        className={cn(
          "relative rounded-2xl bg-[#0b0e18]/90 border border-white/10 p-6 backdrop-blur-xl shadow-xl transition-all duration-300 group-hover:border-purple-500/40 group-hover:-translate-y-0.5",
          className
        )}
        data-portfolio-card="archive"
        {...props}
      >
        {/* Top Metadata Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3.5">
          <div className="flex items-center gap-2.5">
            <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase font-semibold">
              {category}
            </span>
            <h3 className="text-base font-bold text-white tracking-tight">{title}</h3>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-mono">
            <Calendar className="size-3.5 text-cyan-400" />
            <span>{dateOccurred}</span>
          </div>
        </div>

        {/* Archival Body Text */}
        <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-normal">
          {content}
        </p>

        {/* Footer: Tags & Cryptographic Verification Pill */}
        <div className="mt-5 pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <Tag className="size-3 text-neutral-400" />
            {tags.map((t, i) => (
              <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/5 text-neutral-400 border border-white/5">
                #{t}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-1.5 text-xs font-mono">
            {isPrivate ? (
              <span className="flex items-center gap-1 text-neutral-400">
                <Lock className="size-3.5 text-amber-400" />
                <span>Private Archive</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 text-emerald-400">
                <ShieldCheck className="size-3.5 text-emerald-400" />
                <span>Verified Record</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArchiveCard;
