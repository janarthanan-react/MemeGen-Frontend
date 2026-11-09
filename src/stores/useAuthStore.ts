import { create } from 'zustand';
import type { AuthUser, LoginCredentials, SignUpCredentials } from '../types/auth';
import { authService } from '../services/authService';
import { useProfileStore } from './useProfileStore';

export interface AuthStoreState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isDemoMode: boolean;

  // Actions
  login: (credentials: LoginCredentials) => Promise<AuthUser>;
  signUp: (credentials: SignUpCredentials) => Promise<AuthUser>;
  logout: () => Promise<void>;
  initializeSession: () => Promise<void>;
  updateCurrentUser: (updates: Partial<AuthUser>) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthStoreState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true, // true on initial load while validating session
  error: null,
  isDemoMode: false,

  login: async (credentials: LoginCredentials) => {
    set({ isLoading: true, error: null });
    try {
      const payload = await authService.login(credentials);
      set({
        user: payload.user,
        token: payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        isDemoMode: Boolean(payload.isDemoMode),
      });

      // Synchronize profile store with authenticated user
      useProfileStore.getState().initProfileForUser(payload.user);

      return payload.user;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed. Please try again.';
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: message,
      });
      throw err;
    }
  },

  signUp: async (credentials: SignUpCredentials) => {
    set({ isLoading: true, error: null });
    try {
      const payload = await authService.signUp(credentials);
      set({
        user: payload.user,
        token: payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        isDemoMode: Boolean(payload.isDemoMode),
      });

      useProfileStore.getState().initProfileForUser(payload.user);

      return payload.user;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Registration failed. Please try again.';
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: message,
      });
      throw err;
    }
  },

  logout: async () => {
    // Immediately clear client state so UI updates without waiting for network
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      isDemoMode: false,
    });
    useProfileStore.getState().clearProfile();

    try {
      await authService.logout();
    } catch {
      // Server notification error is non-fatal
    }
  },

  initializeSession: async () => {
    set({ isLoading: true, error: null });
    try {
      const session = await authService.validateSession();
      if (session) {
        set({
          user: session.user,
          token: session.token,
          isAuthenticated: true,
          isLoading: false,
          isDemoMode: session.isDemoMode,
        });

        // Sync profile
        useProfileStore.getState().initProfileForUser(session.user);
      } else {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          isDemoMode: false,
        });
        useProfileStore.getState().clearProfile();
      }
    } catch {
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        isDemoMode: false,
      });
      useProfileStore.getState().clearProfile();
    }
  },

  updateCurrentUser: (updates: Partial<AuthUser>) => {
    set((state) => {
      if (!state.user) return state;
      const updatedUser = { ...state.user, ...updates };
      // Also update persisted session if token exists
      if (state.token) {
        authService.saveSession(state.token, updatedUser);
      }
      return { user: updatedUser };
    });
  },

  clearError: () => set({ error: null }),
}));
