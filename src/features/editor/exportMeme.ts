import type { TextLayer, CanvasSettings } from '../../types/editor';
import type { MemeTemplate } from '../../types/template';

export interface ExportMemeOptions {
  template: MemeTemplate;
  textLayers: TextLayer[];
  title: string;
  previewWidth?: number;
  previewHeight?: number;
  format?: 'png' | 'jpeg';
  quality?: number; // 0.1 to 1.0 (for JPEG)
  canvasSettings?: CanvasSettings;
}

export interface ExportResult {
  success: boolean;
  error?: string;
}

/**
 * Splits text into wrapped lines if it exceeds maxWidth
 */
function wrapLines(
  ctx: CanvasRenderingContext2D,
  rawText: string,
  maxWidth: number
): string[] {
  const paragraphs = rawText.split('\n');
  const result: string[] = [];

  for (const paragraph of paragraphs) {
    if (!paragraph) {
      result.push('');
      continue;
    }

    const words = paragraph.split(' ');
    let currentLine = '';

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const metrics = ctx.measureText(testLine);

      if (metrics.width > maxWidth && currentLine) {
        result.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }

    if (currentLine) {
      result.push(currentLine);
    }
  }

  return result.length > 0 ? result : [''];
}

/**
 * Loads an image with crossOrigin = 'anonymous', with fallback if CORS fails
 */
function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => resolve(img);
    img.onerror = () => {
      // Retry without anonymous if it was a same-origin or local path
      const fallbackImg = new Image();
      fallbackImg.onload = () => resolve(fallbackImg);
      fallbackImg.onerror = () => reject(new Error(`Failed to load image from: ${url}`));
      fallbackImg.src = url;
    };

    img.src = url;
  });
}

/**
 * Renders the meme onto an HTML5 Canvas and returns the canvas element
 */
