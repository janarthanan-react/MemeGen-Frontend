import React, { useState } from 'react';
import { Crown, Zap, Layers, Calendar, CreditCard, ShieldCheck, RefreshCw, AlertCircle } from 'lucide-react';
import { useSubscriptionStore } from '../../stores/useSubscriptionStore';
import { useTemplateStore } from '../../stores/useTemplateStore';
import { Button } from '../../components/ui/Button';

export interface SubscriptionManagementProps {
  onNavigate?: (route: string) => void;
  onUpgradeClick?: () => void;
}

export const SubscriptionManagement: React.FC<SubscriptionManagementProps> = ({
  onNavigate,
  onUpgradeClick,
}) => {
  const currentSubscription = useSubscriptionStore((state) => state.currentSubscription);
  const cancelSubscription = useSubscriptionStore((state) => state.cancelSubscription);
  const resetToFree = useSubscriptionStore((state) => state.resetToFree);
  const setBillingCycle = useSubscriptionStore((state) => state.setBillingCycle);
  const selectPlanForCheckout = useSubscriptionStore((state) => state.selectPlanForCheckout);
  const setNotification = useTemplateStore((state) => state.setNotification);

  const [confirmCancelOpen, setConfirmCancelOpen] = useState(false);

  const isFree = currentSubscription.planId === 'free';
  const isCancelled = currentSubscription.status === 'cancelled';
  const isPro = currentSubscription.planId === 'pro';
  const isPremium = currentSubscription.planId === 'premium';

  const handleCancel = () => {
    cancelSubscription();
    setConfirmCancelOpen(false);
    setNotification({
      type: 'info',
      message: 'Demo subscription cancelled. Access remains active until the end of your billing cycle.',
    });
  };

  const handleSwitchToYearly = () => {
    setBillingCycle('yearly');
    selectPlanForCheckout(currentSubscription.planId, 'yearly');
    if (onNavigate) {
      onNavigate('/checkout');
    }
  };

  const handleUpgradeToPremium = () => {
    selectPlanForCheckout('premium', currentSubscription.billingCycle);
    if (onNavigate) {
      onNavigate('/checkout');
    }
  };

  const handleResetFree = () => {
    resetToFree();
    setNotification({
      type: 'info',
      message: 'Account reset back to Free Tier.',
    });
  };

  return (
    <div className="w-full bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
      {/* Top Banner & Plan Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
              isPremium
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : isPro
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'bg-slate-100 text-slate-700'
            }`}
          >
            {isPremium && <Crown className="w-6 h-6 fill-current" />}
            {isPro && <Zap className="w-6 h-6 fill-current" />}
            {isFree && <Layers className="w-6 h-6" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-black text-slate-900 capitalize">
                {currentSubscription.planId} Tier
              </h3>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase ${
                  isCancelled
                    ? 'bg-amber-100 text-amber-800 border border-amber-200'
                    : isFree
                    ? 'bg-slate-100 text-slate-700 border border-slate-200'
                    : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                }`}
              >
                {isCancelled ? 'Cancelling at end of term' : isFree ? 'Free Active' : 'Active Subscription'}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              {isFree
                ? 'Enjoy basic meme editing or upgrade for unlimited creative tools.'
                : `Active ${currentSubscription.billingCycle} billing cycle. No watermarks enabled.`}
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-2 shrink-0">
          {isFree ? (
            <Button
              variant="primary"
              size="sm"
              onClick={onUpgradeClick || (() => onNavigate?.('/pricing'))}
              className="rounded-xl shadow-md font-bold"
            >
              <Zap className="w-4 h-4 mr-1.5" />
              <span>Upgrade Plan</span>
            </Button>
          ) : isPro ? (
            <Button
              variant="primary"
              size="sm"
              onClick={handleUpgradeToPremium}
              className="rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow-md font-bold"
            >
              <Crown className="w-4 h-4 mr-1.5" />
              <span>Upgrade to Premium</span>
            </Button>
          ) : null}
        </div>
      </div>

      {/* Subscription Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Billing Cycle */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
          <Calendar className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Billing Frequency
            </p>
            <p className="text-sm font-extrabold text-slate-900 capitalize mt-0.5">
              {isFree ? 'None (Free Forever)' : `${currentSubscription.billingCycle} Renewal`}
            </p>
          </div>
        </div>

        {/* Renewal Date */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
          <RefreshCw className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Next Renewal / Term
            </p>
            <p className="text-sm font-extrabold text-slate-900 mt-0.5">
              {currentSubscription.renewalDate || 'N/A'}
            </p>
          </div>
        </div>

        {/* Payment Method */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
          <CreditCard className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Payment Method
            </p>
            <p className="text-sm font-extrabold text-slate-900 truncate max-w-[140px] mt-0.5" title={currentSubscription.paymentMethod}>
              {currentSubscription.paymentMethod || 'None'}
            </p>
          </div>
        </div>

        {/* Order Reference */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-cyan-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Order Reference
            </p>
            <p className="text-sm font-extrabold text-slate-900 truncate max-w-[140px] mt-0.5" title={currentSubscription.orderId}>
              {currentSubscription.orderId || 'FREE-TIER'}
            </p>
          </div>
        </div>
      </div>

      {/* Subscription Actions & Demo Controls */}
      {!isFree && (
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            {currentSubscription.billingCycle === 'monthly' && !isCancelled && (
              <button
                type="button"
                onClick={handleSwitchToYearly}
                className="font-bold text-[#1463E9] hover:text-[#0E52C7] bg-[#EFF6FF] hover:bg-[#DBEAFE] px-3.5 py-1.5 rounded-xl border border-blue-200/60 cursor-pointer transition-all duration-200 active:scale-95 hover:-translate-y-0.5"
              >
                Switch to Yearly (Save 20%) &rarr;
              </button>
            )}

            {!isCancelled ? (
              confirmCancelOpen ? (
                <div className="flex items-center gap-2 p-1 bg-rose-50 rounded-xl border border-rose-200">
                  <span className="text-rose-700 font-semibold px-2">Cancel demo plan?</span>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-2.5 py-1 bg-rose-600 text-white font-bold rounded-lg hover:bg-rose-700 active:bg-rose-800 cursor-pointer transition-all duration-200 active:scale-95"
                  >
                    Yes, Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmCancelOpen(false)}
                    className="px-2.5 py-1 text-slate-700 font-bold hover:bg-[#EFF6FF] hover:text-[#1463E9] rounded-lg cursor-pointer transition-all duration-200 active:scale-95"
                  >
                    Keep
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmCancelOpen(true)}
                  className="font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg py-1 px-2 cursor-pointer active:scale-95 transition-all duration-200"
                >
                  Cancel Subscription (Demo)
                </button>
              )
            ) : (
              <span className="text-amber-700 font-semibold flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Subscription cancelled. Your benefits remain active until {currentSubscription.renewalDate}.</span>
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleResetFree}
            className="text-slate-400 hover:text-slate-600 cursor-pointer text-[11px] underline"
            title="Reset subscription storage to free tier"
          >
            Reset Demo to Free Tier
          </button>
        </div>
      )}
    </div>
  );
};

