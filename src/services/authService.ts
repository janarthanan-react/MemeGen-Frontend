import type { LoginCredentials, SignUpCredentials, AuthUser } from '../types/auth';
import type { ApiResponse } from '../types/api';
import { apiRequest } from './apiClient';

/**
 * Authentication Service Contract
 *
 * Manages authentication network requests, session validation, and lifecycle.
 * - Communicates directly with backend endpoints (/auth/login, /auth/register, /auth/logout, /auth/me, /auth/reset-password).
 * - Strict security: Passwords are encrypted server-side with bcrypt; never stored client-side.
 */

export interface AuthSuccessPayload {
  user: AuthUser;
  token: string;
  isDemoMode?: boolean;
}

const AUTH_TOKEN_KEY = 'auth_token';
const AUTH_SESSION_KEY = 'memegen_auth_session_v1';

export const authService = {
  /**
   * Submit login credentials to real backend auth endpoint.
   */
  async login(credentials: LoginCredentials): Promise<AuthSuccessPayload> {
    const response = await apiRequest<ApiResponse<AuthSuccessPayload>>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: credentials.email.trim().toLowerCase(),
        password: credentials.password,
        rememberMe: credentials.rememberMe,
      }),
    });

    const payload = response.data;
    this.saveSession(payload.token, payload.user, credentials.rememberMe);
    return { ...payload, isDemoMode: false };
  },

  /**
   * Submit registration credentials to real backend auth endpoint.
   */
  async signUp(credentials: SignUpCredentials): Promise<AuthSuccessPayload> {
    const response = await apiRequest<ApiResponse<AuthSuccessPayload>>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        fullName: credentials.fullName.trim(),
        email: credentials.email.trim().toLowerCase(),
        password: credentials.password,
      }),
    });

    const payload = response.data;
    this.saveSession(payload.token, payload.user, false);
    return { ...payload, isDemoMode: false };
  },

  /**
   * Reset password with backend bcrypt encryption.
   */
  async resetPassword(email: string, newPassword: string): Promise<void> {
    await apiRequest<ApiResponse<any>>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        newPassword,
      }),
    });
  },

  /**
   * Google OAuth login
   */
  async googleLogin(profile: { email: string; fullName: string; avatarUrl?: string }): Promise<AuthSuccessPayload> {
    const response = await apiRequest<ApiResponse<AuthSuccessPayload>>('/auth/google', {
      method: 'POST',
      body: JSON.stringify(profile),
    });
    const payload = response.data;
    this.saveSession(payload.token, payload.user, false);
    return { ...payload, isDemoMode: false };
  },

  /**
   * Log out active session.
   */
  async logout(): Promise<void> {
    this.clearSession();
    try {
      // Notify backend asynchronously without blocking client logout flow
      apiRequest('/auth/logout', { method: 'POST' }).catch(() => {});
    } catch {
      // Non-fatal if server is unreachable
    }
  },

  /**
   * Validate existing session token with backend and restore authenticated user.
   */
  async validateSession(): Promise<{ user: AuthUser; token: string; isDemoMode: boolean } | null> {
    if (typeof window === 'undefined') return null;

    const token = sessionStorage.getItem(AUTH_TOKEN_KEY) || localStorage.getItem(AUTH_TOKEN_KEY);
    const sessionRaw =
      sessionStorage.getItem(AUTH_SESSION_KEY) || localStorage.getItem(AUTH_SESSION_KEY);

    if (!token || !sessionRaw) {
      this.clearSession();
      return null;
    }

    try {
      const parsed = JSON.parse(sessionRaw);
      if (!parsed || !parsed.user || !parsed.token || parsed.token !== token) {
        this.clearSession();
        return null;
      }

      // Verify token with backend
      try {
        const res = await apiRequest<ApiResponse<AuthUser>>('/auth/me');
        if (res && res.data) {
          return { user: res.data, token, isDemoMode: false };
        }
      } catch {
        // If offline or request fails but session is cached in storage, keep user session active
        if (parsed.user) {
          return { user: parsed.user, token, isDemoMode: false };
        }
        this.clearSession();
        return null;
      }

      return { user: parsed.user, token, isDemoMode: false };
    } catch {
      this.clearSession();
      return null;
    }
  },

  saveSession(token: string, user: AuthUser, rememberMe = false): void {
    if (typeof window === 'undefined') return;
    if (!user.avatarUrl || user.avatarUrl.includes('unsplash.com') || user.avatarUrl.includes('google')) {
      user.avatarUrl = '/Profille/no-dp_16.webp';
    }
    const storage = rememberMe ? localStorage : sessionStorage;

    storage.setItem(AUTH_TOKEN_KEY, token);
    storage.setItem(AUTH_SESSION_KEY, JSON.stringify({ token, user }));

    // Clean opposite storage to prevent ambiguous states
    const opposite = rememberMe ? sessionStorage : localStorage;
    opposite.removeItem(AUTH_TOKEN_KEY);
    opposite.removeItem(AUTH_SESSION_KEY);
  },

  clearSession(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_SESSION_KEY);
    sessionStorage.removeItem(AUTH_TOKEN_KEY);
    sessionStorage.removeItem(AUTH_SESSION_KEY);
  },
};
