import React, { useEffect } from 'react';
import { ArrowLeft, ShieldCheck, Zap, HeartHandshake } from 'lucide-react';
import { Container } from '../components/ui/Container';
import { SUBSCRIPTION_PLANS } from '../constants/subscription';
import { useSubscriptionStore } from '../stores/useSubscriptionStore';
import { BillingToggle } from '../features/subscription/BillingToggle';
import { PlanCard } from '../features/subscription/PlanCard';
import { FeatureComparisonTable } from '../features/subscription/FeatureComparisonTable';
import { SubscriptionManagement } from '../features/subscription/SubscriptionManagement';
import { PricingFaq } from '../features/subscription/PricingFaq';
import type { PlanId } from '../types/subscription';
import { useTemplateStore } from '../stores/useTemplateStore';

export interface PricingPageProps {
  onNavigate: (route: string) => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({ onNavigate }) => {
  const billingCycle = useSubscriptionStore((state) => state.billingCycle);
  const setBillingCycle = useSubscriptionStore((state) => state.setBillingCycle);
  const currentSubscription = useSubscriptionStore((state) => state.currentSubscription);
  const selectPlanForCheckout = useSubscriptionStore((state) => state.selectPlanForCheckout);
  const setNotification = useTemplateStore((state) => state.setNotification);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleSelectPlan = (planId: PlanId) => {
    if (planId === currentSubscription.planId) {
      setNotification({
        type: 'info',
        message: `You are currently on the ${planId.toUpperCase()} tier.`,
      });
      return;
    }

    if (planId === 'free') {
      useSubscriptionStore.getState().resetToFree();
      setNotification({
        type: 'info',
        message: 'Switched to Free Tier.',
      });
      return;
    }

    selectPlanForCheckout(planId, billingCycle);
    onNavigate('/checkout');
  };

  const isPaidUser = currentSubscription.planId !== 'free';

  return (
    <div className="min-h-screen bg-slate-50/70 pt-24 sm:pt-28 pb-24">
      <Container className="space-y-12 sm:space-y-16">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => onNavigate('/')}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-500 hover:text-[#1463E9] transition-all duration-200 active:scale-95 cursor-pointer py-1 px-2.5 rounded-xl hover:bg-[#EFF6FF]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('/editor')}
            className="text-xs font-semibold text-[#1463E9] hover:underline cursor-pointer active:scale-95 transition-all duration-200 py-1 px-2.5 rounded-xl hover:bg-[#EFF6FF]"
          >
            Open Meme Studio &rarr;
          </button>
        </div>

        {/* Hero Section */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-black uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5" />
            <span>Flexible, Transparent Plans</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Supercharge Your <span className="text-blue-600">Meme Creation</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-500 font-medium leading-relaxed">
            Choose the plan that fits your creative ambitions. Upgrade for watermark-free exports, 4K resolution, and AI superpowers.
          </p>

          {/* Demo Pricing Notice Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200/80 text-xs font-semibold shadow-xs">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span>Demo Pricing Mode: Safe mock checkout with simulated payments.</span>
          </div>
        </div>

        {/* Active Subscription Management Card if Paid User */}
        {isPaidUser && (
          <section aria-label="Current Subscription Management">
            <SubscriptionManagement
              onNavigate={onNavigate}
              onUpgradeClick={() => {
                const el = document.getElementById('pricing-plans');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
            />
          </section>
        )}

        {/* Billing Cycle Toggle */}
        <div id="pricing-plans" className="pt-2">
          <BillingToggle cycle={billingCycle} onChange={setBillingCycle} />
        </div>

        {/* 3 Pricing Cards Grid */}
        <section aria-label="Subscription Plans Grid">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch">
            {SUBSCRIPTION_PLANS.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                billingCycle={billingCycle}
                isCurrentPlan={currentSubscription.planId === plan.id}
                onSelect={handleSelectPlan}
              />
            ))}
          </div>
        </section>

        {/* Trust & Guarantee Highlights */}
        <section
          aria-label="Trust Highlights"
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-slate-900">Instant Activation</p>
              <p className="text-xs text-slate-500 font-medium">Unlocked immediately upon demo checkout</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-slate-900">Cancel Anytime</p>
              <p className="text-xs text-slate-500 font-medium">Zero penalties or locked-in contracts</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-slate-900">100% Risk Free</p>
              <p className="text-xs text-slate-500 font-medium">Safe demo testing for all creators</p>
            </div>
          </div>
        </section>

        {/* Feature Comparison Matrix */}
        <section aria-label="Feature Comparison Matrix">
          <FeatureComparisonTable />
        </section>

        {/* FAQ Section */}
        <section aria-label="Frequently Asked Questions">
          <PricingFaq />
        </section>
      </Container>
    </div>
  );
};

export default PricingPage;

