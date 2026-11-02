import React, { useState } from 'react';
import {
  Wand2,
  RefreshCw,
  Copy,
  Check,
  AlertTriangle,
  Plus,
  Shuffle,
} from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ErrorState } from '../../components/ui/ErrorState';
import { useAiAssistantStore } from '../../stores/useAiAssistantStore';
import { useEditorStore } from '../../stores/useEditorStore';
import { useTemplateStore } from '../../stores/useTemplateStore';
import { AI_TONE_LABELS, EXAMPLE_PROMPT_IDEAS } from './data/aiPresets';
import type { AiCaptionSuggestion, AiTone } from '../../types/ai';

export interface AiEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AiEditorModal: React.FC<AiEditorModalProps> = ({ isOpen, onClose }) => {
  const prompt = useAiAssistantStore((state) => state.prompt);
  const tone = useAiAssistantStore((state) => state.tone);
  const language = useAiAssistantStore((state) => state.language);
  const captions = useAiAssistantStore((state) => state.captions);
  const isLoading = useAiAssistantStore((state) => state.isLoading);
  const error = useAiAssistantStore((state) => state.error);
  const isDemoMode = useAiAssistantStore((state) => state.isDemoMode);
  const copiedCaptionId = useAiAssistantStore((state) => state.copiedCaptionId);

  const setPrompt = useAiAssistantStore((state) => state.setPrompt);
  const setTone = useAiAssistantStore((state) => state.setTone);
  const setLanguage = useAiAssistantStore((state) => state.setLanguage);
  const generateCaptions = useAiAssistantStore((state) => state.generateCaptions);
  const selectIdea = useAiAssistantStore((state) => state.selectIdea);
  const copyCaption = useAiAssistantStore((state) => state.copyCaption);

  const textLayers = useEditorStore((state) => state.textLayers);
  const selectedLayerId = useEditorStore((state) => state.selectedLayerId);
  const applyAiCaption = useEditorStore((state) => state.applyAiCaption);
  const setNotification = useTemplateStore((state) => state.setNotification);

  // Replacement confirmation state
  const [pendingCaption, setPendingCaption] = useState<AiCaptionSuggestion | null>(null);

  const activeLayer = textLayers.find((l) => l.id === selectedLayerId) || textLayers[0];
  const tones: AiTone[] = ['funny', 'sarcastic', 'wholesome', 'dark-humor', 'relatable'];

  const handleApply = (caption: AiCaptionSuggestion, mode: 'replace' | 'new') => {
    // If user chose 'replace' and the current layer has existing non-empty text, require confirmation
    if (mode === 'replace' && activeLayer && activeLayer.text.trim()) {
      setPendingCaption(caption);
      return;
    }

    executeApply(caption, mode);
  };

  const executeApply = (caption: AiCaptionSuggestion, mode: 'replace' | 'new') => {
    applyAiCaption({
      text: caption.singleText,
      mode,
      topText: caption.topText,
      bottomText: caption.bottomText,
    });

    setPendingCaption(null);
    onClose();

    setNotification({
      type: 'success',
      message:
        mode === 'replace'
          ? 'AI caption replaced active text layer!'
          : 'AI caption added as new text layer!',
    });
  };

