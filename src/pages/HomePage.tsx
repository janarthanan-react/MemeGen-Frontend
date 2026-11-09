import React, { useState } from 'react';
import {
  ArrowRight,
  Layers,
  Image as ImageIcon,
  Wand2,
  Sliders,
  Type,
  Smile,
  PenTool,
  Square,
  Upload,
  Edit,
  Share2,
  Heart,
  MessageCircle,
  Check,
  Star,
  Grid,
  ShieldCheck,
  Crown,
  Flame,
} from 'lucide-react';
import { TemplateGrid } from '../features/templates/TemplateGrid';
import { TemplatePreviewModal } from '../features/templates/TemplatePreviewModal';
import { COMMUNITY_MEMES, POPULAR_TEMPLATES, type CommunityMeme } from '../constants/templates';
import { Modal, Button, Badge, Container } from '../components/ui';
import { useTemplateStore } from '../stores/useTemplateStore';
import { InteractivePlayground } from '../features/home/InteractivePlayground';
import { TrendingGenres } from '../features/home/TrendingGenres';
import { WeeklyContest } from '../features/home/WeeklyContest';
import { ExportPlatforms } from '../features/home/ExportPlatforms';
import { FaqSection } from '../features/home/FaqSection';
import { CommunityLiveFeed } from '../features/home/CommunityLiveFeed';
import { FeatureSpotlights } from '../features/home/FeatureSpotlights';
import { PricingSection } from '../features/home/PricingSection';
import { TrendingArticles } from '../features/home/TrendingArticles';
import { MemeProTips } from '../features/home/MemeProTips';
import { CommunityBanner } from '../features/home/CommunityBanner';
import { AiAssistantSection } from '../features/ai-assistant';

