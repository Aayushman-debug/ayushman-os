import React from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

export interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
  mode?: 'words' | 'letters';
}

export const TextReveal: React.FC<TextRevealProps> = ({
  text,
  className = '',
  delay = 0,
  mode = 'letters',
}) => {
  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;

  if (prefersReducedMotion) {
    return <span className={className}>{text}</span>;
  }

  if (mode === 'words') {
    const words = text.split(' ');
    return (
      <span className={cn("inline-flex flex-wrap", className)}>
        {words.map((word, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 15, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{
              duration: 0.5,
              delay: delay + i * 0.08,
              ease: [0.2, 0.65, 0.3, 0.9],
            }}
            className="mr-2 inline-block"
          >
            {word}
          </motion.span>
        ))}
      </span>
    );
  }

  // Letters mode
  const letters = Array.from(text);
  return (
    <span className={cn("inline-flex overflow-hidden", className)}>
      {letters.map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 35, filter: 'blur(10px)', rotateX: 35 }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)', rotateX: 0 }}
          transition={{
            duration: 0.6,
            delay: delay + i * 0.035,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="inline-block transform-gpu"
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </span>
  );
};

export default TextReveal;
