import React from 'react';
import { AsciiArtCanvas, AsciiTheme, AsciiRenderMode, AsciiAnimStyle } from './ascii-art-canvas';

export interface AsciiCanvasBackgroundProps {
  theme?: AsciiTheme;
  renderMode?: AsciiRenderMode;
  animStyle?: AsciiAnimStyle;
  opacity?: number;
  className?: string;
  cellSize?: number;
}

export const AsciiCanvasBackground: React.FC<AsciiCanvasBackgroundProps> = ({
  theme = 'sunset',
  renderMode = 'dots',
  animStyle = 'pulse',
  opacity = 0.45,
  className = '',
  cellSize = 12,
}) => {
  return (
    <div 
      className={`absolute inset-0 pointer-events-none overflow-hidden select-none z-0 ${className}`}
      aria-hidden="true"
    >
      <div 
        className="size-full transition-opacity duration-1000"
        style={{ opacity }}
      >
        <AsciiArtCanvas
          theme={theme}
          renderMode={renderMode}
          animStyle={animStyle}
          cellSize={cellSize}
          contrast={120}
          bloom={true}
          vignette={true}
          animSpeed={0.8}
          animIntensity={40}
        />
      </div>
      {/* Subtle bottom fade gradient to ensure seamless blending with subsequent sections */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#07090e]/40 to-[#07090e] pointer-events-none" />
    </div>
  );
};

export default AsciiCanvasBackground;
