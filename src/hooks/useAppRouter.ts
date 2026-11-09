import { useState, useEffect, useCallback } from 'react';

export type AppRoute =
  | 'home'
  | 'login'
  | 'signup'
  | 'editor'
  | 'profile'
  | 'drafts'
  | 'gif-generator'
  | 'community'
  | 'pricing'
  | 'checkout'
  | 'payment-success'
  | 'payment-failed'
  | 'admin'
  | 'not-found';

function getCurrentRoute(): AppRoute {
  if (typeof window === 'undefined') return 'home';

  const pathname = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();

  if (pathname === '/login' || hash === '#login') {
    return 'login';
  }
  if (pathname === '/signup' || hash === '#signup') {
    return 'signup';
  }
  if (pathname === '/editor' || hash === '#editor' || pathname.startsWith('/editor')) {
    return 'editor';
  }
  if (
    pathname === '/profile' ||
    hash === '#profile' ||
    pathname.startsWith('/profile') ||
    pathname === '/dashboard' ||
    hash === '#dashboard' ||
    pathname.startsWith('/dashboard')
  ) {
    return 'profile';
  }
  if (pathname === '/drafts' || hash === '#drafts' || pathname.startsWith('/drafts')) {
    return 'drafts';
  }
  if (
    pathname === '/gif-maker' ||
    hash === '#gif-maker' ||
    pathname === '/gif-generator' ||
    hash === '#gif-generator' ||
    pathname === '/gif' ||
    hash === '#gif' ||
    pathname === '/gifmaker' ||
    pathname.startsWith('/gif-')
  ) {
    return 'gif-generator';
  }
  if (
    pathname === '/community' ||
    hash === '#community' ||
    pathname === '/explore' ||
    hash === '#explore' ||
    pathname.startsWith('/community')
  ) {
    return 'community';
  }
  if (
    pathname === '/pricing' ||
    hash === '#pricing' ||
    pathname === '/subscription' ||
    hash === '#subscription' ||
    pathname === '/plans' ||
    hash === '#plans'
  ) {
    return 'pricing';
  }
  if (pathname === '/checkout' || hash === '#checkout') {
    return 'checkout';
  }
  if (
    pathname === '/payment/success' ||
    hash === '#payment/success' ||
    pathname === '/payment-success' ||
    hash === '#payment-success'
  ) {
    return 'payment-success';
  }
  if (
    pathname === '/payment/failed' ||
    hash === '#payment/failed' ||
    pathname === '/payment-failed' ||
    hash === '#payment-failed' ||
    pathname === '/payment/cancel' ||
    hash === '#payment/cancel'
  ) {
    return 'payment-failed';
  }
  if (pathname === '/admin' || hash === '#admin' || pathname.startsWith('/admin')) {
    return 'admin';
  }

  // Known home paths, templates section, AI tools, and root anchor links
  if (
    pathname === '/' ||
    pathname === '' ||
    pathname === '/home' ||
    pathname === '/index.html' ||
    pathname === '/templates' ||
    hash === '#templates' ||
    pathname === '/ai-tools' ||
    hash === '#ai-tools' ||
    pathname === '/ai-assistant' ||
    hash === '#ai-assistant'
  ) {
    return 'home';
  }

  if (hash === '#home') {
    return 'home';
  }

  // If on root path with an anchor link (e.g. #templates, #ai-tools, #about)
  if (pathname === '/' && hash.startsWith('#')) {
    return 'home';
  }

  return 'not-found';
}

