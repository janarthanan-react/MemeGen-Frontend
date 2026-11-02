import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ShieldCheck,
  Lock,
  Tag,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  Smartphone,
  Building2,
  Wallet,
  Zap,
  Crown,
  Info,
} from 'lucide-react';
import { Container } from '../components/ui/Container';
import { Button } from '../components/ui/Button';
import { useSubscriptionStore } from '../stores/useSubscriptionStore';
import { useAuthStore } from '../stores/useAuthStore';
import { SUBSCRIPTION_PLANS, POPULAR_BANKS, POPULAR_WALLETS } from '../constants/subscription';
import { paymentService } from '../services/paymentService';
import type { BillingDetails, PaymentDetails, PaymentMethodType } from '../types/subscription';

export interface CheckoutPageProps {
  onNavigate: (route: string) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onNavigate }) => {
  const user = useAuthStore((state) => state.user);
  const selectedPlanId = useSubscriptionStore((state) => state.selectedPlanId);
  const billingCycle = useSubscriptionStore((state) => state.billingCycle);
  const setBillingCycle = useSubscriptionStore((state) => state.setBillingCycle);
  const appliedCoupon = useSubscriptionStore((state) => state.appliedCoupon);
  const couponError = useSubscriptionStore((state) => state.couponError);
  const applyCoupon = useSubscriptionStore((state) => state.applyCoupon);
  const removeCoupon = useSubscriptionStore((state) => state.removeCoupon);
  const isProcessingPayment = useSubscriptionStore((state) => state.isProcessingPayment);
  const paymentError = useSubscriptionStore((state) => state.paymentError);
  const processPayment = useSubscriptionStore((state) => state.processPayment);
  const clearErrors = useSubscriptionStore((state) => state.clearErrors);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    clearErrors();
  }, [clearErrors]);

  const plan = SUBSCRIPTION_PLANS.find((p) => p.id === selectedPlanId) || SUBSCRIPTION_PLANS[1];

  // Billing form state (prefill if user logged in)
  const [billing, setBilling] = useState<BillingDetails>({
    fullName: user?.fullName || 'Janarthanan Creator',
    email: user?.email || 'creator@memehub.test',
    phone: '9876543210',
    address: '42 Meme Boulevard, Tech Park',
    state: 'Tamil Nadu',
    pinCode: '600001',
  });

  const [billingErrors, setBillingErrors] = useState<Partial<Record<keyof BillingDetails, string>>>({});

  // Payment form state
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('upi');
  const [upiApp, setUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'bhim'>('gpay');
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('4532 8901 2345 6789');
  const [cardHolder, setCardHolder] = useState(user?.fullName || 'Janarthanan Creator');
  const [expiry, setExpiry] = useState('12/28');
  const [cvv, setCvv] = useState('888');
  const [selectedBank, setSelectedBank] = useState('hdfc');
  const [selectedWallet, setSelectedWallet] = useState('paytm');

  // Coupon input
  const [couponInput, setCouponInput] = useState('');

  // Demo Failure simulation toggle
  const [simulateFailure, setSimulateFailure] = useState(false);

  // Price calculations
  const basePrice = billingCycle === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;
  const pricing = paymentService.calculatePrice(basePrice, appliedCoupon);

  const handleBillingChange = (field: keyof BillingDetails, value: string) => {
    setBilling((prev) => ({ ...prev, [field]: value }));
    if (billingErrors[field]) {
      setBillingErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const ok = applyCoupon(couponInput);
    if (ok) {
      setCouponInput('');
    }
  };

  const handleQuickCoupon = (code: string) => {
    applyCoupon(code);
  };

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate billing details
    const billingValidation = paymentService.validateBillingDetails(billing);
    if (!billingValidation.valid) {
      setBillingErrors(billingValidation.errors);
      return;
    }

    const paymentDetails: PaymentDetails = {
      method: paymentMethod,
      upiApp: paymentMethod === 'upi' ? upiApp : undefined,
      upiId: paymentMethod === 'upi' && upiId ? upiId : undefined,
      cardNumber: paymentMethod === 'card' ? cardNumber : undefined,
      cardHolder: paymentMethod === 'card' ? cardHolder : undefined,
      expiry: paymentMethod === 'card' ? expiry : undefined,
      cvv: paymentMethod === 'card' ? cvv : undefined,
      bank: paymentMethod === 'netbanking' ? selectedBank : undefined,
      wallet: paymentMethod === 'wallet' ? selectedWallet : undefined,
    };

    const result = await processPayment(billing, paymentDetails, simulateFailure);
    if (result.success) {
      onNavigate('/payment/success');
    } else {
      onNavigate('/payment/failed');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/70 pt-24 sm:pt-28 pb-24">
      <Container size="lg" className="space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => onNavigate('/pricing')}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-500 hover:text-[#1463E9] transition-colors cursor-pointer py-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Change Plan / Back to Pricing</span>
          </button>

          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            <Lock className="w-3.5 h-3.5" />
            <span>256-Bit SSL Demo Checkout</span>
          </div>
        </div>

        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Checkout & Upgrade
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Review your order details and test our mock payment integration.
          </p>
        </div>

        {/* Demo Notice Banner */}
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm flex items-start gap-3 shadow-xs">
          <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="font-bold">Demo Checkout Simulator:</strong> This is a secure frontend prototype. No real bank accounts, real credit cards, or actual money will be charged. All sample values are pre-filled for rapid evaluation.
          </div>
        </div>

        {/* Error notification if any */}
        {paymentError && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-2.5 animate-in fade-in">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <span>{paymentError}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Billing Details & Payment Method (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. Billing Details Card */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h2 className="text-base sm:text-lg font-black text-slate-900">
                  1. Billing Information
                </h2>
                <span className="text-xs font-semibold text-slate-400">Required</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label htmlFor="billing-name" className="text-xs font-bold text-slate-700">
                    Full Name
                  </label>
                  <input
                    id="billing-name"
                    type="text"
                    value={billing.fullName}
                    onChange={(e) => handleBillingChange('fullName', e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium transition-colors outline-none ${
                      billingErrors.fullName
                        ? 'border-rose-400 focus:border-rose-500 bg-rose-50/30'
                        : 'border-slate-200 focus:border-blue-600 bg-slate-50/50'
                    }`}
                  />
                  {billingErrors.fullName && (
                    <p className="text-[11px] text-rose-600 font-medium">{billingErrors.fullName}</p>
                  )}
                </div>

                {/* Email Address */}
                <div className="space-y-1.5">
                  <label htmlFor="billing-email" className="text-xs font-bold text-slate-700">
                    Email Address
                  </label>
                  <input
                    id="billing-email"
                    type="email"
                    value={billing.email}
                    onChange={(e) => handleBillingChange('email', e.target.value)}
                    placeholder="you@domain.com"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium transition-colors outline-none ${
                      billingErrors.email
                        ? 'border-rose-400 focus:border-rose-500 bg-rose-50/30'
                        : 'border-slate-200 focus:border-blue-600 bg-slate-50/50'
                    }`}
                  />
                  {billingErrors.email && (
                    <p className="text-[11px] text-rose-600 font-medium">{billingErrors.email}</p>
                  )}
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <label htmlFor="billing-phone" className="text-xs font-bold text-slate-700">
                    Phone Number
                  </label>
                  <input
                    id="billing-phone"
                    type="tel"
                    value={billing.phone}
                    onChange={(e) => handleBillingChange('phone', e.target.value)}
                    placeholder="10-digit mobile number"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium transition-colors outline-none ${
                      billingErrors.phone
                        ? 'border-rose-400 focus:border-rose-500 bg-rose-50/30'
                        : 'border-slate-200 focus:border-blue-600 bg-slate-50/50'
                    }`}
                  />
                  {billingErrors.phone && (
                    <p className="text-[11px] text-rose-600 font-medium">{billingErrors.phone}</p>
                  )}
                </div>

                {/* State */}
                <div className="space-y-1.5">
                  <label htmlFor="billing-state" className="text-xs font-bold text-slate-700">
                    State / Region
                  </label>
                  <input
                    id="billing-state"
                    type="text"
                    value={billing.state}
                    onChange={(e) => handleBillingChange('state', e.target.value)}
                    placeholder="e.g. Tamil Nadu, Maharashtra"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium transition-colors outline-none ${
                      billingErrors.state
                        ? 'border-rose-400 focus:border-rose-500 bg-rose-50/30'
                        : 'border-slate-200 focus:border-blue-600 bg-slate-50/50'
                    }`}
                  />
                  {billingErrors.state && (
                    <p className="text-[11px] text-rose-600 font-medium">{billingErrors.state}</p>
                  )}
                </div>

                {/* Street Address */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label htmlFor="billing-address" className="text-xs font-bold text-slate-700">
                    Street Address
                  </label>
                  <input
                    id="billing-address"
                    type="text"
                    value={billing.address}
                    onChange={(e) => handleBillingChange('address', e.target.value)}
                    placeholder="Apartment, Street address"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium transition-colors outline-none ${
                      billingErrors.address
                        ? 'border-rose-400 focus:border-rose-500 bg-rose-50/30'
                        : 'border-slate-200 focus:border-blue-600 bg-slate-50/50'
                    }`}
                  />
                  {billingErrors.address && (
                    <p className="text-[11px] text-rose-600 font-medium">{billingErrors.address}</p>
                  )}
                </div>

                {/* PIN Code */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label htmlFor="billing-pin" className="text-xs font-bold text-slate-700">
                    PIN Code (Postal)
                  </label>
                  <input
                    id="billing-pin"
                    type="text"
                    maxLength={6}
                    value={billing.pinCode}
                    onChange={(e) => handleBillingChange('pinCode', e.target.value)}
                    placeholder="6-digit PIN code (e.g. 600001)"
                    className={`w-full sm:w-1/2 px-3.5 py-2.5 rounded-xl border text-sm font-medium transition-colors outline-none ${
                      billingErrors.pinCode
                        ? 'border-rose-400 focus:border-rose-500 bg-rose-50/30'
                        : 'border-slate-200 focus:border-blue-600 bg-slate-50/50'
                    }`}
                  />
                  {billingErrors.pinCode && (
                    <p className="text-[11px] text-rose-600 font-medium">{billingErrors.pinCode}</p>
                  )}
                </div>
              </div>
            </div>

            {/* 2. Payment Method Selector */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h2 className="text-base sm:text-lg font-black text-slate-900">
                  2. Select Payment Method
                </h2>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Verified Safe</span>
                </div>
              </div>

              {/* Method Navigation Tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {/* UPI Tab */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-xs font-bold transition-all duration-200 cursor-pointer gap-1.5 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-[#1463E9] focus-visible:outline-none ${
                    paymentMethod === 'upi'
                      ? 'border-[#1463E9] bg-[#EFF6FF] text-[#1463E9] shadow-xs ring-1 ring-blue-500/20'
                      : 'border-slate-200 hover:border-[#1463E9]/30 text-slate-700 bg-white hover:bg-[#EFF6FF] hover:text-[#1463E9]'
                  }`}
                >
                  <Smartphone className="w-5 h-5 text-[#1463E9]" />
                  <span>UPI / QR</span>
                </button>

                {/* Card Tab */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-xs font-bold transition-all duration-200 cursor-pointer gap-1.5 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-[#1463E9] focus-visible:outline-none ${
                    paymentMethod === 'card'
                      ? 'border-[#1463E9] bg-[#EFF6FF] text-[#1463E9] shadow-xs ring-1 ring-blue-500/20'
                      : 'border-slate-200 hover:border-[#1463E9]/30 text-slate-700 bg-white hover:bg-[#EFF6FF] hover:text-[#1463E9]'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-purple-600" />
                  <span>Card</span>
                </button>

                {/* Net Banking Tab */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('netbanking')}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-xs font-bold transition-all duration-200 cursor-pointer gap-1.5 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-[#1463E9] focus-visible:outline-none ${
                    paymentMethod === 'netbanking'
                      ? 'border-[#1463E9] bg-[#EFF6FF] text-[#1463E9] shadow-xs ring-1 ring-blue-500/20'
                      : 'border-slate-200 hover:border-[#1463E9]/30 text-slate-700 bg-white hover:bg-[#EFF6FF] hover:text-[#1463E9]'
                  }`}
                >
                  <Building2 className="w-5 h-5 text-emerald-600" />
                  <span>Net Banking</span>
                </button>

                {/* Wallets Tab */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('wallet')}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-xs font-bold transition-all duration-200 cursor-pointer gap-1.5 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-[#1463E9] focus-visible:outline-none ${
                    paymentMethod === 'wallet'
                      ? 'border-[#1463E9] bg-[#EFF6FF] text-[#1463E9] shadow-xs ring-1 ring-blue-500/20'
                      : 'border-slate-200 hover:border-[#1463E9]/30 text-slate-700 bg-white hover:bg-[#EFF6FF] hover:text-[#1463E9]'
                  }`}
                >
                  <Wallet className="w-5 h-5 text-amber-600" />
                  <span>Wallets</span>
                </button>
              </div>

              {/* Tab 1: UPI Details */}
              {paymentMethod === 'upi' && (
                <div className="space-y-4 pt-1 animate-in fade-in duration-150">
                  <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Select UPI Application:
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {[
                      { id: 'gpay', name: 'Google Pay', badge: 'Popular' },
                      { id: 'phonepe', name: 'PhonePe', badge: 'Fast' },
                      { id: 'paytm', name: 'Paytm UPI', badge: 'Instant' },
                      { id: 'bhim', name: 'BHIM UPI', badge: 'Direct' },
                    ].map((app) => (
                      <button
                        key={app.id}
                        type="button"
                        onClick={() => setUpiApp(app.id as typeof upiApp)}
                        className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                          upiApp === app.id
                            ? 'border-[#1463E9] bg-[#EFF6FF] shadow-xs ring-1 ring-[#1463E9]'
                            : 'border-slate-200 hover:border-[#1463E9]/30 bg-white hover:bg-[#EFF6FF]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-800">{app.name}</span>
                          {upiApp === app.id && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 font-medium">{app.badge}</span>
                      </button>
                    ))}
                  </div>

                  <div className="pt-2 space-y-1.5">
                    <label htmlFor="upi-vpa" className="text-xs font-bold text-slate-700">
                      Or Enter UPI ID / VPA
                    </label>
                    <input
                      id="upi-vpa"
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="e.g. mobile@upi or username@okaxis"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-600 bg-slate-50/50 text-sm font-medium outline-none"
                    />
                    <p className="text-[11px] text-slate-400">
                      A demo payment request notification will be simulated.
                    </p>
                  </div>
                </div>
              )}

              {/* Tab 2: Card Details */}
              {paymentMethod === 'card' && (
                <div className="space-y-4 pt-1 animate-in fade-in duration-150">
                  <div className="space-y-1.5">
                    <label htmlFor="card-number" className="text-xs font-bold text-slate-700">
                      Card Number
                    </label>
                    <input
                      id="card-number"
                      type="text"
                      maxLength={19}
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="4532 •••• •••• ••••"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-600 bg-slate-50/50 text-sm font-mono font-medium outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="card-holder" className="text-xs font-bold text-slate-700">
                      Cardholder Name
                    </label>
                    <input
                      id="card-holder"
                      type="text"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      placeholder="Full Name as printed on card"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-600 bg-slate-50/50 text-sm font-medium outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label htmlFor="card-expiry" className="text-xs font-bold text-slate-700">
                        Expiry (MM/YY)
                      </label>
                      <input
                        id="card-expiry"
                        type="text"
                        maxLength={5}
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-600 bg-slate-50/50 text-sm font-medium outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="card-cvv" className="text-xs font-bold text-slate-700">
                        CVV / CVC
                      </label>
                      <input
                        id="card-cvv"
                        type="password"
                        maxLength={4}
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        placeholder="•••"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-600 bg-slate-50/50 text-sm font-mono font-medium outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Net Banking Details */}
              {paymentMethod === 'netbanking' && (
                <div className="space-y-4 pt-1 animate-in fade-in duration-150">
                  <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Select Your Bank:
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {POPULAR_BANKS.map((bank) => (
                      <button
                        key={bank.id}
                        type="button"
                        onClick={() => setSelectedBank(bank.id)}
                        className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                          selectedBank === bank.id
                            ? 'border-[#1463E9] bg-[#EFF6FF] ring-1 ring-[#1463E9] shadow-xs'
                            : 'border-slate-200 hover:border-[#1463E9]/30 bg-white hover:bg-[#EFF6FF]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-800">{bank.name}</span>
                          {selectedBank === bank.id && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 4: Wallet Details */}
              {paymentMethod === 'wallet' && (
                <div className="space-y-4 pt-1 animate-in fade-in duration-150">
                  <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Select Digital Wallet:
                  </p>
                  <div className="grid grid-cols-2 gap-2.5">
                    {POPULAR_WALLETS.map((wal) => (
                      <button
                        key={wal.id}
                        type="button"
                        onClick={() => setSelectedWallet(wal.id)}
                        className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                          selectedWallet === wal.id
                            ? 'border-[#1463E9] bg-[#EFF6FF] ring-1 ring-[#1463E9] shadow-xs'
                            : 'border-slate-200 hover:border-[#1463E9]/30 bg-white hover:bg-[#EFF6FF]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-800">{wal.name}</span>
                          {selectedWallet === wal.id && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Simulate Failure Checkbox for QA Evaluation */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between bg-slate-50 p-3.5 rounded-2xl border">
                <div>
                  <p className="text-xs font-bold text-slate-800">
                    QA Testing: Simulate Payment Failure
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Check to test the transaction failure &amp; recovery page flow.
                  </p>
                </div>
                <input
                  type="checkbox"
                  id="simulate-fail"
                  checked={simulateFailure}
                  onChange={(e) => setSimulateFailure(e.target.checked)}
                  className="w-4 h-4 text-rose-600 rounded border-slate-300 focus:ring-rose-500 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary & Coupon (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl border-2 border-blue-500/30 p-6 sm:p-7 shadow-lg shadow-blue-500/5 space-y-6 sticky top-28">
              {/* Order Header */}
              <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                      plan.id === 'premium'
                        ? 'bg-purple-600 text-white'
                        : 'bg-blue-600 text-white'
                    }`}
                  >
                    {plan.id === 'premium' ? (
                      <Crown className="w-5 h-5 fill-current" />
                    ) : (
                      <Zap className="w-5 h-5 fill-current" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-slate-900">{plan.name} Tier Plan</h2>
                    <span className="text-xs font-semibold text-slate-500 capitalize">
                      {billingCycle} billing cycle
                    </span>
                  </div>
                </div>

                {/* Billing cycle mini switcher */}
                <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setBillingCycle('monthly')}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold cursor-pointer ${
                      billingCycle === 'monthly'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-500'
                    }`}
                  >
                    Mo
                  </button>
                  <button
                    type="button"
                    onClick={() => setBillingCycle('yearly')}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-all duration-150 ${
                      billingCycle === 'yearly'
                        ? 'bg-[#1463E9] text-white shadow-xs'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Yr (-20%)
                  </button>
                </div>
              </div>

              {/* Coupon Code Section */}
              <div className="space-y-3">
                <label htmlFor="coupon-input" className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-blue-600" />
                  <span>Have a Promo or Coupon Code?</span>
                </label>

                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 animate-in fade-in">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div>
                        <span className="text-xs font-black">{appliedCoupon.code}</span>
                        <p className="text-[10px] text-emerald-700 font-medium">
                          {appliedCoupon.description}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="text-xs font-bold text-rose-600 hover:text-rose-700 hover:underline cursor-pointer px-2 py-1"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      id="coupon-input"
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="e.g. MEME20"
                      className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-600 bg-slate-50/50 text-xs sm:text-sm font-semibold uppercase outline-none"
                    />
                    <Button
                      type="submit"
                      variant="outline"
                      size="sm"
                      disabled={!couponInput.trim()}
                      className="rounded-xl font-bold cursor-pointer"
                    >
                      Apply
                    </Button>
                  </form>
                )}

                {couponError && (
                  <p className="text-[11px] text-rose-600 font-semibold">{couponError}</p>
                )}

                {/* Quick Demo Coupons */}
                {!appliedCoupon && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[10px] font-bold text-slate-400">Try demo:</span>
                    {['MEME20', 'PROMO50', 'MEMEHUB'].map((code) => (
                      <button
                        key={code}
                        type="button"
                        onClick={() => handleQuickCoupon(code)}
                        className="text-[10px] font-extrabold text-[#1463E9] bg-[#EFF6FF] hover:bg-[#DBEAFE] border border-blue-200/60 px-2 py-0.5 rounded-md cursor-pointer transition-colors"
                      >
                        +{code}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Price Breakdown Calculation */}
              <div className="space-y-3 pt-3 border-t border-slate-100 text-xs sm:text-sm">
                <div className="flex items-center justify-between text-slate-600">
                  <span>Plan Base Price</span>
                  <span className="font-semibold text-slate-900">
                    ₹{pricing.basePrice.toLocaleString('en-IN')}
                  </span>
                </div>

                {pricing.discountAmount > 0 && (
                  <div className="flex items-center justify-between text-emerald-600 font-semibold">
                    <span className="flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5" />
                      <span>Coupon Discount ({pricing.discountPercent}%)</span>
                    </span>
                    <span>-₹{pricing.discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-slate-500 text-xs">
                  <span>GST / Platform Taxes (18%)</span>
                  <span>+₹{pricing.taxAmount.toLocaleString('en-IN')}</span>
                </div>

                <div className="pt-3 border-t border-slate-200 flex items-baseline justify-between">
                  <span className="text-sm font-black text-slate-900">Total Payable</span>
                  <div className="text-right">
                    <span className="text-2xl sm:text-3xl font-black text-blue-600">
                      ₹{pricing.totalPayable.toLocaleString('en-IN')}
                    </span>
                    <p className="text-[10px] font-medium text-slate-400">All inclusive</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleSubmitPayment}
                  disabled={isProcessingPayment}
                  className="w-full rounded-2xl font-bold bg-[#1463E9] hover:bg-[#0E52C7] text-white shadow-[0_4px_16px_rgba(20,99,233,0.38)] hover:shadow-[0_8px_24px_rgba(20,99,233,0.48)] cursor-pointer flex items-center justify-center gap-2"
                >
                  {isProcessingPayment ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Processing Demo Payment...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Pay ₹{pricing.totalPayable.toLocaleString('en-IN')} (Demo)</span>
                    </>
                  )}
                </Button>

                <button
                  type="button"
                  onClick={() => onNavigate('/pricing')}
                  className="w-full text-center text-xs font-semibold text-slate-500 hover:text-[#1463E9] py-1 cursor-pointer transition-colors duration-200"
                >
                  Cancel &amp; Return to Subscriptions
                </button>
              </div>

              {/* Trust Badges Footer */}
              <div className="pt-2 flex items-center justify-center gap-4 text-[11px] text-slate-400 font-medium">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>256-Bit SSL</span>
                </span>
                <span>•</span>
                <span>PCI-DSS Ready</span>
                <span>•</span>
                <span>Instant Unlocking</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default CheckoutPage;

