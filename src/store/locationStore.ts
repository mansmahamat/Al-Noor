import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LocationStore {
  latitude: number | null;
  longitude: number | null;
  setLatitudeLongitude: (latitude: number, longitude: number) => void;
}

export const useLocationStore = create<LocationStore>((set) => ({
  latitude: null,
  longitude: null,
  setLatitudeLongitude: (latitude, longitude) => set({ latitude, longitude }),
}));

// Subscribe to the store to persist data to AsyncStorage
useLocationStore.subscribe(
  async (state) => {
    try {
      await AsyncStorage.setItem('locationData', JSON.stringify({ latitude: state.latitude, longitude: state.longitude }));
    } catch (error) {
      console.error('Failed to persist location data:', error);
    }
  }
);

// Initialize store from AsyncStorage
AsyncStorage.getItem('locationData').then((data) => {
  if (data) {
    const { latitude, longitude } = JSON.parse(data);
    useLocationStore.setState({ latitude, longitude });
  }
}).catch((error) => console.error('Failed to initialize location store:', error));
