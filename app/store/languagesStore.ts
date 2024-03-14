import { create } from "zustand";
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LanguageStore {
  language: string;
  updateLanguage: (language: string) => void;
}



const useLanguageStore = create<LanguageStore>((set) => ({
  language: "en",
  updateLanguage: (language) => set(() => ({ language: language })),
}));

// Subscribe to the store to persist data to AsyncStorage
useLanguageStore.subscribe(
  (state) => {
    AsyncStorage.setItem('language', JSON.stringify(state)).catch((err) => {
      console.error('Failed to persist language state:', err);
    });
  }
);

// Initialize store from AsyncStorage
AsyncStorage.getItem('language').then((data) => {
  if (data) {
    const initialState = JSON.parse(data);
    useLanguageStore.setState(initialState);
  }
}).catch((err) => console.error('Failed to initialize language store:', err));

export default useLanguageStore;
