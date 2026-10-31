/**
 * DialogueBoxModal.tsx — RPG / Bloxburg Style Village Dialogue Bubble
 *
 * Appears during NPC interactions (Oliver, Pip, Barnaby)
 * Features:
 * - Speaker avatar icon, name & title
 * - Dialogue progression with [SPACE] or click
 * - Interactive step indicator and exit button
 */
import React, { useEffect } from 'react';
import { useIslandStore } from './useIslandStore';
import { islandAudio } from './islandAudio';
import { X, ChevronRight, Check } from 'lucide-react';

export default function DialogueBoxModal() {
  const { activeDialogue, advanceDialogue, closeDialogue } = useIslandStore();

  useEffect(() => {
    if (!activeDialogue) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        advanceDialogue();
      } else if (e.code === 'Escape') {
        closeDialogue();
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeDialogue, advanceDialogue, closeDialogue]);

  if (!activeDialogue) return null;

  const { speaker, title, avatarIcon, lines, currentLine } = activeDialogue;
  const isLastLine = currentLine >= lines.length - 1;

  return (
    <div className="fixed inset-x-0 bottom-6 z-[110] flex justify-center px-4 font-sans select-none pointer-events-auto animate-fadeIn">
      <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border-4 border-amber-300 max-w-2xl w-full p-5 text-slate-800 flex flex-col gap-3">
        {/* Header Row: Speaker Name & Role */}
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5">
          <div className="flex items-center gap-3">
            <span className="text-2xl p-2 bg-amber-100 rounded-2xl shadow-inner">
              {avatarIcon || '💬'}
            </span>
            <div>
              <div className="text-sm font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span>{speaker}</span>
                <span className="text-[0.68rem] px-2 py-0.5 rounded-full bg-amber-400 text-slate-900 font-extrabold uppercase tracking-wider">
                  NPC
                </span>
              </div>
              <div className="text-xs font-semibold text-slate-500">{title}</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Step Counter */}
            <span className="text-xs font-bold text-slate-400">
              {currentLine + 1} / {lines.length}
            </span>

            {/* Close Button */}
            <button
              onClick={closeDialogue}
              className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
              title="Close Dialogue [ESC]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dialogue Speech Content */}
        <div className="py-2 text-sm md:text-base font-medium text-slate-700 leading-relaxed min-h-[56px]">
          {lines[currentLine]}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-1 text-xs">
          <div className="text-slate-400 text-[0.7rem] font-medium hidden sm:block">
            Press <kbd className="px-1.5 py-0.5 bg-slate-100 rounded border border-slate-300 font-bold">SPACE</kbd> or click Next to continue
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={() => {
                advanceDialogue();
                islandAudio.playTalk();
              }}
              className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 active:scale-95 text-slate-950 font-black text-xs shadow-md transition-transform flex items-center gap-1.5"
            >
              <span>{isLastLine ? 'CONTINUE EXPLORING' : 'NEXT'}</span>
              {isLastLine ? (
                <Check className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
