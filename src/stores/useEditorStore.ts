import { create } from 'zustand';
import type { TextLayer, CanvasSettings, EditorHistoryEntry, DoodleStroke } from '../types/editor';
import type { MemeTemplate } from '../types/template';
import type { MemeDraft } from '../types/draft';
import { POPULAR_TEMPLATES } from '../constants/templates';

const MAX_HISTORY = 30;

function createDefaultLayers(template: MemeTemplate): TextLayer[] {
  if (template.defaultTextSlots && template.defaultTextSlots.length > 0) {
    return template.defaultTextSlots.map((slot, index) => ({
      id: `layer-${index + 1}-${Math.random().toString(36).slice(2, 7)}`,
      text: slot.placeholder,
      xPercent: 50,
      yPercent: slot.defaultYPercent,
      fontSize: 36,
      color: '#FFFFFF',
      strokeColor: '#000000',
      strokeWidth: 3,
      isBold: true,
      isItalic: false,
      isUppercase: true,
      alignment: 'center',
      fontFamily: 'Impact',
      rotation: 0,
      opacity: 1,
    }));
  }

  // Fallback top & bottom
  return [
    {
      id: `layer-top-${Math.random().toString(36).slice(2, 7)}`,
      text: 'TOP CAPTION',
      xPercent: 50,
      yPercent: 12,
      fontSize: 36,
      color: '#FFFFFF',
      strokeColor: '#000000',
      strokeWidth: 3,
      isBold: true,
      isItalic: false,
      isUppercase: true,
      alignment: 'center',
      fontFamily: 'Impact',
      rotation: 0,
      opacity: 1,
    },
    {
      id: `layer-bottom-${Math.random().toString(36).slice(2, 7)}`,
      text: 'BOTTOM CAPTION',
      xPercent: 50,
      yPercent: 88,
      fontSize: 36,
      color: '#FFFFFF',
      strokeColor: '#000000',
      strokeWidth: 3,
      isBold: true,
      isItalic: false,
      isUppercase: true,
      alignment: 'center',
      fontFamily: 'Impact',
      rotation: 0,
      opacity: 1,
    },
  ];
}

interface EditorStoreState {
  activeTemplate: MemeTemplate | null;
  memeTitle: string;
  textLayers: TextLayer[];
  selectedLayerId: string | null;
  canvasSettings: CanvasSettings;
  history: {
    past: EditorHistoryEntry[];
    future: EditorHistoryEntry[];
  };
  isExporting: boolean;
  exportFormat: 'png' | 'jpeg' | 'webp';
  isResetModalOpen: boolean;
  isTemplatePickerOpen: boolean;
  currentDraftId: string | null;

