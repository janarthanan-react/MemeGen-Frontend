import React, { useState } from 'react';
import { Edit3, ImageOff } from 'lucide-react';
import type { MemeTemplate } from '../../types/template';
import { useTemplateStore } from '../../stores/useTemplateStore';
import { formatCompactNumber } from '../../lib/utils';

export interface TemplateCardProps {
  template: MemeTemplate;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({ template }) => {
  const [imageError, setImageError] = useState(false);
  const setSelectedTemplate = useTemplateStore((state) => state.setSelectedTemplate);
  const openPreview = useTemplateStore((state) => state.openPreview);
  const selectedTemplate = useTemplateStore((state) => state.selectedTemplate);

  const isSelected = selectedTemplate?.id === template.id;

  const handleClick = () => {
    setSelectedTemplate(template);
    openPreview(template);
  };

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      aria-label={`Preview template ${template.name}`}
      className={`group cursor-pointer flex flex-col bg-white rounded-2xl border transition-all duration-200 overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1463E9] focus-visible:ring-offset-2 select-none ${
        isSelected
          ? 'border-[#1463E9] ring-2 ring-blue-600/30 shadow-lg -translate-y-1'
          : 'border-slate-200/90 hover:border-blue-400 hover:shadow-lg hover:-translate-y-1 active:scale-[0.98]'
      }`}
    >
      {/* Thumbnail Aspect Container */}
      <div className="relative aspect-[16/11] w-full bg-slate-100 overflow-hidden flex items-center justify-center">
        {!imageError ? (
          <img
            src={template.imageUrl}
            alt={template.name}
            loading="lazy"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-4 text-center text-slate-400 bg-slate-50 w-full h-full">
            <ImageOff className="w-6 h-6 text-slate-300 mb-1" />
            <span className="text-[11px] font-semibold text-slate-500 line-clamp-1">{template.name}</span>
            <span className="text-[9px] text-slate-400">Image unavailable</span>
          </div>
        )}

        {/* Quick action overlay on hover */}
        <div className="absolute inset-0 bg-blue-950/35 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2 backdrop-blur-2xs">
          <span className="bg-white text-blue-600 text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-1.5 transform translate-y-1 group-hover:translate-y-0 transition-transform duration-200">
            <Edit3 className="w-3.5 h-3.5" />
            Preview & Use
          </span>
        </div>

        {/* Box Count / Text slots badge */}
        <div className="absolute bottom-2 left-2 pointer-events-none">
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-900/75 text-white backdrop-blur-xs">
            {template.boxCount} {template.boxCount === 1 ? 'box' : 'boxes'}
          </span>
        </div>
      </div>

      {/* Title & Metadata */}
      <div className="p-2 sm:p-2.5 flex flex-col justify-between gap-1 bg-white flex-1 min-w-0">
        <div className="flex items-start justify-between gap-1 min-w-0">
          <h3
            className="font-semibold text-slate-900 text-xs sm:text-[13px] truncate min-w-0 flex-1 group-hover:text-blue-600 transition-colors"
            title={template.name}
          >
            {template.name}
          </h3>
          {isSelected && <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0 mt-1" />}
        </div>

        <div className="flex items-center justify-between gap-1 text-[11px] text-slate-400 pt-0.5 min-w-0">
          <span className="capitalize font-medium text-slate-500 truncate min-w-0">
            {template.category}
          </span>
          <span className="text-[10px] font-mono text-slate-400 shrink-0">
            {formatCompactNumber(template.usageCount)}
          </span>
        </div>
      </div>
    </article>
  );
};
