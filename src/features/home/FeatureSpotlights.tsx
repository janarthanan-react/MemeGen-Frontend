import React from 'react';
import {
  Type,
  Smile,
  Video,
  CheckCircle2,
  Zap,
  Flame,
  Crown,
  Star,
  Target,
  Shield,
  Heart,
  Trophy,
  Rocket,
  ThumbsUp,
  Eye,
  Bell,
} from 'lucide-react';

export const FeatureSpotlights: React.FC = () => {
  return (
    <section id="features" className="scroll-mt-24 space-y-20 sm:space-y-24" aria-label="Feature Spotlights">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider">
          <Zap className="w-3.5 h-3.5" />
          <span>Under The Hood</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Engineered for Speed, Precision & Quality
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 font-normal">
          Explore the professional tools that turn simple image templates into viral internet sensations.
        </p>
      </div>

      {/* Row 1: Smart Text Engine */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        {/* Visual Mockup */}
        <div className="lg:col-span-6 bg-slate-50 border border-slate-200/90 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-bold text-slate-800">Typography Controls</span>
              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                Impact • 64px
              </span>
            </div>

            {/* Simulated Canvas Box */}
            <div className="relative rounded-xl bg-slate-900 aspect-video flex items-center justify-center p-4 overflow-hidden group cursor-pointer">
              <img
                src="https://i.imgflip.com/30b1gx.jpg"
                alt="Drake Template"
                className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
              />
              <div
                className="absolute inset-x-2 text-center font-extrabold text-white text-lg sm:text-xl uppercase select-none tracking-wider drop-shadow-md group-hover:scale-105 transition-transform duration-300"
                style={{
                  textShadow: '2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000',
                }}
              >
                SMART TEXT ENGINE
              </div>
            </div>

            {/* Controls Bar */}
            <div className="grid grid-cols-3 gap-2 pt-1 text-[11px] font-semibold text-slate-600">
              <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 text-center hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors cursor-pointer">
                Font: Impact
              </div>
              <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 text-center hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors cursor-pointer">
                Stroke: 4px
              </div>
              <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 text-center hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors cursor-pointer">
                Shadow: Soft
              </div>
            </div>
          </div>
        </div>

        {/* Text Details */}
        <div className="lg:col-span-6 space-y-5 text-center lg:text-left flex flex-col items-center lg:items-start">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center hover:scale-110 hover:rotate-6 transition-transform">
            <Type className="w-5 h-5" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight text-center lg:text-left">
            200+ Viral Fonts with Pixel-Perfect Outlines
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed text-center lg:text-left max-w-xl">
            Never struggle with unreadable text again. Our smart text rendering engine automatically adjusts outline thickness, vertical spacing, and character kerning for maximum punchiness.
          </p>

          <ul className="space-y-2.5 text-xs text-slate-700 font-medium text-left inline-block">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Classic Impact, Bebas Neue, Comic Sans, Inter, and retro pixel fonts</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Multi-layer text boxes with independent rotation and scaling</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Adjustable stroke depth, shadow blur, and curved banner text</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Row 2: Sticker & Emoji Vault (Reversed on desktop) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        {/* Text Details */}
        <div className="lg:col-span-6 space-y-5 text-center lg:text-left order-2 lg:order-1 flex flex-col items-center lg:items-start">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center hover:scale-110 hover:rotate-6 transition-transform">
            <Smile className="w-5 h-5" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight text-center lg:text-left">
            Infinite Stickers, Laser Eyes & Reaction Packs
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed text-center lg:text-left max-w-xl">
            Elevate any photo with classic internet reaction stickers. Add glowing red laser eyes, pixelated thug-life sunglasses, Wojaks, Pepe masks, speech bubbles, and custom badge layers.
          </p>

          <ul className="space-y-2.5 text-xs text-slate-700 font-medium text-left inline-block">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
              <span>One-click laser eyes with adjustable glow and angle</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
              <span>10,000+ transparent PNG stickers and meme badges</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Custom sticker upload from your own camera roll</span>
            </li>
          </ul>
        </div>

        {/* Visual Mockup */}
        <div className="lg:col-span-6 bg-slate-50 border border-slate-200/90 rounded-3xl p-6 shadow-sm order-1 lg:order-2 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-bold text-slate-800">Sticker Palette</span>
              <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                Vector Ready
              </span>
            </div>

            {/* Sticker Tray Grid */}
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2.5 py-4">
              {[
                { icon: Flame, color: 'text-amber-500' },
                { icon: Crown, color: 'text-yellow-500' },
                { icon: Zap, color: 'text-cyan-500' },
                { icon: Star, color: 'text-amber-400' },
                { icon: Target, color: 'text-rose-500' },
                { icon: Shield, color: 'text-blue-500' },
                { icon: Heart, color: 'text-rose-500' },
                { icon: Trophy, color: 'text-amber-500' },
                { icon: Rocket, color: 'text-purple-500' },
                { icon: ThumbsUp, color: 'text-blue-600' },
                { icon: Eye, color: 'text-emerald-500' },
                { icon: Bell, color: 'text-amber-500' },
              ].map((item, idx) => {
                const ItemIcon = item.icon;
                return (
                  <div
                    key={idx}
                    className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center hover:scale-125 hover:-rotate-6 hover:bg-[#EFF6FF] hover:border-[#1463E9]/30 hover:shadow-md active:scale-95 transition-all cursor-pointer shadow-2xs"
                  >
                    <ItemIcon className={`w-5 h-5 ${item.color}`} />
                  </div>
                );
              })}
            </div>

            <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-100 flex items-center justify-between text-xs text-amber-900 font-medium">
              <span>Laser Eyes Effect</span>
              <span className="font-bold text-amber-700">Enabled</span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: GIF Maker & Video Looper */}
      <div id="gif-maker" className="scroll-mt-24 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        {/* Visual Mockup */}
        <div className="lg:col-span-6 bg-slate-50 border border-slate-200/90 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-bold text-slate-800">GIF Looper & Speed</span>
              <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded">
                60 FPS • 2.4 MB
              </span>
            </div>

            {/* Video Timeline Preview */}
            <div className="relative rounded-xl overflow-hidden bg-slate-900 aspect-video flex items-center justify-center group cursor-pointer">
              <img
                src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=500&auto=format&fit=crop&q=80"
                alt="GIF frame"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute bottom-2 inset-x-2 bg-black/60 backdrop-blur-xs p-1.5 rounded-lg flex items-center justify-between text-white text-[10px]">
                <span>00:01.4 / 00:03.0</span>
                <span>Loop: Infinite</span>
              </div>
            </div>

            {/* Speed Pills */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-slate-500 font-medium">Playback Speed:</span>
              <div className="flex gap-1.5">
                {['0.5x', '1x', '1.5x', '2x'].map((speed, i) => (
                  <button
                    key={speed}
                    type="button"
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:outline-none ${
                      i === 1 ? 'bg-purple-600 text-white shadow-2xs' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                    }`}
                  >
                    {speed}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Text Details */}
        <div className="lg:col-span-6 space-y-5 text-center lg:text-left flex flex-col items-center lg:items-start">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Video className="w-5 h-5" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight text-center lg:text-left">
            Animated GIF Generator & Smart Compressor
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed text-center lg:text-left max-w-xl">
            Turn short video clips, screen captures, and live photos into lightweight looping GIFs optimized for Discord, Slack, and X without hitting upload file size limits.
          </p>

          <ul className="space-y-2.5 text-xs text-slate-700 font-medium text-left inline-block">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
              <span>Trim video clips to the exact microsecond for punchy timing</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
              <span>Synchronized text overlays that animate along with the frame</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
              <span>Smart palette reduction algorithm for razor-sharp, compact files</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};
