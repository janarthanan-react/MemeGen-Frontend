import React, { useState, useEffect, useRef } from 'react';
import {
  Upload,
  Check,
  AlertCircle,
  X,
  Bookmark,
} from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import type { PublishMemePayload, PostAuthor } from '../../types/community';
import { draftStorage } from '../../services/draftStorage';
import type { MemeDraft } from '../../types/draft';

export interface PublishMemeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPublish: (payload: PublishMemePayload, author: PostAuthor) => Promise<void>;
  currentAuthor: PostAuthor;
}

const CATEGORIES = [
  'Trending',
  'Tech/Dev',
  'Anime',
  'Gaming',
  'Animals',
  'Reactions',
  'Classics',
];

/**
 * Downscale image if needed to fit safely in localStorage without quota crashes
 */
function downscaleImageForStorage(dataUrl: string, maxDim = 900, quality = 0.85): Promise<string> {
  return new Promise((resolve) => {
    // If it's a static public path like '/shinchan-meme.jpg', keep it as-is
    if (!dataUrl.startsWith('data:image')) {
      resolve(dataUrl);
      return;
    }

    const img = new Image();
    img.onload = () => {
      let { width, height } = img;
      if (width <= maxDim && height <= maxDim) {
        resolve(dataUrl);
        return;
      }

      if (width > height) {
        if (width > maxDim) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        }
      } else {
        if (height > maxDim) {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(dataUrl);
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      const compressed = canvas.toDataURL('image/jpeg', quality);
      resolve(compressed);
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

export const PublishMemeModal: React.FC<PublishMemeModalProps> = ({
  isOpen,
  onClose,
  onPublish,
  currentAuthor,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Trending');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [availableDrafts, setAvailableDrafts] = useState<MemeDraft[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load available drafts asynchronously from draftStorage
  useEffect(() => {
    if (!isOpen) {
      return;
    }
    let isCancelled = false;
    draftStorage
      .getAll()
      .then((drafts) => {
        if (!isCancelled) {
          setAvailableDrafts(
            drafts.filter((d: MemeDraft) => Boolean(d.previewUrl || d.template?.imageUrl))
          );
        }
      })
      .catch(() => {
        if (!isCancelled) setAvailableDrafts([]);
      });

    return () => {
      isCancelled = true;
    };
  }, [isOpen]);

  const handleFileProcess = (file: File) => {
    setErrorMessage(null);

    // 1. Validate MIME type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setErrorMessage('Please upload a valid image file (PNG, JPG, WebP, or GIF).');
      return;
    }

    // 2. Validate file size (max 8MB)
    if (file.size > 8 * 1024 * 1024) {
      setErrorMessage('File size exceeds 8MB. Please choose a smaller image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const result = e.target?.result as string;
      if (result) {
        const optimized = await downscaleImageForStorage(result);
        setSelectedImage(optimized);
      }
    };
    reader.onerror = () => {
      setErrorMessage('Failed to read the image file.');
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!selectedImage) {
      setErrorMessage('Please select or upload an image for your meme.');
      return;
    }

    const trimmedTitle = title.trim();
    if (trimmedTitle.length < 3) {
      setErrorMessage('Caption/Title must be at least 3 characters.');
      return;
    }

    if (trimmedTitle.length > 120) {
      setErrorMessage('Caption/Title cannot exceed 120 characters.');
      return;
    }

    setIsSubmitting(true);

    try {
      await onPublish(
        {
          title: trimmedTitle,
          category,
          imageUrl: selectedImage,
          tags: ['meme', category.toLowerCase()],
        },
        currentAuthor
      );

      // Reset state and close
      setTitle('');
      setSelectedImage(null);
      setCategory('Trending');
      onClose();
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Failed to publish meme. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="lg"
      title="Share a Meme with the Community"
      description="Publish your meme to the local community feed. Other creators can view, upvote, and comment!"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs sm:text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* 1. Image Selection Area */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
            1. Select or Upload Meme Image <span className="text-rose-500">*</span>
          </label>

          {selectedImage ? (
            /* Selected Image Preview with Change / Remove Button */
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 aspect-video max-h-56 flex items-center justify-center group">
              <img
                src={selectedImage}
                alt="Meme preview"
                className="max-h-full max-w-full object-contain"
              />
              <button
                type="button"
                onClick={() => setSelectedImage(null)}
                className="absolute top-2.5 right-2.5 p-1.5 bg-black/75 hover:bg-black text-white rounded-full transition-all shadow-md hover:scale-105 active:scale-95 cursor-pointer"
                aria-label="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            /* Upload Dropzone */
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
                isDragging
                  ? 'border-blue-500 bg-blue-50/50'
                  : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50/80 bg-slate-50/40'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileProcess(e.target.files[0]);
                  }
                }}
                className="hidden"
              />
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shadow-xs">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-slate-800">
                  Click to upload or drag & drop image
                </p>
                <p className="text-[11px] text-slate-400">PNG, JPG, WebP, or GIF (max 8MB)</p>
              </div>
            </div>
          )}

          {/* Quick Pick From Saved Drafts */}
          {availableDrafts.length > 0 && !selectedImage && (
            <div className="pt-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 mb-2">
                <Bookmark className="w-3.5 h-3.5 text-cyan-600" />
                <span>Or pick from your saved drafts:</span>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {availableDrafts.slice(0, 6).map((draft) => {
                  const img = draft.previewUrl || draft.template?.imageUrl;
                  if (!img) return null;
                  return (
                    <button
                      key={draft.id}
                      type="button"
                      onClick={() => setSelectedImage(img)}
                      className="group relative w-16 h-16 rounded-xl overflow-hidden border border-slate-200 hover:border-[#1463E9] hover:ring-2 hover:ring-blue-300 shrink-0 transition-all bg-slate-100 hover:-translate-y-0.5 active:scale-95 cursor-pointer"
                      title={draft.title}
                    >
                      <img src={img} alt={draft.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-blue-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Check className="w-4 h-4 text-white drop-shadow" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* 2. Caption / Title Input */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              2. Meme Caption / Title <span className="text-rose-500">*</span>
            </label>
            <span className="text-[11px] text-slate-400">{title.length}/120</span>
          </div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. When the code compiles on the first try..."
            maxLength={120}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all placeholder:text-slate-400"
          />
        </div>

        {/* 3. Choose Category */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
            3. Choose Category
          </label>
          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer hover:-translate-y-0.5 active:scale-95 focus-visible:ring-2 focus-visible:ring-[#1463E9] focus-visible:outline-none ${
                  category === cat
                    ? 'bg-[#1463E9] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-[#EFF6FF] hover:text-[#1463E9]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Modal Actions */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
          <span className="text-[11px] text-slate-400">
            Publishing as <strong>{currentAuthor.name}</strong>
          </span>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>

            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={!selectedImage || title.trim().length < 3 || isSubmitting}
              isLoading={isSubmitting}
              className="font-semibold shadow-md shadow-blue-500/25"
            >
              Publish to Feed
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};
