/**
 * InspectSheetModal.tsx — Interactive World Object Inspection Modal
 *
 * Triggered by:
 * - Developer Workstation in Sunshine Cottage
 * - Cozy Stone Fireplace
 * - Village Archive & Terminal in Village Store
 */
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIslandStore } from './useIslandStore';
import { X, Sparkles, ExternalLink, ArrowRight } from 'lucide-react';

export default function InspectSheetModal() {
  const navigate = useNavigate();
  const { inspectData, closeInspect } = useIslandStore();

  useEffect(() => {
    if (!inspectData) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Escape') {
        closeInspect();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [inspectData, closeInspect]);

  if (!inspectData) return null;

  const { title, subtitle, badge, sections, actions } = inspectData;

  const handleAction = (act: { route?: string; externalUrl?: string }) => {
    if (act.route) {
      closeInspect();
      navigate(act.route);
    } else if (act.externalUrl) {
      window.open(act.externalUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div
      onClick={closeInspect}
      className="fixed inset-0 z-[125] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 font-sans select-none pointer-events-auto animate-fadeIn"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl shadow-2xl border-4 border-amber-300 max-w-xl w-full p-6 text-slate-800 flex flex-col max-h-[88vh] overflow-hidden pointer-events-auto"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-200 pb-4 mb-4">
          <div>
            {badge && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[0.68rem] font-black uppercase tracking-wider mb-1">
                <Sparkles className="w-3 h-3 text-amber-600" />
                {badge}
              </span>
            )}
            <h2 className="text-lg font-black text-slate-900 tracking-tight">{title}</h2>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">{subtitle}</p>
          </div>

          <button
            onClick={closeInspect}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors"
            title="Close [ESC]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Sections Scrollable Body */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-slate-700 text-xs sm:text-sm">
          {sections.map((sec, idx) => (
            <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              {sec.heading && (
                <div className="text-xs font-black text-slate-900 uppercase tracking-wide mb-1.5 text-amber-800">
                  {sec.heading}
                </div>
              )}
              <div className="font-medium leading-relaxed whitespace-pre-line text-slate-700">
                {sec.body}
              </div>
            </div>
          ))}

          {/* Actionable Website Buttons */}
          {actions && actions.length > 0 && (
            <div className="pt-2 border-t border-slate-200 space-y-2">
              <div className="text-[0.68rem] font-bold text-slate-400 uppercase tracking-wider">
                Explore Website Section or Links
              </div>
              <div className="flex flex-wrap gap-2">
                {actions.map((act, i) => (
                  <button
                    key={i}
                    onClick={() => handleAction(act)}
                    className={`px-4 py-2.5 rounded-xl font-bold text-xs shadow-sm transition-transform active:scale-95 flex items-center gap-2 ${
                      act.variant === 'primary'
                        ? 'bg-amber-400 hover:bg-amber-500 text-slate-950 font-black'
                        : act.variant === 'accent'
                        ? 'bg-sky-500 hover:bg-sky-600 text-white'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300'
                    }`}
                  >
                    {act.emoji && <span>{act.emoji}</span>}
                    <span>{act.label}</span>
                    {act.externalUrl ? (
                      <ExternalLink className="w-3.5 h-3.5" />
                    ) : (
                      <ArrowRight className="w-3.5 h-3.5" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[0.68rem] text-slate-400 font-medium">
            Press [ESC] to resume exploration
          </span>
          <button
            onClick={closeInspect}
            className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-xs transition-colors"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
}
