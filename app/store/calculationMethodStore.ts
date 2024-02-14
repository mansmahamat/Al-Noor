// import {create} from "zustand";

// interface CalculationMethodStore {
//   calculationMethod: string;
//   updateCalculationMethod: (calculationMethod: string) => void;
// }

// export const useCalculationMethodStore = create<CalculationMethodStore>((set) => ({
//   calculationMethod: "MuslimWorldLeague",
//   updateCalculationMethod: (calculationMethod) =>
//     set(() => ({ calculationMethod: calculationMethod })),
// }));


import { create } from "zustand";
import AsyncStorage from '@react-native-async-storage/async-storage';

interface CalculationMethodStore {
  calculationMethod: string;
  updateCalculationMethod: (calculationMethod: string) => void;
}

const useCalculationMethodStore = create<CalculationMethodStore>((set) => ({
  calculationMethod: "MoonsightingCommittee",
  updateCalculationMethod: (calculationMethod) =>
  
    set(() => ({ calculationMethod: calculationMethod })),
}));

// Subscribe to the store to persist data to AsyncStorage
useCalculationMethodStore.subscribe(
  (state) => {
    AsyncStorage.setItem('calculation-method', JSON.stringify(state)).catch((err) => {
      console.error('Failed to persist calculation method state:', err);
    });
  }
);

// Initialize store from AsyncStorage
AsyncStorage.getItem('calculation-method').then((data) => {
  if (data) {
    const initialState = JSON.parse(data);
    useCalculationMethodStore.setState(initialState);
  }
}).catch((err) => console.error('Failed to initialize calculation method store:', err));

export default useCalculationMethodStore;
