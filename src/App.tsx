import React, { useEffect, lazy, Suspense } from 'react';
import { CheckCircle, Info, X } from 'lucide-react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { PageLoadingFallback } from './components/ui/PageLoadingFallback';
import { AuthModal } from './features/auth/AuthModal';
import { useTemplateStore } from './stores/useTemplateStore';
import { useAuthStore } from './stores/useAuthStore';
import { IconButton } from './components/ui/IconButton';
import { useAppRouter } from './hooks/useAppRouter';

// Code-split heavy routes to drastically reduce initial bundle size and boost initial paint performance
const EditorPage = lazy(() => import('./pages/EditorPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const DraftsPage = lazy(() => import('./pages/DraftsPage'));
const GifGeneratorPage = lazy(() => import('./pages/GifGeneratorPage'));
const CommunityPage = lazy(() => import('./pages/CommunityPage'));
const PricingPage = lazy(() => import('./pages/PricingPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const PaymentSuccessPage = lazy(() => import('./pages/PaymentSuccessPage'));
const PaymentFailedPage = lazy(() => import('./pages/PaymentFailedPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage'));

export const App: React.FC = () => {
  const { route, navigate } = useAppRouter();
  const notification = useTemplateStore((state) => state.notification);
  const setNotification = useTemplateStore((state) => state.setNotification);

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isAuthLoading = useAuthStore((state) => state.isLoading);
  const initializeSession = useAuthStore((state) => state.initializeSession);

  // Initialize and restore authentication session on mount
  useEffect(() => {
    initializeSession();
  }, [initializeSession]);

  // Protect private routes: Profile and Drafts require confirmed authentication
  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated && (route === 'profile' || route === 'drafts')) {
      navigate('/login', { preserveScroll: true });
    }
  }, [route, isAuthenticated, isAuthLoading, navigate]);

  // Auto-dismiss notification toast after 4 seconds
  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => {
      setNotification(null);
    }, 4000);
    return () => clearTimeout(timer);
  }, [notification, setNotification]);

  // Log platform traffic and pageviews to backend DB
  useEffect(() => {
    try {
      import('./services/apiClient').then(({ apiRequest }) => {
        apiRequest('/analytics/track', {
          method: 'POST',
          body: JSON.stringify({
            path: `/${route === 'home' ? '' : route}`,
            referrer: typeof document !== 'undefined' ? document.referrer : 'direct',
          }),
        }).catch(() => {});
      });
    } catch {
      // Non-fatal
    }
  }, [route]);

  const isAuthModalOpen = route === 'login' || route === 'signup';

  // Dedicated Meme Editor View
  if (route === 'editor') {
    return (
      <div className="min-h-screen bg-[#070d1e] text-slate-100 selection:bg-blue-600 selection:text-white relative">
        <Suspense fallback={<PageLoadingFallback dark label="Launching Meme Studio..." />}>
          <EditorPage onNavigate={navigate} />
        </Suspense>
        {/* Floating Feedback Notification Toast */}
        {notification && (
          <aside
            role="status"
            aria-live="polite"
            className="fixed bottom-[calc(1.5rem+var(--sab))] left-4 right-4 sm:left-auto sm:right-6 z-50 max-w-sm sm:w-full bg-[#071330]/95 text-white p-3.5 rounded-2xl border border-blue-500/30 shadow-[0_12px_36px_-6px_rgba(0,0,0,0.6)] backdrop-blur-xl flex items-center justify-between gap-3 animate-in slide-in-from-bottom-3 duration-200"
          >
            <div className="flex items-center gap-2.5 text-xs sm:text-sm font-medium">
              {notification.type === 'success' ? (
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <Info className="w-4 h-4 text-cyan-400 shrink-0" />
              )}
              <span className="line-clamp-2">{notification.message}</span>
            </div>

            <IconButton
              variant="ghost"
              size="xs"
              onClick={() => setNotification(null)}
              aria-label="Dismiss notification"
              className="text-slate-400 hover:text-white hover:bg-white/10 rounded-lg shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </IconButton>
          </aside>
        )}
      </div>
    );
  }

  // Standard Main Application Layout
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900 selection:bg-blue-600 selection:text-white relative">
      {/* Accessibility Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-blue-600 focus:text-white focus:font-semibold focus:rounded-xl focus:shadow-2xl focus:ring-2 focus:ring-white transition-all"
      >
        Skip to main content
      </a>

      {/* Sticky Navigation Header */}
      <Header onNavigate={navigate} />

      {/* Floating Feedback Notification Toast */}
      {notification && (
        <aside
          role="status"
          aria-live="polite"
          className="fixed bottom-[calc(1.5rem+var(--sab))] left-4 right-4 sm:left-auto sm:right-6 z-50 max-w-sm sm:w-full bg-[#071330]/95 text-white p-3.5 rounded-2xl border border-blue-500/30 shadow-[0_12px_36px_-6px_rgba(0,0,0,0.6)] backdrop-blur-xl flex items-center justify-between gap-3 animate-in slide-in-from-bottom-3 duration-200"
        >
          <div className="flex items-center gap-2.5 text-xs sm:text-sm font-medium">
            {notification.type === 'success' ? (
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <Info className="w-4 h-4 text-cyan-400 shrink-0" />
            )}
            <span className="line-clamp-2">{notification.message}</span>
          </div>

          <IconButton
            variant="ghost"
            size="xs"
            onClick={() => setNotification(null)}
            aria-label="Dismiss notification"
            className="text-slate-400 hover:text-white hover:bg-white/10 rounded-lg shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </IconButton>
        </aside>
      )}

      {/* Main Page Content */}
      <main id="main-content" className="flex-1 w-full">
        <Suspense fallback={<PageLoadingFallback />}>
          {route === 'profile' ? (
            isAuthenticated || isAuthLoading ? (
              <ProfilePage onNavigate={navigate} />
            ) : (
              <HomePage onNavigate={navigate} />
            )
          ) : route === 'drafts' ? (
            isAuthenticated || isAuthLoading ? (
              <DraftsPage onNavigate={navigate} />
            ) : (
              <HomePage onNavigate={navigate} />
            )
          ) : route === 'gif-generator' ? (
            <GifGeneratorPage onNavigate={navigate} />
          ) : route === 'community' ? (
            <CommunityPage onNavigate={navigate} />
          ) : route === 'pricing' ? (
            <PricingPage onNavigate={navigate} />
          ) : route === 'checkout' ? (
            <CheckoutPage onNavigate={navigate} />
          ) : route === 'payment-success' ? (
            <PaymentSuccessPage onNavigate={navigate} />
          ) : route === 'payment-failed' ? (
            <PaymentFailedPage onNavigate={navigate} />
          ) : route === 'admin' ? (
            <AdminDashboardPage onNavigate={navigate} />
          ) : route === 'not-found' ? (
            <NotFoundPage onNavigate={navigate} />
          ) : (
            <HomePage onNavigate={navigate} />
          )}
        </Suspense>
      </main>

      {/* Global Footer */}
      <Footer onNavigate={navigate} />

      {/* Centered Authentication Modal Overlay */}
      <AuthModal
        isOpen={isAuthModalOpen}
        initialMode={route === 'signup' ? 'signup' : 'login'}
        onClose={() => navigate('/', { preserveScroll: true })}
        onNavigate={navigate}
      />
    </div>
  );
};

export default App;