export interface HomePageProps {
  onNavigate?: (route: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const setSelectedTemplate = useTemplateStore((state) => state.setSelectedTemplate);
  const openPreview = useTemplateStore((state) => state.openPreview);

  const [selectedCommunityMeme, setSelectedCommunityMeme] = useState<CommunityMeme | null>(null);

  const handleSelectStarter = () => {
    if (POPULAR_TEMPLATES.length > 0) {
      setSelectedTemplate(POPULAR_TEMPLATES[0]);
      openPreview(POPULAR_TEMPLATES[0]);
    }
  };

  return (
    <div className="w-full bg-white text-slate-900">
      {/* ============================================================== */}
      {/* 1. HERO SECTION (Dark Blue Gradient)                           */}
      {/* ============================================================== */}
      <section id="home" className="relative w-full bg-gradient-to-b from-[#071330] via-[#091f58] to-[#0e358e] text-white pt-24 sm:pt-32 pb-24 sm:pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden scroll-mt-20">
        {/* Subtle Ambient Radial Lighting via CSS gradients (iOS Safari & WebKit safe, zero blur rendering artifacts) */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_600px_600px_at_30%_25%,rgba(59,130,246,0.18),transparent_70%),radial-gradient(ellipse_500px_500px_at_85%_15%,rgba(6,182,212,0.16),transparent_65%)]"
        />

        <Container size="lg" cleanPadding>
          <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Headline & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left z-10 flex flex-col items-center lg:items-start">
              {/* Top Pill Tag */}
              <div className="flex justify-center lg:justify-start">
                <Badge variant="dark" size="sm" dot>
                  CREATE • EDIT • SHARE • GO VIRAL
                </Badge>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.12] tracking-tight text-center lg:text-left">
                Turn Your Ideas <br />
                Into{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-200 [-webkit-background-clip:text] [box-decoration-break:clone] [-webkit-box-decoration-break:clone]">
                  Viral Memes
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed font-normal mx-auto lg:mx-0 text-center lg:text-left">
                The easiest and most powerful meme generator, GIF maker and image editing platform.
                Create, customize and share memes in seconds.
              </p>

              {/* Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3.5 w-full sm:w-auto">
                <a href="#create" className="w-full sm:w-auto">
                  <Button
                    variant="primary"
                    size="lg"
                    rightIcon={<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />}
                    className="w-full sm:w-auto rounded-2xl group font-bold shadow-[0_4px_16px_rgba(20,99,233,0.4)]"
                  >
                    Create Meme Now
                  </Button>
                </a>

                <a href="#templates" className="w-full sm:w-auto">
                  <Button
                    variant="dark"
                    size="lg"
                    className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white hover:text-white border-white/25 hover:border-white/50 shadow-sm font-semibold rounded-2xl"
                  >
                    Explore Templates
                  </Button>
                </a>
              </div>

              {/* Creators Social Proof */}
              <div className="pt-4 flex items-center justify-center lg:justify-start gap-3">
                <div className="flex -space-x-2">
                  <img
                    className="w-8 h-8 rounded-full border-2 border-[#091f58] object-cover hover:scale-125 hover:z-20 transition-transform duration-200 cursor-pointer"
                    src="/Profille/no-dp_16.webp"
                    alt="Creator"
                  />
                  <img
                    className="w-8 h-8 rounded-full border-2 border-[#091f58] object-cover hover:scale-125 hover:z-20 transition-transform duration-200 cursor-pointer"
                    src="/Profille/no-dp_16.webp"
                    alt="Creator"
                  />
                  <img
                    className="w-8 h-8 rounded-full border-2 border-[#091f58] object-cover hover:scale-125 hover:z-20 transition-transform duration-200 cursor-pointer"
                    src="/Profille/no-dp_16.webp"
                    alt="Creator"
                  />
                  <img
                    className="w-8 h-8 rounded-full border-2 border-[#091f58] object-cover hover:scale-125 hover:z-20 transition-transform duration-200 cursor-pointer"
                    src="/Profille/no-dp_16.webp"
                    alt="Creator"
                  />
                </div>
                <span className="text-xs text-slate-300 font-medium">
                  Trusted by creators for fast, watermark-free memes &amp; GIF tools
                </span>
              </div>
            </div>

            {/* Right Column: Hero Graphic Preview (Main Shin-chan Card + Down Angry Kazama Card) */}
            <div className="lg:col-span-5 relative flex flex-col items-center justify-center pt-8 lg:pt-0">
              {/* Ambient Radial Neon Halo Behind Main Image */}
              <div
                aria-hidden="true"
                className="absolute inset-0 rounded-full pointer-events-none scale-125 animate-pulse-subtle bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.3)_0%,rgba(37,99,235,0.32)_45%,rgba(244,63,94,0.18)_70%,transparent_75%)]"
              />

              {/* Main Straight Meme Canvas Card: SHIN-CHAN */}
              <div
                role="button"
                tabIndex={0}
                onClick={handleSelectStarter}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSelectStarter();
                  }
                }}
                aria-label="Preview featured Shin-chan meme template"
                className="relative w-full max-w-[275px] xs:max-w-[315px] sm:max-w-none sm:w-96 lg:w-[410px] rounded-3xl bg-white p-2.5 sm:p-3.5 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6),0_0_40px_rgba(37,99,235,0.3)] border border-white/80 rotate-0 hover:scale-[1.02] hover:shadow-[0_30px_70px_-15px_rgba(6,182,212,0.35)] transition-all duration-300 cursor-pointer group z-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              >
                <div className="relative rounded-2xl overflow-hidden bg-slate-900 aspect-square">
                  <img
                    src="/shinchan-meme.jpg"
                    alt="Shin-chan Meme - Ideas Today, Viral Tomorrow"
                    className="w-full h-full object-cover object-[center_15%] group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Top Caption: IDEAS TODAY */}
                  <div
                    className="absolute top-3 sm:top-4 inset-x-2 text-center font-['Impact',sans-serif] font-black text-white text-xl sm:text-3xl tracking-wider uppercase select-none transition-transform group-hover:-translate-y-0.5 duration-200"
                    style={{
                      textShadow:
                        '3px 3px 0 #000, -3px -3px 0 #000, 3px -3px 0 #000, -3px 3px 0 #000, 0 3px 0 #000, 3px 0 0 #000, -3px 0 0 #000, 0 -3px 0 #000',
                    }}
                  >
                    IDEAS TODAY
                  </div>

                  {/* Bottom Caption: VIRAL TOMORROW */}
                  <div
                    className="absolute bottom-3 sm:bottom-4 inset-x-2 text-center font-['Impact',sans-serif] font-black text-white text-xl sm:text-3xl tracking-wider uppercase select-none transition-transform group-hover:translate-y-0.5 duration-200"
                    style={{
                      textShadow:
                        '3px 3px 0 #000, -3px -3px 0 #000, 3px -3px 0 #000, -3px 3px 0 #000, 0 3px 0 #000, 3px 0 0 #000, -3px 0 0 #000, 0 -3px 0 #000',
                    }}
                  >
                    VIRAL TOMORROW
                  </div>
                </div>
              </div>

              {/* Floating Left Toolbar Card - Visible on desktop & tablet */}
              <div className="hidden sm:block absolute left-1 sm:-left-8 top-3 sm:top-12 bg-white/95 backdrop-blur-xl rounded-xl sm:rounded-2xl p-1.5 sm:p-3 shadow-xl sm:shadow-2xl border border-white/80 space-y-1 sm:space-y-2.5 z-20 text-slate-700 hover:shadow-cyan-500/20 hover:-translate-y-1 transition-all duration-300 rotate-0">
                <div className="flex items-center gap-1.5 sm:gap-2 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg hover:bg-blue-50 hover:text-blue-600 hover:translate-x-1 sm:hover:translate-x-1.5 active:scale-95 text-[11px] sm:text-xs font-semibold cursor-pointer transition-all duration-200">
                  <Type className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>Text</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg hover:bg-amber-50 hover:text-amber-600 hover:translate-x-1 sm:hover:translate-x-1.5 active:scale-95 text-[11px] sm:text-xs font-semibold cursor-pointer transition-all duration-200">
                  <Smile className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>Stickers</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg hover:bg-purple-50 hover:text-purple-600 hover:translate-x-1 sm:hover:translate-x-1.5 active:scale-95 text-[11px] sm:text-xs font-semibold cursor-pointer transition-all duration-200">
                  <PenTool className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                  <span>Draw</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg hover:bg-emerald-50 hover:text-emerald-600 hover:translate-x-1 sm:hover:translate-x-1.5 active:scale-95 text-[11px] sm:text-xs font-semibold cursor-pointer transition-all duration-200">
                  <Square className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Shapes</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg hover:bg-rose-50 hover:text-rose-600 hover:translate-x-1 sm:hover:translate-x-1.5 active:scale-95 text-[11px] sm:text-xs font-semibold cursor-pointer transition-all duration-200">
                  <Sliders className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  <span>Filters</span>
                </div>
              </div>

              {/* DOWN IMAGE: ANGRY KAZAMA MEME CARD - Straight on mobile */}
              <div
                role="button"
                tabIndex={0}
                onClick={handleSelectStarter}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSelectStarter();
                  }
                }}
                aria-label="Remix Kazama meme"
                className="absolute right-0 xs:right-1 sm:-right-8 -bottom-3 sm:-bottom-7 w-32 xs:w-36 sm:w-52 rounded-2xl bg-white p-1.5 sm:p-2.5 shadow-2xl shadow-rose-950/40 border-2 border-white rotate-0 sm:rotate-2 hover:rotate-0 hover:scale-105 sm:hover:scale-108 hover:-translate-y-1 sm:hover:-translate-y-2 hover:shadow-rose-500/30 transition-all duration-300 cursor-pointer group z-20 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
              >
                {/* Comic Rage Emote Badge */}
                <div className="absolute -top-3.5 -right-2 w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-md animate-bounce z-30">
                  <Flame className="w-4 h-4 text-white" />
                </div>

                <div className="relative rounded-xl overflow-hidden bg-slate-900 aspect-square">
                  <img
                    src="/kazama-angry.jpg"
                    alt="Angry Kazama Meme"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />

                  {/* Top Caption: SHINCHAN!! */}
                  <div
                    className="absolute top-2 inset-x-1 text-center font-['Impact',sans-serif] font-black text-white text-xs sm:text-sm tracking-wider uppercase select-none drop-shadow"
                    style={{
                      textShadow:
                        '2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 0 2px 0 #000',
                    }}
                  >
                    SHINCHAN!!
                  </div>

                  {/* Bottom Caption: STOP IT ALREADY! */}
                  <div
                    className="absolute bottom-2 inset-x-1 text-center font-['Impact',sans-serif] font-black text-amber-300 text-[11px] sm:text-xs tracking-wider uppercase select-none drop-shadow"
                    style={{
                      textShadow:
                        '2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 0 2px 0 #000',
                    }}
                  >
                    STOP IT ALREADY!
                  </div>
                </div>

                {/* Tag and Action Pill */}
                <div className="mt-1.5 flex items-center justify-between text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-lg">
                  <span className="flex items-center gap-1">
                    <span>Kazama</span>
                  </span>
                  <span className="text-slate-400 group-hover:text-rose-600 group-hover:translate-x-0.5 transition-all">
                    Remix ↗
                  </span>
                </div>
              </div>

              {/* Floating Badges with animated float & hover transforms - Straight on mobile */}
              {/* Top Center-Left Font Badge (Aa) */}
              <div className="absolute -top-4 sm:-top-5 left-10 sm:left-24 w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-cyan-400 text-white flex items-center justify-center shadow-lg shadow-sky-500/40 font-extrabold text-xs sm:text-sm border-2 border-white animate-float-delayed rotate-0 hover:scale-120 sm:hover:-rotate-12 transition-transform duration-200 cursor-pointer z-30">
                Aa
              </div>

              {/* Top Right Gold Crown Badge */}
              <div className="absolute -top-4 sm:-top-5 right-7 sm:right-12 w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-300 text-amber-950 flex items-center justify-center shadow-xl shadow-amber-500/30 font-bold text-base sm:text-xl rotate-0 sm:rotate-12 animate-float hover:scale-120 sm:hover:rotate-24 transition-transform duration-200 cursor-pointer border-2 border-white z-30">
                <Crown className="w-5 h-5 text-amber-950" />
              </div>

              {/* Top Right Laughing Emoji Badge */}
              <div className="absolute -top-1 right-0 sm:-right-4 w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-white/95 backdrop-blur-md flex items-center justify-center shadow-lg rotate-0 sm:rotate-6 animate-pulse-subtle hover:scale-120 sm:hover:rotate-12 transition-transform duration-200 cursor-pointer border border-white/60 z-30">
                <Smile className="w-5 h-5 text-amber-500" />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ============================================================== */}
      {/* 2. STATS / METRICS BAR                                          */}
      {/* ============================================================== */}
      <Container size="lg" className="-mt-10 sm:-mt-12 relative z-30">
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 p-2.5 xs:p-3 sm:p-6 grid grid-cols-4 gap-1.5 xs:gap-2 sm:gap-6 items-center">
          {/* Stat 1 */}
          <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-3.5 justify-center sm:justify-start p-1 sm:p-2 rounded-xl hover:bg-slate-50 transition-all duration-200 cursor-pointer group text-center sm:text-left">
            <div className="w-8 h-8 xs:w-9 xs:h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-200 shadow-xs">
              <Grid className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <div className="text-xs xs:text-sm sm:text-2xl font-extrabold text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors leading-tight">500+</div>
              <div className="text-[10px] sm:text-xs text-slate-500 font-medium truncate">
                <span className="sm:hidden">Templates</span>
                <span className="hidden sm:inline">Meme Templates</span>
              </div>
            </div>
          </div>

          {/* Stat 2 */}
          <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-3.5 justify-center sm:justify-start p-1 sm:p-2 rounded-xl hover:bg-slate-50 transition-all duration-200 cursor-pointer group text-center sm:text-left">
            <div className="w-8 h-8 xs:w-9 xs:h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-cyan-500 group-hover:text-white transition-all duration-200 shadow-xs">
              <ShieldCheck className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <div className="text-xs xs:text-sm sm:text-2xl font-extrabold text-slate-900 tracking-tight group-hover:text-cyan-600 transition-colors leading-tight">0</div>
              <div className="text-[10px] sm:text-xs text-slate-500 font-medium truncate">
                <span className="sm:hidden">Watermarks</span>
                <span className="hidden sm:inline">Watermarks on Pro</span>
              </div>
            </div>
          </div>

          {/* Stat 3 */}
          <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-3.5 justify-center sm:justify-start p-1 sm:p-2 rounded-xl hover:bg-slate-50 transition-all duration-200 cursor-pointer group text-center sm:text-left">
            <div className="w-8 h-8 xs:w-9 xs:h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-200 shadow-xs">
              <Layers className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <div className="text-xs xs:text-sm sm:text-2xl font-extrabold text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors leading-tight">100%</div>
              <div className="text-[10px] sm:text-xs text-slate-500 font-medium truncate">
                <span className="sm:hidden">Private</span>
                <span className="hidden sm:inline">Client-Side Speed</span>
              </div>
            </div>
          </div>

          {/* Stat 4 */}
          <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-3.5 justify-center sm:justify-start p-1 sm:p-2 rounded-xl hover:bg-slate-50 transition-all duration-200 cursor-pointer group text-center sm:text-left">
            <div className="w-8 h-8 xs:w-9 xs:h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-amber-400 group-hover:text-amber-950 transition-all duration-200 shadow-xs">
              <Star className="w-4 h-4 sm:w-6 sm:h-6 fill-amber-400 text-amber-400 group-hover:fill-amber-950 group-hover:text-amber-950" />
            </div>
            <div className="min-w-0">
              <div className="text-xs xs:text-sm sm:text-2xl font-extrabold text-slate-900 tracking-tight group-hover:text-amber-600 transition-colors leading-tight">4K</div>
              <div className="text-[10px] sm:text-xs text-slate-500 font-medium truncate">
                <span className="sm:hidden">Ultra-HD</span>
                <span className="hidden sm:inline">Ultra-HD Exports</span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Community Pulse Ticker */}
        <CommunityLiveFeed />
      </Container>

      {/* Main Page Container */}
      <Container size="lg" className="py-12 sm:py-16 lg:py-20 space-y-16 sm:space-y-20 lg:space-y-24">
        {/* ============================================================== */}
        {/* 3. EVERYTHING YOU NEED SECTION                                 */}
        {/* ============================================================== */}
        <section className="text-center space-y-10" aria-label="Feature overview">
          <div className="space-y-2 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Everything You Need to Create Amazing Content
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-normal">
              Powerful tools for memes, GIFs, images and AI generation.
            </p>
          </div>

          {/* 4 Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Card 1: Meme Generator */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 text-center sm:text-left shadow-sm hover:shadow-xl hover:border-blue-400 hover:-translate-y-2.5 transition-all duration-300 group flex flex-col items-center sm:items-start justify-between h-56 cursor-pointer">
              <div className="space-y-4 flex flex-col items-center sm:items-start">
                <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/30 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-600 transition-colors">Meme Generator</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Create classic memes with our easy editor.
                  </p>
                </div>
              </div>
              <a
                href="#create"
                className="text-blue-600 text-sm font-bold flex items-center justify-center sm:justify-start gap-1 group-hover:translate-x-2 transition-transform duration-200"
              >
                <span>Explore →</span>
              </a>
            </div>

            {/* Card 2: GIF Maker */}
            <div
              onClick={() => {
                if (onNavigate) {
                  onNavigate('/gif-maker');
                } else {
                  window.location.hash = '#gif-maker';
                }
              }}
              className="bg-white rounded-2xl border border-slate-200/80 p-6 text-center sm:text-left shadow-sm hover:shadow-xl hover:border-purple-400 hover:-translate-y-2.5 transition-all duration-300 group flex flex-col items-center sm:items-start justify-between h-56 cursor-pointer"
            >
              <div className="space-y-4 flex flex-col items-center sm:items-start">
                <div className="w-12 h-12 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-600/30 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                  <span className="font-bold text-xs tracking-tighter">GIF</span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base group-hover:text-purple-600 transition-colors">GIF Maker</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Turn videos into GIFs or create from images.
                  </p>
                </div>
              </div>
              <a
                href="#gif-maker"
                onClick={(e) => {
                  if (onNavigate) {
                    e.preventDefault();
                    onNavigate('/gif-maker');
                  }
                }}
                className="text-purple-600 text-sm font-bold flex items-center justify-center sm:justify-start gap-1 group-hover:translate-x-2 transition-transform duration-200"
              >
                <span>Explore →</span>
              </a>
            </div>

            {/* Card 3: AI Meme Generator */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 text-center sm:text-left shadow-sm hover:shadow-xl hover:border-cyan-400 hover:-translate-y-2.5 transition-all duration-300 group flex flex-col items-center sm:items-start justify-between h-56 cursor-pointer">
              <div className="space-y-4 flex flex-col items-center sm:items-start">
                <div className="w-12 h-12 rounded-xl bg-cyan-500 text-white flex items-center justify-center shadow-md shadow-cyan-500/30 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                  <Wand2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base group-hover:text-cyan-600 transition-colors">AI Meme Generator</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Generate memes with AI from text prompts.
                  </p>
                </div>
              </div>
              <a
                href="#ai-tools"
                className="text-cyan-600 text-sm font-bold flex items-center justify-center sm:justify-start gap-1 group-hover:translate-x-2 transition-transform duration-200"
              >
                <span>Explore →</span>
              </a>
            </div>

            {/* Card 4: Image Editor */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 text-center sm:text-left shadow-sm hover:shadow-xl hover:border-rose-400 hover:-translate-y-2.5 transition-all duration-300 group flex flex-col items-center sm:items-start justify-between h-56 cursor-pointer">
              <div className="space-y-4 flex flex-col items-center sm:items-start">
                <div className="w-12 h-12 rounded-xl bg-rose-500 text-white flex items-center justify-center shadow-md shadow-rose-500/30 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                  <Sliders className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base group-hover:text-rose-600 transition-colors">Image Editor</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Edit, resize and enhance your images.
                  </p>
                </div>
              </div>
              <a
                href="#create"
                className="text-rose-600 text-sm font-bold flex items-center justify-center sm:justify-start gap-1 group-hover:translate-x-2 transition-transform duration-200"
              >
                <span>Explore →</span>
              </a>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* FEATURE SPOTLIGHTS & DEEP-DIVE                                 */}
        {/* ============================================================== */}
        <FeatureSpotlights />

        {/* ============================================================== */}
        {/* 4. POPULAR MEME TEMPLATES SECTION                              */}
        {/* ============================================================== */}
        <TemplateGrid />

        {/* ============================================================== */}
        {/* 5. INSTANT INTERACTIVE MEME PLAYGROUND                         */}
        {/* ============================================================== */}
        <InteractivePlayground />

        {/* ============================================================== */}
        {/* 5. CREATE MEMES WITH AI SECTION (DAY 6 AI MEME ASSISTANT)      */}
        {/* ============================================================== */}
        <AiAssistantSection onNavigate={onNavigate} />

        {/* ============================================================== */}
        {/* 6. TRENDING MEME UNIVERSES & CATEGORIES                        */}
        {/* ============================================================== */}
        <TrendingGenres />

        {/* ============================================================== */}
        {/* MEME ACADEMY / 4 GOLDEN RULES OF VIRALITY                     */}
        {/* ============================================================== */}
        <MemeProTips />

        {/* ============================================================== */}
        {/* 6. HOW IT WORKS SECTION                                        */}
        {/* ============================================================== */}
        <section className="text-center space-y-12" aria-label="How it works">
          <div className="space-y-2 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              How It Works
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-normal">
              Create and share memes in 3 simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative max-w-5xl mx-auto">
            {/* Dashed connector line between Step 1 and 2 */}
            <div className="hidden md:flex absolute top-8 left-[31%] -translate-x-1/2 items-center text-slate-300 pointer-events-none z-0">
              <div className="w-16 sm:w-20 border-t-2 border-dashed border-blue-200" />
              <ArrowRight className="w-4 h-4 text-blue-300 -ml-1 shrink-0" />
            </div>

            {/* Dashed connector line between Step 2 and 3 */}
            <div className="hidden md:flex absolute top-8 left-[65%] -translate-x-1/2 items-center text-slate-300 pointer-events-none z-0">
              <div className="w-16 sm:w-20 border-t-2 border-dashed border-blue-200" />
              <ArrowRight className="w-4 h-4 text-blue-300 -ml-1 shrink-0" />
            </div>

            {/* Step 1 */}
            <div className="group flex flex-col items-center text-center space-y-3 cursor-pointer p-4 rounded-2xl hover:bg-white hover:shadow-lg hover:-translate-y-2 transition-all duration-300">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-blue-600/30 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  1
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-blue-600 font-bold text-sm pt-1 group-hover:translate-x-1 transition-transform">
                <Upload className="w-4 h-4" />
                <span>Upload or Choose</span>
              </div>
              <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                Start with a template or upload your own image.
              </p>
            </div>

            {/* Step 2 */}
            <div className="group flex flex-col items-center text-center space-y-3 cursor-pointer p-4 rounded-2xl hover:bg-white hover:shadow-lg hover:-translate-y-2 transition-all duration-300">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-cyan-500 text-white flex items-center justify-center shadow-lg shadow-cyan-500/30 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-300">
                  <Edit className="w-7 h-7" />
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-slate-900 group-hover:text-cyan-600 font-bold text-sm pt-1 group-hover:translate-x-1 transition-transform">
                <span>Edit & Customize</span>
              </div>
              <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                Add text, stickers, filters and more.
              </p>
            </div>

            {/* Step 3 */}
            <div className="group flex flex-col items-center text-center space-y-3 cursor-pointer p-4 rounded-2xl hover:bg-white hover:shadow-lg hover:-translate-y-2 transition-all duration-300">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-blue-600/30 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  3
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-blue-600 font-bold text-sm pt-1 group-hover:translate-x-1 transition-transform">
                <Share2 className="w-4 h-4" />
                <span>Download & Share</span>
              </div>
              <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                Get your meme and share it anywhere.
              </p>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 8. WEEKLY VIRAL CONTEST & HALL OF FAME                         */}
        {/* ============================================================== */}
        <WeeklyContest />

        {/* ============================================================== */}
        {/* 7. LATEST MEMES FROM OUR COMMUNITY                             */}
        {/* ============================================================== */}
        <section id="explore" className="scroll-mt-24 space-y-5" aria-label="Community Memes">
          {/* Header Row */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Latest Memes from Our Community
            </h2>
            <a
              href="#community"
              onClick={(e) => {
                if (onNavigate) {
                  e.preventDefault();
                  onNavigate('/community');
                }
              }}
              className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 group cursor-pointer"
            >
              <span>Explore Community Feed</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          {/* 12 Community Meme Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
            {COMMUNITY_MEMES.map((meme) => (
              <div
                key={meme.id}
                onClick={() => setSelectedCommunityMeme(meme)}
                className="group bg-white rounded-xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-2 hover:border-blue-300 transition-all duration-300 flex flex-col justify-between cursor-pointer"
              >
                {/* Thumbnail */}
                <div className="relative aspect-square w-full bg-slate-100 overflow-hidden">
                  <img
                    src={meme.imageUrl}
                    alt={meme.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                  />
                  {/* Subtle Quick View Overlay */}
                  <div className="absolute inset-0 bg-blue-900/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                    <span className="bg-white/95 text-blue-600 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      View
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-2.5 space-y-2">
                  <h3 className="font-semibold text-slate-900 text-xs truncate group-hover:text-blue-600 transition-colors" title={meme.title}>
                    {meme.title}
                  </h3>

                  {/* Author */}
                  <div className="flex items-center gap-1.5">
                    <img
                      src={meme.author.avatarUrl}
                      alt={meme.author.name}
                      className="w-4 h-4 rounded-full object-cover group-hover:ring-1 group-hover:ring-blue-400 transition-all"
                    />
                    <span className="text-[11px] text-slate-500 font-medium truncate">
                      {meme.author.name}
                    </span>
                  </div>

                  {/* Likes & Comments */}
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-100 group-hover:text-slate-600 transition-colors">
                    <span className="flex items-center gap-1 group-hover:text-rose-500 transition-colors">
                      <Heart className="w-3 h-3 group-hover:fill-rose-500 transition-colors" />
                      {meme.likes}
                    </span>
                    <span className="flex items-center gap-1 group-hover:text-blue-500 transition-colors">
                      <MessageCircle className="w-3 h-3" />
                      {meme.comments}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick View Lightbox Modal for Community Memes */}
          {selectedCommunityMeme && (
            <Modal
              isOpen={!!selectedCommunityMeme}
              onClose={() => setSelectedCommunityMeme(null)}
              title={selectedCommunityMeme.title}
              description={`Created by @${selectedCommunityMeme.author.name} • ${selectedCommunityMeme.likes} likes`}
              maxWidth="lg"
            >
              <div className="space-y-4">
                <div className="relative rounded-xl overflow-hidden bg-slate-900 border border-slate-200 flex items-center justify-center max-h-[70vh]">
                  <img
                    src={selectedCommunityMeme.imageUrl}
                    alt={selectedCommunityMeme.title}
                    className="w-full h-auto max-h-[65vh] object-contain rounded-lg"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={selectedCommunityMeme.author.avatarUrl}
                      alt={selectedCommunityMeme.author.name}
                      className="w-9 h-9 rounded-full object-cover border border-slate-200 shadow-2xs"
                    />
                    <div>
                      <p className="text-sm font-bold text-slate-900">{selectedCommunityMeme.author.name}</p>
                      <p className="text-xs text-slate-500">Community Meme Creator</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-semibold text-slate-600">
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-600 border border-rose-100">
                      <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                      {selectedCommunityMeme.likes}
                    </span>
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
                      <MessageCircle className="w-3.5 h-3.5 text-blue-600" />
                      {selectedCommunityMeme.comments}
                    </span>
                  </div>
                </div>
              </div>
            </Modal>
          )}
        </section>

        {/* ============================================================== */}
        {/* 10. EXPORT FORMATS & SOCIAL SHARING                            */}
        {/* ============================================================== */}
        <ExportPlatforms />

        {/* ============================================================== */}
        {/* 8. UPGRADE TO MEMEHUB PRO BANNER                               */}
        {/* ============================================================== */}
        <section
          className="relative bg-gradient-to-r from-[#07246b] via-[#0d3c9e] to-[#1250cf] text-white rounded-3xl p-8 sm:p-12 lg:p-14 overflow-hidden shadow-2xl"
          aria-label="Upgrade to MemeHub Pro"
        >
          {/* Subtle glow (iOS safe radial gradient) */}
          <div
            aria-hidden="true"
            className="absolute top-0 right-0 w-80 h-80 pointer-events-none bg-[radial-gradient(circle_at_top_right,rgba(6,182,212,0.18),transparent_70%)]"
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left Column: Pro Features Checklist */}
            <div className="lg:col-span-7 space-y-5 text-left">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Upgrade to <span className="text-cyan-300">MemeHub Pro</span>
              </h2>
              <p className="text-sm text-blue-100 max-w-lg">
                Get more power, more features and no ads.
              </p>

              {/* 2-column checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs sm:text-sm font-medium text-blue-50">
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2 group cursor-default">
                    <div className="w-4 h-4 rounded-full bg-cyan-400/20 text-cyan-300 flex items-center justify-center shrink-0 group-hover:scale-125 transition-transform">
                      <Check className="w-3 h-3" />
                    </div>
                    <span>No ads</span>
                  </div>
                  <div className="flex items-center gap-2 group cursor-default">
                    <div className="w-4 h-4 rounded-full bg-cyan-400/20 text-cyan-300 flex items-center justify-center shrink-0 group-hover:scale-125 transition-transform">
                      <Check className="w-3 h-3" />
                    </div>
                    <span>Premium templates</span>
                  </div>
                  <div className="flex items-center gap-2 group cursor-default">
                    <div className="w-4 h-4 rounded-full bg-cyan-400/20 text-cyan-300 flex items-center justify-center shrink-0 group-hover:scale-125 transition-transform">
                      <Check className="w-3 h-3" />
                    </div>
                    <span>AI meme generation</span>
                  </div>
                  <div className="flex items-center gap-2 group cursor-default">
                    <div className="w-4 h-4 rounded-full bg-cyan-400/20 text-cyan-300 flex items-center justify-center shrink-0 group-hover:scale-125 transition-transform">
                      <Check className="w-3 h-3" />
                    </div>
                    <span>GIF and video tools</span>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <div className="flex items-center gap-2 group cursor-default">
                    <div className="w-4 h-4 rounded-full bg-cyan-400/20 text-cyan-300 flex items-center justify-center shrink-0 group-hover:scale-125 transition-transform">
                      <Check className="w-3 h-3" />
                    </div>
                    <span>High quality exports</span>
                  </div>
                  <div className="flex items-center gap-2 group cursor-default">
                    <div className="w-4 h-4 rounded-full bg-cyan-400/20 text-cyan-300 flex items-center justify-center shrink-0 group-hover:scale-125 transition-transform">
                      <Check className="w-3 h-3" />
                    </div>
                    <span>Custom watermarks</span>
                  </div>
                  <div className="flex items-center gap-2 group cursor-default">
                    <div className="w-4 h-4 rounded-full bg-cyan-400/20 text-cyan-300 flex items-center justify-center shrink-0 group-hover:scale-125 transition-transform">
                      <Check className="w-3 h-3" />
                    </div>
                    <span>Priority support</span>
                  </div>
                  <div className="flex items-center gap-2 group cursor-default">
                    <div className="w-4 h-4 rounded-full bg-cyan-400/20 text-cyan-300 flex items-center justify-center shrink-0 group-hover:scale-125 transition-transform">
                      <Check className="w-3 h-3" />
                    </div>
                    <span>And more...</span>
                  </div>
                </div>
              </div>

              {/* View Pricing Button */}
              <div className="pt-4">
                <a
                  href="#pricing"
                  onClick={(e) => {
                    if (onNavigate) {
                      e.preventDefault();
                      onNavigate('/pricing');
                    }
                  }}
                  className="inline-flex items-center gap-2 bg-white hover:bg-[#EFF6FF] text-[#1463E9] hover:text-[#0E52C7] font-bold text-sm px-6 py-3 rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
                >
                  <span>View Pricing Plans</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>

            {/* Right Column: Floating Pro Cards Stack - Straight on mobile */}
            <div className="lg:col-span-5 relative flex items-center justify-center pt-6 lg:pt-0">
              <div className="relative w-64 sm:w-72">
                {/* Sunglasses cat card */}
                <div className="rounded-2xl overflow-hidden bg-white p-2 shadow-2xl border border-white/40 rotate-0 sm:-rotate-3 hover:rotate-0 hover:scale-105 transition-all duration-300 cursor-pointer">
                  <div className="relative rounded-xl overflow-hidden aspect-[4/3] bg-slate-900">
                    <img
                      src="https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=400&auto=format&fit=crop&q=80"
                      alt="Pro Meme Sunglasses Cat"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2.5 inset-x-2 text-center font-extrabold text-white text-xs tracking-wider uppercase drop-shadow-md">
                      GOOD IDEAS
                    </div>
                    <div className="absolute bottom-2.5 inset-x-2 text-center font-extrabold text-white text-xs tracking-wider uppercase drop-shadow-md">
                      BETTER MEMES
                    </div>
                  </div>
                </div>

                {/* Level Up Dog Card */}
                <div className="absolute -bottom-3 sm:-bottom-6 right-0 sm:-right-6 w-36 sm:w-40 bg-white p-1.5 rounded-xl shadow-2xl rotate-0 sm:rotate-6 hover:rotate-0 hover:scale-105 sm:hover:scale-110 transition-all duration-300 border border-slate-100 cursor-pointer">
                  <div className="relative rounded-lg overflow-hidden aspect-square bg-slate-900">
                    <img
                      src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&auto=format&fit=crop&q=80"
                      alt="Pro Meme Happy Dog"
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-1.5 inset-x-1 text-center font-extrabold text-white text-[10px] uppercase drop-shadow">
                      LEVEL UP
                    </div>
                    <div className="absolute bottom-1.5 inset-x-1 text-center font-extrabold text-white text-[10px] uppercase drop-shadow">
                      MUCH PRO
                    </div>
                  </div>
                </div>

                {/* Floating Gold Crown Badge */}
                <div className="absolute -top-4 -left-1 sm:-left-3 w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-400 text-amber-950 flex items-center justify-center font-bold text-base sm:text-lg shadow-xl rotate-0 sm:-rotate-12 animate-float hover:scale-120 sm:hover:rotate-12 transition-transform cursor-pointer">
                  <Crown className="w-5 h-5 text-amber-950" />
                </div>

                {/* Floating Blue Star Badge */}
                <div className="absolute -top-2 right-0 sm:-right-2 w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-blue-500 text-white flex items-center justify-center font-bold text-xs sm:text-sm shadow-lg shadow-blue-500/30 rotate-0 sm:rotate-6 animate-float-delayed hover:scale-120 sm:hover:-rotate-12 transition-transform cursor-pointer">
                  <Star className="w-4 h-4 text-white fill-white" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* PRICING PLANS SECTION                                          */}
        {/* ============================================================== */}
        <PricingSection onNavigate={onNavigate} />

        {/* ============================================================== */}
        {/* MEME CULTURE BLOG & VIRAL GUIDES                               */}
        {/* ============================================================== */}
        <TrendingArticles />

        {/* ============================================================== */}
        {/* FREQUENTLY ASKED QUESTIONS (FAQ)                               */}
        {/* ============================================================== */}
        <FaqSection />

        {/* ============================================================== */}
        {/* GRAND PRE-FOOTER COMMUNITY CTA BANNER                          */}
        {/* ============================================================== */}
        <CommunityBanner />
      </Container>

      {/* Global Template Preview Modal (For Interactive Testing) */}
      <TemplatePreviewModal />
    </div>
  );
};
