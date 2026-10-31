import React from 'react';
import { cn } from '@/lib/utils';

export interface DataCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string | number;
  subValue?: string;
  progressPercent?: number;
  icon?: React.ReactNode;
  statusBadge?: string;
  statusColor?: string;
  accentColor?: 'cyan' | 'purple' | 'emerald' | 'amber' | 'blue';
}

export const DataCard: React.FC<DataCardProps> = ({
  label,
  value,
  subValue,
  progressPercent,
  icon,
  statusBadge,
  statusColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  accentColor = 'cyan',
  className = '',
  ...props
}) => {
  const gradientMap = {
    cyan: 'from-cyan-500 to-blue-500',
    purple: 'from-purple-500 to-indigo-500',
    emerald: 'from-emerald-500 to-teal-500',
    amber: 'from-amber-500 to-orange-500',
    blue: 'from-blue-500 to-cyan-500',
  };

  return (
    <div
      className={cn(
        "relative rounded-2xl bg-[#0b0e18]/85 border border-white/10 p-5 transition-all duration-300 hover:border-white/20 shadow-lg flex flex-col justify-between group",
        className
      )}
      data-portfolio-card="data"
      {...props}
    >
      <div>
        {/* Top Header */}
        <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
          <span className="font-medium">{label}</span>
          {icon && <div className="text-neutral-400 group-hover:text-white transition-colors">{icon}</div>}
        </div>

        {/* Primary Value */}
        <div className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-baseline gap-2">
          <span>{value}</span>
          {statusBadge && (
            <span className={cn("text-[10px] font-mono px-2 py-0.5 rounded-full border font-normal", statusColor)}>
              {statusBadge}
            </span>
          )}
        </div>

        {subValue && (
          <p className="text-[11px] font-mono text-neutral-400 mt-1">
            {subValue}
          </p>
        )}
      </div>

      {/* Optional Progress Bar */}
      {typeof progressPercent === 'number' && (
        <div className="mt-4 pt-3 border-t border-white/5 space-y-1.5">
          <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400">
            <span>Progress</span>
            <span className="text-white font-bold">{Math.round(progressPercent)}%</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div
              className={cn("h-full rounded-full bg-gradient-to-r transition-all duration-700", gradientMap[accentColor])}
              style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DataCard;
