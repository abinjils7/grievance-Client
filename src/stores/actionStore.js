import { create } from 'zustand';

export const useActionStore = create((set, get) => ({
  actions: {},
  status: (key) => get().actions[key]?.status || 'idle',
  runOnce: async (key, action) => {
    const current = get().actions[key]?.status;
    if (current === 'pending' || current === 'done') return { skipped: true };
    set((state) => ({ actions: { ...state.actions, [key]: { status: 'pending' } } }));
    try {
      const result = await action();
      set((state) => ({
        actions: { ...state.actions, [key]: { status: 'done', completedAt: Date.now() } },
      }));
      return { skipped: false, result };
    } catch (error) {
      set((state) => ({ actions: { ...state.actions, [key]: { status: 'idle' } } }));
      throw error;
    }
  },
  clear: (key) =>
    set((state) => {
      const actions = { ...state.actions };
      delete actions[key];
      return { actions };
    }),
}));
