import { create } from 'zustand';

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


export default useStreakStore;
