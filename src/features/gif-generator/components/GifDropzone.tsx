import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  Film,
  Images,
  Play,
  AlertCircle,
  FileVideo,
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { useGifStore } from '../stores/useGifStore';
import { SAMPLE_GIF_CLIPS } from '../utils/frameExtractor';
import type { ImageSequenceFrame, SampleClip } from '../types/gif';

const MAX_VIDEO_SIZE_MB = 50;
const MAX_IMAGE_SIZE_MB = 10;
const SUPPORTED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
const SUPPORTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
];

export const GifDropzone: React.FC = () => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const setSourceVideo = useGifStore((state) => state.setSourceVideo);
  const addImageFrames = useGifStore((state) => state.addImageFrames);
  const loadSampleClip = useGifStore((state) => state.loadSampleClip);

  const validateAndProcessFiles = (files: FileList | File[]) => {
    setValidationError(null);
    if (!files || files.length === 0) return;

    const fileList = Array.from(files);
    const firstFile = fileList[0];

    // Case 1: Video file provided
    if (
      SUPPORTED_VIDEO_TYPES.includes(firstFile.type) ||
      /\.(mp4|webm|mov|ogg)$/i.test(firstFile.name)
    ) {
      if (firstFile.size > MAX_VIDEO_SIZE_MB * 1024 * 1024) {
        setValidationError(
          `Video is too large (${(firstFile.size / (1024 * 1024)).toFixed(1)}MB). Maximum allowed video size is ${MAX_VIDEO_SIZE_MB}MB.`
        );
        return;
      }

      const videoUrl = URL.createObjectURL(firstFile);
      const tempVideo = document.createElement('video');
      tempVideo.preload = 'metadata';

      tempVideo.onloadedmetadata = () => {
        setSourceVideo(firstFile, videoUrl, {
          duration: tempVideo.duration || 5,
          width: tempVideo.videoWidth || 640,
          height: tempVideo.videoHeight || 360,
          filename: firstFile.name,
          filesize: firstFile.size,
        });
      };

      tempVideo.onerror = () => {
        setValidationError(
          'Could not read video metadata. The codec may not be supported by your browser.'
        );
        URL.revokeObjectURL(videoUrl);
      };

      tempVideo.src = videoUrl;
      return;
    }

    // Case 2: Image files provided (one or more)
    const validImages: File[] = [];
    for (const f of fileList) {
      if (
        SUPPORTED_IMAGE_TYPES.includes(f.type) ||
        /\.(jpe?g|png|webp|gif)$/i.test(f.name)
      ) {
        if (f.size <= MAX_IMAGE_SIZE_MB * 1024 * 1024) {
          validImages.push(f);
        }
      }
    }

    if (validImages.length === 0) {
      setValidationError(
        'Unsupported file format. Please upload an MP4, WebM, MOV video, or PNG, JPG, WebP images.'
      );
      return;
    }

    // Convert images to ImageSequenceFrame objects
    const framePromises = validImages.map(
      (file) =>
        new Promise<ImageSequenceFrame>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            const dataUrl = e.target?.result as string;
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

    Promise.all(framePromises).then((frames) => {
      addImageFrames(frames);
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (e.dataTransfer.files) {
      validateAndProcessFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      validateAndProcessFiles(e.target.files);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Drop Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all duration-300 ${
          isDragOver
            ? 'border-cyan-400 bg-cyan-950/20 scale-[1.01]'
            : 'border-white/15 bg-[#071330]/60 hover:border-blue-500/40 hover:bg-[#071330]/80'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="video/mp4,video/webm,video/ogg,video/quicktime,image/png,image/jpeg,image/webp,image/gif"
          multiple
          onChange={handleFileInputChange}
          className="hidden"
          id="gif-file-upload"
          aria-label="Upload video or images for GIF creation"
        />

        <div className="flex flex-col items-center justify-center gap-4 max-w-md mx-auto">
          {/* Animated Upload Icon */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 text-white flex items-center justify-center shadow-lg shadow-blue-600/30">
            <UploadCloud className="w-8 h-8 animate-pulse-subtle" />
          </div>

          <div className="space-y-1.5">
            <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              Drag & Drop Video or Images Here
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Upload an <strong className="text-slate-200">MP4, WebM, or MOV</strong> clip to turn into an animated GIF, or select multiple photos for a slideshow meme.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button
              variant="primary"
              size="md"
              leftIcon={<FileVideo className="w-4 h-4" />}
              onClick={() => fileInputRef.current?.click()}
              className="shadow-md shadow-blue-600/30"
            >
              Browse Files
            </Button>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-1">
            <span className="flex items-center gap-1">
              <Film className="w-3.5 h-3.5 text-cyan-400" /> Max video: 50MB
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Images className="w-3.5 h-3.5 text-blue-400" /> Up to 20 images
            </span>
          </div>
        </div>

        {/* Validation Error Alert */}
        {validationError && (
          <div
            role="alert"
            className="mt-6 max-w-lg mx-auto p-3.5 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs flex items-start gap-2.5 text-left animate-in fade-in duration-200"
          >
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{validationError}</span>
          </div>
        )}
      </div>

      {/* Preset Starter Clips */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Play className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400" />
            <span>Or Try with a Sample Clip</span>
          </span>
          <span className="text-[11px] text-slate-400">One-click instant test</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SAMPLE_GIF_CLIPS.map((sample: SampleClip) => (
            <button
              key={sample.id}
              type="button"
              onClick={() => loadSampleClip(sample)}
              className="flex items-center gap-3 p-3 rounded-2xl bg-[#071330]/60 hover:bg-[#071330] border border-white/10 hover:border-cyan-400/50 transition-all duration-200 text-left group cursor-pointer hover:-translate-y-0.5 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none"
            >
              <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-900 shrink-0 relative border border-white/10">
                <img
                  src={sample.thumbnailUrl}
                  alt={sample.title}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/shinchan-meme.jpg';
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
                <div className="absolute inset-0 bg-blue-600/10 group-hover:bg-transparent transition-colors" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors truncate">
                  {sample.title}
                </h4>
                <p className="text-xs text-slate-400 line-clamp-1">{sample.description}</p>
                <span className="inline-block mt-1 text-[10px] text-cyan-300 font-semibold bg-cyan-950/60 px-2 py-0.5 rounded-md border border-cyan-500/30">
                  Ready to Meme
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
