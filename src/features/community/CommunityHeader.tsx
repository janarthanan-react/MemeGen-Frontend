import React from 'react';
import {
  Plus,
  Flame,
  Clock,
  Heart,
  Search,
  Filter,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import type { CommunitySortOption } from '../../types/community';

export interface CommunityHeaderProps {
  category: string;
  onSelectCategory: (cat: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  sortBy: CommunitySortOption;
  onSortChange: (sort: CommunitySortOption) => void;
  onOpenPublish: () => void;
  totalPosts: number;
}

const CATEGORIES = [
  'All',
  'Trending',
  'Tech/Dev',
  'Anime',
  'Gaming',
  'Animals',
  'Reactions',
  'Classics',
];

export const CommunityHeader: React.FC<CommunityHeaderProps> = ({
  category,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  onOpenPublish,
  totalPosts,
}) => {
  return (
    <div className="space-y-6">
      {/* Top Banner Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#071330] via-[#0b2463] to-[#0e358e] text-white p-6 sm:p-8 rounded-3xl border border-blue-500/20 shadow-xl relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-2 max-w-xl">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="dark" size="sm" dot>
              COMMUNITY FEED
            </Badge>
            <span className="text-[11px] font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Local Demo Mode
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
            Meme Hub Community
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Discover, like, and comment on the funniest creations from around the internet.
            Share your exported memes directly with the community!
          </p>
        </div>

        {/* Right CTA */}
        <div className="relative z-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <Button
            variant="primary"
            size="md"
            onClick={onOpenPublish}
            leftIcon={<Plus className="w-4 h-4" />}
            className="shadow-lg shadow-blue-600/30 hover:shadow-cyan-500/40 font-semibold"
          >
            Share a Meme
          </Button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-4">
        {/* Search & Sort Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search community memes, tags, creators..."
              aria-label="Search community memes"
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>

          {/* Sort Buttons */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl self-start sm:self-auto overflow-x-auto">
            <button
              type="button"
              onClick={() => onSortChange('trending')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer hover:-translate-y-0.5 active:translate-y-0 active:scale-95 ${
                sortBy === 'trending'
                  ? 'bg-white text-[#1463E9] shadow-xs ring-1 ring-slate-200/60 font-bold'
                  : 'text-slate-600 hover:text-[#1463E9] hover:bg-white/60'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Trending</span>
            </button>

            <button
              type="button"
              onClick={() => onSortChange('latest')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer hover:-translate-y-0.5 active:translate-y-0 active:scale-95 ${
                sortBy === 'latest'
                  ? 'bg-white text-[#1463E9] shadow-xs ring-1 ring-slate-200/60 font-bold'
                  : 'text-slate-600 hover:text-[#1463E9] hover:bg-white/60'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Latest</span>
            </button>

            <button
              type="button"
              onClick={() => onSortChange('most-liked')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer hover:-translate-y-0.5 active:translate-y-0 active:scale-95 ${
                sortBy === 'most-liked'
                  ? 'bg-white text-[#1463E9] shadow-xs ring-1 ring-slate-200/60 font-bold'
                  : 'text-slate-600 hover:text-[#1463E9] hover:bg-white/60'
              }`}
            >
              <Heart className="w-3.5 h-3.5" />
              <span>Most Liked</span>
            </button>
          </div>
        </div>

        {/* Category Pills (Horizontal Scroll on Mobile) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-1 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-400 flex items-center gap-1 pr-1 shrink-0">
            <Filter className="w-3.5 h-3.5" />
            Category:
          </span>

          {CATEGORIES.map((cat) => {
            const isSelected = category.toLowerCase() === cat.toLowerCase();
            return (
              <button
                key={cat}
                type="button"
                onClick={() => onSelectCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-all duration-150 cursor-pointer hover:-translate-y-0.5 active:translate-y-0 active:scale-95 focus-visible:ring-2 focus-visible:ring-[#1463E9] focus-visible:outline-none ${
                  isSelected
                    ? 'bg-[#1463E9] text-white shadow-[0_2px_8px_rgba(20,99,233,0.35)]'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-[#EFF6FF] hover:text-[#1463E9] hover:border-[#1463E9]/30 shadow-2xs'
                }`}
              >
                {cat}
              </button>
            );
          })}

          <span className="ml-auto text-[11px] font-medium text-slate-400 shrink-0 hidden md:inline">
            {totalPosts} {totalPosts === 1 ? 'meme' : 'memes'}
          </span>
        </div>
      </div>
    </div>
  );
};
