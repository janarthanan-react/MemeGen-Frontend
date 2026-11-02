import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, CheckCircle, AlertCircle } from 'lucide-react';
import type { MemeTemplate } from '../../types/template';
import { useEditorStore } from '../../stores/useEditorStore';
import { useTemplateStore } from '../../stores/useTemplateStore';

interface CustomImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

function createCustomTemplateId(): string {
  return `custom-${Date.now()}`;
}

export const CustomImageUploadModal: React.FC<CustomImageUploadModalProps> = ({
  isOpen,
  onClose,
}) => {
  const loadTemplate = useEditorStore((state) => state.loadTemplate);
  const setNotification = useTemplateStore((state) => state.setNotification);

  const [dragActive, setDragActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [fileSizeMb, setFileSizeMb] = useState<string>('');
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(
    null
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const processFile = (file: File) => {
    setErrorMessage(null);

    // 1. Validate MIME type
    if (!ALLOWED_MIME_TYPES.includes(file.type.toLowerCase())) {
      setErrorMessage('Please upload a valid image file (JPG, PNG, or WebP).');
      return;
    }

    // 2. Validate Size (< 10MB)
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setErrorMessage(
        `File is too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Maximum allowed image size is 10MB.`
      );
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (!dataUrl) return;

      const img = new Image();
      img.onload = () => {
        setPreviewUrl(dataUrl);
        setFileName(file.name);
        setFileSizeMb((file.size / (1024 * 1024)).toFixed(2));
        setImageDimensions({ width: img.naturalWidth, height: img.naturalHeight });
      };
      img.onerror = () => {
        setErrorMessage('Failed to read image dimensions. Please try another file.');
      };
      img.src = dataUrl;
    };
    reader.onerror = () => {
      setErrorMessage('Error reading uploaded file. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleConfirmUpload = () => {
    if (!previewUrl || !imageDimensions) return;

    const baseName = fileName.replace(/\.[^/.]+$/, '').trim() || 'Custom Meme';

    const customTemplate: MemeTemplate = {
      id: createCustomTemplateId(),
      name: baseName,
      imageUrl: previewUrl,
      width: imageDimensions.width,
      height: imageDimensions.height,
      boxCount: 2,
      category: 'Custom',
      tags: ['custom', 'upload', 'user'],
      description: `Custom image uploaded by creator: ${fileName}`,
      usageCount: 1,
      defaultTextSlots: [
        { id: 't1', placeholder: 'TOP CAPTION', defaultYPercent: 12 },
        { id: 't2', placeholder: 'BOTTOM CAPTION', defaultYPercent: 88 },
      ],
    };

    loadTemplate(customTemplate, false);
    useTemplateStore.getState().setSelectedTemplate(customTemplate);
    setNotification({
      type: 'success',
      message: `"${baseName}" loaded into the studio canvas!`,
    });
    handleClose();
  };

  const handleClose = () => {
    setPreviewUrl(null);
    setErrorMessage(null);
    setFileName('');
    setImageDimensions(null);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="upload-modal-title"
    >
      <div
        className="w-full max-w-lg bg-[#071330] border border-white/15 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl text-white flex flex-col space-y-4 animate-in zoom-in-95 duration-150 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-cyan-400 shrink-0">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <h2 id="upload-modal-title" className="text-base sm:text-lg font-bold text-white">
                Upload Custom Image
              </h2>
              <p className="text-xs text-slate-400">
                Use your own photo or template to generate memes.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close upload modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Upload Zone or Preview */}
        {!previewUrl ? (
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 ${
              dragActive
                ? 'border-blue-500 bg-blue-600/15 scale-[0.99]'
                : 'border-white/20 hover:border-cyan-400/60 bg-white/5 hover:bg-white/10'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/jpg"
              onChange={handleFileChange}
              className="hidden"
            />

            <div className="w-12 h-12 rounded-2xl bg-blue-600/20 text-cyan-400 flex items-center justify-center mb-3">
              <ImageIcon className="w-6 h-6" />
            </div>

            <p className="text-sm font-bold text-white mb-1">
              Drag &amp; drop your image here, or{' '}
              <span className="text-cyan-400 underline underline-offset-2">browse files</span>
            </p>
            <p className="text-xs text-slate-400 max-w-xs">
              Supports JPG, PNG, and WebP images up to 10MB in resolution.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Preview Box */}
            <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950 border border-white/10 flex items-center justify-center">
              <img
                src={previewUrl}
                alt={fileName}
                className="w-full h-full object-contain"
              />
              <button
                type="button"
                onClick={() => setPreviewUrl(null)}
                className="absolute top-2 right-2 p-1.5 rounded-lg bg-slate-900/80 hover:bg-rose-600 text-white transition-colors cursor-pointer shadow-md"
                title="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Image Details */}
            <div className="flex items-center justify-between text-xs bg-white/5 p-3 rounded-xl border border-white/10">
              <div className="truncate pr-2">
                <p className="font-bold text-white truncate">{fileName}</p>
                <p className="text-[11px] text-slate-400">
                  {fileSizeMb} MB • {imageDimensions?.width} × {imageDimensions?.height} px
                </p>
              </div>
              <span className="flex items-center gap-1 text-emerald-400 text-xs font-semibold shrink-0">
                <CheckCircle className="w-4 h-4" />
                <span>Ready</span>
              </span>
            </div>
          </div>
        )}

        {/* Error message */}
        {errorMessage && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-white/10 flex-nowrap whitespace-nowrap">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/10 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-150 cursor-pointer whitespace-nowrap shrink-0 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={!previewUrl}
            onClick={handleConfirmUpload}
            className="px-5 py-2.5 rounded-xl bg-[#1463E9] hover:bg-[#0E52C7] disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none text-white text-xs sm:text-sm font-bold shadow-[0_2px_12px_rgba(20,99,233,0.35)] hover:shadow-[0_6px_20px_rgba(20,99,233,0.45)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0 focus-visible:ring-2 focus-visible:ring-[#1463E9] focus-visible:outline-none"
          >
            Load into Studio Canvas
          </button>
        </div>
      </div>
    </div>
  );
};
