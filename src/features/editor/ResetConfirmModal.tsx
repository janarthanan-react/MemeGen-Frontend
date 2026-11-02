import React from 'react';
import { AlertTriangle, RotateCcw, X } from 'lucide-react';
import { useEditorStore } from '../../stores/useEditorStore';

export const ResetConfirmModal: React.FC = () => {
  const isResetModalOpen = useEditorStore((state) => state.isResetModalOpen);
  const setIsResetModalOpen = useEditorStore((state) => state.setIsResetModalOpen);
  const resetToTemplate = useEditorStore((state) => state.resetToTemplate);

  if (!isResetModalOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={() => setIsResetModalOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-labelledby="reset-modal-title"
    >
      <div
        className="w-full max-w-md bg-[#071330] border border-white/15 rounded-2xl p-6 shadow-2xl text-white space-y-4 animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <button
            type="button"
            onClick={() => setIsResetModalOpen(false)}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div>
          <h2 id="reset-modal-title" className="text-lg font-bold text-white">
            Reset Meme to Defaults?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
            This will reset all text captions, colors, and positioning back to the original template slots. (You can still use Undo if needed).
          </p>
        </div>

        <div className="pt-2 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 sm:gap-3 flex-nowrap">
          <button
            type="button"
            onClick={() => setIsResetModalOpen(false)}
            className="w-full sm:w-auto px-4.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/10 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-150 cursor-pointer min-h-[44px] flex items-center justify-center whitespace-nowrap focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:outline-none"
          >
            Keep Editing
          </button>
          <button
            type="button"
            onClick={resetToTemplate}
            className="w-full sm:w-auto px-4.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white shadow-[0_2px_10px_rgba(225,29,72,0.35)] hover:shadow-[0_6px_18px_rgba(225,29,72,0.45)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 min-h-[44px] whitespace-nowrap focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:outline-none"
          >
            <RotateCcw className="w-4 h-4 shrink-0" />
            <span className="whitespace-nowrap">Reset Canvas</span>
          </button>
        </div>
      </div>
    </div>
  );
};
