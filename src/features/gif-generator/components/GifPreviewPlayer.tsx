import React from 'react';
import {
  Download,
  RotateCcw,
  CheckCircle,
  ExternalLink,
  Layers,
  HardDrive,
  Clock,
} from 'lucide-react';
import { useGifStore } from '../stores/useGifStore';
import { useTemplateStore } from '../../../stores/useTemplateStore';
import { useEditorStore } from '../../../stores/useEditorStore';
import { Button } from '../../../components/ui/Button';
import { formatFileSize } from '../../../lib/utils';

interface GifPreviewPlayerProps {
  onNavigate?: (route: string) => void;
}

export const GifPreviewPlayer: React.FC<GifPreviewPlayerProps> = ({ onNavigate }) => {
  const generatedResult = useGifStore((state) => state.generatedResult);
  const resetAll = useGifStore((state) => state.resetAll);
  const setNotification = useTemplateStore((state) => state.setNotification);
  const loadTemplate = useEditorStore((state) => state.loadTemplate);

  if (!generatedResult) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = generatedResult.url;
    link.download = generatedResult.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setNotification({
      type: 'success',
      message: `Downloaded "${generatedResult.filename}" successfully!`,
    });
  };

  const handleOpenEditor = () => {
    if (generatedResult) {
      loadTemplate({
        id: `gif-template-${Date.now()}`,
        name: generatedResult.filename.replace(/\.gif$/i, ''),
        imageUrl: generatedResult.url,
        width: generatedResult.width,
        height: generatedResult.height,
        boxCount: 2,
        category: 'GIF',
        tags: ['gif', 'animation', 'custom'],
        description: 'Generated Animated GIF Meme',
        usageCount: 1,
      });
    }
    if (onNavigate) {
      onNavigate('/editor');
    }
  };

  return (
    <div className="bg-[#071330]/90 border border-cyan-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6 text-center animate-in zoom-in-95 duration-200">
      {/* Header Banner */}
      <div className="flex flex-col items-center gap-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-400/30">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
          <span>GIF Generated Successfully</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
          Your Animated GIF Is Ready!
        </h3>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md">
          Download your GIF or customize it further in the Meme Editor.
        </p>
      </div>

      {/* GIF Playback Frame */}
      <div className="relative max-w-lg mx-auto rounded-2xl overflow-hidden bg-slate-950 border border-white/15 shadow-2xl group flex flex-col">
        <img
          src={generatedResult.url}
          alt="Generated Animated Meme GIF"
          className="w-full h-auto object-contain max-h-[420px]"
        />

        {/* Spec Badges Bar */}
        <div className="bg-slate-900/95 border-t border-white/10 px-4 py-2.5 flex flex-wrap items-center justify-center gap-2">
          <span className="bg-slate-800/90 border border-white/15 px-2.5 py-1 rounded-full text-[11px] font-semibold text-cyan-300">
            {generatedResult.width} × {generatedResult.height} px
          </span>
          <span className="bg-slate-800/90 border border-white/15 px-2.5 py-1 rounded-full text-[11px] font-semibold text-slate-200 flex items-center gap-1">
            <HardDrive className="w-3 h-3 text-slate-400" />
            {formatFileSize(generatedResult.sizeBytes)}
          </span>
          <span className="bg-slate-800/90 border border-white/15 px-2.5 py-1 rounded-full text-[11px] font-semibold text-slate-200 flex items-center gap-1">
            <Layers className="w-3 h-3 text-slate-400" />
            {generatedResult.frameCount} frames
          </span>
          <span className="bg-slate-800/90 border border-white/15 px-2.5 py-1 rounded-full text-[11px] font-semibold text-slate-200 flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-400" />
            {generatedResult.durationSeconds}s @ {generatedResult.fps} FPS
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 max-w-md mx-auto">
        <Button
          variant="primary"
          size="lg"
          leftIcon={<Download className="w-5 h-5" />}
          onClick={handleDownload}
          className="w-full sm:w-auto flex-1 shadow-lg shadow-blue-600/40 text-sm font-bold min-h-[46px]"
        >
          Download GIF
        </Button>

        <Button
          variant="dark"
          size="lg"
          leftIcon={<ExternalLink className="w-4 h-4 text-cyan-400" />}
          onClick={handleOpenEditor}
          className="w-full sm:w-auto border-white/20 text-white hover:text-white hover:bg-white/10 text-sm font-semibold min-h-[46px]"
        >
          Open in Editor
        </Button>

        <Button
          variant="ghost"
          size="lg"
          leftIcon={<RotateCcw className="w-4 h-4 text-slate-400" />}
          onClick={resetAll}
          className="w-full sm:w-auto text-slate-400 hover:text-white hover:bg-white/10 text-xs min-h-[46px]"
        >
          Create Another
        </Button>
      </div>
    </div>
  );
};