export function useAppRouter() {
  const [route, setRoute] = useState<AppRoute>(getCurrentRoute);

  useEffect(() => {
    const handleLocationChange = () => {
      setRoute(getCurrentRoute());
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const navigate = useCallback((to: string, options?: { preserveScroll?: boolean }) => {
    if (typeof window === 'undefined') return;

    // Support pathnames (/login, /signup, /editor, /profile, /drafts, /) and hashes (#login, #signup, #editor, #profile, #drafts, #home)
    const normalized = to.toLowerCase();
    const shouldScroll = !options?.preserveScroll;

    if (normalized === '/login' || normalized === '#login') {
      window.history.pushState({}, '', '/login');
      setRoute('login');
      // Do not scroll to top when opening authentication modal over the page
    } else if (normalized === '/signup' || normalized === '#signup') {
      window.history.pushState({}, '', '/signup');
      setRoute('signup');
      // Do not scroll to top when opening authentication modal over the page
    } else if (normalized === '/editor' || normalized === '#editor' || normalized.startsWith('/editor')) {
      window.history.pushState({}, '', '/editor');
      setRoute('editor');
      if (shouldScroll) window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (
      normalized === '/profile' ||
      normalized === '#profile' ||
      normalized.startsWith('/profile') ||
      normalized === '/dashboard' ||
      normalized === '#dashboard' ||
      normalized.startsWith('/dashboard')
    ) {
      window.history.pushState({}, '', '/profile');
      setRoute('profile');
      if (shouldScroll) window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (normalized === '/drafts' || normalized === '#drafts' || normalized.startsWith('/drafts')) {
      window.history.pushState({}, '', '/drafts');
      setRoute('drafts');
      if (shouldScroll) window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (
      normalized === '/gif-maker' ||
      normalized === '#gif-maker' ||
      normalized === '/gif-generator' ||
      normalized === '#gif-generator' ||
      normalized === '/gif' ||
      normalized === '#gif' ||
      normalized === '/gifmaker' ||
      normalized.startsWith('/gif-')
    ) {
      window.history.pushState({}, '', '/gif-maker');
      setRoute('gif-generator');
      if (shouldScroll) window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (
      normalized === '/community' ||
      normalized === '#community' ||
      normalized === '/explore' ||
      normalized === '#explore' ||
      normalized.startsWith('/community')
    ) {
      window.history.pushState({}, '', '/community');
      setRoute('community');
      if (shouldScroll) window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (
      normalized === '/pricing' ||
      normalized === '#pricing' ||
      normalized === '/subscription' ||
      normalized === '#subscription' ||
      normalized === '/plans' ||
      normalized === '#plans'
    ) {
      window.history.pushState({}, '', '/pricing');
      setRoute('pricing');
      if (shouldScroll) window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (
      normalized === '/checkout' ||
      normalized === '#checkout'
    ) {
      window.history.pushState({}, '', '/checkout');
      setRoute('checkout');
      if (shouldScroll) window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (
      normalized === '/payment/success' ||
      normalized === '#payment/success' ||
      normalized === '/payment-success' ||
      normalized === '#payment-success'
    ) {
      window.history.pushState({}, '', '/payment/success');
      setRoute('payment-success');
      if (shouldScroll) window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (
      normalized === '/payment/failed' ||
      normalized === '#payment/failed' ||
      normalized === '/payment-failed' ||
      normalized === '#payment-failed' ||
      normalized === '/payment/cancel' ||
      normalized === '#payment/cancel'
    ) {
      window.history.pushState({}, '', '/payment/failed');
      setRoute('payment-failed');
      if (shouldScroll) window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (
      normalized === '/admin' ||
      normalized === '#admin' ||
      normalized.startsWith('/admin')
    ) {
      window.history.pushState({}, '', '/admin');
      setRoute('admin');
      if (shouldScroll) window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (
      normalized === '/404' ||
      normalized === '#404' ||
      normalized === '/not-found' ||
      normalized === 'not-found'
    ) {
      window.history.pushState({}, '', '/404');
      setRoute('not-found');
      if (shouldScroll) window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (
      normalized === '/templates' ||
      normalized === '#templates'
    ) {
      window.history.pushState({}, '', '/#templates');
      setRoute('home');
      setTimeout(() => {
        const el = document.getElementById('templates');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 50);
    } else if (
      normalized === '/ai-tools' ||
      normalized === '#ai-tools' ||
      normalized === '/ai-assistant' ||
      normalized === '#ai-assistant'
    ) {
      window.history.pushState({}, '', '/#ai-tools');
      setRoute('home');
      setTimeout(() => {
        const el = document.getElementById('ai-tools');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 50);
    } else if (
      normalized === '/' ||
      normalized === '#home' ||
      normalized === '/#home' ||
      normalized === '/home' ||
      normalized === 'home'
    ) {
      if (typeof document !== 'undefined') {
        document.body.style.overflow = '';
      }
      window.history.pushState({}, '', '/');
      setRoute('home');
      if (shouldScroll) {
        const scrollToHome = () => {
          if (typeof document !== 'undefined') {
            document.body.style.overflow = '';
            const homeEl = document.getElementById('home');
            if (homeEl) {
              homeEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            if (typeof window.scrollTo === 'function') {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
            if (typeof document.documentElement?.scrollTo === 'function') {
              document.documentElement.scrollTo({ top: 0, behavior: 'smooth' });
            }
            if (typeof document.body?.scrollTo === 'function') {
              document.body.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }
        };
        scrollToHome();
        setTimeout(scrollToHome, 50);
        setTimeout(scrollToHome, 150);
      }
    } else if (to.startsWith('#')) {
      // Anchor link on home page
      window.history.pushState({}, '', '/' + to);
      setRoute('home');
      if (typeof document !== 'undefined') {
        document.body.style.overflow = '';
        const scrollToAnchor = () => {
          try {
            const el = document.querySelector(to);
            if (el) {
              el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          } catch {
            // Safe fallback for invalid CSS selectors
          }
        };
        scrollToAnchor();
        setTimeout(scrollToAnchor, 50);
        setTimeout(scrollToAnchor, 150);
      }
    } else {
      window.history.pushState({}, '', to);
      setRoute(getCurrentRoute());
    }
  }, []);

  return { route, navigate };
}
