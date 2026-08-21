import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';
import { AUTH_COOKIE } from '../lib/constants';
import type { User } from '../types/user';

interface AuthState {
  user: User | null;
  isHydrated: boolean;
  setSession: (user: User, token: string) => void;
  logout: () => void;
  setHydrated: () => void;
}

// User info lives in localStorage (via persist) purely for a snappy UI on
// refresh - the actual access control is the cookie, which is what the
// Next.js middleware and the axios interceptor both read.
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isHydrated: false,
      setSession: (user, token) => {
        Cookies.set(AUTH_COOKIE, token, { expires: 7, sameSite: 'lax' });
        set({ user });
      },
      logout: () => {
        Cookies.remove(AUTH_COOKIE);
        set({ user: null });
      },
      setHydrated: () => set({ isHydrated: true }),
    }),
    {
      name: 'tm-auth',
      partialize: (state) => ({ user: state.user }),
      onRehydrateStorage: () => (state) => state?.setHydrated(),
    },
  ),
);
