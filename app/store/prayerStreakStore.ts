import { create } from "zustand";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { count } from "console";

interface FormattedDataStore {
  formattedData: Array<{ count: number; date: string }>;
  setFormattedData: (data: Array<{ count: number; date: string }>) => void;
}

const useFormattedDataStore = create<FormattedDataStore>((set) => ({
  formattedData: [{count: 0, date: ""}],
  setFormattedData: (data) => set(() => ({ formattedData: data })),
}));

// Subscribe to the store to persist data to AsyncStorage
useFormattedDataStore.subscribe(
  (state) => {
    AsyncStorage.setItem('formattedData', JSON.stringify(state.formattedData)).catch((err) => {
      console.error('Failed to persist formattedData state:', err);
    });
  }
);

// Initialize store from AsyncStorage
AsyncStorage.getItem('formattedData').then((data) => {
  if (data) {
    const initialState = JSON.parse(data);
    useFormattedDataStore.setState({ formattedData: initialState });
  }
}).catch((err) => console.error('Failed to initialize formattedData store:', err));

export default useFormattedDataStore;
