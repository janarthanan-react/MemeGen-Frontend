import React from 'react';
import {
  Coffee,
  GraduationCap,
  Briefcase,
  HeartHandshake,
  Smile,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import type { AiCategory, AiPromptIdea } from '../../types/ai';
import { AI_CATEGORY_LABELS, EXAMPLE_PROMPT_IDEAS } from './data/aiPresets';

export interface AiIdeaSelectorProps {
  selectedCategory: AiCategory | 'all';
  onSelectCategory: (category: AiCategory | 'all') => void;
  onSelectIdea: (idea: AiPromptIdea) => void;
}

const CATEGORY_ICONS: Record<AiCategory, React.ComponentType<{ className?: string }>> = {
  everyday: Coffee,
  student: GraduationCap,
  work: Briefcase,
  relationships: HeartHandshake,
  'tamil-humor': Smile,
};

export const AiIdeaSelector: React.FC<AiIdeaSelectorProps> = ({
  selectedCategory,
  onSelectCategory,
  onSelectIdea,
}) => {
  const filteredIdeas =
    selectedCategory === 'all'
      ? EXAMPLE_PROMPT_IDEAS
      : EXAMPLE_PROMPT_IDEAS.filter((i) => i.category === selectedCategory);

  const categories: Array<{ id: AiCategory | 'all'; label: string }> = [
    { id: 'all', label: 'All Ideas' },
    { id: 'everyday', label: 'Everyday Life' },
    { id: 'student', label: 'Student Life' },
    { id: 'work', label: 'Work & Office' },
    { id: 'relationships', label: 'Relationships' },
    { id: 'tamil-humor', label: 'Tamil & Local Humor' },
  ];

  return (
    <div className="space-y-4">
      {/* Category Pills Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
          <Layers className="w-3.5 h-3.5 text-blue-600" />
          <span>Curated Idea Starters (Click to use as prompt)</span>
        </div>
      </div>

      {/* Horizontal Category Filter Scrollbar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar -mx-1 px-1">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          const Icon = cat.id !== 'all' ? CATEGORY_ICONS[cat.id] : null;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-all duration-200 flex items-center gap-1.5 cursor-pointer min-h-[36px] hover:-translate-y-0.5 active:scale-95 focus-visible:ring-2 focus-visible:ring-[#1463E9] focus-visible:outline-none ${
                isActive
                  ? 'bg-[#1463E9] text-white shadow-xs'
                  : 'bg-white hover:bg-[#EFF6FF] hover:text-[#1463E9] text-slate-700 border border-slate-200'
              }`}
            >
              {Icon && <Icon className="w-3.5 h-3.5" />}
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Grid of Suggested Idea Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredIdeas.map((idea) => {
          const Icon = CATEGORY_ICONS[idea.category];
          const catLabel = AI_CATEGORY_LABELS[idea.category]?.label || idea.category;

          return (
            <button
              key={idea.id}
              type="button"
              onClick={() => onSelectIdea(idea)}
              className="text-left bg-white hover:bg-[#EFF6FF] border border-slate-200 hover:border-[#1463E9]/40 rounded-xl p-3.5 shadow-2xs hover:shadow-xs transition-all duration-200 flex flex-col justify-between group cursor-pointer hover:-translate-y-0.5 active:scale-[0.98]"
            >
              <div className="space-y-1.5 mb-2">
                <div className="flex items-center justify-between gap-1 text-[11px] text-slate-400 font-semibold">
                  <span className="flex items-center gap-1">
                    {Icon && <Icon className="w-3 h-3 text-blue-500" />}
                    <span>{catLabel}</span>
                  </span>
                  {idea.language === 'ta' && (
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded">
                      தமிழ்
                    </span>
                  )}
                </div>

                <h4 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                  {idea.title}
                </h4>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  "{idea.prompt}"
                </p>
              </div>

              <div className="flex items-center justify-between text-[11px] font-semibold text-blue-600 pt-1 group-hover:translate-x-0.5 transition-transform">
                <span>Use as Prompt</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
