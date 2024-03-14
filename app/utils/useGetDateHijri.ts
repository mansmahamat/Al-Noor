import { useState, useEffect } from "react";
import { Coordinates, CalculationMethod, PrayerTimes } from "adhan";
import moment from "moment";

interface HijriData {
  data: {
    hijri: {
      month: { en: string };
      day: number;
      year: number;
      designation: { abbreviated: string };
    };
  };
}

interface HookReturn {
  month: string | null;
  day: number | null;
  year: number | null;
  designation: string | null;
  data: HijriData | null;
  refetch: () => void;
  isLoading: boolean;
  error: Error | null;
}

const useGetDateHijri = (date: Date): HookReturn => {
  const [month, setMonth] = useState<string | null>(null);
  const [data, setData] = useState<HijriData | null>(null);
  const [day, setDay] = useState<number | null>(null);
  const [year, setYear] = useState<number | null>(null);
  const [designation, setDesignation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const dateToday = moment(date).format("DD-MM-YYYY");

  const fetchData = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(
        `http://api.aladhan.com/v1/gToH/${dateToday}`
      );
      const data: HijriData = await response.json();
      setData(data);
      setMonth(data?.data?.hijri?.month?.en);
      setDay(data?.data?.hijri?.day);
      setYear(data?.data?.hijri?.year);
      setDesignation(data?.data?.hijri?.designation?.abbreviated);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setError(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [date]);

  const refetch = () => {
    setIsLoading(true);
    fetchData();
  };

  return {
    month,
    day,
    year,
    designation,
    data,
    refetch,
    isLoading,
    error,
  };
};

export default useGetDateHijri;
