import React, { useState } from 'react';
import { Check, ArrowRight, Zap, Crown, Users } from 'lucide-react';
import { useSubscriptionStore } from '../../stores/useSubscriptionStore';

export interface PricingSectionProps {
  onNavigate?: (route: string) => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onNavigate }) => {
  const [annualBilling, setAnnualBilling] = useState(true);
  const selectPlanForCheckout = useSubscriptionStore((state) => state.selectPlanForCheckout);
  const setBillingCycle = useSubscriptionStore((state) => state.setBillingCycle);

  return (
    <section id="pricing" className="scroll-mt-24 space-y-12" aria-label="Pricing Plans">
      {/* Header & Billing Toggle */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider">
          <Zap className="w-3.5 h-3.5" />
          <span>Transparent Plans</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Simple Pricing for Creators of All Sizes
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 font-normal">
          Start for free forever. Upgrade anytime to unlock watermark-free exports, unlimited AI, and 4K resolution.
        </p>

        {/* Toggle Pill */}
        <div className="pt-2 flex items-center justify-center gap-3 text-xs font-semibold">
          <span className={!annualBilling ? 'text-slate-900 font-bold' : 'text-slate-500'}>
            Monthly
          </span>
          <button
            type="button"
            onClick={() => setAnnualBilling(!annualBilling)}
            className="w-12 h-6.5 bg-[#1463E9] rounded-full p-0.5 transition-all relative cursor-pointer focus-visible:ring-2 focus-visible:ring-[#1463E9] focus-visible:ring-offset-2 focus-visible:outline-none hover:opacity-95 active:scale-95"
            aria-label="Toggle annual billing"
          >
            <div
              className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200 ${
                annualBilling ? 'translate-x-5.5' : 'translate-x-0'
              }`}
            />
          </button>
          <span className={annualBilling ? 'text-slate-900 font-bold' : 'text-slate-500'}>
            Yearly
          </span>
          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
            Save 20%
          </span>
        </div>
      </div>

      {/* 3 Pricing Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
        {/* Tier 1: Free */}
        <div className="bg-white rounded-3xl border border-slate-200 p-7 flex flex-col justify-between shadow-xs hover:shadow-xl hover:-translate-y-2 hover:border-blue-300 transition-all duration-300 text-left group">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">Free Forever</h3>
              <p className="text-xs text-slate-500 mt-1">
                Everything you need to create and share everyday memes.
              </p>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-slate-900">$0</span>
              <span className="text-xs text-slate-500">/ forever</span>
            </div>

            <ul className="space-y-3 text-xs text-slate-600">
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-blue-600 shrink-0" />
                <span>500K+ public meme templates</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Unlimited standard HD downloads</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-blue-600 shrink-0" />
                <span>5 AI meme prompts per day</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Basic stickers and custom text layers</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Community explore feed access</span>
              </li>
            </ul>
          </div>

          <div className="pt-8">
            <a
              href="#templates"
              onClick={(e) => {
                e.preventDefault();
                if (onNavigate) {
                  onNavigate('#templates');
                } else {
                  document.getElementById('templates')?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="w-full py-3 px-4 rounded-2xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs flex items-center justify-center shadow-2xs hover:shadow-xs transition-all duration-200 cursor-pointer hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              Get Started Free
            </a>
          </div>
        </div>

        {/* Tier 2: Pro (Featured) */}
        <div className="bg-gradient-to-b from-[#071d49] to-[#0c2e7a] text-white rounded-3xl p-7 flex flex-col justify-between shadow-2xl relative border-2 border-blue-400 text-left hover:scale-103 hover:shadow-blue-500/30 transition-all duration-300 group">
          {/* Top Badge */}
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-amber-300 text-amber-950 text-[11px] font-extrabold px-3 py-1 rounded-full shadow-md flex items-center gap-1 uppercase tracking-wider animate-pulse-subtle">
            <Crown className="w-3.5 h-3.5" />
            <span>Most Popular</span>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-1.5">
                <span>MemeHub Pro</span>
                <Zap className="w-4 h-4 text-cyan-300" />
              </h3>
              <p className="text-xs text-blue-200 mt-1">
                For power creators, meme pages, and serious content creators.
              </p>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-white">
                {annualBilling ? '$3.99' : '$4.99'}
              </span>
              <span className="text-xs text-blue-200">/ month</span>
            </div>

            <ul className="space-y-3 text-xs text-blue-100">
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-cyan-300 shrink-0" />
                <span className="font-semibold text-white">100% Watermark-free exports</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-cyan-300 shrink-0" />
                <span className="font-semibold text-white">Unlimited high-speed AI generations</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-cyan-300 shrink-0" />
                <span>Ultra 4K crystal-clear export resolution</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-cyan-300 shrink-0" />
                <span>Full GIF Maker & video animation studio</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-cyan-300 shrink-0" />
                <span>200+ exclusive creator fonts & stickers</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-cyan-300 shrink-0" />
                <span>Priority rendering & ad-free experience</span>
              </li>
            </ul>
          </div>

          <div className="pt-8">
            <button
              type="button"
              onClick={() => {
                const cycle = annualBilling ? 'yearly' : 'monthly';
                setBillingCycle(cycle);
                selectPlanForCheckout('pro', cycle);
                if (onNavigate) {
                  onNavigate('/checkout');
                } else {
                  window.location.href = '/checkout';
                }
              }}
              className="w-full py-3.5 px-4 rounded-2xl bg-[#1463E9] hover:bg-[#0E52C7] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(20,99,233,0.4)] hover:shadow-[0_8px_24px_rgba(20,99,233,0.5)] transition-all duration-200 cursor-pointer hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:outline-none group"
            >
              <span>Upgrade to Pro Now</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Tier 3: Teams & Brands */}
        <div className="bg-white rounded-3xl border border-slate-200 p-7 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow text-left">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-purple-600" />
                <span>Agency & Teams</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                For social media agencies, marketing teams, and multi-brand creators.
              </p>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-slate-900">
                {annualBilling ? '$11.99' : '$14.99'}
              </span>
              <span className="text-xs text-slate-500">/ month</span>
            </div>

            <ul className="space-y-3 text-xs text-slate-600">
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Everything in Pro for up to 5 seats</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="font-semibold text-slate-900">Custom branded team watermark manager</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Shared team templates & collaborative drafts</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Social post scheduler & cloud archives</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Dedicated account manager & priority support</span>
              </li>
            </ul>
          </div>

          <div className="pt-8">
            <button
              type="button"
              onClick={() => {
                const cycle = annualBilling ? 'yearly' : 'monthly';
                setBillingCycle(cycle);
                selectPlanForCheckout('premium', cycle);
                if (onNavigate) {
                  onNavigate('/checkout');
                } else {
                  window.location.href = '/checkout';
                }
              }}
              className="w-full py-3 px-4 rounded-2xl border border-[#1463E9]/30 hover:border-[#1463E9] bg-white hover:bg-[#EFF6FF] text-[#1463E9] hover:text-[#0E52C7] font-bold text-xs flex items-center justify-center shadow-2xs hover:shadow-xs transition-all duration-200 cursor-pointer hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-[#1463E9] focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              Start 14-Day Team Trial
            </button>
          </div>
        </div>
      </div>

      {/* Link to Dedicated Pricing Page */}
      <div className="text-center pt-2">
        <button
          type="button"
          onClick={() => {
            if (onNavigate) {
              onNavigate('/pricing');
            } else {
              window.location.href = '/pricing';
            }
          }}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#1463E9] hover:text-[#0E52C7] hover:underline cursor-pointer transition-colors duration-200"
        >
          <span>Compare full feature breakdown and FAQ on the Pricing page &rarr;</span>
        </button>
      </div>
    </section>
  );
};
