import React, { useState } from 'react';
import {
  LayoutDashboard,
  Bookmark,
  Send,
  ArrowRight,
  Flame,
  ExternalLink,
  Plus,
  CreditCard,
} from 'lucide-react';
import { DraftGrid } from '../drafts/DraftGrid';
import { SubscriptionManagement } from '../subscription/SubscriptionManagement';
import { Button } from '../../components/ui/Button';
import { POPULAR_TEMPLATES } from '../../constants/templates';
import { useTemplateStore } from '../../stores/useTemplateStore';
import { useDraftStore } from '../../stores/useDraftStore';
import { useSubscriptionStore } from '../../stores/useSubscriptionStore';

export type ProfileTab = 'overview' | 'drafts' | 'published' | 'subscription';

export interface ProfileTabsProps {
  onNavigate?: (route: string) => void;
}

export const ProfileTabs: React.FC<ProfileTabsProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<ProfileTab>('overview');
  const setSelectedTemplate = useTemplateStore((state) => state.setSelectedTemplate);
  const drafts = useDraftStore((state) => state.drafts);
  const currentSubscription = useSubscriptionStore((state) => state.currentSubscription);

  const handleUseTemplate = (template: typeof POPULAR_TEMPLATES[0]) => {
    setSelectedTemplate(template);
    if (onNavigate) {
      onNavigate('/editor');
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Tab Navigation Pill Bar */}
      <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 bg-slate-100 rounded-2xl w-full sm:w-fit overflow-x-auto shadow-inner">
        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-150 cursor-pointer whitespace-nowrap hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-[#1463E9] focus-visible:outline-none ${
            activeTab === 'overview'
              ? 'bg-white text-[#1463E9] shadow-xs ring-1 ring-slate-200/60'
              : 'text-slate-600 hover:text-[#1463E9] hover:bg-white/60'
          }`}
          aria-selected={activeTab === 'overview'}
          role="tab"
        >
          <LayoutDashboard className="w-4 h-4 shrink-0" />
          <span>Overview</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('drafts')}
          className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-150 cursor-pointer whitespace-nowrap hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-[#1463E9] focus-visible:outline-none ${
            activeTab === 'drafts'
              ? 'bg-white text-[#1463E9] shadow-xs ring-1 ring-slate-200/60'
              : 'text-slate-600 hover:text-[#1463E9] hover:bg-white/60'
          }`}
          aria-selected={activeTab === 'drafts'}
          role="tab"
        >
          <Bookmark className="w-4 h-4 shrink-0" />
          <span>My Drafts</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-100 text-[#1463E9] font-bold ml-0.5">
            {drafts.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('published')}
          className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-150 cursor-pointer whitespace-nowrap hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-[#1463E9] focus-visible:outline-none ${
            activeTab === 'published'
              ? 'bg-white text-[#1463E9] shadow-xs ring-1 ring-slate-200/60'
              : 'text-slate-600 hover:text-[#1463E9] hover:bg-white/60'
          }`}
          aria-selected={activeTab === 'published'}
          role="tab"
        >
          <Send className="w-4 h-4 shrink-0" />
          <span>Published Memes</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-200 text-slate-600 font-medium ml-0.5">
            0
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('subscription')}
          className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-150 cursor-pointer whitespace-nowrap hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-[#1463E9] focus-visible:outline-none ${
            activeTab === 'subscription'
              ? 'bg-white text-[#1463E9] shadow-xs ring-1 ring-slate-200/60'
              : 'text-slate-600 hover:text-[#1463E9] hover:bg-white/60'
          }`}
          aria-selected={activeTab === 'subscription'}
          role="tab"
        >
          <CreditCard className="w-4 h-4 shrink-0" />
          <span>Subscription &amp; Billing</span>
          <span
            className={`text-[10px] px-1.5 py-0.5 rounded-full uppercase font-extrabold ml-0.5 ${
              currentSubscription.planId !== 'free'
                ? 'bg-amber-100 text-amber-800'
                : 'bg-slate-200 text-slate-600'
            }`}
          >
            {currentSubscription.planId}
          </span>
        </button>
      </div>

      {/* Tab Panels */}
      {/* 1. Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Recent Drafts Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                  Recent In-Progress Drafts
                </h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  Pick up right where you left off on your latest meme creations.
                </p>
              </div>

              {drafts.length > 0 && (
                <button
                  type="button"
                  onClick={() => setActiveTab('drafts')}
                  className="text-xs sm:text-sm font-bold text-[#1463E9] hover:text-[#0E52C7] flex items-center gap-1 cursor-pointer shrink-0 transition-colors duration-200"
                >
                  <span>See all ({drafts.length})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <DraftGrid onNavigate={onNavigate} limit={4} showControls={false} />
          </div>

          {/* Quick Start from Popular Templates */}
          <div className="bg-gradient-to-r from-blue-50/70 via-indigo-50/50 to-cyan-50/70 p-6 sm:p-8 rounded-3xl border border-blue-100 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
                  <Flame className="w-3.5 h-3.5" />
                  <span>Inspiration Board</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  Start a New Meme from Trending Templates
                </h3>
                <p className="text-xs sm:text-sm text-slate-600">
                  Choose any popular template to open directly in the canvas editor.
                </p>
              </div>

              <Button
                variant="primary"
                size="sm"
                onClick={() => onNavigate && onNavigate('/editor')}
                leftIcon={<Plus className="w-4 h-4" />}
                className="shrink-0"
              >
                Open Studio
              </Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {POPULAR_TEMPLATES.slice(0, 4).map((tpl) => (
                <div
                  key={tpl.id}
                  onClick={() => handleUseTemplate(tpl)}
                  className="group bg-white p-2 rounded-xl border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer flex flex-col gap-2"
                >
                  <div className="aspect-[16/10] w-full rounded-lg bg-slate-100 overflow-hidden relative">
                    <img
                      src={tpl.imageUrl}
                      alt={tpl.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                  <div className="flex items-center justify-between gap-1 text-[11px] font-semibold text-slate-800">
                    <span className="truncate group-hover:text-blue-600 transition-colors">
                      {tpl.name}
                    </span>
                    <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-blue-600 shrink-0" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. My Drafts Tab */}
      {activeTab === 'drafts' && (
        <div className="animate-in fade-in duration-200 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                All Saved Drafts
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Search, sort, rename, duplicate, and manage all your stored meme drafts.
              </p>
            </div>
          </div>

          <DraftGrid onNavigate={onNavigate} />
        </div>
      )}

      {/* 3. Published Memes Tab */}
      {activeTab === 'published' && (
        <div className="w-full bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-14 text-center space-y-4 animate-in fade-in duration-200">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center mx-auto shadow-xs">
            <Send className="w-6 h-6" />
          </div>

          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">
              Community Publishing Coming Soon
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              MemeHub&apos;s public feed and community gallery are currently in development. Once the backend publishing endpoint is connected, all your published memes will showcase here with real-time likes, comments, and remixes!
            </p>
          </div>

          <div className="pt-2 flex items-center justify-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveTab('drafts')}
            >
              View Saved Drafts
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => onNavigate && onNavigate('/editor')}
            >
              Create New Meme
            </Button>
          </div>
        </div>
      )}

      {/* 4. Subscription & Billing Tab */}
      {activeTab === 'subscription' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <SubscriptionManagement
            onNavigate={onNavigate}
            onUpgradeClick={() => onNavigate?.('/pricing')}
          />
        </div>
      )}
    </div>
  );
};
