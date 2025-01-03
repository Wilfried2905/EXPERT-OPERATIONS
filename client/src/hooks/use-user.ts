import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: number;
  email: string;
  role: 'guest' | 'technician' | 'admin';
}

interface UserState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (credentials: { email: string; password: string }) => Promise<{ ok: boolean; message?: string }>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useUser = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      error: null,

      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
            credentials: 'include'
          });

          const data = await response.json();

          if (!response.ok) {
            set({ error: data.message, isLoading: false });
            return { ok: false, message: data.message };
          }

          set({ user: data.user, isLoading: false });
          return { ok: true };
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Une erreur est survenue';
          set({ error: message, isLoading: false });
          return { ok: false, message };
        }
      },

      logout: async () => {
        try {
          await fetch('/api/logout', {
            method: 'POST',
            credentials: 'include'
          });
        } finally {
          set({ user: null });
        }
      },

      checkAuth: async () => {
        try {
          const response = await fetch('/api/me', {
            credentials: 'include'
          });

          if (response.ok) {
            const data = await response.json();
            set({ user: data.user });
          } else {
            set({ user: null });
          }
        } catch (error) {
          set({ user: null });
        }
      }
    }),
    {
      name: '3r-user-storage',
      partialize: (state) => ({ user: state.user })
    }
  )
);