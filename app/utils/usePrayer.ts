import { useState, useEffect } from 'react';
import {
  Coordinates,
  CalculationMethod,
  PrayerTimes,
  SunnahTimes,
  Madhab,
} from 'adhan';
import moment from "moment"
import useCalculationMethodStore from '../store/calculationMethodStore';
import useCalculationMadhab from '../store/calculationMadhabStore';
import * as Location from "expo-location"



function capitalizeFirstLetter(word) {
    return word.charAt(0).toUpperCase() + word.slice(1)
  }

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
        }
    
        if (functionCalculationMethod.hasOwnProperty(name)) {
          return functionCalculationMethod[name]
        } else {
          // Return a default method or handle the error as needed
          return CalculationMethod.MoonsightingCommittee() // Default to "Other" or handle the error appropriately
        }
      }



      function getCalculationMadhab(name) {
        const functionCalculationMadhab = {
          shafi: Madhab.Shafi,
          hanafi: Madhab.Hanafi,
        }
    
        if (functionCalculationMadhab.hasOwnProperty(name)) {
          return functionCalculationMadhab[name]
        } else {
          // Return a default method or handle the error as needed
          return Madhab.Shafi // Default to "Other" or handle the error appropriately
        }
      }
      

const usePrayerTimes = (date) => {
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [sunnahTimes, setSunnahTimes] = useState(null);
  const [lat, setLat] = useState(null)
  const [long, setLong] = useState(null)
  const [errorMsg, setErrorMsg] = useState(null)
  const [nextPrayerName, setnextPrayerName] = useState("")

  const { calculationMethod } = useCalculationMethodStore();
    const { madhab } = useCalculationMadhab();
    
    const [nextPrayerTime, setnextPrayerTime] = useState("")


  

    useEffect(() => {
        ;(async () => {
          let { status } = await Location.requestForegroundPermissionsAsync()
          if (status !== "granted") {
            setErrorMsg("Permission to access location was denied")
            return
          }
    
          let location = await Location.getCurrentPositionAsync({})
    
          setLat(location.coords.latitude)
          setLong(location.coords.longitude)
    
    
    
          
        })()
      }, [ ])

  useEffect(() => {
    const fetchPrayerTimes = async () => {
      try {
        const calculationMethodParams = getCalculationMethodByName(calculationMethod)
        const calculationMethodParamsMadhab = getCalculationMadhab(madhab)
        const coordinates = new Coordinates(lat, long);
        let params = calculationMethodParams
        params.madhab = calculationMethodParamsMadhab
        const prayerTimesObjToday = new PrayerTimes(coordinates, date, params);
        const nextdate = new Date(date)
    nextdate.setDate(date.getDate() + 1)

        const prayerTimesObjTomorrow = new PrayerTimes(coordinates, nextdate, params);
        const sunnahTimesObj = new SunnahTimes(prayerTimesObjToday);
        const transformed = Object.entries(prayerTimesObjToday)


        const desiredKeys = [
            "fajr",
            "sunrise",
            "dhuhr",
            "asr",
          //  "sunset",
            "maghrib",
            "isha",
          ]

          const prayerOfDay = transformed
          .filter(([key]) => desiredKeys.includes(key))
          .map(([name, time]) => ({ name, time }));



  const currentTime = prayerTimesObjToday.timeForPrayer(
    prayerTimesObjToday.currentPrayer()
  )

  const currentTimeString = moment(currentTime).format("h:mm A - DD-MMM-YYYY")


  let prayers = ["fajr", "dhuhr", "asr", "maghrib", "isha"]

  
  function getNextPrayers(currentTime, prayersOfTwoDays, numPrayers) {
    const currentIndex = prayersOfTwoDays.findIndex(
      (prayer) => prayer.time > currentTime
    )

    if (currentIndex === -1) {
      return []
    }

    const nextPrayers = prayersOfTwoDays.slice(
      currentIndex,
      currentIndex + numPrayers
    )
    return nextPrayers
  }

  let prayersOfTwoDays = []

  let p = 0
  for (let i = 3; i < 10; i++) {
    if (Object.prototype.hasOwnProperty.call(prayerTimesObjToday, prayers[p])) {
      prayersOfTwoDays.push({
        name: capitalizeFirstLetter(prayers[p]),
        time: prayerTimesObjToday[prayers[p]],
      })
      p++
    }
  }

  p = 0
  for (let i = 3; i < 10; i++) {
    if (Object.prototype.hasOwnProperty.call(prayerTimesObjTomorrow, prayers[p])) {
      prayersOfTwoDays.push({
        name: capitalizeFirstLetter(prayers[p]),
        time: prayerTimesObjTomorrow[prayers[p]],
      })
      p++
    }
  }



  const nextFivePrayers = getNextPrayers(currentTime, prayersOfTwoDays, 5)


  const now = moment()


  let previousPrayer = null
  for (const prayerTime of nextFivePrayers) {
    const diff = now.diff(prayerTime.time)
    if (diff < 0) {
      break // Stop once we find a time after the current time
    }
    previousPrayer = prayerTime
  }

  let nextPrayer = null
  for (const prayer of nextFivePrayers) {
    const prayerTime = new Date(prayer.time)
    if (
      prayerTime > currentTime &&
      (!nextPrayer || prayerTime < new Date(nextPrayer.time))
    ) {
      nextPrayer = prayer || null
    }
  }

  setnextPrayerName(nextPrayer.name)
  setnextPrayerTime(nextPrayer.time)
  setPrayerTimes(prayerOfDay);
  setSunnahTimes(sunnahTimesObj);


        
      } catch (error) {
        console.error('Error fetching prayer times:', error);
      }
    };

    fetchPrayerTimes();



    // Cleanup function (if needed)
    // return () => {
    //   // Cleanup code (if needed)
    // };
  }, [madhab, calculationMethod]);

  return { prayerTimes, sunnahTimes, nextPrayerName, nextPrayerTime};
};

export default usePrayerTimes;