export async function renderMemeCanvas(options: ExportMemeOptions): Promise<HTMLCanvasElement> {
  const { template, textLayers, previewWidth, canvasSettings } = options;
  const img = await loadImage(template.imageUrl);

  const canvas = document.createElement('canvas');
  const width = img.naturalWidth || template.width || 1200;
  const height = img.naturalHeight || template.height || 1200;

  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Could not initialize 2D canvas context');
  }

  // 1. Draw base meme template with filters & flip
  ctx.save();
  if (canvasSettings) {
    const rawBrightness = canvasSettings.brightness ?? 100;
    const exposure = canvasSettings.exposure ?? 0;
    const highlights = canvasSettings.highlights ?? 0;
    const shadows = canvasSettings.shadows ?? 0;
    const tint = canvasSettings.tint ?? 0;
    const clarity = canvasSettings.clarity ?? 0;

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

    const sep = canvasSettings.sepia ?? 0;
    const inv = canvasSettings.invert ?? 0;
    const bl = canvasSettings.blur ?? 0;

    ctx.filter = `brightness(${effBrightness}%) contrast(${effContrast}%) saturate(${effSaturation}%) sepia(${sep}%) invert(${inv}%) blur(${bl}px) hue-rotate(${effHueRotate}deg)`;

    const flipH = Boolean(canvasSettings.flipHorizontal);
    const flipV = Boolean(canvasSettings.flipVertical);
    if (flipH || flipV) {
      ctx.translate(flipH ? width : 0, flipV ? height : 0);
      ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
    }
  }

  ctx.drawImage(img, 0, 0, width, height);
  ctx.restore();
  ctx.filter = 'none';

  // Snapseed Warmth tint overlay in export
  const warmth = canvasSettings?.warmth ?? 0;
  if (warmth !== 0) {
    ctx.save();
    ctx.globalCompositeOperation = 'soft-light';
    ctx.fillStyle = warmth > 0 ? '#F59E0B' : '#06B6D4';
    ctx.globalAlpha = (Math.min(100, Math.abs(warmth)) / 100) * 0.35;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
  }

  // Snapseed Magenta/Green tint overlay in export
  const tintVal = canvasSettings?.tint ?? 0;
  if (tintVal !== 0) {
    ctx.save();
    ctx.globalCompositeOperation = 'soft-light';
    ctx.fillStyle = tintVal > 0 ? '#D946EF' : '#22C55E';
    ctx.globalAlpha = (Math.min(100, Math.abs(tintVal)) / 100) * 0.25;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
  }

  // Snapseed Vignette radial gradient overlay in export
  const vignette = canvasSettings?.vignette ?? 0;
  if (vignette > 0) {
    ctx.save();
    const radius = Math.max(width, height) * 0.72;
    const grad = ctx.createRadialGradient(
      width / 2,
      height / 2,
      radius * 0.35,
      width / 2,
      height / 2,
      radius
    );
    grad.addColorStop(0, 'rgba(0, 0, 0, 0)');
    grad.addColorStop(1, `rgba(0, 0, 0, ${(vignette / 100) * 0.85})`);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
  }

  // 2. Scale factor from preview coordinate space to export canvas
  const referenceWidth = previewWidth && previewWidth > 0 ? previewWidth : 600;
  const scale = width / referenceWidth;

  // 3. Render Freehand Doodles
  if (canvasSettings?.doodles && canvasSettings.doodles.length > 0) {
    for (const stroke of canvasSettings.doodles) {
      if (stroke.points.length < 2) continue;
      ctx.save();
      ctx.beginPath();
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = Math.max(2, stroke.size * scale);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      if (stroke.isHighlighter) {
        ctx.globalAlpha = 0.45;
      }
      const firstPt = stroke.points[0];
      ctx.moveTo((firstPt.x / 100) * width, (firstPt.y / 100) * height);
      for (let i = 1; i < stroke.points.length; i++) {
        const pt = stroke.points[i];
        ctx.lineTo((pt.x / 100) * width, (pt.y / 100) * height);
      }
      ctx.stroke();
      ctx.restore();
    }
  }

  // 4. Ensure loaded web fonts are ready before drawing
  if (typeof document !== 'undefined' && document.fonts) {
    try {
      await document.fonts.ready;
    } catch {
      // Fallback gracefully if fonts.ready fails
    }
  }

  // 5. Render all visible text layers
  for (const layer of textLayers) {
    if (!layer.text.trim()) continue;

    const scaledFontSize = Math.max(12, Math.round(layer.fontSize * scale));
    const scaledStrokeWidth = Math.max(0, Math.round(layer.strokeWidth * scale));

    const fontStyle = layer.isItalic ? 'italic' : 'normal';
    const fontWeight = layer.isBold ? 'bold' : 'normal';
    ctx.font = `${fontStyle} ${fontWeight} ${scaledFontSize}px ${layer.fontFamily}, "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", Impact, sans-serif`;

    let displayText = layer.text;
    if (layer.textCase === 'uppercase' || (layer.isUppercase && !layer.textCase)) {
      displayText = layer.text.toUpperCase();
    } else if (layer.textCase === 'lowercase') {
      displayText = layer.text.toLowerCase();
    } else if (layer.textCase === 'title') {
      displayText = layer.text.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.substring(1).toLowerCase());
    }

    const maxLineWidth = width * 0.92;
    const lines = wrapLines(ctx, displayText, maxLineWidth);

    const lineHeight = scaledFontSize * 1.15;
    const totalTextHeight = lines.length * lineHeight;

    const posX = (layer.xPercent / 100) * width;
    const posY = (layer.yPercent / 100) * height;

    ctx.save();
    ctx.translate(posX, posY);

    if (layer.rotation) {
      ctx.rotate((layer.rotation * Math.PI) / 180);
    }

    ctx.globalAlpha = Math.max(0, Math.min(1, layer.opacity ?? 1));
    ctx.textBaseline = 'middle';
    ctx.lineWidth = scaledStrokeWidth;
    ctx.strokeStyle = layer.strokeColor;
    ctx.fillStyle = layer.color;
    ctx.lineJoin = 'round';
    ctx.miterLimit = 2;

    // Apply text shadow or neon glow if configured
    if (layer.isGlow) {
      ctx.shadowColor = layer.glowColor || '#06B6D4';
      ctx.shadowBlur = 18 * scale;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
    } else if (layer.shadowBlur && layer.shadowBlur > 0) {
      ctx.shadowColor = layer.shadowColor || 'rgba(0, 0, 0, 0.85)';
      ctx.shadowBlur = layer.shadowBlur * scale;
      ctx.shadowOffsetX = (layer.shadowOffsetX ?? 0) * scale;
      ctx.shadowOffsetY = (layer.shadowOffsetY ?? 2) * scale;
    } else {
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
    }

    // Calculate widest line to anchor alignment consistently within the centered block
    let maxBlockWidth = 0;
    for (const line of lines) {
      const measured = ctx.measureText(line).width;
      if (measured > maxBlockWidth) {
        maxBlockWidth = measured;
      }
    }

    ctx.textAlign = layer.alignment;
    let lineAnchorX = 0;
    if (layer.alignment === 'left') {
      lineAnchorX = -maxBlockWidth / 2;
    } else if (layer.alignment === 'right') {
      lineAnchorX = maxBlockWidth / 2;
    }

    // Vertical offset so multiple lines center on posY
    const startOffsetY = -((totalTextHeight - lineHeight) / 2);

    // Draw background highlight box if configured
    if (layer.backgroundColor && layer.backgroundColor !== 'transparent') {
      const padX = 10 * scale;
      const padY = 6 * scale;
      let bgX = -maxBlockWidth / 2 - padX;
      if (layer.alignment === 'left') {
        bgX = lineAnchorX - padX;
      } else if (layer.alignment === 'right') {
        bgX = lineAnchorX - maxBlockWidth - padX;
      }
      ctx.save();
      ctx.fillStyle = layer.backgroundColor;
      ctx.shadowColor = 'transparent';
      ctx.fillRect(bgX, startOffsetY - lineHeight / 2, maxBlockWidth + padX * 2, totalTextHeight + padY);
      ctx.restore();
    }

    // 3D pop extrusion layers
    if (layer.is3d) {
      ctx.save();
      ctx.fillStyle = '#000000';
      ctx.shadowColor = 'transparent';
      for (let offset = 4 * scale; offset >= 1 * scale; offset -= 1 * scale) {
        for (let i = 0; i < lines.length; i++) {
          ctx.fillText(lines[i], lineAnchorX + offset, startOffsetY + i * lineHeight + offset);
        }
      }
      ctx.restore();
    }

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lineOffsetY = startOffsetY + i * lineHeight;

      if (scaledStrokeWidth > 0) {
        ctx.strokeText(line, lineAnchorX, lineOffsetY);
      }
      ctx.fillText(line, lineAnchorX, lineOffsetY);
    }

    ctx.restore();
  }

  // 6. Render Frames (Header banner, Breaking News, Overlay badges, Borders)
  if (canvasSettings) {
    // Header Banner
    if (canvasSettings.headerBannerText) {
      ctx.save();
      const bannerHeight = Math.max(32, Math.round(36 * scale));
      ctx.fillStyle = canvasSettings.headerBannerBg || '#000000';
      ctx.fillRect(0, 0, width, bannerHeight);

      ctx.fillStyle = canvasSettings.headerBannerColor || '#FFFFFF';
      ctx.font = `bold ${Math.max(12, Math.round(14 * scale))}px 'Plus Jakarta Sans', sans-serif`;
      ctx.textBaseline = 'middle';
      ctx.fillText(canvasSettings.headerBannerText, 16 * scale, bannerHeight / 2);

      if (canvasSettings.overlayBadge) {
        const badgeText = canvasSettings.overlayBadge;
        ctx.font = `bold ${Math.max(10, Math.round(11 * scale))}px 'Arial Black', sans-serif`;
        const badgeW = ctx.measureText(badgeText).width + 12 * scale;
        const badgeH = 20 * scale;
        const badgeX = width - badgeW - 16 * scale;
        const badgeY = (bannerHeight - badgeH) / 2;

        ctx.fillStyle = canvasSettings.overlayBadgeBg || '#DC2626';
        ctx.fillRect(badgeX, badgeY, badgeW, badgeH);

        ctx.fillStyle = canvasSettings.overlayBadgeColor || '#FFFFFF';
        ctx.textAlign = 'center';
        ctx.fillText(badgeText, badgeX + badgeW / 2, bannerHeight / 2);
      }
      ctx.restore();
    } else if (canvasSettings.overlayBadge) {
      // Standalone badge
      ctx.save();
      const badgeText = canvasSettings.overlayBadge;
      ctx.font = `bold ${Math.max(11, Math.round(12 * scale))}px 'Arial Black', sans-serif`;
      const badgeW = ctx.measureText(badgeText).width + 16 * scale;
      const badgeH = 24 * scale;
      const badgeX = 16 * scale;
      const badgeY = 16 * scale;

      ctx.fillStyle = canvasSettings.overlayBadgeBg || '#DC2626';
      ctx.fillRect(badgeX, badgeY, badgeW, badgeH);

      ctx.fillStyle = canvasSettings.overlayBadgeColor || '#FFFFFF';
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';
      ctx.fillText(badgeText, badgeX + badgeW / 2, badgeY + badgeH / 2);
      ctx.restore();
    }

    // Footer / Breaking News Banner
    if (
      canvasSettings.frameStyle === 'breaking-news' ||
      (canvasSettings.frameTitle && canvasSettings.frameTitle.trim().length > 0)
    ) {
      ctx.save();
      const bannerHeight = Math.max(50, Math.round(height * 0.12));

      if (canvasSettings.frameStyle === 'breaking-news') {
        ctx.fillStyle = '#DC2626'; // Red banner
        ctx.fillRect(0, height - bannerHeight, width, bannerHeight);

        // Yellow LIVE ticker bar
        const tickerHeight = Math.max(20, Math.round(bannerHeight * 0.38));
        ctx.fillStyle = '#FACC15';
        ctx.fillRect(0, height - bannerHeight - tickerHeight, width, tickerHeight);

        // Red dot indicator
        const dotY = height - bannerHeight - tickerHeight / 2;
        ctx.fillStyle = '#DC2626';
        ctx.beginPath();
        ctx.arc(22 * scale, dotY, 4 * scale, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#000000';
        ctx.font = `bold ${Math.round(tickerHeight * 0.75)}px 'Arial Black', sans-serif`;
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'left';
        ctx.fillText(canvasSettings.overlayBadge || 'LIVE • BREAKING NEWS', 32 * scale, dotY);

        ctx.fillStyle = '#FFFFFF';
        ctx.font = `bold ${Math.round(bannerHeight * 0.45)}px Impact, sans-serif`;
        ctx.fillText(canvasSettings.frameTitle || 'DEVELOPING STORY', 20 * scale, height - bannerHeight / 2);
      } else {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
        ctx.fillRect(0, height - bannerHeight, width, bannerHeight);

        ctx.fillStyle = '#FFFFFF';
        ctx.font = `bold ${Math.round(bannerHeight * 0.42)}px Impact, sans-serif`;
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'left';
        ctx.fillText(canvasSettings.frameTitle || '', 20 * scale, height - bannerHeight / 2);
      }

      ctx.restore();
    }

    // Border if set
    if (canvasSettings.borderWidth && canvasSettings.borderWidth > 0 && canvasSettings.borderColor) {
      ctx.save();
      ctx.strokeStyle = canvasSettings.borderColor;
      ctx.lineWidth = canvasSettings.borderWidth * scale;
      ctx.strokeRect(0, 0, width, height);
      ctx.restore();
    }
  }

  // 7. Render Creator Watermark if set
  if (canvasSettings?.watermarkText && canvasSettings.watermarkText.trim().length > 0) {
    ctx.save();
    ctx.globalAlpha = Math.max(0.1, Math.min(1, canvasSettings.watermarkOpacity ?? 0.7));
    ctx.font = `bold ${Math.max(14, Math.round(18 * scale))}px 'Plus Jakarta Sans', sans-serif`;
    ctx.fillStyle = '#FFFFFF';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    ctx.shadowBlur = 4 * scale;

    const pad = 16 * scale;
    const wmText = canvasSettings.watermarkText.trim();
    const textWidth = ctx.measureText(wmText).width;

    let wmX = width - textWidth - pad;
    let wmY = height - pad;
    if (canvasSettings.watermarkPosition === 'bottom-left') {
      wmX = pad;
      wmY = height - pad;
    } else if (canvasSettings.watermarkPosition === 'top-left') {
      wmX = pad;
      wmY = pad + 18 * scale;
    } else if (canvasSettings.watermarkPosition === 'top-right') {
      wmX = width - textWidth - pad;
      wmY = pad + 18 * scale;
    }

    ctx.fillText(wmText, wmX, wmY);
    ctx.restore();
  }

  return canvas;
}

