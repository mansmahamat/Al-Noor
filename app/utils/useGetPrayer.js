import { Coordinates, CalculationMethod, PrayerTimes } from "adhan"
import { useMemo, useState } from "react"

const useGetPrayer = () => {
  const [latitude, setLatitude] = useState(59.334591)
  const [longitude, setlongitude] = useState(18.06324)

  const coordinates = new Coordinates(latitude, longitude)
  const params = CalculationMethod.MuslimWorldLeague()
  const date = new Date()

  const prayerTimesToday = useMemo(() => {
    return new PrayerTimes(coordinates, date, params)
  }, [latitude, longitude])

  const prayers = ["fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha"]
  const filteredPrayerTimes = Object.keys(prayerTimesToday).filter((item) =>
    prayers.includes(item)
  )
  const transformedArray = filteredPrayerTimes.map((item) => {
    return {
      name: item,
      time: prayerTimesToday[item],
    }
  })

  return { transformedArray }
}

export default useGetPrayer
