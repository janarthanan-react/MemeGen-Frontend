import React, { useState, useMemo } from 'react';
import { ChevronDown, ArrowRight, SlidersHorizontal, X } from 'lucide-react';
import { POPULAR_TEMPLATES, TEMPLATE_CATEGORIES } from '../../constants/templates';
import { TemplateCard } from './TemplateCard';
import { SectionHeading } from '../../components/ui/SectionHeading';
import { EmptyState } from '../../components/ui/EmptyState';
import { Button } from '../../components/ui/Button';
import { SearchInput } from '../../components/ui/SearchInput';
import { useTemplateStore } from '../../stores/useTemplateStore';

type SortOption = 'popular' | 'trending' | 'newest' | 'name-asc' | 'name-desc';

const MORE_CATEGORIES = ['Anime', 'Work', 'Wholesome', 'Relatable'];

export const TemplateGrid: React.FC = () => {
  const activeCategory = useTemplateStore((state) => state.activeCategory);
  const setActiveCategory = useTemplateStore((state) => state.setActiveCategory);
  const searchQuery = useTemplateStore((state) => state.searchQuery);
  const setSearchQuery = useTemplateStore((state) => state.setSearchQuery);
  const resetFilters = useTemplateStore((state) => state.resetFilters);

  const [sortBy, setSortBy] = useState<SortOption>('popular');
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const filteredTemplates = useMemo(() => {
    let result = [...POPULAR_TEMPLATES];

    // Filter by active category
    if (activeCategory && activeCategory !== 'All') {
      const catLower = activeCategory.toLowerCase();
      result = result.filter((t) => {
        const matchesCategory = t.category.toLowerCase() === catLower;
        const matchesTags = t.tags.some((tag) => {
          const tLower = tag.toLowerCase();
          if (catLower === 'gaming') return tLower.includes('game') || tLower.includes('gaming');
          if (catLower === 'business') return tLower.includes('business') || tLower.includes('work');
          if (catLower === 'movies & tv') {
            return (
              tLower.includes('movie') ||
              tLower.includes('tv') ||
              tLower === 'anime' ||
              tLower.includes('star wars')
            );
          }
          if (catLower === 'animals') {
            return tLower === 'animals' || tLower === 'cat' || tLower === 'dog';
          }
          return tLower === catLower || tLower.includes(catLower);
        });
        return matchesCategory || matchesTags;
      });
    }

    // Filter by search query if any
    if (searchQuery.trim()) {
      const queryLower = searchQuery.toLowerCase().trim();
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(queryLower) ||
          t.category.toLowerCase().includes(queryLower) ||
          t.tags.some((tag) => tag.toLowerCase().includes(queryLower)) ||
          t.description.toLowerCase().includes(queryLower)
      );
    }

    // Grounded Sorting based on real template metadata
    result.sort((a, b) => {
      if (sortBy === 'popular') {
        return b.usageCount - a.usageCount;
      }
      if (sortBy === 'trending') {
        if (b.isTrending !== a.isTrending) {
          return b.isTrending ? 1 : -1;
        }
        return b.usageCount - a.usageCount;
      }
      if (sortBy === 'newest') {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      }
      if (sortBy === 'name-asc') {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'name-desc') {
        return b.name.localeCompare(a.name);
      }
      return 0;
    });

    return result;
  }, [activeCategory, searchQuery, sortBy]);

  const hasActiveFilters = (activeCategory && activeCategory !== 'All') || searchQuery.trim().length > 0;

  return (
    <section id="templates" className="scroll-mt-24 space-y-6" aria-label="Popular Meme Templates">
      {/* Section Heading */}
      <SectionHeading
        badge="Community Favorites"
        title="Popular Meme Templates"
        subtitle="Choose from the highest rated viral templates or search by mood, topic, and theme."
        action={
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 hidden sm:inline">
              {filteredTemplates.length} {filteredTemplates.length === 1 ? 'template' : 'templates'}
            </span>
            <a
              href="#templates"
              onClick={(e) => {
                e.preventDefault();
                resetFilters();
              }}
              className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 group"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>
        }
      />

      {/* Toolbar: In-gallery Search & Grounded Sorting */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
        {/* Gallery Search Input */}
        <div className="w-full sm:max-w-xs md:max-w-sm">
          <SearchInput
            variant="light"
            shape="rounded"
            size="sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery('')}
            placeholder="Search by title, tag, or keyword..."
            aria-label="Filter template gallery"
          />
        </div>

        {/* Sorting Dropdown & Count */}
        <div className="flex items-center justify-between sm:justify-end gap-3">
          <div className="flex items-center gap-2">
            <label
              htmlFor="template-sort"
              className="text-xs font-semibold text-slate-500 flex items-center gap-1 shrink-0"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
              <span>Sort:</span>
            </label>
            <select
              id="template-sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="h-9 text-xs font-semibold bg-white border border-slate-200 rounded-xl px-3 text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 shadow-2xs cursor-pointer"
            >
              <option value="popular">Most Popular</option>
              <option value="trending">Trending Now</option>
              <option value="newest">Recently Added</option>
              <option value="name-asc">Alphabetical (A → Z)</option>
              <option value="name-desc">Alphabetical (Z → A)</option>
            </select>
          </div>

          <span className="text-xs text-slate-500 sm:hidden">
            {filteredTemplates.length} results
          </span>
        </div>
      </div>

      {/* Category Filter Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none touch-scroll-x">
        {TEMPLATE_CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer min-h-[36px] flex items-center hover:-translate-y-0.5 active:scale-95 focus-visible:ring-2 focus-visible:ring-[#1463E9] focus-visible:outline-none ${
                isActive
                  ? 'bg-[#1463E9] text-white shadow-sm shadow-blue-600/30 ring-2 ring-blue-600/20'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-[#EFF6FF] hover:text-[#1463E9] hover:border-[#1463E9]/30'
              }`}
            >
              {cat}
            </button>
          );
        })}

        {/* More ▾ Dropdown Pill */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowMoreMenu(!showMoreMenu)}
            aria-expanded={showMoreMenu}
            aria-haspopup="menu"
            className="whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-[#EFF6FF] hover:text-[#1463E9] hover:border-[#1463E9]/30 flex items-center gap-1 cursor-pointer min-h-[36px] transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
          >
            <span>More</span>
            <ChevronDown className="w-3 h-3" />
          </button>
          {showMoreMenu && (
            <div
              role="menu"
              className="absolute left-0 mt-1 w-36 bg-white border border-slate-200 rounded-xl shadow-lg p-1.5 z-20 space-y-1 animate-in fade-in duration-150"
            >
              {MORE_CATEGORIES.map((item) => (
                <button
                  key={item}
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setActiveCategory(item);
                    setShowMoreMenu(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 text-xs rounded-lg text-slate-700 hover:bg-[#EFF6FF] hover:text-[#1463E9] font-medium cursor-pointer transition-colors active:scale-95"
                >
                  {item}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Active Filter Indicators */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-slate-400 font-medium">Active filters:</span>
          {activeCategory && activeCategory !== 'All' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#EFF6FF] text-[#1463E9] font-semibold border border-blue-200/60">
              Category: {activeCategory}
              <button
                type="button"
                onClick={() => setActiveCategory('All')}
                aria-label={`Remove category filter ${activeCategory}`}
                className="hover:text-[#0E52C7] cursor-pointer p-0.5 rounded hover:bg-blue-100/70 transition-colors active:scale-90"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {searchQuery.trim() && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#EFF6FF] text-[#1463E9] font-semibold border border-blue-200/60">
              Search: &quot;{searchQuery}&quot;
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search filter"
                className="hover:text-[#0E52C7] cursor-pointer p-0.5 rounded hover:bg-blue-100/70 transition-colors active:scale-90"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          <button
            type="button"
            onClick={resetFilters}
            className="text-slate-500 hover:text-[#1463E9] font-semibold text-xs cursor-pointer ml-1 px-2 py-0.5 rounded hover:bg-[#EFF6FF] transition-all duration-150 active:scale-95"
          >
            Reset all
          </button>
        </div>
      )}

      {/* Template Grid or Empty State */}
      {filteredTemplates.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5 sm:gap-4">
          {filteredTemplates.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No templates found"
          description={
            searchQuery
              ? `No templates matched "${searchQuery}" in category "${activeCategory}". Try different keywords or reset filters.`
              : `No templates found in category "${activeCategory}".`
          }
          action={
            <Button
              variant="outline"
              size="sm"
              onClick={resetFilters}
              leftIcon={<SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />}
            >
              Reset All Filters
            </Button>
          }
        />
      )}
    </section>
  );
};
