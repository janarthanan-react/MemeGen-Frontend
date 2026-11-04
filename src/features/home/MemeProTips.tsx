import React from 'react';
import { Lightbulb, Zap, Contrast, Clock, Layout } from 'lucide-react';

const TIPS = [
  {
    icon: <Zap className="w-5 h-5 text-amber-500" />,
    number: '01',
    title: 'Brevity is King',
    description: 'Keep punchlines under 10 words. If a meme takes longer than 2 seconds to read on a mobile screen, 70% of viewers scroll past.',
    tag: 'Copywriting',
  },
  {
    icon: <Contrast className="w-5 h-5 text-blue-500" />,
    number: '02',
    title: 'High Contrast Always',
    description: 'White text with 3px to 5px black stroke outlines guarantees your joke pops in bright daylight, OLED dark mode, and low-res thumbnails.',
    tag: 'Visual Design',
  },
  {
    icon: <Clock className="w-5 h-5 text-rose-500" />,
    number: '03',
    title: 'The 2-Hour Window',
    description: 'When cultural news, award shows, or sporting moments break, posting within 120 minutes generates 5x higher reach.',
    tag: 'Virality Timing',
  },
  {
    icon: <Layout className="w-5 h-5 text-emerald-500" />,
    number: '04',
    title: 'Platform-Fit Ratios',
    description: 'Use 1:1 squares for Reddit, Discord, and Instagram grids. Switch to 9:16 vertical full-bleed for TikTok, Reels, and Shorts.',
    tag: 'Formatting',
  },
];

export const MemeProTips: React.FC = () => {
  return (
    <section className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-xl" aria-label="Meme Creator Tips">
      {/* Background glow (iOS Safari safe CSS radial gradient) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_320px_at_65%_0%,rgba(37,99,235,0.2),transparent_70%)]"
      />

      <div className="relative z-10 space-y-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase tracking-wider border border-amber-400/30">
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Meme Academy</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            The 4 Golden Rules of Viral Memes
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-normal">
            Distilled from millions of top-upvoted memes across Reddit, X, and Instagram.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {TIPS.map((tip) => (
            <div
              key={tip.number}
              className="group bg-white/5 border border-white/10 hover:border-cyan-400/40 rounded-2xl p-5 flex flex-col justify-between text-left hover:bg-white/10 hover:-translate-y-2 hover:shadow-xl hover:shadow-cyan-500/10 active:scale-[0.98] transition-all duration-300 cursor-pointer"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 group-hover:bg-white/20 transition-all duration-300">
                    {tip.icon}
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-400 group-hover:text-cyan-300 transition-colors">
                    {tip.number}
                  </span>
                </div>

                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-300 group-hover:tracking-widest block transition-all duration-300">
                  {tip.tag}
                </span>

                <h3 className="font-bold text-base text-white group-hover:text-cyan-200 transition-colors">{tip.title}</h3>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {tip.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
