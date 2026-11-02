import React from 'react';
import type { BillingCycle } from '../../types/subscription';
import { Zap } from 'lucide-react';

export interface BillingToggleProps {
  cycle: BillingCycle;
  onChange: (cycle: BillingCycle) => void;
}

export const BillingToggle: React.FC<BillingToggleProps> = ({ cycle, onChange }) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
      <div
        role="group"
        aria-label="Billing cycle selection"
        className="inline-flex items-center p-1.5 bg-slate-100 rounded-2xl border border-slate-200/80 shadow-inner"
      >
        <button
          type="button"
          onClick={() => onChange('monthly')}
          aria-pressed={cycle === 'monthly'}
          className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-[#1463E9] focus-visible:outline-none ${
            cycle === 'monthly'
              ? 'bg-white text-[#1463E9] shadow-sm font-extrabold'
              : 'text-slate-600 hover:text-[#1463E9] hover:bg-white/60'
          }`}
        >
          Monthly Billing
        </button>

        <button
          type="button"
          onClick={() => onChange('yearly')}
          aria-pressed={cycle === 'yearly'}
          className={`relative px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer flex items-center gap-2 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-[#1463E9] focus-visible:outline-none ${
            cycle === 'yearly'
              ? 'bg-[#1463E9] text-white shadow-[0_2px_10px_rgba(20,99,233,0.35)]'
              : 'text-slate-600 hover:text-[#1463E9] hover:bg-white/60'
          }`}
        >
          <span>Yearly Billing</span>
          <span
            className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full transition-colors ${
              cycle === 'yearly'
                ? 'bg-white/20 text-white'
                : 'bg-emerald-100 text-emerald-700'
            }`}
          >
            Save ~20%
          </span>
        </button>
      </div>

      <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200/60">
        <Zap className="w-3.5 h-3.5" />
        <span>Get 2 Months Free with Annual Billing</span>
      </div>
    </div>
  );
};

