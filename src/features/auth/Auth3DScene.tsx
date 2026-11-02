import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowLeft,
  AlertCircle,
  Shield,
  X,
} from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { AuthBrandScene } from './AuthBrandScene';
import { PasswordStrengthMeter } from './PasswordStrengthMeter';
import { ForgotPasswordModal } from './ForgotPasswordModal';
import { TermsModal } from './TermsModal';
import { authService } from '../../services/authService';
import { useAuthStore } from '../../stores/useAuthStore';
import { useTemplateStore } from '../../stores/useTemplateStore';
import type { LoginCredentials, SignUpCredentials, FormValidationErrors } from '../../types/auth';

export type AuthMode = 'login' | 'signup';

export interface Auth3DSceneProps {
  initialMode?: AuthMode;
  onNavigate?: (route: string, options?: { preserveScroll?: boolean }) => void;
  isModal?: boolean;
  onClose?: () => void;
}

export const Auth3DScene: React.FC<Auth3DSceneProps> = ({
  initialMode = 'login',
  onNavigate,
  isModal = false,
  onClose,
}) => {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [prevInitialMode, setPrevInitialMode] = useState<AuthMode>(initialMode);
  const [isFlipping, setIsFlipping] = useState(false);

  // Sync mode if initialMode prop changes (e.g. browser back/forward or navigation event)
  if (initialMode !== prevInitialMode) {
    setPrevInitialMode(initialMode);
    setMode(initialMode);
  }

  // Modal dialog states
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  // General API/Backend notice alert
  const [apiError, setApiError] = useState<string | null>(null);

  // -------------------------------------------------------------
  // 1. LOGIN FORM STATE & VALIDATION
  // -------------------------------------------------------------
  const [loginData, setLoginData] = useState<LoginCredentials>({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [loginShowPassword, setLoginShowPassword] = useState(false);
  const [loginErrors, setLoginErrors] = useState<FormValidationErrors>({});
  const [loginTouched, setLoginTouched] = useState<Record<string, boolean>>({});
  const [isLoginLoading, setIsLoginLoading] = useState(false);

  // -------------------------------------------------------------
  // 2. SIGN UP FORM STATE & VALIDATION
  // -------------------------------------------------------------
  const [signUpData, setSignUpData] = useState<SignUpCredentials>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });
  const [signUpShowPassword, setSignUpShowPassword] = useState(false);
  const [signUpShowConfirmPassword, setSignUpShowConfirmPassword] = useState(false);
  const [signUpErrors, setSignUpErrors] = useState<FormValidationErrors>({});
  const [signUpTouched, setSignUpTouched] = useState<Record<string, boolean>>({});
  const [isSignUpLoading, setIsSignUpLoading] = useState(false);

  // Shared Email validator
  const validateEmail = (email: string): string | undefined => {
    if (!email.trim()) return 'Email address is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) return 'Please enter a valid email address';
    return undefined;
  };

  // -------------------------------------------------------------
  // 3. 3D FLIP ANIMATION CONTROLLER
  // -------------------------------------------------------------
  const flipTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleFlip = (targetMode: AuthMode) => {
    if (isFlipping || mode === targetMode) return;

    setIsFlipping(true);
    setMode(targetMode);
    setApiError(null);

    // Update browser URL silently without page reload
    if (typeof window !== 'undefined') {
      const path = targetMode === 'login' ? '/login' : '/signup';
      window.history.replaceState(null, '', path);
    }

    if (flipTimerRef.current) clearTimeout(flipTimerRef.current);
    // 750ms matches the refined cinematic cubic-bezier duration
    flipTimerRef.current = setTimeout(() => {
      setIsFlipping(false);
    }, 750);
  };

  useEffect(() => {
    return () => {
      if (flipTimerRef.current) clearTimeout(flipTimerRef.current);
    };
  }, []);

  // -------------------------------------------------------------
  // 4. SUBMIT HANDLERS (Frontend Isolated Submission)
  // -------------------------------------------------------------
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailErr = validateEmail(loginData.email);
    const passwordErr = !loginData.password ? 'Password is required' : undefined;

    setLoginTouched({ email: true, password: true });
    setLoginErrors({ email: emailErr, password: passwordErr });

    if (emailErr || passwordErr) return;

    setIsLoginLoading(true);
    setApiError(null);

    try {
      const user = await useAuthStore.getState().login(loginData);
      handleClose();
      useTemplateStore.getState().setNotification({
        type: 'success',
        message: `Welcome back, ${user.fullName}!`,
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setApiError(err.message);
      } else {
        setApiError('An unexpected error occurred during login. Please try again.');
      }
    } finally {
      setIsLoginLoading(false);
    }
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const nameErr = !signUpData.fullName.trim()
      ? 'Full name is required'
      : signUpData.fullName.trim().length < 2
      ? 'Full name must be at least 2 characters'
      : undefined;
    const emailErr = validateEmail(signUpData.email);
    const passErr = !signUpData.password
      ? 'Password is required'
      : signUpData.password.length < 8
      ? 'Password must be at least 8 characters'
      : undefined;
    const confirmErr = !signUpData.confirmPassword
      ? 'Please confirm your password'
      : signUpData.confirmPassword !== signUpData.password
      ? 'Passwords do not match'
      : undefined;
    const termsErr = !signUpData.agreeToTerms
      ? 'You must agree to the Terms of Service'
      : undefined;

    setSignUpTouched({
      fullName: true,
      email: true,
      password: true,
      confirmPassword: true,
      agreeToTerms: true,
    });

    setSignUpErrors({
      fullName: nameErr,
      email: emailErr,
      password: passErr,
      confirmPassword: confirmErr,
      agreeToTerms: termsErr,
    });

    if (nameErr || emailErr || passErr || confirmErr || termsErr) return;

    setIsSignUpLoading(true);
    setApiError(null);

    try {
      const user = await useAuthStore.getState().signUp(signUpData);
      handleClose();
      useTemplateStore.getState().setNotification({
        type: 'success',
        message: `Account created successfully! Welcome to MemeGen, ${user.fullName}!`,
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setApiError(err.message);
      } else {
        setApiError('An unexpected error occurred during registration. Please try again.');
      }
    } finally {
      setIsSignUpLoading(false);
    }
  };

  const modalContainerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  const handleClose = useCallback(() => {
    if (onClose) {
      onClose();
    } else if (onNavigate) {
      onNavigate('/', { preserveScroll: true });
    } else {
      window.history.pushState({}, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  }, [onClose, onNavigate]);

  const handleBackHome = () => {
    if (isModal) {
      handleClose();
    } else if (onNavigate) {
      onNavigate('#home');
    } else {
      window.location.hash = '#home';
    }
  };

  // Escape key handler for modal
  useEffect(() => {
    if (!isModal) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showForgotModal) {
          setShowForgotModal(false);
          return;
        }
        if (showTermsModal) {
          setShowTermsModal(false);
          return;
        }
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModal, showForgotModal, showTermsModal, handleClose]);

  // Scroll locking with scrollbar width compensation to prevent desktop layout shifts
  useEffect(() => {
    if (!isModal) return;

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;

    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [isModal]);

  // Reset modal scroll position to top on open and mode switch
  useEffect(() => {
    if (isModal && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [isModal, mode]);

  // Focus management on modal mount and mode change (preventScroll avoids pushing modal off-screen)
  useEffect(() => {
    if (isModal) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      const timer = setTimeout(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTop = 0;
        }
        const activeContainer = modalContainerRef.current;
        if (activeContainer) {
          const input = activeContainer.querySelector<HTMLInputElement>(
            mode === 'login' ? '#flipper-login-email' : '#flipper-signup-name'
          );
          input?.focus({ preventScroll: true });
        }
      }, 60);

      return () => {
        clearTimeout(timer);
        if (previousActiveElement.current && typeof previousActiveElement.current.focus === 'function') {
          previousActiveElement.current.focus({ preventScroll: true });
        }
      };
    }
  }, [isModal, mode]);

  const isLoginActive = mode === 'login';

  // 3D Flipping Card Stage (shared between standalone and modal mode with zero duplication)
  const renderFlipStage = () => (
    <div className="w-full flex items-center justify-center perspective-1600">
      <div
        className={`auth-3d-flipper w-full transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] transform-style-3d relative ${
          mode === 'signup' ? 'rotate-y-180' : 'rotate-y-0'
        } ${isFlipping ? 'scale-[0.985]' : 'scale-100'}`}
      >
        {/* ========================================================== */}
        {/* FACE 1: LOGIN (Front Face)                                 */}
        {/* ========================================================== */}
        <div
          className={`w-full rounded-2xl bg-white text-slate-900 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5),0_0_25px_rgba(37,99,235,0.2)] border border-slate-100 p-4 xs:p-5 sm:p-6 backface-hidden transition-all duration-300 ${
            isLoginActive ? 'relative z-10 opacity-100' : 'absolute inset-0 pointer-events-none opacity-0'
          }`}
          aria-hidden={!isLoginActive}
        >
          <h2 id="auth-modal-login-title" className="sr-only">
            Sign In to MemeHub
          </h2>
                {/* Brand Logo inside top of form */}
                <div className="flex flex-col items-center justify-center pb-1 gap-1.5">
                  <AuthBrandScene onBackHome={handleBackHome} />
                  {!authService.isBackendConfigured() && (
                    <span className="text-[10px] font-bold tracking-wider uppercase text-blue-700 bg-blue-50 border border-blue-200/80 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 shadow-2xs">
                      <Shield className="w-3 h-3 text-blue-600" />
                      <span>Development Demo Auth</span>
                    </span>
                  )}
                </div>
                {/* Friendly API / Backend Alert */}
                {apiError && isLoginActive && (
                  <div
                    role="alert"
                    className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-2.5 text-xs animate-in fade-in duration-200"
                  >
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div className="space-y-0.5 text-left">
                      <span className="font-semibold block">Authentication Notice</span>
                      <p className="text-amber-800">{apiError}</p>
                    </div>
                  </div>
                )}

                {/* Social OAuth Button (Google Only) */}
                <div className="space-y-2">
                  <button
                    type="button"
                    tabIndex={isLoginActive ? 0 : -1}
                    onClick={() =>
                      setApiError('Google OAuth is pending backend configuration.')
                    }
                    className="w-full flex items-center justify-center gap-2.5 py-2.5 px-3 rounded-xl border border-slate-200/90 bg-white hover:bg-[#EFF6FF] text-xs sm:text-sm font-semibold text-slate-700 hover:text-[#1463E9] shadow-2xs hover:border-[#1463E9]/30 hover:shadow-xs hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 cursor-pointer min-h-[40px] focus-visible:ring-2 focus-visible:ring-[#1463E9] focus-visible:outline-none"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span>Continue with Google</span>
                  </button>

                  <div className="relative flex items-center justify-center py-0.5">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-200" />
                    </div>
                    <span className="relative bg-white px-2 text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                      or with email
                    </span>
                  </div>
                </div>


                {/* Login Form */}
                <form onSubmit={handleLoginSubmit} className="space-y-2.5 text-left" noValidate>
                  <Input
                    label="Email Address"
                    type="email"
                    id="flipper-login-email"
                    autoComplete="email"
                    tabIndex={isLoginActive ? 0 : -1}
                    value={loginData.email}
                    onChange={(e) =>
                      setLoginData((prev) => ({ ...prev, email: e.target.value }))
                    }
                    onBlur={() =>
                      setLoginErrors((prev) => ({
                        ...prev,
                        email: validateEmail(loginData.email),
                      }))
                    }
                    placeholder="example@gmail.com"
                    leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
                    error={loginTouched.email ? loginErrors.email : undefined}
                    required
                  />

                  <Input
                    label="Password"
                    type={loginShowPassword ? 'text' : 'password'}
                    id="flipper-login-password"
                    autoComplete="current-password"
                    tabIndex={isLoginActive ? 0 : -1}
                    value={loginData.password}
                    onChange={(e) =>
                      setLoginData((prev) => ({ ...prev, password: e.target.value }))
                    }
                    onBlur={() =>
                      setLoginErrors((prev) => ({
                        ...prev,
                        password: !loginData.password ? 'Password is required' : undefined,
                      }))
                    }
                    placeholder="Enter your password"
                    leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
                    rightIcon={
                      <button
                        type="button"
                        tabIndex={isLoginActive ? 0 : -1}
                        onClick={() => setLoginShowPassword((prev) => !prev)}
                        className="p-1 text-slate-400 hover:text-slate-600 focus:outline-none"
                        aria-label={loginShowPassword ? 'Hide password' : 'Show password'}
                      >
                        {loginShowPassword ? (
                          <EyeOff className="w-4 h-4 text-slate-500" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    }
                    error={loginTouched.password ? loginErrors.password : undefined}
                    required
                  />

                  {/* Remember Me & Forgot Password Row */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        id="flipper-login-remember"
                        tabIndex={isLoginActive ? 0 : -1}
                        checked={loginData.rememberMe}
                        onChange={(e) =>
                          setLoginData((prev) => ({ ...prev, rememberMe: e.target.checked }))
                        }
                        className="w-4 h-4 rounded-md border-slate-300 text-blue-600 focus:ring-blue-500/20 focus:ring-2 cursor-pointer"
                      />
                      <span className="text-xs font-medium text-slate-600 hover:text-slate-900">
                        Remember me
                      </span>
                    </label>

                    <button
                      type="button"
                      tabIndex={isLoginActive ? 0 : -1}
                      onClick={() => setShowForgotModal(true)}
                      className="text-xs font-semibold text-[#1463E9] hover:text-[#0E52C7] hover:underline cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-1">
                    <Button
                      type="submit"
                      variant="primary"
                      size="md"
                      fullWidth
                      tabIndex={isLoginActive ? 0 : -1}
                      isLoading={isLoginLoading}
                      disabled={isLoginLoading || isFlipping}
                      className="font-bold shadow-md shadow-blue-600/25 hover:shadow-lg hover:shadow-blue-500/35 min-h-[44px]"
                    >
                      Sign In to Account
                    </Button>
                  </div>
                </form>

                {/* 3D Flip Switcher: Click reveals Sign Up */}
                <div className="pt-1.5 text-center border-t border-slate-100">
                  <p className="text-xs text-slate-500">
                    Don&apos;t have an account?{' '}
                    <button
                      type="button"
                      tabIndex={isLoginActive ? 0 : -1}
                      disabled={isFlipping}
                      onClick={() => handleFlip('signup')}
                      className="font-bold text-[#1463E9] hover:text-[#0E52C7] hover:underline cursor-pointer transition-colors"
                    >
                      Create an account &rarr;
                    </button>
                  </p>
                </div>
              </div>

            {/* ========================================================== */}
            {/* FACE 2: SIGN UP (Back Face - rotated 180deg)                */}
            {/* ========================================================== */}
            <div
              className={`w-full rounded-2xl bg-white text-slate-900 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5),0_0_25px_rgba(6,182,212,0.2)] border border-slate-100 p-4 xs:p-5 sm:p-6 rotate-y-180 backface-hidden transition-all duration-300 ${
                !isLoginActive ? 'relative z-10 opacity-100' : 'absolute inset-0 pointer-events-none opacity-0'
              }`}
              aria-hidden={isLoginActive}
            >
              <h2 id="auth-modal-signup-title" className="sr-only">
                Create Free MemeHub Account
              </h2>
                {/* Brand Logo inside top of form */}
                <div className="flex flex-col items-center justify-center pb-1 gap-1.5">
                  <AuthBrandScene onBackHome={handleBackHome} />
                  {!authService.isBackendConfigured() && (
                    <span className="text-[10px] font-bold tracking-wider uppercase text-cyan-700 bg-cyan-50 border border-cyan-200/80 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 shadow-2xs">
                      <Shield className="w-3 h-3 text-cyan-600" />
                      <span>Development Demo Auth</span>
                    </span>
                  )}
                </div>

                {/* Friendly API / Backend Alert */}
                {apiError && !isLoginActive && (
                  <div
                    role="alert"
                    className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-2 text-xs animate-in fade-in duration-200"
                  >
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div className="space-y-0.5 text-left">
                      <span className="font-semibold block">Registration Notice</span>
                      <p className="text-amber-800">{apiError}</p>
                    </div>
                  </div>
                )}

                {/* Registration Form */}
                <form onSubmit={handleSignUpSubmit} className="space-y-2.5 text-left" noValidate>
                  <Input
                    label="Full Name"
                    type="text"
                    id="flipper-signup-name"
                    autoComplete="name"
                    tabIndex={!isLoginActive ? 0 : -1}
                    value={signUpData.fullName}
                    onChange={(e) =>
                      setSignUpData((prev) => ({ ...prev, fullName: e.target.value }))
                    }
                    placeholder="Your Name"
                    leftIcon={<User className="w-4 h-4 text-slate-400" />}
                    error={signUpTouched.fullName ? signUpErrors.fullName : undefined}
                    required
                  />

                  <Input
                    label="Email Address"
                    type="email"
                    id="flipper-signup-email"
                    autoComplete="email"
                    tabIndex={!isLoginActive ? 0 : -1}
                    value={signUpData.email}
                    onChange={(e) =>
                      setSignUpData((prev) => ({ ...prev, email: e.target.value }))
                    }
                    placeholder="example@gmail.com"
                    leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
                    error={signUpTouched.email ? signUpErrors.email : undefined}
                    required
                  />

                  <div className="space-y-1">
                    <Input
                      label="Create Password"
                      type={signUpShowPassword ? 'text' : 'password'}
                      id="flipper-signup-password"
                      autoComplete="new-password"
                      tabIndex={!isLoginActive ? 0 : -1}
                      value={signUpData.password}
                      onChange={(e) =>
                        setSignUpData((prev) => ({ ...prev, password: e.target.value }))
                      }
                      placeholder="At least 8 characters"
                      leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
                      rightIcon={
                        <button
                          type="button"
                          tabIndex={!isLoginActive ? 0 : -1}
                          onClick={() => setSignUpShowPassword((prev) => !prev)}
                          className="p-1 text-slate-400 hover:text-slate-600 focus:outline-none"
                          aria-label={signUpShowPassword ? 'Hide password' : 'Show password'}
                        >
                          {signUpShowPassword ? (
                            <EyeOff className="w-4 h-4 text-slate-500" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      }
                      error={signUpTouched.password ? signUpErrors.password : undefined}
                      required
                    />

                    {/* Password Strength Meter */}
                    <PasswordStrengthMeter password={signUpData.password} />
                  </div>

                  <Input
                    label="Confirm Password"
                    type={signUpShowConfirmPassword ? 'text' : 'password'}
                    id="flipper-signup-confirm"
                    autoComplete="new-password"
                    tabIndex={!isLoginActive ? 0 : -1}
                    value={signUpData.confirmPassword}
                    onChange={(e) =>
                      setSignUpData((prev) => ({ ...prev, confirmPassword: e.target.value }))
                    }
                    placeholder="Re-enter your password"
                    leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
                    rightIcon={
                      <button
                        type="button"
                        tabIndex={!isLoginActive ? 0 : -1}
                        onClick={() => setSignUpShowConfirmPassword((prev) => !prev)}
                        className="p-1 text-slate-400 hover:text-slate-600 focus:outline-none"
                        aria-label={signUpShowConfirmPassword ? 'Hide password' : 'Show password'}
                      >
                        {signUpShowConfirmPassword ? (
                          <EyeOff className="w-4 h-4 text-slate-500" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    }
                    error={signUpTouched.confirmPassword ? signUpErrors.confirmPassword : undefined}
                    required
                  />

                  {/* Terms Checkbox */}
                  <div className="space-y-1 pt-0.5">
                    <div className="flex items-start gap-2">
                      <input
                        type="checkbox"
                        id="flipper-signup-terms"
                        tabIndex={!isLoginActive ? 0 : -1}
                        checked={signUpData.agreeToTerms}
                        onChange={(e) =>
                          setSignUpData((prev) => ({ ...prev, agreeToTerms: e.target.checked }))
                        }
                        className="w-4 h-4 mt-0.5 rounded-md border-slate-300 text-blue-600 focus:ring-blue-500/20 focus:ring-2 cursor-pointer"
                      />
                      <label htmlFor="flipper-signup-terms" className="text-xs text-slate-600 select-none leading-relaxed">
                        I agree to the{' '}
                        <button
                          type="button"
                          tabIndex={!isLoginActive ? 0 : -1}
                          onClick={() => setShowTermsModal(true)}
                          className="font-semibold text-[#1463E9] hover:text-[#0E52C7] hover:underline"
                        >
                          Terms of Service & Community Rules
                        </button>
                      </label>
                    </div>

                    {signUpTouched.agreeToTerms && signUpErrors.agreeToTerms && (
                      <p className="text-xs text-rose-500 font-medium pl-6">
                        {signUpErrors.agreeToTerms}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-1">
                    <Button
                      type="submit"
                      variant="primary"
                      size="md"
                      fullWidth
                      tabIndex={!isLoginActive ? 0 : -1}
                      isLoading={isSignUpLoading}
                      disabled={isSignUpLoading || isFlipping}
                      className="font-bold shadow-md shadow-blue-600/25 hover:shadow-lg hover:shadow-blue-500/35 min-h-[44px]"
                    >
                      Create Free Account
                    </Button>
                  </div>
                </form>

                {/* 3D Flip Switcher: Click reveals Login */}
                <div className="pt-1.5 text-center border-t border-slate-100">
                  <p className="text-xs text-slate-500">
                    Already have an account?{' '}
                    <button
                      type="button"
                      tabIndex={!isLoginActive ? 0 : -1}
                      disabled={isFlipping}
                      onClick={() => handleFlip('login')}
                      className="font-bold text-[#1463E9] hover:text-[#0E52C7] hover:underline cursor-pointer transition-colors"
                    >
                      &larr; Log in here
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

  // Render centered modal overlay over Homepage when isModal is true
  if (isModal) {
    return (
      <div
        ref={scrollContainerRef}
        className="fixed inset-0 z-50 overflow-y-auto overscroll-contain"
        role="dialog"
        aria-modal="true"
        aria-labelledby={isLoginActive ? 'auth-modal-login-title' : 'auth-modal-signup-title'}
      >
        {/* Backdrop Overlay with Gaussian Blur & Dimming */}
        <div
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-md transition-opacity duration-300 animate-in fade-in cursor-pointer"
          onClick={handleClose}
          aria-hidden="true"
        />

        {/* Centered Scrollable Stage Wrapper */}
        <div className="min-h-full flex justify-center p-3 sm:p-4 py-4 sm:py-6">
          <div
            ref={modalContainerRef}
            className="relative z-10 w-full max-w-[440px] my-auto animate-in zoom-in-95 fade-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Modal Controls: Mode Switcher Pills + Close Button */}
            <div className="w-full flex items-center justify-between gap-2 pb-2.5">
              {/* Mode Quick Toggle Pills */}
              <div className="flex items-center bg-white/10 border border-white/15 rounded-full p-0.5 backdrop-blur-xl shadow-lg">
                <button
                  type="button"
                  disabled={isFlipping}
                  onClick={() => handleFlip('login')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer min-h-[30px] flex items-center hover:-translate-y-0.5 active:scale-95 focus-visible:ring-2 focus-visible:ring-[#1463E9] focus-visible:outline-none ${
                    isLoginActive
                      ? 'bg-[#1463E9] text-white shadow-sm shadow-blue-600/40 font-bold'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  disabled={isFlipping}
                  onClick={() => handleFlip('signup')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer min-h-[30px] flex items-center hover:-translate-y-0.5 active:scale-95 focus-visible:ring-2 focus-visible:ring-[#1463E9] focus-visible:outline-none ${
                    !isLoginActive
                      ? 'bg-[#1463E9] text-white shadow-sm shadow-blue-600/40 font-bold'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Sign Up
                </button>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={handleClose}
                className="p-1.5 sm:p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white border border-white/15 backdrop-blur-xl shadow-lg transition-all duration-200 hover:-translate-y-0.5 active:scale-90 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none cursor-pointer flex items-center justify-center shrink-0"
                aria-label="Close dialog"
                title="Close (Esc)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 3D Flipping Authentication Card Stage */}
            {renderFlipStage()}

            {/* Global Bottom Security & Trust Note */}
            <div className="w-full pt-3 flex items-center justify-center gap-2 text-xs text-slate-400">
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
              <span>256-bit SSL encrypted • Private, secure & zero spam</span>
            </div>
          </div>
        </div>

        {/* Modals */}
        <ForgotPasswordModal
          isOpen={showForgotModal}
          onClose={() => setShowForgotModal(false)}
          initialEmail={loginData.email}
        />

        <TermsModal
          isOpen={showTermsModal}
          onClose={() => setShowTermsModal(false)}
          onAccept={() => {
            setSignUpData((prev) => ({ ...prev, agreeToTerms: true }));
          }}
        />
      </div>
    );
  }

  // Standalone Full-Page View (fallback for direct standalone rendering)
  return (
    <div className="min-h-[100dvh] min-h-screen w-full flex flex-col justify-between bg-gradient-to-br from-slate-900 via-[#071330] to-slate-950 text-slate-100 px-3 py-3 sm:px-4 sm:py-4 selection:bg-blue-600 selection:text-white relative overflow-x-hidden pt-safe pb-safe">
      {/* Top Global Navigation Bar */}
      <header className="w-full max-w-[450px] mx-auto flex items-center justify-between gap-2 py-1 z-20 flex-wrap sm:flex-nowrap">
        <button
          type="button"
          onClick={handleBackHome}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-all duration-200 cursor-pointer py-1.5 px-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-md hover:-translate-y-0.5 active:scale-95 min-h-[36px] focus-visible:ring-2 focus-visible:ring-[#1463E9] focus-visible:outline-none"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-cyan-400" />
          <span>Back to MemeHub</span>
        </button>

        {/* Mode Quick Toggle Pills */}
        <div className="flex items-center bg-white/5 border border-white/10 rounded-full p-0.5 backdrop-blur-md min-h-[36px]">
          <button
            type="button"
            disabled={isFlipping}
            onClick={() => handleFlip('login')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer min-h-[30px] flex items-center hover:-translate-y-0.5 active:scale-95 focus-visible:ring-2 focus-visible:ring-[#1463E9] focus-visible:outline-none ${
              isLoginActive
                ? 'bg-[#1463E9] text-white shadow-sm shadow-blue-600/40 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            disabled={isFlipping}
            onClick={() => handleFlip('signup')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer min-h-[30px] flex items-center hover:-translate-y-0.5 active:scale-95 focus-visible:ring-2 focus-visible:ring-[#1463E9] focus-visible:outline-none ${
              !isLoginActive
                ? 'bg-[#1463E9] text-white shadow-sm shadow-blue-600/40 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign Up
          </button>
        </div>
      </header>

      {/* Main Centered Authentication Composition */}
      <main className="w-full max-w-[450px] mx-auto my-auto flex flex-col items-center justify-center z-10 py-1">
        {renderFlipStage()}
      </main>

      {/* Global Bottom Security & Trust Note */}
      <footer className="w-full max-w-[450px] mx-auto pt-2 flex items-center justify-center gap-2 text-xs text-slate-400 z-10">
        <Shield className="w-3.5 h-3.5 text-cyan-400" />
        <span>256-bit SSL encrypted • Private, secure & zero spam</span>
      </footer>

      {/* Modals */}
      <ForgotPasswordModal
        isOpen={showForgotModal}
        onClose={() => setShowForgotModal(false)}
        initialEmail={loginData.email}
      />

      <TermsModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        onAccept={() => {
          setSignUpData((prev) => ({ ...prev, agreeToTerms: true }));
        }}
      />
    </div>
  );
};
