import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  Play,
  Pause,
  Scissors,
  Film,
} from 'lucide-react';
import { useGifStore } from '../stores/useGifStore';

interface VideoTrimmerProps {
  onVideoElementReady: (el: HTMLVideoElement | null) => void;
}

export const VideoTrimmer: React.FC<VideoTrimmerProps> = ({ onVideoElementReady }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoUrl = useGifStore((state) => state.videoUrl);
  const videoMetadata = useGifStore((state) => state.videoMetadata);
  const trimSettings = useGifStore((state) => state.trimSettings);
  const setTrimSettings = useGifStore((state) => state.setTrimSettings);
  const settings = useGifStore((state) => state.settings);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const duration = videoMetadata?.duration || 5;
  const clipDuration = Math.max(0.1, trimSettings.endTime - trimSettings.startTime);
  const estimatedFrames = Math.max(
    1,
    Math.round(clipDuration * settings.fps * settings.speed)
  );

  useEffect(() => {
    if (videoRef.current) {
      onVideoElementReady(videoRef.current);
    }
    return () => {
      onVideoElementReady(null);
    };
  }, [onVideoElementReady]);

  // Sync play/pause state and enforce clip loop
  const handleTimeUpdate = useCallback(() => {
    if (!videoRef.current) return;
    const time = videoRef.current.currentTime;
    setCurrentTime(time);

    // If reached or exceeded trim end time while playing, loop back to start
    if (isPlaying && time >= trimSettings.endTime) {
      videoRef.current.currentTime = trimSettings.startTime;
      videoRef.current.play().catch(() => {});
    }
  }, [isPlaying, trimSettings.startTime, trimSettings.endTime]);

  const togglePlayPause = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      if (
        videoRef.current.currentTime >= trimSettings.endTime ||
        videoRef.current.currentTime < trimSettings.startTime
      ) {
        videoRef.current.currentTime = trimSettings.startTime;
      }
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const handleSetStartToCurrent = () => {
    const newStart = Math.min(currentTime, trimSettings.endTime - 0.2);
    setTrimSettings({ startTime: Math.max(0, newStart) });
  };

  const handleSetEndToCurrent = () => {
    const newEnd = Math.max(currentTime, trimSettings.startTime + 0.2);
    setTrimSettings({ endTime: Math.min(duration, newEnd) });
  };

  const handleStartTimeChange = (val: number) => {
    const clamped = Math.max(0, Math.min(val, trimSettings.endTime - 0.2));
    setTrimSettings({ startTime: clamped });
    if (videoRef.current) videoRef.current.currentTime = clamped;
  };

  const handleEndTimeChange = (val: number) => {
    const clamped = Math.min(duration, Math.max(val, trimSettings.startTime + 0.2));
    setTrimSettings({ endTime: clamped });
  };

  return (
    <div className="space-y-4 bg-[#071330]/80 border border-white/10 rounded-3xl p-4 sm:p-6 shadow-xl backdrop-blur-md">
      {/* Video Viewport Stage */}
      <div className="relative rounded-2xl overflow-hidden bg-slate-950 aspect-video max-h-[380px] flex items-center justify-center border border-white/10 group">
        {videoUrl && (
          <video
            ref={videoRef}
            src={videoUrl}
            onTimeUpdate={handleTimeUpdate}
            onEnded={() => setIsPlaying(false)}
            playsInline
            muted
            className="w-full h-full object-contain"
          />
        )}

        {/* Center Play/Pause Overlay */}
        <button
          type="button"
          onClick={togglePlayPause}
          className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-[#1463E9] text-white flex items-center justify-center shadow-lg shadow-blue-900/50 hover:bg-[#0E52C7] active:bg-[#0B43A6] hover:-translate-y-0.5 active:scale-95 transition-all duration-200 cursor-pointer border border-white/30 backdrop-blur-sm z-20 group-hover:opacity-100 opacity-90 focus-visible:ring-2 focus-visible:ring-[#1463E9]"
          aria-label={isPlaying ? 'Pause video clip' : 'Play video clip'}
        >
          {isPlaying ? <Pause className="w-6 h-6 fill-white" /> : <Play className="w-6 h-6 fill-white ml-0.5" />}
        </button>

        {/* Floating Clip Badge */}
        <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/15 text-[11px] font-semibold text-cyan-300 flex items-center gap-1.5 z-20">
          <Film className="w-3.5 h-3.5 text-cyan-400" />
          <span>
            Clip: {trimSettings.startTime.toFixed(1)}s - {trimSettings.endTime.toFixed(1)}s ({clipDuration.toFixed(1)}s)
          </span>
        </div>
      </div>

      {/* Timeline Scrubber */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between text-xs text-slate-300 font-medium">
          <div className="flex items-center gap-2">
            <span className="font-mono text-cyan-400 font-bold">{currentTime.toFixed(1)}s</span>
            <span className="text-slate-500">/</span>
            <span className="font-mono text-slate-400">{duration.toFixed(1)}s</span>
          </div>
          <div className="text-[11px] text-slate-400">
            Estimated: <strong className="text-white">{estimatedFrames} frames</strong> @ {settings.fps} FPS
          </div>
        </div>

        {/* Full Timeline Track */}
        <div className="relative w-full h-8 flex items-center">
          <input
            type="range"
            min={0}
            max={duration}
            step={0.05}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 z-10"
            aria-label="Video scrubber"
          />

          {/* Highlight Selected Clip Range on Track */}
          <div
            className="absolute h-2 bg-gradient-to-r from-blue-600 to-cyan-400 rounded-lg pointer-events-none opacity-60"
            style={{
              left: `${(trimSettings.startTime / duration) * 100}%`,
              width: `${(clipDuration / duration) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Start / End Trimming Dual Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-white/10">
        {/* Start Point */}
        <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="trim-start-time" className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Scissors className="w-3.5 h-3.5 text-cyan-400" />
              <span>Start Time (sec)</span>
            </label>
            <button
              type="button"
              onClick={handleSetStartToCurrent}
              className="text-[10px] font-bold text-cyan-300 hover:text-white bg-cyan-950/60 hover:bg-cyan-900 border border-cyan-500/30 px-2 py-0.5 rounded-md transition-all duration-150 active:scale-95 cursor-pointer"
            >
              Set Current ({currentTime.toFixed(1)}s)
            </button>
          </div>
          <div className="flex items-center gap-2">
            <input
              id="trim-start-time"
              type="range"
              min={0}
              max={Math.max(0, trimSettings.endTime - 0.2)}
              step={0.1}
              value={trimSettings.startTime}
              onChange={(e) => handleStartTimeChange(parseFloat(e.target.value))}
              className="flex-1 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <span className="font-mono text-xs font-bold text-white w-12 text-right">
              {trimSettings.startTime.toFixed(1)}s
            </span>
          </div>
        </div>

        {/* End Point */}
        <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="trim-end-time" className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Scissors className="w-3.5 h-3.5 text-blue-400 rotate-180" />
              <span>End Time (sec)</span>
            </label>
            <button
              type="button"
              onClick={handleSetEndToCurrent}
              className="text-[10px] font-bold text-blue-300 hover:text-white bg-blue-950/60 hover:bg-blue-900 border border-blue-500/30 px-2 py-0.5 rounded-md transition-all duration-150 active:scale-95 cursor-pointer"
            >
              Set Current ({currentTime.toFixed(1)}s)
            </button>
          </div>
          <div className="flex items-center gap-2">
            <input
              id="trim-end-time"
              type="range"
              min={Math.min(duration, trimSettings.startTime + 0.2)}
              max={duration}
              step={0.1}
              value={trimSettings.endTime}
              onChange={(e) => handleEndTimeChange(parseFloat(e.target.value))}
              className="flex-1 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-400"
            />
            <span className="font-mono text-xs font-bold text-white w-12 text-right">
              {trimSettings.endTime.toFixed(1)}s
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
