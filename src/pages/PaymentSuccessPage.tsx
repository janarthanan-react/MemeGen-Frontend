import React, { useEffect } from 'react';
import {
  CheckCircle2,
  Printer,
  ArrowRight,
  ShieldCheck,
  Calendar,
  CreditCard,
} from 'lucide-react';
import { Container } from '../components/ui/Container';
import { Button } from '../components/ui/Button';
import { useSubscriptionStore } from '../stores/useSubscriptionStore';

export interface PaymentSuccessPageProps {
  onNavigate: (route: string) => void;
}

export const PaymentSuccessPage: React.FC<PaymentSuccessPageProps> = ({ onNavigate }) => {
  const currentSubscription = useSubscriptionStore((state) => state.currentSubscription);
  const lastOrderSummary = useSubscriptionStore((state) => state.lastOrderSummary);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const planName = (lastOrderSummary?.planId || currentSubscription.planId || 'pro').toUpperCase();
  const orderId = lastOrderSummary?.orderId || currentSubscription.orderId || 'MH-SUB-DEMO';
  const amountPaid = lastOrderSummary?.amountPaid ?? currentSubscription.amountPaid ?? 199;
  const paymentMethod = lastOrderSummary?.paymentMethod || currentSubscription.paymentMethod || 'Demo Card';
  const renewalDate = currentSubscription.renewalDate || 'In 30 days';
  const customerName = lastOrderSummary?.billingDetails?.fullName || 'Valued Creator';
  const customerEmail = lastOrderSummary?.billingDetails?.email || 'creator@memehub.test';

  return (
    <div className="min-h-screen bg-slate-50/70 pt-24 sm:pt-28 pb-24 print:bg-white print:pt-4">
      <Container size="md" className="space-y-8">
        {/* Celebration Header (hidden in print) */}
        <div className="text-center max-w-xl mx-auto space-y-4 print:hidden">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/20 ring-8 ring-emerald-50 animate-in zoom-in-75 duration-300">
            <CheckCircle2 className="w-9 h-9 sm:w-11 sm:h-11" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black uppercase tracking-wider">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Demo Transaction Complete</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            Welcome to MemeHub <span className="text-blue-600">{planName}</span>!
          </h1>

          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Your demo payment has been successfully recorded. Watermark-free exports, HD resolution, and advanced creator tools are now activated on your account.
          </p>
        </div>

        {/* Printable Receipt Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-6">
          {/* Receipt Top Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="MemeHub" className="h-8 w-auto object-contain" />
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Payment Receipt (Demo)
                </p>
                <p className="text-sm font-extrabold text-slate-900">MemeHub Technologies Ltd.</p>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <span className="inline-flex items-center gap-1 text-xs font-extrabold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>PAID (DEMO SIMULATION)</span>
              </span>
              <p className="text-[11px] text-slate-400 font-medium mt-1">
                GSTIN: 33AAACM0000A1Z5 (Demo)
              </p>
            </div>
          </div>

          {/* Receipt Meta Details Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="space-y-1">
              <p className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                Order ID
              </p>
              <p className="font-extrabold text-slate-900 font-mono">{orderId}</p>
            </div>

            <div className="space-y-1">
              <p className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                Date &amp; Time
              </p>
              <p className="font-semibold text-slate-800">
                {lastOrderSummary?.date || 'Today'}
              </p>
            </div>

            <div className="space-y-1">
              <p className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                Customer Name
              </p>
              <p className="font-semibold text-slate-800 truncate">{customerName}</p>
            </div>

            <div className="space-y-1">
              <p className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                Billed To
              </p>
              <p className="font-semibold text-slate-800 truncate">{customerEmail}</p>
            </div>
          </div>

          {/* Purchased Line Items */}
          <div className="rounded-2xl border border-slate-100 bg-slate-50/50 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/70 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold">
                <tr>
                  <th className="py-2.5 px-4">Item &amp; Description</th>
                  <th className="py-2.5 px-4 text-center">Cycle</th>
                  <th className="py-2.5 px-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-3 px-4">
                    <p className="font-extrabold text-slate-900">
                      MemeHub {planName} Subscription
                    </p>
                    <p className="text-[11px] text-slate-500 font-medium">
                      High-Res Exports, No Watermarks, AI Captions &amp; Pro Templates
                    </p>
                  </td>
                  <td className="py-3 px-4 text-center font-semibold text-slate-700 capitalize">
                    {currentSubscription.billingCycle}
                  </td>
                  <td className="py-3 px-4 text-right font-extrabold text-slate-900">
                    ₹{amountPaid.toLocaleString('en-IN')}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Payment Method & Renewal Footnotes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-slate-600">
            <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <CreditCard className="w-4 h-4 text-blue-600 shrink-0" />
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Payment Channel</p>
                <p className="font-semibold text-slate-900">{paymentMethod}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Next Auto-Renewal</p>
                <p className="font-semibold text-slate-900">{renewalDate}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons (hidden in print) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 print:hidden">
          <Button
            variant="primary"
            size="lg"
            onClick={() => onNavigate('/editor')}
            className="w-full sm:w-auto rounded-2xl font-bold bg-[#1463E9] hover:bg-[#0E52C7] text-white shadow-[0_4px_16px_rgba(20,99,233,0.38)] hover:shadow-[0_8px_24px_rgba(20,99,233,0.48)] flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Launch Meme Studio</span>
            <ArrowRight className="w-4 h-4" />
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={() => onNavigate('/profile')}
            className="w-full sm:w-auto rounded-2xl font-bold cursor-pointer"
          >
            <span>View Subscription in Profile</span>
          </Button>

          <Button
            variant="ghost"
            size="lg"
            onClick={handlePrint}
            className="w-full sm:w-auto rounded-2xl font-semibold text-slate-700 hover:text-[#1463E9] hover:bg-[#EFF6FF] flex items-center justify-center gap-2 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Receipt</span>
          </Button>
        </div>
      </Container>
    </div>
  );
};

export default PaymentSuccessPage;

