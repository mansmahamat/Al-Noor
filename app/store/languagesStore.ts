import { create } from "zustand";

interface LanguageStore {
  language: string;
  updateLanguage: (language: string) => void;
}

export const useLanguageStore = create<LanguageStore>((set) => ({
  language: "fr",
  updateLanguage: (language) => set(() => ({ language: language })),
}));
