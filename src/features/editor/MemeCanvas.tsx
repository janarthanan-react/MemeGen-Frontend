import React, { useRef, useState, useEffect } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Grid,
  Trash2,
  Copy,
  ImageOff,
  FlipHorizontal,
  FlipVertical,
  PenTool,
  Eye,
} from 'lucide-react';
import type { TextLayer } from '../../types/editor';
import { useEditorStore } from '../../stores/useEditorStore';

interface MemeCanvasProps {
  onCanvasSizeChange?: (width: number, height: number) => void;
}

export const MemeCanvas: React.FC<MemeCanvasProps> = ({ onCanvasSizeChange }) => {
  const activeTemplate = useEditorStore((state) => state.activeTemplate);
  const textLayers = useEditorStore((state) => state.textLayers);
  const selectedLayerId = useEditorStore((state) => state.selectedLayerId);
  const canvasSettings = useEditorStore((state) => state.canvasSettings);

  const selectLayer = useEditorStore((state) => state.selectLayer);
  const updateTextLayer = useEditorStore((state) => state.updateTextLayer);
  const deleteTextLayer = useEditorStore((state) => state.deleteTextLayer);
  const duplicateTextLayer = useEditorStore((state) => state.duplicateTextLayer);
  const zoomIn = useEditorStore((state) => state.zoomIn);
  const zoomOut = useEditorStore((state) => state.zoomOut);
  const resetZoom = useEditorStore((state) => state.resetZoom);
  const toggleFitToScreen = useEditorStore((state) => state.toggleFitToScreen);
  const toggleGrid = useEditorStore((state) => state.toggleGrid);
  const toggleFlipHorizontal = useEditorStore((state) => state.toggleFlipHorizontal);
  const toggleFlipVertical = useEditorStore((state) => state.toggleFlipVertical);
  const isDrawingMode = useEditorStore((state) => state.isDrawingMode);
  const setIsDrawingMode = useEditorStore((state) => state.setIsDrawingMode);
  const drawingColor = useEditorStore((state) => state.drawingColor);
  const drawingBrushSize = useEditorStore((state) => state.drawingBrushSize);
  const isDrawingHighlighter = useEditorStore((state) => state.isDrawingHighlighter);
  const addDoodleStroke = useEditorStore((state) => state.addDoodleStroke);
  const isComparing = useEditorStore((state) => state.isComparing);

  // Snapseed filter parameters
  const rawBrightness = canvasSettings.brightness ?? 100;
  const exposure = canvasSettings.exposure ?? 0;
  const highlights = canvasSettings.highlights ?? 0;
  const shadows = canvasSettings.shadows ?? 0;
  const warmth = canvasSettings.warmth ?? 0;
  const tint = canvasSettings.tint ?? 0;
  const clarity = canvasSettings.clarity ?? 0;
  const vignette = canvasSettings.vignette ?? 0;
  const grain = canvasSettings.grain ?? 0;

  const effBrightness = Math.max(
    0,
    Math.min(250, rawBrightness + exposure + highlights * 0.2 + (shadows > 0 ? shadows * 0.15 : shadows * 0.1))
  );
  const effContrast = Math.max(
    0,
    Math.min(250, (canvasSettings.contrast ?? 100) + clarity * 0.35 + (shadows < 0 ? Math.abs(shadows) * 0.15 : -shadows * 0.08))
  );
  const effSaturation = Math.max(0, Math.min(250, (canvasSettings.saturation ?? 100) + clarity * 0.1));
  const effHueRotate = ((canvasSettings.hueRotate ?? 0) + tint * 0.35) % 360;

  const [activeDoodlePoints, setActiveDoodlePoints] = useState<{ x: number; y: number }[]>([]);
  const isDrawingActiveRef = useRef(false);

  const handleDoodlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!isDrawingMode || !containerRef.current) return;
    e.preventDefault();
    e.stopPropagation();
    isDrawingActiveRef.current = true;
    const rect = containerRef.current.getBoundingClientRect();
    const pt = {
      x: Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100)),
      y: Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100)),
    };
    setActiveDoodlePoints([pt]);
    const targetEl = e.currentTarget;
    try {
      targetEl.setPointerCapture(e.pointerId);
    } catch {
      // fallback
    }
  };

  const handleDoodlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!isDrawingActiveRef.current || !containerRef.current) return;
    e.preventDefault();
    e.stopPropagation();
    const rect = containerRef.current.getBoundingClientRect();
    const pt = {
      x: Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100)),
      y: Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100)),
    };
    setActiveDoodlePoints((prev) => [...prev, pt]);
  };

  const handleDoodlePointerUp = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!isDrawingActiveRef.current) return;
    isDrawingActiveRef.current = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // fallback
    }
    if (activeDoodlePoints.length > 1) {
      addDoodleStroke({
        id: `doodle-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        color: drawingColor,
        size: drawingBrushSize,
        isHighlighter: isDrawingHighlighter,
        points: activeDoodlePoints,
      });
    }
    setActiveDoodlePoints([]);
  };

  const pointsToSvgPath = (points: { x: number; y: number }[]): string => {
    if (points.length === 0) return '';
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      d += ` L ${points[i].x} ${points[i].y}`;
    }
    return d;
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [prevTemplateId, setPrevTemplateId] = useState<string | null>(activeTemplate?.id || null);

  // Sync image error/loaded state during render when template changes
  if (activeTemplate && activeTemplate.id !== prevTemplateId) {
    setPrevTemplateId(activeTemplate.id);
    setImageError(false);
    setImageLoaded(false);
  }

  // Notify parent of actual rendered image dimensions for export reference
  useEffect(() => {
    if (imageRef.current && imageLoaded) {
      const w = imageRef.current.clientWidth;
      const h = imageRef.current.clientHeight;
      if (w > 0 && h > 0 && onCanvasSizeChange) {
        onCanvasSizeChange(w, h);
      }
    }
  }, [imageLoaded, activeTemplate, onCanvasSizeChange]);

  // Handle window resize to keep export scale accurate
  useEffect(() => {
    const handleResize = () => {
      if (imageRef.current && onCanvasSizeChange) {
        onCanvasSizeChange(imageRef.current.clientWidth, imageRef.current.clientHeight);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [onCanvasSizeChange]);

  const memeTitle = useEditorStore((state) => state.memeTitle);
  const pushHistorySnapshot = useEditorStore((state) => state.pushHistorySnapshot);

  // -------------------------------------------------------------
  // Dragging logic with Pointer Events (Mouse, Touch, Pen)
  // -------------------------------------------------------------
  const [isDragging, setIsDragging] = useState(false);
  const dragStartSnapshotRef = useRef<{
    textLayers: TextLayer[];
    memeTitle: string;
  } | null>(null);
  const dragInfoRef = useRef<{
    layerId: string;
    startX: number;
    startY: number;
    startLayerX: number;
    startLayerY: number;
    rect: DOMRect;
  } | null>(null);
  const capturedElementRef = useRef<HTMLElement | null>(null);
  const activePointerIdRef = useRef<number | null>(null);

  const handlePointerDown = (
    e: React.PointerEvent<HTMLDivElement>,
    layer: TextLayer
  ) => {
    e.stopPropagation();
    e.preventDefault();
    selectLayer(layer.id);

    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();

    dragStartSnapshotRef.current = {
      textLayers: JSON.parse(JSON.stringify(textLayers)),
      memeTitle,
    };

    dragInfoRef.current = {
      layerId: layer.id,
      startX: e.clientX,
      startY: e.clientY,
      startLayerX: layer.xPercent,
      startLayerY: layer.yPercent,
      rect,
    };
    setIsDragging(true);

    const targetEl = e.currentTarget as HTMLElement;
    try {
      targetEl.setPointerCapture(e.pointerId);
      capturedElementRef.current = targetEl;
      activePointerIdRef.current = e.pointerId;
    } catch {
      // Browser pointer capture fallback
    }

    const onPointerMove = (moveEvent: PointerEvent) => {
      if (!dragInfoRef.current) return;
      const { layerId, startX, startY, startLayerX, startLayerY, rect } =
        dragInfoRef.current;

      const deltaXPercent = ((moveEvent.clientX - startX) / rect.width) * 100;
      const deltaYPercent = ((moveEvent.clientY - startY) / rect.height) * 100;

      const newX = Math.max(2, Math.min(98, Number((startLayerX + deltaXPercent).toFixed(1))));
      const newY = Math.max(2, Math.min(98, Number((startLayerY + deltaYPercent).toFixed(1))));

      updateTextLayer(layerId, { xPercent: newX, yPercent: newY }, false);
    };

    const onPointerUp = () => {
      setIsDragging(false);
      dragInfoRef.current = null;
      if (dragStartSnapshotRef.current) {
        pushHistorySnapshot(dragStartSnapshotRef.current);
        dragStartSnapshotRef.current = null;
      }

      if (capturedElementRef.current && activePointerIdRef.current !== null) {
        try {
          capturedElementRef.current.releasePointerCapture(activePointerIdRef.current);
        } catch {
          // Already released
        }
        capturedElementRef.current = null;
        activePointerIdRef.current = null;
      }

      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  const handleWorkspaceClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      selectLayer(null);
    }
  };

  if (!activeTemplate) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center text-slate-400">
        <ImageOff className="w-12 h-12 text-slate-600 mb-3" />
        <h3 className="text-lg font-semibold text-slate-200">No Template Selected</h3>
        <p className="text-xs text-slate-400 mt-1 max-w-sm">
          Please select a template from the template library to begin creating your meme.
        </p>
      </div>
    );
  }

  const zoomFactor = canvasSettings.zoom;

  return (
    <div
      className={`relative w-full h-full flex-1 flex flex-col items-center justify-center overflow-auto no-scrollbar p-2 sm:p-8 select-none ${
        isDragging ? 'cursor-grabbing' : 'cursor-default'
      }`}
      onClick={handleWorkspaceClick}
      style={{
        backgroundColor: '#070d1e',
        backgroundImage: canvasSettings.showGrid
          ? 'radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)'
          : undefined,
        backgroundSize: '24px 24px',
      }}
    >
      {/* Centered Scalable Workspace */}
      <div
        className="transition-transform duration-150 ease-out origin-center flex items-center justify-center"
        style={{
          transform: `scale(${zoomFactor})`,
        }}
      >
        <div
          ref={containerRef}
          className="relative inline-block rounded-xl overflow-hidden shadow-2xl border border-slate-700/60 bg-slate-950 transition-all"
          style={{
            maxWidth: canvasSettings.fitToScreen ? 'min(86vw, 680px)' : 'none',
            padding: canvasSettings.padding ? `${canvasSettings.padding}px` : undefined,
            backgroundColor: canvasSettings.backgroundColor || '#020617',
            borderWidth: canvasSettings.borderWidth !== undefined ? `${canvasSettings.borderWidth}px` : undefined,
            borderColor: canvasSettings.borderColor,
            borderRadius: canvasSettings.borderRadius !== undefined ? `${canvasSettings.borderRadius}px` : undefined,
            borderStyle: canvasSettings.borderStyleType,
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget || e.target === imageRef.current) {
              selectLayer(null);
            }
          }}
        >
          {/* Header Banner (e.g. Breaking News, Twitter, TIME, Reddit, NASA) */}
          {canvasSettings.headerBannerText && (
            <div
              className="absolute top-0 inset-x-0 z-20 pointer-events-none select-none px-3 py-1 font-bold text-xs uppercase tracking-wider flex items-center justify-between"
              style={{
                backgroundColor: canvasSettings.headerBannerBg || '#000000',
                color: canvasSettings.headerBannerColor || '#FFFFFF',
              }}
            >
              <span className="truncate">{canvasSettings.headerBannerText}</span>
              {canvasSettings.overlayBadge && (
                <span
                  className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-widest shrink-0 ml-2 shadow-xs"
                  style={{
                    backgroundColor: canvasSettings.overlayBadgeBg || '#DC2626',
                    color: canvasSettings.overlayBadgeColor || '#FFFFFF',
                  }}
                >
                  {canvasSettings.overlayBadge}
                </span>
              )}
            </div>
          )}

          {/* Standalone Overlay Badge (when no header banner) */}
          {canvasSettings.overlayBadge && !canvasSettings.headerBannerText && (
            <div
              className="absolute top-2 left-2 z-25 pointer-events-none select-none px-2 py-0.5 rounded text-[10px] font-black tracking-wider uppercase flex items-center gap-1.5 shadow-md"
              style={{
                backgroundColor: canvasSettings.overlayBadgeBg || '#DC2626',
                color: canvasSettings.overlayBadgeColor || '#FFFFFF',
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current animate-ping inline-block" />
              <span>{canvasSettings.overlayBadge}</span>
            </div>
          )}
          {/* Base Template Image */}
          {!imageError ? (
            <>
              <img
                ref={imageRef}
                src={activeTemplate.imageUrl}
                alt={activeTemplate.name}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
                crossOrigin="anonymous"
                className="w-auto h-auto max-h-[36vh] xs:max-h-[42vh] sm:max-h-[50vh] lg:max-h-[62vh] min-h-[160px] sm:min-h-[220px] max-w-full object-contain pointer-events-auto select-none block transition-[filter,transform] duration-150"
                style={{
                  filter: isComparing
                    ? 'none'
                    : `brightness(${effBrightness}%) contrast(${effContrast}%) saturate(${effSaturation}%) sepia(${canvasSettings.sepia ?? 0}%) invert(${canvasSettings.invert ?? 0}%) blur(${canvasSettings.blur ?? 0}px) hue-rotate(${effHueRotate}deg)`,
                  transform: `${canvasSettings.flipHorizontal ? 'scaleX(-1)' : ''} ${canvasSettings.flipVertical ? 'scaleY(-1)' : ''}`.trim() || undefined,
                }}
                draggable={false}
              />

              {/* Snapseed Warmth (Color Temp) Overlay */}
              {!isComparing && warmth !== 0 && (
                <div
                  className="absolute inset-0 pointer-events-none mix-blend-soft-light transition-opacity duration-150 z-10"
                  style={{
                    backgroundColor: warmth > 0 ? '#F59E0B' : '#06B6D4',
                    opacity: (Math.min(100, Math.abs(warmth)) / 100) * 0.35,
                  }}
                />
              )}

              {/* Snapseed Tint Overlay */}
              {!isComparing && tint !== 0 && (
                <div
                  className="absolute inset-0 pointer-events-none mix-blend-soft-light transition-opacity duration-150 z-10"
                  style={{
                    backgroundColor: tint > 0 ? '#D946EF' : '#22C55E',
                    opacity: (Math.min(100, Math.abs(tint)) / 100) * 0.25,
                  }}
                />
              )}

              {/* Snapseed Vignette Overlay */}
              {!isComparing && vignette > 0 && (
                <div
                  className="absolute inset-0 pointer-events-none transition-opacity duration-150 z-10"
                  style={{
                    background: `radial-gradient(ellipse at center, transparent 35%, rgba(0, 0, 0, ${(vignette / 100) * 0.85}) 100%)`,
                  }}
                />
              )}

              {/* Snapseed Film Grain Overlay */}
              {!isComparing && grain > 0 && (
                <div
                  className="absolute inset-0 pointer-events-none mix-blend-overlay transition-opacity duration-150 z-10"
                  style={{
                    opacity: (grain / 100) * 0.45,
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.7'/%3E%3C/svg%3E")`,
                  }}
                />
              )}

              {/* Snapseed Compare Indicator */}
              {isComparing && (
                <div className="absolute top-3 left-1/2 -translate-x-1/2 z-40 bg-black/85 backdrop-blur-md text-amber-300 border border-amber-400/40 text-[11px] font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5 pointer-events-none animate-pulse">
                  <Eye className="w-3.5 h-3.5 text-amber-400" />
                  <span>Original Photo (Comparing)</span>
                </div>
              )}
            </>
          ) : (
            <div className="w-[480px] max-w-full h-[360px] bg-slate-900 flex flex-col items-center justify-center p-6 text-center">
              <ImageOff className="w-10 h-10 text-slate-500 mb-2" />
              <p className="text-sm font-semibold text-slate-300">{activeTemplate.name}</p>
              <p className="text-xs text-slate-500 mt-1">Image preview could not be loaded</p>
            </div>
          )}

          {/* SVG Doodles Canvas Overlay */}
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            onPointerDown={handleDoodlePointerDown}
            onPointerMove={handleDoodlePointerMove}
            onPointerUp={handleDoodlePointerUp}
            className={`absolute inset-0 w-full h-full ${
              isDrawingMode ? 'pointer-events-auto cursor-crosshair z-30' : 'pointer-events-none z-10'
            }`}
          >
            {/* Committed Doodles */}
            {canvasSettings.doodles?.map((stroke) => (
              <path
                key={stroke.id}
                d={pointsToSvgPath(stroke.points)}
                stroke={stroke.color}
                strokeWidth={stroke.size * 0.4}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                opacity={stroke.isHighlighter ? 0.45 : 1}
              />
            ))}
            {/* Real-time active drawing stroke */}
            {activeDoodlePoints.length > 1 && (
              <path
                d={pointsToSvgPath(activeDoodlePoints)}
                stroke={drawingColor}
                strokeWidth={drawingBrushSize * 0.4}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                opacity={isDrawingHighlighter ? 0.45 : 1}
              />
            )}
          </svg>

          {/* Breaking News / Broadcast / Frame Title Banner */}
          {(canvasSettings.frameStyle === 'breaking-news' ||
            (canvasSettings.frameTitle && canvasSettings.frameTitle.trim().length > 0)) && (
            <div className="absolute bottom-0 inset-x-0 z-20 pointer-events-none select-none">
              {canvasSettings.frameStyle === 'breaking-news' && (
                <div className="bg-amber-400 text-black px-3 py-0.5 text-[10px] font-black tracking-wider flex items-center gap-1.5 uppercase">
                  <span className="w-2 h-2 rounded-full bg-red-600 animate-ping inline-block" />
                  <span>{canvasSettings.overlayBadge || 'LIVE • BREAKING NEWS'}</span>
                </div>
              )}
              <div
                className={`px-3 py-1 font-['Impact',sans-serif] text-sm sm:text-base font-black tracking-wide uppercase ${
                  canvasSettings.frameStyle === 'breaking-news'
                    ? 'bg-red-600 text-white border-t border-amber-300'
                    : 'bg-black/85 text-white backdrop-blur-xs'
                }`}
              >
                {canvasSettings.frameTitle || 'DEVELOPING STORY'}
              </div>
              {canvasSettings.frameSubtitle && (
                <div className="bg-black/90 text-slate-300 text-[10px] px-3 py-0.5 font-sans font-medium">
                  {canvasSettings.frameSubtitle}
                </div>
              )}
            </div>
          )}

          {/* Creator Watermark Tag */}
          {canvasSettings.watermarkText && canvasSettings.watermarkText.trim().length > 0 && (
            <div
              className={`absolute z-25 pointer-events-none text-xs font-bold font-sans tracking-wide px-2 py-0.5 text-white/90 drop-shadow-md select-none ${
                canvasSettings.watermarkPosition === 'bottom-left'
                  ? 'bottom-2 left-2'
                  : canvasSettings.watermarkPosition === 'top-left'
                  ? 'top-2 left-2'
                  : canvasSettings.watermarkPosition === 'top-right'
                  ? 'top-2 right-2'
                  : 'bottom-2 right-2'
              }`}
              style={{ opacity: canvasSettings.watermarkOpacity ?? 0.7 }}
            >
              {canvasSettings.watermarkText.trim()}
            </div>
          )}

          {/* Render Text Layers */}
          {textLayers.map((layer) => {
            const isSelected = selectedLayerId === layer.id;
            let displayText = layer.text;
            if (layer.textCase === 'uppercase' || (layer.isUppercase && !layer.textCase)) {
              displayText = layer.text.toUpperCase();
            } else if (layer.textCase === 'lowercase') {
              displayText = layer.text.toLowerCase();
            } else if (layer.textCase === 'title') {
              displayText = layer.text.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.substring(1).toLowerCase());
            }

            let computedTextShadow = layer.shadowBlur && layer.shadowBlur > 0
              ? `0 2px ${layer.shadowBlur}px ${layer.shadowColor || 'rgba(0,0,0,0.85)'}`
              : layer.strokeWidth === 0
              ? '0 2px 8px rgba(0,0,0,0.85)'
              : undefined;

            if (layer.isGlow) {
              computedTextShadow = `0 0 14px ${layer.glowColor || '#06B6D4'}, 0 0 28px ${layer.glowColor || '#06B6D4'}`;
            } else if (layer.is3d) {
              computedTextShadow = '1px 1px 0 #000, 2px 2px 0 #000, 3px 3px 0 #000, 4px 4px 0 #000';
            }

            return (
              <div
                key={layer.id}
                onPointerDown={(e) => handlePointerDown(e, layer)}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-move group touch-none select-none transition-shadow ${
                  isSelected
                    ? 'ring-2 ring-blue-500/90 ring-offset-2 ring-offset-black/50 z-30'
                    : 'hover:ring-1 hover:ring-blue-400/50 z-20'
                }`}
                style={{
                  left: `${layer.xPercent}%`,
                  top: `${layer.yPercent}%`,
                  transform: `translate(-50%, -50%) rotate(${layer.rotation}deg)`,
                  maxWidth: '94%',
                }}
              >
                {/* Text Display */}
                <div
                  className="px-2 py-0.5 whitespace-pre-wrap break-words font-extrabold tracking-wide"
                  style={{
                    fontFamily: `${layer.fontFamily}, Impact, 'Space Grotesk', sans-serif`,
                    fontSize: `${layer.fontSize}px`,
                    fontWeight: layer.isBold ? 800 : 500,
                    fontStyle: layer.isItalic ? 'italic' : 'normal',
                    textAlign: layer.alignment,
                    color: layer.color,
                    opacity: layer.opacity ?? 1,
                    letterSpacing: layer.letterSpacing !== undefined ? `${layer.letterSpacing}px` : undefined,
                    lineHeight: layer.lineHeight || 1.15,
                    backgroundColor:
                      layer.backgroundColor && layer.backgroundColor !== 'transparent'
                        ? layer.backgroundColor
                        : undefined,
                    borderRadius:
                      layer.backgroundColor && layer.backgroundColor !== 'transparent'
                        ? '6px'
                        : undefined,
                    padding:
                      layer.backgroundColor && layer.backgroundColor !== 'transparent'
                        ? '3px 8px'
                        : undefined,
                    WebkitTextStroke:
                      layer.strokeWidth > 0
                        ? `${layer.strokeWidth}px ${layer.strokeColor}`
                        : undefined,
                    paintOrder: 'stroke fill',
                    textShadow: computedTextShadow,
                  }}
                >
                  {displayText || (
                    <span className="italic opacity-40 text-xs font-normal">
                      (Empty caption)
                    </span>
                  )}
                </div>

                {/* Selection Badges & Controls Overlay */}
                {isSelected && (
                  <>
                    {/* Top / Bottom floating mini quick-action toolbar */}
                    <div
                      className={`absolute ${layer.yPercent < 18 ? 'top-full mt-2' : '-top-10'} left-1/2 -translate-x-1/2 flex items-center flex-nowrap whitespace-nowrap gap-1 bg-[#071330]/95 border border-blue-500/40 rounded-full px-2 py-1 shadow-xl shadow-black/50 backdrop-blur-md pointer-events-auto z-30 shrink-0`}
                      onPointerDown={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          duplicateTextLayer(layer.id);
                        }}
                        title="Duplicate layer"
                        className="p-1 min-w-[26px] min-h-[26px] flex items-center justify-center rounded-full text-slate-300 hover:text-white hover:bg-white/15 active:scale-90 transition-all cursor-pointer shrink-0"
                        aria-label="Duplicate layer"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteTextLayer(layer.id);
                        }}
                        title="Delete layer"
                        className="p-1 min-w-[26px] min-h-[26px] flex items-center justify-center rounded-full text-rose-400 hover:text-rose-300 hover:bg-rose-500/20 active:scale-90 transition-all cursor-pointer shrink-0"
                        aria-label="Delete layer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <div className="w-[1px] h-3.5 bg-white/20 mx-0.5 shrink-0" />
                      <span className="text-[10px] text-cyan-300 font-mono font-semibold px-1 whitespace-nowrap shrink-0">
                        {Math.round(layer.xPercent)}%, {Math.round(layer.yPercent)}%
                      </span>
                    </div>

                    {/* Corner Handle Indicators */}
                    <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-blue-500 border border-white rounded-xs pointer-events-none" />
                    <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-blue-500 border border-white rounded-xs pointer-events-none" />
                    <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-blue-500 border border-white rounded-xs pointer-events-none" />
                    <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-blue-500 border border-white rounded-xs pointer-events-none" />
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Canvas Controls Overlay (Bottom Center) */}
      <nav
        aria-label="Canvas zoom and view controls"
        className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 z-40 bg-slate-900/90 backdrop-blur-xl border border-white/10 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-full shadow-2xl flex items-center flex-nowrap whitespace-nowrap gap-1 sm:gap-2 text-xs text-slate-300 shrink-0"
      >
        <button
          type="button"
          onClick={zoomOut}
          title="Zoom Out (Ctrl -)"
          className="p-1.5 min-w-[32px] min-h-[32px] flex items-center justify-center rounded-full hover:bg-white/15 hover:text-white hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-150 cursor-pointer disabled:opacity-40 disabled:pointer-events-none focus-visible:ring-2 focus-visible:ring-[#1463E9] focus-visible:outline-none"
          disabled={canvasSettings.zoom <= 0.3}
          aria-label="Zoom out"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={resetZoom}
          title="Reset Zoom to 100%"
          className="px-2 py-1 min-h-[32px] flex items-center justify-center rounded-lg hover:bg-white/15 text-[11px] font-mono font-semibold text-slate-200 hover:text-white hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-150 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#1463E9] focus-visible:outline-none"
          aria-label={`Current zoom ${Math.round(canvasSettings.zoom * 100)} percent. Click to reset to 100 percent.`}
        >
          {Math.round(canvasSettings.zoom * 100)}%
        </button>

        <button
          type="button"
          onClick={zoomIn}
          title="Zoom In (Ctrl +)"
          className="p-1.5 min-w-[32px] min-h-[32px] flex items-center justify-center rounded-full hover:bg-white/15 hover:text-white hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-150 cursor-pointer disabled:opacity-40 disabled:pointer-events-none focus-visible:ring-2 focus-visible:ring-[#1463E9] focus-visible:outline-none"
          disabled={canvasSettings.zoom >= 2.5}
          aria-label="Zoom in"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>

        <div className="w-[1px] h-4 bg-white/15 mx-0.5" />

        <button
          type="button"
          onClick={toggleFitToScreen}
          title={canvasSettings.fitToScreen ? 'Disable Fit to Screen' : 'Fit to Screen'}
          className={`p-1.5 min-w-[32px] min-h-[32px] flex items-center justify-center rounded-full hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-150 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#1463E9] focus-visible:outline-none ${
            canvasSettings.fitToScreen
              ? 'bg-[#1463E9] text-white shadow-2xs'
              : 'hover:bg-white/15 hover:text-white'
          }`}
          aria-label="Toggle fit to screen"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={toggleGrid}
          title={canvasSettings.showGrid ? 'Hide Dot Grid' : 'Show Dot Grid'}
          className={`p-1.5 min-w-[32px] min-h-[32px] flex items-center justify-center rounded-full hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-150 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#1463E9] focus-visible:outline-none ${
            canvasSettings.showGrid
              ? 'bg-[#1463E9] text-white shadow-2xs'
              : 'hover:bg-white/15 hover:text-white'
          }`}
          aria-label="Toggle workspace grid"
        >
          <Grid className="w-3.5 h-3.5" />
        </button>

        <div className="w-[1px] h-4 bg-white/15 mx-0.5" />

        {/* Flip Horizontal */}
        <button
          type="button"
          onClick={toggleFlipHorizontal}
          title="Flip Image Horizontal"
          className={`p-1.5 min-w-[32px] min-h-[32px] flex items-center justify-center rounded-full hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-150 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#1463E9] focus-visible:outline-none ${
            canvasSettings.flipHorizontal
              ? 'bg-[#1463E9] text-white shadow-2xs'
              : 'hover:bg-white/15 hover:text-white'
          }`}
          aria-label="Flip image horizontally"
        >
          <FlipHorizontal className="w-3.5 h-3.5" />
        </button>

        {/* Flip Vertical */}
        <button
          type="button"
          onClick={toggleFlipVertical}
          title="Flip Image Vertical"
          className={`p-1.5 min-w-[32px] min-h-[32px] flex items-center justify-center rounded-full hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-150 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#1463E9] focus-visible:outline-none ${
            canvasSettings.flipVertical
              ? 'bg-[#1463E9] text-white shadow-2xs'
              : 'hover:bg-white/15 hover:text-white'
          }`}
          aria-label="Flip image vertically"
        >
          <FlipVertical className="w-3.5 h-3.5" />
        </button>

        {/* Freehand Doodle Mode Toggle */}
        <button
          type="button"
          onClick={() => setIsDrawingMode(!isDrawingMode)}
          title={isDrawingMode ? 'Exit Drawing Mode' : 'Draw / Doodle on Canvas'}
          className={`p-1.5 min-w-[32px] min-h-[32px] flex items-center justify-center rounded-full hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-150 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#1463E9] focus-visible:outline-none ${
            isDrawingMode
              ? 'bg-amber-500 text-slate-950 shadow-md ring-2 ring-amber-400/50'
              : 'hover:bg-white/15 hover:text-white'
          }`}
          aria-label="Toggle drawing mode"
        >
          <PenTool className="w-3.5 h-3.5" />
        </button>
      </nav>
    </div>
  );
};
