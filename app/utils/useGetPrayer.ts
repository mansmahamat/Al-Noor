import { useState, useEffect, useMemo } from "react"
import { Coordinates, CalculationMethod, PrayerTimes, Madhab } from "adhan"
import * as Location from "expo-location"
import moment from "moment"
import { useCalculationMethodStore } from "../store/calculationMethodStore"
import { useCalculationMadhab } from "../store/calculationMadhabStore"





function capitalizeFirstLetter(word) {
  return word.charAt(0).toUpperCase() + word.slice(1)
}

const useGetPrayer = (date) => {
  const [location, setLocation] = useState(null)
  const [lat, setLat] = useState(null)
  const [long, setLong] = useState(null)
  const [errorMsg, setErrorMsg] = useState(null)
  const [city, setCity] = useState(null)




  
  

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

  const calculationMethod = useCalculationMethodStore(
    (state) => state.calculationMethod
  )
  const calculationMethodParams = getCalculationMethodByName(calculationMethod)

  // MADHAB

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
    //@ts-ignore
    const madhab = useCalculationMadhab((state) => state.madhab)
    const calculationMethodParamsMadhab = getCalculationMadhab(madhab)
  useEffect(() => {
    ;(async () => {
      let { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied")
        return
      }

      let location = await Location.getCurrentPositionAsync({})
      setLocation(location)
      setLocation(location)
      setLat(location.coords.latitude)
      setLong(location.coords.longitude)




      // Get address from latitude & longitude.
      // fromLatLng(location.coords.latitude, location.coords.longitude)
      //   .then(({ results }) => {
      //     const { lat, lng } = results[0].geometry.location
      //     console.log("MANSSSSS", results[0].address_components[3].long_name)
      //     setCity
      //   })
      //   .catch(console.error)

  //     try {
  //       const response = await fetch(
  //         `https://geocode.maps.co/reverse?lat=${location.coords.latitude}&lon=${location.coords.longitude}`
  //       )
       
  // //  const data = await response.json()
  //  // setCity(data?.address?.municipality  ? data?.address?.municipality : data?.address?.town)
  //       // setCity(data.address.city ?? data.address.town)
  //       // setIsLoading(false)
  //     } catch (error) {
  //       console.error(error)
  //       //  setIsLoading(false)
  //     }
    })()
  }, [ ])



 
  const prayerTimesToday = useMemo(() => {
    const coordinates = new Coordinates(lat, long)
    let params = calculationMethodParams
    params.madhab = calculationMethodParamsMadhab
    return new PrayerTimes(coordinates, date, params)
  }, [lat, long, date, calculationMethod, calculationMethodParamsMadhab])


 
  

  const prayerTimesTomorrow = useMemo(() => {
    const nextdate = new Date(date)
    nextdate.setDate(date.getDate() + 1)
    const coordinates = new Coordinates(lat, long)
    const params = calculationMethodParams
    params.madhab = calculationMethodParamsMadhab
    return new PrayerTimes(coordinates, nextdate, params)
  }, [lat, long, date, calculationMethod, calculationMethodParamsMadhab])
  let prayers = ["fajr", "dhuhr", "asr", "maghrib", "isha"]




  let prayersOfTwoDays = []

  let p = 0
  for (let i = 3; i < 10; i++) {
    if (Object.prototype.hasOwnProperty.call(prayerTimesToday, prayers[p])) {
      prayersOfTwoDays.push({
        name: capitalizeFirstLetter(prayers[p]),
        time: prayerTimesToday[prayers[p]],
      })
      p++
    }
  }

  p = 0
  for (let i = 3; i < 10; i++) {
    if (Object.prototype.hasOwnProperty.call(prayerTimesTomorrow, prayers[p])) {
      prayersOfTwoDays.push({
        name: capitalizeFirstLetter(prayers[p]),
        time: prayerTimesTomorrow[prayers[p]],
      })
      p++
    }
  }

  const currentTime = prayerTimesToday.timeForPrayer(
    prayerTimesToday.currentPrayer()
  )

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

  const nextFivePrayers = getNextPrayers(currentTime, prayersOfTwoDays, 5)
  const current = capitalizeFirstLetter(prayerTimesToday.currentPrayer())
  const currentTimeString = moment(currentTime).format("h:mm A - DD-MMM-YYYY")

  const transformed = Object.entries(prayerTimesToday)

  const desiredKeys = [
    "fajr",
    "sunrise",
    "dhuhr",
    "asr",
  //  "sunset",
    "maghrib",
    "isha",
  ]

  const filteredArray = transformed.filter(([key]) => desiredKeys.includes(key))

  const transformedArray = filteredArray.map(([name, time]) => ({
    name,
    time,
  }))

  const now = moment()
  const tomorrow = now.add(1, "days")

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




  return {
    prayerTimesToday: prayerTimesToday,
    nextFivePrayers: nextFivePrayers,
    current: current,
    currentTime: currentTimeString,
    nextPrayerTime: nextPrayer.time,
    nextPrayerName: nextPrayer?.name,
    currentPrayer: previousPrayer?.name,
    transformedArray,
    city
  }
}

export default useGetPrayer