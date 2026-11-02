import React from 'react';
import {
  SlidersHorizontal,
  Gauge,
  Maximize2,
  Repeat,
  Zap,
} from 'lucide-react';
import { useGifStore } from '../stores/useGifStore';
import type { GifResolutionPreset } from '../types/gif';

export const GifSettingsPanel: React.FC = () => {
  const settings = useGifStore((state) => state.settings);
  const setSettings = useGifStore((state) => state.setSettings);

  const fpsOptions = [
    { value: 5, label: '5 FPS', desc: 'Compact size' },
    { value: 10, label: '10 FPS', desc: 'Balanced' },
    { value: 15, label: '15 FPS', desc: 'Smooth' },
    { value: 20, label: '20 FPS', desc: 'Ultra smooth' },
  ];

  const resolutionOptions: { value: GifResolutionPreset; label: string; desc: string }[] = [
    { value: '320', label: '320px', desc: 'Small' },
    { value: '480', label: '480px', desc: 'Standard' },
    { value: '640', label: '640px', desc: 'High Res' },
  ];

  const speedOptions = [
    { value: 0.5, label: '0.5x' },
    { value: 1.0, label: '1.0x (Normal)' },
    { value: 1.5, label: '1.5x' },
    { value: 2.0, label: '2.0x (Fast)' },
  ];

  return (
    <div className="bg-[#071330]/80 border border-white/10 rounded-3xl p-4 sm:p-6 shadow-xl backdrop-blur-md space-y-4">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
          <span>GIF Encoding & Quality</span>
        </h3>
        <span className="text-[11px] text-slate-400 font-mono">GIF89a Spec</span>
      </div>

      {/* Frame Rate (FPS) */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
          <Gauge className="w-3.5 h-3.5 text-cyan-400" />
          <span>Frame Rate</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {fpsOptions.map((opt) => {
            const isSelected = settings.fps === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setSettings({ fps: opt.value })}
                className={`p-2 rounded-xl border text-center transition-all duration-200 cursor-pointer hover:-translate-y-0.5 active:scale-95 focus-visible:ring-2 focus-visible:ring-[#1463E9] focus-visible:outline-none ${
                  isSelected
                    ? 'bg-[#1463E9] border-blue-400 text-white shadow-xs shadow-blue-500/30 ring-1 ring-blue-400/40'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10 hover:border-white/20'
                }`}
              >
                <div className="font-bold text-xs">{opt.label}</div>
                <div className="text-[10px] text-slate-400">{opt.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Output Resolution Preset */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
          <Maximize2 className="w-3.5 h-3.5 text-blue-400" />
          <span>Resolution Width</span>
        </label>
        <div className="grid grid-cols-3 gap-2">
          {resolutionOptions.map((opt) => {
            const isSelected = settings.resolution === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setSettings({ resolution: opt.value })}
                className={`p-2 rounded-xl border text-center transition-all duration-200 cursor-pointer hover:-translate-y-0.5 active:scale-95 focus-visible:ring-2 focus-visible:ring-[#1463E9] focus-visible:outline-none ${
                  isSelected
                    ? 'bg-[#1463E9] border-blue-400 text-white shadow-xs shadow-blue-500/30 ring-1 ring-blue-400/40'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10 hover:border-white/20'
                }`}
              >
                <div className="font-bold text-xs">{opt.label}</div>
                <div className="text-[10px] text-slate-400">{opt.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Playback Speed & Looping */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-white/10">
        {/* Speed */}
        <div className="space-y-1">
          <label htmlFor="gif-playback-speed" className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Playback Speed</span>
          </label>
          <select
            id="gif-playback-speed"
            value={settings.speed}
            onChange={(e) => setSettings({ speed: parseFloat(e.target.value) })}
            className="w-full bg-slate-900/90 text-white text-xs rounded-xl px-3 py-2 border border-white/15 focus:outline-none focus:border-cyan-400 cursor-pointer"
          >
            {speedOptions.map((s) => (
              <option key={s.value} value={s.value} className="bg-slate-900 text-white">
                {s.label}
              </option>
            ))}
          </select>
        </div>

        {/* Looping Mode */}
        <div className="space-y-1">
          <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Repeat className="w-3.5 h-3.5 text-purple-400" />
            <span>Loop Behavior</span>
          </span>
          <button
            type="button"
            onClick={() => setSettings({ loopCount: settings.loopCount === 0 ? 1 : 0 })}
            className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold transition-all duration-200 cursor-pointer hover:-translate-y-0.5 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:outline-none ${
              settings.loopCount === 0
                ? 'bg-purple-950/70 border-purple-500/50 text-purple-200 shadow-xs'
                : 'bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <span>{settings.loopCount === 0 ? 'Infinite Loop (Repeat Forever)' : 'Play Once (No Loop)'}</span>
          </button>
        </div>
      </div>

      {/* Dithering Option */}
      <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs">
        <div>
          <span className="font-semibold text-white block">Floyd-Steinberg Dithering</span>
          <span className="text-[11px] text-slate-400">Smoother color gradients at slightly higher file size</span>
        </div>
        <button
          type="button"
          onClick={() => setSettings({ dither: !settings.dither })}
          className={`w-11 h-6 rounded-full transition-all duration-150 relative cursor-pointer active:scale-95 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none ${
            settings.dither ? 'bg-cyan-500 shadow-xs shadow-cyan-500/40' : 'bg-slate-700'
          }`}
          aria-label="Toggle Floyd-Steinberg Dithering"
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
              settings.dither ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>
    </div>
  );
};