  const handleRandomize = () => {
    const randomIndex = Math.floor(Math.random() * EXAMPLE_PROMPT_IDEAS.length);
    selectIdea(EXAMPLE_PROMPT_IDEAS[randomIndex]);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setPendingCaption(null);
        onClose();
      }}
      title="AI Caption Assistant"
      description="Generate witty captions and insert directly onto your meme canvas"
      maxWidth="xl"
    >
      <div className="space-y-4 text-slate-800">
        {/* Replacement Confirmation Dialog Overlay inside Modal */}
        {pendingCaption && activeLayer && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-slate-800 space-y-3 animate-in zoom-in-95 duration-150">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm text-amber-900">
                  Confirm Replacing Existing Caption?
                </h4>
                <p className="text-xs text-amber-800 mt-0.5">
                  Your active text layer currently contains:
                </p>
                <div className="mt-1.5 p-2 rounded-lg bg-white/80 border border-amber-200 font-mono text-xs text-slate-700 truncate">
                  "{activeLayer.text}"
                </div>
                <p className="text-xs text-amber-800 mt-2">
                  Replace it with: <span className="font-bold">"{pendingCaption.singleText}"</span>?
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={() => executeApply(pendingCaption, 'replace')}
                className="bg-amber-600 hover:bg-amber-700 border-amber-600 font-semibold text-xs"
              >
                Yes, Replace Text
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => executeApply(pendingCaption, 'new')}
                leftIcon={<Plus className="w-3.5 h-3.5" />}
                className="font-semibold text-xs"
              >
                Add as New Layer Instead
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setPendingCaption(null)}
                className="text-xs text-slate-500"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Demo Mode Notice */}
        {isDemoMode && (
          <div className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-[11px] flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>Demo Mode: Using curated tone-matched suggestions</span>
            </span>
            <span className="font-semibold text-slate-400">Backend Pending</span>
          </div>
        )}

        {/* Tone & Language Quick Pickers */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Tones */}
          <div className="flex flex-wrap items-center gap-1">
            {tones.map((t) => {
              const info = AI_TONE_LABELS[t];
              const isActive = tone === t;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTone(t)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-all duration-150 hover:-translate-y-0.5 active:scale-95 ${
                    isActive
                      ? 'bg-[#1463E9] text-white shadow-2xs font-bold'
                      : 'bg-slate-100 hover:bg-[#EFF6FF] hover:text-[#1463E9] text-slate-700'
                  }`}
                >
                  <span>{info.label}</span>
                </button>
              );
            })}
          </div>

          {/* Language Toggle */}
          <div className="flex items-center gap-1 p-0.5 rounded-lg bg-slate-100 border border-slate-200 self-start sm:self-auto shrink-0">
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-2 py-1 rounded text-xs font-bold transition-all duration-150 active:scale-95 cursor-pointer ${
                language === 'en' ? 'bg-white text-[#1463E9] shadow-2xs' : 'text-slate-600 hover:text-[#1463E9]'
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLanguage('ta')}
              className={`px-2 py-1 rounded text-xs font-bold transition-all duration-150 active:scale-95 cursor-pointer ${
                language === 'ta' ? 'bg-white text-[#1463E9] shadow-2xs' : 'text-slate-600 hover:text-[#1463E9]'
              }`}
            >
              தமிழ்
            </button>
          </div>
        </div>

        {/* Prompt Input */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Prompt / Situation
            </label>
            <button
              type="button"
              onClick={handleRandomize}
              className="text-xs font-semibold text-[#1463E9] hover:text-[#0E52C7] flex items-center gap-1 cursor-pointer active:scale-95 transition-all duration-150"
            >
              <Shuffle className="w-3 h-3" />
              <span>Random Prompt</span>
            </button>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., When production crashes on Friday..."
              className="flex-1 bg-slate-50 rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-medium text-slate-900"
            />
            <Button
              type="button"
              variant="primary"
              size="sm"
              disabled={isLoading || !prompt.trim()}
              onClick={generateCaptions}
              leftIcon={
                isLoading ? (
                  <LoadingSpinner size="xs" color="white" />
                ) : (
                  <Wand2 className="w-3.5 h-3.5" />
                )
              }
              className="font-bold shrink-0 min-h-[40px]"
            >
              {isLoading ? 'Generating...' : 'Generate'}
            </Button>
          </div>
        </div>

        {/* Captions Results */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Suggestions {captions.length > 0 && `(${captions.length})`}
            </span>
            {captions.length > 0 && (
              <button
                type="button"
                onClick={generateCaptions}
                disabled={isLoading}
                className="text-xs font-semibold text-[#1463E9] hover:text-[#0E52C7] flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Regenerate</span>
              </button>
            )}
          </div>

          {isLoading ? (
            <div className="py-10 text-center space-y-2">
              <LoadingSpinner size="lg" color="primary" />
              <p className="text-xs text-slate-500">Generating AI punchlines...</p>
            </div>
          ) : error ? (
            <ErrorState
              title="Generation Failed"
              message={error}
              onRetry={generateCaptions}
              compact
            />
          ) : captions.length > 0 ? (
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {captions.map((caption) => {
                const isCopied = copiedCaptionId === caption.id;
                return (
                  <div
                    key={caption.id}
                    className="p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-blue-50/40 hover:border-blue-300 transition-all flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-xs sm:text-sm text-slate-900 break-words">
                        "{caption.singleText}"
                      </p>
                      {caption.topText && caption.bottomText && (
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Top: <span className="font-mono">{caption.topText}</span> | Bottom:{' '}
                          <span className="font-mono">{caption.bottomText}</span>
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
                      <button
                        type="button"
                        onClick={() => copyCaption(caption)}
                        title="Copy to clipboard"
                        className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-[#EFF6FF] hover:border-[#1463E9]/30 text-slate-700 hover:text-[#1463E9] transition-colors cursor-pointer text-xs flex items-center gap-1"
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-700 font-bold text-[11px]">Copied</span>
                          </>
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>

                      <Button
                        type="button"
                        variant="secondary"
                        size="xs"
                        onClick={() => handleApply(caption, 'new')}
                        leftIcon={<Plus className="w-3 h-3" />}
                        className="text-xs"
                      >
                        New Layer
                      </Button>

                      <Button
                        type="button"
                        variant="primary"
                        size="xs"
                        onClick={() => handleApply(caption, 'replace')}
                        className="text-xs"
                      >
                        Replace
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              Click <span className="font-bold text-blue-600">"Generate"</span> or{' '}
              <span className="font-bold text-blue-600">"Random Prompt"</span> to see captions.
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
