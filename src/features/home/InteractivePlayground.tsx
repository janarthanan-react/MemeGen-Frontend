import React, { useState } from 'react';
import { Download, Copy, Check, ArrowRight, Wand2, RefreshCw, ImageOff } from 'lucide-react';
import { POPULAR_TEMPLATES } from '../../constants/templates';
import type { MemeTemplate } from '../../types/template';
import { useTemplateStore } from '../../stores/useTemplateStore';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

const PRESET_IDEAS = [
  { top: 'When someone compliments my meme', bottom: "I'm not really that special..." },
  { top: 'When code runs with 0 errors', bottom: 'On the very first try' },
  { top: 'Me pretending to understand', bottom: 'What the senior dev just explained' },
  { top: 'Deploying on a Friday at 4:55 PM', bottom: 'What could possibly go wrong?' },
  { top: 'Just 5 minutes of scrolling', bottom: '3 hours later' },
];

export const InteractivePlayground: React.FC = () => {
  const openPreview = useTemplateStore((state) => state.openPreview);
  const setSelectedTemplate = useTemplateStore((state) => state.setSelectedTemplate);
  const selectedTemplate = useTemplateStore((state) => state.selectedTemplate);

  const starterTemplates = POPULAR_TEMPLATES.slice(0, 6);
  const [localTemplate, setLocalTemplate] = useState<MemeTemplate>(starterTemplates[0]);
  const [prevTemplateId, setPrevTemplateId] = useState<string>(
    selectedTemplate?.id || starterTemplates[0].id
  );
  const [imageError, setImageError] = useState(false);
  const [topText, setTopText] = useState('When someone compliments my meme');
  const [bottomText, setBottomText] = useState("I'm not really that special...");
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [isUppercase, setIsUppercase] = useState(true);

  const activeTemplate = selectedTemplate || localTemplate;

  // Sync captions and reset error during render if the active template changed
  if (activeTemplate.id !== prevTemplateId) {
    setPrevTemplateId(activeTemplate.id);
    setImageError(false);
    if (activeTemplate.defaultTextSlots && activeTemplate.defaultTextSlots.length > 0) {
      setTopText(activeTemplate.defaultTextSlots[0]?.placeholder || '');
      setBottomText(activeTemplate.defaultTextSlots[1]?.placeholder || '');
    }
  }

  const handleCopy = () => {
    setCopied(true);
    navigator.clipboard?.writeText?.(
      `Meme created with MemeHub: "${topText}" / "${bottomText}" (${activeTemplate.name})`
    );
    setTimeout(() => setCopied(false), 2200);
  };

  const handleDownload = () => {
    setDownloaded(true);
    // Create an invisible canvas to export image with text
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = activeTemplate.imageUrl;

    img.onload = () => {
      canvas.width = img.width || 800;
      canvas.height = img.height || 800;
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = Math.max(4, canvas.width / 80);
        ctx.textAlign = 'center';
        ctx.font = `900 ${Math.max(28, canvas.width / 16)}px sans-serif`;

        const renderText = (t: string) => (isUppercase ? t.toUpperCase() : t);

        if (topText) {
          ctx.strokeText(renderText(topText), canvas.width / 2, canvas.height * 0.12);
          ctx.fillText(renderText(topText), canvas.width / 2, canvas.height * 0.12);
        }
        if (bottomText) {
          ctx.strokeText(renderText(bottomText), canvas.width / 2, canvas.height * 0.92);
          ctx.fillText(renderText(bottomText), canvas.width / 2, canvas.height * 0.92);
        }

        // Draw clean MemeHub emoji watermark in bottom-right corner
        const wmImg = new Image();
        wmImg.crossOrigin = 'anonymous';
        wmImg.src = '/logo-emoji.png';
        wmImg.onload = () => {
          const wmSize = Math.max(28, canvas.height * 0.065);
          ctx.save();
          ctx.shadowColor = 'rgba(0,0,0,0.6)';
          ctx.shadowBlur = 6;
          ctx.globalAlpha = 0.9;
          ctx.drawImage(wmImg, canvas.width - wmSize - 14, canvas.height - wmSize - 14, wmSize, wmSize);
          ctx.restore();

          const link = document.createElement('a');
          link.download = `${activeTemplate.id}-meme.png`;
          link.href = canvas.toDataURL('image/png');
          link.click();
        };
        wmImg.onerror = () => {
          const link = document.createElement('a');
          link.download = `${activeTemplate.id}-meme.png`;
          link.href = canvas.toDataURL('image/png');
          link.click();
        };
      }
      setTimeout(() => setDownloaded(false), 2000);
    };

    img.onerror = () => {
      setTimeout(() => setDownloaded(false), 1500);
    };
  };

  const handleRandomPreset = () => {
    const random = PRESET_IDEAS[Math.floor(Math.random() * PRESET_IDEAS.length)];
    setTopText(random.top);
    setBottomText(random.bottom);
  };

  const handleOpenStudio = () => {
    setSelectedTemplate(activeTemplate);
    openPreview(activeTemplate);
  };

  return (
    <section
      id="create"
      className="scroll-mt-24 bg-slate-50/70 border border-slate-200/90 rounded-3xl p-6 sm:p-10 lg:p-12 relative overflow-hidden shadow-sm"
      aria-label="Interactive Meme Playground"
    >
      <div id="playground" className="sr-only" />
      {/* Background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider">
          <Wand2 className="w-3.5 h-3.5" />
          <span>Quick Studio</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Instant Meme Playground
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 font-normal">
          Customize captions in real-time right here, or open any template in the full studio.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center max-w-5xl mx-auto">
        {/* Left Column: Live Canvas Preview */}
        <div className="lg:col-span-6 flex flex-col items-center">
          <div className="relative w-full max-w-md bg-white rounded-2xl p-3 shadow-xl hover:shadow-2xl border border-slate-200 transition-shadow duration-300 group">
            <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-slate-900">
              {!imageError ? (
                <img
                  src={activeTemplate.imageUrl}
                  alt={activeTemplate.name}
                  onError={() => setImageError(true)}
                  className="w-full h-full object-cover select-none group-hover:scale-103 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-800 text-slate-300 p-6 text-center">
                  <ImageOff className="w-12 h-12 text-slate-500 mb-2" />
                  <p className="font-semibold text-sm text-white">{activeTemplate.name}</p>
                  <p className="text-xs text-slate-400 mt-1">Image preview unavailable</p>
                </div>
              )}

              {/* Live Top Text */}
              {topText && (
                <div
                  className="absolute top-4 inset-x-3 text-center font-extrabold text-white text-base sm:text-xl tracking-wide uppercase select-none pointer-events-none transition-all leading-tight drop-shadow-md"
                  style={{
                    textShadow:
                      '2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 0 2px 0 #000',
                  }}
                >
                  {isUppercase ? topText.toUpperCase() : topText}
                </div>
              )}

              {/* Live Bottom Text */}
              {bottomText && (
                <div
                  className="absolute bottom-4 inset-x-3 text-center font-extrabold text-white text-base sm:text-xl tracking-wide uppercase select-none pointer-events-none transition-all leading-tight drop-shadow-md"
                  style={{
                    textShadow:
                      '2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 0 2px 0 #000',
                  }}
                >
                  {isUppercase ? bottomText.toUpperCase() : bottomText}
                </div>
              )}

              {/* Watermark Tag */}
              <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/60 border border-white/10 backdrop-blur-xs flex items-center gap-1.5 select-none shadow-md">
                <img src="/logo-emoji.png" alt="MemeHub" className="w-4 h-4 object-contain" />
                <span className="text-[9px] font-bold text-white/80">MemeHub</span>
              </div>
            </div>

            {/* Canvas Actions Bar */}
            <div className="mt-3 flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleCopy}
                leftIcon={copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                className="flex-1 min-h-[42px]"
              >
                {copied ? 'Copied' : 'Copy'}
              </Button>

              <Button
                variant="primary"
                size="sm"
                onClick={handleDownload}
                leftIcon={downloaded ? <Check className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
                className="flex-1 min-h-[42px]"
              >
                {downloaded ? 'Saved!' : 'Download'}
              </Button>

              <Button
                variant="dark"
                size="sm"
                onClick={handleOpenStudio}
                rightIcon={<ArrowRight className="w-3 h-3" />}
                className="bg-slate-900 text-white hover:bg-slate-800 min-h-[42px]"
                title="Open in full studio"
              >
                Studio
              </Button>
            </div>
          </div>
        </div>

        {/* Right Column: Controls & Presets */}
        <div className="lg:col-span-6 space-y-5 text-left">
          {/* Template Switcher */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
              1. Choose Starter Template
            </label>
            <div className="flex flex-wrap gap-2">
              {starterTemplates.map((template) => {
                const isActive = activeTemplate.id === template.id;
                return (
                  <button
                    key={template.id}
                    type="button"
                    onClick={() => {
                      setLocalTemplate(template);
                      setSelectedTemplate(template);
                    }}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] cursor-pointer min-h-[36px] flex items-center focus-visible:ring-2 focus-visible:ring-[#1463E9] focus-visible:outline-none ${
                      isActive
                        ? 'bg-[#1463E9] text-white shadow-sm shadow-blue-600/30 ring-2 ring-blue-600/20'
                        : 'bg-white border border-[#1463E9]/30 text-[#1463E9] hover:bg-[#EFF6FF] hover:border-[#1463E9] shadow-2xs'
                    }`}
                  >
                    {template.name}
                  </button>
                );
              })}

              {!starterTemplates.some((t) => t.id === activeTemplate.id) && (
                <button
                  type="button"
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-600 text-white shadow-sm shadow-blue-600/30 ring-2 ring-blue-600/20 min-h-[36px] flex items-center"
                >
                  {activeTemplate.name}
                </button>
              )}
            </div>
          </div>

          {/* Caption Inputs */}
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Top Caption
                </label>
                <button
                  type="button"
                  onClick={handleRandomPreset}
                  className="text-[11px] font-semibold text-[#1463E9] hover:text-[#0E52C7] flex items-center gap-1 cursor-pointer transition-colors duration-200"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Random Joke Idea</span>
                </button>
              </div>
              <Input
                variant="light"
                inputSize="md"
                value={topText}
                onChange={(e) => setTopText(e.target.value)}
                placeholder="TOP CAPTION GOES HERE..."
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                Bottom Caption
              </label>
              <Input
                variant="light"
                inputSize="md"
                value={bottomText}
                onChange={(e) => setBottomText(e.target.value)}
                placeholder="BOTTOM CAPTION GOES HERE..."
              />
            </div>
          </div>

          {/* Quick Style Options */}
          <div className="flex items-center gap-4 pt-1">
            <button
              type="button"
              onClick={() => setIsUppercase(!isUppercase)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-[#1463E9] focus-visible:outline-none ${
                isUppercase
                  ? 'bg-[#EFF6FF] border-blue-300 text-[#1463E9] shadow-2xs'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-[#EFF6FF] hover:text-[#1463E9]'
              }`}
            >
              ALL CAPS: {isUppercase ? 'ON' : 'OFF'}
            </button>

            <span className="text-xs text-slate-400">
              Live preview updates instantly
            </span>
          </div>

          {/* Helper hint with Studio link */}
          <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-100/80 text-xs text-blue-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-2">
              <Wand2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <p>
                Want advanced text dragging, custom fonts, outlines, and multi-layer captions? Launch the <strong>Meme Studio Editor</strong>.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setSelectedTemplate(activeTemplate);
                window.history.pushState({}, '', '/editor');
                window.dispatchEvent(new Event('popstate'));
              }}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1463E9] hover:bg-[#0E52C7] text-white font-semibold text-xs shadow-sm hover:shadow-md hover:shadow-blue-500/25 transition-all duration-200 cursor-pointer shrink-0 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-[#1463E9] focus-visible:outline-none"
            >
              <span>Open in Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
