import React from 'react';
import { Check, X, Zap, Crown, Layers } from 'lucide-react';
import type { SubscriptionPlan, BillingCycle, PlanId } from '../../types/subscription';
import { Button } from '../../components/ui/Button';

export interface PlanCardProps {
  plan: SubscriptionPlan;
  billingCycle: BillingCycle;
  isCurrentPlan: boolean;
  onSelect: (planId: PlanId) => void;
}

export const PlanCard: React.FC<PlanCardProps> = ({
  plan,
  billingCycle,
  isCurrentPlan,
  onSelect,
}) => {
  const isFree = plan.id === 'free';
  const isPro = plan.id === 'pro';
  const isPremium = plan.id === 'premium';

  // Calculate pricing displays
  let priceDisplay = '₹0';
  let periodDisplay = '/ month';
  let billingNote = 'Free forever';

  if (!isFree) {
    if (billingCycle === 'yearly') {
      const effectiveMonthly = Math.round(plan.yearlyPrice / 12);
      priceDisplay = `₹${effectiveMonthly}`;
      periodDisplay = '/ month';
      const yearlySavings = plan.monthlyPrice * 12 - plan.yearlyPrice;
      billingNote = `Billed annually at ₹${plan.yearlyPrice.toLocaleString('en-IN')}/yr (Save ₹${yearlySavings.toLocaleString('en-IN')})`;
    } else {
      priceDisplay = `₹${plan.monthlyPrice}`;
      periodDisplay = '/ month';
      billingNote = 'Billed monthly, cancel anytime';
    }
  }

  return (
    <div
      className={`relative rounded-3xl flex flex-col transition-all duration-300 ${
        isPro
          ? 'bg-gradient-to-b from-blue-50/80 via-white to-white border-2 border-blue-500 shadow-xl shadow-blue-500/10 scale-102 lg:-translate-y-2 z-10'
          : isPremium
          ? 'bg-white border-2 border-purple-200 hover:border-purple-300 shadow-lg shadow-purple-500/5'
          : 'bg-white border border-slate-200 hover:border-slate-300 shadow-sm'
      }`}
    >
      {/* Top Floating Badge */}
      {plan.badge && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20">
          <span
            className={`inline-flex items-center gap-1 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-md ${
              isPro
                ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-blue-500/30 ring-2 ring-white'
                : 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-purple-500/30 ring-2 ring-white'
            }`}
          >
            {isPro && <Zap className="w-3 h-3 fill-current" />}
            {isPremium && <Crown className="w-3 h-3 fill-current" />}
            {plan.badge}
          </span>
        </div>
      )}

      <div className="p-6 sm:p-8 flex flex-col flex-1">
        {/* Header: Plan Name & Icon */}
        <div className="flex items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                isPro
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : isPremium
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              {isFree && <Layers className="w-5 h-5 text-slate-700" />}
              {isPro && <Zap className="w-5 h-5 text-white" />}
              {isPremium && <Crown className="w-5 h-5 text-white" />}
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">{plan.name}</h3>
            </div>
          </div>

          {isCurrentPlan && (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200 shrink-0">
              Active Plan
            </span>
          )}
        </div>

        {/* Tagline */}
        <p className="text-xs sm:text-sm text-slate-500 font-medium min-h-[38px] mb-6 leading-relaxed">
          {plan.tagline}
        </p>

        {/* Price Card Section */}
        <div className="mb-6 p-4 rounded-2xl bg-slate-50 border border-slate-100">
          <div className="flex items-baseline gap-1">
            <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {priceDisplay}
            </span>
            <span className="text-xs sm:text-sm font-semibold text-slate-500">
              {periodDisplay}
            </span>
          </div>
          <p className="text-[11px] font-medium text-slate-500 mt-1.5 flex items-center gap-1.5">
            <span>{billingNote}</span>
          </p>
        </div>

        {/* Call to action button */}
        <div className="mb-8">
          {isCurrentPlan ? (
            <Button
              variant="outline"
              size="lg"
              disabled
              className="w-full rounded-2xl font-bold cursor-default border-slate-300 text-slate-500 bg-slate-100"
            >
              Current Active Plan
            </Button>
          ) : (
            <Button
              variant={isPro ? 'primary' : isPremium ? 'primary' : 'outline'}
              size="lg"
              onClick={() => onSelect(plan.id)}
              className={`w-full rounded-2xl font-bold transition-all duration-200 cursor-pointer ${
                isPro
                  ? 'bg-[#1463E9] hover:bg-[#0E52C7] text-white shadow-[0_4px_16px_rgba(20,99,233,0.38)] hover:shadow-[0_8px_24px_rgba(20,99,233,0.48)] border border-[#2B7AF7]/40'
                  : isPremium
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-[0_4px_16px_rgba(147,51,234,0.38)] hover:shadow-[0_8px_24px_rgba(147,51,234,0.48)] border border-purple-400/30'
                  : 'bg-white hover:bg-[#EFF6FF] text-[#1463E9] hover:text-[#0E52C7] border border-[#1463E9]/30 hover:border-[#1463E9] shadow-2xs hover:shadow-xs'
              }`}
            >
              {plan.ctaText}
            </Button>
          )}
        </div>

        {/* Feature List */}
        <div className="space-y-3.5 flex-1">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Included in {plan.name}:
          </p>
          <ul className="space-y-2.5">
            {plan.features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
                <span className="leading-tight">{feature}</span>
              </li>
            ))}
          </ul>

          {/* Limitations for free */}
          {plan.limitations && plan.limitations.length > 0 && (
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Not included:
              </p>
              <ul className="space-y-2">
                {plan.limitations.map((lim, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-400">
                    <div className="w-4 h-4 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center shrink-0 mt-0.5">
                      <X className="w-2.5 h-2.5 stroke-[2]" />
                    </div>
                    <span className="leading-tight">{lim}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

