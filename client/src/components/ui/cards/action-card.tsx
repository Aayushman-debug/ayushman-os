import React from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { CheckCircle2, ChevronRight } from 'lucide-react';
import { usePortfolioTheme } from '@/themes/usePortfolioTheme';

export interface ActionCardProps {
  title: string;
  subtitle?: string;
  isCompleted?: boolean;
  onToggle?: () => void;
  actionNode?: React.ReactNode;
  icon?: React.ReactNode;
  badge?: string;
  className?: string;
}

export const ActionCard: React.FC<ActionCardProps> = ({
  title,
  subtitle,
  isCompleted = false,
  onToggle,
  actionNode,
  icon,
  badge,
  className = '',
}) => {
  const { theme } = usePortfolioTheme();
  return (
    <motion.div
      whileHover={theme === 'default' ? { y: -2 } : theme === 'play' ? { y: -3, scale: 1.025, rotate: -0.35 } : theme === 'liquid' ? { y: -3, scale: 1.01 } : theme === 'experimental' ? { x: 4, y: -2 } : { y: -2 }}
      whileTap={theme === 'play' ? { scale: 0.96 } : { scale: 0.99 }}
      onClick={onToggle}
      className={cn(
        "p-4 rounded-xl border transition-all duration-200 flex items-center justify-between gap-3 cursor-pointer select-none",
        isCompleted
          ? "bg-emerald-950/20 border-emerald-500/35 text-neutral-300"
          : "bg-white/[0.02] border-white/10 hover:border-white/25 hover:bg-white/[0.04] text-white",
        className
      )}
      data-portfolio-card="action"
    >
      <div className="flex items-center gap-3 min-w-0">
        {/* Toggle Checkbox Circle */}
        <div
          className={cn(
            "size-5 rounded-md border flex items-center justify-center shrink-0 transition-colors duration-200",
            isCompleted
              ? "bg-emerald-500 border-emerald-500 text-black shadow-[0_0_10px_rgba(16,185,129,0.4)]"
              : "border-white/20 bg-black/40 text-transparent hover:border-white/50"
          )}
        >
          <CheckCircle2 className="size-3.5 fill-current" />
        </div>

        {icon && <div className="text-neutral-400 shrink-0">{icon}</div>}

        <div className="min-w-0">
          <div className={cn("text-xs sm:text-sm font-semibold truncate", isCompleted && "line-through text-neutral-400")}>
            {title}
          </div>
          {subtitle && (
            <div className="text-[11px] text-neutral-400 font-mono mt-0.5 truncate">
              {subtitle}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {badge && (
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-neutral-300">
            {badge}
          </span>
        )}

        {actionNode ? (
          actionNode
        ) : (
          <ChevronRight className="size-4 text-neutral-500 group-hover:text-white transition-colors" />
        )}
      </div>
    </motion.div>
  );
};

export default ActionCard;
