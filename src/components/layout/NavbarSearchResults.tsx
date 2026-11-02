import React, { useEffect, useRef, useMemo } from 'react';
import { Search, Edit3, ArrowRight, ImageOff } from 'lucide-react';
import { POPULAR_TEMPLATES } from '../../constants/templates';
import type { MemeTemplate } from '../../types/template';
import { formatCompactNumber } from '../../lib/utils';

export interface NavbarSearchResultsProps {
  query: string;
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: MemeTemplate) => void;
  onViewAll: () => void;
  onSearchCommunity?: () => void;
}

export const NavbarSearchResults: React.FC<NavbarSearchResultsProps> = ({
  query,
  isOpen,
  onClose,
  onSelectTemplate,
  onViewAll,
  onSearchCommunity,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const trimmed = query.trim().toLowerCase();

  const matchingTemplates = useMemo(() => {
    if (!trimmed) return [];
    return POPULAR_TEMPLATES.filter((t) => {
      return (
        t.name.toLowerCase().includes(trimmed) ||
        t.category.toLowerCase().includes(trimmed) ||
        t.tags.some((tag) => tag.toLowerCase().includes(trimmed)) ||
        t.description.toLowerCase().includes(trimmed)
      );
    }).slice(0, 5);
  }, [trimmed]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !trimmed) return null;

  return (
    <>
      {/* Invisible backdrop to detect outside clicks cleanly */}
      <div
        className="fixed inset-0 z-40 bg-transparent"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={containerRef}
        role="listbox"
        aria-label="Search suggestions"
        className="absolute left-0 right-0 top-full mt-2 w-full min-w-[280px] sm:min-w-[340px] max-w-md rounded-2xl bg-[#071330]/95 backdrop-blur-2xl border border-white/15 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.7)] p-2.5 z-50 text-slate-200 animate-in fade-in zoom-in-95 duration-150"
      >
        <div className="flex items-center justify-between px-2 py-1.5 border-b border-white/10 text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
          <span>Templates matching &ldquo;{query}&rdquo;</span>
          <span>{matchingTemplates.length} found</span>
        </div>

        <div className="py-1 space-y-1 max-h-[300px] overflow-y-auto pr-0.5">
          {matchingTemplates.length > 0 ? (
            matchingTemplates.map((template) => (
              <div
                key={template.id}
                role="option"
                tabIndex={0}
                aria-selected="false"
                onClick={() => {
                  onSelectTemplate(template);
                  onClose();
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectTemplate(template);
                    onClose();
                  }
                }}
                className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-white/10 transition-colors cursor-pointer group text-left"
              >
                {/* Thumbnail */}
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-800 border border-white/10 shrink-0 flex items-center justify-center">
                  <img
                    src={template.imageUrl}
                    alt={template.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  <ImageOff className="w-4 h-4 text-slate-500 hidden" />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-white truncate group-hover:text-cyan-300 transition-colors">
                    {template.name}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-400">
                    <span className="capitalize px-1.5 py-0.2 rounded bg-white/5 border border-white/10 text-cyan-400">
                      {template.category}
                    </span>
                    <span>{template.boxCount} boxes</span>
                    <span>• {formatCompactNumber(template.usageCount)} used</span>
                  </div>
                </div>

                {/* Action Icon */}
                <span className="text-xs text-slate-400 group-hover:text-cyan-300 group-hover:translate-x-0.5 transition-all shrink-0">
                  <Edit3 className="w-3.5 h-3.5" />
                </span>
              </div>
            ))
          ) : (
            <div className="py-6 text-center space-y-2 text-slate-400">
              <Search className="w-7 h-7 mx-auto text-slate-500" />
              <p className="text-xs font-semibold text-slate-200">
                No templates found for &ldquo;{query}&rdquo;
              </p>
              <p className="text-[11px] text-slate-400">
                Try searching by character, keyword, or mood.
              </p>
              {onSearchCommunity && (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      onSearchCommunity();
                      onClose();
                    }}
                    className="text-xs font-semibold text-blue-400 hover:text-blue-300 underline cursor-pointer active:scale-95 transition-all duration-150"
                  >
                    Search in Community Memes &rarr;
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-2 mt-1 border-t border-white/10 px-1 flex items-center justify-between text-[11px]">
          <button
            type="button"
            onClick={() => {
              onViewAll();
              onClose();
            }}
            className="font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer active:scale-95 transition-all duration-150"
          >
            <span>View all in template gallery</span>
            <ArrowRight className="w-3 h-3" />
          </button>

          <span className="text-[10px] text-slate-400">Press Enter</span>
        </div>
      </div>
    </>
  );
};

export default NavbarSearchResults;
