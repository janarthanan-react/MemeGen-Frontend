import React, { useState } from 'react';
import { Copy, Check, ArrowRight, Bot } from 'lucide-react';
import type { AiCaptionSuggestion } from '../../types/ai';
import { AI_TONE_LABELS } from './data/aiPresets';
import { Button } from '../../components/ui/Button';

export interface AiCaptionCardProps {
  caption: AiCaptionSuggestion;
  isCopied: boolean;
  onCopy: (caption: AiCaptionSuggestion) => void;
  onSendToEditor?: (caption: AiCaptionSuggestion, mode: 'replace' | 'new') => void;
  showEditorActions?: boolean;
}

export const AiCaptionCard: React.FC<AiCaptionCardProps> = ({
  caption,
  isCopied,
  onCopy,
  onSendToEditor,
  showEditorActions = true,
}) => {
  const [showConfirmReplace, setShowConfirmReplace] = useState(false);
  const toneInfo = AI_TONE_LABELS[caption.tone];

  const handleUseInEditor = (mode: 'replace' | 'new') => {
    setShowConfirmReplace(false);
    if (onSendToEditor) {
      onSendToEditor(caption, mode);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 hover:border-blue-400 p-4 sm:p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group relative overflow-hidden">
      {/* Top Meta: Tone & Language */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
          <span>{toneInfo.label}</span>
        </div>

        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 py-0.5 rounded bg-slate-50 border border-slate-200/60">
          {caption.language === 'ta' ? 'தமிழ்' : 'English'}
        </span>
      </div>

      {/* Caption Content */}
      <div className="space-y-2 mb-4">
        {caption.topText && caption.bottomText ? (
          <div className="space-y-1.5 bg-slate-900 rounded-xl p-3 text-center border border-slate-800">
            <p className="font-['Impact',sans-serif] text-xs sm:text-sm uppercase tracking-wide text-white font-bold break-words">
              {caption.topText}
            </p>
            <div className="w-8 h-px bg-white/20 mx-auto" />
            <p className="font-['Impact',sans-serif] text-xs sm:text-sm uppercase tracking-wide text-cyan-300 font-bold break-words">
              {caption.bottomText}
            </p>
          </div>
        ) : (
          <p className="text-sm sm:text-base font-bold text-slate-900 leading-snug break-words">
            &ldquo;{caption.singleText}&rdquo;
          </p>
        )}
      </div>

      {/* Replacement confirmation sub-panel */}
      {showConfirmReplace && (
        <div className="mb-3 p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs text-slate-700 space-y-2 animate-in fade-in zoom-in-95 duration-150">
          <p className="font-semibold text-blue-900 flex items-center gap-1.5">
            <Bot className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span>Apply to Meme Editor:</span>
          </p>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-1.5">
            <button
              type="button"
              onClick={() => handleUseInEditor('replace')}
              className="flex-1 px-2.5 py-1.5 bg-[#1463E9] hover:bg-[#0E52C7] text-white font-semibold rounded-lg text-xs transition-all duration-200 active:scale-95 cursor-pointer text-center"
            >
              Replace Active Text
            </button>
            <button
              type="button"
              onClick={() => handleUseInEditor('new')}
              className="flex-1 px-2.5 py-1.5 bg-white hover:bg-[#EFF6FF] text-[#1463E9] hover:text-[#0E52C7] border border-[#1463E9]/30 hover:border-[#1463E9] font-semibold rounded-lg text-xs transition-all duration-200 active:scale-95 cursor-pointer text-center"
            >
              Add as New Layer
            </button>
            <button
              type="button"
              onClick={() => setShowConfirmReplace(false)}
              className="px-2 py-1.5 text-slate-500 hover:text-[#1463E9] hover:bg-[#EFF6FF] font-medium text-xs rounded-lg transition-colors cursor-pointer active:scale-95"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onCopy(caption)}
          leftIcon={
            isCopied ? (
              <Check className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )
          }
          className={`text-xs ${
            isCopied
              ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
              : 'text-slate-700 hover:bg-slate-50'
          }`}
          aria-label={isCopied ? 'Caption copied' : 'Copy caption to clipboard'}
        >
          {isCopied ? 'Copied!' : 'Copy'}
        </Button>

        {showEditorActions && onSendToEditor && !showConfirmReplace && (
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={() => setShowConfirmReplace(true)}
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            className="text-xs shadow-xs hover:shadow-md"
            aria-label="Send caption to meme editor"
          >
            <span>Use in Editor</span>
          </Button>
        )}
      </div>
    </div>
  );
};
