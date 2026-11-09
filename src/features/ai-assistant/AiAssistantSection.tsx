import React, { useState } from 'react';
import {
  Wand2,
  Bot,
  RefreshCw,
  X,
  Shuffle,
  Lightbulb,
  Languages,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useAiAssistantStore } from '../../stores/useAiAssistantStore';
import { useEditorStore } from '../../stores/useEditorStore';
import { useTemplateStore } from '../../stores/useTemplateStore';
import { AI_TONE_LABELS, EXAMPLE_PROMPT_IDEAS } from './data/aiPresets';
import { AiCaptionCard } from './AiCaptionCard';
import { AiIdeaSelector } from './AiIdeaSelector';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ErrorState } from '../../components/ui/ErrorState';
import { EmptyState } from '../../components/ui/EmptyState';
import type { AiCaptionSuggestion, AiTone } from '../../types/ai';

export interface AiAssistantSectionProps {
  onNavigate?: (route: string) => void;
}

export const AiAssistantSection: React.FC<AiAssistantSectionProps> = ({ onNavigate }) => {
  const prompt = useAiAssistantStore((state) => state.prompt);
  const tone = useAiAssistantStore((state) => state.tone);
  const language = useAiAssistantStore((state) => state.language);
  const selectedCategory = useAiAssistantStore((state) => state.selectedCategory);
  const captions = useAiAssistantStore((state) => state.captions);
  const isLoading = useAiAssistantStore((state) => state.isLoading);
  const error = useAiAssistantStore((state) => state.error);
  const copiedCaptionId = useAiAssistantStore((state) => state.copiedCaptionId);
  const hasGeneratedOnce = useAiAssistantStore((state) => state.hasGeneratedOnce);

  const setPrompt = useAiAssistantStore((state) => state.setPrompt);
  const setTone = useAiAssistantStore((state) => state.setTone);
  const setLanguage = useAiAssistantStore((state) => state.setLanguage);
  const setSelectedCategory = useAiAssistantStore((state) => state.setSelectedCategory);
  const generateCaptions = useAiAssistantStore((state) => state.generateCaptions);
  const regenerateCaptions = useAiAssistantStore((state) => state.regenerateCaptions);
  const clearAll = useAiAssistantStore((state) => state.clearAll);
  const selectIdea = useAiAssistantStore((state) => state.selectIdea);
  const copyCaption = useAiAssistantStore((state) => state.copyCaption);

  const applyAiCaption = useEditorStore((state) => state.applyAiCaption);
  const setNotification = useTemplateStore((state) => state.setNotification);

  const [showIdeasDrawer, setShowIdeasDrawer] = useState(false);

  const tones: AiTone[] = ['funny', 'sarcastic', 'wholesome', 'dark-humor', 'relatable'];

  const handleRandomize = () => {
    const randomIndex = Math.floor(Math.random() * EXAMPLE_PROMPT_IDEAS.length);
    const randomIdea = EXAMPLE_PROMPT_IDEAS[randomIndex];
    selectIdea(randomIdea);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await generateCaptions();
  };

  const handleSendToEditor = (caption: AiCaptionSuggestion, mode: 'replace' | 'new') => {
    applyAiCaption({
      text: caption.singleText,
      mode,
      topText: caption.topText,
      bottomText: caption.bottomText,
    });

    setNotification({
      type: 'success',
      message:
        mode === 'replace'
          ? 'AI caption replaced active text in Meme Editor!'
          : 'AI caption added as new layer in Meme Editor!',
    });

    if (onNavigate) {
      onNavigate('/editor');
    } else {
      window.location.hash = '#editor';
    }
  };

  return (
    <section
      id="ai-tools"
      className="scroll-mt-24 bg-gradient-to-b from-[#f0f6ff] via-white to-[#f4f8ff] border border-blue-100 rounded-3xl p-4 sm:p-8 lg:p-10 shadow-sm overflow-hidden"
      aria-label="AI Meme Assistant Workspace"
    >
      <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8">
        {/* ============================================================== */}
        {/* HEADER & DEMO STATUS BADGE                                     */}
        {/* ============================================================== */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-blue-100/80">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/90 text-blue-700 text-xs font-bold tracking-wider uppercase">
              <Bot className="w-3.5 h-3.5 text-blue-600" />
              <span>AI MEME ASSISTANT</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              AI Caption & Meme Idea Generator
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
              Describe your situation, pick a tone, and generate tailored meme punchlines.
            </p>
          </div>

          {/* Live AI Status Badge */}
          <div className="self-start sm:self-center shrink-0">
            <Badge variant="success" size="sm" dot>
              Live AI Backend Connected
            </Badge>
          </div>
        </div>

        {/* ============================================================== */}
        {/* CONTROLS: TONE & LANGUAGE                                      */}
        {/* ============================================================== */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs space-y-4">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            {/* Tone Selector */}
            <div className="space-y-1.5 flex-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                Select Tone
              </label>
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                {tones.map((t) => {
                  const info = AI_TONE_LABELS[t];
                  const isActive = tone === t;
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTone(t)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 cursor-pointer min-h-[38px] hover:-translate-y-0.5 active:scale-95 focus-visible:ring-2 focus-visible:ring-[#1463E9] focus-visible:outline-none ${
                        isActive
                          ? 'bg-[#1463E9] text-white shadow-xs font-bold'
                          : 'bg-slate-50 hover:bg-[#EFF6FF] hover:text-[#1463E9] text-slate-700 border border-slate-200/70'
                      }`}
                    >
                      <span>{info.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Language Selector */}
            <div className="space-y-1.5 shrink-0">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                <Languages className="w-3 h-3 text-blue-600" />
                <span>Language</span>
              </label>
              <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200/70">
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 cursor-pointer min-h-[34px] active:scale-95 ${
                    language === 'en'
                      ? 'bg-white text-[#1463E9] shadow-2xs'
                      : 'text-slate-600 hover:text-[#1463E9]'
                  }`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('ta')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 cursor-pointer min-h-[34px] active:scale-95 ${
                    language === 'ta'
                      ? 'bg-white text-[#1463E9] shadow-2xs'
                      : 'text-slate-600 hover:text-[#1463E9]'
                  }`}
                >
                  தமிழ் (Tamil)
                </button>
              </div>
            </div>
          </div>

          {/* ============================================================== */}
          {/* PROMPT INPUT WITH ACTIONS                                      */}
          {/* ============================================================== */}
          <form onSubmit={handleSubmit} className="space-y-3 pt-1">
            <div className="relative">
              <textarea
                rows={3}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your meme idea, situation, or topic (e.g. 'Studying 10 minutes before the exam' or 'Colleague sending meeting invite at 5 PM')..."
                className="w-full bg-slate-50/70 text-slate-900 placeholder:text-slate-400 text-sm sm:text-base rounded-2xl border border-slate-200 p-3.5 sm:p-4 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 shadow-inner resize-none font-medium transition-all"
              />

              {prompt && (
                <button
                  type="button"
                  onClick={() => setPrompt('')}
                  title="Clear prompt text"
                  className="absolute top-3.5 right-3.5 p-1 rounded-lg text-slate-400 hover:text-[#1463E9] hover:bg-[#EFF6FF] transition-colors cursor-pointer"
                  aria-label="Clear prompt"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Actions Bar under prompt */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-1">
              <div className="flex items-center gap-2 flex-wrap">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleRandomize}
                  leftIcon={<Shuffle className="w-3.5 h-3.5 text-blue-600" />}
                  className="text-xs bg-white hover:bg-slate-50 border-slate-200"
                >
                  Surprise Me
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowIdeasDrawer((prev) => !prev)}
                  leftIcon={<Lightbulb className="w-3.5 h-3.5 text-amber-500" />}
                  rightIcon={
                    showIdeasDrawer ? (
                      <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                    )
                  }
                  className="text-xs text-slate-700 hover:text-blue-700"
                >
                  {showIdeasDrawer ? 'Hide Idea Starters' : 'Browse Idea Starters'}
                </Button>

                {(prompt || captions.length > 0) && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={clearAll}
                    className="text-xs text-slate-500 hover:text-rose-600"
                  >
                    Reset All
                  </Button>
                )}
              </div>

              {/* Generate Button */}
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={isLoading || !prompt.trim()}
                leftIcon={
                  isLoading ? (
                    <LoadingSpinner size="xs" color="white" />
                  ) : (
                    <Wand2 className="w-4 h-4" />
                  )
                }
                className="shadow-md shadow-blue-600/30 hover:shadow-lg font-bold min-h-[44px]"
              >
                {isLoading ? 'Generating Captions...' : 'Generate Captions'}
              </Button>
            </div>
          </form>

          {/* Quick Example Prompt Pills */}
          <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 flex-wrap text-xs">
            <span className="text-slate-400 font-semibold">Try:</span>
            {EXAMPLE_PROMPT_IDEAS.slice(0, 4).map((idea) => (
              <button
                key={idea.id}
                type="button"
                onClick={() => selectIdea(idea)}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-[#EFF6FF] hover:text-[#1463E9] text-slate-700 transition-colors cursor-pointer truncate max-w-[220px]"
                title={idea.prompt}
              >
                {idea.title}
              </button>
            ))}
          </div>
        </div>

        {/* ============================================================== */}
        {/* COLLAPSIBLE IDEA GENERATOR SECTION                             */}
        {/* ============================================================== */}
        {showIdeasDrawer && (
          <div className="bg-slate-50/80 rounded-2xl border border-blue-200/80 p-4 sm:p-6 animate-in slide-in-from-top-2 duration-200">
            <AiIdeaSelector
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              onSelectIdea={(idea) => {
                selectIdea(idea);
                setShowIdeasDrawer(false);
              }}
            />
          </div>
        )}

        {/* ============================================================== */}
        {/* RESULTS, LOADING, ERROR, AND EMPTY STATES                      */}
        {/* ============================================================== */}
        <div>
          {isLoading ? (
            <div className="py-16 text-center space-y-4 bg-white rounded-3xl border border-slate-200/80 shadow-xs flex flex-col items-center justify-center">
              <LoadingSpinner size="xl" color="primary" />
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-800">
                  Cooking up hilarious captions...
                </h3>
                <p className="text-xs text-slate-500">
                  Matching tone <span className="font-semibold text-blue-600">"{tone}"</span> in{' '}
                  <span className="font-semibold text-blue-600">
                    {language === 'ta' ? 'Tamil' : 'English'}
                  </span>
                </p>
              </div>
            </div>
          ) : error ? (
            <ErrorState
              title="Generation Error"
              message={error}
              onRetry={generateCaptions}
              retryLabel="Try Generating Again"
            />
          ) : captions.length > 0 ? (
            /* Results View */
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base sm:text-lg text-slate-900">
                    Generated Suggestions ({captions.length})
                  </h3>
                  <span className="text-xs text-slate-500">
                    Pick a punchline to copy or send to the Meme Editor
                  </span>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={regenerateCaptions}
                  disabled={isLoading}
                  leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />}
                  className="text-xs font-semibold"
                >
                  Regenerate
                </Button>
              </div>

              {/* Grid of Generated Captions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {captions.map((caption) => (
                  <AiCaptionCard
                    key={caption.id}
                    caption={caption}
                    isCopied={copiedCaptionId === caption.id}
                    onCopy={copyCaption}
                    onSendToEditor={handleSendToEditor}
                    showEditorActions
                  />
                ))}
              </div>
            </div>
          ) : hasGeneratedOnce ? (
            <EmptyState
              title="No Captions Generated"
              description="Try entering a slightly different prompt or situation."
              action={
                <Button variant="primary" size="sm" onClick={handleRandomize}>
                  Try an Idea Starter
                </Button>
              }
            />
          ) : (
            /* Pristine Welcome State */
            <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-8 sm:p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-2xs">
                <Wand2 className="w-6 h-6" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Ready to Generate Viral Captions
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                Type what you want your meme to say, or pick an idea from the starters above.
                We'll generate customized, punchy options for your meme canvas.
              </p>
              <div className="pt-2">
                <Button variant="primary" size="sm" onClick={generateCaptions} className="font-semibold">
                  Generate Demo Captions
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
