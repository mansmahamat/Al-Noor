import { create } from "zustand"

export const useCalculationMadhab = create((set) => ({
  madhab: "",
  updateCalculationMadhab: (madhab) => set(() => ({ madhab: madhab })),
}))
