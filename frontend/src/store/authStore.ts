// 인증 관련 상태 관리 (Zustand 도입 예정)
// TODO: Zustand 라이브러리 설치 후 구현 예정

import { User } from '../lib/api';

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface AuthActions {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (name: string, email: string, password: string) => Promise<void>;
  loadUser: () => Promise<void>;
  clearError: () => void;
}

// Zustand 도입 시 다음과 같은 구조로 구현 예정:
/*
import { create } from 'zustand';
import { authApi } from '../lib/api';
import { tokenUtils } from '../lib/helpers';

interface AuthStore extends AuthState, AuthActions {}

export const useAuthStore = create<AuthStore>((set, get) => ({
  // Initial state
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,

  // Actions
  login: async (email: string, password: string) => {
    set({ loading: true, error: null });
    try {
      const { token } = await authApi.login({ email, password });
      tokenUtils.set(token);
      set({ token, isAuthenticated: true, loading: false });
      await get().loadUser();
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Login failed', 
        loading: false 
      });
    }
  },

  logout: () => {
    tokenUtils.remove();
    set({ 
      user: null, 
      token: null, 
      isAuthenticated: false, 
      error: null 
    });
  },

  signup: async (name: string, email: string, password: string) => {
    set({ loading: true, error: null });
    try {
      await authApi.signup({ name, email, password });
      set({ loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Signup failed', 
        loading: false 
      });
    }
  },

  loadUser: async () => {
    const token = tokenUtils.get();
    if (!token) return;

    set({ loading: true });
    try {
      const user = await authApi.getProfile();
      set({ user, token, isAuthenticated: true, loading: false });
    } catch (error) {
      tokenUtils.remove();
      set({ 
        user: null, 
        token: null, 
        isAuthenticated: false, 
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to load user'
      });
    }
  },

  clearError: () => set({ error: null }),
}));
*/
