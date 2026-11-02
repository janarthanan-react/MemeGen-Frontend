import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  Undo2,
  Redo2,
  RotateCcw,
  Download,
  Edit2,
  Check,
  Layers,
  Loader2,
  Bookmark,
  Bot,
  Upload,
  Share2,
  Copy,
  ChevronDown,
  FileImage,
} from 'lucide-react';
import { useEditorStore } from '../../stores/useEditorStore';
import { useDraftStore } from '../../stores/useDraftStore';
import { useTemplateStore } from '../../stores/useTemplateStore';

interface EditorToolbarProps {
  onBack: () => void;
  onExport: () => void;
  onExportFormat?: (format: 'png' | 'jpeg') => void;
  onCopyImage?: () => void;
  onShareImage?: () => void;
  onOpenUploadModal?: () => void;
  onOpenAiModal?: () => void;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  onBack,
  onExport,
  onExportFormat,
  onCopyImage,
  onShareImage,
  onOpenUploadModal,
  onOpenAiModal,
}) => {
  const memeTitle = useEditorStore((state) => state.memeTitle);
  const setMemeTitle = useEditorStore((state) => state.setMemeTitle);
  const activeTemplate = useEditorStore((state) => state.activeTemplate);
  const textLayers = useEditorStore((state) => state.textLayers);
  const canvasSettings = useEditorStore((state) => state.canvasSettings);
  const currentDraftId = useEditorStore((state) => state.currentDraftId);
  const setCurrentDraftId = useEditorStore((state) => state.setCurrentDraftId);
  const canUndo = useEditorStore((state) => state.history.past.length > 0);
  const canRedo = useEditorStore((state) => state.history.future.length > 0);
  const undo = useEditorStore((state) => state.undo);
  const redo = useEditorStore((state) => state.redo);
  const setIsResetModalOpen = useEditorStore((state) => state.setIsResetModalOpen);
  const setIsTemplatePickerOpen = useEditorStore((state) => state.setIsTemplatePickerOpen);
  const isExporting = useEditorStore((state) => state.isExporting);

  const saveDraft = useDraftStore((state) => state.saveDraft);
  const setNotification = useTemplateStore((state) => state.setNotification);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);

  // Inline editing state for Meme Title
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [localTitle, setLocalTitle] = useState(memeTitle);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditingTitle && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditingTitle]);

  const handleSaveTitle = () => {
    const trimmed = localTitle.trim();
    if (trimmed) {
      setMemeTitle(trimmed);
    } else {
      setLocalTitle(memeTitle);
    }
    setIsEditingTitle(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSaveTitle();
    } else if (e.key === 'Escape') {
      setLocalTitle(memeTitle);
      setIsEditingTitle(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!activeTemplate || isSavingDraft) return;
    setIsSavingDraft(true);
    try {
      const saved = await saveDraft(
        memeTitle || activeTemplate.name,
        activeTemplate,
        textLayers,
        canvasSettings,
        currentDraftId
      );
      setCurrentDraftId(saved.id);
      setNotification({
        type: 'success',
        message: `Draft "${saved.title}" saved successfully!`,
      });
    } catch {
      setNotification({
        type: 'info',
        message: 'Could not save draft. Please try again.',
      });
    } finally {
      setIsSavingDraft(false);
    }
  };

  return (
    <header className="w-full bg-[#071330] border-b border-white/10 px-2 sm:px-6 py-2 sm:py-3 flex items-center justify-between gap-1.5 sm:gap-3 text-white z-30 shrink-0">
      {/* Left: Back & Title */}
      <div className="flex items-center gap-1.5 sm:gap-3 min-w-0 flex-1">
        {/* Back Button */}
        <button
          type="button"
          onClick={onBack}
          className="flex items-center justify-center gap-1.5 p-2 sm:px-2.5 sm:py-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-150 text-xs sm:text-sm font-semibold cursor-pointer shrink-0 min-w-[36px] min-h-[36px] whitespace-nowrap flex-nowrap focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none"
          title="Back to Gallery / Home"
          aria-label="Back to Gallery"
        >
          <ArrowLeft className="w-4 h-4 shrink-0" />
          <span className="hidden md:inline whitespace-nowrap">Back</span>
        </button>

        <div className="h-5 w-[1px] bg-white/15 hidden sm:block shrink-0" />

        {/* Meme Title (Inline Editable) */}
        <div className="flex items-center gap-1.5 min-w-0 flex-1">
          {isEditingTitle ? (
            <div className="flex items-center gap-1 min-w-0 flex-1">
              <input
                ref={inputRef}
                type="text"
                value={localTitle}
                onChange={(e) => setLocalTitle(e.target.value)}
                onBlur={handleSaveTitle}
                onKeyDown={handleKeyDown}
                className="bg-slate-900 text-white text-xs sm:text-sm font-bold px-2 py-1 rounded-lg border border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-400 w-full max-w-[140px] sm:max-w-xs"
                maxLength={60}
              />
              <button
                type="button"
                onClick={handleSaveTitle}
                className="p-1 text-emerald-400 hover:bg-emerald-500/20 rounded-md cursor-pointer shrink-0"
                title="Save title"
              >
                <Check className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div
              onClick={() => {
                setLocalTitle(memeTitle);
                setIsEditingTitle(true);
              }}
              className="group flex items-center gap-1 cursor-pointer px-1.5 py-1 rounded-lg hover:bg-white/5 transition-colors min-w-0 max-w-[110px] xs:max-w-[150px] sm:max-w-[240px] md:max-w-[320px]"
              title="Click to rename meme"
            >
              <h1 className="text-xs sm:text-sm md:text-base font-extrabold text-white truncate">
                {memeTitle || 'Untitled Meme'}
              </h1>
              <Edit2 className="w-3 h-3 text-slate-400 group-hover:text-cyan-300 shrink-0 transition-colors" />
            </div>
          )}

          {/* Active Template Badge / Switcher */}
          {activeTemplate && (
            <button
              type="button"
              onClick={() => setIsTemplatePickerOpen(true)}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-600/20 border border-blue-500/30 hover:border-blue-400/60 hover:bg-blue-600/30 text-blue-300 text-xs font-medium transition-colors cursor-pointer truncate max-w-[200px]"
              title="Change Meme Template"
            >
              <Layers className="w-3 h-3 text-cyan-400 shrink-0" />
              <span className="truncate">{activeTemplate.name}</span>
            </button>
          )}
        </div>
      </div>

      {/* Right: History, Reset, Template Switch & Export Actions */}
      <div className="flex items-center gap-1 xs:gap-1.5 sm:gap-2 shrink-0 flex-nowrap whitespace-nowrap">
        {/* Undo Button */}
        <button
          type="button"
          onClick={undo}
          disabled={!canUndo}
          className="p-1.5 xs:p-2 sm:px-2.5 sm:py-1.5 rounded-xl border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-150 cursor-pointer flex items-center justify-center min-w-[34px] min-h-[34px] text-xs font-medium focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none whitespace-nowrap shrink-0"
          title="Undo (Ctrl+Z)"
          aria-label="Undo last change"
        >
          <Undo2 className="w-4 h-4 shrink-0" />
          <span className="hidden xl:inline whitespace-nowrap">Undo</span>
        </button>

        {/* Redo Button */}
        <button
          type="button"
          onClick={redo}
          disabled={!canRedo}
          className="p-1.5 xs:p-2 sm:px-2.5 sm:py-1.5 rounded-xl border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-150 cursor-pointer flex items-center justify-center min-w-[34px] min-h-[34px] text-xs font-medium focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none whitespace-nowrap shrink-0"
          title="Redo (Ctrl+Y)"
          aria-label="Redo last change"
        >
          <Redo2 className="w-4 h-4 shrink-0" />
          <span className="hidden xl:inline whitespace-nowrap">Redo</span>
        </button>

        {/* Reset Button */}
        <button
          type="button"
          onClick={() => setIsResetModalOpen(true)}
          className="p-1.5 xs:p-2 sm:px-2.5 sm:py-1.5 rounded-xl border border-white/10 text-slate-300 hover:text-rose-300 hover:border-rose-500/40 hover:bg-rose-500/10 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-150 cursor-pointer flex items-center justify-center min-w-[34px] min-h-[34px] text-xs font-medium focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:outline-none whitespace-nowrap shrink-0"
          title="Reset Meme to Default"
          aria-label="Reset meme to template defaults"
        >
          <RotateCcw className="w-4 h-4 shrink-0" />
          <span className="hidden lg:inline whitespace-nowrap">Reset</span>
        </button>

        {/* Upload Custom Image Button */}
        {onOpenUploadModal && (
          <button
            type="button"
            onClick={onOpenUploadModal}
            className="p-1.5 xs:p-2 sm:px-3 sm:py-1.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/15 text-slate-200 hover:text-white hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-150 cursor-pointer flex items-center justify-center min-w-[34px] min-h-[34px] text-xs font-semibold gap-1.5 shadow-2xs hover:shadow-xs focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none whitespace-nowrap shrink-0"
            title="Upload Custom Image"
            aria-label="Upload custom image to editor"
          >
            <Upload className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="hidden md:inline whitespace-nowrap">Upload</span>
          </button>
        )}

        {/* Change Template Button (Tablet / Mobile) */}
        <button
          type="button"
          onClick={() => setIsTemplatePickerOpen(true)}
          className="p-1.5 xs:p-2 sm:px-3 sm:py-1.5 rounded-xl border border-blue-500/30 bg-blue-600/15 text-blue-200 hover:bg-blue-600/30 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-150 cursor-pointer flex items-center justify-center min-w-[34px] min-h-[34px] text-xs font-semibold focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:outline-none whitespace-nowrap shrink-0"
          title="Change Template"
        >
          <Layers className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span className="hidden sm:inline whitespace-nowrap">Templates</span>
        </button>

        {/* AI Assistant Button */}
        {onOpenAiModal && (
          <button
            type="button"
            onClick={onOpenAiModal}
            className="p-1.5 xs:p-2 sm:px-3 sm:py-1.5 rounded-xl border border-cyan-500/40 bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-200 hover:text-white hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-150 cursor-pointer flex items-center justify-center min-w-[34px] min-h-[34px] text-xs font-semibold gap-1.5 shadow-2xs hover:shadow-xs hover:border-cyan-400/60 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none whitespace-nowrap shrink-0"
            title="AI Meme Caption Assistant"
            aria-label="Open AI Caption Assistant"
          >
            <Bot className="w-3.5 h-3.5 text-cyan-300 shrink-0" />
            <span className="hidden sm:inline whitespace-nowrap">AI Assistant</span>
          </button>
        )}

        {/* Save Draft Button */}
        <button
          type="button"
          onClick={handleSaveDraft}
          disabled={isSavingDraft}
          className="p-1.5 xs:p-2 sm:px-3 sm:py-1.5 rounded-xl border border-white/10 hover:border-cyan-400/50 bg-white/5 hover:bg-white/15 text-slate-200 hover:text-white hover:-translate-y-0.5 active:translate-y-0 active:scale-95 disabled:opacity-40 disabled:pointer-events-none transition-all duration-150 cursor-pointer flex items-center justify-center min-w-[34px] min-h-[34px] text-xs font-semibold gap-1.5 shadow-2xs hover:shadow-xs focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none whitespace-nowrap shrink-0"
          title="Save to My Drafts"
          aria-label="Save draft"
        >
          {isSavingDraft ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400 shrink-0" />
          ) : (
            <Bookmark className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          )}
          <span className="hidden md:inline whitespace-nowrap">Save Draft</span>
        </button>

        {/* Download & Multi-Format Export Group */}
        <div className="relative flex items-center shrink-0 flex-nowrap whitespace-nowrap">
          <button
            type="button"
            onClick={onExport}
            disabled={isExporting}
            className="px-2.5 xs:px-3 sm:px-4 py-1.5 sm:py-2 rounded-l-xl bg-[#1463E9] hover:bg-[#0E52C7] text-white font-bold text-xs sm:text-sm shadow-[0_2px_12px_rgba(20,99,233,0.35)] hover:shadow-[0_6px_20px_rgba(20,99,233,0.45)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none transition-all duration-150 flex items-center justify-center gap-1 sm:gap-2 cursor-pointer min-h-[34px] shrink-0 whitespace-nowrap focus-visible:ring-2 focus-visible:ring-[#1463E9] focus-visible:outline-none"
            aria-label="Export meme image"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin text-white shrink-0" />
                <span className="hidden xs:inline whitespace-nowrap">Exporting...</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span className="whitespace-nowrap font-bold">Download</span>
              </>
            )}
          </button>

          {/* Export Options Dropdown Trigger */}
          <button
            type="button"
            onClick={() => setIsExportMenuOpen((prev) => !prev)}
            disabled={isExporting}
            className="px-1.5 py-1.5 sm:py-2 rounded-r-xl bg-[#0E52C7] hover:bg-[#0B43A6] text-white border-l border-white/20 transition-all duration-150 cursor-pointer min-h-[34px] flex items-center justify-center hover:-translate-y-0.5 active:translate-y-0 active:scale-95 disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-[#1463E9] focus-visible:outline-none shrink-0"
            title="More export formats & sharing"
            aria-label="More export options"
            aria-expanded={isExportMenuOpen}
          >
            <ChevronDown className={`w-3.5 h-3.5 transition-transform shrink-0 ${isExportMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Export Formats Dropdown Popover */}
          {isExportMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsExportMenuOpen(false)}
                aria-hidden="true"
              />
              <div className="absolute right-0 top-full mt-2 w-52 rounded-2xl bg-[#071330]/95 backdrop-blur-xl border border-white/15 shadow-2xl p-1.5 z-50 text-slate-200 animate-in fade-in zoom-in-95 duration-150 space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsExportMenuOpen(false);
                    if (onExportFormat) onExportFormat('png');
                    else onExport();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl text-slate-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer text-left"
                >
                  <FileImage className="w-4 h-4 text-cyan-400" />
                  <div>
                    <p className="font-bold">Download PNG</p>
                    <p className="text-[10px] text-slate-400 font-normal">Lossless high-res quality</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsExportMenuOpen(false);
                    if (onExportFormat) onExportFormat('jpeg');
                    else onExport();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl text-slate-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer text-left"
                >
                  <FileImage className="w-4 h-4 text-blue-400" />
                  <div>
                    <p className="font-bold">Download JPG</p>
                    <p className="text-[10px] text-slate-400 font-normal">Smaller file size for web</p>
                  </div>
                </button>

                {onCopyImage && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsExportMenuOpen(false);
                      onCopyImage();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl text-slate-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer text-left"
                  >
                    <Copy className="w-4 h-4 text-emerald-400" />
                    <div>
                      <p className="font-bold">Copy to Clipboard</p>
                      <p className="text-[10px] text-slate-400 font-normal">Paste in chat / Discord</p>
                    </div>
                  </button>
                )}

                {onShareImage && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsExportMenuOpen(false);
                      onShareImage();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl text-slate-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer text-left"
                  >
                    <Share2 className="w-4 h-4 text-indigo-400" />
                    <div>
                      <p className="font-bold">Share Meme</p>
                      <p className="text-[10px] text-slate-400 font-normal">Native device share menu</p>
                    </div>
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
