import React, { useState, useMemo } from 'react';
import { X, Search, Check, Layers } from 'lucide-react';
import { POPULAR_TEMPLATES, TEMPLATE_CATEGORIES } from '../../constants/templates';
import type { MemeTemplate } from '../../types/template';
import { useEditorStore } from '../../stores/useEditorStore';
import { useTemplateStore } from '../../stores/useTemplateStore';
import { formatCompactNumber } from '../../lib/utils';

export const TemplatePickerModal: React.FC = () => {
  const isTemplatePickerOpen = useEditorStore((state) => state.isTemplatePickerOpen);
  const setIsTemplatePickerOpen = useEditorStore((state) => state.setIsTemplatePickerOpen);
  const activeTemplate = useEditorStore((state) => state.activeTemplate);
  const loadTemplate = useEditorStore((state) => state.loadTemplate);

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('All');
  const [preserveCaptions, setPreserveCaptions] = useState(false);

  const filtered = useMemo(() => {
    let list = [...POPULAR_TEMPLATES];
    if (category !== 'All') {
      const catLower = category.toLowerCase();
      list = list.filter(
        (t) =>
          t.category.toLowerCase() === catLower ||
          t.tags.some((tag) => tag.toLowerCase() === catLower)
      );
    }
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }
    return list;
  }, [category, search]);

  if (!isTemplatePickerOpen) return null;

  const handleSelectTemplate = (template: MemeTemplate) => {
    loadTemplate(template, preserveCaptions);
    useTemplateStore.getState().setSelectedTemplate(template);
    setIsTemplatePickerOpen(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={() => setIsTemplatePickerOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-labelledby="template-picker-title"
    >
      <div
        className="w-full max-w-3xl max-h-[92dvh] max-h-[92vh] bg-[#071330] border border-white/15 rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 shadow-2xl text-white flex flex-col space-y-3.5 sm:space-y-4 animate-in zoom-in-95 duration-150 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2 min-w-0 pr-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-cyan-400 shrink-0">
              <Layers className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h2 id="template-picker-title" className="text-sm sm:text-lg font-bold text-white truncate">
                Choose Meme Template
              </h2>
              <p className="text-[10px] sm:text-[11px] text-slate-400 truncate">
                Select any meme base to load into the studio canvas.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsTemplatePickerOpen(false)}
            className="min-w-[38px] min-h-[38px] flex items-center justify-center rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all duration-150 active:scale-95 cursor-pointer shrink-0"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Preserve Captions Toggle */}
        <div className="space-y-2.5 shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search templates (e.g. Drake, Shinchan)..."
                className="w-full bg-slate-900 text-white placeholder:text-slate-500 rounded-xl border border-white/15 pl-9 pr-3 py-2 text-base sm:text-xs focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Checkbox: Keep current text */}
            <label className="flex items-center gap-2 text-xs text-slate-300 font-medium cursor-pointer select-none py-1">
              <input
                type="checkbox"
                checked={preserveCaptions}
                onChange={(e) => setPreserveCaptions(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 bg-slate-900 border-white/20 cursor-pointer"
              />
              <span>Keep current captions</span>
            </label>
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none touch-scroll-x text-xs">
            {TEMPLATE_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`px-3 py-1 rounded-full font-medium whitespace-nowrap transition-all duration-150 cursor-pointer min-h-[32px] flex items-center hover:-translate-y-0.5 active:scale-95 focus-visible:ring-2 focus-visible:ring-[#1463E9] focus-visible:outline-none ${
                  category === cat
                    ? 'bg-[#1463E9] text-white shadow-xs'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Template Grid */}
        <div className="flex-1 overflow-y-auto pr-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2">
          {filtered.map((t) => {
            const isCurrent = activeTemplate?.id === t.id;
            return (
              <div
                key={t.id}
                onClick={() => handleSelectTemplate(t)}
                className={`group cursor-pointer rounded-xl border p-2 flex flex-col justify-between gap-1.5 transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] ${
                  isCurrent
                    ? 'bg-blue-600/20 border-blue-500 ring-2 ring-blue-500/40'
                    : 'bg-slate-900/60 border-white/10 hover:border-white/25 hover:bg-slate-900'
                }`}
              >
                <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-slate-950 flex items-center justify-center">
                  <img
                    src={t.imageUrl}
                    alt={t.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    loading="lazy"
                  />
                  {isCurrent && (
                    <span className="absolute top-1 right-1 bg-blue-600 text-white p-1 rounded-md shadow-md">
                      <Check className="w-3 h-3" />
                    </span>
                  )}
                  <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-950/80 text-white">
                    {t.boxCount} {t.boxCount === 1 ? 'box' : 'boxes'}
                  </span>
                </div>

                <div className="pt-0.5">
                  <h4 className="text-xs font-bold text-white truncate group-hover:text-cyan-300 transition-colors">
                    {t.name}
                  </h4>
                  <p className="text-[10px] text-slate-400 capitalize">
                    {formatCompactNumber(t.usageCount)} uses
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
