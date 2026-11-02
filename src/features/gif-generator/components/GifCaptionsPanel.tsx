import React from 'react';
import { Type, CaseSensitive } from 'lucide-react';
import { useGifStore } from '../stores/useGifStore';

const FONT_FAMILIES = [
  { label: 'Impact (Classic Meme)', value: 'Impact' },
  { label: 'Inter (Clean Modern)', value: 'Inter' },
  { label: 'Arial (Bold Neutral)', value: 'Arial' },
  { label: 'Comic Sans MS (Casual)', value: 'Comic Sans MS' },
];

export const GifCaptionsPanel: React.FC = () => {
  const caption = useGifStore((state) => state.caption);
  const setCaption = useGifStore((state) => state.setCaption);

  return (
    <div className="bg-[#071330]/80 border border-white/10 rounded-3xl p-4 sm:p-6 shadow-xl backdrop-blur-md space-y-4">
      <div className="border-b border-white/10 pb-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Type className="w-4 h-4 text-cyan-400" />
          <span>Meme Captions (Burn into GIF)</span>
        </h3>
        <p className="text-xs text-slate-400">
          Overlay animated top and bottom captions directly onto your GIF frames.
        </p>
      </div>

      {/* Top and Bottom Text Inputs */}
      <div className="space-y-3">
        <div>
          <label htmlFor="gif-top-caption" className="block text-xs font-semibold text-slate-300 mb-1">
            Top Caption
          </label>
          <input
            id="gif-top-caption"
            type="text"
            value={caption.topText}
            onChange={(e) => setCaption({ topText: e.target.value })}
            placeholder="WHEN MY CODE RUNS FIRST TRY"
            className="w-full bg-slate-900/90 text-white placeholder-slate-500 text-sm rounded-xl px-3.5 py-2.5 border border-white/15 focus:outline-none focus:border-cyan-400 transition-colors"
          />
        </div>

        <div>
          <label htmlFor="gif-bottom-caption" className="block text-xs font-semibold text-slate-300 mb-1">
            Bottom Caption
          </label>
          <input
            id="gif-bottom-caption"
            type="text"
            value={caption.bottomText}
            onChange={(e) => setCaption({ bottomText: e.target.value })}
            placeholder="AND NO TEST FAILS"
            className="w-full bg-slate-900/90 text-white placeholder-slate-500 text-sm rounded-xl px-3.5 py-2.5 border border-white/15 focus:outline-none focus:border-cyan-400 transition-colors"
          />
        </div>
      </div>

      {/* Font & Styling Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        {/* Font Family */}
        <div className="space-y-1">
          <label htmlFor="gif-font-family" className="text-xs font-semibold text-slate-300">
            Font Family
          </label>
          <select
            id="gif-font-family"
            value={caption.fontFamily}
            onChange={(e) => setCaption({ fontFamily: e.target.value })}
            className="w-full bg-slate-900/90 text-white text-xs rounded-xl px-3 py-2 border border-white/15 focus:outline-none focus:border-cyan-400 cursor-pointer"
          >
            {FONT_FAMILIES.map((f) => (
              <option key={f.value} value={f.value} className="bg-slate-900 text-white">
                {f.label}
              </option>
            ))}
          </select>
        </div>

        {/* Font Size */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span>Font Size</span>
            <span className="font-mono text-cyan-400 font-bold">{caption.fontSize}px</span>
          </div>
          <input
            type="range"
            min={18}
            max={64}
            value={caption.fontSize}
            onChange={(e) => setCaption({ fontSize: parseInt(e.target.value, 10) })}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
        </div>
      </div>

      {/* Colors & Options Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1 border-t border-white/10 items-center">
        {/* Text Fill Color */}
        <div className="flex items-center gap-2 bg-white/5 p-2 rounded-xl border border-white/10">
          <input
            type="color"
            value={caption.color}
            onChange={(e) => setCaption({ color: e.target.value })}
            className="w-7 h-7 rounded-lg border-0 cursor-pointer bg-transparent"
            title="Text Color"
          />
          <span className="text-xs text-slate-300 font-medium">Text Color</span>
        </div>

        {/* Outline Stroke Color */}
        <div className="flex items-center gap-2 bg-white/5 p-2 rounded-xl border border-white/10">
          <input
            type="color"
            value={caption.strokeColor}
            onChange={(e) => setCaption({ strokeColor: e.target.value })}
            className="w-7 h-7 rounded-lg border-0 cursor-pointer bg-transparent"
            title="Outline Color"
          />
          <span className="text-xs text-slate-300 font-medium">Outline</span>
        </div>

        {/* Uppercase Toggle */}
        <button
          type="button"
          onClick={() => setCaption({ isUppercase: !caption.isUppercase })}
          className={`flex items-center justify-center gap-2 p-2 rounded-xl border transition-all duration-200 col-span-2 sm:col-span-1 cursor-pointer text-xs font-semibold hover:-translate-y-0.5 active:scale-95 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none ${
            caption.isUppercase
              ? 'bg-cyan-950/70 border-cyan-500/50 text-cyan-300 shadow-xs shadow-cyan-500/20'
              : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:border-white/20'
          }`}
        >
          <CaseSensitive className="w-4 h-4" />
          <span>ALL CAPS</span>
        </button>
      </div>
    </div>
  );
};
