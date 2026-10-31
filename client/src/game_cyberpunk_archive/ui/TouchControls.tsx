/**
 * TouchControls.tsx — Mobile / Touchscreen On-Screen Virtual Controls
 *
 * Provides a virtual D-pad on the bottom-left and action buttons on bottom-right.
 * Renders automatically on touch devices / mobile viewport widths.
 */
import React, { useState, useEffect } from 'react';
import { useGameStore } from '../store/useGameStore';
import { sound } from '../audio/soundEngine';

export default function TouchControls() {
  const {
    setTouchInput,
    cycleCameraMode,
    cameraMode,
    setTacticalMapOpen,
    tacticalMapOpen,
    nearbyTarget,
    openOverlay,
    controlsLocked,
  } = useGameStore();

  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    const checkTouch = () => {
      setIsTouchDevice(
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        window.innerWidth < 768
      );
    };
    checkTouch();
    window.addEventListener('resize', checkTouch);
    return () => window.removeEventListener('resize', checkTouch);
  }, []);

  if (!isTouchDevice || controlsLocked) return null;

  const handleTouchDir = (key: 'forward' | 'backward' | 'left' | 'right', pressed: boolean) => {
    setTouchInput({ [key]: pressed });
  };

  const handleJump = (pressed: boolean) => {
    setTouchInput({ jump: pressed });
  };

  const handleSprint = () => {
    setTouchInput({ sprint: true });
    setTimeout(() => setTouchInput({ sprint: false }), 400);
  };

  const handleAction = () => {
    if (nearbyTarget) {
      sound.playClick(900);
      openOverlay(nearbyTarget.id);
    }
  };

  return (
    <div className="fixed inset-x-0 bottom-6 z-[72] pointer-events-none flex justify-between px-6 select-none font-mono">
      {/* Virtual D-Pad (Bottom-Left) */}
      <div className="pointer-events-auto relative w-32 h-32 flex flex-col items-center justify-between">
        {/* UP */}
        <button
          onTouchStart={() => handleTouchDir('forward', true)}
          onTouchEnd={() => handleTouchDir('forward', false)}
          onMouseDown={() => handleTouchDir('forward', true)}
          onMouseUp={() => handleTouchDir('forward', false)}
          className="w-10 h-10 rounded border border-[#00f5ff] bg-[#050810]/80 text-[#00f5ff] flex items-center justify-center active:bg-[#00f5ff] active:text-black shadow-[0_0_10px_rgba(0,245,255,0.3)] text-xs font-bold"
        >
          ▲
        </button>

        <div className="w-full flex justify-between">
          {/* LEFT */}
          <button
            onTouchStart={() => handleTouchDir('left', true)}
            onTouchEnd={() => handleTouchDir('left', false)}
            onMouseDown={() => handleTouchDir('left', true)}
            onMouseUp={() => handleTouchDir('left', false)}
            className="w-10 h-10 rounded border border-[#00f5ff] bg-[#050810]/80 text-[#00f5ff] flex items-center justify-center active:bg-[#00f5ff] active:text-black shadow-[0_0_10px_rgba(0,245,255,0.3)] text-xs font-bold"
          >
            ◀
          </button>
          {/* SPRINT CENTER */}
          <button
            onTouchStart={handleSprint}
            onClick={handleSprint}
            className="w-8 h-8 rounded-full border border-[#ff006e] bg-[#050810]/80 text-[#ff006e] flex items-center justify-center active:bg-[#ff006e] active:text-black text-[0.55rem] font-bold"
          >
            RUN
          </button>
          {/* RIGHT */}
          <button
            onTouchStart={() => handleTouchDir('right', true)}
            onTouchEnd={() => handleTouchDir('right', false)}
            onMouseDown={() => handleTouchDir('right', true)}
            onMouseUp={() => handleTouchDir('right', false)}
            className="w-10 h-10 rounded border border-[#00f5ff] bg-[#050810]/80 text-[#00f5ff] flex items-center justify-center active:bg-[#00f5ff] active:text-black shadow-[0_0_10px_rgba(0,245,255,0.3)] text-xs font-bold"
          >
            ▶
          </button>
        </div>

        {/* DOWN */}
        <button
          onTouchStart={() => handleTouchDir('backward', true)}
          onTouchEnd={() => handleTouchDir('backward', false)}
          onMouseDown={() => handleTouchDir('backward', true)}
          onMouseUp={() => handleTouchDir('backward', false)}
          className="w-10 h-10 rounded border border-[#00f5ff] bg-[#050810]/80 text-[#00f5ff] flex items-center justify-center active:bg-[#00f5ff] active:text-black shadow-[0_0_10px_rgba(0,245,255,0.3)] text-xs font-bold"
        >
          ▼
        </button>
      </div>

      {/* Action Buttons (Bottom-Right) */}
      <div className="pointer-events-auto flex items-end gap-3">
        {/* CAMERA VIEW TOGGLE */}
        <button
          onClick={cycleCameraMode}
          className="w-11 h-11 rounded border border-[#ffb700] bg-[#050810]/85 text-[#ffb700] flex flex-col items-center justify-center active:bg-[#ffb700] active:text-black shadow-[0_0_10px_rgba(255,183,0,0.3)] text-[0.6rem] font-bold"
        >
          <span>CAM</span>
          <span className="text-[0.45rem] opacity-75">{cameraMode.slice(0, 3).toUpperCase()}</span>
        </button>

        {/* TACTICAL MAP */}
        <button
          onClick={() => setTacticalMapOpen(!tacticalMapOpen)}
          className="w-11 h-11 rounded border border-[#00f5ff] bg-[#050810]/85 text-[#00f5ff] flex items-center justify-center active:bg-[#00f5ff] active:text-black shadow-[0_0_10px_rgba(0,245,255,0.3)] text-[0.65rem] font-bold"
        >
          MAP
        </button>

        {/* ACTION / ENTER */}
        {nearbyTarget && (
          <button
            onClick={handleAction}
            className="w-14 h-14 rounded-full border-2 border-[#00f5ff] bg-[#00f5ff] text-[#050810] flex flex-col items-center justify-center active:scale-95 shadow-[0_0_20px_#00f5ff] text-xs font-extrabold animate-pulse"
          >
            <span>ENTER</span>
            <span className="text-[0.5rem]">[E]</span>
          </button>
        )}

        {/* JUMP */}
        <button
          onTouchStart={() => handleJump(true)}
          onTouchEnd={() => handleJump(false)}
          onMouseDown={() => handleJump(true)}
          onMouseUp={() => handleJump(false)}
          className="w-12 h-12 rounded-full border border-white bg-[#050810]/90 text-white flex items-center justify-center active:bg-white active:text-black shadow-[0_0_10px_rgba(255,255,255,0.4)] text-xs font-bold"
        >
          JUMP
        </button>
      </div>
    </div>
  );
}
