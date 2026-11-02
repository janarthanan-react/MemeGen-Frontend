import React, { useState, useRef, useMemo } from 'react';
import {
  Type,
  Plus,
  Trash2,
  Copy,
  ChevronUp,
  ChevronDown,
  Palette,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Sliders,
  Layers,
  RotateCw,
  Bot,
  SlidersHorizontal,
  Wand2,
  Lock,
  Unlock,
  RefreshCw,
  Maximize2,
  Square,
  Smartphone,
  Tv,
  PenTool,
  FlipHorizontal,
  FlipVertical,
  LayoutTemplate,
  Undo2,
  Sun,
  Flame,
  Shield,
  Glasses,
  CheckCircle2,
  AlertTriangle,
  Eye,
  Contrast,
  CircleDot,
  Aperture,
  Search,
  X,
  Smile,
} from 'lucide-react';
import { MEME_PRESETS, MEME_STYLE_CATEGORIES, type MemePresetStyle } from '../../constants/memeStyles';
import { MEME_FRAMES, MEME_FRAME_CATEGORIES, type MemeFramePreset } from '../../constants/memeFrames';
import {
  MOBILE_EMOJIS,
  MOBILE_EMOJI_CATEGORIES,
  type MobileEmojiCategory,
} from '../../constants/mobileEmojis';
import type { TextLayer } from '../../types/editor';
import { useEditorStore } from '../../stores/useEditorStore';
import { useAiAssistantStore } from '../../stores/useAiAssistantStore';
import type { AiTone } from '../../types/ai';

const FONT_OPTIONS = [
  { label: 'Impact (Classic Meme)', value: 'Impact' },
  { label: 'Plus Jakarta Sans', value: 'Plus Jakarta Sans' },
  { label: 'Inter', value: 'Inter' },
  { label: 'Comic Sans MS', value: 'Comic Sans MS' },
  { label: 'Arvo (Serif)', value: 'Arvo' },
  { label: 'Oleo Script (Cursive)', value: 'Oleo Script' },
  { label: 'Arial Black', value: 'Arial Black' },
  { label: 'Courier New (Mono)', value: 'Courier New' },
];

const PRESET_COLORS = [
  '#FFFFFF',
  '#000000',
  '#FACC15', // Yellow
  '#EF4444', // Red
  '#3B82F6', // Blue
  '#10B981', // Emerald
  '#A855F7', // Purple
  '#06B6D4', // Cyan
];

const BG_BOX_PRESETS = [
  { label: 'None', value: 'transparent' },
  { label: 'Dark 85%', value: 'rgba(0, 0, 0, 0.85)' },
  { label: 'Black', value: '#000000' },
  { label: 'White', value: '#FFFFFF' },
  { label: 'Blue', value: '#1463E9' },
  { label: 'Cyan', value: '#06B6D4' },
  { label: 'Red', value: '#EF4444' },
  { label: 'Yellow', value: '#FACC15' },
];

const POSITION_MATRIX = [
  { label: 'TL', x: 16, y: 12, title: 'Top-Left' },
  { label: 'Top', x: 50, y: 12, title: 'Top-Center' },
  { label: 'TR', x: 84, y: 12, title: 'Top-Right' },
  { label: 'ML', x: 16, y: 50, title: 'Middle-Left' },
  { label: 'Center', x: 50, y: 50, title: 'Dead Center' },
  { label: 'MR', x: 84, y: 50, title: 'Middle-Right' },
  { label: 'BL', x: 16, y: 88, title: 'Bottom-Left' },
  { label: 'Bottom', x: 50, y: 88, title: 'Bottom-Center' },
  { label: 'BR', x: 84, y: 88, title: 'Bottom-Right' },
];

const MEME_STICKERS = [
  { text: 'VERIFIED', color: '#FFFFFF', bg: '#1463E9', stroke: '#0E52C7' },
  { text: 'STONKS', color: '#10B981', bg: '#064E3B', stroke: '#059669' },
  { text: 'NOT STONKS', color: '#F43F5E', bg: '#881337', stroke: '#E11D48' },
  { text: 'POV:', color: '#06B6D4', bg: '#083344', stroke: '#0891B2' },
  { text: 'NOBODY:', color: '#F59E0B', bg: '#451A03', stroke: '#D97706' },
  { text: 'ME:', color: '#A855F7', bg: '#3B0764', stroke: '#9333EA' },
  { text: 'CONFUSED', color: '#FACC15', bg: '#422006', stroke: '#CA8A04' },
  { text: 'BRUH', color: '#FFFFFF', bg: '#4338CA', stroke: '#3730A3' },
  { text: 'W', color: '#10B981', bg: '#064E3B', stroke: '#059669' },
  { text: 'L', color: '#EF4444', bg: '#7F1D1D', stroke: '#DC2626' },
  { text: 'NO CAP', color: '#38BDF8', bg: '#082F49', stroke: '#0284C7' },
  { text: 'CHAD', color: '#FFFFFF', bg: '#1E293B', stroke: '#475569' },
  { text: 'THUG LIFE', color: '#FDE047', bg: '#18181B', stroke: '#713F12' },
  { text: 'FINAL BOSS', color: '#FDA4AF', bg: '#881337', stroke: '#E11D48' },
  { text: 'BRAIN EXPANSION', color: '#E9D5FF', bg: '#581C87', stroke: '#9333EA' },
];

const AI_TONES: { label: string; value: AiTone }[] = [
  { label: 'Sarcastic', value: 'sarcastic' },
  { label: 'Funny', value: 'funny' },
  { label: 'Relatable', value: 'relatable' },
  { label: 'Dark Humor', value: 'dark-humor' },
  { label: 'Wholesome', value: 'wholesome' },
];

export type EditorTab =
  | 'text'
  | 'styles'
  | 'frames'
  | 'draw'
  | 'stickers'
  | 'filters'
  | 'canvas'
  | 'ai'
  | 'layers';

export interface EditorPropertiesPanelProps {
  onOpenAiModal?: () => void;
}

