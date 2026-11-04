import React, { useState } from 'react';
import { Trophy, Award, Heart, ThumbsUp, CheckCircle2 } from 'lucide-react';
import { useTemplateStore } from '../../stores/useTemplateStore';
import { POPULAR_TEMPLATES } from '../../constants/templates';

const RUNNERS_UP = [
  {
    rank: 2,
    title: 'Monday morning standup meeting',
    author: '@doge_master',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
    upvotes: '34.2K',
    badge: 'Silver Medalist',
  },
  {
    rank: 3,
    title: 'When AI finishes the report in 0.2s',
    author: '@pixel_jedi',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80',
    upvotes: '29.8K',
    badge: 'Bronze Medalist',
  },
  {
    rank: 4,
    title: 'Checking my portfolio after 5 minutes',
    author: '@crypto_king',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    upvotes: '21.4K',
    badge: 'Finalist',
  },
];

export const WeeklyContest: React.FC = () => {
  const [voted, setVoted] = useState(false);
  const [upvotes, setUpvotes] = useState(48620);
  const openPreview = useTemplateStore((state) => state.openPreview);
  const setSelectedTemplate = useTemplateStore((state) => state.setSelectedTemplate);

  const handleVote = () => {
    if (!voted) {
      setUpvotes((prev) => prev + 1);
      setVoted(true);
    } else {
      setUpvotes((prev) => prev - 1);
      setVoted(false);
    }
  };

  const handleEnterContest = () => {
    if (POPULAR_TEMPLATES.length > 2) {
      setSelectedTemplate(POPULAR_TEMPLATES[2]);
      openPreview(POPULAR_TEMPLATES[2]);
    }
  };

  return (
    <section className="bg-gradient-to-br from-slate-900 via-[#0d214d] to-[#071330] text-white rounded-3xl p-6 sm:p-10 lg:p-12 overflow-hidden shadow-2xl relative" aria-label="Weekly Meme Contest">
      {/* Ambient background glows (iOS Safari safe CSS radial gradients) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_380px_at_top_right,rgba(251,191,36,0.14),transparent_70%),radial-gradient(circle_380px_at_bottom_left,rgba(59,130,246,0.18),transparent_70%)]"
      />

      {/* Top Banner Tag */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-white/10 text-center md:text-left">
        <div className="space-y-1.5 flex flex-col items-center md:items-start">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase tracking-wider border border-amber-400/30">
            <Trophy className="w-3.5 h-3.5" />
            <span>Weekly Creator Challenge</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight text-center md:text-left">
            Hall of Fame & Community Contest
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-normal text-center md:text-left">
            Every week 2M+ members vote on the best community memes. Win creator cash prizes and get verified.
          </p>
        </div>

        <button
          type="button"
          onClick={handleEnterContest}
          className="self-center md:self-auto bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold text-xs sm:text-sm px-5 py-3 rounded-2xl shadow-[0_2px_10px_rgba(245,158,11,0.3)] hover:shadow-[0_6px_18px_rgba(245,158,11,0.4)] flex items-center gap-2 transition-all duration-200 cursor-pointer hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          <Trophy className="w-4 h-4" />
          <span>Enter Next Week&apos;s Contest</span>
        </button>
      </div>

      {/* Main Grid: Winner Spotlight on Left, Leaderboard on Right */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8 items-center">
        {/* Left: 1st Place Winner Spotlight */}
        <div className="lg:col-span-7 bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-6 backdrop-blur-md space-y-4 text-left hover:border-amber-400/40 hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-400 text-amber-950 text-xs font-extrabold shadow-sm group-hover:scale-105 transition-transform">
              <Trophy className="w-3.5 h-3.5" />
              <span>1st Place • Week #42 Winner</span>
            </div>
            <span className="text-xs text-amber-300 font-semibold">$500 Grant Winner</span>
          </div>

          {/* Meme Image Preview */}
          <div className="relative rounded-xl overflow-hidden aspect-[16/10] bg-slate-900 border border-white/10 shadow-xl group cursor-pointer">
            <img
              src="https://i.imgflip.com/1g8my4.jpg"
              alt="Two Buttons Meme Winner"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {/* Top / Bottom Captions */}
            <div
              className="absolute top-3 inset-x-3 text-center font-extrabold text-white text-sm sm:text-base uppercase tracking-wider select-none leading-tight"
              style={{
                textShadow: '2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000',
              }}
            >
              When you fix 1 bug in code
            </div>
            <div
              className="absolute bottom-3 inset-x-3 text-center font-extrabold text-white text-sm sm:text-base uppercase tracking-wider select-none leading-tight"
              style={{
                textShadow: '2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000',
              }}
            >
              And 12 new bugs appear
            </div>
          </div>

          {/* Creator Profile & Vote Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80"
                alt="Sarah Codes"
                className="w-10 h-10 rounded-full border-2 border-amber-400 object-cover hover:scale-115 transition-transform cursor-pointer"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm text-white">@sarah_codes</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <span className="text-[11px] text-slate-300">Creator of the Month</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleVote}
              className={`w-full sm:w-auto px-4.5 py-2.5 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 cursor-pointer min-h-[44px] focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2 focus-visible:outline-none ${
                voted
                  ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-[0_2px_10px_rgba(244,63,94,0.4)]'
                  : 'bg-white/10 hover:bg-white/20 text-white border border-white/20 shadow-xs'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${voted ? 'fill-white' : ''}`} />
              <span>{upvotes.toLocaleString()} Upvotes</span>
            </button>
          </div>
        </div>

        {/* Right: Runners Up & Current Challenge */}
        <div className="lg:col-span-5 space-y-4 text-left">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-cyan-400" />
              <span>Top Nominees</span>
            </h3>
            <span className="text-xs text-cyan-300 font-semibold">Live Tally</span>
          </div>

          {/* List of 3 runners-up */}
          <div className="space-y-2.5">
            {RUNNERS_UP.map((item) => (
              <div
                key={item.rank}
                className="bg-white/5 hover:bg-white/15 hover:border-cyan-400/40 hover:translate-x-1.5 border border-white/10 rounded-xl p-3 flex items-center justify-between gap-3 transition-all duration-200 cursor-pointer group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-blue-600/40 text-blue-200 border border-blue-400/30 flex items-center justify-center font-extrabold text-xs shrink-0 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    #{item.rank}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate group-hover:text-cyan-300 transition-colors">{item.title}</p>
                    <p className="text-[11px] text-slate-400">{item.author}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs text-amber-300 font-bold shrink-0 group-hover:scale-110 transition-transform">
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>{item.upvotes}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Next Round Announcement Card */}
          <div className="p-4 rounded-xl bg-blue-950/60 border border-blue-500/30 space-y-2 mt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-cyan-300">Next Round #43</span>
              <span className="text-[10px] text-slate-400">Ends in 2d 14h</span>
            </div>
            <p className="text-xs text-slate-200 font-medium leading-relaxed">
              Theme: <strong>"Expectation vs. Reality in Modern Life"</strong>. Submit your take for a chance to win the community trophy!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
