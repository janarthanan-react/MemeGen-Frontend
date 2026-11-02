import React, { useEffect, useMemo } from 'react';
import {
  ArrowUpDown,
  FilePlus,
  RefreshCw,
  Search,
  X,
  Bookmark,
} from 'lucide-react';
import { useDraftStore } from '../../stores/useDraftStore';
import { DraftCard } from './DraftCard';
import { RenameDraftModal } from './RenameDraftModal';
import { DeleteDraftModal } from './DeleteDraftModal';
import { SearchInput } from '../../components/ui/SearchInput';
import { EmptyState } from '../../components/ui/EmptyState';
import { ErrorState } from '../../components/ui/ErrorState';
import { Button } from '../../components/ui/Button';
import type { DraftSortOption } from '../../types/draft';

export interface DraftGridProps {
  onNavigate?: (route: string) => void;
  limit?: number; // Optional limit (for Profile overview tab)
  showControls?: boolean; // Toggle search/sort controls
}

export const DraftGrid: React.FC<DraftGridProps> = ({
  onNavigate,
  limit,
  showControls = true,
}) => {
  const drafts = useDraftStore((state) => state.drafts);
  const isLoading = useDraftStore((state) => state.isLoading);
  const error = useDraftStore((state) => state.error);
  const searchQuery = useDraftStore((state) => state.searchQuery);
  const setSearchQuery = useDraftStore((state) => state.setSearchQuery);
  const sortBy = useDraftStore((state) => state.sortBy);
  const setSortBy = useDraftStore((state) => state.setSortBy);
  const fetchDrafts = useDraftStore((state) => state.fetchDrafts);

  useEffect(() => {
    fetchDrafts();
  }, [fetchDrafts]);

  // Filter and sort drafts
  const filteredAndSortedDrafts = useMemo(() => {
    let result = [...drafts];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (d) =>
          (d.title || '').toLowerCase().includes(q) ||
          (d.template?.name || '').toLowerCase().includes(q)
      );
    }

    // Sort order
    result.sort((a, b) => {
      switch (sortBy) {
        case 'recently-edited': {
          const timeA = new Date(a.updatedAt || a.createdAt).getTime();
          const timeB = new Date(b.updatedAt || b.createdAt).getTime();
          return (isNaN(timeB) ? 0 : timeB) - (isNaN(timeA) ? 0 : timeA);
        }
        case 'oldest': {
          const timeA = new Date(a.createdAt).getTime();
          const timeB = new Date(b.createdAt).getTime();
          return (isNaN(timeA) ? 0 : timeA) - (isNaN(timeB) ? 0 : timeB);
        }
        case 'name-asc':
          return (a.title || '').localeCompare(b.title || '');
        case 'name-desc':
          return (b.title || '').localeCompare(a.title || '');
        default:
          return 0;
      }
    });

    if (limit && limit > 0) {
      return result.slice(0, limit);
    }

    return result;
  }, [drafts, searchQuery, sortBy, limit]);

  const handleCreateNew = () => {
    if (onNavigate) {
      onNavigate('/editor');
    }
  };

  if (isLoading && drafts.length === 0) {
    return (
      <div className="w-full py-16 flex flex-col items-center justify-center gap-3 text-slate-400">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
        <p className="text-sm font-medium">Loading saved drafts...</p>
      </div>
    );
  }

  if (error && drafts.length === 0) {
    return (
      <ErrorState
        title="Failed to Load Drafts"
        message={error}
        onRetry={fetchDrafts}
      />
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Controls Bar: Search & Sort (if enabled) */}
      {showControls && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          {/* Search Input */}
          <div className="w-full sm:w-72 md:w-80">
            <SearchInput
              variant="light"
              shape="rounded"
              size="sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClear={() => setSearchQuery('')}
              placeholder="Search drafts by title or template..."
              aria-label="Search saved drafts"
            />
          </div>

          {/* Right Controls: Sort & Count */}
          <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <span>Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as DraftSortOption)}
                aria-label="Sort drafts"
                className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="recently-edited">Recently Edited</option>
                <option value="oldest">Oldest First</option>
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
              </select>
            </div>

            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-xs text-slate-500 hover:text-[#1463E9] font-semibold flex items-center gap-1 cursor-pointer px-2 py-1 rounded-lg hover:bg-[#EFF6FF] transition-all duration-150 active:scale-95"
              >
                <X className="w-3 h-3" />
                Clear
              </button>
            )}
          </div>
        </div>
      )}

      {/* Drafts Grid or Empty State */}
      {filteredAndSortedDrafts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredAndSortedDrafts.map((draft) => (
            <DraftCard key={draft.id} draft={draft} onNavigate={onNavigate} />
          ))}
        </div>
      ) : searchQuery ? (
        <EmptyState
          icon={<Search className="w-6 h-6 text-slate-400" />}
          title="No drafts match your search"
          description={`We couldn't find any drafts matching "${searchQuery}". Try a different search term.`}
          action={
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSearchQuery('')}
            >
              Clear Search
            </Button>
          }
        />
      ) : (
        <EmptyState
          icon={<Bookmark className="w-6 h-6 text-blue-600" />}
          title="No saved drafts yet"
          description="Ready to make your next viral meme? Pick any template in the editor, add your witty captions, and save it as a draft."
          action={
            <Button
              variant="primary"
              size="sm"
              onClick={handleCreateNew}
              leftIcon={<FilePlus className="w-4 h-4" />}
            >
              Create New Meme
            </Button>
          }
        />
      )}

      {/* Confirmation & Rename Modals */}
      <RenameDraftModal />
      <DeleteDraftModal />
    </div>
  );
};
