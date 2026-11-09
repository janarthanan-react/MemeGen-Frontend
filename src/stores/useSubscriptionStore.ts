import { create } from 'zustand';
import type {
  PlanId,
  BillingCycle,
  Subscription,
  Coupon,
  BillingDetails,
  PaymentDetails,
  PaymentResult,
} from '../types/subscription';
import { SUBSCRIPTION_PLANS } from '../constants/subscription';
import { paymentService } from '../services/paymentService';

const STORAGE_KEY = 'memehub_subscription';
const LAST_ORDER_KEY = 'memehub_last_order';

interface LastOrderSummary {
  planId: PlanId;
  billingCycle: BillingCycle;
  amountPaid: number;
  orderId: string;
  transactionId?: string;
  date: string;
  paymentMethod: string;
  billingDetails?: BillingDetails;
}

export interface SubscriptionStoreState {
  currentSubscription: Subscription;
  selectedPlanId: PlanId;
  billingCycle: BillingCycle;
  appliedCoupon: Coupon | null;
  couponError: string | null;
  isProcessingPayment: boolean;
  paymentError: string | null;
  lastOrderResult: PaymentResult | null;
  lastOrderSummary: LastOrderSummary | null;

  // Actions
  setBillingCycle: (cycle: BillingCycle) => void;
  selectPlanForCheckout: (planId: PlanId, cycle?: BillingCycle) => void;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  processPayment: (
    billing: BillingDetails,
    payment: PaymentDetails,
    simulateFailure?: boolean
  ) => Promise<PaymentResult>;
  cancelSubscription: () => void;
  resetToFree: () => void;
  clearErrors: () => void;
}

const DEFAULT_FREE_SUBSCRIPTION: Subscription = {
  planId: 'free',
  status: 'active',
  billingCycle: 'monthly',
  startDate: new Date().toISOString(),
  renewalDate: 'Never (Free Forever)',
  amountPaid: 0,
  orderId: 'FREE-TIER',
  paymentMethod: 'Free Account',
};

function loadStoredSubscription(): Subscription {
  if (typeof window === 'undefined') return DEFAULT_FREE_SUBSCRIPTION;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.planId) return parsed;
    }
  } catch {
    // ignore parse error
  }
  return DEFAULT_FREE_SUBSCRIPTION;
}

function loadStoredLastOrder(): LastOrderSummary | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(LAST_ORDER_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return null;
}

