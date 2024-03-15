import { create } from "zustand"

export const useCityStore = create((set) => ({
  city: "",
  updateCity: (city) => set(() => ({ city: city })),
}))
