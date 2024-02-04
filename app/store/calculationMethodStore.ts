import {create} from "zustand";

interface CalculationMethodStore {
  calculationMethod: string;
  updateCalculationMethod: (calculationMethod: string) => void;
}

export const useCalculationMethodStore = create<CalculationMethodStore>((set) => ({
  calculationMethod: "MuslimWorldLeague",
  updateCalculationMethod: (calculationMethod) =>
    set(() => ({ calculationMethod: calculationMethod })),
}));
