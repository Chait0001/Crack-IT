import { create } from 'zustand';
import api from '../utils/api';

// The product now uses one warm editorial visual language everywhere.
const getInitialTheme = () => 'light';

export const useAuthStore = create((set, get) => ({
  user: null,
  accessToken: localStorage.getItem('accessToken'),
  refreshToken: localStorage.getItem('refreshToken'),
  loading: true,
  theme: getInitialTheme(),

  setTheme: () => {
    localStorage.setItem('theme', 'light');
    document.documentElement.classList.remove('dark');
    set({ theme: 'light' });
  },

  toggleTheme: () => get().setTheme(),

  setTokens: (accessToken, refreshToken) => {
    localStorage.setItem('accessToken', accessToken);
    if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
    set({ accessToken, refreshToken: refreshToken || get().refreshToken });
  },

  setUser: (user) => set({ user }),

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    set({ user: null, accessToken: null, refreshToken: null });
  },

  fetchProfile: async () => {
    try {
      const { data } = await api.get('/auth/me');
      set({ user: data.user, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  init: () => {
    const { theme, fetchProfile, accessToken } = get();
    // Apply saved theme
    document.documentElement.classList.remove('dark');
    if (accessToken) fetchProfile();
    else set({ loading: false });
  },
}));
