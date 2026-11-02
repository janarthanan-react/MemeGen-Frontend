import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { SUBSCRIPTION_FAQS } from '../../constants/subscription';

export const PricingFaq: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200/60">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Got Questions?</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Frequently Asked Questions
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 font-medium">
          Everything you need to know about plans, billing, and the interactive demo payment process.
        </p>
      </div>

      <div className="space-y-3">
        {SUBSCRIPTION_FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                isOpen
                  ? 'bg-white border-blue-200 shadow-sm'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <button
                type="button"
                onClick={() => toggle(idx)}
                className="w-full flex items-center justify-between p-4 sm:p-5 text-left cursor-pointer gap-4 active:scale-[0.99] transition-all duration-200 group focus-visible:ring-2 focus-visible:ring-[#1463E9] focus-visible:outline-none"
                aria-expanded={isOpen}
              >
                <span className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-[#1463E9] transition-colors">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 group-hover:text-[#1463E9] transition-all duration-200 shrink-0 ${
                    isOpen ? 'rotate-180 text-[#1463E9]' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-4 pb-5 sm:px-5 sm:pb-5 pt-0 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 animate-in fade-in duration-150">
                  <p className="pt-2">{faq.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

