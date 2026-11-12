import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import api from '../api/client';

let initialization;
export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      loading: true,
      initialize: () => {
        if (initialization) return initialization;
        initialization = (async () => {
          const token = localStorage.getItem('token');
          if (!token) {
            localStorage.removeItem('user');
            set({ user: null, loading: false });
            return;
          }
          try {
            const { data } = await api.get('/auth/me');
            set({ user: data.data });
          } catch (error) {
            set({ user: null });
            localStorage.removeItem('user');
            if (error.response?.status === 401 || error.response?.status === 403)
              localStorage.removeItem('token');
          } finally {
            set({ loading: false });
          }
        })();
        return initialization;
      },
      login: async (email, password) => {
        const { data } = await api.post('/auth/login', { email, password });
        localStorage.setItem('token', data.data.token);
        set({ user: data.data.user, loading: false });
        return data.data.user;
      },
      register: async (values) => {
        const { data } = await api.post('/auth/register', values);
        localStorage.setItem('token', data.data.token);
        set({ user: data.data.user, loading: false });
        return data.data.user;
      },
      logout: () => {
        localStorage.removeItem('token');
        set({ user: null, loading: false });
      },
    }),
    {
      name: 'cm-kerala-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user }),
    },
  ),
);
