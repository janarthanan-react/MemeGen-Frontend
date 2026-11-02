import React, { useEffect } from 'react';
import { XCircle, RefreshCw, ArrowLeft, HelpCircle, ShieldAlert } from 'lucide-react';
import { Container } from '../components/ui/Container';
import { Button } from '../components/ui/Button';
import { useSubscriptionStore } from '../stores/useSubscriptionStore';

export interface PaymentFailedPageProps {
  onNavigate: (route: string) => void;
}

export const PaymentFailedPage: React.FC<PaymentFailedPageProps> = ({ onNavigate }) => {
  const paymentError = useSubscriptionStore((state) => state.paymentError);
  const clearErrors = useSubscriptionStore((state) => state.clearErrors);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleRetry = () => {
    clearErrors();
    onNavigate('/checkout');
  };

  const errorMessage =
    paymentError ||
    'Transaction was declined or cancelled during demo payment simulation.';

  return (
    <div className="min-h-screen bg-slate-50/70 pt-24 sm:pt-28 pb-24">
      <Container size="sm" className="space-y-8">
        {/* Warning Icon & Header */}
        <div className="text-center max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-xl shadow-rose-500/20 ring-8 ring-rose-50 animate-in zoom-in-75 duration-300">
            <XCircle className="w-9 h-9 sm:w-11 sm:h-11" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-black uppercase tracking-wider">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Transaction Incomplete</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Demo Payment Unsuccessful
          </h1>

          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            We were unable to complete your mock subscription checkout.
          </p>
        </div>

        {/* Error Details Card */}
        <div className="bg-white rounded-3xl border border-rose-200 shadow-md p-6 sm:p-7 space-y-5">
          <div className="p-4 rounded-2xl bg-rose-50/80 border border-rose-200/80 text-rose-900 text-xs sm:text-sm font-semibold flex items-start gap-3">
            <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold">Error Notice:</p>
              <p className="font-normal text-rose-800 leading-relaxed">{errorMessage}</p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Common Demo Troubleshooting Steps:
            </p>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-600 list-disc list-inside">
              <li>
                If you tested with the <span className="font-bold">"Simulate Failed Payment"</span> toggle, uncheck it on the checkout page to simulate a successful payment.
              </li>
              <li>
                Ensure all required billing address and 6-digit PIN code fields are filled out.
              </li>
              <li>
                For UPI, verify the VPA format (e.g. <span className="font-mono">name@bank</span>) or select one of the quick apps.
              </li>
            </ul>
          </div>

          <div className="pt-2 text-xs text-slate-400 font-medium flex items-center gap-1.5 border-t border-slate-100">
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
            <span>No real charges were incurred. Your account remains safely on the Free tier.</span>
          </div>
        </div>

        {/* Action Recovery Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            variant="primary"
            size="lg"
            onClick={handleRetry}
            className="w-full sm:w-auto rounded-2xl font-bold bg-[#1463E9] hover:bg-[#0E52C7] text-white shadow-[0_4px_16px_rgba(20,99,233,0.38)] hover:shadow-[0_8px_24px_rgba(20,99,233,0.48)] flex items-center justify-center gap-2 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Demo Payment Again</span>
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={() => onNavigate('/pricing')}
            className="w-full sm:w-auto rounded-2xl font-bold cursor-pointer"
          >
            <span>Choose Another Plan</span>
          </Button>

          <button
            type="button"
            onClick={() => onNavigate('/')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#1463E9] py-2 cursor-pointer transition-colors duration-200"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Home</span>
          </button>
        </div>
      </Container>
    </div>
  );
};

export default PaymentFailedPage;

