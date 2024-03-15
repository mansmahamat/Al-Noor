import { create } from "zustand";
import AsyncStorage from '@react-native-async-storage/async-storage';

interface CalculationMadhabStore {
  madhab: string;
  updateCalculationMadhab: (madhab: string) => void;
}

const useCalculationMadhab = create<CalculationMadhabStore>((set) => ({
  madhab: "shafi",

  updateCalculationMadhab: (madhab) =>
    set(() => ({ madhab: madhab })),

}));

// Subscribe to the store to persist data to AsyncStorage
useCalculationMadhab.subscribe(
  (state) => {
    AsyncStorage.setItem('calculation-madhab', JSON.stringify(state)).catch((err) => {
      console.error('Failed to persist calculation madhab state:', err);
    });
  }
);

// Initialize store from AsyncStorage
AsyncStorage.getItem('calculation-madhab').then((data) => {
  if (data) {
    const initialState = JSON.parse(data);
    useCalculationMadhab.setState(initialState);
  }
}).catch((err) => console.error('Failed to initialize calculation madhab store:', err));

export default useCalculationMadhab;
