import React, { useState, useRef, useEffect } from 'react';
import {
  Edit3,
  MoreVertical,
  Copy,
  Trash2,
  Edit2,
  Clock,
  Layers,
  ImageOff,
  ExternalLink,
} from 'lucide-react';
import type { MemeDraft } from '../../types/draft';
import { useEditorStore } from '../../stores/useEditorStore';
import { useDraftStore } from '../../stores/useDraftStore';
import { useTemplateStore } from '../../stores/useTemplateStore';
import { formatRelativeTime } from '../../lib/utils';

export interface DraftCardProps {
  draft: MemeDraft;
  onNavigate?: (route: string) => void;
}

export const DraftCard: React.FC<DraftCardProps> = ({ draft, onNavigate }) => {
  const [imageError, setImageError] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const loadDraft = useEditorStore((state) => state.loadDraft);
  const setActiveDraftForRename = useDraftStore((state) => state.setActiveDraftForRename);
  const setActiveDraftForDelete = useDraftStore((state) => state.setActiveDraftForDelete);
  const duplicateDraft = useDraftStore((state) => state.duplicateDraft);
  const setNotification = useTemplateStore((state) => state.setNotification);

  // Close context menu on click outside or Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && menuOpen) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [menuOpen]);

  const handleOpenDraft = () => {
    loadDraft(draft);
    if (onNavigate) {
      onNavigate('/editor');
    }
  };

  const handleDuplicate = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(false);
    try {
      const copy = await duplicateDraft(draft.id);
      setNotification({
        type: 'success',
        message: `Duplicated "${copy.title}" successfully!`,
      });
    } catch {
      setNotification({
        type: 'info',
        message: 'Failed to duplicate draft. Please try again.',
      });
    }
  };

  const handleRenameClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(false);
    setActiveDraftForRename(draft);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(false);
    setActiveDraftForDelete(draft);
  };

  return (
    <article
      className="group flex flex-col bg-white rounded-2xl border border-slate-200/90 hover:border-blue-400 hover:shadow-xl hover:-translate-y-1 transition-all duration-200 overflow-hidden select-none relative"
      aria-label={`Draft: ${draft.title}`}
    >
      {/* Thumbnail Aspect Container */}
      <div
        onClick={handleOpenDraft}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleOpenDraft();
          }
        }}
        className="relative aspect-[16/11] w-full bg-slate-900 overflow-hidden cursor-pointer flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
      >
        {!imageError && draft.template?.imageUrl ? (
          <img
            src={draft.template.imageUrl}
            alt={draft.title || 'Meme Draft'}
            loading="lazy"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-4 text-center text-slate-400 bg-slate-950 w-full h-full">
            <ImageOff className="w-8 h-8 text-slate-500 mb-1.5" />
            <span className="text-xs font-semibold text-slate-300 line-clamp-1">{draft.title || 'Untitled Draft'}</span>
            <span className="text-[10px] text-slate-500">Preview unavailable</span>
          </div>
        )}

        {/* Render text layer preview highlights */}
        {(draft.textLayers || []).slice(0, 3).map((layer) => (
          <div
            key={layer.id}
            className="absolute pointer-events-none transform -translate-x-1/2 -translate-y-1/2 px-2 py-0.5 max-w-[85%] truncate text-center font-black uppercase text-[10px] sm:text-xs tracking-wide"
            style={{
              left: `${layer.xPercent}%`,
              top: `${layer.yPercent}%`,
              color: layer.color || '#FFFFFF',
              textShadow: '0 1px 3px rgba(0,0,0,0.9), 0 0 5px rgba(0,0,0,0.8)',
            }}
          >
            {layer.text}
          </div>
        ))}

        {/* Hover quick action overlay */}
        <div className="absolute inset-0 bg-blue-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2 backdrop-blur-2xs">
          <span className="bg-white text-blue-600 text-xs font-bold px-3 py-1.5 rounded-xl shadow-lg flex items-center gap-1.5 transform translate-y-1 group-hover:translate-y-0 transition-transform duration-200">
            <Edit3 className="w-3.5 h-3.5" />
            Edit Draft
          </span>
        </div>

        {/* Template badge */}
        <div className="absolute top-2.5 left-2.5 pointer-events-none">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold bg-slate-950/80 text-white backdrop-blur-xs border border-white/10 shadow-xs">
            <Layers className="w-2.5 h-2.5 text-cyan-400 shrink-0" />
            <span className="truncate max-w-[120px]">{draft.template?.name || 'Meme Template'}</span>
          </span>
        </div>

        {/* Layer count badge */}
        <div className="absolute bottom-2.5 right-2.5 pointer-events-none">
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-900/80 text-slate-200 backdrop-blur-xs">
            {(draft.textLayers || []).length} {(draft.textLayers || []).length === 1 ? 'layer' : 'layers'}
          </span>
        </div>
      </div>

      {/* Card Body & Details */}
      <div className="p-3 sm:p-4 flex flex-col justify-between gap-2.5 bg-white flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 min-w-0">
          <h3
            onClick={handleOpenDraft}
            className="font-bold text-slate-900 text-sm sm:text-base truncate min-w-0 flex-1 hover:text-blue-600 cursor-pointer transition-colors"
            title={draft.title}
          >
            {draft.title}
          </h3>

          {/* More options menu dropdown */}
          <div className="relative shrink-0" ref={menuRef}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(!menuOpen);
              }}
              aria-label="Draft actions"
              aria-expanded={menuOpen}
              className="p-1.5 rounded-lg text-slate-400 hover:text-[#1463E9] hover:bg-[#EFF6FF] transition-all duration-150 active:scale-95 focus-visible:ring-2 focus-visible:ring-[#1463E9] focus-visible:outline-none cursor-pointer"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {menuOpen && (
              <div
                role="menu"
                className="absolute right-0 mt-1 w-38 bg-white border border-slate-200 rounded-xl shadow-xl p-1 z-30 animate-in fade-in zoom-in-95 duration-150 space-y-0.5"
              >
                <button
                  type="button"
                  role="menuitem"
                  onClick={handleRenameClick}
                  className="w-full text-left px-2.5 py-1.5 text-xs rounded-lg text-slate-700 hover:bg-[#EFF6FF] hover:text-[#1463E9] font-medium flex items-center gap-2 cursor-pointer transition-all duration-150 active:scale-[0.98]"
                >
                  <Edit2 className="w-3.5 h-3.5 text-slate-400" />
                  Rename
                </button>
                <button
                  type="button"
                  role="menuitem"
                  onClick={handleDuplicate}
                  className="w-full text-left px-2.5 py-1.5 text-xs rounded-lg text-slate-700 hover:bg-[#EFF6FF] hover:text-[#1463E9] font-medium flex items-center gap-2 cursor-pointer transition-all duration-150 active:scale-[0.98]"
                >
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  Duplicate
                </button>
                <div className="h-[1px] bg-slate-100 my-1" />
                <button
                  type="button"
                  role="menuitem"
                  onClick={handleDeleteClick}
                  className="w-full text-left px-2.5 py-1.5 text-xs rounded-lg text-rose-600 hover:bg-rose-50 font-medium flex items-center gap-2 cursor-pointer transition-all duration-150 active:scale-[0.98]"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer: Date & Quick Open Button */}
        <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100 text-xs">
          <span className="flex items-center gap-1 text-slate-400 text-[11px] font-medium truncate">
            <Clock className="w-3 h-3 shrink-0" />
            <span>Edited {formatRelativeTime(draft.updatedAt || draft.createdAt)}</span>
          </span>

          <button
            type="button"
            onClick={handleOpenDraft}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold text-[#1463E9] bg-blue-50/70 hover:bg-[#1463E9] hover:text-white transition-all duration-200 ease-out active:scale-95 focus-visible:ring-2 focus-visible:ring-[#1463E9] cursor-pointer shrink-0"
          >
            <span>Open</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>
    </article>
  );
};
