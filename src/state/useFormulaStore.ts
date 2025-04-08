import { FormulaStore } from "interfaces";
import { create } from "zustand";

export const useFormulaStore = create<FormulaStore>((set, get) => ({
  tokens: [],
  tagValues: {},

  setTokens: (tokens) => set({ tokens }),

  addToken: (token) =>
    set((state) => ({
      tokens: [...state.tokens, token],
    })),

  removeToken: (id) =>
    set((state) => ({
      tokens: state.tokens.filter((t) => t.id !== id),
    })),

  updateTagValue: (name, value) => {
    const tagValues = { ...get().tagValues, [name]: value };
    set({ tagValues });
  },

  updateTokenTime: (id, newTime) => {
    set((state) => ({
      tokens: state.tokens.map((t) =>
        t.id === id ? { ...t, selectedTime: newTime } : t
      ),
    }));
  },
}));
