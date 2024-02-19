import AsyncStorage from '@react-native-async-storage/async-storage';

// Function to retrieve the next prayer name and time from AsyncStorage
export const getNextPrayer = async () => {
  try {
    const nextPrayerName = await AsyncStorage.getItem('nextPrayerName');
    const nextPrayerTimeStr = await AsyncStorage.getItem('nextPrayerTime');

    // Convert nextPrayerTime back to a Date object
    const nextPrayerTime = new Date(nextPrayerTimeStr);

    // Check if the items exist in AsyncStorage
    if (nextPrayerName !== null && nextPrayerTimeStr !== null) {
      console.log('Next prayer retrieved successfully:', nextPrayerName, nextPrayerTime);
      return { nextPrayerName, nextPrayerTime };
    } else {
      console.log('Next prayer not found in AsyncStorage');
      return null;
    }
  } catch (error) {
    console.error('Error retrieving next prayer:', error);
    return null;
  }
};