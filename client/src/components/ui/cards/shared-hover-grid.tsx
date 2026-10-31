import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

export interface SharedHoverGridItem {
  id: string | number;
  content: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export interface SharedHoverGridProps {
  items: SharedHoverGridItem[];
  className?: string;
  gridColsClass?: string;
}

export const SharedHoverGrid: React.FC<SharedHoverGridProps> = ({
  items,
  className = '',
  gridColsClass = 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className={cn("grid gap-4 relative", gridColsClass, className)}>
      {items.map((item, idx) => (
        <div
          key={item.id}
          className="relative group block p-1 size-full"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
          onClick={item.onClick}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 size-full bg-gradient-to-r from-purple-500/[0.12] to-cyan-500/[0.12] rounded-2xl block border border-cyan-400/30 shadow-[0_0_20px_rgba(6,182,212,0.15)] pointer-events-none"
                layoutId="sharedHoverBackdrop"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.2 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15, delay: 0.05 },
                }}
              />
            )}
          </AnimatePresence>

          <div className={cn("relative z-10 size-full", item.className)}>
            {item.content}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SharedHoverGrid;
