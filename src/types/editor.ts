import type { MemeTemplate } from './template';

export interface TextLayer {
  id: string;
  text: string;
  xPercent: number; // 0 to 100% relative to canvas
  yPercent: number; // 0 to 100% relative to canvas
  fontSize: number; // in pixels (base display scale)
  color: string;
  strokeColor: string;
  strokeWidth: number;
  isBold: boolean;
  isItalic: boolean;
  isUppercase: boolean;
  alignment: 'left' | 'center' | 'right';
  fontFamily: string;
  rotation: number; // degrees -180 to 180
  opacity: number; // 0.0 to 1.0
  shadowColor?: string;
  shadowBlur?: number;
  shadowOffsetX?: number;
  shadowOffsetY?: number;
  letterSpacing?: number; // -2 to 12 px
  lineHeight?: number; // 0.8 to 2.0
  backgroundColor?: string; // background banner / highlight box
  isLocked?: boolean;
  isGlow?: boolean;
  glowColor?: string;
  is3d?: boolean;
  curve?: number; // -100 to 100
  textCase?: 'uppercase' | 'lowercase' | 'title' | 'normal';
}

export interface DoodleStroke {
  id: string;
  color: string;
  size: number;
  points: { x: number; y: number }[]; // 0 to 100% relative to canvas
  isHighlighter?: boolean;
}

export interface CanvasSettings {
  aspectRatio: 'original' | '1:1' | '16:9' | '9:16' | '4:3' | '4:5';
  backgroundColor: string;
  padding: number;
  zoom: number; // 0.5 to 2.5
  fitToScreen: boolean;
  showGrid: boolean;
  brightness?: number; // 0 to 200 (default 100)
  contrast?: number; // 0 to 200 (default 100)
  saturation?: number; // 0 to 200 (default 100)
  exposure?: number; // -100 to 100 (default 0)
  highlights?: number; // -100 to 100 (default 0)
  shadows?: number; // -100 to 100 (default 0)
  warmth?: number; // -100 to 100 (default 0)
  tint?: number; // -100 to 100 (default 0)
  clarity?: number; // 0 to 100 (default 0)
  vignette?: number; // 0 to 100 (default 0)
  grain?: number; // 0 to 100 (default 0)
  sepia?: number; // 0 to 100 (default 0)
  invert?: number; // 0 to 100 (default 0)
  blur?: number; // 0 to 10 (default 0)
  hueRotate?: number; // 0 to 360 (default 0)
  flipHorizontal?: boolean;
  flipVertical?: boolean;
  frameStyle?: 'none' | 'demotivational' | 'twitter' | 'breaking-news' | 'polaroid' | string;
  frameTitle?: string;
  frameSubtitle?: string;
  borderWidth?: number;
  borderColor?: string;
  borderRadius?: number;
  borderStyleType?: 'solid' | 'dashed' | 'double' | 'groove' | 'none';
  overlayBadge?: string;
  overlayBadgeBg?: string;
  overlayBadgeColor?: string;
  headerBannerText?: string;
  headerBannerBg?: string;
  headerBannerColor?: string;
  watermarkText?: string;
  watermarkOpacity?: number;
  watermarkPosition?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  doodles?: DoodleStroke[];
}

export interface EditorHistoryEntry {
  textLayers: TextLayer[];
  memeTitle: string;
  canvasSettings?: CanvasSettings;
}

export interface EditorState {
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
}
