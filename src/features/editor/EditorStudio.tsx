import React, { useState, useEffect, useCallback } from 'react';
import { EditorToolbar } from './EditorToolbar';
import { MemeCanvas } from './MemeCanvas';
import { EditorPropertiesPanel } from './EditorPropertiesPanel';
import { ResetConfirmModal } from './ResetConfirmModal';
import { TemplatePickerModal } from './TemplatePickerModal';
import { CustomImageUploadModal } from './CustomImageUploadModal';
import { AiEditorModal } from '../ai-assistant';
import { exportMemeAsFormat, copyMemeToClipboard, shareMemeViaWebShare } from './exportMeme';
import { useEditorStore } from '../../stores/useEditorStore';
import { useTemplateStore } from '../../stores/useTemplateStore';

interface EditorStudioProps {
  onBack: () => void;
}

export const EditorStudio: React.FC<EditorStudioProps> = ({ onBack }) => {
  const activeTemplate = useEditorStore((state) => state.activeTemplate);
  const textLayers = useEditorStore((state) => state.textLayers);
  const memeTitle = useEditorStore((state) => state.memeTitle);
  const selectedLayerId = useEditorStore((state) => state.selectedLayerId);
  const isExporting = useEditorStore((state) => state.isExporting);
  const canvasSettings = useEditorStore((state) => state.canvasSettings);

  const undo = useEditorStore((state) => state.undo);
  const redo = useEditorStore((state) => state.redo);
  const deleteTextLayer = useEditorStore((state) => state.deleteTextLayer);
  const selectLayer = useEditorStore((state) => state.selectLayer);
  const zoomIn = useEditorStore((state) => state.zoomIn);
  const zoomOut = useEditorStore((state) => state.zoomOut);
  const resetZoom = useEditorStore((state) => state.resetZoom);
  const setIsExporting = useEditorStore((state) => state.setIsExporting);
  const setNotification = useTemplateStore((state) => state.setNotification);

  // Track rendered canvas width/height for exact export scale calculation
  const [renderedCanvasSize, setRenderedCanvasSize] = useState<{ width: number; height: number }>({
    width: 600,
    height: 600,
  });

  const handleCanvasSizeChange = useCallback((width: number, height: number) => {
    setRenderedCanvasSize({ width, height });
  }, []);

  const isResetModalOpen = useEditorStore((state) => state.isResetModalOpen);
  const isTemplatePickerOpen = useEditorStore((state) => state.isTemplatePickerOpen);
  const setIsResetModalOpen = useEditorStore((state) => state.setIsResetModalOpen);
  const setIsTemplatePickerOpen = useEditorStore((state) => state.setIsTemplatePickerOpen);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // -------------------------------------------------------------
  // Keyboard Shortcuts (Undo, Redo, Delete layer, Zoom, Escape)
  // -------------------------------------------------------------
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement as HTMLElement | null;
      const isInput =
        activeEl &&
        (activeEl.tagName === 'INPUT' ||
          activeEl.tagName === 'TEXTAREA' ||
          activeEl.tagName === 'SELECT' ||
          activeEl.isContentEditable);

      // Escape key: close open modal first, otherwise deselect layer
      if (e.key === 'Escape') {
        if (isUploadModalOpen) {
          setIsUploadModalOpen(false);
          return;
        }
        if (isAiModalOpen) {
          setIsAiModalOpen(false);
          return;
        }
        if (isResetModalOpen) {
          setIsResetModalOpen(false);
          return;
        }
        if (isTemplatePickerOpen) {
          setIsTemplatePickerOpen(false);
          return;
        }
        if (!isInput) {
          selectLayer(null);
        }
        return;
      }

      // Do not trigger canvas/editor shortcuts while typing or while modal dialog is open
      if (isInput || isResetModalOpen || isTemplatePickerOpen || isAiModalOpen || isUploadModalOpen) {
        return;
      }

      // Undo: Ctrl+Z or Cmd+Z (without Shift)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
        return;
      }

      // Redo: Ctrl+Y or Ctrl+Shift+Z or Cmd+Shift+Z
      if (
        ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'z')
      ) {
        e.preventDefault();
        redo();
        return;
      }

      // Delete: Delete or Backspace when a layer is selected and user is NOT typing
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedLayerId) {
          e.preventDefault();
          deleteTextLayer(selectedLayerId);
        }
        return;
      }

      // Zoom Shortcuts: Ctrl+= / Ctrl+- / Ctrl+0
      if ((e.ctrlKey || e.metaKey) && (e.key === '=' || e.key === '+')) {
        e.preventDefault();
        zoomIn();
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key === '-') {
        e.preventDefault();
        zoomOut();
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key === '0') {
        e.preventDefault();
        resetZoom();
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    undo,
    redo,
    deleteTextLayer,
    selectedLayerId,
    selectLayer,
    zoomIn,
    zoomOut,
    resetZoom,
    isResetModalOpen,
    isTemplatePickerOpen,
    isAiModalOpen,
    isUploadModalOpen,
    setIsResetModalOpen,
    setIsTemplatePickerOpen,
    setIsAiModalOpen,
    setIsUploadModalOpen,
  ]);

  // -------------------------------------------------------------
  // High-Resolution Export (PNG, JPEG), Clipboard & Native Share
  // -------------------------------------------------------------
  const handleExportFormat = async (format: 'png' | 'jpeg' = 'png') => {
    if (!activeTemplate || isExporting) return;

    setIsExporting(true);
    try {
      const result = await exportMemeAsFormat(
        {
          template: activeTemplate,
          textLayers,
          title: memeTitle || activeTemplate.name,
          previewWidth: renderedCanvasSize.width,
          previewHeight: renderedCanvasSize.height,
          canvasSettings,
        },
        format
      );

      if (result.success) {
        setNotification({
          type: 'success',
          message: `"${memeTitle || activeTemplate.name}" downloaded as ${format.toUpperCase()}!`,
        });
      } else {
        setNotification({
          type: 'info',
          message: result.error || 'Failed to export meme. Please try again.',
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error during export';
      setNotification({
        type: 'info',
        message: `Export error: ${msg}`,
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleExport = async () => {
    return handleExportFormat('png');
  };

  const handleCopyClipboard = async () => {
    if (!activeTemplate || isExporting) return;
    setIsExporting(true);
    try {
      const result = await copyMemeToClipboard({
        template: activeTemplate,
        textLayers,
        title: memeTitle || activeTemplate.name,
        previewWidth: renderedCanvasSize.width,
        previewHeight: renderedCanvasSize.height,
        canvasSettings,
      });

      if (result.success) {
        setNotification({
          type: 'success',
          message: 'Meme copied to clipboard! Ready to paste into Discord, Slack, or chat.',
        });
      } else {
        setNotification({
          type: 'info',
          message: result.error || 'Could not copy image to clipboard.',
        });
      }
    } finally {
      setIsExporting(false);
    }
  };

  const handleShare = async () => {
    if (!activeTemplate || isExporting) return;
    setIsExporting(true);
    try {
      const result = await shareMemeViaWebShare({
        template: activeTemplate,
        textLayers,
        title: memeTitle || activeTemplate.name,
        previewWidth: renderedCanvasSize.width,
        previewHeight: renderedCanvasSize.height,
        canvasSettings,
      });

      if (result.success) {
        setNotification({
          type: 'success',
          message: 'Meme shared successfully!',
        });
      } else {
        setNotification({
          type: 'info',
          message: result.error || 'Native device share was unavailable.',
        });
      }
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col h-[100dvh] w-full max-w-[100vw] bg-[#070d1e] text-slate-100 overflow-hidden select-none">
      {/* Top Toolbar */}
      <EditorToolbar
        onBack={onBack}
        onExport={handleExport}
        onExportFormat={handleExportFormat}
        onCopyImage={handleCopyClipboard}
        onShareImage={handleShare}
        onOpenUploadModal={() => setIsUploadModalOpen(true)}
        onOpenAiModal={() => setIsAiModalOpen(true)}
      />

      {/* Main Studio Body: Canvas + Properties Panel */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative min-h-0 min-w-0">
        {/* Centered Canvas Editing Viewport */}
        <main
          id="editor-canvas-viewport"
          aria-label="Meme Canvas Workspace"
          className="flex-1 flex flex-col relative overflow-hidden min-h-0"
        >
          <MemeCanvas onCanvasSizeChange={handleCanvasSizeChange} />
        </main>

        {/* Right / Bottom Properties Controls Panel */}
        <EditorPropertiesPanel onOpenAiModal={() => setIsAiModalOpen(true)} />
      </div>

      {/* Confirmation & Template Switcher Modals */}
      <ResetConfirmModal />
      <TemplatePickerModal />
      <CustomImageUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />
      <AiEditorModal isOpen={isAiModalOpen} onClose={() => setIsAiModalOpen(false)} />
    </div>
  );
};