export const useSubscriptionStore = create<SubscriptionStoreState>((set, get) => ({
  currentSubscription: loadStoredSubscription(),
  selectedPlanId: 'pro',
  billingCycle: 'monthly',
  appliedCoupon: null,
  couponError: null,
  isProcessingPayment: false,
  paymentError: null,
  lastOrderResult: null,
  lastOrderSummary: loadStoredLastOrder(),

  setBillingCycle: (cycle: BillingCycle) => {
    set({ billingCycle: cycle });
  },

  selectPlanForCheckout: (planId: PlanId, cycle?: BillingCycle) => {
    set((state) => ({
      selectedPlanId: planId,
      billingCycle: cycle || state.billingCycle,
      paymentError: null,
      couponError: null,
    }));
  },

  applyCoupon: (code: string): boolean => {
    const { selectedPlanId, billingCycle } = get();
    const plan = SUBSCRIPTION_PLANS.find((p) => p.id === selectedPlanId);
    const basePrice = plan
      ? billingCycle === 'yearly'
        ? plan.yearlyPrice
        : plan.monthlyPrice
      : 0;

    const validation = paymentService.validateCoupon(code, basePrice);
    if (!validation.valid || !validation.coupon) {
      set({ couponError: validation.error || 'Invalid coupon code.' });
      return false;
    }

    set({
      appliedCoupon: validation.coupon,
      couponError: null,
    });
    return true;
  },

  removeCoupon: () => {
    set({ appliedCoupon: null, couponError: null });
  },

  clearErrors: () => {
    set({ paymentError: null, couponError: null });
  },

  processPayment: async (
    billing: BillingDetails,
    payment: PaymentDetails,
    simulateFailure = false
  ): Promise<PaymentResult> => {
    const { selectedPlanId, billingCycle, appliedCoupon } = get();

    // Validate billing details
    const billingValidation = paymentService.validateBillingDetails(billing);
    if (!billingValidation.valid) {
      const firstError = Object.values(billingValidation.errors)[0] || 'Please check your billing details.';
      set({ paymentError: firstError });
      return { success: false, errorMessage: firstError };
    }

    // Validate payment details
    const paymentValidation = paymentService.validatePaymentDetails(payment);
    if (!paymentValidation.valid) {
      set({ paymentError: paymentValidation.error || 'Please check your payment information.' });
      return { success: false, errorMessage: paymentValidation.error };
    }

    set({ isProcessingPayment: true, paymentError: null });

    const plan = SUBSCRIPTION_PLANS.find((p) => p.id === selectedPlanId);
    const basePrice = plan
      ? billingCycle === 'yearly'
        ? plan.yearlyPrice
        : plan.monthlyPrice
      : 0;

    const pricing = paymentService.calculatePrice(basePrice, appliedCoupon);

    try {
      const result = await paymentService.processDemoPayment({
        planId: selectedPlanId,
        billingCycle,
        amount: pricing.totalPayable,
        billingDetails: billing,
        paymentDetails: payment,
        simulateFailure,
      });

      if (!result.success) {
        set({
          isProcessingPayment: false,
          paymentError: result.errorMessage || 'Transaction could not be completed.',
          lastOrderResult: result,
        });
        return result;
      }

      // Calculate renewal date (1 month or 1 year from now)
      const now = new Date();
      const renewalDate = new Date(now);
      if (billingCycle === 'yearly') {
        renewalDate.setFullYear(now.getFullYear() + 1);
      } else {
        renewalDate.setMonth(now.getMonth() + 1);
      }

      let paymentMethodLabel = 'Card';
      if (payment.method === 'upi') {
        paymentMethodLabel = payment.upiId ? `UPI (${payment.upiId})` : `UPI (${payment.upiApp?.toUpperCase() || 'App'})`;
      } else if (payment.method === 'netbanking') {
        paymentMethodLabel = `Net Banking (${payment.bank?.toUpperCase() || 'Bank'})`;
      } else if (payment.method === 'wallet') {
        paymentMethodLabel = `Wallet (${payment.wallet?.toUpperCase() || 'Wallet'})`;
      } else if (payment.method === 'card') {
        const last4 = (payment.cardNumber || '').slice(-4) || '4242';
        paymentMethodLabel = `Credit/Debit Card (•••• ${last4})`;
      }

      const newSubscription: Subscription = {
        planId: selectedPlanId,
        status: 'active',
        billingCycle,
        startDate: now.toISOString(),
        renewalDate: renewalDate.toLocaleDateString('en-IN', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }),
        amountPaid: pricing.totalPayable,
        orderId: result.orderId || 'MH-SUB-DEMO',
        paymentMethod: paymentMethodLabel,
        billingDetails: billing,
      };

      const orderSummary: LastOrderSummary = {
        planId: selectedPlanId,
        billingCycle,
        amountPaid: pricing.totalPayable,
        orderId: result.orderId || 'MH-SUB-DEMO',
        transactionId: result.transactionId,
        date: now.toLocaleDateString('en-IN', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        paymentMethod: paymentMethodLabel,
        billingDetails: billing,
      };

      // Persist to localStorage
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newSubscription));
        localStorage.setItem(LAST_ORDER_KEY, JSON.stringify(orderSummary));
      } catch {
        // ignore
      }

      // Sync purchase transaction to backend database and update user role
      try {
        import('../services/apiClient').then(({ apiRequest }) => {
          apiRequest('/subscriptions/checkout', {
            method: 'POST',
            body: JSON.stringify({
              planId: selectedPlanId,
              billingCycle,
              amount: pricing.totalPayable,
              billingDetails: billing,
              paymentDetails: payment,
            }),
          }).catch((err) => console.warn('Purchase cloud sync deferred:', err));
        });
      } catch {
        // Non-fatal
      }

      set({
        currentSubscription: newSubscription,
        lastOrderResult: result,
        lastOrderSummary: orderSummary,
        isProcessingPayment: false,
        paymentError: null,
      });

      return result;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred during demo checkout.';
      set({
        isProcessingPayment: false,
        paymentError: msg,
        lastOrderResult: { success: false, errorMessage: msg },
      });
      return { success: false, errorMessage: msg };
    }
  },

  cancelSubscription: () => {
    const current = get().currentSubscription;
    const cancelled: Subscription = {
      ...current,
      status: 'cancelled',
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cancelled));
    } catch {
      // ignore
    }
    set({ currentSubscription: cancelled });
  },

  resetToFree: () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_FREE_SUBSCRIPTION));
    } catch {
      // ignore
    }
    set({
      currentSubscription: DEFAULT_FREE_SUBSCRIPTION,
      appliedCoupon: null,
      paymentError: null,
    });
  },
}));

