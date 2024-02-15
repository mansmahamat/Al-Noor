import { useState, useEffect } from "react";
import { Coordinates, CalculationMethod, PrayerTimes, Madhab } from "adhan";
import * as Location from "expo-location";
import moment from "moment";
import useCalculationMethodStore from "../store/calculationMethodStore";
import useCalculationMadhab from "../store/calculationMadhabStore";
import { useLocationStore } from "../store/locationStore";

function capitalizeFirstLetter(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

const useGetPrayer = (date) => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [city, setCity] = useState(null);

  // CALCULATION METHOD
  function getCalculationMethodByName(name) {
    const functionCalculationMethod = {
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

    if (functionCalculationMethod.hasOwnProperty(name)) {
      return functionCalculationMethod[name];
    } else {
      // Return a default method or handle the error as needed
      return CalculationMethod.MoonsightingCommittee(); // Default to "Other" or handle the error appropriately
    }
  }

  const calculationMethod = useCalculationMethodStore(
    (state) => state.calculationMethod
  );
  const calculationMethodParams = getCalculationMethodByName(calculationMethod);

  // MADHAB

  function getCalculationMadhab(name) {
    const functionCalculationMadhab = {
      shafi: Madhab.Shafi,
      hanafi: Madhab.Hanafi,
    };

    if (functionCalculationMadhab.hasOwnProperty(name)) {
      return functionCalculationMadhab[name];
    } else {
      // Return a default method or handle the error as needed
      return Madhab.Shafi; // Default to "Other" or handle the error appropriately
    }
  }
  const madhab = useCalculationMadhab((state) => state.madhab);
  const calculationMethodParamsMadhab = getCalculationMadhab(madhab);
  const { latitude, longitude } = useLocationStore();




 

  const prayerTimesToday = new PrayerTimes(
    new Coordinates(latitude, longitude),
    date,
    calculationMethodParams
  );

  const tomorrow = new Date(date);
  tomorrow.setDate(date.getDate() + 1);

  const prayerTimesTomorrow = new PrayerTimes(
    new Coordinates(latitude, longitude),
    tomorrow,
    calculationMethodParams
  );

  let prayers = ["fajr", "dhuhr", "asr", "maghrib", "isha"];

  let prayersOfTwoDays = [];

  for (let i = 0; i < prayers.length; i++) {
    if (prayerTimesToday.hasOwnProperty(prayers[i])) {
      prayersOfTwoDays.push({
        name: capitalizeFirstLetter(prayers[i]),
        time: prayerTimesToday[prayers[i]],
      });
    }
  }

  for (let i = 0; i < prayers.length; i++) {
    if (prayerTimesTomorrow.hasOwnProperty(prayers[i])) {
      prayersOfTwoDays.push({
        name: capitalizeFirstLetter(prayers[i]),
        time: prayerTimesTomorrow[prayers[i]],
      });
    }
  }

  const currentTime = new Date();

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

  const nextFivePrayers = getNextPrayers(currentTime, prayersOfTwoDays, 5);
  const current = capitalizeFirstLetter(prayerTimesToday.currentPrayer());
  const currentTimeString = moment(currentTime).format(
    "h:mm A - DD-MMM-YYYY"
  );

  const transformed = Object.entries(prayerTimesToday);

  const desiredKeys = [
    "fajr",
    "sunrise",
    "dhuhr",
    "asr",
    //  "sunset",
    "maghrib",
    "isha",
  ];

  const filteredArray = transformed.filter(([key]) =>
    desiredKeys.includes(key)
  );

  const transformedArray = filteredArray.map(([name, time]) => ({
    name,
    time,
  }));

  const now = moment();
  const tomorrowDate = now.add(1, "days");


  

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
