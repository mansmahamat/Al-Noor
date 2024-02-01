import { useState, useEffect } from "react"
import { Coordinates, CalculationMethod, PrayerTimes } from "adhan"
import moment from "moment"

function capitalizeFirstLetter(word) {
  return word.charAt(0).toUpperCase() + word.slice(1)
}

const useGetDateHijri = (date) => {
  const [month, setMonth] = useState(null)
  const [data, setdata] = useState(null)
  const [day, setDay] = useState(null)
  const [year, setYear] = useState(null)
  const [designation, setDesignation] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const dateToday = moment(date).format("DD-MM-YYYY")

  const fetchData = async () => {
    setIsLoading(true)

    try {
      const response = await fetch(
        `http://api.aladhan.com/v1/gToH/${dateToday}`
      )
      const data = await response.json()
      setdata(data)
      setMonth(data?.data?.hijri?.month?.en)
      setDay(data?.data?.hijri?.day)
      setYear(data?.data?.hijri?.year)
      setDesignation(data?.data?.hijri?.designation?.abbreviated)
      setIsLoading(false)
    } catch (error) {
      console.error(error)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [date])

  const refetch = () => {
    setIsLoading(true)
    fetchData()
  }
  return {
    month,
    day,
    year,
    designation,
    data,
    refetch,
    isLoading,
    error,
  }
}

export default useGetDateHijri
