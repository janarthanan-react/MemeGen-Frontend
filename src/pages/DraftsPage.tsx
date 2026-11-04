import React from 'react';
import { Plus, ArrowLeft, Bookmark, HardDrive, RefreshCw } from 'lucide-react';
import { Container } from '../components/ui/Container';
import { Button } from '../components/ui/Button';
import { DraftGrid } from '../features/drafts/DraftGrid';
import { useDraftStore } from '../stores/useDraftStore';
import { useAuthStore } from '../stores/useAuthStore';

export interface DraftsPageProps {
  onNavigate: (route: string) => void;
}

export const DraftsPage: React.FC<DraftsPageProps> = ({ onNavigate }) => {
  const drafts = useDraftStore((state) => state.drafts);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isAuthLoading = useAuthStore((state) => state.isLoading);

  React.useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      onNavigate('/login');
    }
  }, [isAuthLoading, isAuthenticated, onNavigate]);

  if (isAuthLoading && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50/70 pt-32 pb-20 flex flex-col items-center justify-center gap-3 text-slate-400">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
        <p className="text-sm font-medium">Checking creator session...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/70 pt-24 sm:pt-28 pb-20">
      <Container className="space-y-8">
        {/* Navigation Breadcrumb / Back */}
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => onNavigate('/')}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-500 hover:text-[#1463E9] transition-all duration-200 active:scale-95 cursor-pointer py-1 px-2.5 rounded-xl hover:bg-[#EFF6FF]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>

          <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-white px-2.5 py-1 rounded-full border border-slate-200/80 shadow-2xs">
            <HardDrive className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden xs:inline">Stored in browser cache</span>
            <span className="font-semibold text-slate-700">({drafts.length} drafts)</span>
          </div>
        </div>

        {/* Page Banner Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 bg-gradient-to-br from-[#071330] via-slate-900 to-[#0c1f4a] text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden">
          {/* Subtle Ambient Decorative Circles (iOS safe radial gradients) */}
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_320px_at_top_right,rgba(59,130,246,0.12),transparent_70%),radial-gradient(circle_260px_at_35%_100%,rgba(6,182,212,0.12),transparent_70%)]"
          />

          <div className="relative z-10 space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-cyan-300 text-xs font-semibold border border-blue-400/30">
              <Bookmark className="w-3 h-3 text-cyan-400" />
              <span>Creator Workspace</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white">
              My Saved Drafts
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Continue editing your saved memes, tweak captions, duplicate variations, or download the final versions whenever you&apos;re ready.
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-3 shrink-0">
            <Button
              variant="outline"
              size="md"
              onClick={() => onNavigate('/profile')}
              className="border-white/20 text-white hover:bg-white/10 hover:border-white/40"
            >
              View Profile
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => onNavigate('/editor')}
              leftIcon={<Plus className="w-4 h-4" />}
              className="shadow-lg shadow-blue-600/40"
            >
              Create New Meme
            </Button>
          </div>
        </div>

        {/* Main Drafts Gallery */}
        <main aria-label="Drafts Collection">
          <DraftGrid onNavigate={onNavigate} />
        </main>
      </Container>
    </div>
  );
};

export default DraftsPage;
