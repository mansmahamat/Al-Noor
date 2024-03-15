import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface OnboardingStore {
  onboardingCompleted: boolean;
  completeOnboarding: () => void;
}

export const useOnboardingStore = create<OnboardingStore>((set) => ({
  onboardingCompleted: false,
  completeOnboarding: () => set({ onboardingCompleted: true }),
}));

// Subscribe to the store to persist data to AsyncStorage
useOnboardingStore.subscribe(
  async (state) => {
    try {
      await AsyncStorage.setItem('onboardingCompleted', JSON.stringify(state.onboardingCompleted));
    } catch (error) {
      console.error('Failed to persist onboarding state:', error);
    }
  }
);

// Initialize store from AsyncStorage
AsyncStorage.getItem('onboardingCompleted').then((data) => {
  if (data) {
    const initialState = JSON.parse(data);
    useOnboardingStore.setState({ onboardingCompleted: initialState });
  }
}).catch((error) => console.error('Failed to initialize onboarding store:', error));
