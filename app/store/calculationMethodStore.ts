import { create } from "zustand"

export const useCalculationMethodStore = create((set) => ({
  calculationMethod: "",
  updateCalculationMethod: (calculationMethod) =>
    set(() => ({ calculationMethod: calculationMethod })),
}))
