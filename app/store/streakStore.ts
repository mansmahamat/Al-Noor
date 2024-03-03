import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the store interface
interface StreakStore {
  streakDays: number[];
  setStreakDays: (streakDays: number[]) => void;
}

// Create the store
const useStreakStore = create<StreakStore>((set) => ({
  streakDays: [],
  setStreakDays: (streakDays) => set({ streakDays }),
}));

// Subscribe to the store to persist data to AsyncStorage
// useStreakStore.subscribe(
//   (state) => {
//     AsyncStorage.setItem('streakDays', JSON.stringify(state.streakDays))
//       .catch((err) => {
//         console.error('Failed to persist streakDays:', err);
//       });
//   }
// );

// // Initialize store from AsyncStorage
// AsyncStorage.getItem('streakDays').then((data) => {
//   if (data) {
//     const initialState = JSON.parse(data);
//     useStreakStore.setState({ streakDays: initialState });
//   }
// }).catch((err) => console.error('Failed to initialize streakDays store:', err));

export default useStreakStore;
