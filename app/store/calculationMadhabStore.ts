import { create } from "zustand"

interface CalculationMadhabStore {
  madhab: string;
  updateCalculationMadhab: (madhab: string) => void;
}

export const useCalculationMadhab = create<CalculationMadhabStore>((set) => ({
  madhab: "",
  updateCalculationMadhab: (madhab) =>
    set(() => ({ madhab: madhab })),
}));