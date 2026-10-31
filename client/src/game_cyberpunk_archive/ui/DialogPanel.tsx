/**
 * DialogPanel.tsx — Cyberpunk NPC dialog UI
 *
 * Renders at bottom of screen when a dialog is active.
 * Features:
 * - Typewriter text reveal
 * - Glitch effect for system/ghost lines
 * - Choice buttons
 * - Speaker name with neon color
 * - Click anywhere / Space to advance
 */
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useDialogStore, DialogTree, DialogLine } from '../store/useDialogStore';
import { useGameStore } from '../store/useGameStore';
import { sound } from '../audio/soundEngine';

/* ─── Typewriter hook ──────────────────────────────────────────────── */
function useTypewriter(text: string, speed = 24) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setDisplayed('');
    setDone(false);
    let i = 0;
    intervalRef.current = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i % 2 === 0) {
        sound.playTypewriter();
      }
      if (i >= text.length) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setDone(true);
      }
    }, speed);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [text, speed]);

  const skipToEnd = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setDisplayed(text);
    setDone(true);
    sound.playClick(1100);
  }, [text]);

  return { displayed, done, skipToEnd };
}

/* ─── Glitch text effect ───────────────────────────────────────────── */
const GLITCH_CHARS = '!@#$%^&*<>[]{}|/\\~`';
function GlitchText({ text, color }: { text: string; color: string }) {
  const [glitched, setGlitched] = useState(text);
  useEffect(() => {
    let frame: number;
    let count = 0;
    const animate = () => {
      if (count > 6) { setGlitched(text); return; }
      const arr = text.split('');
      const num = Math.min(3, arr.length);
      for (let i = 0; i < num; i++) {
        const idx = Math.floor(Math.random() * arr.length);
        arr[idx] = GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
      }
      setGlitched(arr.join(''));
      count++;
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [text]);
  return <span style={{ color }}>{glitched}</span>;
}

/* ─── Active line renderer (sub-component to satisfy React Hooks rules) ─ */
function ActiveDialogContent({
  line,
  onAdvance,
  onClose,
}: {
  line: DialogLine;
  onAdvance: (nextId: string | null) => void;
  onClose: () => void;
}) {
  const { displayed, done: twDone, skipToEnd } = useTypewriter(line.text);
  const speakerColor = line.speakerColor;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Escape') {
        onClose();
        return;
      }
      if ((e.code === 'Space' || e.code === 'Enter') && !line.choices) {
        if (!twDone) {
          skipToEnd();
        } else {
          onAdvance(line.next ?? null);
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [twDone, skipToEnd, onAdvance, onClose, line]);

  const handlePanelClick = () => {
    if (!twDone) {
      skipToEnd();
    } else if (!line.choices) {
      onAdvance(line.next ?? null);
    }
  };

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[75] pointer-events-auto"
      style={{ padding: '0 16px 20px' }}
    >
      <div
        className="relative w-full max-w-3xl mx-auto cursor-pointer"
        style={{
          background: 'rgba(5, 8, 16, 0.96)',
          border: `1px solid ${speakerColor}`,
          boxShadow: `0 0 30px ${speakerColor}44, inset 0 0 30px ${speakerColor}08`,
        }}
        onClick={handlePanelClick}
      >
        {/* Corner accents */}
        {[
          { top: 0, left: 0, borderTop: `2px solid ${speakerColor}`, borderLeft: `2px solid ${speakerColor}` },
          { top: 0, right: 0, borderTop: `2px solid ${speakerColor}`, borderRight: `2px solid ${speakerColor}` },
          { bottom: 0, left: 0, borderBottom: `2px solid ${speakerColor}`, borderLeft: `2px solid ${speakerColor}` },
          { bottom: 0, right: 0, borderBottom: `2px solid ${speakerColor}`, borderRight: `2px solid ${speakerColor}` },
        ].map((style, i) => (
          <div key={i} style={{ position: 'absolute', width: 12, height: 12, ...style }} />
        ))}

        <div style={{ padding: '16px 20px 14px' }}>
          {/* Speaker name */}
          <div
            style={{
              fontFamily: 'monospace',
              fontSize: '0.65rem',
              letterSpacing: '0.25em',
              color: speakerColor,
              textShadow: `0 0 10px ${speakerColor}`,
              marginBottom: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span>◈ {line.speaker}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              style={{
                fontFamily: 'monospace',
                fontSize: '0.6rem',
                color: '#4a6080',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              ESC ✕
            </button>
          </div>

          {/* Dialog text */}
          <div
            style={{
              fontFamily: 'monospace',
              fontSize: '0.82rem',
              lineHeight: 1.65,
              color: '#c8d8e8',
              whiteSpace: 'pre-line',
              minHeight: '3.5em',
            }}
          >
            {line.style === 'glitch' && twDone ? (
              <GlitchText text={displayed} color="#c8d8e8" />
            ) : (
              displayed
            )}
            {!twDone && (
              <span
                style={{
                  display: 'inline-block',
                  width: 8,
                  height: '0.8em',
                  background: speakerColor,
                  marginLeft: 2,
                  animation: 'blink 0.6s step-end infinite',
                  verticalAlign: 'middle',
                }}
              />
            )}
          </div>

          {/* Choices or advance hint */}
          {twDone && (
            <div style={{ marginTop: 14 }}>
              {line.choices ? (
                <div className="flex flex-wrap gap-2">
                  {line.choices.map((choice, i) => (
                    <button
                      key={i}
                      onClick={(e) => {
                        e.stopPropagation();
                        choice.action?.();
                        onAdvance(choice.next);
                      }}
                      style={{
                        fontFamily: 'monospace',
                        fontSize: '0.72rem',
                        letterSpacing: '0.08em',
                        padding: '6px 14px',
                        background: 'transparent',
                        border: `1px solid ${speakerColor}`,
                        color: speakerColor,
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                      }}
                      onMouseEnter={(e) => {
                        (e.target as HTMLElement).style.background = speakerColor;
                        (e.target as HTMLElement).style.color = '#050810';
                      }}
                      onMouseLeave={(e) => {
                        (e.target as HTMLElement).style.background = 'transparent';
                        (e.target as HTMLElement).style.color = speakerColor;
                      }}
                    >
                      ▸ {choice.label}
                    </button>
                  ))}
                </div>
              ) : (
                <div
                  style={{
                    fontFamily: 'monospace',
                    fontSize: '0.62rem',
                    color: '#4a6080',
                    letterSpacing: '0.15em',
                    textAlign: 'right',
                  }}
                >
                  [SPACE] / CLICK to advance
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
      `}</style>
    </div>
  );
}

/* ─── Main dialog panel ────────────────────────────────────────────── */
export default function DialogPanel() {
  const { active, tree, currentLineId, advance, closeDialog } = useDialogStore();
  const { setControlsLocked, markNpcVisited } = useGameStore();

  useEffect(() => {
    setControlsLocked(active);
    if (active && tree) {
      markNpcVisited(tree.id);
    }
  }, [active, tree, setControlsLocked, markNpcVisited]);

  if (!active || !tree || !currentLineId) return null;
  const currentLine = tree.lines[currentLineId];
  if (!currentLine) return null;

  return (
    <ActiveDialogContent
      line={currentLine}
      onAdvance={(next) => {
        sound.playClick(950);
        advance(next);
      }}
      onClose={() => {
        sound.playTerminalClose();
        closeDialog();
      }}
    />
  );
}