/**
 * Exports the meme to a PNG or JPEG file and triggers browser download
 */
export async function exportMemeAsFormat(
  options: ExportMemeOptions,
  format: 'png' | 'jpeg' = 'png',
  quality: number = 0.95
): Promise<ExportResult> {
  const { template, title } = options;

  try {
    const canvas = await renderMemeCanvas(options);
    const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';
    const extension = format === 'jpeg' ? 'jpg' : 'png';

    return new Promise((resolve) => {
      try {
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve({
                success: false,
                error: 'Canvas export produced an empty image. Browser security may have blocked external image data.',
              });
              return;
            }

            const downloadUrl = URL.createObjectURL(blob);
            const link = document.createElement('a');
            const sanitizedTitle = (title || template.name || 'meme')
              .toLowerCase()
              .replace(/[^a-z0-9_-]/g, '-')
              .replace(/-+/g, '-');

            link.href = downloadUrl;
            link.download = `${sanitizedTitle}.${extension}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            setTimeout(() => URL.revokeObjectURL(downloadUrl), 2000);
            resolve({ success: true });
          },
          mimeType,
          quality
        );
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Unknown canvas export error';
        resolve({
          success: false,
          error: `Export failed due to browser canvas security (CORS): ${message}. Try using a local template.`,
        });
      }
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Image loading error';
    return {
      success: false,
      error: `Failed to export meme: ${message}`,
    };
  }
}

/**
 * Legacy wrapper: exports meme to PNG
 */
export async function exportMemeAsPng(options: ExportMemeOptions): Promise<ExportResult> {
  return exportMemeAsFormat(options, 'png', 1.0);
}

/**
 * Copies the meme canvas image directly to the system clipboard
 */
export async function copyMemeToClipboard(options: ExportMemeOptions): Promise<ExportResult> {
  try {
    if (!navigator.clipboard || typeof ClipboardItem === 'undefined') {
      return {
        success: false,
        error: 'Clipboard image copying is not supported on this browser or requires HTTPS.',
      };
    }

    const canvas = await renderMemeCanvas(options);

    return new Promise((resolve) => {
      canvas.toBlob(async (blob) => {
        if (!blob) {
          resolve({ success: false, error: 'Could not generate image for clipboard.' });
          return;
        }

        try {
          const item = new ClipboardItem({ 'image/png': blob });
          await navigator.clipboard.write([item]);
          resolve({ success: true });
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : 'Clipboard write permission denied';
          resolve({
            success: false,
            error: `Failed to copy to clipboard: ${msg}`,
          });
        }
      }, 'image/png');
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown clipboard error';
    return { success: false, error: msg };
  }
}

/**
 * Shares the meme image using the Web Share API if supported
 */
export async function shareMemeViaWebShare(options: ExportMemeOptions): Promise<ExportResult> {
  try {
    const canvas = await renderMemeCanvas(options);
    const sanitizedTitle = (options.title || options.template.name || 'Meme')
      .replace(/[^a-zA-Z0-9 ]/g, '')
      .trim();

    return new Promise((resolve) => {
      canvas.toBlob(async (blob) => {
        if (!blob) {
          resolve({ success: false, error: 'Could not generate meme image for sharing.' });
          return;
        }

        const file = new File([blob], `${sanitizedTitle || 'meme'}.png`, { type: 'image/png' });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              title: sanitizedTitle,
              text: `Check out this meme made on MemeHub: ${sanitizedTitle}`,
              files: [file],
            });
            resolve({ success: true });
          } catch (shareErr: unknown) {
            if (shareErr instanceof Error && shareErr.name === 'AbortError') {
              resolve({ success: true }); // User dismissed share dialog
            } else {
              resolve({
                success: false,
                error: 'Native sharing was cancelled or unavailable.',
              });
            }
          }
        } else {
          resolve({
            success: false,
            error: 'Native image sharing is not supported by your current browser or device.',
          });
        }
      }, 'image/png');
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Share error';
    return { success: false, error: msg };
  }
}
