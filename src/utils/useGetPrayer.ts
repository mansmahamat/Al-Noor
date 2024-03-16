import { useState } from "react";
import { Coordinates, CalculationMethod, PrayerTimes, Madhab } from "adhan";
import moment from "moment";
import useCalculationMethodStore from "../store/calculationMethodStore";
import useCalculationMadhab from "../store/calculationMadhabStore";
import { useLocationStore } from "../store/locationStore";

// Function to capitalize the first letter of a word
function capitalizeFirstLetter(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

// Custom hook to retrieve prayer times
const useGetPrayer = (date) => {
  const [city, setCity] = useState(null); // State for city

  // CALCULATION METHOD

  // Function to get calculation method by name
  function getCalculationMethodByName(name) {
    const functionCalculationMethod = {
      // Mapping calculation method names to Adhan objects
      muslimWorldLeague: CalculationMethod.MuslimWorldLeague(),
      egyptian: CalculationMethod.Egyptian(),
      karachi: CalculationMethod.Karachi(),
      ummAlQura: CalculationMethod.UmmAlQura(),
      dubai: CalculationMethod.Dubai(),
      qatar: CalculationMethod.Qatar(),
      kuwait: CalculationMethod.Kuwait(),
      moonsightingCommittee: CalculationMethod.MoonsightingCommittee(),
      singapore: CalculationMethod.Singapore(),
      turkey: CalculationMethod.Turkey(),
      tehran: CalculationMethod.Tehran(),
      northAmerica: CalculationMethod.NorthAmerica(),
      other: CalculationMethod.Other(),
    };

    // Return the calculation method or default to MoonsightingCommittee
    if (functionCalculationMethod.hasOwnProperty(name)) {
      return functionCalculationMethod[name];
    } else {
      return CalculationMethod.MoonsightingCommittee();
    }
  }

  // Get the calculation method from the store
  const calculationMethod = useCalculationMethodStore(
    (state) => state.calculationMethod
  );
  const calculationMethodParams = getCalculationMethodByName(calculationMethod);

  // MADHAB

  // Function to get madhab by name
  function getCalculationMadhab(name) {
    const functionCalculationMadhab = {
      shafi: Madhab.Shafi,
      hanafi: Madhab.Hanafi,
    };

    // Return the madhab or default to Shafi
    if (functionCalculationMadhab.hasOwnProperty(name)) {
      return functionCalculationMadhab[name];
    } else {
      return Madhab.Shafi;
    }
  }

  // Get the madhab from the store
  const madhab = useCalculationMadhab((state) => state.madhab);
  const calculationMethodParamsMadhab = getCalculationMadhab(madhab);

  // Get latitude and longitude from the location store
  const { latitude, longitude } = useLocationStore();

  // Get the city from from the city store
  

  // Calculate prayer times for today
  const prayerTimesToday = new PrayerTimes(
    new Coordinates(latitude, longitude),
    date,
    calculationMethodParams
  );

  // Calculate prayer times for tomorrow
  const tomorrow = new Date(date);
  tomorrow.setDate(date.getDate() + 1);
  const prayerTimesTomorrow = new PrayerTimes(
    new Coordinates(latitude, longitude),
    tomorrow,
    calculationMethodParams
  );

  // Array of prayer names
  let prayers = ["fajr", "dhuhr", "asr", "maghrib", "isha"];

  // Array to hold prayer times for two days
  let prayersOfTwoDays = [];

  // Push prayer times for today
  for (let i = 0; i < prayers.length; i++) {
    if (prayerTimesToday.hasOwnProperty(prayers[i])) {
      prayersOfTwoDays.push({
        name: capitalizeFirstLetter(prayers[i]),
        time: prayerTimesToday[prayers[i]],
      });
    }
  }

  // Push prayer times for tomorrow
  for (let i = 0; i < prayers.length; i++) {
    if (prayerTimesTomorrow.hasOwnProperty(prayers[i])) {
      prayersOfTwoDays.push({
        name: capitalizeFirstLetter(prayers[i]),
        time: prayerTimesTomorrow[prayers[i]],
      });
    }
  }

  // Get current time
  const currentTime = new Date();

  // Function to get next prayers
  function getNextPrayers(currentTime, prayersOfTwoDays, numPrayers) {
    const currentIndex = prayersOfTwoDays.findIndex(
      (prayer) => new Date(prayer.time) > currentTime
    );

    if (currentIndex === -1) {
      return [];
    }

    const nextPrayers = prayersOfTwoDays.slice(
      currentIndex,
      currentIndex + numPrayers
    );
    return nextPrayers;
  }

  // Get the next five prayers
  const nextFivePrayers = getNextPrayers(currentTime, prayersOfTwoDays, 5);
  const current = capitalizeFirstLetter(prayerTimesToday.currentPrayer()); // Current prayer
  const currentTimeString = moment(currentTime).format("h:mm A - DD-MMM-YYYY"); // Current time

  // Transform prayer times into an array of objects
  const transformed = Object.entries(prayerTimesToday);
  const desiredKeys = ["fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha"];
  const filteredArray = transformed.filter(([key]) =>
    desiredKeys.includes(key)
  );
  const transformedArray = filteredArray.map(([name, time]) => ({
    name,
    time,
  }));

  // Get tomorrow's date
  const now = moment();
  const tomorrowDate = now.add(1, "days");

  // Determine previous and next prayers
  let previousPrayer = null;
  for (const prayerTime of nextFivePrayers) {
    const diff = now.diff(prayerTime.time);
    if (diff < 0) {
      break; // Stop once we find a time after the current time
    }
    previousPrayer = prayerTime;
  }

  let nextPrayer = null;
  for (const prayer of nextFivePrayers) {
    const prayerTime = new Date(prayer.time);
    if (
      prayerTime > currentTime &&
      (!nextPrayer || prayerTime < new Date(nextPrayer.time))
    ) {
      nextPrayer = prayer;
    }
  }

  // Return prayer information
  return {
    nextFivePrayers: nextFivePrayers,
    current: current,
    currentTime: currentTimeString,
    nextPrayerTime: nextPrayer?.time,
    nextPrayerName: nextPrayer?.name,
    currentPrayer: previousPrayer?.name,
    transformedArray,
    city,
  };
};

export default useGetPrayer;
