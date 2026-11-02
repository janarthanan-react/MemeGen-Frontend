import React, { useRef } from 'react';
import {
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Info,
} from 'lucide-react';
import { useGifStore } from '../stores/useGifStore';
import type { ImageSequenceFrame } from '../types/gif';

export const ImageSequenceManager: React.FC = () => {
  const imageFrames = useGifStore((state) => state.imageFrames);
  const addImageFrames = useGifStore((state) => state.addImageFrames);
  const removeImageFrame = useGifStore((state) => state.removeImageFrame);
  const reorderImageFrames = useGifStore((state) => state.reorderImageFrames);
  const updateImageFrameDelay = useGifStore((state) => state.updateImageFrameDelay);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddMore = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const fileList = Array.from(e.target.files);

    const promises = fileList.map(
      (file) =>
        new Promise<ImageSequenceFrame>((resolve) => {
          const reader = new FileReader();
          reader.onload = (ev) => {
            const dataUrl = ev.target?.result as string;
            const img = new Image();
            img.onload = () => {
              resolve({
                id: `img-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
                dataUrl,
                delayMs: 250,
                filename: file.name,
                width: img.naturalWidth || 500,
                height: img.naturalHeight || 500,
              });
            };
            img.src = dataUrl;
          };
          reader.readAsDataURL(file);
        })
    );

    Promise.all(promises).then((frames) => {
      addImageFrames(frames);
    });
  };

  const handleGlobalDelayChange = (delayMs: number) => {
    imageFrames.forEach((frame) => {
      updateImageFrameDelay(frame.id, delayMs);
    });
  };

  return (
    <div className="space-y-4 bg-[#071330]/80 border border-white/10 rounded-3xl p-4 sm:p-6 shadow-xl backdrop-blur-md">
      {/* Header with frame count and global speed */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>Image Sequence Frames</span>
            <span className="text-xs bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded-full font-mono">
              {imageFrames.length} {imageFrames.length === 1 ? 'frame' : 'frames'}
            </span>
          </h3>
          <p className="text-xs text-slate-400">
            Reorder frames or adjust animation timing between images.
          </p>
        </div>

        {/* Global Frame Timing Preset Buttons */}
        <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-xl border border-white/10 shrink-0">
          <Clock className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
          <span className="text-[11px] font-semibold text-slate-400 mr-1">Speed:</span>
          {[
            { label: 'Fast', ms: 120 },
            { label: 'Normal', ms: 250 },
            { label: 'Slow', ms: 500 },
          ].map((preset) => (
            <button
              key={preset.ms}
              type="button"
              onClick={() => handleGlobalDelayChange(preset.ms)}
              className="text-[10px] font-semibold text-slate-300 hover:text-white px-2 py-1 rounded-lg hover:bg-white/10 transition-all duration-150 active:scale-95 cursor-pointer"
            >
              {preset.label} ({preset.ms}ms)
            </button>
          ))}
        </div>
      </div>

      {/* Notice for single-image upload */}
      {imageFrames.length === 1 && (
        <div className="p-3.5 rounded-2xl bg-cyan-950/50 border border-cyan-500/30 text-xs text-cyan-200 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <strong className="block font-semibold">Single Image Mode Active:</strong>
            <span>
              We will generate an animated meme loop with pulsing bounce effects on your captions so it produces a genuine animated GIF. Add more images if you want a slideshow GIF.
            </span>
          </div>
        </div>
      )}

      {/* Frame Cards Grid / Horizontal Slider */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 scrollbar-thin">
        {imageFrames.map((frame, index) => (
          <div
            key={frame.id}
            className="flex flex-col items-center gap-2 p-2 rounded-2xl bg-white/5 border border-white/10 shrink-0 w-36 group relative"
          >
            {/* Frame Badge */}
            <div className="w-full flex items-center justify-between text-[11px] font-bold text-slate-400 px-1">
              <span>#{index + 1}</span>
              <button
                type="button"
                onClick={() => removeImageFrame(frame.id)}
                className="text-slate-400 hover:text-rose-400 transition-all duration-150 cursor-pointer p-0.5 rounded-md hover:bg-rose-950/40 active:scale-90"
                aria-label={`Remove frame ${index + 1}`}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Thumbnail */}
            <div className="w-full aspect-square rounded-xl overflow-hidden bg-slate-900 border border-white/10 relative">
              <img
                src={frame.dataUrl}
                alt={`Frame ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Frame Delay Input */}
            <div className="w-full flex items-center justify-between gap-1 text-[10px] text-slate-400 px-0.5">
              <span>Delay:</span>
              <input
                type="number"
                min={30}
                max={3000}
                step={50}
                value={frame.delayMs}
                onChange={(e) =>
                  updateImageFrameDelay(frame.id, parseInt(e.target.value, 10) || 250)
                }
                className="w-14 text-center font-mono bg-slate-900/90 border border-white/15 rounded-md text-white py-0.5 text-[10px]"
                aria-label={`Delay for frame ${index + 1} in milliseconds`}
              />
              <span>ms</span>
            </div>

            {/* Reorder Arrows */}
            <div className="w-full flex items-center justify-center gap-1 pt-1 border-t border-white/10">
              <button
                type="button"
                disabled={index === 0}
                onClick={() => reorderImageFrames(index, index - 1)}
                className="p-1 rounded-md text-slate-400 hover:text-white disabled:opacity-20 disabled:pointer-events-none hover:bg-white/10 cursor-pointer transition-all duration-150 active:scale-90"
                aria-label="Move frame left"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                disabled={index === imageFrames.length - 1}
                onClick={() => reorderImageFrames(index, index + 1)}
                className="p-1 rounded-md text-slate-400 hover:text-white disabled:opacity-20 disabled:pointer-events-none hover:bg-white/10 cursor-pointer transition-all duration-150 active:scale-90"
                aria-label="Move frame right"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}

        {/* Add More Frame Slot */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 border-dashed border-white/15 hover:border-cyan-400 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white shrink-0 w-36 aspect-square transition-all duration-200 cursor-pointer group hover:-translate-y-0.5 active:scale-95 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none"
        >
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Plus className="w-4 h-4 text-cyan-400" />
          </div>
          <span className="text-xs font-semibold text-center">Add Images</span>
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          multiple
          onChange={handleAddMore}
          className="hidden"
        />
      </div>
    </div>
  );
};
