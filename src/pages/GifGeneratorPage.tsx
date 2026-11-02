import React, { useState } from 'react';
import {
  Film,
  ArrowLeft,
  RotateCcw,
  AlertCircle,
  HelpCircle,
  Wand2,
} from 'lucide-react';
import { Container } from '../components/ui/Container';
import { Button } from '../components/ui/Button';
import { GifDropzone } from '../features/gif-generator/components/GifDropzone';
import { VideoTrimmer } from '../features/gif-generator/components/VideoTrimmer';
import { ImageSequenceManager } from '../features/gif-generator/components/ImageSequenceManager';
import { GifCaptionsPanel } from '../features/gif-generator/components/GifCaptionsPanel';
import { GifSettingsPanel } from '../features/gif-generator/components/GifSettingsPanel';
import { GifProgressBar } from '../features/gif-generator/components/GifProgressBar';
import { GifPreviewPlayer } from '../features/gif-generator/components/GifPreviewPlayer';
import { useGifStore } from '../features/gif-generator/stores/useGifStore';

export interface GifGeneratorPageProps {
  onNavigate?: (route: string) => void;
}

export const GifGeneratorPage: React.FC<GifGeneratorPageProps> = ({ onNavigate }) => {
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null);

  const sourceType = useGifStore((state) => state.sourceType);
  const videoUrl = useGifStore((state) => state.videoUrl);
  const imageFrames = useGifStore((state) => state.imageFrames);
  const progress = useGifStore((state) => state.progress);
  const generatedResult = useGifStore((state) => state.generatedResult);
  const error = useGifStore((state) => state.error);
  const startGenerating = useGifStore((state) => state.startGenerating);
  const resetAll = useGifStore((state) => state.resetAll);

  const isGenerating =
    progress.phase === 'extracting' ||
    progress.phase === 'quantizing' ||
    progress.phase === 'encoding';

  const hasMediaSource = Boolean(videoUrl || imageFrames.length > 0);

  const handleGenerateClick = () => {
    startGenerating(videoElement);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-24 sm:pt-28 pb-20 selection:bg-blue-600 selection:text-white relative">
      {/* Subtle Background Glow Elements */}
      <div className="absolute top-16 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-32 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <Container className="space-y-8 relative z-10">
        {/* Navigation Breadcrumb / Top Bar */}
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => (onNavigate ? onNavigate('/') : (window.location.hash = '#home'))}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-300 hover:text-white transition-all duration-200 active:scale-95 cursor-pointer py-1.5 px-3 rounded-xl hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>

          <div className="flex items-center gap-3">
            {hasMediaSource && (
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
                onClick={resetAll}
                disabled={isGenerating}
                className="text-slate-400 hover:text-white text-xs"
              >
                Reset All
              </Button>
            )}

            <Button
              variant="dark"
              size="sm"
              onClick={() => (onNavigate ? onNavigate('/editor') : (window.location.hash = '#editor'))}
              className="border-white/15 text-slate-200 hover:text-white hover:bg-white/10 text-xs hidden xs:inline-flex"
            >
              Open Meme Editor &rarr;
            </Button>
          </div>
        </div>

        {/* Page Banner Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-gradient-to-br from-[#071330] via-slate-900 to-[#0c1f4a] p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="space-y-2 max-w-2xl relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/15 text-cyan-300 text-xs font-semibold border border-cyan-400/30">
              <Film className="w-3.5 h-3.5 text-cyan-400" />
              <span>Day 5 • GIF Studio</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white">
              GIF Meme Generator
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Convert video clips or image bursts into high-quality animated GIFs with customizable text, custom frame rates, and zero external software.
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-3 shrink-0">
            {hasMediaSource && !generatedResult && (
              <Button
                variant="primary"
                size="lg"
                leftIcon={<Wand2 className="w-4 h-4" />}
                onClick={handleGenerateClick}
                disabled={isGenerating}
                className="shadow-lg shadow-blue-600/40 font-bold min-h-[46px]"
              >
                {isGenerating ? 'Encoding GIF...' : 'Generate Animated GIF'}
              </Button>
            )}
          </div>
        </div>

        {/* Global Error Banner */}
        {error && (
          <div
            role="alert"
            className="p-4 rounded-2xl bg-rose-950/70 border border-rose-500/50 text-rose-200 text-xs sm:text-sm flex items-start gap-3 animate-in fade-in duration-200"
          >
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <strong className="block font-semibold">Generation Error</strong>
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* Progress Bar during conversion */}
        <GifProgressBar />

        {/* Main Stage Switcher */}
        {generatedResult ? (
          /* Step 3: Completed GIF Playback & Download */
          <GifPreviewPlayer onNavigate={onNavigate} />
        ) : !hasMediaSource ? (
          /* Step 1: Upload / Dropzone empty state */
          <GifDropzone />
        ) : (
          /* Step 2: Media Loaded — Interactive Trimmer & Controls */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left 7 Columns: Video Trimmer or Image Manager */}
            <div className="lg:col-span-7 space-y-6">
              {sourceType === 'video' ? (
                <VideoTrimmer onVideoElementReady={setVideoElement} />
              ) : (
                <ImageSequenceManager />
              )}

              {/* Captions Panel */}
              <GifCaptionsPanel />
            </div>

            {/* Right 5 Columns: Encoding Settings & Generate CTA */}
            <div className="lg:col-span-5 space-y-6">
              <GifSettingsPanel />

              {/* Generate Primary Action Card */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-900/40 to-cyan-900/20 border border-cyan-500/30 shadow-xl space-y-4 text-center">
                <div className="space-y-1">
                  <h4 className="text-base font-bold text-white flex items-center justify-center gap-2">
                    <Film className="w-4 h-4 text-cyan-400" />
                    <span>Ready to Create?</span>
                  </h4>
                  <p className="text-xs text-slate-300">
                    Client-side NeuQuant color quantization + LZW compression.
                  </p>
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  leftIcon={<Wand2 className="w-5 h-5" />}
                  onClick={handleGenerateClick}
                  disabled={isGenerating}
                  className="shadow-xl shadow-blue-600/40 text-base font-extrabold py-3.5 min-h-[50px]"
                >
                  {isGenerating ? 'Processing Frames...' : 'Generate Animated GIF'}
                </Button>

                <p className="text-[11px] text-slate-400">
                  Instant download • No watermarks • High quality GIF89a
                </p>
              </div>

              {/* Tips & Specs Card */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-slate-400 space-y-2">
                <div className="flex items-center gap-1.5 font-semibold text-slate-300">
                  <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Pro Creator Tips</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-[11px] leading-relaxed text-slate-300">
                  <li>Keep video clips under 4 seconds for compact, easily shareable file sizes.</li>
                  <li>Use <strong>10 FPS</strong> for the best balance between smoothness and speed.</li>
                  <li>Captions are automatically sized to fit mobile and desktop displays.</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
};

export default GifGeneratorPage;