export const EditorPropertiesPanel: React.FC<EditorPropertiesPanelProps> = ({ onOpenAiModal }) => {
  const textLayers = useEditorStore((state) => state.textLayers);
  const selectedLayerId = useEditorStore((state) => state.selectedLayerId);
  const memeTitle = useEditorStore((state) => state.memeTitle);
  const selectLayer = useEditorStore((state) => state.selectLayer);
  const addTextLayer = useEditorStore((state) => state.addTextLayer);
  const updateTextLayer = useEditorStore((state) => state.updateTextLayer);
  const pushHistorySnapshot = useEditorStore((state) => state.pushHistorySnapshot);
  const deleteTextLayer = useEditorStore((state) => state.deleteTextLayer);
  const duplicateTextLayer = useEditorStore((state) => state.duplicateTextLayer);
  const moveLayerOrder = useEditorStore((state) => state.moveLayerOrder);
  const canvasSettings = useEditorStore((state) => state.canvasSettings);
  const updateCanvasSettings = useEditorStore((state) => state.updateCanvasSettings);
  const resetCanvasFilters = useEditorStore((state) => state.resetCanvasFilters);
  const toggleFlipHorizontal = useEditorStore((state) => state.toggleFlipHorizontal);
  const toggleFlipVertical = useEditorStore((state) => state.toggleFlipVertical);
  const applyFilterPreset = useEditorStore((state) => state.applyFilterPreset);
  const isComparing = useEditorStore((state) => state.isComparing);
  const setIsComparing = useEditorStore((state) => state.setIsComparing);
  const isDrawingMode = useEditorStore((state) => state.isDrawingMode);
  const setIsDrawingMode = useEditorStore((state) => state.setIsDrawingMode);
  const drawingColor = useEditorStore((state) => state.drawingColor);
  const setDrawingColor = useEditorStore((state) => state.setDrawingColor);
  const drawingBrushSize = useEditorStore((state) => state.drawingBrushSize);
  const setDrawingBrushSize = useEditorStore((state) => state.setDrawingBrushSize);
  const isDrawingHighlighter = useEditorStore((state) => state.isDrawingHighlighter);
  const setIsDrawingHighlighter = useEditorStore((state) => state.setIsDrawingHighlighter);
  const clearDoodles = useEditorStore((state) => state.clearDoodles);
  const undoLastDoodle = useEditorStore((state) => state.undoLastDoodle);

  // AI Assistant Store for inline generation
  const aiPrompt = useAiAssistantStore((state) => state.prompt);
  const setAiPrompt = useAiAssistantStore((state) => state.setPrompt);
  const aiTone = useAiAssistantStore((state) => state.tone);
  const setAiTone = useAiAssistantStore((state) => state.setTone);
  const aiCaptions = useAiAssistantStore((state) => state.captions);
  const isAiLoading = useAiAssistantStore((state) => state.isLoading);
  const generateCaptions = useAiAssistantStore((state) => state.generateCaptions);

  const [activeTab, setActiveTab] = useState<EditorTab>('text');
  const [isMobileCollapsed, setIsMobileCollapsed] = useState(false);
  const [prevSelectedLayerId, setPrevSelectedLayerId] = useState<string | null>(selectedLayerId);

  const selectedLayer = textLayers.find((l) => l.id === selectedLayerId);

  // 215+ Styles Search, Category & Pagination State
  const [styleSearch, setStyleSearch] = useState('');
  const [styleCategory, setStyleCategory] = useState<string>('All');
  const [styleVisibleLimit, setStyleVisibleLimit] = useState(24);
  const [recentlyAppliedStyleId, setRecentlyAppliedStyleId] = useState<string | null>(null);

  const filteredStyles = useMemo(() => {
    const q = styleSearch.trim().toLowerCase();
    return MEME_PRESETS.filter((item) => {
      const matchesCategory = styleCategory === 'All' || item.category === styleCategory;
      if (!matchesCategory) return false;
      if (!q) return true;
      return (
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.style.fontFamily.toLowerCase().includes(q)
      );
    });
  }, [styleSearch, styleCategory]);

  // 225+ Frames & Layouts Search, Category & Pagination State
  const [frameSearch, setFrameSearch] = useState('');
  const [frameCategory, setFrameCategory] = useState<string>('All');
  const [frameVisibleLimit, setFrameVisibleLimit] = useState(24);
  const [recentlyAppliedFrameId, setRecentlyAppliedFrameId] = useState<string | null>(null);

  const filteredFrames = useMemo(() => {
    const q = frameSearch.trim().toLowerCase();
    return MEME_FRAMES.filter((item) => {
      const matchesCategory = frameCategory === 'All' || item.category === frameCategory;
      if (!matchesCategory) return false;
      if (!q) return true;
      return (
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        (item.frameTitle && item.frameTitle.toLowerCase().includes(q)) ||
        (item.headerBannerText && item.headerBannerText.toLowerCase().includes(q)) ||
        (item.overlayBadge && item.overlayBadge.toLowerCase().includes(q))
      );
    });
  }, [frameSearch, frameCategory]);

  const handleApplyFrame = (frame: MemeFramePreset) => {
    setRecentlyAppliedFrameId(frame.id);
    setTimeout(() => {
      setRecentlyAppliedFrameId((prev) => (prev === frame.id ? null : prev));
    }, 1500);

    updateCanvasSettings({
      padding: frame.padding,
      backgroundColor: frame.backgroundColor,
      frameStyle: frame.frameStyle,
      frameTitle: frame.frameTitle ?? '',
      frameSubtitle: frame.frameSubtitle ?? '',
      borderWidth: frame.borderWidth,
      borderColor: frame.borderColor,
      borderRadius: frame.borderRadius,
      borderStyleType: frame.borderStyleType,
      overlayBadge: frame.overlayBadge,
      overlayBadgeBg: frame.overlayBadgeBg,
      overlayBadgeColor: frame.overlayBadgeColor,
      headerBannerText: frame.headerBannerText,
      headerBannerBg: frame.headerBannerBg,
      headerBannerColor: frame.headerBannerColor,
      ...(frame.aspectRatio ? { aspectRatio: frame.aspectRatio } : {}),
    });
  };

  const handleResetFrame = () => {
    updateCanvasSettings({
      padding: 0,
      backgroundColor: '#020617',
      frameStyle: 'none',
      frameTitle: '',
      frameSubtitle: '',
      borderWidth: undefined,
      borderColor: undefined,
      borderRadius: undefined,
      borderStyleType: undefined,
      overlayBadge: undefined,
      overlayBadgeBg: undefined,
      overlayBadgeColor: undefined,
      headerBannerText: undefined,
      headerBannerBg: undefined,
      headerBannerColor: undefined,
    });
  };

  // Mobile Emojis State & Placement Handlers
  const [emojiSearch, setEmojiSearch] = useState('');
  const [emojiCategory, setEmojiCategory] = useState<MobileEmojiCategory>('All');
  const [emojiSizeMode, setEmojiSizeMode] = useState<'small' | 'medium' | 'large' | 'giant'>('medium');
  const [emojiTargetMode, setEmojiTargetMode] = useState<'sticker' | 'caption'>('sticker');
  const [recentlyAddedEmoji, setRecentlyAddedEmoji] = useState<string | null>(null);

  const filteredEmojis = useMemo(() => {
    const q = emojiSearch.trim().toLowerCase();
    return MOBILE_EMOJIS.filter((item) => {
      const matchesCategory = emojiCategory === 'All' || item.category === emojiCategory;
      if (!matchesCategory) return false;
      if (!q) return true;
      return (
        item.name.toLowerCase().includes(q) ||
        item.keywords.toLowerCase().includes(q) ||
        item.emoji.includes(q)
      );
    });
  }, [emojiSearch, emojiCategory]);

  const handleAddEmoji = (emojiChar: string) => {
    setRecentlyAddedEmoji(emojiChar);
    setTimeout(() => {
      setRecentlyAddedEmoji((prev) => (prev === emojiChar ? null : prev));
    }, 1200);

    // If target is caption and a text layer is selected:
    if (emojiTargetMode === 'caption' && selectedLayer) {
      updateTextLayer(
        selectedLayer.id,
        { text: (selectedLayer.text ? selectedLayer.text + ' ' : '') + emojiChar },
        true
      );
      return;
    }

    // Otherwise, add as a mobile sticker layer on canvas
    const sizeMap: Record<string, number> = {
      small: 36,
      medium: 54,
      large: 78,
      giant: 108,
    };
    const size = sizeMap[emojiSizeMode] || 54;

    addTextLayer({
      text: emojiChar,
      fontSize: size,
      strokeWidth: 0,
      color: '#FFFFFF',
      backgroundColor: 'transparent',
      fontFamily: '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif',
      xPercent: 50,
      yPercent: 50,
      isBold: false,
      isUppercase: false,
    });
  };

  // Auto-expand mobile panel during render when a layer is selected
  if (selectedLayerId && selectedLayerId !== prevSelectedLayerId) {
    setPrevSelectedLayerId(selectedLayerId);
    setIsMobileCollapsed(false);
  } else if (!selectedLayerId && prevSelectedLayerId) {
    setPrevSelectedLayerId(null);
  }

  const textInputSnapshotRef = useRef<{ textLayers: TextLayer[]; memeTitle: string } | null>(null);
  const sliderSnapshotRef = useRef<{ textLayers: TextLayer[]; memeTitle: string } | null>(null);

  const handleTextFocus = () => {
    textInputSnapshotRef.current = {
      textLayers: JSON.parse(JSON.stringify(textLayers)),
      memeTitle,
    };
  };

  const handleTextBlur = () => {
    if (textInputSnapshotRef.current) {
      pushHistorySnapshot(textInputSnapshotRef.current);
      textInputSnapshotRef.current = null;
    }
  };

  const handleSliderStart = () => {
    if (!sliderSnapshotRef.current) {
      sliderSnapshotRef.current = {
        textLayers: JSON.parse(JSON.stringify(textLayers)),
        memeTitle,
      };
    }
  };

  const handleSliderEnd = () => {
    if (sliderSnapshotRef.current) {
      pushHistorySnapshot(sliderSnapshotRef.current);
      sliderSnapshotRef.current = null;
    }
  };

  const setPositionPreset = (x: number, y: number) => {
    if (!selectedLayer) return;
    updateTextLayer(selectedLayer.id, { xPercent: x, yPercent: y }, true);
  };

  const handleApplyPresetStyle = (preset: MemePresetStyle) => {
    setRecentlyAppliedStyleId(preset.id);
    setTimeout(() => {
      setRecentlyAppliedStyleId((prev) => (prev === preset.id ? null : prev));
    }, 1500);

    if (!selectedLayer) {
      addTextLayer({
        text: 'SAMPLE TEXT',
        ...preset.style,
      });
      return;
    }
    updateTextLayer(selectedLayer.id, { ...preset.style }, true);
  };

  const handleAddSticker = (sticker: typeof MEME_STICKERS[0]) => {
    addTextLayer({
      text: sticker.text,
      fontSize: 26,
      color: sticker.color,
      strokeColor: sticker.stroke,
      strokeWidth: 2,
      backgroundColor: sticker.bg,
      isBold: true,
      isUppercase: true,
      xPercent: 50,
      yPercent: 50,
    });
    setActiveTab('text');
  };

  return (
    <aside
      aria-label="Meme text and layer controls"
      className={`w-full lg:w-[420px] xl:w-[460px] 2xl:w-[500px] bg-[#071330] border-t lg:border-t-0 lg:border-l border-white/10 flex flex-col shrink-0 text-slate-100 ${
        isMobileCollapsed ? 'max-h-[50px] lg:max-h-none' : 'max-h-[50dvh] lg:max-h-none'
      } h-full overflow-hidden no-scrollbar transition-[max-height] duration-200 ease-in-out`}
    >
      {/* Top Canva-Grade Tool Switcher Tabs (Desktop & Mobile) */}
      <nav
        aria-label="Editor tool categories"
        className="flex items-center gap-1.5 p-2 bg-slate-950/80 border-b border-white/10 shrink-0 overflow-x-auto no-scrollbar touch-scroll-x"
      >
        <button
          type="button"
          onClick={() => {
            setActiveTab('text');
            setIsMobileCollapsed(false);
          }}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[34px] rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-all duration-150 cursor-pointer hover:-translate-y-0.5 active:scale-95 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none ${
            activeTab === 'text' && !isMobileCollapsed
              ? 'bg-[#1463E9] text-white shadow-xs shadow-blue-500/30'
              : 'text-slate-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <Type className="w-3.5 h-3.5 shrink-0" />
          <span>Text</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('styles');
            setIsMobileCollapsed(false);
          }}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[34px] rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-all duration-150 cursor-pointer hover:-translate-y-0.5 active:scale-95 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none ${
            activeTab === 'styles' && !isMobileCollapsed
              ? 'bg-[#1463E9] text-white shadow-xs shadow-blue-500/30'
              : 'text-slate-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <Palette className="w-3.5 h-3.5 shrink-0 text-amber-400" />
          <span>Styles (215+)</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('frames');
            setIsMobileCollapsed(false);
          }}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[34px] rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-all duration-150 cursor-pointer hover:-translate-y-0.5 active:scale-95 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none ${
            activeTab === 'frames' && !isMobileCollapsed
              ? 'bg-[#1463E9] text-white shadow-xs shadow-blue-500/30'
              : 'text-slate-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <LayoutTemplate className="w-3.5 h-3.5 shrink-0 text-purple-400" />
          <span>Frames (225+)</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('draw');
            setIsMobileCollapsed(false);
          }}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[34px] rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-all duration-150 cursor-pointer hover:-translate-y-0.5 active:scale-95 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none ${
            activeTab === 'draw' && !isMobileCollapsed
              ? 'bg-[#1463E9] text-white shadow-xs shadow-blue-500/30'
              : 'text-slate-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <PenTool className="w-3.5 h-3.5 shrink-0 text-rose-400" />
          <span>Draw & Doodle</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('stickers');
            setIsMobileCollapsed(false);
          }}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[34px] rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-all duration-150 cursor-pointer hover:-translate-y-0.5 active:scale-95 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none ${
            activeTab === 'stickers' && !isMobileCollapsed
              ? 'bg-[#1463E9] text-white shadow-xs shadow-blue-500/30'
              : 'text-slate-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <Smile className="w-3.5 h-3.5 shrink-0 text-amber-400" />
          <span>Emojis & Stickers</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('filters');
            setIsMobileCollapsed(false);
          }}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[34px] rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-all duration-150 cursor-pointer hover:-translate-y-0.5 active:scale-95 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none ${
            activeTab === 'filters' && !isMobileCollapsed
              ? 'bg-[#1463E9] text-white shadow-xs shadow-blue-500/30'
              : 'text-slate-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5 shrink-0 text-cyan-400" />
          <span>Snapseed Tune</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('canvas');
            setIsMobileCollapsed(false);
          }}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[34px] rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-all duration-150 cursor-pointer hover:-translate-y-0.5 active:scale-95 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none ${
            activeTab === 'canvas' && !isMobileCollapsed
              ? 'bg-[#1463E9] text-white shadow-xs shadow-blue-500/30'
              : 'text-slate-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <Maximize2 className="w-3.5 h-3.5 shrink-0 text-blue-400" />
          <span>Canvas & Watermark</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('ai');
            setIsMobileCollapsed(false);
          }}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[34px] rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-all duration-150 cursor-pointer hover:-translate-y-0.5 active:scale-95 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none ${
            activeTab === 'ai' && !isMobileCollapsed
              ? 'bg-[#1463E9] text-white shadow-xs shadow-blue-500/30'
              : 'text-slate-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <Bot className="w-3.5 h-3.5 shrink-0 text-cyan-300" />
          <span>AI Magic</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('layers');
            setIsMobileCollapsed(false);
          }}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[34px] rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-all duration-150 cursor-pointer hover:-translate-y-0.5 active:scale-95 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none ${
            activeTab === 'layers' && !isMobileCollapsed
              ? 'bg-[#1463E9] text-white shadow-xs shadow-blue-500/30'
              : 'text-slate-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <Layers className="w-3.5 h-3.5 shrink-0 text-blue-400" />
          <span>Layers ({textLayers.length})</span>
        </button>

        {/* Mobile Collapse / Expand Button */}
        <button
          type="button"
          onClick={() => setIsMobileCollapsed((prev) => !prev)}
          className="lg:hidden ml-auto p-1.5 min-h-[34px] min-w-[34px] flex items-center justify-center rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
          title={isMobileCollapsed ? 'Expand panel' : 'Collapse panel'}
        >
          {isMobileCollapsed ? (
            <ChevronUp className="w-4 h-4 text-cyan-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>
      </nav>

      {/* Main Tool Content Container (Completely hidden scrollbar, ample horizontal room) */}
      <div
        className={`${
          isMobileCollapsed ? 'hidden lg:block' : 'block'
        } flex-1 overflow-y-auto no-scrollbar p-3.5 sm:p-5 space-y-5 pb-10`}
      >
        {/* ========================================================= */}
        {/* TAB 1: TEXT & TYPOGRAPHY                                  */}
        {/* ========================================================= */}
        {activeTab === 'text' && (
          <div className="space-y-5 animate-in fade-in duration-150">
            {/* Quick Layer Switcher / Add Text Bar */}
            <div className="flex items-center justify-between gap-2 flex-nowrap whitespace-nowrap pb-2 border-b border-white/10">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300 shrink-0 whitespace-nowrap">
                <Type className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>
                  {selectedLayer
                    ? `Layer ${textLayers.findIndex((l) => l.id === selectedLayer.id) + 1} of ${textLayers.length}`
                    : 'Select a caption'}
                </span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0 flex-nowrap whitespace-nowrap">
                {onOpenAiModal && (
                  <button
                    type="button"
                    onClick={onOpenAiModal}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-950/80 to-blue-950/80 border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 hover:text-white text-xs font-bold shadow-2xs hover:shadow-xs hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-150 cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <Bot className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>AI Ideas</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => addTextLayer()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1463E9] hover:bg-[#0E52C7] text-white text-xs font-bold shadow-sm shadow-blue-600/30 hover:shadow-md hover:shadow-blue-500/35 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-150 cursor-pointer whitespace-nowrap shrink-0"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5] shrink-0" />
                  <span>Add Text</span>
                </button>
              </div>
            </div>

            {selectedLayer ? (
              <>
                {/* Caption Text Input */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2 flex-nowrap whitespace-nowrap">
                    <label
                      htmlFor="editor-caption-input"
                      className="text-xs font-bold uppercase tracking-wider text-slate-400 whitespace-nowrap shrink-0"
                    >
                      Caption Text
                    </label>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {selectedLayer.text.length} chars
                    </span>
                  </div>

                  <textarea
                    id="editor-caption-input"
                    rows={3}
                    value={selectedLayer.text}
                    onFocus={handleTextFocus}
                    onChange={(e) =>
                      updateTextLayer(selectedLayer.id, { text: e.target.value }, false)
                    }
                    onBlur={handleTextBlur}
                    placeholder="Type your punchline here..."
                    className="w-full bg-slate-900 text-slate-100 placeholder:text-slate-600 rounded-xl border border-white/15 p-3 text-base sm:text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-bold resize-none leading-relaxed"
                  />

                  {/* Actions under textarea */}
                  <div className="flex items-center justify-between gap-2 pt-1 flex-nowrap whitespace-nowrap">
                    <div className="flex items-center gap-1.5 shrink-0 flex-nowrap">
                      <button
                        type="button"
                        onClick={() => duplicateTextLayer(selectedLayer.id)}
                        className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 px-3 py-1.5 min-h-[34px] rounded-xl hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-150 cursor-pointer whitespace-nowrap shrink-0 font-semibold shadow-2xs"
                      >
                        <Copy className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span>Duplicate</span>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          updateTextLayer(
                            selectedLayer.id,
                            { isLocked: !selectedLayer.isLocked },
                            true
                          )
                        }
                        className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 min-h-[34px] rounded-xl border hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-150 cursor-pointer whitespace-nowrap shrink-0 font-semibold ${
                          selectedLayer.isLocked
                            ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                            : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                        }`}
                        title={selectedLayer.isLocked ? 'Unlock layer' : 'Lock layer position'}
                      >
                        {selectedLayer.isLocked ? (
                          <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        ) : (
                          <Unlock className="w-3.5 h-3.5 shrink-0" />
                        )}
                        <span>{selectedLayer.isLocked ? 'Locked' : 'Lock'}</span>
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => deleteTextLayer(selectedLayer.id)}
                      className="inline-flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 hover:border-rose-500/40 px-3 py-1.5 min-h-[34px] rounded-xl hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-150 cursor-pointer whitespace-nowrap shrink-0 font-semibold shadow-2xs"
                    >
                      <Trash2 className="w-3.5 h-3.5 shrink-0" />
                      <span>Delete</span>
                    </button>
                  </div>

                  {/* Mobile Quick Emojis Strip */}
                  <div className="pt-2 border-t border-white/5 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span className="flex items-center gap-1 font-semibold">
                        <Smile className="w-3 h-3 text-amber-400" />
                        <span>Quick Mobile Emojis</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setActiveTab('stickers')}
                        className="text-amber-400 hover:text-amber-300 text-[10px] font-semibold hover:underline cursor-pointer"
                      >
                        170+ Emoji Drawer &rarr;
                      </button>
                    </div>
                    <div className="flex items-center gap-1 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none no-scrollbar">
                      {[
                        '\u{1F602}',
                        '\u{1F480}',
                        '\u{1F525}',
                        '\u{1F5FF}',
                        '\u{1F62D}',
                        '\u{1F921}',
                        '\u{1F4AF}',
                        '\u{2764}\u{FE0F}',
                        '\u{1F440}',
                        '\u{1F37F}',
                        '\u{1F9E2}',
                        '\u{1F680}',
                        '\u{1F90C}',
                        '\u{1F436}',
                        '\u{1F44D}',
                        '\u{1F44E}',
                        '\u{1F44F}',
                        '\u{1F64F}',
                      ].map((em) => (
                        <button
                          key={em}
                          type="button"
                          onClick={() => {
                            if (selectedLayer) {
                              updateTextLayer(
                                selectedLayer.id,
                                { text: (selectedLayer.text ? selectedLayer.text + ' ' : '') + em },
                                true
                              );
                            }
                          }}
                          className="text-lg p-1.5 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 hover:scale-125 active:scale-90 transition-all cursor-pointer shrink-0 min-w-[34px] text-center"
                          title="Tap to insert into caption"
                        >
                          {em}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 3x3 Position Snapping Grid & Presets */}
                <div className="space-y-2 pt-2 border-t border-white/10">
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
                    <span>Quick Snapping Grid</span>
                    <span className="font-mono text-cyan-400 font-semibold normal-case">
                      {Math.round(selectedLayer.xPercent)}%, {Math.round(selectedLayer.yPercent)}%
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-1.5 bg-slate-900/60 p-2 rounded-xl border border-white/10">
                    {POSITION_MATRIX.map((pos) => {
                      const isNear =
                        Math.abs(selectedLayer.xPercent - pos.x) < 8 &&
                        Math.abs(selectedLayer.yPercent - pos.y) < 8;
                      return (
                        <button
                          key={pos.label}
                          type="button"
                          onClick={() => setPositionPreset(pos.x, pos.y)}
                          title={`Snap to ${pos.title}`}
                          className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all duration-150 active:scale-95 cursor-pointer whitespace-nowrap text-center ${
                            isNear
                              ? 'bg-[#1463E9] text-white shadow-xs shadow-blue-500/30'
                              : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10'
                          }`}
                        >
                          {pos.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Typography & Fonts */}
                <div className="space-y-3 pt-2 border-t border-white/10">
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
                    <Sliders className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Typography & Styling</span>
                  </div>

                  {/* Font Family */}
                  <div className="space-y-1.5">
                    <label htmlFor="editor-font-family" className="text-xs text-slate-300 font-medium">
                      Font Family
                    </label>
                    <select
                      id="editor-font-family"
                      value={selectedLayer.fontFamily}
                      onChange={(e) =>
                        updateTextLayer(selectedLayer.id, { fontFamily: e.target.value }, true)
                      }
                      className="w-full bg-slate-900 text-slate-100 rounded-xl border border-white/15 px-3 py-2 text-xs font-semibold focus:outline-none focus:border-blue-500 cursor-pointer"
                    >
                      {FONT_OPTIONS.map((font) => (
                        <option key={font.value} value={font.value} className="bg-slate-900 text-white">
                          {font.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Font Size */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <label htmlFor="editor-font-size-slider" className="text-slate-300 font-medium">
                        Font Size
                      </label>
                      <span className="font-mono text-cyan-400 font-semibold">
                        {selectedLayer.fontSize}px
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        id="editor-font-size-slider"
                        type="range"
                        min={14}
                        max={96}
                        value={selectedLayer.fontSize}
                        onPointerDown={handleSliderStart}
                        onPointerUp={handleSliderEnd}
                        onTouchStart={handleSliderStart}
                        onTouchEnd={handleSliderEnd}
                        onBlur={handleSliderEnd}
                        onChange={(e) =>
                          updateTextLayer(
                            selectedLayer.id,
                            { fontSize: Number(e.target.value) },
                            false
                          )
                        }
                        className="flex-1 accent-blue-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                      />
                      <input
                        type="number"
                        min={12}
                        max={120}
                        value={selectedLayer.fontSize}
                        onChange={(e) => {
                          const val = Math.max(12, Math.min(120, parseInt(e.target.value, 10) || 12));
                          updateTextLayer(selectedLayer.id, { fontSize: val }, true);
                        }}
                        className="w-16 bg-slate-900 text-slate-100 text-xs font-mono px-2 py-1.5 rounded-lg border border-white/15 text-center focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* Formatting Buttons & Alignment */}
                  <div className="flex items-center justify-between gap-2 pt-1 flex-nowrap">
                    {/* Bold / Italic / TT */}
                    <div className="flex items-center rounded-xl bg-slate-900 border border-white/15 p-1 gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() =>
                          updateTextLayer(
                            selectedLayer.id,
                            { isBold: !selectedLayer.isBold },
                            true
                          )
                        }
                        className={`p-2 min-w-[34px] min-h-[34px] flex items-center justify-center rounded-lg hover:-translate-y-0.5 active:scale-95 transition-all duration-150 cursor-pointer ${
                          selectedLayer.isBold
                            ? 'bg-[#1463E9] text-white shadow-xs'
                            : 'text-slate-400 hover:text-white hover:bg-white/10'
                        }`}
                        title="Bold"
                      >
                        <Bold className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          updateTextLayer(
                            selectedLayer.id,
                            { isItalic: !selectedLayer.isItalic },
                            true
                          )
                        }
                        className={`p-2 min-w-[34px] min-h-[34px] flex items-center justify-center rounded-lg hover:-translate-y-0.5 active:scale-95 transition-all duration-150 cursor-pointer ${
                          selectedLayer.isItalic
                            ? 'bg-[#1463E9] text-white shadow-xs'
                            : 'text-slate-400 hover:text-white hover:bg-white/10'
                        }`}
                        title="Italic"
                      >
                        <Italic className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          updateTextLayer(
                            selectedLayer.id,
                            { textCase: 'uppercase', isUppercase: true },
                            true
                          )
                        }
                        className={`px-2 py-1 min-w-[30px] min-h-[34px] flex items-center justify-center rounded-lg text-xs font-black hover:-translate-y-0.5 active:scale-95 transition-all duration-150 cursor-pointer ${
                          selectedLayer.textCase === 'uppercase' || (selectedLayer.isUppercase && !selectedLayer.textCase)
                            ? 'bg-[#1463E9] text-white shadow-xs'
                            : 'text-slate-400 hover:text-white hover:bg-white/10'
                        }`}
                        title="ALL CAPS"
                      >
                        TT
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          updateTextLayer(
                            selectedLayer.id,
                            { textCase: 'lowercase', isUppercase: false },
                            true
                          )
                        }
                        className={`px-2 py-1 min-w-[30px] min-h-[34px] flex items-center justify-center rounded-lg text-xs font-bold hover:-translate-y-0.5 active:scale-95 transition-all duration-150 cursor-pointer ${
                          selectedLayer.textCase === 'lowercase'
                            ? 'bg-[#1463E9] text-white shadow-xs'
                            : 'text-slate-400 hover:text-white hover:bg-white/10'
                        }`}
                        title="lowercase"
                      >
                        tt
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          updateTextLayer(
                            selectedLayer.id,
                            { textCase: 'title', isUppercase: false },
                            true
                          )
                        }
                        className={`px-2 py-1 min-w-[30px] min-h-[34px] flex items-center justify-center rounded-lg text-xs font-bold hover:-translate-y-0.5 active:scale-95 transition-all duration-150 cursor-pointer ${
                          selectedLayer.textCase === 'title'
                            ? 'bg-[#1463E9] text-white shadow-xs'
                            : 'text-slate-400 hover:text-white hover:bg-white/10'
                        }`}
                        title="Title Case"
                      >
                        Tt
                      </button>
                    </div>

                    {/* Alignment */}
                    <div className="flex items-center rounded-xl bg-slate-900 border border-white/15 p-1 gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() =>
                          updateTextLayer(selectedLayer.id, { alignment: 'left' }, true)
                        }
                        className={`p-2 min-w-[34px] min-h-[34px] flex items-center justify-center rounded-lg hover:-translate-y-0.5 active:scale-95 transition-all duration-150 cursor-pointer ${
                          selectedLayer.alignment === 'left'
                            ? 'bg-[#1463E9] text-white shadow-xs'
                            : 'text-slate-400 hover:text-white hover:bg-white/10'
                        }`}
                        title="Align Left"
                      >
                        <AlignLeft className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          updateTextLayer(selectedLayer.id, { alignment: 'center' }, true)
                        }
                        className={`p-2 min-w-[34px] min-h-[34px] flex items-center justify-center rounded-lg hover:-translate-y-0.5 active:scale-95 transition-all duration-150 cursor-pointer ${
                          selectedLayer.alignment === 'center'
                            ? 'bg-[#1463E9] text-white shadow-xs'
                            : 'text-slate-400 hover:text-white hover:bg-white/10'
                        }`}
                        title="Align Center"
                      >
                        <AlignCenter className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          updateTextLayer(selectedLayer.id, { alignment: 'right' }, true)
                        }
                        className={`p-2 min-w-[34px] min-h-[34px] flex items-center justify-center rounded-lg hover:-translate-y-0.5 active:scale-95 transition-all duration-150 cursor-pointer ${
                          selectedLayer.alignment === 'right'
                            ? 'bg-[#1463E9] text-white shadow-xs'
                            : 'text-slate-400 hover:text-white hover:bg-white/10'
                        }`}
                        title="Align Right"
                      >
                        <AlignRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Special Text Effects Suite (Glow & 3D Pop) */}
                  <div className="space-y-2 pt-2 border-t border-white/10">
                    <span className="text-xs text-slate-300 font-semibold block">Special Effects & Shadows</span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          updateTextLayer(
                            selectedLayer.id,
                            { isGlow: !selectedLayer.isGlow, is3d: false },
                            true
                          )
                        }
                        className={`px-3 py-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer ${
                          selectedLayer.isGlow
                            ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 ring-1 ring-cyan-400/40 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                            : 'bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        <Sun className="w-3.5 h-3.5" />
                        <span>Neon Glow</span>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          updateTextLayer(
                            selectedLayer.id,
                            { is3d: !selectedLayer.is3d, isGlow: false },
                            true
                          )
                        }
                        className={`px-3 py-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer ${
                          selectedLayer.is3d
                            ? 'bg-amber-500/20 border-amber-400 text-amber-300 ring-1 ring-amber-400/40'
                            : 'bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        <Bold className="w-3.5 h-3.5" />
                        <span>3D Comic Pop</span>
                      </button>
                    </div>

                    {/* Glow color selector if glow active */}
                    {selectedLayer.isGlow && (
                      <div className="space-y-1 pt-1.5">
                        <span className="text-[11px] text-slate-400">Glow Hue</span>
                        <div className="flex items-center gap-2">
                          {['#06B6D4', '#EC4899', '#10B981', '#FACC15', '#A855F7', '#FFFFFF'].map((g) => (
                            <button
                              key={g}
                              type="button"
                              onClick={() => updateTextLayer(selectedLayer.id, { glowColor: g }, true)}
                              className={`w-6 h-6 rounded-full border transition-all cursor-pointer ${
                                (selectedLayer.glowColor || '#06B6D4') === g
                                  ? 'border-white ring-2 ring-cyan-400 scale-110'
                                  : 'border-white/30 hover:scale-105'
                              }`}
                              style={{ backgroundColor: g }}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Letter Spacing & Line Height */}
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-300">Letter Spacing</span>
                        <span className="font-mono text-cyan-400 font-semibold">
                          {selectedLayer.letterSpacing ?? 0}px
                        </span>
                      </div>
                      <input
                        type="range"
                        min={-2}
                        max={10}
                        value={selectedLayer.letterSpacing ?? 0}
                        onChange={(e) =>
                          updateTextLayer(
                            selectedLayer.id,
                            { letterSpacing: Number(e.target.value) },
                            false
                          )
                        }
                        className="w-full accent-blue-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-300">Line Height</span>
                        <span className="font-mono text-cyan-400 font-semibold">
                          {(selectedLayer.lineHeight ?? 1.15).toFixed(2)}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={0.8}
                        max={1.8}
                        step={0.05}
                        value={selectedLayer.lineHeight ?? 1.15}
                        onChange={(e) =>
                          updateTextLayer(
                            selectedLayer.id,
                            { lineHeight: Number(e.target.value) },
                            false
                          )
                        }
                        className="w-full accent-blue-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* Colors, Stroke & Background Box */}
                <div className="space-y-3 pt-2 border-t border-white/10">
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
                    <Palette className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Colors & Outline</span>
                  </div>

                  {/* Text Fill Color */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300 font-medium">Text Color</span>
                      <span className="font-mono text-slate-400 uppercase">{selectedLayer.color}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {PRESET_COLORS.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => updateTextLayer(selectedLayer.id, { color: c }, true)}
                          className={`w-7 h-7 rounded-lg border transition-transform cursor-pointer hover:scale-110 shrink-0 ${
                            selectedLayer.color.toLowerCase() === c.toLowerCase()
                              ? 'border-cyan-400 ring-2 ring-cyan-400/50 scale-105'
                              : 'border-white/20'
                          }`}
                          style={{ backgroundColor: c }}
                          title={c}
                        />
                      ))}
                      <input
                        type="color"
                        value={selectedLayer.color}
                        onChange={(e) => updateTextLayer(selectedLayer.id, { color: e.target.value }, true)}
                        className="w-7 h-7 rounded-lg border border-white/20 bg-transparent cursor-pointer shrink-0"
                        title="Custom text color"
                      />
                    </div>
                  </div>

                  {/* Stroke Outline */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300 font-medium">Outline Stroke Color</span>
                      <span className="font-mono text-slate-400 uppercase">
                        {selectedLayer.strokeColor}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {PRESET_COLORS.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => updateTextLayer(selectedLayer.id, { strokeColor: c }, true)}
                          className={`w-7 h-7 rounded-lg border transition-transform cursor-pointer hover:scale-110 shrink-0 ${
                            selectedLayer.strokeColor.toLowerCase() === c.toLowerCase()
                              ? 'border-cyan-400 ring-2 ring-cyan-400/50 scale-105'
                              : 'border-white/20'
                          }`}
                          style={{ backgroundColor: c }}
                          title={c}
                        />
                      ))}
                      <input
                        type="color"
                        value={selectedLayer.strokeColor}
                        onChange={(e) =>
                          updateTextLayer(selectedLayer.id, { strokeColor: e.target.value }, true)
                        }
                        className="w-7 h-7 rounded-lg border border-white/20 bg-transparent cursor-pointer shrink-0"
                        title="Custom stroke color"
                      />
                    </div>
                  </div>

                  {/* Stroke Width */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <label htmlFor="editor-stroke-slider" className="text-slate-300 font-medium">
                        Stroke Thickness
                      </label>
                      <span className="font-mono text-cyan-400 font-semibold">
                        {selectedLayer.strokeWidth}px
                      </span>
                    </div>
                    <input
                      id="editor-stroke-slider"
                      type="range"
                      min={0}
                      max={10}
                      value={selectedLayer.strokeWidth}
                      onChange={(e) =>
                        updateTextLayer(
                          selectedLayer.id,
                          { strokeWidth: Number(e.target.value) },
                          false
                        )
                      }
                      className="w-full accent-blue-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Highlight Box Banner (Twitter/Reddit Meme Style) */}
                  <div className="space-y-2 pt-2 border-t border-white/10">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300 font-medium">Caption Highlight Box</span>
                      <span className="font-mono text-[10px] text-cyan-400">
                        {selectedLayer.backgroundColor && selectedLayer.backgroundColor !== 'transparent'
                          ? 'Active Banner'
                          : 'Transparent'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
                      {BG_BOX_PRESETS.map((preset) => {
                        const isSelected =
                          (selectedLayer.backgroundColor || 'transparent') === preset.value;
                        return (
                          <button
                            key={preset.label}
                            type="button"
                            onClick={() =>
                              updateTextLayer(
                                selectedLayer.id,
                                { backgroundColor: preset.value },
                                true
                              )
                            }
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150 active:scale-95 cursor-pointer shrink-0 ${
                              isSelected
                                ? 'bg-[#1463E9] text-white font-bold ring-2 ring-blue-400/50'
                                : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10'
                            }`}
                          >
                            {preset.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Rotation & Opacity */}
                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/10">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <label htmlFor="editor-rot-slider" className="text-slate-300 flex items-center gap-1">
                          <RotateCw className="w-3 h-3 text-slate-400" />
                          <span>Rotation</span>
                        </label>
                        <span className="font-mono text-cyan-400 font-semibold">
                          {selectedLayer.rotation}°
                        </span>
                      </div>
                      <input
                        id="editor-rot-slider"
                        type="range"
                        min={-180}
                        max={180}
                        value={selectedLayer.rotation}
                        onChange={(e) =>
                          updateTextLayer(
                            selectedLayer.id,
                            { rotation: Number(e.target.value) },
                            false
                          )
                        }
                        className="w-full accent-blue-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <label htmlFor="editor-opac-slider" className="text-slate-300">
                          Opacity
                        </label>
                        <span className="font-mono text-cyan-400 font-semibold">
                          {Math.round((selectedLayer.opacity ?? 1) * 100)}%
                        </span>
                      </div>
                      <input
                        id="editor-opac-slider"
                        type="range"
                        min={10}
                        max={100}
                        value={Math.round((selectedLayer.opacity ?? 1) * 100)}
                        onChange={(e) =>
                          updateTextLayer(
                            selectedLayer.id,
                            { opacity: Number(e.target.value) / 100 },
                            false
                          )
                        }
                        className="w-full accent-blue-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              /* No layer selected empty state */
              <div className="p-6 rounded-2xl bg-slate-900/40 border border-dashed border-white/10 text-center space-y-3">
                <Type className="w-8 h-8 text-blue-400 mx-auto" />
                <p className="text-xs text-slate-300 font-medium">
                  Click any caption layer on the canvas or create a new text box to customize typography and styling.
                </p>
                <button
                  type="button"
                  onClick={() => addTextLayer()}
                  className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl bg-[#1463E9] hover:bg-[#0E52C7] text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-600/30 hover:shadow-lg hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-150 cursor-pointer whitespace-nowrap"
                >
                  <Plus className="w-4 h-4 shrink-0 stroke-[2.5]" />
                  <span className="whitespace-nowrap font-bold">Add New Caption Layer</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: 1-CLICK VIRAL MEME STYLES (215+ PRESETS)           */}
        {/* ========================================================= */}
        {activeTab === 'styles' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            {/* Header & Subtitle */}
            <div className="flex items-start justify-between gap-2 pb-2 border-b border-white/10">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Palette className="w-4 h-4 text-amber-400" />
                  <span>Meme Typography Styles</span>
                  <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    215+ Styles
                  </span>
                </h3>
                <p className="text-[11px] text-slate-400 mt-1">
                  1-click iconic memes, neon glows, retro vibes, gaming & 3D text looks.
                </p>
              </div>

              {selectedLayer && (
                <div className="text-[10px] text-cyan-300 bg-cyan-950/60 border border-cyan-800/50 px-2 py-1 rounded-md shrink-0">
                  Target: <span className="font-bold truncate max-w-[90px] inline-block align-bottom">{selectedLayer.text || 'Layer'}</span>
                </div>
              )}
            </div>

            {/* Search Input Bar */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={styleSearch}
                onChange={(e) => {
                  setStyleSearch(e.target.value);
                  setStyleVisibleLimit(24);
                }}
                placeholder="Search 200+ styles (e.g. neon, gold, retro, 3d, red)..."
                className="w-full pl-8 pr-8 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
              />
              {styleSearch && (
                <button
                  type="button"
                  onClick={() => {
                    setStyleSearch('');
                    setStyleVisibleLimit(24);
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5 rounded cursor-pointer"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Category Filter Pills (Horizontal Scroll) */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
              {MEME_STYLE_CATEGORIES.map((cat) => {
                const isSelected = styleCategory === cat;
                const count = cat === 'All'
                  ? MEME_PRESETS.length
                  : MEME_PRESETS.filter((p) => p.category === cat).length;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setStyleCategory(cat);
                      setStyleVisibleLimit(24);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#1463E9] text-white shadow-xs'
                        : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/5'
                    }`}
                  >
                    <span>{cat}</span>
                    <span className={`ml-1 text-[9px] ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                      ({count})
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Result count indicator */}
            <div className="flex items-center justify-between text-[11px] text-slate-400 px-0.5">
              <span>Showing {Math.min(filteredStyles.length, styleVisibleLimit)} of {filteredStyles.length} styles</span>
              {styleCategory !== 'All' && (
                <span className="text-cyan-400 font-semibold">{styleCategory}</span>
              )}
            </div>

            {/* Empty State */}
            {filteredStyles.length === 0 && (
              <div className="p-8 text-center bg-slate-900/40 rounded-2xl border border-white/5">
                <Palette className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-300">No styles matched "{styleSearch}"</p>
                <p className="text-[11px] text-slate-500 mt-1">Try another keyword or select "All" categories</p>
                <button
                  type="button"
                  onClick={() => {
                    setStyleSearch('');
                    setStyleCategory('All');
                  }}
                  className="mt-3 text-xs text-cyan-400 hover:underline cursor-pointer"
                >
                  Reset filters
                </button>
              </div>
            )}

            {/* Preset Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {filteredStyles.slice(0, styleVisibleLimit).map((preset) => {
                const isJustApplied = recentlyAppliedStyleId === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleApplyPresetStyle(preset)}
                    className={`p-3 rounded-xl border bg-slate-900/60 hover:bg-slate-900 transition-all duration-150 cursor-pointer text-left hover:-translate-y-0.5 active:scale-98 group flex flex-col justify-between min-h-[105px] relative overflow-hidden ${
                      isJustApplied
                        ? 'border-emerald-400 ring-2 ring-emerald-400/40 bg-slate-900'
                        : 'border-white/10 hover:border-cyan-400/50'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                          {preset.name}
                        </span>
                        {isJustApplied ? (
                          <span className="text-[9px] font-black uppercase text-emerald-400 bg-emerald-500/20 px-1.5 py-0.5 rounded border border-emerald-400/30 shrink-0">
                            Applied
                          </span>
                        ) : (
                          <span className="text-[9px] font-semibold text-slate-500 uppercase px-1 rounded bg-white/5 shrink-0">
                            {preset.category.split(' ')[0]}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                        {preset.description}
                      </p>
                    </div>

                    <div className="mt-2.5 text-center py-2 px-2.5 rounded-lg bg-black/60 border border-white/5 overflow-hidden flex items-center justify-center min-h-[38px]">
                      <span
                        style={{
                          fontFamily: `${preset.style.fontFamily}, sans-serif`,
                          color: preset.style.color,
                          WebkitTextStroke:
                            preset.style.strokeWidth > 0
                              ? `${Math.min(2, preset.style.strokeWidth * 0.7)}px ${preset.style.strokeColor}`
                              : undefined,
                          fontWeight: preset.style.isBold ? 800 : 500,
                          fontStyle: preset.style.isItalic ? 'italic' : 'normal',
                          textTransform: preset.style.isUppercase ? 'uppercase' : 'none',
                          letterSpacing: preset.style.letterSpacing ? `${preset.style.letterSpacing * 0.6}px` : undefined,
                          textShadow: preset.style.isGlow
                            ? `0 0 10px ${preset.style.glowColor || preset.style.color}`
                            : preset.style.is3d
                            ? '1px 1px 0 #000, 2px 2px 0 #000'
                            : preset.style.shadowBlur
                            ? `0 2px ${preset.style.shadowBlur}px ${preset.style.shadowColor || 'rgba(0,0,0,0.8)'}`
                            : undefined,
                          backgroundColor:
                            preset.style.backgroundColor !== 'transparent'
                              ? preset.style.backgroundColor
                              : undefined,
                          fontSize: '11px',
                          padding: preset.style.backgroundColor !== 'transparent' ? '2px 6px' : '0',
                          borderRadius: '4px',
                        }}
                      >
                        SAMPLE TEXT
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Pagination / Load More Controls */}
            {filteredStyles.length > styleVisibleLimit && (
              <div className="pt-2 flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setStyleVisibleLimit((prev) => prev + 24)}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all cursor-pointer shadow-md active:scale-95 flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Load More (+24 Styles)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStyleVisibleLimit(filteredStyles.length)}
                  className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-semibold border border-white/10 transition-all cursor-pointer active:scale-95"
                >
                  Show All ({filteredStyles.length})
                </button>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: MEME FRAMES & LAYOUTS (225+ PRESETS)              */}
        {/* ========================================================= */}
        {activeTab === 'frames' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            {/* Header info & Reset Frame button */}
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <LayoutTemplate className="w-4 h-4 text-purple-400" />
                  <span>Meme Frames & Layouts</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30 font-mono font-bold">
                    {MEME_FRAMES.length}+ Frames
                  </span>
                </h3>
                <p className="text-[11px] text-slate-400 mt-1">
                  1-tap apply viral frames, TV broadcast overlays, retro monitors & creator layouts.
                </p>
              </div>

              <button
                type="button"
                onClick={handleResetFrame}
                className="text-[11px] text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 px-2.5 py-1.5 rounded-lg border border-white/10 transition-colors flex items-center gap-1 shrink-0 cursor-pointer active:scale-95"
                title="Reset frame and borders to full bleed"
              >
                <RotateCw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* Active Frame Live Customizer Bar */}
            {((canvasSettings.frameTitle && canvasSettings.frameTitle.length > 0) ||
              canvasSettings.frameStyle === 'breaking-news' ||
              (canvasSettings.headerBannerText && canvasSettings.headerBannerText.length > 0) ||
              (canvasSettings.overlayBadge && canvasSettings.overlayBadge.length > 0)) && (
              <div className="p-3 bg-purple-950/20 rounded-xl border border-purple-500/30 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-purple-400" />
                    <span>Active Frame Customizer</span>
                  </span>
                  <span className="text-[10px] text-purple-400 font-mono">
                    {canvasSettings.frameStyle || 'Custom'}
                  </span>
                </div>

                {/* Bottom Ticker / Frame Title Input */}
                {(canvasSettings.frameStyle === 'breaking-news' ||
                  (canvasSettings.frameTitle !== undefined && canvasSettings.frameTitle !== '')) && (
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-slate-300 block">
                      Ticker / Caption Text
                    </label>
                    <input
                      type="text"
                      value={canvasSettings.frameTitle || ''}
                      onChange={(e) => updateCanvasSettings({ frameTitle: e.target.value })}
                      placeholder="e.g. BREAKING: DEVELOPING STORY HERE"
                      className="w-full bg-slate-900 text-white rounded-lg border border-purple-400/30 px-3 py-1.5 text-xs font-bold focus:outline-none focus:border-purple-400"
                    />
                  </div>
                )}

                {/* Header Banner Text Input */}
                {canvasSettings.headerBannerText !== undefined && canvasSettings.headerBannerText !== '' && (
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-slate-300 block">
                      Header Banner Text
                    </label>
                    <input
                      type="text"
                      value={canvasSettings.headerBannerText || ''}
                      onChange={(e) => updateCanvasSettings({ headerBannerText: e.target.value })}
                      placeholder="e.g. BREAKING NEWS BULLETIN"
                      className="w-full bg-slate-900 text-white rounded-lg border border-purple-400/30 px-3 py-1.5 text-xs font-bold focus:outline-none focus:border-purple-400"
                    />
                  </div>
                )}

                {/* Overlay Badge Input */}
                {canvasSettings.overlayBadge !== undefined && canvasSettings.overlayBadge !== '' && (
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-slate-300 block">
                      Corner Overlay Badge
                    </label>
                    <input
                      type="text"
                      value={canvasSettings.overlayBadge || ''}
                      onChange={(e) => updateCanvasSettings({ overlayBadge: e.target.value })}
                      placeholder="e.g. LIVE, REC, 4K"
                      className="w-full bg-slate-900 text-white rounded-lg border border-purple-400/30 px-3 py-1.5 text-xs font-bold focus:outline-none focus:border-purple-400"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Instant Search Bar */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={frameSearch}
                onChange={(e) => {
                  setFrameSearch(e.target.value);
                  setFrameVisibleLimit(24);
                }}
                placeholder="Search 225+ frames (e.g. Breaking News, Polaroid, Cyberpunk, Twitch)..."
                className="w-full bg-slate-900/80 text-white text-xs pl-8 pr-8 py-2 rounded-xl border border-white/10 placeholder:text-slate-500 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all"
              />
              {frameSearch && (
                <button
                  type="button"
                  onClick={() => setFrameSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5 rounded cursor-pointer"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none no-scrollbar">
              {MEME_FRAME_CATEGORIES.map((cat) => {
                const count =
                  cat === 'All'
                    ? MEME_FRAMES.length
                    : MEME_FRAMES.filter((f) => f.category === cat).length;
                const isSelected = frameCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setFrameCategory(cat);
                      setFrameVisibleLimit(24);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer active:scale-95 flex items-center gap-1 ${
                      isSelected
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <span>{cat}</span>
                    <span
                      className={`text-[10px] px-1 py-0.2 rounded-full ${
                        isSelected ? 'bg-black/30 text-white' : 'bg-white/10 text-slate-400'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Result count & info */}
            <div className="text-[11px] text-slate-400 flex items-center justify-between px-0.5">
              <span>
                Showing {Math.min(frameVisibleLimit, filteredFrames.length)} of {filteredFrames.length} frames
              </span>
              {frameCategory !== 'All' && (
                <span className="text-purple-400 font-semibold">{frameCategory}</span>
              )}
            </div>

            {/* Empty State */}
            {filteredFrames.length === 0 && (
              <div className="p-8 text-center bg-slate-900/40 rounded-2xl border border-white/5">
                <LayoutTemplate className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-300">No frames matched "{frameSearch}"</p>
                <p className="text-[11px] text-slate-500 mt-1">Try another keyword or select "All" categories</p>
                <button
                  type="button"
                  onClick={() => {
                    setFrameSearch('');
                    setFrameCategory('All');
                  }}
                  className="mt-3 text-xs text-purple-400 hover:underline cursor-pointer"
                >
                  Reset filters
                </button>
              </div>
            )}

            {/* Frame Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {filteredFrames.slice(0, frameVisibleLimit).map((frame) => {
                const isJustApplied = recentlyAppliedFrameId === frame.id;
                const isCurrentActive =
                  canvasSettings.frameStyle === frame.frameStyle &&
                  canvasSettings.backgroundColor === frame.backgroundColor &&
                  (frame.padding === undefined || canvasSettings.padding === frame.padding);

                return (
                  <button
                    key={frame.id}
                    type="button"
                    onClick={() => handleApplyFrame(frame)}
                    className={`p-3 rounded-xl border bg-slate-900/60 hover:bg-slate-900 transition-all duration-150 cursor-pointer text-left hover:-translate-y-0.5 active:scale-98 group flex flex-col justify-between min-h-[125px] relative overflow-hidden ${
                      isJustApplied
                        ? 'border-emerald-400 ring-2 ring-emerald-400/40 bg-slate-900'
                        : isCurrentActive
                        ? 'border-purple-500 ring-1 ring-purple-500/40 bg-slate-900'
                        : 'border-white/10 hover:border-purple-400/50'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <span className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-1">
                          {frame.name}
                        </span>
                        {isJustApplied ? (
                          <span className="text-[9px] font-black uppercase text-emerald-400 bg-emerald-500/20 px-1.5 py-0.5 rounded border border-emerald-400/30 shrink-0">
                            Applied
                          </span>
                        ) : isCurrentActive ? (
                          <span className="text-[9px] font-black uppercase text-purple-400 bg-purple-500/20 px-1.5 py-0.5 rounded border border-purple-400/30 shrink-0">
                            Active
                          </span>
                        ) : (
                          <span className="text-[9px] font-semibold text-slate-500 uppercase px-1 rounded bg-white/5 shrink-0">
                            {frame.category.split(' ')[0]}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                        {frame.description}
                      </p>
                    </div>

                    {/* Frame Visual Preview Card */}
                    <div
                      className="mt-2.5 h-16 w-full rounded-lg overflow-hidden relative flex flex-col justify-between"
                      style={{
                        backgroundColor: frame.backgroundColor || '#0f172a',
                        padding: frame.padding ? `${Math.min(5, Math.max(2, Math.round(frame.padding / 4)))}px` : '2px',
                        borderWidth: frame.borderWidth ? `${Math.min(3, Math.max(1, Math.round(frame.borderWidth / 3)))}px` : undefined,
                        borderColor: frame.borderColor,
                        borderRadius: frame.borderRadius ? `${Math.min(8, Math.round(frame.borderRadius / 2))}px` : '4px',
                        borderStyle: frame.borderStyleType,
                      }}
                    >
                      {/* Top Header Banner or Badge */}
                      {frame.headerBannerText ? (
                        <div
                          className="w-full px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wider flex items-center justify-between"
                          style={{
                            backgroundColor: frame.headerBannerBg || '#000000',
                            color: frame.headerBannerColor || '#FFFFFF',
                          }}
                        >
                          <span className="truncate">{frame.headerBannerText}</span>
                          {frame.overlayBadge && (
                            <span
                              className="px-1 py-0.2 rounded text-[7px] font-black shrink-0 ml-1"
                              style={{
                                backgroundColor: frame.overlayBadgeBg || '#DC2626',
                                color: frame.overlayBadgeColor || '#FFFFFF',
                              }}
                            >
                              {frame.overlayBadge}
                            </span>
                          )}
                        </div>
                      ) : frame.overlayBadge ? (
                        <div className="p-0.5">
                          <span
                            className="px-1 py-0.2 rounded text-[7px] font-black uppercase tracking-wider inline-block"
                            style={{
                              backgroundColor: frame.overlayBadgeBg || '#DC2626',
                              color: frame.overlayBadgeColor || '#FFFFFF',
                            }}
                          >
                            {frame.overlayBadge}
                          </span>
                        </div>
                      ) : (
                        <div />
                      )}

                      {/* Content Placeholder */}
                      <div className="flex-1 flex items-center justify-center">
                        <span className="text-[8px] font-bold tracking-widest text-white/40 uppercase">
                          {frame.aspectRatio || 'FRAME'}
                        </span>
                      </div>

                      {/* Bottom Chyron / Frame Title */}
                      {frame.frameStyle === 'breaking-news' ? (
                        <div className="w-full">
                          <div className="bg-amber-400 text-black px-1 py-0.2 text-[6px] font-black tracking-wider uppercase truncate">
                            {frame.overlayBadge || 'LIVE NEWS'}
                          </div>
                          <div className="bg-red-600 text-white px-1 py-0.5 text-[7px] font-black uppercase truncate">
                            {frame.frameTitle || 'DEVELOPING NEWS'}
                          </div>
                        </div>
                      ) : frame.frameTitle ? (
                        <div className="w-full bg-black/80 text-white px-1 py-0.5 text-[7px] font-bold uppercase truncate">
                          {frame.frameTitle}
                        </div>
                      ) : null}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Pagination / Load More Controls */}
            {filteredFrames.length > frameVisibleLimit && (
              <div className="pt-2 flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setFrameVisibleLimit((prev) => prev + 24)}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all cursor-pointer shadow-md active:scale-95 flex items-center gap-1.5"
                >
                  <LayoutTemplate className="w-3.5 h-3.5" />
                  <span>Load More (+24 Frames)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFrameVisibleLimit(filteredFrames.length)}
                  className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-semibold border border-white/10 transition-all cursor-pointer active:scale-95"
                >
                  Show All ({filteredFrames.length})
                </button>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: CANVAS FREEHAND DRAW & DOODLE                     */}
        {/* ========================================================= */}
        {activeTab === 'draw' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <PenTool className="w-4 h-4 text-rose-400" />
                <span>Canvas Freehand Drawing & Pen</span>
              </h3>
              <p className="text-[11px] text-slate-400 mt-1">
                Draw funny mustaches, circle meme clues, or highlight funny moments right on the canvas.
              </p>
            </div>

            {/* Drawing Mode Toggle Switch */}
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-white/10 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white block">Draw Tool</span>
                <span className="text-[11px] text-slate-400">
                  {isDrawingMode ? 'Drawing mode is active (click and drag on canvas)' : 'Tap to start sketching'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsDrawingMode(!isDrawingMode)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer active:scale-95 ${
                  isDrawingMode
                    ? 'bg-amber-500 text-slate-950 shadow-md ring-2 ring-amber-400/50'
                    : 'bg-[#1463E9] text-white hover:bg-[#0E52C7]'
                }`}
              >
                {isDrawingMode ? 'Exit Drawing' : 'Start Drawing'}
              </button>
            </div>

            {/* Tool Mode: Pen vs Highlighter */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setIsDrawingHighlighter(false)}
                className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  !isDrawingHighlighter
                    ? 'bg-[#1463E9] text-white border-blue-400 shadow-xs'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:text-white'
                }`}
              >
                <PenTool className="w-3.5 h-3.5" />
                <span>Solid Pen</span>
              </button>

              <button
                type="button"
                onClick={() => setIsDrawingHighlighter(true)}
                className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  isDrawingHighlighter
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-xs'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:text-white'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                <span>Neon Marker</span>
              </button>
            </div>

            {/* Brush Size Slider */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium">Brush Size</span>
                <span className="font-mono text-cyan-400 font-semibold">{drawingBrushSize}px</span>
              </div>
              <input
                type="range"
                min={2}
                max={24}
                value={drawingBrushSize}
                onChange={(e) => setDrawingBrushSize(Number(e.target.value))}
                className="w-full accent-rose-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Color Swatches */}
            <div className="space-y-1.5">
              <span className="text-xs text-slate-300 font-medium block">Drawing Color</span>
              <div className="flex items-center gap-2 flex-wrap">
                {['#EF4444', '#FACC15', '#06B6D4', '#22C55E', '#A855F7', '#FFFFFF', '#000000'].map((col) => (
                  <button
                    key={col}
                    type="button"
                    onClick={() => setDrawingColor(col)}
                    className={`w-7 h-7 rounded-full border transition-all cursor-pointer hover:scale-110 ${
                      drawingColor === col ? 'border-white ring-2 ring-cyan-400 scale-110' : 'border-white/30'
                    }`}
                    style={{ backgroundColor: col }}
                    title={col}
                  />
                ))}
                <input
                  type="color"
                  value={drawingColor}
                  onChange={(e) => setDrawingColor(e.target.value)}
                  className="w-7 h-7 rounded-full border border-white/30 bg-transparent cursor-pointer"
                  title="Custom color"
                />
              </div>
            </div>

            {/* Actions: Undo / Clear */}
            <div className="flex items-center gap-2 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={undoLastDoodle}
                disabled={!canvasSettings.doodles || canvasSettings.doodles.length === 0}
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-all disabled:opacity-40 disabled:pointer-events-none cursor-pointer active:scale-95"
              >
                <Undo2 className="w-3.5 h-3.5" />
                <span>Undo Stroke</span>
              </button>

              <button
                type="button"
                onClick={clearDoodles}
                disabled={!canvasSettings.doodles || canvasSettings.doodles.length === 0}
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-rose-500/20 bg-rose-500/10 hover:bg-rose-500/20 text-xs font-semibold text-rose-300 transition-all disabled:opacity-40 disabled:pointer-events-none cursor-pointer active:scale-95"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All ({canvasSettings.doodles?.length || 0})</span>
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: MOBILE EMOJIS & REACTION STICKERS                  */}
        {/* ========================================================= */}
        {activeTab === 'stickers' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            {/* Header with Title and Mode Indicator */}
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Smile className="w-4 h-4 text-amber-400" />
                  <span>Mobile Emojis & Stickers</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 font-mono font-bold">
                    170+ Emojis
                  </span>
                </h3>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Tap any emoji to drop as a resizable sticker on your meme or insert into captions.
              </p>
            </div>

            {/* Mobile Keyboard Mode & Size Switcher */}
            <div className="p-2.5 bg-slate-900/80 rounded-xl border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-semibold text-[11px]">Placement Mode:</span>
                <div className="flex items-center gap-1 bg-black/40 p-0.5 rounded-lg border border-white/10">
                  <button
                    type="button"
                    onClick={() => setEmojiTargetMode('sticker')}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                      emojiTargetMode === 'sticker'
                        ? 'bg-amber-500 text-black shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Canvas Sticker
                  </button>
                  <button
                    type="button"
                    onClick={() => setEmojiTargetMode('caption')}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                      emojiTargetMode === 'caption'
                        ? 'bg-amber-500 text-black shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Insert in Caption
                  </button>
                </div>
              </div>

              {/* Sticker Size options (when in sticker mode) */}
              {emojiTargetMode === 'sticker' && (
                <div className="flex items-center justify-between text-xs pt-1 border-t border-white/5">
                  <span className="text-slate-400 font-semibold text-[11px]">Sticker Size:</span>
                  <div className="flex items-center gap-1">
                    {[
                      { id: 'small', label: 'S (36px)' },
                      { id: 'medium', label: 'M (54px)' },
                      { id: 'large', label: 'L (78px)' },
                      { id: 'giant', label: 'XL (108px)' },
                    ].map((sz) => (
                      <button
                        key={sz.id}
                        type="button"
                        onClick={() => setEmojiSizeMode(sz.id as any)}
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                          emojiSizeMode === sz.id
                            ? 'bg-white/20 text-white border border-white/30'
                            : 'bg-white/5 text-slate-400 hover:text-white'
                        }`}
                      >
                        {sz.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Live Search Bar */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={emojiSearch}
                onChange={(e) => setEmojiSearch(e.target.value)}
                placeholder="Search mobile emojis (e.g. skull, fire, laugh, dog, money)..."
                className="w-full bg-slate-900/80 text-white text-xs pl-8 pr-8 py-2 rounded-xl border border-white/10 placeholder:text-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
              />
              {emojiSearch && (
                <button
                  type="button"
                  onClick={() => setEmojiSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5 rounded cursor-pointer"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Mobile Category Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none no-scrollbar">
              {MOBILE_EMOJI_CATEGORIES.map((cat) => {
                const count =
                  cat === 'All'
                    ? MOBILE_EMOJIS.length
                    : MOBILE_EMOJIS.filter((e) => e.category === cat).length;
                const isSelected = emojiCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setEmojiCategory(cat)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer active:scale-95 flex items-center gap-1 ${
                      isSelected
                        ? 'bg-amber-500 text-black font-bold shadow-xs'
                        : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <span>{cat}</span>
                    <span
                      className={`text-[10px] px-1 py-0.2 rounded-full ${
                        isSelected ? 'bg-black/30 text-black' : 'bg-white/10 text-slate-400'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Mobile Emojis Grid Drawer */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-400 px-0.5">
                <span>
                  Showing {filteredEmojis.length} emojis
                </span>
                {recentlyAddedEmoji && (
                  <span className="text-emerald-400 font-bold animate-pulse">
                    Added {recentlyAddedEmoji} to {emojiTargetMode === 'caption' ? 'caption' : 'canvas'}!
                  </span>
                )}
              </div>

              {filteredEmojis.length === 0 ? (
                <div className="p-8 text-center bg-slate-900/40 rounded-2xl border border-white/5">
                  <Smile className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-slate-300">No emojis matched "{emojiSearch}"</p>
                  <p className="text-[11px] text-slate-500 mt-1">Try another keyword or select "All"</p>
                  <button
                    type="button"
                    onClick={() => {
                      setEmojiSearch('');
                      setEmojiCategory('All');
                    }}
                    className="mt-3 text-xs text-amber-400 hover:underline cursor-pointer"
                  >
                    Reset filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-6 sm:grid-cols-8 gap-1.5 bg-slate-950/70 p-2.5 rounded-2xl border border-white/10 max-h-[380px] overflow-y-auto no-scrollbar touch-scroll">
                  {filteredEmojis.map((item) => (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => handleAddEmoji(item.emoji)}
                      className="h-11 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-white/5 hover:border-amber-400/50 hover:scale-120 active:scale-90 transition-all duration-150 cursor-pointer flex items-center justify-center text-2xl select-none relative group"
                      title={`${item.name} (Tap to add)`}
                    >
                      <span>{item.emoji}</span>
                      <span className="pointer-events-none absolute -bottom-6 left-1/2 -translate-x-1/2 bg-slate-950 text-white text-[9px] px-1.5 py-0.5 rounded shadow-lg border border-white/10 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-30">
                        {item.name}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Reaction Text Stamps & Punchline Tags */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Meme Punchline Stamps</span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {MEME_STICKERS.map((sticker) => (
                  <button
                    key={sticker.text}
                    type="button"
                    onClick={() => handleAddSticker(sticker)}
                    className="p-2.5 rounded-xl border border-white/10 hover:border-white/30 transition-all duration-150 cursor-pointer flex items-center justify-center hover:-translate-y-0.5 active:scale-95 group shadow-sm text-center"
                    style={{
                      backgroundColor: sticker.bg,
                      borderColor: sticker.stroke,
                    }}
                  >
                    <span
                      className="text-xs font-black tracking-wider whitespace-nowrap truncate"
                      style={{ color: sticker.color }}
                    >
                      {sticker.text}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Visual Icon Stamps */}
            <div className="space-y-2 pt-1 border-t border-white/5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Creator Reaction Badges</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() =>
                    addTextLayer({
                      text: 'DEAL WITH IT',
                      fontSize: 32,
                      fontFamily: 'Impact',
                      color: '#FFFFFF',
                      strokeColor: '#000000',
                      strokeWidth: 3,
                      backgroundColor: 'rgba(0,0,0,0.85)',
                      yPercent: 40,
                    })
                  }
                  className="p-2 rounded-xl border border-white/10 bg-slate-900/60 hover:bg-slate-900 flex flex-col items-center gap-1 text-center cursor-pointer transition-all hover:-translate-y-0.5 active:scale-95"
                >
                  <Glasses className="w-5 h-5 text-slate-200" />
                  <span className="text-[10px] font-bold text-white">Deal With It</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    addTextLayer({
                      text: 'LASER EYES',
                      fontSize: 30,
                      fontFamily: 'Arial Black',
                      color: '#EF4444',
                      strokeColor: '#7F1D1D',
                      strokeWidth: 2,
                      isGlow: true,
                      glowColor: '#EF4444',
                      yPercent: 35,
                    })
                  }
                  className="p-2 rounded-xl border border-white/10 bg-slate-900/60 hover:bg-slate-900 flex flex-col items-center gap-1 text-center cursor-pointer transition-all hover:-translate-y-0.5 active:scale-95"
                >
                  <Flame className="w-5 h-5 text-red-500" />
                  <span className="text-[10px] font-bold text-white">Laser Eyes</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    addTextLayer({
                      text: 'CENSORED',
                      fontSize: 32,
                      fontFamily: 'Impact',
                      color: '#FFFFFF',
                      strokeColor: '#000000',
                      strokeWidth: 0,
                      backgroundColor: '#000000',
                      yPercent: 50,
                    })
                  }
                  className="p-2 rounded-xl border border-white/10 bg-slate-900/60 hover:bg-slate-900 flex flex-col items-center gap-1 text-center cursor-pointer transition-all hover:-translate-y-0.5 active:scale-95"
                >
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                  <span className="text-[10px] font-bold text-white">Censored</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    addTextLayer({
                      text: 'VERIFIED CREATOR',
                      fontSize: 24,
                      fontFamily: 'Plus Jakarta Sans',
                      color: '#FFFFFF',
                      strokeColor: '#0E52C7',
                      strokeWidth: 1,
                      backgroundColor: '#1463E9',
                      yPercent: 15,
                    })
                  }
                  className="p-2 rounded-xl border border-white/10 bg-slate-900/60 hover:bg-slate-900 flex flex-col items-center gap-1 text-center cursor-pointer transition-all hover:-translate-y-0.5 active:scale-95"
                >
                  <CheckCircle2 className="w-5 h-5 text-cyan-400" />
                  <span className="text-[10px] font-bold text-white">Verified</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 6: SNAPSEED TUNE IMAGE & FINE ADJUSTMENTS             */}
        {/* ========================================================= */}
        {activeTab === 'filters' && (
          <div className="space-y-5 animate-in fade-in duration-150">
            {/* Header with Title and Hold to Compare / Reset buttons */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-xs">
                  <SlidersHorizontal className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black tracking-wider uppercase text-white">Snapseed Tune</span>
                    <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">Pro</span>
                  </div>
                  <p className="text-[10px] text-slate-400">Precision image adjustments & viral looks</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {/* Hold to Compare Button */}
                <button
                  type="button"
                  title="Hold or press space to preview original unedited photo"
                  onPointerDown={(e) => {
                    e.preventDefault();
                    setIsComparing(true);
                  }}
                  onPointerUp={() => setIsComparing(false)}
                  onPointerLeave={() => setIsComparing(false)}
                  onKeyDown={(e) => {
                    if (e.key === ' ' || e.key === 'Enter') setIsComparing(true);
                  }}
                  onKeyUp={() => setIsComparing(false)}
                  className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1.5 rounded-lg border transition-all duration-150 cursor-pointer select-none active:scale-95 ${
                    isComparing
                      ? 'bg-amber-500/30 text-amber-300 border-amber-400 ring-2 ring-amber-400/50'
                      : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border-white/10'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isComparing ? 'Original' : 'Compare'}</span>
                </button>

                {/* Reset Filters Button */}
                <button
                  type="button"
                  onClick={resetCanvasFilters}
                  title="Reset all adjustments to zero"
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 px-2.5 py-1.5 rounded-lg border border-white/10 transition-all duration-150 cursor-pointer active:scale-95"
                >
                  <RefreshCw className="w-3 h-3 text-cyan-400" />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            {/* 1-Tap Snapseed Looks / Presets */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-300 font-bold uppercase tracking-wider flex items-center gap-1">
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span>Snapseed Looks</span>
                </span>
                <span className="text-[10px] text-slate-400">1-Tap Instant Mood</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'normal', label: 'Original', desc: 'Neutral zero' },
                  { id: 'autotune', label: 'Auto Tune', desc: 'Smart Balance' },
                  { id: 'hdr', label: 'HDR Scape', desc: 'Dynamic Punch' },
                  { id: 'drama', label: 'Drama', desc: 'Cinematic Mood' },
                  { id: 'glamour', label: 'Glamour Glow', desc: 'Dreamy Soft' },
                  { id: 'vintage', label: 'Vintage', desc: 'Warm Nostalgia' },
                  { id: 'noir', label: 'Noir (B&W)', desc: 'High Contrast' },
                  { id: 'retrolux', label: 'Retrolux', desc: 'Grain & Light' },
                  { id: 'deepfry', label: 'Deep Fried', desc: 'Nuked Meme' },
                  { id: 'cyberpunk', label: 'Cyberpunk', desc: 'Neon Blue' },
                  { id: 'vhs', label: 'VHS 90s', desc: 'Analog Tape' },
                  { id: 'cursed', label: 'Cursed', desc: 'Color Invert' },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => applyFilterPreset(f.id as any)}
                    className="p-2 rounded-xl border border-white/10 bg-slate-900/60 hover:bg-slate-900 hover:border-cyan-400/50 text-center transition-all cursor-pointer active:scale-95 group"
                  >
                    <span className="text-xs font-bold text-white block group-hover:text-cyan-300 transition-colors">{f.label}</span>
                    <span className="text-[9px] text-slate-400 block truncate">{f.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Snapseed Precision Sliders Suite */}
            <div className="space-y-3.5 pt-3 border-t border-white/10">
              <span className="text-xs text-slate-300 font-bold uppercase tracking-wider flex items-center gap-1">
                <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                <span>Fine-Tune Image</span>
              </span>

              {/* 1. Brightness (-100 to +100, neutral 0 = 100%) */}
              {(() => {
                const bVal = (canvasSettings.brightness ?? 100) - 100;
                return (
                  <div className="space-y-1.5 bg-slate-900/40 p-2.5 rounded-xl border border-white/5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                        <Sun className="w-3.5 h-3.5 text-amber-400" />
                        <span>Brightness</span>
                      </span>
                      <div className="flex items-center gap-1.5">
                        {bVal !== 0 && (
                          <button
                            type="button"
                            onClick={() => updateCanvasSettings({ brightness: 100 })}
                            className="text-[10px] text-slate-400 hover:text-white px-1.5 py-0.5 rounded bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer"
                            title="Reset Brightness to 0"
                          >
                            0
                          </button>
                        )}
                        <span className="font-mono text-cyan-400 font-bold text-xs min-w-[38px] text-right">
                          {bVal > 0 ? `+${bVal}` : bVal}
                        </span>
                      </div>
                    </div>
                    <input
                      type="range"
                      min={-100}
                      max={100}
                      value={bVal}
                      onChange={(e) => updateCanvasSettings({ brightness: 100 + Number(e.target.value) })}
                      className="w-full accent-blue-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                    />
                  </div>
                );
              })()}

              {/* 2. Contrast (-100 to +100, neutral 0 = 100%) */}
              {(() => {
                const cVal = (canvasSettings.contrast ?? 100) - 100;
                return (
                  <div className="space-y-1.5 bg-slate-900/40 p-2.5 rounded-xl border border-white/5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                        <Contrast className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Contrast</span>
                      </span>
                      <div className="flex items-center gap-1.5">
                        {cVal !== 0 && (
                          <button
                            type="button"
                            onClick={() => updateCanvasSettings({ contrast: 100 })}
                            className="text-[10px] text-slate-400 hover:text-white px-1.5 py-0.5 rounded bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer"
                            title="Reset Contrast to 0"
                          >
                            0
                          </button>
                        )}
                        <span className="font-mono text-cyan-400 font-bold text-xs min-w-[38px] text-right">
                          {cVal > 0 ? `+${cVal}` : cVal}
                        </span>
                      </div>
                    </div>
                    <input
                      type="range"
                      min={-100}
                      max={100}
                      value={cVal}
                      onChange={(e) => updateCanvasSettings({ contrast: 100 + Number(e.target.value) })}
                      className="w-full accent-blue-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                    />
                  </div>
                );
              })()}

              {/* 3. Saturation (-100 to +100, neutral 0 = 100%) */}
              {(() => {
                const sVal = (canvasSettings.saturation ?? 100) - 100;
                return (
                  <div className="space-y-1.5 bg-slate-900/40 p-2.5 rounded-xl border border-white/5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                        <Palette className="w-3.5 h-3.5 text-pink-400" />
                        <span>Saturation</span>
                      </span>
                      <div className="flex items-center gap-1.5">
                        {sVal !== 0 && (
                          <button
                            type="button"
                            onClick={() => updateCanvasSettings({ saturation: 100 })}
                            className="text-[10px] text-slate-400 hover:text-white px-1.5 py-0.5 rounded bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer"
                            title="Reset Saturation to 0"
                          >
                            0
                          </button>
                        )}
                        <span className="font-mono text-cyan-400 font-bold text-xs min-w-[38px] text-right">
                          {sVal > 0 ? `+${sVal}` : sVal}
                        </span>
                      </div>
                    </div>
                    <input
                      type="range"
                      min={-100}
                      max={100}
                      value={sVal}
                      onChange={(e) => updateCanvasSettings({ saturation: 100 + Number(e.target.value) })}
                      className="w-full accent-blue-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                    />
                  </div>
                );
              })()}

              {/* 4. Ambiance / Highlights (-100 to +100) */}
              {(() => {
                const hVal = canvasSettings.highlights ?? 0;
                return (
                  <div className="space-y-1.5 bg-slate-900/40 p-2.5 rounded-xl border border-white/5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                        <Sun className="w-3.5 h-3.5 text-yellow-300" />
                        <span>Ambiance & Highlights</span>
                      </span>
                      <div className="flex items-center gap-1.5">
                        {hVal !== 0 && (
                          <button
                            type="button"
                            onClick={() => updateCanvasSettings({ highlights: 0 })}
                            className="text-[10px] text-slate-400 hover:text-white px-1.5 py-0.5 rounded bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer"
                            title="Reset Highlights to 0"
                          >
                            0
                          </button>
                        )}
                        <span className="font-mono text-cyan-400 font-bold text-xs min-w-[38px] text-right">
                          {hVal > 0 ? `+${hVal}` : hVal}
                        </span>
                      </div>
                    </div>
                    <input
                      type="range"
                      min={-100}
                      max={100}
                      value={hVal}
                      onChange={(e) => updateCanvasSettings({ highlights: Number(e.target.value) })}
                      className="w-full accent-blue-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                    />
                  </div>
                );
              })()}

              {/* 5. Shadows (-100 to +100) */}
              {(() => {
                const shVal = canvasSettings.shadows ?? 0;
                return (
                  <div className="space-y-1.5 bg-slate-900/40 p-2.5 rounded-xl border border-white/5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                        <Shield className="w-3.5 h-3.5 text-slate-400" />
                        <span>Shadows (Lift / Crush)</span>
                      </span>
                      <div className="flex items-center gap-1.5">
                        {shVal !== 0 && (
                          <button
                            type="button"
                            onClick={() => updateCanvasSettings({ shadows: 0 })}
                            className="text-[10px] text-slate-400 hover:text-white px-1.5 py-0.5 rounded bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer"
                            title="Reset Shadows to 0"
                          >
                            0
                          </button>
                        )}
                        <span className="font-mono text-cyan-400 font-bold text-xs min-w-[38px] text-right">
                          {shVal > 0 ? `+${shVal}` : shVal}
                        </span>
                      </div>
                    </div>
                    <input
                      type="range"
                      min={-100}
                      max={100}
                      value={shVal}
                      onChange={(e) => updateCanvasSettings({ shadows: Number(e.target.value) })}
                      className="w-full accent-blue-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                    />
                  </div>
                );
              })()}

              {/* 6. Warmth / Color Temp (-100 to +100) */}
              {(() => {
                const wVal = canvasSettings.warmth ?? 0;
                return (
                  <div className="space-y-1.5 bg-slate-900/40 p-2.5 rounded-xl border border-white/5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                        <Flame className="w-3.5 h-3.5 text-orange-400" />
                        <span>Warmth (Cool ↔ Warm)</span>
                      </span>
                      <div className="flex items-center gap-1.5">
                        {wVal !== 0 && (
                          <button
                            type="button"
                            onClick={() => updateCanvasSettings({ warmth: 0 })}
                            className="text-[10px] text-slate-400 hover:text-white px-1.5 py-0.5 rounded bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer"
                            title="Reset Warmth to 0"
                          >
                            0
                          </button>
                        )}
                        <span className={`font-mono font-bold text-xs min-w-[38px] text-right ${
                          wVal > 0 ? 'text-amber-400' : wVal < 0 ? 'text-cyan-400' : 'text-slate-400'
                        }`}>
                          {wVal > 0 ? `+${wVal}` : wVal}
                        </span>
                      </div>
                    </div>
                    <input
                      type="range"
                      min={-100}
                      max={100}
                      value={wVal}
                      onChange={(e) => updateCanvasSettings({ warmth: Number(e.target.value) })}
                      className="w-full accent-amber-500 h-2 bg-gradient-to-r from-cyan-600 via-slate-700 to-amber-500 rounded-lg cursor-pointer"
                    />
                  </div>
                );
              })()}

              {/* 7. Tint (-100 Green to +100 Magenta) */}
              {(() => {
                const tVal = canvasSettings.tint ?? 0;
                return (
                  <div className="space-y-1.5 bg-slate-900/40 p-2.5 rounded-xl border border-white/5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                        <Glasses className="w-3.5 h-3.5 text-purple-400" />
                        <span>Tint (Green ↔ Magenta)</span>
                      </span>
                      <div className="flex items-center gap-1.5">
                        {tVal !== 0 && (
                          <button
                            type="button"
                            onClick={() => updateCanvasSettings({ tint: 0 })}
                            className="text-[10px] text-slate-400 hover:text-white px-1.5 py-0.5 rounded bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer"
                            title="Reset Tint to 0"
                          >
                            0
                          </button>
                        )}
                        <span className={`font-mono font-bold text-xs min-w-[38px] text-right ${
                          tVal > 0 ? 'text-fuchsia-400' : tVal < 0 ? 'text-emerald-400' : 'text-slate-400'
                        }`}>
                          {tVal > 0 ? `+${tVal}` : tVal}
                        </span>
                      </div>
                    </div>
                    <input
                      type="range"
                      min={-100}
                      max={100}
                      value={tVal}
                      onChange={(e) => updateCanvasSettings({ tint: Number(e.target.value) })}
                      className="w-full accent-fuchsia-500 h-2 bg-gradient-to-r from-emerald-600 via-slate-700 to-fuchsia-500 rounded-lg cursor-pointer"
                    />
                  </div>
                );
              })()}

              {/* 8. Clarity / Structure (0 to 100) */}
              {(() => {
                const clVal = canvasSettings.clarity ?? 0;
                return (
                  <div className="space-y-1.5 bg-slate-900/40 p-2.5 rounded-xl border border-white/5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                        <Aperture className="w-3.5 h-3.5 text-teal-400" />
                        <span>Clarity & Structure</span>
                      </span>
                      <div className="flex items-center gap-1.5">
                        {clVal > 0 && (
                          <button
                            type="button"
                            onClick={() => updateCanvasSettings({ clarity: 0 })}
                            className="text-[10px] text-slate-400 hover:text-white px-1.5 py-0.5 rounded bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer"
                            title="Reset Clarity to 0"
                          >
                            0
                          </button>
                        )}
                        <span className="font-mono text-cyan-400 font-bold text-xs min-w-[38px] text-right">
                          {clVal}
                        </span>
                      </div>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={clVal}
                      onChange={(e) => updateCanvasSettings({ clarity: Number(e.target.value) })}
                      className="w-full accent-blue-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                    />
                  </div>
                );
              })()}

              {/* 9. Vignette (0 to 100) */}
              {(() => {
                const vVal = canvasSettings.vignette ?? 0;
                return (
                  <div className="space-y-1.5 bg-slate-900/40 p-2.5 rounded-xl border border-white/5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                        <CircleDot className="w-3.5 h-3.5 text-blue-400" />
                        <span>Vignette (Edge Falloff)</span>
                      </span>
                      <div className="flex items-center gap-1.5">
                        {vVal > 0 && (
                          <button
                            type="button"
                            onClick={() => updateCanvasSettings({ vignette: 0 })}
                            className="text-[10px] text-slate-400 hover:text-white px-1.5 py-0.5 rounded bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer"
                            title="Reset Vignette to 0"
                          >
                            0
                          </button>
                        )}
                        <span className="font-mono text-cyan-400 font-bold text-xs min-w-[38px] text-right">
                          {vVal}
                        </span>
                      </div>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={vVal}
                      onChange={(e) => updateCanvasSettings({ vignette: Number(e.target.value) })}
                      className="w-full accent-blue-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                    />
                  </div>
                );
              })()}

              {/* 10. Film Grain (0 to 100) */}
              {(() => {
                const grVal = canvasSettings.grain ?? 0;
                return (
                  <div className="space-y-1.5 bg-slate-900/40 p-2.5 rounded-xl border border-white/5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                        <Tv className="w-3.5 h-3.5 text-purple-400" />
                        <span>Film Grain Texture</span>
                      </span>
                      <div className="flex items-center gap-1.5">
                        {grVal > 0 && (
                          <button
                            type="button"
                            onClick={() => updateCanvasSettings({ grain: 0 })}
                            className="text-[10px] text-slate-400 hover:text-white px-1.5 py-0.5 rounded bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer"
                            title="Reset Grain to 0"
                          >
                            0
                          </button>
                        )}
                        <span className="font-mono text-cyan-400 font-bold text-xs min-w-[38px] text-right">
                          {grVal}
                        </span>
                      </div>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={grVal}
                      onChange={(e) => updateCanvasSettings({ grain: Number(e.target.value) })}
                      className="w-full accent-blue-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                    />
                  </div>
                );
              })()}

              {/* 11. Hue Shift (0 to 360) */}
              <div className="space-y-1.5 bg-slate-900/40 p-2.5 rounded-xl border border-white/5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Hue Color Shift</span>
                  </span>
                  <div className="flex items-center gap-1.5">
                    {(canvasSettings.hueRotate ?? 0) !== 0 && (
                      <button
                        type="button"
                        onClick={() => updateCanvasSettings({ hueRotate: 0 })}
                        className="text-[10px] text-slate-400 hover:text-white px-1.5 py-0.5 rounded bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer"
                        title="Reset Hue to 0"
                      >
                        0
                      </button>
                    )}
                    <span className="font-mono text-cyan-400 font-bold text-xs min-w-[38px] text-right">
                      {canvasSettings.hueRotate ?? 0}°
                    </span>
                  </div>
                </div>
                <input
                  type="range"
                  min={0}
                  max={360}
                  value={canvasSettings.hueRotate ?? 0}
                  onChange={(e) => updateCanvasSettings({ hueRotate: Number(e.target.value) })}
                  className="w-full accent-blue-500 h-2 bg-gradient-to-r from-red-500 via-green-500 to-blue-500 rounded-lg cursor-pointer"
                />
              </div>

              {/* 12. Image Blur (0 to 10px) */}
              <div className="space-y-1.5 bg-slate-900/40 p-2.5 rounded-xl border border-white/5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-semibold">Atmospheric Blur</span>
                  <div className="flex items-center gap-1.5">
                    {(canvasSettings.blur ?? 0) !== 0 && (
                      <button
                        type="button"
                        onClick={() => updateCanvasSettings({ blur: 0 })}
                        className="text-[10px] text-slate-400 hover:text-white px-1.5 py-0.5 rounded bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer"
                        title="Reset Blur to 0"
                      >
                        0
                      </button>
                    )}
                    <span className="font-mono text-cyan-400 font-bold text-xs min-w-[38px] text-right">
                      {canvasSettings.blur ?? 0}px
                    </span>
                  </div>
                </div>
                <input
                  type="range"
                  min={0}
                  max={10}
                  value={canvasSettings.blur ?? 0}
                  onChange={(e) => updateCanvasSettings({ blur: Number(e.target.value) })}
                  className="w-full accent-blue-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            {/* Image Geometry / Flipping Controls */}
            <div className="space-y-2 pt-3 border-t border-white/10">
              <span className="text-xs text-slate-300 font-bold uppercase tracking-wider block">Image Geometry</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={toggleFlipHorizontal}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    canvasSettings.flipHorizontal
                      ? 'bg-[#1463E9] text-white border-blue-400 shadow-xs'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:text-white'
                  }`}
                >
                  <FlipHorizontal className="w-4 h-4" />
                  <span>Flip Horizontal</span>
                </button>

                <button
                  type="button"
                  onClick={toggleFlipVertical}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    canvasSettings.flipVertical
                      ? 'bg-[#1463E9] text-white border-blue-400 shadow-xs'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:text-white'
                  }`}
                >
                  <FlipVertical className="w-4 h-4" />
                  <span>Flip Vertical</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 7: CANVAS & WATERMARK CREATOR TAG                    */}
        {/* ========================================================= */}
        {activeTab === 'canvas' && (
          <div className="space-y-5 animate-in fade-in duration-150">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Maximize2 className="w-4 h-4 text-blue-400" />
                <span>Canvas Ratio & Watermark Tag</span>
              </h3>
              <p className="text-[11px] text-slate-400 mt-1">
                Customize dimensions for TikTok, Reels, Instagram, and add your creator brand tag.
              </p>
            </div>

            {/* Aspect Ratio Presets */}
            <div className="space-y-2">
              <span className="text-xs text-slate-300 font-semibold block">Aspect Ratio</span>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'original', label: 'Original', icon: Maximize2 },
                  { id: '1:1', label: '1:1 Square', icon: Square },
                  { id: '9:16', label: '9:16 Reels', icon: Smartphone },
                  { id: '16:9', label: '16:9 Wide', icon: Tv },
                  { id: '4:5', label: '4:5 Feed', icon: Smartphone },
                  { id: '4:3', label: '4:3 Classic', icon: Square },
                ].map((ratio) => {
                  const Icon = ratio.icon;
                  return (
                    <button
                      key={ratio.id}
                      type="button"
                      onClick={() => updateCanvasSettings({ aspectRatio: ratio.id as any })}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all active:scale-95 cursor-pointer ${
                        canvasSettings.aspectRatio === ratio.id
                          ? 'bg-[#1463E9] border-blue-400 text-white shadow-xs'
                          : 'bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-[10px]">{ratio.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Canvas Border Padding & Background */}
            <div className="space-y-3 pt-3 border-t border-white/10">
              <span className="text-xs text-slate-300 font-semibold block">Canvas Border Frame</span>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium">Padding Thickness</span>
                  <span className="font-mono text-cyan-400 font-semibold">{canvasSettings.padding}px</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={50}
                  value={canvasSettings.padding}
                  onChange={(e) => updateCanvasSettings({ padding: Number(e.target.value) })}
                  className="w-full accent-blue-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Frame Color */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium">Frame Color</span>
                  <span className="font-mono text-slate-400 uppercase text-[11px]">
                    {canvasSettings.backgroundColor}
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {['#020617', '#FFFFFF', '#071330', '#1E293B', '#B91C1C', '#047857'].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => updateCanvasSettings({ backgroundColor: c })}
                      className={`w-7 h-7 rounded-lg border transition-transform cursor-pointer hover:scale-110 shrink-0 ${
                        canvasSettings.backgroundColor.toLowerCase() === c.toLowerCase()
                          ? 'border-cyan-400 ring-2 ring-cyan-400/50 scale-105'
                          : 'border-white/20'
                      }`}
                      style={{ backgroundColor: c }}
                      title={c}
                    />
                  ))}
                  <input
                    type="color"
                    value={canvasSettings.backgroundColor}
                    onChange={(e) => updateCanvasSettings({ backgroundColor: e.target.value })}
                    className="w-7 h-7 rounded-lg border border-white/20 bg-transparent cursor-pointer shrink-0"
                  />
                </div>
              </div>
            </div>

            {/* Creator Watermark Tag */}
            <div className="space-y-3 pt-3 border-t border-white/10">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-300">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>Custom Creator Watermark Tag</span>
              </div>
              <input
                type="text"
                value={canvasSettings.watermarkText || ''}
                onChange={(e) => updateCanvasSettings({ watermarkText: e.target.value })}
                placeholder="e.g. @your_meme_handle"
                className="w-full bg-slate-900 text-white rounded-lg border border-white/15 px-3 py-2 text-xs font-semibold focus:outline-none focus:border-blue-500"
              />

              {/* Watermark Position */}
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: 'top-left', label: 'Top Left' },
                  { id: 'top-right', label: 'Top Right' },
                  { id: 'bottom-left', label: 'Bottom Left' },
                  { id: 'bottom-right', label: 'Bottom Right' },
                ].map((pos) => (
                  <button
                    key={pos.id}
                    type="button"
                    onClick={() => updateCanvasSettings({ watermarkPosition: pos.id as any })}
                    className={`py-1.5 px-2 rounded-lg border text-xs font-semibold text-center transition-all cursor-pointer ${
                      (canvasSettings.watermarkPosition || 'bottom-right') === pos.id
                        ? 'bg-[#1463E9] border-blue-400 text-white'
                        : 'bg-white/5 border-white/10 text-slate-300 hover:text-white'
                    }`}
                  >
                    {pos.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: INLINE AI MAGIC CAPTION GENERATOR                 */}
        {/* ========================================================= */}
        {activeTab === 'ai' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Bot className="w-4 h-4 text-cyan-400" />
                <span>Instant AI Meme Generator</span>
              </h3>
              <p className="text-[11px] text-slate-400 mt-1">
                Describe a situation or scenario to generate witty, viral punchlines.
              </p>
            </div>

            {/* Tone Selector */}
            <div className="space-y-1.5">
              <label className="text-xs text-slate-300 font-medium">Select Tone</label>
              <div className="flex items-center gap-1.5 flex-wrap">
                {AI_TONES.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setAiTone(t.value)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-150 active:scale-95 cursor-pointer ${
                      aiTone === t.value
                        ? 'bg-[#1463E9] text-white shadow-xs shadow-blue-500/30'
                        : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Prompt Input */}
            <div className="space-y-1.5">
              <label htmlFor="inline-ai-prompt" className="text-xs text-slate-300 font-medium">
                Topic or Situation
              </label>
              <textarea
                id="inline-ai-prompt"
                rows={2}
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="e.g. When someone compliments my code in production..."
                className="w-full bg-slate-900 text-slate-100 placeholder:text-slate-600 rounded-xl border border-white/15 p-3 text-xs focus:outline-none focus:border-blue-500 font-medium resize-none"
              />
            </div>

            {/* Generate Button */}
            <button
              type="button"
              disabled={isAiLoading || !aiPrompt.trim()}
              onClick={() => generateCaptions()}
              className="w-full py-2.5 px-4 rounded-xl bg-[#1463E9] hover:bg-[#0E52C7] text-white font-bold text-xs shadow-md shadow-blue-600/30 hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isAiLoading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Generating AI Punchlines...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-3.5 h-3.5" />
                  <span>Generate Captions</span>
                </>
              )}
            </button>

            {/* Generated Captions List */}
            {aiCaptions.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-white/10">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Suggestions ({aiCaptions.length})
                </span>
                <div className="space-y-2">
                  {aiCaptions.map((cap) => (
                    <div
                      key={cap.id}
                      className="p-3 rounded-xl border border-white/10 bg-slate-900/60 hover:border-cyan-400/40 transition-all space-y-2"
                    >
                      <p className="text-xs font-semibold text-white leading-relaxed">
                        "{cap.singleText}"
                      </p>
                      <div className="flex items-center justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            addTextLayer({
                              text: cap.singleText,
                              fontSize: 34,
                              fontFamily: 'Impact',
                              color: '#FFFFFF',
                              strokeColor: '#000000',
                              strokeWidth: 3,
                              isBold: true,
                              isUppercase: true,
                            });
                            setActiveTab('text');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 text-[11px] font-bold transition-all active:scale-95 cursor-pointer"
                        >
                          + New Layer
                        </button>
                        {selectedLayer && (
                          <button
                            type="button"
                            onClick={() => {
                              updateTextLayer(selectedLayer.id, { text: cap.singleText }, true);
                              setActiveTab('text');
                            }}
                            className="px-2.5 py-1 rounded-lg bg-[#1463E9] hover:bg-[#0E52C7] text-white text-[11px] font-bold transition-all active:scale-95 cursor-pointer"
                          >
                            Replace Active
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 6: LAYER MANAGER STACK                                */}
        {/* ========================================================= */}
        {activeTab === 'layers' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-300">
                <Layers className="w-4 h-4 text-blue-400" />
                <span>Layer Stack ({textLayers.length})</span>
              </div>
              <button
                type="button"
                onClick={() => addTextLayer()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1463E9] hover:bg-[#0E52C7] text-white text-xs font-bold transition-all duration-150 cursor-pointer active:scale-95 shadow-sm shadow-blue-600/30"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Add Layer</span>
              </button>
            </div>

            <div className="space-y-2">
              {textLayers.map((layer, idx) => {
                const isSelected = layer.id === selectedLayerId;
                return (
                  <div
                    key={layer.id}
                    onClick={() => {
                      selectLayer(layer.id);
                      setActiveTab('text');
                    }}
                    className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600/20 border-blue-500/80 text-white ring-1 ring-blue-500/40'
                        : 'bg-slate-900/60 border-white/10 text-slate-300 hover:border-white/20 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold text-slate-300 shrink-0">
                        {idx + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold truncate text-white">
                          {layer.text || '(Empty caption)'}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {layer.fontFamily} • {layer.fontSize}px
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          moveLayerOrder(layer.id, 'up');
                        }}
                        disabled={idx === textLayers.length - 1}
                        title="Move Up"
                        className="p-1 min-w-[28px] min-h-[28px] flex items-center justify-center text-slate-400 hover:text-white disabled:opacity-20 cursor-pointer rounded hover:bg-white/10 active:scale-95 transition-all"
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          moveLayerOrder(layer.id, 'down');
                        }}
                        disabled={idx === 0}
                        title="Move Down"
                        className="p-1 min-w-[28px] min-h-[28px] flex items-center justify-center text-slate-400 hover:text-white disabled:opacity-20 cursor-pointer rounded hover:bg-white/10 active:scale-95 transition-all"
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          duplicateTextLayer(layer.id);
                        }}
                        title="Duplicate"
                        className="p-1 min-w-[28px] min-h-[28px] flex items-center justify-center text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/20 rounded cursor-pointer active:scale-95 transition-all"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteTextLayer(layer.id);
                        }}
                        title="Delete"
                        className="p-1 min-w-[28px] min-h-[28px] flex items-center justify-center text-rose-400 hover:text-rose-300 hover:bg-rose-500/20 rounded cursor-pointer active:scale-95 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
