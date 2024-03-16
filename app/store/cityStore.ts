import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface CityStore {
  city: string;
  updateCity: (city) => void;
}

export const useCityStore = create<CityStore>((set) => ({
  city: "",
  updateCity: (city) => set(() => ({ city: city })),
}));

// Subscribe to the store to persist data to AsyncStorage
useCityStore.subscribe(async (state: CityStore) => {
  try {
    await AsyncStorage.setItem(
      "cityData",
      JSON.stringify({ city: state.city })
    );
  } catch (error) {
    console.error("Failed to persist city data:", error);
  }
});

// Initialize store from AsyncStorage
AsyncStorage.getItem("cityData")
  .then((data) => {
    if (data) {
      const { city } = JSON.parse(data);
      useCityStore.setState({ city });
    }
  })
  .catch((error) => console.error("Failed to initialize city store:", error));