  // Actions
  loadTemplate: (template: MemeTemplate, preserveCustomText?: boolean) => void;
  loadDraft: (draft: MemeDraft) => void;
  setCurrentDraftId: (id: string | null) => void;
  setMemeTitle: (title: string) => void;
  addTextLayer: (preset?: Partial<TextLayer>) => string;
  updateTextLayer: (id: string, updates: Partial<TextLayer>, recordHistory?: boolean) => void;
  commitHistory: () => void;
  pushHistorySnapshot: (preSnapshot: EditorHistoryEntry) => void;
  selectLayer: (id: string | null) => void;
  deleteTextLayer: (id: string) => void;
  duplicateTextLayer: (id: string) => void;
  moveLayerOrder: (id: string, direction: 'up' | 'down') => void;
  undo: () => void;
  redo: () => void;
  resetToTemplate: () => void;
  setZoom: (zoom: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  toggleFitToScreen: () => void;
  toggleGrid: () => void;
  setIsResetModalOpen: (open: boolean) => void;
  setIsTemplatePickerOpen: (open: boolean) => void;
  setIsExporting: (exporting: boolean) => void;
  updateCanvasSettings: (updates: Partial<CanvasSettings>) => void;
  resetCanvasFilters: () => void;
  toggleFlipHorizontal: () => void;
  toggleFlipVertical: () => void;
  addDoodleStroke: (stroke: DoodleStroke) => void;
  clearDoodles: () => void;
  undoLastDoodle: () => void;
  applyFilterPreset: (preset: 'normal' | 'autotune' | 'hdr' | 'drama' | 'glamour' | 'vintage' | 'noir' | 'retrolux' | 'deepfry' | 'cyberpunk' | 'vhs' | 'cursed') => void;
  isComparing: boolean;
  setIsComparing: (comparing: boolean) => void;
  isDrawingMode: boolean;
  setIsDrawingMode: (active: boolean) => void;
  drawingColor: string;
  setDrawingColor: (color: string) => void;
  drawingBrushSize: number;
  setDrawingBrushSize: (size: number) => void;
  isDrawingHighlighter: boolean;
  setIsDrawingHighlighter: (highlighter: boolean) => void;
  applyAiCaption: (options: {
    text: string;
    mode?: 'replace' | 'new';
    topText?: string;
    bottomText?: string;
  }) => void;
}

export const useEditorStore = create<EditorStoreState>((set, get) => {
  const initialTemplate = POPULAR_TEMPLATES[0];
  const initialLayers = createDefaultLayers(initialTemplate);

  return {
    activeTemplate: initialTemplate,
    memeTitle: `${initialTemplate.name} Meme`,
    textLayers: initialLayers,
    selectedLayerId: initialLayers[0]?.id || null,
    canvasSettings: {
      aspectRatio: 'original',
      backgroundColor: '#020617',
      padding: 0,
      zoom: 1,
      fitToScreen: true,
      showGrid: false,
      brightness: 100,
      contrast: 100,
      saturation: 100,
      exposure: 0,
      highlights: 0,
      shadows: 0,
      warmth: 0,
      tint: 0,
      clarity: 0,
      vignette: 0,
      grain: 0,
      sepia: 0,
      invert: 0,
      blur: 0,
      hueRotate: 0,
      flipHorizontal: false,
      flipVertical: false,
      frameStyle: 'none',
      frameTitle: '',
      frameSubtitle: '',
      watermarkText: '',
      watermarkOpacity: 0.7,
      watermarkPosition: 'bottom-right',
      doodles: [],
    },
    history: {
      past: [],
      future: [],
    },
    isExporting: false,
    exportFormat: 'png',
    isResetModalOpen: false,
    isTemplatePickerOpen: false,
    currentDraftId: null,
    isComparing: false,
    setIsComparing: (comparing: boolean) => set({ isComparing: comparing }),
    isDrawingMode: false,
    drawingColor: '#EF4444',
    drawingBrushSize: 5,
    isDrawingHighlighter: false,

    loadTemplate: (template, preserveCustomText = false) => {
      const state = get();
      const currentLayers = preserveCustomText && state.textLayers.length > 0
        ? state.textLayers
        : createDefaultLayers(template);

      set({
        activeTemplate: template,
        memeTitle: `${template.name} Meme`,
        textLayers: currentLayers,
        selectedLayerId: currentLayers[0]?.id || null,
        currentDraftId: null,
        history: {
          past: [],
          future: [],
        },
      });
    },

    loadDraft: (draft) => {
      set({
        activeTemplate: draft.template,
        memeTitle: draft.title,
        textLayers: JSON.parse(JSON.stringify(draft.textLayers)),
        selectedLayerId: draft.textLayers[0]?.id || null,
        currentDraftId: draft.id,
        canvasSettings: draft.canvasSettings
          ? { ...get().canvasSettings, ...draft.canvasSettings }
          : get().canvasSettings,
        history: {
          past: [],
          future: [],
        },
      });
    },

    setCurrentDraftId: (id) => {
      set({ currentDraftId: id });
    },


    setMemeTitle: (title) => {
      set({ memeTitle: title });
    },

    addTextLayer: (preset) => {
      const state = get();
      const newId = `layer-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      const newLayer: TextLayer = {
        id: newId,
        text: preset?.text || 'NEW CAPTION',
        xPercent: preset?.xPercent ?? 50,
        yPercent: preset?.yPercent ?? 50,
        fontSize: preset?.fontSize ?? 34,
        color: preset?.color || '#FFFFFF',
        strokeColor: preset?.strokeColor || '#000000',
        strokeWidth: preset?.strokeWidth ?? 3,
        isBold: preset?.isBold ?? true,
        isItalic: preset?.isItalic ?? false,
        isUppercase: preset?.isUppercase ?? true,
        alignment: preset?.alignment || 'center',
        fontFamily: preset?.fontFamily || 'Impact',
        rotation: preset?.rotation ?? 0,
        opacity: preset?.opacity ?? 1,
      };

      const snapshot: EditorHistoryEntry = {
        textLayers: JSON.parse(JSON.stringify(state.textLayers)),
        memeTitle: state.memeTitle,
      };

      set({
        textLayers: [...state.textLayers, newLayer],
        selectedLayerId: newId,
        history: {
          past: [...state.history.past.slice(-MAX_HISTORY + 1), snapshot],
          future: [],
        },
      });

      return newId;
    },

    updateTextLayer: (id, updates, recordHistory = false) => {
      const state = get();
      let newPast = state.history.past;

      if (recordHistory) {
        const snapshot: EditorHistoryEntry = {
          textLayers: JSON.parse(JSON.stringify(state.textLayers)),
          memeTitle: state.memeTitle,
        };
        newPast = [...state.history.past.slice(-MAX_HISTORY + 1), snapshot];
      }

      set({
        textLayers: state.textLayers.map((layer) =>
          layer.id === id ? { ...layer, ...updates } : layer
        ),
        history: recordHistory
          ? { past: newPast, future: [] }
          : state.history,
      });
    },

    commitHistory: () => {
      const state = get();
      const lastEntry = state.history.past[state.history.past.length - 1];
      if (
        lastEntry &&
        JSON.stringify(lastEntry.textLayers) === JSON.stringify(state.textLayers) &&
        lastEntry.memeTitle === state.memeTitle
      ) {
        return; // Prevent duplicate history snapshot
      }

      const snapshot: EditorHistoryEntry = {
        textLayers: JSON.parse(JSON.stringify(state.textLayers)),
        memeTitle: state.memeTitle,
      };
      set({
        history: {
          past: [...state.history.past.slice(-MAX_HISTORY + 1), snapshot],
          future: [],
        },
      });
    },

    pushHistorySnapshot: (preSnapshot) => {
      const state = get();
      // Only push if something actually changed between preSnapshot and current state
      if (
        JSON.stringify(preSnapshot.textLayers) === JSON.stringify(state.textLayers) &&
        preSnapshot.memeTitle === state.memeTitle
      ) {
        return; // No-op: prevents unnecessary duplicate snapshot
      }

      set({
        history: {
          past: [...state.history.past.slice(-MAX_HISTORY + 1), preSnapshot],
          future: [],
        },
      });
    },

    selectLayer: (id) => {
      set({ selectedLayerId: id });
    },

    deleteTextLayer: (id) => {
      const state = get();
      const snapshot: EditorHistoryEntry = {
        textLayers: JSON.parse(JSON.stringify(state.textLayers)),
        memeTitle: state.memeTitle,
      };

      const updatedLayers = state.textLayers.filter((l) => l.id !== id);
      const newSelectedId =
        state.selectedLayerId === id
          ? updatedLayers[0]?.id || null
          : state.selectedLayerId;

      set({
        textLayers: updatedLayers,
        selectedLayerId: newSelectedId,
        history: {
          past: [...state.history.past.slice(-MAX_HISTORY + 1), snapshot],
          future: [],
        },
      });
    },

    duplicateTextLayer: (id) => {
      const state = get();
      const target = state.textLayers.find((l) => l.id === id);
      if (!target) return;

      const newId = `layer-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      const duplicated: TextLayer = {
        ...target,
        id: newId,
        xPercent: Math.min(92, target.xPercent + 4),
        yPercent: Math.min(92, target.yPercent + 4),
      };

      const snapshot: EditorHistoryEntry = {
        textLayers: JSON.parse(JSON.stringify(state.textLayers)),
        memeTitle: state.memeTitle,
      };

      set({
        textLayers: [...state.textLayers, duplicated],
        selectedLayerId: newId,
        history: {
          past: [...state.history.past.slice(-MAX_HISTORY + 1), snapshot],
          future: [],
        },
      });
    },

    moveLayerOrder: (id, direction) => {
      const state = get();
      const index = state.textLayers.findIndex((l) => l.id === id);
      if (index === -1) return;

      const newIndex = direction === 'up' ? index + 1 : index - 1;
      if (newIndex < 0 || newIndex >= state.textLayers.length) return;

      const snapshot: EditorHistoryEntry = {
        textLayers: JSON.parse(JSON.stringify(state.textLayers)),
        memeTitle: state.memeTitle,
      };

      const reordered = [...state.textLayers];
      const [item] = reordered.splice(index, 1);
      reordered.splice(newIndex, 0, item);

      set({
        textLayers: reordered,
        history: {
          past: [...state.history.past.slice(-MAX_HISTORY + 1), snapshot],
          future: [],
        },
      });
    },

    undo: () => {
      const state = get();
      if (state.history.past.length === 0) return;

      const previous = state.history.past[state.history.past.length - 1];
      const newPast = state.history.past.slice(0, -1);

      const currentSnapshot: EditorHistoryEntry = {
        textLayers: JSON.parse(JSON.stringify(state.textLayers)),
        memeTitle: state.memeTitle,
      };

      const restoredLayers = JSON.parse(JSON.stringify(previous.textLayers));
      const validSelectedId = restoredLayers.some(
        (l: TextLayer) => l.id === state.selectedLayerId
      )
        ? state.selectedLayerId
        : restoredLayers[0]?.id || null;

      set({
        textLayers: restoredLayers,
        memeTitle: previous.memeTitle,
        selectedLayerId: validSelectedId,
        history: {
          past: newPast,
          future: [currentSnapshot, ...state.history.future.slice(0, MAX_HISTORY - 1)],
        },
      });
    },

    redo: () => {
      const state = get();
      if (state.history.future.length === 0) return;

      const next = state.history.future[0];
      const newFuture = state.history.future.slice(1);

      const currentSnapshot: EditorHistoryEntry = {
        textLayers: JSON.parse(JSON.stringify(state.textLayers)),
        memeTitle: state.memeTitle,
      };

      const restoredLayers = JSON.parse(JSON.stringify(next.textLayers));
      const validSelectedId = restoredLayers.some(
        (l: TextLayer) => l.id === state.selectedLayerId
      )
        ? state.selectedLayerId
        : restoredLayers[0]?.id || null;

      set({
        textLayers: restoredLayers,
        memeTitle: next.memeTitle,
        selectedLayerId: validSelectedId,
        history: {
          past: [...state.history.past.slice(-MAX_HISTORY + 1), currentSnapshot],
          future: newFuture,
        },
      });
    },

    resetToTemplate: () => {
      const state = get();
      if (!state.activeTemplate) return;

      const snapshot: EditorHistoryEntry = {
        textLayers: JSON.parse(JSON.stringify(state.textLayers)),
        memeTitle: state.memeTitle,
      };

      const resetLayers = createDefaultLayers(state.activeTemplate);
      set({
        textLayers: resetLayers,
        memeTitle: `${state.activeTemplate.name} Meme`,
        selectedLayerId: resetLayers[0]?.id || null,
        isResetModalOpen: false,
        history: {
          past: [...state.history.past.slice(-MAX_HISTORY + 1), snapshot],
          future: [],
        },
      });
    },

    setZoom: (zoom) => {
      const clamped = Math.max(0.3, Math.min(2.5, Number(zoom.toFixed(2))));
      set((state) => ({
        canvasSettings: { ...state.canvasSettings, zoom: clamped, fitToScreen: false },
      }));
    },

    zoomIn: () => {
      set((state) => ({
        canvasSettings: {
          ...state.canvasSettings,
          zoom: Math.min(2.5, Number((state.canvasSettings.zoom + 0.15).toFixed(2))),
          fitToScreen: false,
        },
      }));
    },

    zoomOut: () => {
      set((state) => ({
        canvasSettings: {
          ...state.canvasSettings,
          zoom: Math.max(0.3, Number((state.canvasSettings.zoom - 0.15).toFixed(2))),
          fitToScreen: false,
        },
      }));
    },

    resetZoom: () => {
      set((state) => ({
        canvasSettings: { ...state.canvasSettings, zoom: 1, fitToScreen: false },
      }));
    },

    toggleFitToScreen: () => {
      set((state) => ({
        canvasSettings: {
          ...state.canvasSettings,
          fitToScreen: !state.canvasSettings.fitToScreen,
          zoom: 1,
        },
      }));
    },

    toggleGrid: () => {
      set((state) => ({
        canvasSettings: { ...state.canvasSettings, showGrid: !state.canvasSettings.showGrid },
      }));
    },

    setIsResetModalOpen: (open) => {
      set({ isResetModalOpen: open });
    },

    setIsTemplatePickerOpen: (open) => {
      set({ isTemplatePickerOpen: open });
    },

    setIsExporting: (exporting) => {
      set({ isExporting: exporting });
    },

    updateCanvasSettings: (updates) => {
      set((state) => ({
        canvasSettings: { ...state.canvasSettings, ...updates },
      }));
    },

    resetCanvasFilters: () => {
      set((state) => ({
        canvasSettings: {
          ...state.canvasSettings,
          brightness: 100,
          contrast: 100,
          saturation: 100,
          exposure: 0,
          highlights: 0,
          shadows: 0,
          warmth: 0,
          tint: 0,
          clarity: 0,
          vignette: 0,
          grain: 0,
          sepia: 0,
          invert: 0,
          blur: 0,
          hueRotate: 0,
        },
      }));
    },

    toggleFlipHorizontal: () => {
      set((state) => ({
        canvasSettings: {
          ...state.canvasSettings,
          flipHorizontal: !state.canvasSettings.flipHorizontal,
        },
      }));
    },

    toggleFlipVertical: () => {
      set((state) => ({
        canvasSettings: {
          ...state.canvasSettings,
          flipVertical: !state.canvasSettings.flipVertical,
        },
      }));
    },

    addDoodleStroke: (stroke) => {
      set((state) => ({
        canvasSettings: {
          ...state.canvasSettings,
          doodles: [...(state.canvasSettings.doodles || []), stroke],
        },
      }));
    },

    clearDoodles: () => {
      set((state) => ({
        canvasSettings: {
          ...state.canvasSettings,
          doodles: [],
        },
      }));
    },

    undoLastDoodle: () => {
      set((state) => ({
        canvasSettings: {
          ...state.canvasSettings,
          doodles: (state.canvasSettings.doodles || []).slice(0, -1),
        },
      }));
    },

    applyFilterPreset: (preset) => {
      set((state) => {
        let filters: Partial<CanvasSettings> = {
          brightness: 100,
          contrast: 100,
          saturation: 100,
          exposure: 0,
          highlights: 0,
          shadows: 0,
          warmth: 0,
          tint: 0,
          clarity: 0,
          vignette: 0,
          grain: 0,
          sepia: 0,
          invert: 0,
          blur: 0,
          hueRotate: 0,
        };
        switch (preset) {
          case 'autotune':
            filters = {
              ...filters,
              brightness: 105,
              contrast: 115,
              saturation: 110,
              highlights: 10,
              shadows: 8,
              warmth: 5,
              clarity: 15,
            };
            break;
          case 'hdr':
            filters = {
              ...filters,
              brightness: 105,
              contrast: 130,
              saturation: 125,
              highlights: 25,
              shadows: 20,
              warmth: 5,
              clarity: 55,
              vignette: 20,
            };
            break;
          case 'drama':
            filters = {
              ...filters,
              brightness: 95,
              contrast: 140,
              saturation: 75,
              highlights: -15,
              shadows: -20,
              warmth: -10,
              clarity: 45,
              vignette: 40,
              grain: 15,
            };
            break;
          case 'glamour':
            filters = {
              ...filters,
              brightness: 110,
              contrast: 95,
              saturation: 115,
              highlights: 30,
              shadows: 15,
              warmth: 25,
              tint: 5,
              clarity: 0,
              vignette: 15,
            };
            break;
          case 'retrolux':
            filters = {
              ...filters,
              brightness: 102,
              contrast: 120,
              saturation: 110,
              highlights: 15,
              shadows: 10,
              warmth: 25,
              tint: 10,
              clarity: 20,
              vignette: 35,
              grain: 45,
              sepia: 15,
            };
            break;
          case 'deepfry':
            filters = {
              ...filters,
              brightness: 125,
              contrast: 190,
              saturation: 200,
              highlights: 40,
              shadows: -30,
              warmth: 40,
              clarity: 70,
            };
            break;
          case 'vintage':
            filters = {
              ...filters,
              brightness: 98,
              contrast: 115,
              saturation: 85,
              highlights: 10,
              shadows: 15,
              warmth: 35,
              tint: 5,
              clarity: 10,
              vignette: 45,
              grain: 25,
              sepia: 35,
            };
            break;
          case 'noir':
            filters = {
              ...filters,
              brightness: 105,
              contrast: 150,
              saturation: 0,
              highlights: 15,
              shadows: -25,
              clarity: 35,
              vignette: 45,
              grain: 30,
            };
            break;
          case 'cyberpunk':
            filters = {
              ...filters,
              brightness: 110,
              contrast: 140,
              saturation: 175,
              highlights: 20,
              shadows: -15,
              warmth: -40,
              tint: 30,
              clarity: 30,
              vignette: 25,
              hueRotate: 180,
            };
            break;
          case 'vhs':
            filters = {
              ...filters,
              brightness: 105,
              contrast: 130,
              saturation: 140,
              highlights: 10,
              shadows: 10,
              warmth: 15,
              tint: 15,
              clarity: 15,
              vignette: 30,
              grain: 50,
              sepia: 20,
              hueRotate: 330,
            };
            break;
          case 'cursed':
            filters = {
              ...filters,
              brightness: 100,
              contrast: 130,
              saturation: 120,
              invert: 100,
            };
            break;
          case 'normal':
          default:
            filters = {
              brightness: 100,
              contrast: 100,
              saturation: 100,
              exposure: 0,
              highlights: 0,
              shadows: 0,
              warmth: 0,
              tint: 0,
              clarity: 0,
              vignette: 0,
              grain: 0,
              sepia: 0,
              invert: 0,
              blur: 0,
              hueRotate: 0,
            };
            break;
        }
        return {
          canvasSettings: {
            ...state.canvasSettings,
            ...filters,
          },
        };
      });
    },

    setIsDrawingMode: (active) => set({ isDrawingMode: active }),
    setDrawingColor: (color) => set({ drawingColor: color }),
    setDrawingBrushSize: (size) => set({ drawingBrushSize: size }),
    setIsDrawingHighlighter: (highlighter) => set({ isDrawingHighlighter: highlighter }),

    applyAiCaption: ({ text, mode = 'replace', topText, bottomText }) => {
      const state = get();
      const snapshot: EditorHistoryEntry = {
        textLayers: JSON.parse(JSON.stringify(state.textLayers)),
        memeTitle: state.memeTitle,
      };

      // If user has top & bottom captions generated and at least 2 layers exist and mode is 'replace'
      if (mode === 'replace' && topText && bottomText && state.textLayers.length >= 2) {
        const updatedLayers = [...state.textLayers];
        updatedLayers[0] = { ...updatedLayers[0], text: topText };
        updatedLayers[1] = { ...updatedLayers[1], text: bottomText };
        set({
          textLayers: updatedLayers,
          history: {
            past: [...state.history.past.slice(-MAX_HISTORY + 1), snapshot],
            future: [],
          },
        });
        return;
      }

      // If replacing active selected layer or first layer
      if (mode === 'replace' && state.textLayers.length > 0) {
        const targetId = state.selectedLayerId || state.textLayers[0].id;
        const updatedLayers = state.textLayers.map((l) =>
          l.id === targetId ? { ...l, text } : l
        );
        set({
          textLayers: updatedLayers,
          selectedLayerId: targetId,
          history: {
            past: [...state.history.past.slice(-MAX_HISTORY + 1), snapshot],
            future: [],
          },
        });
        return;
      }

      // Default / fallback / 'new' mode: add as new layer
      const newId = `layer-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      const newLayer: TextLayer = {
        id: newId,
        text,
        xPercent: 50,
        yPercent: state.textLayers.length === 0 ? 50 : Math.min(85, 30 + state.textLayers.length * 15),
        fontSize: 34,
        color: '#FFFFFF',
        strokeColor: '#000000',
        strokeWidth: 3,
        isBold: true,
        isItalic: false,
        isUppercase: true,
        alignment: 'center',
        fontFamily: 'Impact',
        rotation: 0,
        opacity: 1,
      };

      set({
        textLayers: [...state.textLayers, newLayer],
        selectedLayerId: newId,
        history: {
          past: [...state.history.past.slice(-MAX_HISTORY + 1), snapshot],
          future: [],
        },
      });
    },
  };
});
