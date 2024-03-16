import {CalculationMethod, Coordinates, Madhab, PrayerTimes} from "adhan";
import * as Location from "expo-location";
import AsyncStorage from '@react-native-async-storage/async-storage';

function capitalizeFirstLetter(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

const getCalculationMethodByName = (name) => {
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
    return CalculationMethod.MoonsightingCommittee(); // Default to "Other" or handle the error appropriately
  }
};

const getCalculationMadhab = (name) => {
  const functionCalculationMadhab = {
    shafi: Madhab.Shafi,
    hanafi: Madhab.Hanafi,
  };

  if (functionCalculationMadhab.hasOwnProperty(name)) {
    return functionCalculationMadhab[name];
  } else {
    return Madhab.Shafi; // Default to "Other" or handle the error appropriately
  }
};

const getLocation = async () => {
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    throw new Error("Location permission not granted");
  }

  return await Location.getCurrentPositionAsync({});
};

async function getPrayerTimesWithCurrentLocation() {
  try {
    const location = await getLocation();
    const coordinates = new Coordinates(location.coords.latitude, location.coords.longitude);
    const date = new Date(); // or provide your own date here


  const calculationMethod =   AsyncStorage.getItem('calculation-method').then((data) => {
    const initialState = JSON.parse(data);

    return initialState.calculationMethod;
    }).catch((err) => console.error('Failed to initialize calculation method store:', err));




    const calculationMethodParams = getCalculationMethodByName(await calculationMethod);

    const madhab = "shafi"; // or use your madhab
    const calculationMethodParamsMadhab = getCalculationMadhab(madhab);
let params = calculationMethodParams;
params.madhab = calculationMethodParamsMadhab

    const prayerTimesToday = new PrayerTimes(coordinates, date, params);

    const desiredKeys = ["fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha"];

    return desiredKeys.map((key) => ({
      name: capitalizeFirstLetter(key),
      time: prayerTimesToday[key],
    }));
  } catch (error) {
    console.error("Error fetching prayer times with current location:", error);
    throw error;
  }
}

export default getPrayerTimesWithCurrentLocation;
