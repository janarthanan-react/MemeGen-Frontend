import React from 'react';
import { ArrowRight, MessageSquare, ShieldCheck, Flame } from 'lucide-react';
import { useTemplateStore } from '../../stores/useTemplateStore';
import { POPULAR_TEMPLATES } from '../../constants/templates';

export const CommunityBanner: React.FC = () => {
  const setSelectedTemplate = useTemplateStore((state) => state.setSelectedTemplate);
  const openPreview = useTemplateStore((state) => state.openPreview);

  const handleStartNow = () => {
    if (POPULAR_TEMPLATES.length > 0) {
      setSelectedTemplate(POPULAR_TEMPLATES[0]);
      openPreview(POPULAR_TEMPLATES[0]);
    }
  };

  return (
    <section className="relative rounded-3xl bg-gradient-to-r from-[#061841] via-[#092972] to-[#0c399e] text-white p-8 sm:p-14 lg:p-16 overflow-hidden shadow-2xl text-center" aria-label="Join MemeHub Community">
      {/* Ambient glowing radial effects (iOS Safari safe CSS radial gradients) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_380px_at_top_left,rgba(6,182,212,0.22),transparent_70%),radial-gradient(circle_380px_at_bottom_right,rgba(59,130,246,0.25),transparent_70%)]"
      />

      <div className="relative z-10 max-w-3xl mx-auto space-y-6">
        {/* Top Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-400/20 border border-cyan-400/30 text-cyan-300 text-xs font-bold uppercase tracking-wider">
          <Flame className="w-3.5 h-3.5 text-cyan-300" />
          <span>Join 2,000,000+ Active Memers</span>
        </div>

        {/* Headline */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
          Ready to Make the Entire Internet Laugh?
        </h2>

        {/* Subtitle */}
        <p className="text-sm sm:text-base text-blue-100 max-w-xl mx-auto font-normal leading-relaxed">
          Create classic memes, generate witty AI punchlines, and export in razor-sharp 4K in seconds. Completely free with zero signup friction.
        </p>

        {/* Buttons */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3.5">
          <button
            type="button"
            onClick={handleStartNow}
            className="bg-[#1463E9] hover:bg-[#0E52C7] text-white font-bold text-sm px-6 sm:px-7 py-3.5 rounded-2xl shadow-[0_4px_16px_rgba(20,99,233,0.4)] hover:shadow-[0_8px_24px_rgba(20,99,233,0.5)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] flex items-center gap-2.5 transition-all duration-200 cursor-pointer group focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            <Flame className="w-4 h-4 text-cyan-200" />
            <span>Launch Meme Editor Now</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <a
            href="#discord"
            className="bg-white/10 hover:bg-[#5865F2] hover:border-[#5865F2] text-white border border-white/20 font-bold text-sm px-6 py-3.5 rounded-2xl transition-all duration-200 flex items-center gap-2.5 backdrop-blur-sm hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] shadow-sm hover:shadow-lg hover:shadow-[#5865F2]/30 cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:outline-none group"
          >
            <MessageSquare className="w-4 h-4 text-indigo-300 group-hover:text-white transition-colors" />
            <span>Join 150K+ Member Discord</span>
          </a>
        </div>

        {/* Guarantee badges */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-blue-200">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-cyan-300" />
            No credit card required
          </span>
          <span>•</span>
          <span>Unlimited free exports</span>
          <span>•</span>
          <span>Instant browser rendering</span>
        </div>
      </div>
    </section>
  );
};
